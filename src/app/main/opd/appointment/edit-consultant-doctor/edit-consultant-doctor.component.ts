import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AdvanceDetailObj } from '../appointment.component';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';

@Component({
  selector: 'app-edit-consultant-doctor',
  templateUrl: './edit-consultant-doctor.component.html',
  styleUrls: ['./edit-consultant-doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditConsultantDoctorComponent implements OnInit {


  dateTimeObj: any;
  DoctorList: any = [];
  DepartmentList: any = [];
  DoctorId: any;
  DepartmentId: any;
  AdmissionID: any;
  screenFromString = 'admission-form';
  PatientHeaderObj: SearchInforObj;
  AdmittedDoc1: any;
  PatientName: any;
  searchFormGroup: FormGroup;
  VisitId: any;
  VisitDate: any;
  RegID: any = 0;
  vDepartmentid:any=0;
  RefoptionsDoc: any[] = [];
  isRefDoctorSelected: boolean = false;
  vrefDoctorId:any;

  optionsDept: any[] = [];
  isDeptSelected: boolean = false;
  vDeptId:any;

  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;

filteredOptionsDep: any;
filteredOptionsDoc: any;
  constructor(

    public _OpAppointmentService: AppointmentSreviceService,
    private formBuilder: UntypedFormBuilder,
    private dialogRef: MatDialogRef<EditConsultantDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.searchFormGroup = this.createSearchForm();

    if (this.data) {
      console.log(this.data)
      this.registerObj1 = this.data.registerObj;
      this.PatientHeaderObj = this.data.registerObj;
      this.VisitId = this.PatientHeaderObj.VisitId;
      this.PatientName = this.PatientHeaderObj.PatientName;
      this.DoctorId = this.PatientHeaderObj.DoctorId;
      // this.VisitDate = this.PatientHeaderObj.VistDateTime;
      this.RegID = this.PatientHeaderObj.RegId;
      this.AdmissionID = this.PatientHeaderObj.AdmissionID;
      console.log(this.PatientHeaderObj);
      this.getDepartmentList();
      this.getDoctorList();
    }


    this.filteredOptionsDep = this.searchFormGroup.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterdept(value)),

    );

    this.filteredOptionsDoc = this.searchFormGroup.get('DoctorID').valueChanges.pipe(
      startWith(''),
      map(value => this._filteradmittedDoctor1(value)),

    );
   
    setTimeout(function () {
      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();
    }, 1000);
  }


  createSearchForm() {
    return this.formBuilder.group({
      DoctorID: '',
      Departmentid: ''
    });
  }

  setDropdownObjs() {
    debugger
    const toSelect = this.DepartmentList.find(c => c.DepartmentId == this.registerObj1.DepartmentId);
    this.searchFormGroup.get('Departmentid').setValue(toSelect);

    const toSelect1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.DoctorId);
    this.searchFormGroup.get('DoctorID').setValue(toSelect1);
    
    this.searchFormGroup.updateValueAndValidity();
  }
 
  

  registerObj1 = new AdmissionPersonlModel({});
  
  getDepartmentList() {
    debugger
    this._OpAppointmentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      if (this.registerObj1) {
        const ddValue = this.DepartmentList.filter(c => c.DepartmentId == this.registerObj1.DepartmentId);
        this.searchFormGroup.get('Departmentid').setValue(ddValue[0]);
        //  this.OnChangeDoctorList(this.registerObj1);
        this.searchFormGroup.updateValueAndValidity();
        return;
      }
    });

  }

  getDoctorList() {
    debugger

    this._OpAppointmentService.getDoctorMasterNew().subscribe(data => {
      this.DoctorList = data;
      if (this.data) {
        const ddValue = this.DoctorList.filter(c => c.DoctorId == this.registerObj1.DoctorId);
        this.searchFormGroup.get('DoctorID').setValue(ddValue[0]);
        this.searchFormGroup.updateValueAndValidity();
        return;
      }
    });
  }


  private _filterdept(value: any): string[] {
    if (value) {
      const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
    }
  }

  private _filteradmittedDoctor1(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.DoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
  }
 

  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  OnChangeDoctorList(departmentObj) {
    debugger
  //   if(flag)
  //   departmentObj.DepartmentId=departmentObj.DepartmentId
  // else
  // departmentObj.DepartmentId=departmentObj.Departmentid

    this.searchFormGroup.get('DoctorID').reset();
    this.isDepartmentSelected = true;
    this._OpAppointmentService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(
      data => {
        this.DoctorList = data;
        // this.searchFormGroup.get('DoctorId').setValue(this.DoctorList[0]);      
        return;
      });
      this.filteredOptionsDoc = this.searchFormGroup.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => this._filteradmittedDoctor1(value)),
  
      );
  
  }

  
  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }
 
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;

  public onEnterdept(event): void {
    if (event.which === 13) {
      this.deptdoc.nativeElement.focus();
    }
  }
  

  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    debugger

    this.DepartmentId=this.searchFormGroup.get('Departmentid').value.DepartmentId;
    this.DoctorId = this.searchFormGroup.get('DoctorID').value.DoctorId;
    let query = '';
    if (this.data.FormName == "Appointment") {
       query = "Update VisitDetails set ConsultantDocId= " + this.DoctorId + " , " + "DepartmentId="+this.DepartmentId + " where Visitid=" + this.VisitId + " ";
    }
    
    console.log(query);
    this._OpAppointmentService.UpdateQueryByStatement(query).subscribe(response => {

      if (response) {
        Swal.fire('updated !', 'Consultant Doctor Data Updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Consultant Doctor  not Updated', 'error');
      }
    });
  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}

