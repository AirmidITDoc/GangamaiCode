import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ClinicalCareChartService } from './clinical-care-chart.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DoctornoteComponent } from '../doctornote/doctornote/doctornote.component';
import { NursingnoteComponent } from '../nursingnote/nursingnote/nursingnote.component';
import { patientinfo } from '../Patientwisematerialconsumption/new-patientwise-materialconsumption/new-patientwise-materialconsumption.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { error } from 'console';
import { MatSliderChange } from '@angular/material/slider';
import { PhlebitisScoreComponent } from './phlebitis-score/phlebitis-score.component';
import { MedicationErrorComponent } from './medication-error/medication-error.component';
import { DischargeSummaryComponent } from 'app/main/ipd/ip-search-list/discharge-summary/discharge-summary.component';
import { PrescriptionComponent } from '../prescription/prescription.component';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { NewPrescriptionComponent } from '../prescription/new-prescription/new-prescription.component';
import { NewRequestforlabComponent } from '../requestforlabtest/new-requestforlab/new-requestforlab.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { LabReportsViewComponent } from './lab-reports-view/lab-reports-view.component';
import { RequestList } from '../requestforlabtest/requestforlabtest.component';

@Component({
  selector: 'app-clinical-care-chart',
  templateUrl: './clinical-care-chart.component.html',
  styleUrls: ['./clinical-care-chart.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class ClinicalCareChartComponent implements OnInit {
  displayedColumns: string[] = [
    'patientId',
    'PatientName' 
  ]
  displayedPainAsse: string[] = [
    'givendate',
    'giventime',
    'PainAssess',
    'Employeename',
    'Action'
  ]
  displayedPainAsse2: string[] = [
    'givendate', 
    'Employeename',
    'PainAssess',
    'Action'
  ]
  displayedVitals: string[] = [
    'date',
    'time',
    'Temperature',
    'Pulse',
    'Respiration',
    'BP',
    'MewaScore',
    'AVPU',
    'TakenBy',
    'CVP',
    'Action'
  ]
  displayedInOutput: string[] = [
    'Date',
    'Time',
    'IV',
    'Infusions',
    'Boluses',
    'Peroral',
    'Perrt',
    'Perjt',
    'IntakeOther',
    'Urine',
    'Drange',
    'Action'
  ]
  displayedOxygen: string[] = [
    'Date',
    'Time',
    'IV',
    'Infusions',
    'Boluses',
    'Peroral',
    'Perrt',
    'Perjt',
    'IntakeOther',
    'Urine',
    'Drange',
    'Action'
  ]
  displayedSugar: string[] = [
    'Date',
    'Time',
    'IV',
    'Infusions',
    'Boluses',
    'Peroral', 
    'Action'
  ]
  displayedColumnsLabReq: string[] = [ 
    'RegNo', 
    'PatientName',  
    'WardName',
    'RequestType',
    'IsOnFileTest', 
    'action',
  ]
  displayedColumnsLapReports: string[] = [
    'Date', 
    'TestName', 
    'PBillNo',
    'IsCompleted', 
  ]
  isLoading: String = '';
  sIsLoading: string = ""; 
  WardList:any=[];
  isRegIdSelected:boolean=false;
  //screenFromString:'fromdate-form';
  screenFromString1 = 'admission-form';
  screenFromString = 'admission-form';
  dateTimeObj:any;
  isWardNameSelected : boolean=false; 
  wardListfilteredOptions: Observable<string[]>;
  vWardId:any;
  checkDailyWeight:boolean=false;
  vDepartmentName:any;
  vpatientName:any;
  vDoctorname:any;
  vAgeYear:any;
  vAgeDay:any;
  vAgeMonth:any;
  vRegNo:any;
  vDailyWeight:any;
  painLevel:any;
  additionalNotes:any;
  painLocation:any;
  
  currentDate = new Date(); 

  dsClinicalcarePatient = new MatTableDataSource<PatientList>();
  dsPainsAssessment =new MatTableDataSource<PainAssesList>();
  dsPainsAssessment2 =new MatTableDataSource<PainAssesList>();
  dsvitalsList =new MatTableDataSource<VitalsList>();
  dsInputOutTable = new MatTableDataSource<INputOutputList>();
  dsOxygenTable = new MatTableDataSource<INputOutputList>();
  dsSugarTable = new MatTableDataSource<INputOutputList>();
  dsrequestList = new MatTableDataSource<RequestList>();
  datasource = new MatTableDataSource<LabtestList>();
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('wardpaginator', { static: true }) public wardpaginator: MatPaginator;
  @ViewChild('Outputpaginator', { static: true }) public Outputpaginator: MatPaginator; 
  
  constructor(
    public _ClinicalcareService:ClinicalCareChartService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored
  ) { } 
 
  ngOnInit(): void {
    this.getwardList();
    this.getPatientListwardWise(); 
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSelectedObjReg(){
    
  }
  selectedPainLevel: number; 
  onSliderChange(event: MatSliderChange) {
    this.selectedPainLevel = event.value;
    console.log(this.selectedPainLevel)
  }
  getEmoji(painLevel: number): string {
  // Map pain levels to corresponding emojis
  const emojiMap = {
    0: '&#x1F600;', // Neutral face
    1: '&#x1F600;', // Slightly frowning face
    2: '&#x1F60A;',
    3: '&#x1F60A;',
    4: '&#x1F641;',
    5: '&#x1F641;',
    6: '&#x1F612;',
    7: '&#x1F612;',
    8: '&#x1F620;',
    9: '&#x1F620;',
    10:'&#x1F629;' // Loudly crying face
  };

  return emojiMap[painLevel];
}
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }
  getwardList(){
    this._ClinicalcareService.getWardList().subscribe((data) =>{
      this.WardList = data;
      console.log(this.WardList)
      this.wardListfilteredOptions = this._ClinicalcareService.MyForm.get('WardName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterWardname(value) : this.WardList.slice()),
      ); 
    });
  }
  private _filterWardname(value: any): string[] {
    if (value) {
      const filterValue = value && value.WardName ? value.WardName.toLowerCase() : value.toLowerCase();
      return this.WardList.filter(option => option.WardName.toLowerCase().includes(filterValue));
    }
  } 
  getOptionTextWardName(option) {
    if (!option) return '';
    return option.WardName ;
  }
  getSelectedObjward(obj) {
    this.vWardId = obj.WardId  
    this.getPatientListwardWise();
  } 
  getwardWisePatList(){
    this._ClinicalcareService.MyForm.get('WardName').setValue('');
      this.vWardId = '';
      this.getPatientListwardWise(); 
  }
  getPatientListwardWise(){
   this.sIsLoading = ''
    var vdata={
      'WardId':  this.vWardId || 0,
      'DoctorId': 0
    }
    console.log(vdata)
    this._ClinicalcareService.getPatientList(vdata).subscribe((data) =>{
      this.dsClinicalcarePatient.data = data as PatientList[];
      this.dsClinicalcarePatient.sort = this.sort;  
      this.dsClinicalcarePatient.paginator = this.wardpaginator; 
      console.log(this.dsClinicalcarePatient.data); 
    },
  error =>{
    this.sIsLoading = ''; 
  }); 
  }
registerObj:any;
  getpatientDet(obj){ 
    console.log(obj) 
    this.registerObj = obj;
    this.vpatientName = obj.PatientName;
    this.vDoctorname = obj.DoctorName;
    this.vAgeYear = obj.AgeYear;
    this.vDepartmentName = obj.DepartmentName
    this.vAgeMonth = obj.AgeMonth;
    this.vAgeDay =obj.AgeDay;
    this.vRegNo = obj.RegNo;
    this.getRequesttList();
    this.gettestList();
  }
  PainList:any=[];
  OnAdd() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    this.checkDailyWeight = true;
    this.PainList.push(
      {
        givendate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
        giventime: this.datePipe.transform(this.currentDate, 'shortTime'),
        Employeename: this.vpatientName,
        PainAssess: this.vDailyWeight
      });
    this.dsPainsAssessment2.data = this.PainList;
    this.vDailyWeight = '';
  }
  deleteTableRow(element) { 
      let index = this.PainList.indexOf(element);
      if (index >= 0) {
        this.PainList.splice(index, 1);
        this.dsPainsAssessment2.data = [];
        this.dsPainsAssessment2.data = this.PainList;
      }
      this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
        toastClass: 'tostr-tost custom-toast-success',
      });  
  }
  getRequesttList(){
    var vdata={
      FromDate: this.datePipe.transform(new Date(), "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(new Date(), "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this.vRegNo|| 0
    }
    console.log(vdata);
    this._ClinicalcareService.getRequesttList(vdata).subscribe(data =>{
      this.dsrequestList.data = data as RequestList[]; 
      console.log(this.dsrequestList.data);
    })
  }
//lab Report list
gettestList(){
  this.sIsLoading = ''
   var vdata={
    "AdmissionId": this.registerObj.AdmissionID,
    "OP_IP_Type ": 1
   }
   console.log(vdata)
   this._ClinicalcareService.getLabTestList(vdata).subscribe((data) =>{
     this.datasource.data = data as LabtestList[]; 
     console.log(this.datasource.data); 
   },
 error =>{
   this.sIsLoading = ''; 
 }); 
 }
  getDoctornote(){
   if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
    this.toastr.warning('Please select Patient','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    }) 
    return;
   }
   this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(DoctornoteComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%', 
        data: {
          Obj: this.registerObj 
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
    });
  }
  getNursingnote(){ 
    if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
      this.toastr.warning('Please select Patient','Warning !',{
        toastClass: 'tostr-tost custom-toast-warning',
      }) 
      return;
     }
     this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
      const dialogRef = this._matDialog.open(NursingnoteComponent,
        {
          maxWidth: "100%",
          height: '95%',
          width: '90%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result); 
      });  
  }
  getDischargeSummary(){ 
    if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
      this.toastr.warning('Please select Patient','Warning !',{
        toastClass: 'tostr-tost custom-toast-warning',
      }) 
      return;
     }
     this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(DischargeSummaryComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '90%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
    });  
}
getPriscription(){ 
  if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
    this.toastr.warning('Please select Patient','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    }) 
    return;
   }
   this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
  const dialogRef = this._matDialog.open(NewPrescriptionComponent,
    {
      maxWidth: "100%",
      height: '90%',
      width: '90%', 
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result); 
  });  
}
getbedTransfer(){ 
  if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
    this.toastr.warning('Please select Patient','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    }) 
    return;
   }
   this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
  //  this._IpSearchListService.populateForm(this.registerObj); 
  const dialogRef = this._matDialog.open(BedTransferComponent,
    {
      maxWidth: "100%",
      height: '90%',
      width: '90%', 
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result); 
  });  
}

getLabRequest(){ 
  if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
    this.toastr.warning('Please select Patient','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    }) 
    return;
   }
   this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
  const dialogRef = this._matDialog.open(NewRequestforlabComponent,
    {
      maxWidth: "100%",
      height: '90%',
      width: '90%', 
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result); 
  });  
}
  getPhlebitis(){
    if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
      this.toastr.warning('Please select Patient','Warning !',{
        toastClass: 'tostr-tost custom-toast-warning',
      }) 
      return;
     }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(PhlebitisScoreComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '90%', 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
    });
  }
  getMedicationReport(){
    if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
      this.toastr.warning('Please select Patient','Warning !',{
        toastClass: 'tostr-tost custom-toast-warning',
      }) 
      return;
     }
    this.advanceDataStored.storage = new AdmissionPersonlModel(this.registerObj);
    const dialogRef = this._matDialog.open(MedicationErrorComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '90%',  
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
    });
  }
  getLabReport(){
    if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
      this.toastr.warning('Please select Patient','Warning !',{
        toastClass: 'tostr-tost custom-toast-warning',
      }) 
      return;
     }
   // this.advanceDataStored.storage = new AdmissionPersonlModel();
    const dialogRef = this._matDialog.open(LabReportsViewComponent,
      {
       
        height: '85%',
        width: '80%',  
        data:{
          Obj:this.registerObj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result); 
    });
  }
}
export class PatientList {
  DoctorName: any;
  AgeYear: any;
  PatientName: string; 
  DepartmentName: string; 
  RegNo:any;

  constructor(PatientList) {
    {

      this.DoctorName = PatientList.DoctorName || 0;
      this.PatientName = PatientList.PatientName || "";
      this.DepartmentName = PatientList.DepartmentName || "";
      this.AgeYear = PatientList.AgeYear || 0; 
    }
  }
}
export class PainAssesList {
  givendate: any;
  giventime: any;
  PainAssess: any;
  Employeename: string; 

  constructor(PainAssesList) {
    {

      this.givendate = PainAssesList.givendate || 0;
      this.giventime = PainAssesList.giventime || 0;
      this.PainAssess = PainAssesList.PainAssess || 0;
      this.Employeename = PainAssesList.Employeename || ""; 
    }
  }
}
export class VitalsList {
  date: any;
  time: any;
  Temperature: any;
  Pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any; 
  CVP:any;
  constructor(VitalsList) {
    {

      this.date = VitalsList.date || 0;
      this.time = VitalsList.time || 0;
      this.Temperature = VitalsList.Temperature || 0;
      this.Pulse = VitalsList.Pulse || 0;
      this.Respiration = VitalsList.Respiration || 0;
      this.Temperature = VitalsList.Temperature || 0;
      this.BP = VitalsList.BP || 0;
      this.MewaScore = VitalsList.MewaScore || 0;
      this.AVPU = VitalsList.AVPU || 0;
      this.TakenBy = VitalsList.TakenBy || 0;  
      this.CVP = VitalsList.CVP || 0; 
    }
  }
}
export class INputOutputList {
  date: any;
  time: any;
  Temperature: any;
  Pulse: any;
  Respiration: any;
  PainAssess: any;
  BP: any;
  MewaScore: any;
  AVPU: any;
  TakenBy: any; 
  CVP:any;
  constructor(INputOutputList) {
    {

      this.date = INputOutputList.date || 0;
      this.time = INputOutputList.time || 0;
      this.Temperature = INputOutputList.Temperature || 0;
      this.Pulse = INputOutputList.Pulse || 0;
      this.Respiration = INputOutputList.Respiration || 0;
      this.Temperature = INputOutputList.Temperature || 0;
      this.BP = INputOutputList.BP || 0;
      this.MewaScore = INputOutputList.MewaScore || 0;
      this.AVPU = INputOutputList.AVPU || 0;
      this.TakenBy = INputOutputList.TakenBy || 0;  
      this.CVP = INputOutputList.CVP || 0; 
    }
  }
}
export class LabtestList{
  Date : any;
  IsCompleted : any;
  PBillNo : any
  Testname:any

  constructor(LabtestList){
    this.IsCompleted = LabtestList.IsCompleted || 0;
    this.Date = LabtestList.Date || 0;
    this.PBillNo = LabtestList.PBillNo || 0;
    this.Testname = LabtestList.Testname || '';
  }
}

