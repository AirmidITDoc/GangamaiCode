import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { ProducttypeMasterComponent } from './producttype-master.component';


const router: Routes=[
  {
    path:"**",
    component:ProducttypeMasterComponent,
  },
];
@NgModule({
  declarations: [ProducttypeMasterComponent],
  imports: [
    CommonModule
  ]
})
export class ProducttypeMasterModule { }
