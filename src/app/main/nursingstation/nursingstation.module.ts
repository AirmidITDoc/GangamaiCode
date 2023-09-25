import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PrescriptionComponent } from './prescription/prescription.component';
import { NewPrescriptionComponent } from './prescription/new-prescription/new-prescription.component';
import { DoctorNoteComponent } from './doctor-note/doctor-note.component';
import { NursingNoteComponent } from './nursing-note/nursing-note.component';


const approtes: Routes = [
{
  path: "bedtransfer",
  loadChildren: () => import("./bed-transfer/bed-transfer.module").then((m)=>m.BedTransferModule), 
  
},
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
  loadChildren: () => import("./lanrequest-pathradio/labrequest.module").then((m)=>m.LabrequestModule), 
},


{
  path: "dialysis",
  loadChildren: () => import("./dialysis/dialysis.module").then((m)=>m.DialysisModule), 
},
// {
//   path:"dialysissms",
//   loadChildren: () => import("./dialysis-sms/dialysis-sms.module").then((m)=>m.DialysisSmsModule), 
// },
{
  path:"patientrefvisit",
  loadChildren: () => import("./patient-vist/patientvisit.module").then((m)=>m.PatientvisitModule), 
},
// {
//   path:"multiplesms",
//   loadChildren: () => import("./send-multiple-sms/send-multiple-sms.module").then((m)=>m.SendMultipleSmsModule), 
// },

{
  path: "pharmacysummary",
  loadChildren: () => import("./pahrmacy-summary/pharmacy-summary.module").then((m)=>m.PharmacySummaryModule), 
},
{
  path:"patientwisematerialconsumption",
  loadChildren: () => import("./patient-wise-materialconsumption/patientwise-material-consumption.module").then((m)=>m.PatientwiseMaterialConsumptionModule), 
},
{
  path:"doctornote",
  loadChildren: () => import("./doctor-note/doctor-note.module").then((m)=>m.DoctorNoteModule), 
},
{
  path:"nursingnote",
  loadChildren: () => import("./nursing-note/nursing-note.module").then((m)=>m.NursingNoteModule), 
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
  declarations: [
],
  imports: [
    RouterModule.forChild(approtes),
  ]
})
export class NursingstationModule { }
