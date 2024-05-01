import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AdmissionService } from '../admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Admission } from '../admission.component';


@Component({
  selector: 'app-mlcinformation',
  templateUrl: './mlcinformation.component.html',
  styleUrls: ['./mlcinformation.component.scss']
})
export class MLCInformationComponent implements OnInit {

  MlcInfoFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: Admission;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();

  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<MLCInformationComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.MlcInfoFormGroup = this.createmlcForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
    }
  }

  createmlcForm() {
    return this.formBuilder.group({
      AdmissionOn: '',
      MlcNo: '',
      ReportingDate: '',
      ReportingTime: '',
      AuthorityName: '',
      ABuckleNo: '',
      PoliceStation: '',

    });
  }




  @ViewChild('mlc') mlc: ElementRef;
@ViewChild('authority') authority: ElementRef;
@ViewChild('buckleno') buckleno: ElementRef;
@ViewChild('polic') polic: ElementRef;
@ViewChild('rdate') rdate: ElementRef;
// @ViewChild('polic') polic: ElementRef;



add: boolean = false;
@ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
 

public onEntermlc(event): void {
  if (event.which === 13) {
    this.authority.nativeElement.focus();
  }
}
public onEnterauthority(event): void {
  if (event.which === 13) {
    this.buckleno.nativeElement.focus();
  }
}

public onEnterbuckleno(event): void {
  if (event.which === 13) {
    this.polic.nativeElement.focus();
  }
}
public onEnterpolic(event): void {
  if (event.which === 13) {
  this.rdate.nativeElement.focus();
  // if(this.mstatus) this.mstatus.focus();
  }
}

  onClose() {
    this.dialogRef.close();
  }

  //   onSubmit() {
  //     this.dialogRef.close();
  //  }


 onSubmit() {

  this.submitted = true;
  this.isLoading = 'submit';
  


  if(this.selectedAdvanceObj.IsMLC){
  var m_data = {
    "insertMLCInfo": {
      "AdmissionId ": this.selectedAdvanceObj.AdmissionID,
      "MlcNo": this.MlcInfoFormGroup.get("MlcNo").value || 0,
      "ReportingDate": this.dateTimeObj.date,
      "ReportingTime": this.dateTimeObj.time,
      "AuthorityName": this.MlcInfoFormGroup.get("AuthorityName").value || '',
      "BuckleNo": this.MlcInfoFormGroup.get("ABuckleNo").value || 0,
      "PoliceStation": this.MlcInfoFormGroup.get("PoliceStation").value || '',
      "MLCId": 0,// this.MlcInfoFormGroup.get("MLCId").value || '',
    }

  }
    console.log(m_data);
  this._AdmissionService.GetMLCInsert(m_data).subscribe(response => {
    if (response) {
      Swal.fire('Congratulations !', 'MLC Information save Successfully !', 'success').then((result) => {
        if (result.isConfirmed) {
          let m = response;
          this._matDialog.closeAll();
        }
      });
    } else {
      Swal.fire('Error !', 'MLC Information  not saved', 'error');
    }
    this.isLoading = '';
  });


}
else{
  var m_data1 = {
    "updateMLCInfo": {
      "mlcId": 13,//this.MlcInfoFormGroup.get("MLCId").value,
      "admissionId": this.selectedAdvanceObj.AdmissionID,
      "MlcNo": this.MlcInfoFormGroup.get("MlcNo").value,
      "ReportingDate": this.datePipe.transform(this.MlcInfoFormGroup.get("ReportingDate").value,"MM-dd-yyyy") || '01/01/1900',
      "ReportingTime": this.datePipe.transform(this.MlcInfoFormGroup.get("ReportingTime").value,"MM-dd-yyyy") || '01/01/1900',
      "AuthorityName": this.MlcInfoFormGroup.get("AuthorityName").value || 0,
      "BuckleNo": this.MlcInfoFormGroup.get("ABuckleNo").value || 0,
      "PoliceStation": this.MlcInfoFormGroup.get("PoliceStation").value,
    }
  }
    console.log(m_data1);
  this._AdmissionService.GetMLCUpdate(m_data1).subscribe(response => {
    if (response) {
      Swal.fire('Congratulations !', 'MLC Information Update Successfully !', 'success').then((result) => {
        if (result.isConfirmed) {
          let m = response;
          this._matDialog.closeAll();
        }
      });
    } else {
      Swal.fire('Error !', 'MLC Information  not Update', 'error');
    }
    this.isLoading = '';
  });
}

}


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}
