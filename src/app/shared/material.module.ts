import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [
        MatInputModule,
        MatButtonModule
    ],
    exports: [
        MatInputModule,
        MatButtonModule
    ],
  })
  export class MaterialModule {}
