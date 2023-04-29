import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IpBrowseListComponent } from './ip-browse-list.component';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '**',
      component: IpBrowseListComponent,
  },
];

@NgModule({
  declarations: [IpBrowseListComponent],
  imports: [
    CommonModule
  ]
})
export class IpBrowseListModule { }
