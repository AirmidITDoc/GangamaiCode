import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MaterialConsumptionPatientwiseComponent } from './Patientwisematerialconsumption/material-consumption-patientwise/material-consumption-patientwise.component';
import { PatientRefVisitComponent } from './patient-ref-visit/patient-ref-visit.component';
  

const approtes: Routes = [
// {
//   path: "bedtransfer",
//   loadChildren: () => import("./bed-transfer/bed-transfer.module").then((m)=>m.BedTransferModule), 
  
// },
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


// {
//   path: "dialysis",
//   loadChildren: () => import("./dialysis/dialysis.module").then((m)=>m.DialysisModule), 
// },
// // {
// //   path:"dialysissms",
// //   loadChildren: () => import("./dialysis-sms/dialysis-sms.module").then((m)=>m.DialysisSmsModule), 
// // },
{
  path:"patientrefvisit",
  loadChildren: () => import("./patient-ref-visit/patientrefvisit.module").then((m)=>m.PatientrefvisitModule), 
},
// {
//   path:"multiplesms",
//   loadChildren: () => import("./send-multiple-sms/send-multiple-sms.module").then((m)=>m.SendMultipleSmsModule), 
// },

// {
//   path: "pharmacysummary",
//   loadChildren: () => import("./pahrmacy-summary/pharmacy-summary.module").then((m)=>m.PharmacySummaryModule), 
// },
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
  declarations: [  ],
  imports: [
    RouterModule.forChild(approtes),
  ]
})
export class NursingstationModule { }
