import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MapCategoryEnum } from 'src/app/map-module/enum/map-categories.enum';
import { MapCategory } from 'src/app/map-module/models/category.interface';

@Component({
  selector: 'app-map-search-form',
  templateUrl: './map-search-form.component.html',
  styleUrls: ['./map-search-form.component.scss']
})
export class MapSearchFormComponent implements OnInit {
  @ViewChild("locationInput", { static: true }) locationInput: ElementRef<HTMLInputElement>;
  @Output('categoryValueEvent') categoryValueEvent: EventEmitter<MapCategoryEnum> = new EventEmitter();
  @Output('inputLocationValueEvent') inputLocationValueEvent: EventEmitter<ElementRef<HTMLInputElement>> = new EventEmitter();
  public mapLocationForm: FormGroup;
  categories: MapCategory[] = [
    {value: MapCategoryEnum.Restaurant, viewValue: MapCategoryEnum.Restaurant},
    {value: MapCategoryEnum.Hotel, viewValue: MapCategoryEnum.Hotel},
    {value: MapCategoryEnum.Bank, viewValue: MapCategoryEnum.Bank}
  ]; 

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.generateLocationForm();
    this.mapLocationForm.valueChanges.pipe(debounceTime(0), distinctUntilChanged())
      .subscribe(query => {
        if (!query) {
          console.info("Please insert a location");
          return;
        }
        this.inputLocationValueEvent.next(this.locationInput);
      });
  }

  generateLocationForm(): void {
    this.mapLocationForm = this.formBuilder.group({
      location: new FormControl(''),
      selectCategory: new FormControl(''),
    });
  }

  onCategoryChange(e: MatSelectChange): void {
    this.categoryValueEvent.next(e.value);
  }

  resetForm(): void{
    this.mapLocationForm.reset();
  }
}
