import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dialysis',
  templateUrl: './dialysis.component.html',
  styleUrls: ['./dialysis.component.scss']
})
export class DialysisComponent implements OnInit {

  displayedColumns = [
    'Date',
    'Time',
    'Temperature',
    'Pulse',
    'Respiration',
    'BP',
    'MewsScore',
    'AVPU',
    'TakenBy',
    'cvp',
    'Arterial_bp',
    'PA_Prassure',
    'Abdominal',
    'Brady',
    'Apnea',
    'Desaturation',
  ];

  displayedColumns1 = [
    'Date',
    'Time',
    'BSL',
    'Urine',
    'UrinKetone',
    'Bodies',
    'InFormTo',
    'InformedBy',
    'Injuction',
    'Tablet',
    'GivenDate',
    'GivenTime',
    'GivenBy',
    'BSLId',
    'doseinj',
    'dosetab',
    'intakemode',
    'rmo',
  ];

  displayedColumns2 = [
    'Date',
    'Time',
    'Oral',
    'Tracheostomy',
    'Saturation_witho2',
    'Saturation_withouto2',
  ];

  displayedColumns3 = [
    'Date',
    'Time',
    'IV',
    'INFUSIONS',
    'BOLUSES',
    'PERORAL',
    'PERRT',
    'PERJT',
    'INTAKEOther',
    'URINE',
    'DRANGE',
    'Stool',
    'OUTTAKEOther',
    'IVDetails',
    // 'INFUSIONSDetails',
    'BOLUSESDetails',
    'PERORALDetails',
    'PERRTDetails',
    'PERJTDetails',
    'INTAKEOtherDetails',
    'UrinDetails',
    'DRANGEDetails',
    'StoolDetails',
    'OUTTAKEOtherDetails',
    'intakeid',
    'intakepd',
    'intakepdDetails',
  ];

  displayedColumns4 = [
    'AddedDate',
    'AddedTime',
    'UserName',
    'Message',
    'SpecialNote',
    'ordersheetLd',
    'ID',
    'DoctorId',
    'PatientId',
    'UserId',
    'AddimissionId',
  ];

  displayedColumns5 = [
    'Date',
    'ServiceName',
    'Rate',
    'Quantity',
    'TotalAmount',
    'NetAmount',
  ];

  displayedColumns6 = [
    'Actions',
    'ServiceName',
    'Quantity',
    'DoctorName',
  ];

  displayedColumns7 = [
    'GivenDateTime',
    'DateTime',
    'Temperature',
    'Pulse',
    'Respiration',
    'BP',
    'TakenBy',
    'TakenByName',
    'AddedBy',
    'UpdatedBy',
    'MewsScore',
    'CVP',
    'GCS',
    'AVPU',
    'Temprectal',
    'MeanArtirial',
    'Oxigenation',
    'Artirial',
    'GCSScore',
    'Serum',
    'Serumssodium',
    'SerumPotassium',
    'Hematocrit',
    'WhiteBloodCount',
    'eyeopening',
    'verbleresponce',
    'Motorresponce',
    'cronic',
    'TPRICUID',
    'AddimissionId',
  ];
  	
  displayedColumns8 = [
    'GivenDate',
    'GivenTime',
    'PainAssessment',
    'Date',
    'EmployeeName',
  ];

  dataSource = ELEMENT_DATA;
  dataSource1 = ELEMENT_DATA1;
  dataSource2 = ELEMENT_DATA2;
  dataSource3 = ELEMENT_DATA3;
  dataSource4 = ELEMENT_DATA4;
  dataSource5 = ELEMENT_DATA5;
  dataSource6 = ELEMENT_DATA6;
  dataSource7 = ELEMENT_DATA7;
  dataSource8 = ELEMENT_DATA8;

  constructor() { }

  ngOnInit(): void {
  }

}

export interface PeriodicElement {
  Date: number;
  Time:number;
  Temperature:number;
  Pulse:number;
  Respiration:number;
  BP:number;
  MewsScore:number;
  AVPU:number;
  TakenBy:number;
  cvp:number;
  Arterial_bp:number;
  PA_Prassure:number;
  Abdominal:number;
  Brady:number;
  Apnea:number;
  Desaturation:number;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
  {Date: 1, Time: 5246, Temperature: 1.0079, Pulse: 52468,Respiration:465, BP:45565, MewsScore:5464,AVPU:46543, TakenBy:465, cvp:55426, Arterial_bp:55426, PA_Prassure:55426, Abdominal :55426,  Brady:55426, Apnea:55426, Desaturation:55426},
];

export interface PeriodicElement1 {
  Date: number;
  Time:number;
  BSL:number;
  Urine:number;
  UrinKetone:number;
  Bodies:number;
  InFormTo:number;
  InformedBy:number;
  Injuction:number;
  Tablet:number;
  GivenDate:number;
  GivenTime:number;
  GivenBy:number;
  BSLId:number;
  doseinj:number;
  dosetab:number;
  intakemode:number;
  rmo:number;

}
const ELEMENT_DATA1: PeriodicElement1[] = [
  {Date: 1, Time: 5246, BSL: 1.0079, Urine: 52468,UrinKetone:465, Bodies:45565, InFormTo:5464,InformedBy:46543, Injuction:465, Tablet:55426, GivenDate:55426, GivenTime:55426, GivenBy :55426,  BSLId:55426, doseinj:55426, dosetab:55426, intakemode:55426, rmo:55426},
  {Date: 1, Time: 5246, BSL: 1.0079, Urine: 52468,UrinKetone:465, Bodies:45565, InFormTo:5464,InformedBy:46543, Injuction:465, Tablet:55426, GivenDate:55426, GivenTime:55426, GivenBy :55426,  BSLId:55426, doseinj:55426, dosetab:55426, intakemode:55426, rmo:55426},
  {Date: 1, Time: 5246, BSL: 1.0079, Urine: 52468,UrinKetone:465, Bodies:45565, InFormTo:5464,InformedBy:46543, Injuction:465, Tablet:55426, GivenDate:55426, GivenTime:55426, GivenBy :55426,  BSLId:55426, doseinj:55426, dosetab:55426, intakemode:55426, rmo:55426},
  {Date: 1, Time: 5246, BSL: 1.0079, Urine: 52468,UrinKetone:465, Bodies:45565, InFormTo:5464,InformedBy:46543, Injuction:465, Tablet:55426, GivenDate:55426, GivenTime:55426, GivenBy :55426,  BSLId:55426, doseinj:55426, dosetab:55426, intakemode:55426, rmo:55426},
];

export interface PeriodicElement2 {
  Date: number;
  Time:number;
  Oral:number;
  Tracheostomy:number;
  Saturation_witho2:number;
  Saturation_withouto2:number;
}
const ELEMENT_DATA2: PeriodicElement2[] = [
  {Date: 1, Time: 5246, Oral: 1.0079, Tracheostomy:465, Saturation_witho2:45565, Saturation_withouto2:96},
  {Date: 1, Time: 5246, Oral: 1.0079, Tracheostomy:465, Saturation_witho2:45565, Saturation_withouto2:96},
  {Date: 1, Time: 5246, Oral: 1.0079, Tracheostomy:465, Saturation_witho2:45565, Saturation_withouto2:96},
  {Date: 1, Time: 5246, Oral: 1.0079, Tracheostomy:465, Saturation_witho2:45565, Saturation_withouto2:96},
  {Date: 1, Time: 5246, Oral: 1.0079, Tracheostomy:465, Saturation_witho2:45565, Saturation_withouto2:96},
  {Date: 1, Time: 5246, Oral: 1.0079, Tracheostomy:465, Saturation_witho2:45565, Saturation_withouto2:96},
  {Date: 1, Time: 5246, Oral: 1.0079, Tracheostomy:465, Saturation_witho2:45565, Saturation_withouto2:96},
];

export interface PeriodicElement3 {
  Date:number;
  Time:number;
  IV:number;
  INFUSIONS:number;
  BOLUSES:number;
  PERORAL:number;
  PERRT:number;
  PERJT:number;
  INTAKEOther:number;
  URINE:number;
  DRANGE:number;
  Stool:number;
  OUTTAKEOther:number;
  IVDetails:number;
  // INFUSIONSDetails:number;
  BOLUSESDetails:number;
  PERORALDetails:number;
  PERRTDetails:number;
  PERJTDetails:number;
  INTAKEOtherDetails:number;
  UrinDetails:number;
  DRANGEDetails:number;
  StoolDetails:number;
  OUTTAKEOtherDetails:number;
  intakeid:number;
  intakepd:number;
  intakepdDetails:number;
}
const ELEMENT_DATA3: PeriodicElement3[] = [
  
{Date: 1, Time: 5246, IV: 1.0079, INFUSIONS:465, BOLUSES:45565, PERORAL:96,PERRT :2546,PERJT :2546, INTAKEOther:2546, URINE:2546, 
  DRANGE :2546,Stool :2546,  OUTTAKEOther:2546,  IVDetails:2546, BOLUSESDetails:2546, PERORALDetails:2546,PERRTDetails :2546, 
  PERJTDetails :2546, INTAKEOtherDetails:2546,   UrinDetails  :2546,DRANGEDetails :2546,  StoolDetails   :2546,OUTTAKEOtherDetails :2546,  
   intakeid:2546, intakepd:2546, intakepdDetails:5246},
 
   {Date: 1, Time: 5246, IV: 1.0079, INFUSIONS:465, BOLUSES:45565, PERORAL:96,PERRT :2546,PERJT :2546, INTAKEOther:2546, URINE:2546, 
    DRANGE :2546,Stool :2546,  OUTTAKEOther:2546,  IVDetails:2546, BOLUSESDetails:2546, PERORALDetails:2546,PERRTDetails :2546, 
    PERJTDetails :2546, INTAKEOtherDetails:2546,   UrinDetails  :2546,DRANGEDetails :2546,  StoolDetails   :2546,OUTTAKEOtherDetails :2546,  
     intakeid:2546, intakepd:2546, intakepdDetails:5246},
 
{Date: 1, Time: 5246, IV: 1.0079, INFUSIONS:465, BOLUSES:45565, PERORAL:96,PERRT :2546,PERJT :2546, INTAKEOther:2546, URINE:2546, 
 DRANGE :2546,Stool :2546,  OUTTAKEOther:2546,  IVDetails:2546, BOLUSESDetails:2546, PERORALDetails:2546,PERRTDetails :2546, 
 PERJTDetails :2546, INTAKEOtherDetails:2546,   UrinDetails  :2546,DRANGEDetails :2546,  StoolDetails   :2546,OUTTAKEOtherDetails :2546,  
 intakeid:2546, intakepd:2546, intakepdDetails:5246},

];

export interface PeriodicElement4 {
  AddedDate: number;
  AddedTime:number;
  UserName:number;
  Message:number;
  SpecialNote:number;
  ordersheetLd:number;
  ID:number;
  DoctorId:number;
  PatientId:number;
  UserId:number;
  AddimissionId:number;

}
const ELEMENT_DATA4: PeriodicElement4[] = [
  {AddedDate: 1, AddedTime: 5246, UserName: 1.0079, Message: 52468,SpecialNote:465, ordersheetLd:45565, ID:5464,DoctorId:46543, PatientId:465, UserId:55426, AddimissionId:55426, },
  {AddedDate: 1, AddedTime: 5246, UserName: 1.0079, Message: 52468,SpecialNote:465, ordersheetLd:45565, ID:5464,DoctorId:46543, PatientId:465, UserId:55426, AddimissionId:55426, },
  {AddedDate: 1, AddedTime: 5246, UserName: 1.0079, Message: 52468,SpecialNote:465, ordersheetLd:45565, ID:5464,DoctorId:46543, PatientId:465, UserId:55426, AddimissionId:55426, },
  {AddedDate: 1, AddedTime: 5246, UserName: 1.0079, Message: 52468,SpecialNote:465, ordersheetLd:45565, ID:5464,DoctorId:46543, PatientId:465, UserId:55426, AddimissionId:55426, },
  {AddedDate: 1, AddedTime: 5246, UserName: 1.0079, Message: 52468,SpecialNote:465, ordersheetLd:45565, ID:5464,DoctorId:46543, PatientId:465, UserId:55426, AddimissionId:55426, },
  {AddedDate: 1, AddedTime: 5246, UserName: 1.0079, Message: 52468,SpecialNote:465, ordersheetLd:45565, ID:5464,DoctorId:46543, PatientId:465, UserId:55426, AddimissionId:55426, },
];

export interface PeriodicElement5 {
  Date: number;
  ServiceName:number;
  Rate:number;
  Quantity:number;
  TotalAmount:number;
  NetAmount:number;
}
const ELEMENT_DATA5: PeriodicElement5[] = [
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
  {Date: 1, ServiceName: 5246, Rate: 1.0079, Quantity: 52468, TotalAmount:465,   NetAmount:5024698, },
];

export interface PeriodicElement6 {
  Actions: number;
  ServiceName:number;
  Quantity:number;
  DoctorName:number;
}
const ELEMENT_DATA6: PeriodicElement6[] = [
  {Actions: 1, ServiceName: 5246, Quantity: 52468, DoctorName:465, },
 
];

export interface PeriodicElement7 {
GivenDateTime: number;
DateTime: number;
Temperature: number;
Pulse: number;
Respiration: number;
BP: number;
TakenBy: number;
TakenByName: number;
AddedBy: number;
UpdatedBy: number;
MewsScore: number;
CVP: number;
GCS: number;
AVPU: number;
Temprectal: number;
MeanArtirial: number;
Oxigenation: number;
Artirial: number;
GCSScore: number;
Serum: number;
Serumssodium: number;
SerumPotassium: number;
Hematocrit: number;
WhiteBloodCount: number;
eyeopening: number;
verbleresponce: number;
Motorresponce: number;
cronic: number;
TPRICUID: number;
AddimissionId: number;
}
const ELEMENT_DATA7: PeriodicElement7[] = [
  {GivenDateTime: 1, DateTime: 5246, Temperature: 52468, Pulse:465, Respiration:465, BP:465, TakenBy:465, TakenByName:465,AddedBy:465,UpdatedBy:465,
    MewsScore:465,CVP:465,GCS:465,AVPU:465,Temprectal:465,MeanArtirial:465,Oxigenation:465, Artirial:465, GCSScore:465, Serum:465, Serumssodium:465, SerumPotassium:465,
    Hematocrit:465,WhiteBloodCount:465,eyeopening:465,verbleresponce:465,Motorresponce:465,cronic:465,TPRICUID:465,AddimissionId:465, },
    {GivenDateTime: 1, DateTime: 5246, Temperature: 52468, Pulse:465, Respiration:465, BP:465, TakenBy:465, TakenByName:465,AddedBy:465,UpdatedBy:465,
      MewsScore:465,CVP:465,GCS:465,AVPU:465,Temprectal:465,MeanArtirial:465,Oxigenation:465, Artirial:465, GCSScore:465, Serum:465, Serumssodium:465, SerumPotassium:465,
      Hematocrit:465,WhiteBloodCount:465,eyeopening:465,verbleresponce:465,Motorresponce:465,cronic:465,TPRICUID:465,AddimissionId:465, },
      {GivenDateTime: 1, DateTime: 5246, Temperature: 52468, Pulse:465, Respiration:465, BP:465, TakenBy:465, TakenByName:465,AddedBy:465,UpdatedBy:465,
        MewsScore:465,CVP:465,GCS:465,AVPU:465,Temprectal:465,MeanArtirial:465,Oxigenation:465, Artirial:465, GCSScore:465, Serum:465, Serumssodium:465, SerumPotassium:465,
        Hematocrit:465,WhiteBloodCount:465,eyeopening:465,verbleresponce:465,Motorresponce:465,cronic:465,TPRICUID:465,AddimissionId:465, },
        {GivenDateTime: 1, DateTime: 5246, Temperature: 52468, Pulse:465, Respiration:465, BP:465, TakenBy:465, TakenByName:465,AddedBy:465,UpdatedBy:465,
          MewsScore:465,CVP:465,GCS:465,AVPU:465,Temprectal:465,MeanArtirial:465,Oxigenation:465, Artirial:465, GCSScore:465, Serum:465, Serumssodium:465, SerumPotassium:465,
          Hematocrit:465,WhiteBloodCount:465,eyeopening:465,verbleresponce:465,Motorresponce:465,cronic:465,TPRICUID:465,AddimissionId:465, },
          {GivenDateTime: 1, DateTime: 5246, Temperature: 52468, Pulse:465, Respiration:465, BP:465, TakenBy:465, TakenByName:465,AddedBy:465,UpdatedBy:465,
            MewsScore:465,CVP:465,GCS:465,AVPU:465,Temprectal:465,MeanArtirial:465,Oxigenation:465, Artirial:465, GCSScore:465, Serum:465, Serumssodium:465, SerumPotassium:465,
            Hematocrit:465,WhiteBloodCount:465,eyeopening:465,verbleresponce:465,Motorresponce:465,cronic:465,TPRICUID:465,AddimissionId:465, },
 
];

export interface PeriodicElement8 {
  GivenDate: number;
  GivenTime:number;
  PainAssessment:number;
  Date:number;
  EmployeeName:number;
}
const ELEMENT_DATA8: PeriodicElement8[] = [
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
  {GivenDate: 1, GivenTime: 5246, PainAssessment: 52468, Date:465, EmployeeName:465, },
 
];
