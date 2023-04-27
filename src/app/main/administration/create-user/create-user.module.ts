import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateUserComponent } from './create-user.component';
import { Routes } from '@angular/router';

const appRoutes: Routes = [
  {
      path: "**",
      component: CreateUserComponent
  },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CreateUserModule { }
