import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdmissionComponent } from './admission.component';
import { Routes } from '@angular/router';

const routes: Routes = [
  {
      path: '**',
      component: AdmissionComponent,
  },
];

@NgModule({
  declarations: [AdmissionComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [
    AdmissionComponent,
]
})
export class AdmissionModule { }
