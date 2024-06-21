import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AdmissionService } from '../admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Admission, AdmissionPersonlModel } from '../admission.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';


@Component({
  selector: 'app-mlcinformation',
  templateUrl: './mlcinformation.component.html',
  styleUrls: ['./mlcinformation.component.scss']
})
export class MLCInformationComponent implements OnInit {

  MlcInfoFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: AdmissionPersonlModel;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();
  date: string;
  dateValue: any = new Date().toISOString();
  MLCId:any=0;
  Mlcno: any;
  Mlcdate: any;
  AuthorityName: any;
  ABuckleNo: any;
  PoliceStation: any;
  MlcObj=new MlcDetail({})

  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<MLCInformationComponent>,
    private router: Router
  ) {
    this.date = new Date().toISOString().slice(0, 16);
   }

  ngOnInit(): void {
debugger
    this.MlcInfoFormGroup = this.createmlcForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.AdmissionId=this.selectedAdvanceObj.AdmissionID;
      console.log(this.selectedAdvanceObj);
      this.getMlcdetail(this.AdmissionId)
   
    }
    this.MlcInfoFormGroup = this.createmlcForm();
  }

  createmlcForm() {
    return this.formBuilder.group({
      AdmissionOn: '',
      MlcNo: ['', [
        Validators.required]],
      ReportingDate:  ['', [
        Validators.required]],
      // ReportingTime:  ['', [
      //   Validators.required]],
      AuthorityName:  ['', [
        Validators.required]],
      ABuckleNo:  ['', [
        Validators.required]],
      PoliceStation:  ['', [
        Validators.required]],
      MlcType:'',
      Given:'',
      Remark:''
    });
  }


  filteredOptionsMLC: Observable<string[]>;
  MLCList:any=[];
  
  optionsMLC: any[] = [];

  getMlcdetail(AdmissionId){
    let Query = "Select * from T_MLCInformation where  AdmissionId=" + AdmissionId + " ";
    this._AdmissionService.getMLCDetail(Query).subscribe(data => {
      this.MlcObj = data[0];
      console.log(this.MlcObj);
      debugger
      if(data){
        if(this.MlcObj.MLCId)
        this.MLCId=this.MlcObj.MLCId;
      
        this.Mlcno=this.MlcObj.MLCNo;
        this.Mlcdate=this.MlcObj.ReportingDate;
        this.AuthorityName=this.MlcObj.AuthorityName;
        this.ABuckleNo=this.MlcObj.BuckleNo;
        this.PoliceStation=this.MlcObj.PoliceStation;
      }
    });

  }

  getReligionList() {
    this._AdmissionService.getMLCCombo().subscribe(data => {
      this.MLCList = data;
      this.optionsMLC = this.MLCList.slice();
      this.filteredOptionsMLC = this.MlcInfoFormGroup.get('MlcType').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterMLC(value) : this.MLCList.slice()),
      );

    });

  }
  private _filterMLC(value: any): string[] {
    if (value) {
      const filterValue = value && value.ReligionName ? value.ReligionName.toLowerCase() : value.toLowerCase();
      return this.optionsMLC.filter(option => option.ReligionName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextMLC(option) {
    return option && option.ReligionName ? option.ReligionName : '';
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
  
  if(this.MLCId ==0){
  var m_data = {
    "insertMLCInfo": {
      "AdmissionId":this.AdmissionId,
      "MlcNo":this.MLCId|| this.MlcInfoFormGroup.get("MlcNo").value || 0,
      "ReportingDate": this.datePipe.transform(this.MlcInfoFormGroup.get("ReportingDate").value,"MM-dd-yyyy") || '01/01/1900',
      "ReportingTime": this.datePipe.transform(this.MlcInfoFormGroup.get("ReportingDate").value,"hh:mm") || '01/01/1900',
      "AuthorityName": this.MlcInfoFormGroup.get("AuthorityName").value || '',
      "BuckleNo": this.MlcInfoFormGroup.get("ABuckleNo").value || '',
      "PoliceStation": this.MlcInfoFormGroup.get("PoliceStation").value || '',
      "MLCId": 0,
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
  debugger
  console.log(this.MlcInfoFormGroup.get("ReportingDate").value)
  var m_data1 = {
    "updateMLCInfo": {
      "mlcId":this.MLCId || this.MlcInfoFormGroup.get("MLCId").value,
      "admissionId": this.selectedAdvanceObj.AdmissionID,
      "MlcNo": this.MlcInfoFormGroup.get("MlcNo").value,
      "ReportingDate": this.datePipe.transform(this.MlcInfoFormGroup.get("ReportingDate").value,"MM-dd-yyyy") || '01/01/1900',
      "ReportingTime": this.datePipe.transform(this.MlcInfoFormGroup.get("ReportingDate").value,"hh:mm") || '01/01/1900',
      "AuthorityName": this.MlcInfoFormGroup.get("AuthorityName").value || '',
      "BuckleNo": this.MlcInfoFormGroup.get("ABuckleNo").value || '',
      "PoliceStation": this.MlcInfoFormGroup.get("PoliceStation").value || '',
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



export class MlcDetail {
  MLCId: any;
  AdmissionId: any;
  MLCNo: any;
  ReportingDate: any;
  ReportingTime: any;
  AuthorityName: any;
  BuckleNo: any;
  PoliceStation: any;
  
  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(MlcDetail) {
    {
      this.MLCId = MlcDetail.MLCId || '';
      this.AdmissionId = MlcDetail.AdmissionId || '';
      this.MLCNo = MlcDetail.MLCNo || '';
      this.ReportingDate = MlcDetail.ReportingDate || '';
      this.ReportingTime = MlcDetail.ReportingTime || '';
      this.AuthorityName = MlcDetail.MiddleName || '';
      this.BuckleNo = MlcDetail.BuckleNo || '';
      this.PoliceStation = MlcDetail.PoliceStation || '';

    }
  }
}