import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IpdEMRComponent } from './ipd-emr.component';
import { MatIconModule } from '@angular/material/icon';

// const routes: Routes = [
//     {
//         path: "**",
//         component: IpdEMRComponent,
//     },
// ];

const routes: Routes = [
    {
        path: "**",
        component: IpdEMRComponent,
    },
];

@NgModule({
  declarations: [
    IpdEMRComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatIconModule
  ],
  providers: []
})
export class IpdEMRModule { }
