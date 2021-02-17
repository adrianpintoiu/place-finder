import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapModuleRoutingModule } from './map-module-routing.module';
import { MapComponent } from './map/map.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MapSearchFormComponent } from './map/components/map-search-form/map-search-form.component';


@NgModule({
  declarations: [
    MapComponent,
    MapSearchFormComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    MapModuleRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MapModuleModule { }
