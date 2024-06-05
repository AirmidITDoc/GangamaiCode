import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
 
const appRoutes: Routes = [ 
  {
    path:"emergencylist", 
    loadChildren :() =>import("./emergency-list/emergency-list.module").then ((m)=>m.EmergencyListModule),
  },
];

@NgModule({
  declarations: [ ],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})

export class EmergencymanagementModule { }
