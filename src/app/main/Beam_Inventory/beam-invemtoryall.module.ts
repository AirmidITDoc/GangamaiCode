import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EditBeamInwardComponent } from './edit-beam-inward/edit-beam-inward.component';


const appRoutes: Routes = [

 
  {
      path: "BeamInward",
      loadChildren: () => import("./beam-inward/beam-inward.module").then((m) => m.BeamInwardModule),
          
  },
 

  

];
@NgModule({
  declarations: [],
  imports: [
      RouterModule.forChild(appRoutes),
  ]
})
export class BeamInvemtoryallModule { }
