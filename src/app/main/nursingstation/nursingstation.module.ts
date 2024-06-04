import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialConsumptionPatientwiseComponent } from './Patientwisematerialconsumption/material-consumption-patientwise/material-consumption-patientwise.component';
import { PatientRefVisitComponent } from './patient-ref-visit/patient-ref-visit.component';
import { NursingBedtransferComponent } from './nursing-bedtransfer/nursing-bedtransfer.component';

  

const approtes: Routes = [

{
  path:"prescriptionreturn",
  loadChildren: () => import("./prescription-return/prescription-return.module").then((m)=>m.PrescriptionReturnModule), 
},
{
  path:"prescription",
  loadChildren: () => import("./prescription/prescription.module").then((m)=>m.PrescriptionModule), 
},
{
  path:"requestforlabtest",
  loadChildren: () => import("./requestforlabtest/requestforlabtest.module").then((m)=>m.RequestforlabtestModule), 
},


{
  path: "dialysis",
  loadChildren: () => import("./clinical-care-chart/clinical-care-chart.module").then((m)=>m.ClinicalCareChartModule), 
},
{
  path:"dialysissms",
  loadChildren: () => import("./consent/consent.module").then((m)=>m.ConsentModule), 
},
{
  path:"patientrefvisit",
  loadChildren: () => import("./patient-ref-visit/patientrefvisit.module").then((m)=>m.PatientrefvisitModule), 
},
{
  path:"bedtransfer",
  loadChildren: () => import("../ipd/ip-search-list/ip-searchlist.module").then((m)=>m.IPSearchlistModule), 
},
{
  path:"patientwisematerialconsumption",
  loadChildren: () => import("./Patientwisematerialconsumption/material-consumption.module").then((m)=>m.MaterialConsumptionModule), 
},
{
  path:"doctornote",
  loadChildren: () => import("./doctornote/doctornote/doctornote.module").then((m)=>m.DoctornoteModule), 
},
{
  path:"nursingnote",
  loadChildren: () => import("./nursingnote/nursingnote/nursingnote.module").then((m)=>m.NursingnoteModule), 
},

// {
//   path: "doctornote",
//   component:DoctorNoteComponent
// },
// {
//   path: "nursingnote",
//   component:NursingNoteComponent
// },

];
@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(approtes),
  ]
})
export class NursingstationModule { }
