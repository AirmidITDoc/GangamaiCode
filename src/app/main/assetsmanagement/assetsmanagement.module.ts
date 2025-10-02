import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FARegistrationComponent } from './fa-registration/fa-registration.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [    
  {
      path: "FAregistration",
       loadChildren: () => import("./fa-registration/fa-registration.module").then((m) => m.FARegistrationModule),
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(appRoutes),
  ]
})
export class AssetsmanagementModule { }
