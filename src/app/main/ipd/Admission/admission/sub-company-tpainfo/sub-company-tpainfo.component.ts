import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';

import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdmissionService } from '../admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from '../admission.component';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-sub-company-tpainfo',
  templateUrl: './sub-company-tpainfo.component.html',
  styleUrls: ['./sub-company-tpainfo.component.scss']
})
export class SubCompanyTPAInfoComponent implements OnInit {

  SubcompanyFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: AdmissionPersonlModel;
  
  AdmissionId: any;
  CompanyName:any;
  subCompanyId=0
  CityName:any;
  autocompleteModecity: string = "City";
  autocompleteModecompany: string = "Company";
  autocompleteModecompanytype: string = "CompanyType";


  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
     public toastr: ToastrService,
  @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SubCompanyTPAInfoComponent>,
    ) { }

  ngOnInit(): void {
    this.SubcompanyFormGroup = this.createsubtpaForm();
    this.SubcompanyFormGroup.markAllAsTouched();
    console.log(this.data)
    // if (this.data) {
    //   this.selectedAdvanceObj = this.data;
    //   this.subCompanyId= this.data.subTpaComId
    //   console.log(this.selectedAdvanceObj);
    // }
}
 
  
createsubtpaForm() {
    return this.formBuilder.group({
      subCompanyId : 0,
      compTypeId:['', Validators.required],
      companyName:['', Validators.required],
      address: '',
      city: ['', Validators.required],
      pinNo:['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{7}$")]],
      phoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      mobileNo: ['',Validators.required, [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      faxNo: '%',
      IsActive:'',


      addedBy:10,
  updatedBy: 10,
  isCancelled: true,
  isCancelledBy: 0,
  isCancelledDate: "2018-01-01",
  createdBy: 10,
  createdDate:"2018-01-01",
  modifiedBy: 10,
  modifiedDate: "2018-01-01"


    });
  }


 onSubmit() {
    let data =this.SubcompanyFormGroup.value
    debugger
    data["companyName"]=this.CompanyName
    data["city"]=this.CityName

// console.log(data)
// if(this.SubcompanyFormGroup.value.valid){
  this._AdmissionService.subcompanyTPAInsert(data).subscribe(response => {
    this.toastr.success(response.message);
      this._matDialog.closeAll();
    }, (error) => {
      this.toastr.error(error.message);

    });
  // }
  // else
  // Swal.fire("Enter Values..Form is Invalid")
}
onChangeCompany(event){
  this.CompanyName=event.text
}
onChangeCity(event){
  console.log(event)
  this.CityName=event.text
}

getValidationMessages() {
  return {
    RegId: [],
    cityId: [
      { name: "required", Message: "cityId is required" }
    ],
    CompanyId: [
      { name: "required", Message: "CompanyId is required" }
    ],
    mobileNo: [
      { name: "pattern", Message: "mobileNo allowed" },

    ],
    phoneNo: [
      { name: "pattern", Message: "phoneNo Only numbers allowed" },

    ],
    pinNo: [
      { name: "pattern", Message: "Only numbers allowed" },
    ],
    FaxNo: [
      { name: "required", Message: "FaxNo Only numbers allowed" }
    ]
  };
}

onReset(){
  this.SubcompanyFormGroup.reset();
}
onClose() {
  this.dialogRef.close();
}
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}

