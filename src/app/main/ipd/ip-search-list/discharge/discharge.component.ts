import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj, Discharge, IPSearchListComponent } from '../ip-search-list.component';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IPSearchListService } from '../ip-search-list.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { T } from '@angular/cdk/keycodes';
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'app-discharge',
  templateUrl: './discharge.component.html',
  styleUrls: ['./discharge.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class DischargeComponent implements OnInit {

  
  isLoading: string = '';
  DischargeForm:FormGroup;
  currentDate = new Date();
  // screenFromString = 'discharge';
  screenFromString = 'OP-billing';
  selectedAdvanceObj: AdvanceDetailObj;
  DischargeId: any;
  Today: Date = new Date();
  registerObj: any;

  RtrvDischargeList:any=[];
  vComments:any;
  IsCancelled:any;
  dateTimeObj: any;
  vAdmissionId:any; 
  vMode:any=0;
  vDoctorId:any=0;
  vDescType:any=0;
  vAdmissionID:any=20;
  vBedId=101;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


     // New Api
     autocompletcondoc: string = "ConDoctor";
     autocompletedichargetype: string = "DichargeType";
     autocompletemode: string = "Mode";


  constructor(
    public _IpSearchListService: IPSearchListService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DischargeComponent>,
    public toastr: ToastrService,
    public _ConfigService : ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
  
    if (this.data) {
    
       this.selectedAdvanceObj = this.data;
       this.registerObj =  this.advanceDataStored.storage;
       console.log(this.registerObj);
 
        }
  }

  ngOnInit(): void {
    this.DischargeForm=this._IpSearchListService.DischargesaveForm();
    if (this.advanceDataStored.storage) { 
      this.vAdmissionId = this.registerObj.AdmissionID;
   
    } 
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

 
 


  onDischarge() {
    this.isLoading = 'submit';

    const formattedDate = this.datePipe.transform(this.dateTimeObj.date,"yyyy-MM-dd");
    const formattedTime = formattedDate+this.dateTimeObj.time;

    if(this.vDoctorId == 0) {
      this.toastr.warning('Please select Doctor', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if(!this.DoctorNameList.find(item => item.DoctorName ==  this._IpSearchListService.mySaveForm.get('DoctorID').value.DoctorName)){
    //   this.toastr.warning('Please select valid Doctor Name', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if(this.vDescType == 0) {
    //   this.toastr.warning('Please select Discharge Type', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if(!this.DischargeTypeList.find(item => item.DischargeTypeName ==  this._IpSearchListService.mySaveForm.get('DischargeTypeId').value.DischargeTypeName)){
    //   this.toastr.warning('Please select valid Discharge Type', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if(this._IpSearchListService.mySaveForm.get('ModeId').value){
    // if(!this.ModeNameList.find(item => item.ModeOfDischargeName ==  this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeName)){
    //   this.toastr.warning('Please select valid Mode Of Discharge', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
  }
  
  // if(this._ConfigService.configParams.chkPharmacyDue == '0'){
  //   console.log(this._ConfigService.configParams.chkPharmacyDue )
  //   if(this.CheckBalanceAmt > 0){
  //     Swal.fire({
  //       title: '"Please clear all pharmacy dues ' + this.CheckBalanceAmt,
  //       text: "If the pharmacy dues cannot be discharged!",
  //       icon: "warning", 
  //       confirmButtonColor: "#d33", 
  //       confirmButtonText: "Ok" 
  //     })
  //     return
  //   }
  // }

    
    let ModeOfDischarge = 0
    if(this._IpSearchListService.mySaveForm.get('ModeId').value)
      ModeOfDischarge = this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeId;
 
    if (!this.DischargeId) {
      var m_data = {
        "dischargeModel": {
          "dischargeId": 0,
          "admissionId": this.vAdmissionID,
          "dischargeDate": formattedDate || '01/01/1900' , // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900', 
          "dischargeTime": formattedTime || '01/01/1900', //this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900', 
          "dischargeTypeId": this.vDescType,
          "dischargedDocId":this.vDoctorId,
          "dischargedRMOID": 0,
          "modeOfDischargeId":  this.vMode, 
          "createdBy":2,// this.accountService.currentUserValue.userId,
        }, 
        "dischargeAdmissionModel": {
          "admissionID": this.vAdmissionID,
          "isDischarged": 1,
          "dischargeDate":formattedDate || '01/01/1900', // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || '01/01/1900',
          "dischargeTime":formattedTime || '01/01/1900',//this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900', 
        },
        "bedModel": {
          "bedId": this.vBedId,
        }
      }
      console.log(m_data);
      this._IpSearchListService.DichargeInsert(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
  
    }
    else {
      let ModeOfDischargeUpdate = 0
      if(this._IpSearchListService.mySaveForm.get('ModeId').value)
        ModeOfDischargeUpdate = this._IpSearchListService.mySaveForm.get('ModeId').value.ModeOfDischargeId;
       
      var m_data1 = {
        "updateIPDDischarg": {
          "DischargeId": this.DischargeId,
          "DischargeDate":formattedDate || '01/01/1900', // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') 
          "DischargeTime":formattedTime || '01/01/1900', //  this.datePipe.transform(this.currentDate, 'hh:mm:ss')  
          "DischargeTypeId":this.vDescType,
          "DischargedDocId":this.vDoctorId,
          "DischargedRMOID": 0, // this._IpSearchListService.mySaveForm.get("DischargedRMOID").value,
          "Modeofdischarge": this.vMode,
          "updatedBy": this.accountService.currentUserValue.userId,
        },
        "updateAdmission": {
          "admissionID": this.selectedAdvanceObj.AdmissionID || 0,
          "isDischarged": 1,
          "dischargeDate":formattedDate || '01/01/1900' ,// this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')  
          "dischargeTime":formattedTime || '01/01/1900', // this.datePipe.transform(this.currentDate, 'hh:mm:ss')  
        }
      }
      console.log(m_data1);
      this._IpSearchListService.DichargeUpdate(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
    this._IpSearchListService.mySaveForm.reset();
  }
  onClose() {
    this._IpSearchListService.mySaveForm.reset();
    this.dialogRef.close();
  }
  DischargedateTimeObj: any;
  getDischargeDateTime(DischargedateTimeObj) {
    this.DischargedateTimeObj = DischargedateTimeObj;
  }

  onClear(val: boolean) {
    // this.personalform.reset();
     // this.dialogRef.close(val);
   }

  // new Api

  getValidationModeMessages() {
    return {
      Modeofdischarge: [
            { name: "required", Message: "Mode Name is required" }
        ]
    };
}


getValidationConDoc() {
    return {
      DoctorID: [
            { name: "required", Message: "Doctor Name is required" }
        ]
    };
}
getValidationdisChargetypeMessages() {
    return {
      DischargeTypeId: [
            { name: "required", Message: "Discharge Type Name is required" }
        ]
    };
}

  selectChangecondoc(obj: any){
    console.log(obj);
    this.vDoctorId=obj.value
  }
  
  selectChangedichargetype(obj: any){
    console.log(obj);
    this.vDescType =obj.value
  }
  
  selectChangemode(obj: any){
    console.log(obj);
    this.vMode=obj.value
  }
}




