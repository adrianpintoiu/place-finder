export class PlaceModel  {
    name: string;
    vicinity: string;
    location: google.maps.LatLng;
    photo: string;

    constructor(model?:PlaceModel){
        Object.assign(this, model)
    }
 }
 