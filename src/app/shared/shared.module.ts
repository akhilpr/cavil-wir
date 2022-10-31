import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { OnlyNumberDirective } from './directives/only-number.directive';
const sharedModule = [CommonModule, FormsModule, MaterialModule, ReactiveFormsModule, OnlyNumberDirective]

@NgModule({
  declarations: [OnlyNumberDirective],
  imports: [],
  exports: [sharedModule]
})
export class SharedModule { }
