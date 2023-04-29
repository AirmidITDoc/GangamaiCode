import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpSearchListComponent } from './ip-search-list.component';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '**',
      component: IpSearchListComponent,
  },
];

@NgModule({
  declarations: [IpSearchListComponent],
  imports: [
    CommonModule
  ]
})
export class IpSearchListModule { }
