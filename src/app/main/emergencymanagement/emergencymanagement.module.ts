import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 
const appRoutes: Routes = [ 
  {
    path:"emergencylist", 
    loadChildren :() =>import("./emergency/emergency.module").then ((m)=>m.EmergencyModule),
    // loadChildren :() =>import("./emergency-list/emergency-list.module").then ((m)=>m.EmergencyListModule),
  },
];

@NgModule({
  declarations: [],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})

export class EmergencymanagementModule { }
