import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MapCategoryEnum } from "../enum/map-categories.enum";
import { PlaceModel } from "../models/place-model";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild("mapElement", { static: true }) mapElement: ElementRef;
  @ViewChild("map", { static: true }) map: google.maps.Map;
  places: PlaceModel[] = [];
  categorySearch: MapCategoryEnum;
  markers: google.maps.Marker[] = [];
  options = {
    strictBounds: false,
    types: ["establishment"],
  } as google.maps.places.AutocompleteOptions;
  oldInfoWindow: google.maps.InfoWindow = new google.maps.InfoWindow;
  constructor() { }

  onCategoryValueEvent(event: MapCategoryEnum): void {
    this.categorySearch = event;
    this.places = [];
    this.clearAllMarkers();
    this.nearbySearch(this.categorySearch, this.map.getCenter());
  }

  onInputLocationValueEvent(event: ElementRef<HTMLInputElement>): void {
    this.places = [];
    this.clearAllMarkers();
    this.searchLocation(event);
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((location) => {
      this.map = new google.maps.Map(this.mapElement.nativeElement, {
        center: { lat: location.coords.latitude, lng: location.coords.longitude },
        zoom: 15
      });
      this.map.addListener('dragend', () => {
        if (this.categorySearch) {
          this.nearbySearch(this.categorySearch, this.map.getCenter());
        }
      });
    }, (error) => {
      console.info('Cannot find your location', error);
    });
  }

  nearbySearch(value: MapCategoryEnum, center: google.maps.LatLng): void {
    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: { lat: center.lat(), lng: center.lng() },
      radius: 2000,
      type: value
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        this.places = this.formatPlaces(results);
        this.createMarkers(results);
      }
    });
  }

  clearAllMarkers(): void {
    this.markers.forEach((marker) => {
      marker.setMap(null);
    });
    this.markers = [];
  }

  createMarkers(places: google.maps.places.PlaceResult[]) {
    if (!places) {
      return;
    }
    places.forEach((item: google.maps.places.PlaceResult) => {
      if (!item.geometry?.location) {
        return;
      }
      // Create marker
      const marker = new google.maps.Marker({
        map: this.map,
        position: item.geometry.location,
      });
      this.markers.push(marker);
      marker.addListener("mouseover", () => {
        const infowindow = new google.maps.InfoWindow();
        if (item.place_id) {
          const service = new google.maps.places.PlacesService(this.map);
          service.getDetails({ placeId: item.place_id }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              infowindow.setContent([
                place.name,
                place.formatted_address,
                place.website,
                place.rating,
                place.formatted_phone_number].join("<br />"));
            }
          });
          if (this.oldInfoWindow !== infowindow) {
            this.oldInfoWindow.close();
            infowindow.open(this.map, marker);
          }
        }

        this.oldInfoWindow = infowindow;
      });
    });
  }

  onCardClick(item: PlaceModel, index: number): void {
    if (item.location) {
      if (this.markers[index].getAnimation() != google.maps.Animation.BOUNCE) {
        this.markers[index].setAnimation(google.maps.Animation.BOUNCE);
        this.map.setCenter(item.location);
      }
    }
  }

  formatPlaces(items: google.maps.places.PlaceResult[]): PlaceModel[] {
    let places: PlaceModel[] = [];
    items.forEach((item: google.maps.places.PlaceResult) => {
      if (!item.geometry?.location) {
        return;
      }
      let place = new PlaceModel({
        name: item.name,
        vicinity: item.vicinity ? item.vicinity : '',
        photo: item.photos ? item.photos[0].getUrl({ 'maxWidth': 600, 'maxHeight': 400 }) : '',
        location: item.geometry.location
      });
      places.push(place);
    });
    return places;
  }


  searchLocation(value: ElementRef<HTMLInputElement>): void {
    const autocomplete = new google.maps.places.Autocomplete(value.nativeElement, this.options);
    autocomplete.bindTo("bounds", this.map);

    autocomplete.addListener('place_changed', () => {
      const place: google.maps.places.PlaceResult = autocomplete.getPlace();
      if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      this.map.setCenter(place.geometry.location);
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(14);
      }
      this.createMarkers([place]);
    });
  }
}
