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
import { PrescriptionComponent, PrescriptiondetList, PrescriptionList } from '../prescription/prescription.component';
import { BedTransferComponent } from 'app/main/ipd/ip-search-list/bed-transfer/bed-transfer.component';
import { NewPrescriptionComponent } from '../prescription/new-prescription/new-prescription.component';
import { NewRequestforlabComponent } from '../requestforlabtest/new-requestforlab/new-requestforlab.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { LabReportsViewComponent } from './lab-reports-view/lab-reports-view.component';
import { RequestdetList, RequestList } from '../requestforlabtest/requestforlabtest.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

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
    'Temperature',
    'Pulse',
    'Respiration',
    'BP',
    'ArterialBloodPressure',
    'Peep',
    'Brady',
    'CVP',
    'PAPressureReading',
    'Apnea',
    'AbdominalGrith',
    'Desaturation',
    'SaturationWithO2',
    'SaturationWithoutO2',
    'PO2',
    'FIO2',
    'PFRation',
    'Addedby',
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
    'BSL',
    'UrineSugar',
    'ETTpressure',
    'UrineKetone',
    'Bodies',
    'IntakeMode',
    'ReportedToRMO' ,
    'Addedby',
    'Action'
  ]
  displayedColumnsLabReq: string[] = [ 
    'ReqDate', 
    'ReqTime',  
    'WardName',
    'RequestType',
    'IsOnFileTest', 
    'action',
  ]
  displayedColumnsIPprescription: string[] = [  
    'Vst_Adm_Date',
    'Date',
    'StoreName',
    'CompanyName', 
    'action',
  ] 
  dscPrescriptionDetList:string[] = [
    'Status',
    'ItemName',
    'Qty', 
  ]
  displayedColumnsLapReports: string[] = [
    'Date', 
    'TestName', 
    'PBillNo',
    'IsCompleted', 
  ]
  displayColumnsLapReqDet: string[] =[ 
    'IsStatus', 
    'IsComplted', 
    'ServiceName',
    'AddedByName',
    'BillingUser',
    'AddedByDate',
    'PBillNo'
  ]

  Sugarlevellist:any=[]
  SpinLoading:boolean=false;
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
  vitallist:any;
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
  dsrequestdetList=new MatTableDataSource<RequestdetList>();
  dsprescritionList = new MatTableDataSource<PrescriptionList>();
  dsprescriptiondetList = new MatTableDataSource<PrescriptiondetList>();
  
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
      'PatientName':this._ClinicalcareService.MyForm.get('PatientNameSearch').value.trim() + "%" || "%",
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
  onSearchClear() {
    this._ClinicalcareService.MyForm.get('PatientNameSearch').setValue('');
    this.getPatientListwardWise();
}
registerObj:any;
vIPDNo:any;
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
    this.vIPDNo = obj.IPDNo
    this.gettestList();
    this.getPrescriptionList();
    this.getRequesttList();
    this.getpainAssesmentList();
    this.getpainAssesmentWeightList();
    this.getRtrvVitallist();
    this.getRtrvSugarlevellist();
  }
  PainList:any=[];
  OnAddDailyWeight() {
    if (this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined) {
      this.toastr.warning('Please select Patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    }
    if (this.vDailyWeight == 0 || this.vDailyWeight == '' || this.vDailyWeight == null || this.vDailyWeight == undefined) {
      this.toastr.warning('Please enter weight', 'Warning !', {
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
  //pain assesment list 
  getpainAssesmentList() {
    var vdata = {
      AdmissionId: this.registerObj.AdmissionID || 0
    }
    console.log(vdata);
    this._ClinicalcareService.getpainAssesmentList(vdata).subscribe(data => {
      this.dsPainsAssessment.data = data as PainAssesList[];
      this.PainsAssessmentlist = data as PainAssesList[];
      console.log(this.dsPainsAssessment.data);
    })
  }
  PainsAssessmentlist:any=[];
  PainWeightlist:any=[];
  PaindeleteTableRow(event, element) { 
    let index = this.PainsAssessmentlist.indexOf(element);
    if (index >= 0) {
      this.PainsAssessmentlist.splice(index, 1);
      this.dsPainsAssessment.data = [];
      this.dsPainsAssessment.data = this.PainsAssessmentlist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    }); 
  }
  //pain weight assesment list 
  getpainAssesmentWeightList() {
    var vdata = {
      AdmissionId: this.registerObj.AdmissionID || 0
    }
    console.log(vdata);
    this._ClinicalcareService.getpainAssesmentWeightList(vdata).subscribe(data => {
      if(data){
        this.dsPainsAssessment2.data = data as PainAssesList[];
        this.checkDailyWeight = true;
        console.log(this.dsPainsAssessment2.data);
      }else{
        this.checkDailyWeight = false;
      }
   
    })
  }
  PWeightdeleteTableRow(event, element) { 
    let index = this.PainWeightlist.indexOf(element);
    if (index >= 0) {
      this.PainWeightlist.splice(index, 1);
      this.dsPainsAssessment2.data = [];
      this.dsPainsAssessment2.data = this.PainWeightlist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    }); 
  }
  //IP Prescription list 
  getPrescriptionList(){
    var vdata={
      FromDate: this.datePipe.transform(new Date(), "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      ToDate: this.datePipe.transform(new Date(), "yyyy-MM-dd 00:00:00.000") || '01/01/1900', //'09/01/2023',
      Reg_No: this.vRegNo|| 0 
    }
     //console.log(vdata);
    this._ClinicalcareService.getPrecriptionlistmain(vdata).subscribe(data =>{
        this.dsprescritionList.data = data as PrescriptionList[]; 
        //console.log(this.dsprescritionList.data);
    })
  }
  //IP Prescription Det list 
  getPrescriptiondetList(Param){
    //debugger
    var vdata={
      IPMedID: Param.IPMedID 
    }
    this._ClinicalcareService.getPrecriptiondetlist(vdata).subscribe(data =>{
      this.dsprescriptiondetList.data = data as PrescriptiondetList[]; 
       //console.log(this.dsprescriptiondetList.data);
    })
  }
  //lab request list
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
    //lab request det list
  getRequestdetList(Param){ 
    var vdata={
      RequestId: Param.RequestId
    }
    console.log(vdata);
    this._ClinicalcareService.getRequestdetList(vdata).subscribe(data =>{
      this.dsrequestdetList.data = data as RequestdetList[]; 
       console.log(this.dsrequestdetList.data);
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
 //Vital table data rtrv
 getRtrvVitallist(){
  this.sIsLoading = ''
  var vdata={
   "AdmissionId": this.registerObj.AdmissionID
  }
    console.log(vdata)
    this._ClinicalcareService.getRtrvVitallist(vdata).subscribe((data) =>{
    this.dsvitalsList.data = data as VitalsList[]; 
    this.vitallist = data as VitalsList[];
    console.log(this.dsvitalsList.data); 
  },
error =>{
  this.sIsLoading = ''; 
});
 }
 deleteVitalTableRow(element) { 
  let index = this.vitallist.indexOf(element);
  if (index >= 0) {
    this.vitallist.splice(index, 1);
    this.dsvitalsList.data = [];
    this.dsvitalsList.data = this.vitallist;
  }
  this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
    toastClass: 'tostr-tost custom-toast-success',
  });  
}
 //Sugar table data rtrv
 getRtrvSugarlevellist(){
  this.sIsLoading = ''
  var vdata={
   "AdmissionId": this.registerObj.AdmissionID
  }
    console.log(vdata)
    this._ClinicalcareService.getRtrvSugarlevellist(vdata).subscribe((data) =>{
    this.dsSugarTable.data = data as VitalsList[]; 
    this.Sugarlevellist = data as VitalsList[];
    console.log(this.dsSugarTable.data); 
  },
error =>{
  this.sIsLoading = ''; 
});
 }
 deleteSugarTableRow(element) { 
  let index = this.Sugarlevellist.indexOf(element);
  if (index >= 0) {
    this.Sugarlevellist.splice(index, 1);
    this.dsSugarTable.data = [];
    this.dsSugarTable.data = this.Sugarlevellist;
  }
  this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
    toastClass: 'tostr-tost custom-toast-success',
  });  
}
 painAssessmentId:any;
 //PainAssesment Save  
OnSavePainAsses(){
  const currentDate = new Date();
  const datePipe = new DatePipe('en-US');
  const formattedTime = datePipe.transform(currentDate, 'shortTime');
  const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

  if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
    this.toastr.warning('Please select Patient','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    }) 
    return;
   }

  if(!this.painAssessmentId){
  let saveNursingPainAssessmentObj={
    "painAssessmentDate": formattedDate,
    "painAssessmentTime": formattedTime,
    "admissionId": this.registerObj.AdmissionID || 0,
    "painAssessementValue": this.selectedPainLevel || 0,
    "createdBy": this._loggedService.currentUserValue.user.id || 0 
  }
  let submitData={
   "saveNursingPainAssessment":saveNursingPainAssessmentObj
  }
  console.log(submitData)
  this._ClinicalcareService.SavePainAssesment(submitData).subscribe(reponse =>{
    if(reponse){
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
      this.getpainAssesmentList();
    } else {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      }); 
    }
  }, error => {
    this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });  
  }
  else{
    let updateNursingPainAssessmentObj={
      "painAssessmentId": this.registerObj.painAssessmentId || 0,
      "painAssessmentDate": formattedDate,
      "painAssessmentTime": formattedTime,
      "admissionId": this.registerObj.AdmissionID || 0,
      "painAssessementValue": this.selectedPainLevel || 0,
      "modifiedBy": this._loggedService.currentUserValue.user.id || 0 
    }
    let submitData={
     "updateNursingPainAssessment":updateNursingPainAssessmentObj
    }
    console.log(submitData)
    this._ClinicalcareService.SavePainAssesment(submitData).subscribe(reponse =>{
      if(reponse){
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        }); 
        this.getpainAssesmentList();
      } else {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        }); 
      }
    }, error => {
      this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });  
  } 
}

 //Vital Save  
 OnSaveVital(){
  const currentDate = new Date();
  const datePipe = new DatePipe('en-US');
  const formattedTime = datePipe.transform(currentDate, 'shortTime');
  const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

  if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
    this.toastr.warning('Please select Patient','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    }) 
    return;
   }

  if(!this.painAssessmentId){ 
  let saveNursingVitalsParamObj={
    "vitalDate": formattedDate,
    "vitalTime": formattedTime,
    "admissionId":this.registerObj.AdmissionID || 0,
    "temperature": this._ClinicalcareService.VitalsForm.get('Temperature').value  || '',
    "pulse": this._ClinicalcareService.VitalsForm.get('Pulse').value  || '',
    "respiration":this._ClinicalcareService.VitalsForm.get('Respiraiton').value  || '',
    "bloodPresure": this._ClinicalcareService.VitalsForm.get('BloodPressure').value  || '',
    "cvp": this._ClinicalcareService.VitalsForm.get('CVP').value  || '',
    "peep": this._ClinicalcareService.VitalsForm.get('Peep').value  || '',
    "arterialBloodPressure": this._ClinicalcareService.VitalsForm.get('ArterialBloodPressure').value  || '',
    "paPressureReading": this._ClinicalcareService.VitalsForm.get('PressureReading').value  || '',
    "brady": this._ClinicalcareService.VitalsForm.get('Brady').value  || '',
    "apnea": this._ClinicalcareService.VitalsForm.get('Apnea').value  || '',
    "abdominalGrith": this._ClinicalcareService.VitalsForm.get('AbdominalGrith').value  || '',
    "desaturation": this._ClinicalcareService.VitalsForm.get('Desaturation').value  || '',
    "saturationWithO2": this._ClinicalcareService.VitalsForm.get('SaturationWitho2').value  || '',
    "saturationWithoutO2": this._ClinicalcareService.VitalsForm.get('SaturationWithOuto2').value  || '',
    "pO2": this._ClinicalcareService.VitalsForm.get('PO2').value  || '',
    "fiO2": this._ClinicalcareService.VitalsForm.get('Fio2').value  || '',
    "pfRation": this._ClinicalcareService.VitalsForm.get('PFRation').value  || '',
    "suctionType":  this._ClinicalcareService.VitalsForm.get('SuctionType').value,
    "createdBy": this._loggedService.currentUserValue.user.id || 0 
  }
  let submitData={
   "saveNursingVitalsParam":saveNursingVitalsParamObj
  }
  console.log(submitData)
  this._ClinicalcareService.SaveVitalInfo(submitData).subscribe(reponse =>{
    if(reponse){
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
      this.getRtrvVitallist();
    } else {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      }); 
    }
  }, error => {
    this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });  
  }
  else{ 
    let updateSaveNursingVitalsParamObj={
      "vitalId": 0,
      "admissionId":this.registerObj.AdmissionID || 0,
      "temperature": this._ClinicalcareService.VitalsForm.get('Temperature').value  || '',
      "pulse": this._ClinicalcareService.VitalsForm.get('Pulse').value  || '',
      "respiration":this._ClinicalcareService.VitalsForm.get('Respiraiton').value  || '',
      "bloodPresure": this._ClinicalcareService.VitalsForm.get('BloodPressure').value  || '',
      "cvp": this._ClinicalcareService.VitalsForm.get('CVP').value  || '',
      "peep": this._ClinicalcareService.VitalsForm.get('Peep').value  || '',
      "arterialBloodPressure": this._ClinicalcareService.VitalsForm.get('ArterialBloodPressure').value  || '',
      "paPressureReading": this._ClinicalcareService.VitalsForm.get('PressureReading').value  || '',
      "brady": this._ClinicalcareService.VitalsForm.get('Brady').value  || '',
      "apnea": this._ClinicalcareService.VitalsForm.get('Apnea').value  || '',
      "abdominalGrith": this._ClinicalcareService.VitalsForm.get('AbdominalGrith').value  || '',
      "desaturation": this._ClinicalcareService.VitalsForm.get('Desaturation').value  || '',
      "saturationWithO2": this._ClinicalcareService.VitalsForm.get('SaturationWitho2').value  || '',
      "saturationWithoutO2": this._ClinicalcareService.VitalsForm.get('SaturationWithOuto2').value  || '',
      "pO2": this._ClinicalcareService.VitalsForm.get('PO2').value  || '',
      "fiO2": this._ClinicalcareService.VitalsForm.get('Fio2').value  || '',
      "pfRation": this._ClinicalcareService.VitalsForm.get('PFRation').value  || '',
      "suctionType":  this._ClinicalcareService.VitalsForm.get('SuctionType').value,
      "modifiedBy": this._loggedService.currentUserValue.user.id || 0 
    }
    let submitData={
     "updateSaveNursingVitalsParam":updateSaveNursingVitalsParamObj
    }
    console.log(submitData)
    this._ClinicalcareService.UpdateVitalInfo(submitData).subscribe(reponse =>{
      if(reponse){
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        }); 
        this.getRtrvVitallist();
      } else {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        }); 
      }
    }, error => {
      this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });  
  } 
}
OnClosevital(){
 this._ClinicalcareService.VitalsForm.reset();
 this._ClinicalcareService.VitalsForm.get('SuctionType').setValue(0)
}
// sugar level save
OnsaveSugarlevel(){
  const currentDate = new Date();
  const datePipe = new DatePipe('en-US');
  const formattedTime = datePipe.transform(currentDate, 'shortTime');
  const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

  if(this.vRegNo == 0 || this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined){
    this.toastr.warning('Please select Patient','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    }) 
    return;
   }

  if(!this.painAssessmentId){  
  let saveNursingSugarLevelParamsObj={
    "entryDate": formattedDate,
    "entryTime": formattedTime,
    "admissionId":this.registerObj.AdmissionID || 0, 
    "bsl":  this._ClinicalcareService.SugarForm.get('BSL').value || '',
    "urineSugar": this._ClinicalcareService.SugarForm.get('UnirSugar').value || '',
    "ettPressure":this._ClinicalcareService.SugarForm.get('ETTPressure').value || '',
    "urineKetone": this._ClinicalcareService.SugarForm.get('UrineKeotne').value || '',
    "bodies": this._ClinicalcareService.SugarForm.get('Bodies').value || '',
    "intakeMode": 0,
    "reportedToRMO": this._ClinicalcareService.SugarForm.get('RepotetoRMO').value || '',
    "createdBy": this._loggedService.currentUserValue.user.id || 0 
  }
  let submitData={
   "saveNursingSugarLevelParams":saveNursingSugarLevelParamsObj
  }
  console.log(submitData)
  this._ClinicalcareService.SaveSugarlevel(submitData).subscribe(reponse =>{
    if(reponse){
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
      this.getRtrvSugarlevellist();
    } else {
      this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      }); 
    }
  }, error => {
    this.toastr.error('Record Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });  
  }
  else{ 
    let updateNursingSugarLevelParamsObj={ 
    "id": 0,
    "entryDate": formattedDate,
    "entryTime": formattedTime,
    "admissionId":this.registerObj.AdmissionID || 0, 
    "bsl":  this._ClinicalcareService.SugarForm.get('BSL').value || '',
    "urineSugar": this._ClinicalcareService.SugarForm.get('UnirSugar').value || '',
    "ettPressure":this._ClinicalcareService.SugarForm.get('ETTPressure').value || '',
    "urineKetone": this._ClinicalcareService.SugarForm.get('UrineKeotne').value || '',
    "bodies": this._ClinicalcareService.SugarForm.get('Bodies').value || '',
    "intakeMode": 0,
    "reportedToRMO": this._ClinicalcareService.SugarForm.get('RepotetoRMO').value || '', 
    "modifiedBy": this._loggedService.currentUserValue.user.id || 0 
    }
    let submitData={
     "updateNursingSugarLevelParams":updateNursingSugarLevelParamsObj
    }
    console.log(submitData)
    this._ClinicalcareService.UpdateSugarlevel(submitData).subscribe(reponse =>{
      if(reponse){
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        }); 
        this.getRtrvSugarlevellist();
      } else {
        this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        }); 
      }
    }, error => {
      this.toastr.error('Record Data not Updated !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });  
  } 
}
OnCloseSugar(){
 this._ClinicalcareService.VitalsForm.reset();
 this._ClinicalcareService.VitalsForm.get('SuctionType').setValue(0)
}










chkweightvalidation(){
  if(this.vDailyWeight > 200){ 
    this.toastr.warning('Weight cannot be greather than 200 kg','Warning !',{
      toastClass: 'tostr-tost custom-toast-warning',
    });
    this.vDailyWeight = '';
  }
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
    this.getPrescriptionList();
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
    this.getRequesttList();
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

  //reports section ///////////////////////////////////////////

  LabDataList:any=[];
  LabReportView(contact) {
    console.log(contact) 

    if(contact.IsTemplateTest == '1'){
      this._ClinicalcareService.getPathologyTempReport(contact.PathReportID,contact.OP_IP_Type).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Pathology Template Report Viewer"
            }
          });
      });
    }
    else{
      this.LabDataList.push(
        {
          PathReportID :  contact.PathReportID, 
        });
        console.log(this.LabDataList)
      let pathologyDelete = [];
      this.LabDataList.forEach((element) => { 
          let pathologyDeleteObj = {};
          pathologyDeleteObj['pathReportId'] = element.PathReportID
          pathologyDelete.push(pathologyDeleteObj);
      });  
      let submitData = {
          "printInsert": pathologyDelete,
      };
      console.log(submitData);
      this._ClinicalcareService.PathPrintResultentryInsert(submitData).subscribe(response => {
          if (response) {
              this.viewgetPathologyTestReportPdf(contact.OPD_IPD_Type)
          }
      }); 
    } 
}

viewgetPathologyTestReportPdf(OPD_IP_Type ) { 
  setTimeout(() => {
      this.SpinLoading = true; 
      this._ClinicalcareService.getPathTestReport(OPD_IP_Type).subscribe(res => {
          const dialogRef = this._matDialog.open(PdfviewerComponent,
              {
                  maxWidth: "85vw",
                  height: '750px',
                  width: '100%',
                  data: {
                      base64: res["base64"] as string,
                      title: "pathology Test Report Viewer"
                  }
              });
          dialogRef.afterClosed().subscribe(result => { 
              this.SpinLoading = false;
          });
      });

  }, 100);
}
//ip prescription  report
viewgetIpprescriptionReportPdf(row) {
  debugger
  setTimeout(() => {
    this.SpinLoading =true;
  //  this.AdList=true;
  this._ClinicalcareService.getIpPrescriptionview(
    row.IPMedID,row.OPD_IPD_Type
    
  ).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "95vw",
        height: '850px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "IP Prescription Viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.SpinLoading = false;
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.SpinLoading = false;
      });
  });
 
  },100);
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
  PainAssessmentDate: any;
  PainAssessmentTime: any;
  PainAssessementValue: any;
  Employeename: string; 
  CreatedDate:any;
  CreatedBy:any;
  ModifiedBy:any;
  PatWeightValue:any;
  PatWeightDate:any;
  PatWeightTime:any;

  constructor(PainAssesList) {
    { 
      this.PainAssessmentDate = PainAssesList.PainAssessmentDate || 0;
      this.PainAssessmentTime = PainAssesList.PainAssessmentTime || 0;
      this.PainAssessementValue = PainAssesList.PainAssessementValue || 0;
      this.Employeename = PainAssesList.Employeename || ""; 
      this.CreatedDate = PainAssesList.CreatedDate || 0;
      this.PatWeightValue = PainAssesList.PatWeightValue || 0;
      this.PatWeightDate = PainAssesList.PatWeightDate || 0;
      this.PatWeightTime = PainAssesList.PatWeightTime || 0;
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

