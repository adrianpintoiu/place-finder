import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { GoogleMap } from "@angular/google-maps";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild("map", { static: true }) map: google.maps.Map;
  @ViewChild("locationInput", { static: true }) locationInput: ElementRef;
  center: google.maps.LatLngLiteral;
  mapOptions: google.maps.MapOptions = {
    scrollwheel: true,
    disableDoubleClickZoom: true,
    minZoom: 8,
  };


  options = {
    // componentRestrictions: { country: 'ro' },
    // fields: ["formatted_address", "geometry", "name", "photos"],
    // strictBounds: false,
    types: ["establishment"],
  } as google.maps.places.AutocompleteOptions;

  public mapLocation: FormGroup;


  constructor(private formBuilder: FormBuilder) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    });
   }

  ngOnInit(): void {

    this.generateLocationForm();
    setTimeout(() => {
      console.log("center", JSON.stringify(this.map.getCenter()));
    }, 0);

    const request = {
      location:  this.center,
      radius: '500',
      type: ['restaurant']
    };

    let options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch({
      location: this.center,
      radius: 1000,
      type: 'store'
    }, (results, status) => {
      console.log('results', results);
      console.log('status', status);
      if (status === google.maps.places.PlacesServiceStatus.OK){
          console.log('rs', results);
      }
    });


    // this.mapLocation.valueChanges.pipe(debounceTime(0), distinctUntilChanged())
    // .subscribe(term => {
    //   if (!term){
    //     console.info("Please insert a location");
    //     return;
    //   }
    //   this.searchLocation(term);
    // });

  }

  generateLocationForm(): void{
    this.mapLocation = this.formBuilder.group({
      location: new FormControl('', Validators.compose([Validators.required])),
    });
  }

  searchLocation(value: any): void{
    const inputElement = this.locationInput.nativeElement as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(inputElement, this.options);
    autocomplete.bindTo("bounds", this.map);
    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content") as HTMLElement;
    infowindow.setContent(infowindowContent);
    const marker = new google.maps.Marker({
      anchorPoint: new google.maps.Point(0, -29),
    });
    // const marker = new google.maps.Marker();


    autocomplete.addListener('place_changed', () => {
      infowindow.close();
      marker.setVisible(false);

      const place: google.maps.places.PlaceResult = autocomplete.getPlace();
      console.log('place', place);
      if (!place.geometry || !place.geometry.location) {
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }
      if (place.geometry.viewport) {
        this.map.fitBounds(place.geometry.viewport);
      } else {
        this.map.setCenter(place.geometry.location);
        this.map.setZoom(14);
      }
      marker.setPosition(place.geometry.location);
      marker.setVisible(true);
      // infowindow.setContent('fsafa');
      // infowindow.open(this.map, marker);
      // infowindowContent.children["place-name"].textContent = place.name;
      // infowindowContent.children["place-address"].textContent =
      //   place.formatted_address;
      // infowindow.open(this.map, marker);

    });

  }


}
