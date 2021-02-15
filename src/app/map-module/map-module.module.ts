import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapModuleRoutingModule } from './map-module-routing.module';
import { MapComponent } from './map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
  declarations: [MapComponent],
  imports: [
    CommonModule,
    GoogleMapsModule,
    MapModuleRoutingModule
  ]
})
export class MapModuleModule { }
