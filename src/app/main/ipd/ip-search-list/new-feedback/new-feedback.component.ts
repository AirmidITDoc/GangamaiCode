import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FeedbackService } from '../../Feedback/opip-feedback/feedback.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { PatientList } from '../../Feedback/opip-feedback/opip-feedback.component';
import { MatTableDataSource } from '@angular/material/table';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-feedback',
  templateUrl: './new-feedback.component.html',
  styleUrls: ['./new-feedback.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations

})
export class NewFeedbackComponent implements OnInit {

  feedbackForm:FormGroup
  Feedbackpatientform:FormGroup
  firstFormGroup:FormGroup
  fetchlist:any=[]
  Feedbackform: FormGroup;
  
  
    isLoading: String = '';
    sIsLoading: string = ""; 
  
   
    vWardId:any;
    answerlist1:any=[];
    PatientList:any=[];
    feedbackquest:any=[];
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
  
    answer:any=''
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

i=0
    selectedOption:any;
    questionlength:any;
  constructor(private fb: FormBuilder,public _FeedbackService:FeedbackService,
      public datePipe: DatePipe,
      public _matDialog: MatDialog,
      // private dialogRef: MatDialogRef<OPIPFeedbackComponent>,
      public toastr: ToastrService,
      private accountService: AuthenticationService,
      private _formBuilder: FormBuilder,
      private advanceDataStored: AdvanceDataStored) {

    this.feedbackForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      experience: ['', Validators.required],
      FeedbackComments: [[]],
      suggestions: [''],
    });
    this.getpatientsearchform();
  }


  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      experience:['']
    });


    // this.getpatientsearchform();
    this.getfeedbackquestionList();


   }

  
   getpatientsearchform() {
    this.Feedbackpatientform = this._formBuilder.group({
      PatientType: ['OP'],
      PatientName: '',
      RegID:'',
    });
  }
  


  
fetchresult(event,flag){
  
  console.log(event)
  
  this.feedbackquest.forEach(element => {
  
    debugger
    if(flag==1)
    this.answer=" Excellent"
  else if(flag==2)
    this.answer=" Good"
  else if(flag==3)
    this.answer=" Average"
  else if(flag==4)
    this.answer=" Poor"
  else if(flag==5)
    this.answer=" Worst"
  });
  
  this.answerlist1.push({
  Id:event.SequanceId,
  answer:this.answer
  
    });
  
  
  console.log(this.answerlist1)
  
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
  onChangeoption(event){
    if (event.value == '1') 
      console.log(event)

    this.answerlist1.push({
      // Id:event.SequanceId,
      // answer:this.answer
      
        });

        console.log(this.answerlist1)



        this.fetchlist.push(
          {
           
            FeedbackId:event.FeedbackId,
            FeedbackQuestion: event.FeedbackQuestion,
            FeedbackQuestionMarathi:event.FeedbackQuestionMarathi,
            DepartmentId:event.DepartmentId,
            SequanceId:event.SequanceId,
            // Imgstatus: flag || 0,
           
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
  

  getfeedbackquestionList(){
    this._FeedbackService.getquestionList().subscribe((data) =>{
      console.log(data)
      
      this.feedbackquest =  data as any[];
      console.log(this.feedbackquest.length)
      this.questionlength=this.feedbackquest.length;
     
    });
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

 onSubmit() {
    debugger
  //  if (this.RegId) {
 
     console.log(this.fetchlist)
 
     
     let ffeedbackarr = []; 
     this.fetchlist.forEach((element) => {
       let feedarray = {};
       feedarray['PatientFeedbackId'] = 0;
       feedarray['OP_IP_ID'] =1,//this.OP_IP_Id;
       feedarray['OP_IP_Type'] = 1,// this.OPD_IPD_Type || 0;
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
  //  }else{
  //    this.toastr.warning('Please select valid Patient Name', 'Warning !', {
  //      toastClass: 'tostr-tost custom-toast-warning',
  //    });
  //    return;
  //  }
 
   }

   onClose(){}
}