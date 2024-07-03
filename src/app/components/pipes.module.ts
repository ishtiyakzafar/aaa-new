import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { NumberformatPipe } from '../helpers/numberformat.pipe';


@NgModule({
  declarations:[NumberformatPipe], 
  imports:[CommonModule],
  exports:[NumberformatPipe] 
})

export class NumberFormatPipe{}