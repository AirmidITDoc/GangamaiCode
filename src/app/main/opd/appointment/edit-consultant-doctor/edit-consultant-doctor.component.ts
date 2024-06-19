import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AdvanceDetailObj } from '../appointment.component';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';

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

  AdmissionID: any;
  screenFromString = 'admission-form';
  PatientHeaderObj: AdvanceDetailObj;
  AdmittedDoc1: any;
  PatientName: any;
  searchFormGroup: FormGroup;
  VisitId: any;
  VisitDate: any;
  RegID: any = 0;

  RefoptionsDoc: any[] = [];
  isRefDoctorSelected: boolean = false;
  vrefDoctorId:any;

  optionsDept: any[] = [];
  isDeptSelected: boolean = false;
  vDeptId:any;


  filteredDoctor: Observable<string[]>;
filteredDepartment: Observable<string[]>;
  constructor(

    public _OpAppointmentService: AppointmentSreviceService,
    private formBuilder: FormBuilder,
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
      this.PatientHeaderObj = this.data.registerObj;
      this.VisitId = this.PatientHeaderObj.VisitId;
      this.PatientName = this.PatientHeaderObj.PatientName;
      this.DoctorId = this.PatientHeaderObj.DoctorId;
      this.VisitDate = this.PatientHeaderObj.VistDateTime;
      this.RegID = this.PatientHeaderObj.RegId;
      this.AdmissionID = this.PatientHeaderObj.AdmissionID;
      console.log(this.PatientHeaderObj);
      debugger
      // if (this.data.FormName == "Admission")
      //   this.RegID = this.PatientHeaderObj.AdmissionID;
    }


    this.getDoctorList();
    this.getDepartmentList();

   
    setTimeout(function () {
      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();
    }, 1000);
  }


  createSearchForm() {
    return this.formBuilder.group({
      DoctorId: '',
      Departmentid: ''
    });
  }

  setDropdownObjs() {
    const toSelectDoc1 = this.DoctorList.find(c => c.DoctorID == this.DoctorId);
    this.searchFormGroup.get('DoctorId').setValue(toSelectDoc1);
    this.searchFormGroup.updateValueAndValidity();
  }

  // getDoctorList() {
  //   this._OpAppointmentService.getDeptwiseDoctorMaster().subscribe(
  //     data => {
  //       this.DoctorList = data;
  //       console.log(data)

  //       this.filteredDoctor.next(this.DoctorList.slice());
  //     })
  // }

  getDoctorList() {
    this._OpAppointmentService.getDeptwiseDoctorMaster().subscribe(data => {
      this.DoctorList = data;
      this.RefoptionsDoc = this.DoctorList.slice();
      this.filteredDoctor = this.searchFormGroup.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdoc(value) : this.DoctorList.slice()),
      );

    });
  }
  private _filterdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.RefoptionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextRefDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  // OnChangeDoctorList(departmentObj) {
  //   console.log("departmentObj", departmentObj)
  //   this._OpAppointmentService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
  //     data => {
  //       this.DoctorList = data;
  //       console.log(this.DoctorList);
  //       // this.filteredDoctor.next(this.DoctorList.slice());
  //     })
  // }

  
  OnChangeDoctorList(departmentObj) {
    debugger
    this.isDeptSelected = true;
    this._OpAppointmentService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        this.RefoptionsDoc = this.DoctorList.slice();
        this.filteredDoctor = this.searchFormGroup.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterdoc(value) : this.DoctorList.slice()),
        );
      })
  }


  // getDepartmentList() {
  //   this._OpAppointmentService.getDepartmentCombo().subscribe(data => {
  //     this.DepartmentList = data;
  //     this.filteredDepartment.next(this.DepartmentList.slice());
  //   });
  // }


  getDepartmentList() {
    this._OpAppointmentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDept = this.DepartmentList.slice();
      this.filteredDepartment = this.searchFormGroup.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterdept(value) : this.DepartmentList.slice()),
      );

    });
  }
  private _filterdept(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDept.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextDept(option) {
    return option && option.departmentName ? option.departmentName : '';
  }

  @ViewChild('refdoc') refdoc: ElementRef;

  public onEnterrefdoc(event): void {
    if (event.which === 13) {

      this.refdoc.nativeElement.focus();

    }
  }





  onClose() {
    this.dialogRef.close();
  }

  onSubmit() {
    debugger
    this.DoctorId = this.searchFormGroup.get('DoctorId').value.DoctorId;
    let query = '';
    if (this.data.FormName == "Appointment") {
       query = "Update VisitDetails set ConsultantDocId= " + this.DoctorId + " where Visitid=" + this.VisitId + " ";
    }
    if (this.data.FormName == "Admission") {
       query = "Update VisitDetails set ConsultantDocId= " + this.DoctorId + " where RegID=" + this.RegID + " ";
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

