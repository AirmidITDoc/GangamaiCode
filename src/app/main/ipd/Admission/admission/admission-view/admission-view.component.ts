import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AdmissionService } from '../admission.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdmissionPersonlModel } from '../admission.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-admission-view',
  templateUrl: './admission-view.component.html',
  styleUrls: ['./admission-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdmissionViewComponent implements OnInit {

  // type Employee = Array<{ ServiceName: String; Qty: number;Price:number; }>;
  filteredOptionsDep: any;
  filteredOptionsDoc: any;
  hospitalFormGroup: FormGroup;
  selectedAdvanceObj: AdmissionPersonlModel;
  DoctorList: any = [];
  Doctor1List: any = [];
  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;
  

  constructor(private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private formBuilder: UntypedFormBuilder,
    public _AdmissionService: AdmissionService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,) {
    this.hospitalFormGroup = this.createHospitalForm();

    this.getDepartmentList();
    this.getDoctorList();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.registerObj1 = this.advanceDataStored.storage;
    }
  }

  ngOnInit(): void {

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      /// console.log(this.selectedAdvanceObj);
      this.setDropdownObjs();
    }

    this.filteredOptionsDep = this.hospitalFormGroup.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterdept(value)),

    );

    this.filteredOptionsDoc = this.hospitalFormGroup.get('DoctorId').valueChanges.pipe(
      startWith(''),
      map(value => this._filteradmittedDoctor1(value)),

    );

  }

  setDropdownObjs() {
    debugger
    const toSelect = this.DepartmentList.find(c => c.Departmentid == this.registerObj1.DepartmentId);
    this.hospitalFormGroup.get('Departmentid').setValue(toSelect);

    const toSelect1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.DocNameID);
    this.hospitalFormGroup.get('DoctorId').setValue(toSelect1);
    
    this.hospitalFormGroup.updateValueAndValidity();
  }

  createHospitalForm() {
    return this.formBuilder.group({
      HospitalId: '',
      PatientTypeID: '',
      TariffId: '',
      DoctorId: '',
      DoctorID: '',
      Departmentid: '',
      CompanyId: '',
      SubCompanyId: '',
      admittedDoctor1: '',
      admittedDoctor2: '',
      refDoctorId: '',
    });
  }
  registerObj1 = new AdmissionPersonlModel({});
  DepartmentList: any = [];
  getDepartmentList() {
    debugger
    this._AdmissionService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      if (this.registerObj1) {
        const ddValue = this.DepartmentList.filter(c => c.Departmentid == this.registerObj1.DepartmentId);
        this.hospitalFormGroup.get('Departmentid').setValue(ddValue[0]);
        //  this.OnChangeDoctorList(this.registerObj1);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });

  }

  getDoctorList() {
    debugger

    this._AdmissionService.getDoctorMasterNew().subscribe(data => {
      this.DoctorList = data;
      if (this.data) {
        const ddValue = this.DoctorList.filter(c => c.DoctorId == this.registerObj1.DocNameID);
        this.hospitalFormGroup.get('DoctorId').setValue(ddValue[0]);
        this.hospitalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }


  private _filterdept(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }
  }

  private _filteradmittedDoctor1(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.DoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }


  getOptionTextDep(option) {
    return option && option.departmentName ? option.departmentName : '';
  }

  OnChangeDoctorList(departmentObj) {
    debugger
  //   if(flag)
  //   departmentObj.DepartmentId=departmentObj.DepartmentId
  // else
  // departmentObj.DepartmentId=departmentObj.Departmentid

    this.hospitalFormGroup.get('DoctorId').reset();
    this.isDepartmentSelected = true;
    this._AdmissionService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        // this.hospitalFormGroup.get('DoctorId').setValue(this.DoctorList[0]);      
        return;
      });
      this.filteredOptionsDoc = this.hospitalFormGroup.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => this._filteradmittedDoctor1(value)),
  
      );
  
  }

  
  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

}
