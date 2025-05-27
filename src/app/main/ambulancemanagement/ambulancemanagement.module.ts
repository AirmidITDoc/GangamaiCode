import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
const appRoutes: Routes = [ 
  {
    path:"ambulancelist", 
    loadChildren :() =>import("./ambulance-list/ambulance-list.module").then ((m)=>m.AmbulanceListModule),
  },
];

@NgModule({
  declarations: [ ],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})

export class AmbulancemanagementModule { }
