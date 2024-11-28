import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdvanceDataStored } from '../../advance';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { FeedbackService } from './feedback.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { MatSliderChange } from '@angular/material/slider';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-opip-feedback',
  templateUrl: './opip-feedback.component.html',
  styleUrls: ['./opip-feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
  
})
export class OPIPFeedbackComponent implements OnInit {

  Feedbackpatientform: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fiveFormGroup: FormGroup;
  sixFormGroup: FormGroup;
  Feedbackform: FormGroup;


  isLoading: String = '';
  sIsLoading: string = ""; 

  isWardNameSelected : boolean=false; 
  wardListfilteredOptions: Observable<string[]>;
  vWardId:any;
  WardList:any=[];
  PatientList:any=[];
  feedbackquest:any=[];
  registerObj1 = new PatientList({});
  vDepartmentName:any;
  vpatientName:any;
  vDoctorname:any;
  vAgeYear:any;
  vAgeDay:any;
  vAgeMonth:any;
  vRegNo:any;
  dateTimeObj: any;
  isRegIdSelected:boolean=false;
  dsPatientlist = new MatTableDataSource<PatientList>();
  selectedAdvanceObj: AdmissionPersonlModel;
  screenFromString = 'IP-billing';
  RegID:any=0;
  AdmissionID:any=0;
  OPD_IPD_Type:any=0;
  FeedbackResult:any;
  isEditable = false;
  opflag:boolean=true;
  ipflag:boolean=false;
  pharmaflag:boolean=false;

  
  vSelectedOption:any;
  OP_IP_Id: any = 0;
  OP_IPType: any = 2;
  RegId:any;
  vCondition:boolean=false;
  vConditionExt:boolean=false;
  vConditionIP:boolean=false;
  PatientListfilteredOptionsOP: any;
  PatientListfilteredOptionsIP: any;
  filteredOptions: any;
  noOptionFound: boolean = false;
  RegNo:any;
  IPDNo:any; 
  TariffName:any;
  CompanyName:any;
  Age:any;
  OPDNo:any;
  DoctorNamecheck:boolean=false;
  IPDNocheck:boolean=false;
  OPDNoCheck:boolean=false;
  PatientName:any;
  DoctorName:any;

@ViewChild('stepper') stepper: MatHorizontalStepper;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('wardpaginator', { static: true }) public wardpaginator: MatPaginator;
  @ViewChild('Outputpaginator', { static: true }) public Outputpaginator: MatPaginator; 
  displayedColumns: string[] = [
    'patientId',
    'PatientName' 
  ]  
  isLinear = false;


  constructor( public _FeedbackService:FeedbackService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    // private dialogRef: MatDialogRef<OPIPFeedbackComponent>,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      FeedbackResult:['']
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
    this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
    this.fiveFormGroup = this._formBuilder.group({
      fiveCtrl: ['', Validators.required]
    });
    this.sixFormGroup = this._formBuilder.group({
      sixCtrl: ['', Validators.required]
    });
    this.vSelectedOption = 'OP';
    //  this.vCondition = true


    this.getpatientsearchform();
    this.getfeedbackform();
    // this.getwardList();
    this.getfeedbackquestionList();
    // this.getPatientListwardWise(); 
    // if (this.advanceDataStored.storage) {
      
    //    this.selectedAdvanceObj = this.advanceDataStored.storage;
    //    this.RegID= this.selectedAdvanceObj.RegID; 
    //    this.AdmissionID= this.selectedAdvanceObj.AdmissionID; 
    //    this.OPD_IPD_Type= this.selectedAdvanceObj.opD_IPD_Type; 
    //       console.log( this.selectedAdvanceObj)
         
    //  }
  }


  getpatientsearchform() {
  this.Feedbackpatientform = this._formBuilder.group({
    PatientType: ['OP'],
    PatientName: '',
    RegID:'',
  });
}

getfeedbackform() {
  this.Feedbackform = this._formBuilder.group({
    // PatientType: ['OP'],
    // PatientName: '',
    // RegID:'',
  });
}


onChangePatientType(event) {
  debugger
  if (event.value == 'OP') {
    this.OP_IPType = 0;
    this.vSelectedOption = 'OP';
    // this.vCondition = true
    this.opflag=true;
    this.ipflag=false;
    this.pharmaflag=false;
    this.RegId = "";
  }
  else if (event.value == 'IP') {
    this.OP_IPType = 1;
    this.RegId = "";
    this.vSelectedOption = 'IP';
    // this.vConditionIP = true
    this.opflag=false;
    this.ipflag=true;
    this.pharmaflag=false;
  } else {
    this.vSelectedOption = 'External';
    // this.vConditionExt = true
    this.opflag=false;
    this.ipflag=false;
    this.pharmaflag=true;
    this.OP_IPType = 2;
  }
}

fetchresult(event){
  debugger
console.log(event)
}
getSearchListIP() {
  var m_data = {
    "Keyword": `${this.Feedbackpatientform.get('RegID').value}%`
  }
  if (this.Feedbackpatientform.get('PatientType').value == 'OP'){
    if (this.Feedbackpatientform.get('RegID').value.length >= 1) {
      this._FeedbackService.getPatientVisitedListSearch(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        this.PatientListfilteredOptionsOP = resData;
         console.log(resData);
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    }
  }else if (this.Feedbackpatientform.get('PatientType').value == 'IP') {
    if (this.Feedbackpatientform.get('RegID').value.length >= 1) {
      this._FeedbackService.getAdmittedPatientList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        // console.log(resData);
        this.PatientListfilteredOptionsIP = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
 
//  this.PatientInformRest();
}


getSelectedObjRegIP(obj) {
  let IsDischarged = 0;
  IsDischarged = obj.IsDischarged 
  if(IsDischarged == 1){
    Swal.fire('Selected Patient is already discharged');
    //this.PatientInformRest();
    this.RegId = ''
  }
  else{
    console.log(obj)
    this.DoctorNamecheck = true;
    this.IPDNocheck = true;
    this.OPDNoCheck = false;
    this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.LastName;
    this.RegId = obj.RegID;
    this.RegID = obj.RegID;
    this.OP_IP_Id = this.registerObj.AdmissionID;
    this.IPDNo = obj.IPDNo;
    this.RegNo =obj.RegNo;
    this.DoctorName = obj.DoctorName;
    this.TariffName =obj.TariffName
    this.CompanyName = obj.CompanyName;
    this.Age = obj.Age;
  } 
  
}

getSelectedObjOP(obj) { 
    console.log(obj)
    this.OPDNoCheck = true;
    this.DoctorNamecheck = false;
    this.IPDNocheck = false;
    this.registerObj = obj;
    this.RegId = obj.RegId;
    this.PatientName = obj.FirstName + " " + obj.LastName; 
    this.OP_IP_Id  = obj.VisitId;
    this.RegNo =obj.RegNo; 
    this.OPDNo = obj.OPDNo;
    this.CompanyName = obj.CompanyName;
    this.TariffName = obj.TariffName; 
    
}


getOptionTextIPObj(option) { 
  return option && option.FirstName + " " + option.LastName; 
}
getOptionTextOPObj(option) { 
  return option && option.FirstName + " " + option.LastName; 
}

getfeedbackquestionList(){
  this._FeedbackService.getquestionList().subscribe((data) =>{
    this.feedbackquest = data;
    console.log(this.feedbackquest)
   
  });
}
 

  onClose() {
    // this.dialogRef.close();
  }
 
registerObj:any;
  getpatientDet(obj){ 
    debugger
    console.log(obj) 
    this.registerObj = obj;
    this.selectedAdvanceObj = obj;
    this.RegID= obj.RegID; 
    this.vpatientName = obj.PatientName;
    this.vDoctorname = obj.DoctorName;
    this.vAgeYear = obj.AgeYear;
    this.vDepartmentName = obj.DepartmentName
    this.vAgeMonth = obj.AgeMonth;
    this.vAgeDay =obj.AgeDay;
    this.vRegNo = obj.RegNo;
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

onSubmit() {
   debugger
  if (this.RegID) {

    var m_data = {
      "patientFeedbackInsert": {
        "PatientFeedbackId": 0,
        "OP_IP_ID": this.OP_IP_Id || "",
        "OP_IP_Type": this.OPD_IPD_Type || 0,
        "FeedbackCategory": this.registerObj1.FeedbackCategory || 0,
        "FeedbackRating": this.registerObj1.FeedbackRating || "",
        "FeedbackComments ": this._FeedbackService.MyfeedbackForm.get('FeedbackComments').value || '',
        "AddedBy": this.accountService.currentUserValue.user.id,
            
      }
    }
    console.log(m_data);
    this._FeedbackService.feedbackInsert(m_data).subscribe(response => {
      if (response) {

        Swal.fire('Congratulations !', 'FeedBack Data save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
            // this.getRegistredPatientCasepaperview(response);
          }
        });
      } else {
        Swal.fire('Error !', 'Feedback Data  not saved', 'error');
      }
    });
  }
//     else
 
// debugger
//       var m_data1 = {
//         "opdRegistrationUpdate": {
//           "RegID": this.RegID,
//           "PrefixId": this._EmergencyListService.MyForm.get('PrefixID').value.PrefixID,
//           "FirstName": this.registerObj.FirstName || "",
//           "MiddleName": this.registerObj.MiddleName || "",
//           "LastName": this.registerObj.LastName || "",
//           "Address": this.registerObj.Address || "",
//           "City": this._EmergencyListService.MyForm.get('CityId').value.CityName || 0,
//           "PinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
//           "DateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
//           "Age":this.registerObj.Age,
//           "GenderID": this._EmergencyListService.MyForm.get('GenderId').value.GenderId || 0,
//           "PhoneNo": this._EmergencyListService.MyForm.get("PhoneNo").value || "",
//           "MobileNo": this._EmergencyListService.MyForm.get("MobileNo").value || "0",
//           "UpdatedBy": this.accountService.currentUserValue.user.id,
//           "AgeYear": this._EmergencyListService.MyForm.get("AgeYear").value || "0",
//           "AgeMonth": this._EmergencyListService.MyForm.get("AgeMonth").value || "0",
//           "AgeDay": this._EmergencyListService.MyForm.get("AgeDay").value || "0",
//           "CountryId": this._EmergencyListService.MyForm.get('CountryId').value.CountryId,
//           "StateId": this._EmergencyListService.MyForm.get('StateId').value.StateId,
//           "CityId": this._EmergencyListService.MyForm.get('CityId').value.CityId,
//           "MaritalStatusId": this._EmergencyListService.MyForm.get('MaritalStatusId').value ? this._EmergencyListService.MyForm.get('MaritalStatusId').value.MaritalStatusId : 0,
//           "IsCharity": false,// Boolean(JSON.parse(this._EmergencyListService.MyForm.get("IsCharity").value)) || "0",
//           "ReligionId": this._EmergencyListService.MyForm.get('ReligionId').value ? this._EmergencyListService.MyForm.get('ReligionId').value.ReligionId : 0,
//           "AreaId": this._EmergencyListService.MyForm.get('AreaId').value ? this._EmergencyListService.MyForm.get('AreaId').value.AreaId : 0,
//           // "isSeniorCitizen":0,
//           "aadharcardno": this._EmergencyListService.MyForm.get('AadharCardNo').value ? this._EmergencyListService.MyForm.get('AadharCardNo').value : 0,
//           "pancardno": this._EmergencyListService.MyForm.get('PanCardNo').value ? this._EmergencyListService.MyForm.get('PanCardNo').value : 0,
//           "Photo": ''// this.file.name || '',
//         }
//       }
//       console.log(m_data1)
//       this._registerService.regUpdate(m_data1).subscribe(response => {
//         if (response) {
//           Swal.fire('Congratulations !', 'Register Data Udated Successfully !', 'success').then((result) => {
//             if (result.isConfirmed) {
//              debugger
//               this.viewgetPatientAppointmentReportPdf(this.registerObj.VisitId);
//               if(this.Submitflag)
//                 this.getAdmittedPatientCasepaperview(this.registerObj.AdmissionID);
//               this._matDialog.closeAll();
//             }
//           });
//         }

//         else {
//           Swal.fire('Error !', 'Register Data  not Updated', 'error');
//         }

//       });

    
  }
getDateTime(dateTimeObj) {
  this.dateTimeObj = dateTimeObj;
}

}


export class PatientList {
  DoctorName: any;
  AgeYear: any;
  PatientName: string; 
  DepartmentName: string; 
  RegNo:any;
  FeedbackCategory:any;
  FeedbackRating:any;
  Feedbackdetails:any;

  constructor(PatientList) {
    {

      this.DoctorName = PatientList.DoctorName || 0;
      this.PatientName = PatientList.PatientName || "";
      this.DepartmentName = PatientList.DepartmentName || "";
      this.AgeYear = PatientList.AgeYear || 0; 
      this.FeedbackCategory = PatientList.FeedbackCategory || 0;
      this.FeedbackRating = PatientList.FeedbackRating || "";
      this.Feedbackdetails = PatientList.Feedbackdetails || ''; 
    }
  }
}