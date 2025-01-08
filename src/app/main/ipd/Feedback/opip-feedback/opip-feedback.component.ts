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
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

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


  RefDocName:any;
  RoomName:any;
  BedName:any;
  PatientType:any;
  DOA:any;
  GenderName:any;
Imgstatus1=0
Imgstatus2=0
Imgstatus3=0
Imgstatus4=0
Imgstatus5=0


@ViewChild('stepper') stepper: MatStepperModule;

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
    private _formBuilder: UntypedFormBuilder,
    private advanceDataStored: AdvanceDataStored) {  this.getfeedbackquestionList(); }

  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      FeedbackResult:['']
    });
    
    this.vSelectedOption = 'OP';
    
    this.getpatientsearchform();
     this.getfeedbackquestionList();
    
  }


  getpatientsearchform() {
  this.Feedbackpatientform = this._formBuilder.group({
    PatientType: ['OP'],
    PatientName: '',
    RegID:'',
  });
}


onChangePatientType(event) {
  
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

fetchlist: any[] = []
Imgstatus=0
fetchresult(event,flag){
  
console.log(event)
// this.fetchlist.push(event)
this.fetchlist.push(
  {
   
    FeedbackId:event.FeedbackId,
    FeedbackQuestion: event.FeedbackQuestion,
    FeedbackQuestionMarathi:event.FeedbackQuestionMarathi,
    DepartmentId:event.DepartmentId,
    SequanceId:event.SequanceId,
    Imgstatus: flag || 0,
   
  });

if(flag==1){
  this.Imgstatus1=1
  this.Imgstatus2=0
  this.Imgstatus3=0
  this.Imgstatus4=0
  this.Imgstatus5=0
}
if(flag==2){
  this.Imgstatus2=1
  this.Imgstatus1=0
  this.Imgstatus3=0
  this.Imgstatus4=0
  this.Imgstatus5=0
}
if(flag==3){
  this.Imgstatus3=1
  this.Imgstatus2=0
  this.Imgstatus1=0
  this.Imgstatus4=0
  this.Imgstatus5=0
}
if(flag==4){
  this.Imgstatus2=0
  this.Imgstatus3=0
  this.Imgstatus1=0
  this.Imgstatus5=0
  this.Imgstatus4=1

}
if(flag==5){
  this.Imgstatus5=1
  this.Imgstatus2=0
  this.Imgstatus3=0
  this.Imgstatus4=0
  this.Imgstatus1=0
}

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
    // this.registerObj = obj;
    this.PatientName = obj.FirstName + ' ' + obj.LastName;
    this.RegId = obj.RegID;
    this.RegID = obj.RegID;
    this.OP_IP_Id = obj.AdmissionID;
    this.IPDNo = obj.IPDNo;
    this.RegNo =obj.RegNo;
    this.DoctorName = obj.DoctorName;
    this.TariffName =obj.TariffName
    this.CompanyName = obj.CompanyName;
    this.Age = obj.Age;
    this.vAgeYear = obj.AgeYear;
    this.vAgeMonth = obj.AgeMonth;
    this.vAgeDay = obj.AgeDay;
    this.GenderName = obj.GenderName;
    this.RefDocName= obj.RefDocName;
    this.RoomName = obj.RoomName;
    this.BedName= obj.BedName;
    this.PatientType= obj.BedName;
    this.DOA=obj.Adm
  } 
  
}

getSelectedObjOP(obj) { 
    console.log(obj)
    this.OPDNoCheck = true;
    this.DoctorNamecheck = false;
    this.IPDNocheck = false;
    // this.registerObj = obj;
    this.OP_IP_Id=obj.VisitId;
    this.RegId = obj.RegID;
    this.PatientName = obj.FirstName + " " + obj.LastName; 
    this.IPDNo = obj.OPDNo;
    this.CompanyName = obj.CompanyName;
    this.TariffName = obj.TariffName; 
    this.CompanyName = obj.CompanyName;
    this.Age = obj.Age;
    this.vAgeYear = obj.AgeYear;
    this.vAgeMonth = obj.AgeMonth;
    this.vAgeDay = obj.AgeDay;
    this.GenderName = obj.GenderName;
    this.RefDocName= obj.RefDocName;
    this.RoomName = obj.RoomName;
    this.BedName= obj.BedName;
    this.PatientType= obj.BedName;
    
}


getOptionTextIPObj(option) { 
  return option && option.FirstName + " " + option.LastName; 
}
getOptionTextOPObj(option) { 
  return option && option.FirstName + " " + option.LastName; 
}

getfeedbackquestionList(){
  this._FeedbackService.getquestionList().subscribe((data) =>{
    console.log(data)
    this.feedbackquest =  data as any[];
    console.log(this.feedbackquest)
   
  });
}
 

  onClose() {
    // this.dialogRef.close();
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
   
  if (this.RegId) {

    console.log(this.fetchlist)

    
    let ffeedbackarr = []; 
    this.fetchlist.forEach((element) => {
      let feedarray = {};
      feedarray['PatientFeedbackId'] = 0;
      feedarray['OP_IP_ID'] = this.OP_IP_Id;
      feedarray['OP_IP_Type'] =  this.OPD_IPD_Type || 0;
      feedarray['departmentId'] = element.DepartmentId;
      feedarray['feedbackQuestionId'] =element.FeedbackId;
      feedarray['feedbackRating'] = element.Imgstatus;
      feedarray['FeedbackComments'] = this._FeedbackService.MyfeedbackForm.get("FeedbackComments").value;
      feedarray['createdBy'] =this.accountService.currentUserValue.user.id;
      ffeedbackarr.push(feedarray); 
    });

    var m_data = {
      "patientFeedbackParams":ffeedbackarr
    
    }
    console.log(m_data);
    this._FeedbackService.feedbackInsert(m_data).subscribe(response => {
      if (response) {

        Swal.fire('Congratulations !', 'FeedBack Data save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
            
          }
        });
      } else {
        Swal.fire('Error !', 'Feedback Data  not saved', 'error');
      }
    });
  }else{
    this.toastr.warning('Please select valid Patient Name', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }

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
  // FeedbackCategory:any;
  // FeedbackRating:any;
  // Feedbackdetails:any;

  constructor(PatientList) {
    {

      this.DoctorName = PatientList.DoctorName || 0;
      this.PatientName = PatientList.PatientName || "";
      this.DepartmentName = PatientList.DepartmentName || "";
      this.AgeYear = PatientList.AgeYear || 0; 
      // this.FeedbackCategory = PatientList.FeedbackCategory || 0;
      // this.FeedbackRating = PatientList.FeedbackRating || "";
      // this.Feedbackdetails = PatientList.Feedbackdetails || ''; 
    }
  }
}