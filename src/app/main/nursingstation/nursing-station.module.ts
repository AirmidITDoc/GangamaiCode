import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { RequestLabComponent } from './request-lab/request-lab.component';
import { BedTransferComponent } from './bed-transfer/bed-transfer.component';
import { DoctorNoteComponent } from './doctor-note/doctor-note.component';
import { DialysisSMSComponent } from './dialysis-sms/dialysis-sms.component';
import { PatientWiseMaterialConsumptionComponent } from './patient-wise-material-consumption/patient-wise-material-consumption.component';
import { SendMultipleSMSComponent } from './send-multiple-sms/send-multiple-sms.component';

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
    loadChildren: () => import("./request-lab/request-lab.module").then((m)=>m.RequestLabModule), 
  },
  {
    path:"doctornote",
    loadChildren: () => import("./doctor-note/doctor-note.module").then((m)=>m.DoctorNoteModule), 
  },
  {
    path:"dialysis",
    loadChildren: () => import("./dialysis/dialysis.module").then((m)=>m.DialysisModule), 
  },
  {
    path:"dialysissms",
    loadChildren: () => import("./dialysis-sms/dialysis-sms.module").then((m)=>m.DialysisSMSModule), 
  },
  {
    path:"patientrefvisit",
    loadChildren: () => import("./patient-ref-visit/patient-ref-visit.module").then((m)=>m.PatientRefVisitModule), 
  },
  // {
  //   path:"sendmultiplesms",
  //   loadChildren: () => import("./send-multiple-sms/send-multiple-sms.module").then((m)=>m.SendMultipleSMSModule), 
  // },
  {
    path:"pharmacysummary",
    loadChildren: () => import("./pharmacy-summary/pharmacy-summary.module").then((m)=>m.PharmacySummaryModule), 
  },
  {
    path:"patientwisematerialconsumption",
    loadChildren: () => import("./patient-wise-material-consumption/patient-wise-material-consumption.module").then((m)=>m.PatientWiseMaterialConsumptionModule), 
  },
  {
    path:"nursingnote",
    loadChildren: () => import("./nursing-note/nursing-note.module").then((m)=>m.NursingNoteModule), 
  },
  ];

@NgModule({
  declarations: [DialysisSMSComponent, PatientWiseMaterialConsumptionComponent, SendMultipleSMSComponent],
  imports: [
    RouterModule.forChild(approtes),
    CommonModule
  ]
})
export class NursingStationModule { }


