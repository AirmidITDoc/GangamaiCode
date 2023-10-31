import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TallyInterfaceComponent } from './tally-interface.component';


const routes: Routes = [
  {
      path:"**",
      component: TallyInterfaceComponent,
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
    CommonModule
  ]
})
export class TallyInterfaceModule { }
