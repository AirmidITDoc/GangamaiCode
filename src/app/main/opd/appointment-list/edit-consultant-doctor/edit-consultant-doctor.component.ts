import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentlistService } from '../appointmentlist.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { SearchInforObj } from '../../op-search-list/opd-search-list/opd-search-list.component';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-consultant-doctor',
  templateUrl: './edit-consultant-doctor.component.html',
  styleUrls: ['./edit-consultant-doctor.component.scss']
})
export class EditConsultantDoctorComponent implements OnInit {

  ConsdrForm: FormGroup;
  constructor(
      public _AppointmentlistService: AppointmentlistService,
      public dialogRef: MatDialogRef<EditConsultantDoctorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public datePipe: DatePipe,
      public toastr: ToastrService
  ) { }

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

filteredOptionsDep: Observable<string[]>;
filteredOptionsDoc: Observable<string[]>;
 
  ngOnInit(): void {

  
    this.ConsdrForm = this._AppointmentlistService.createConsultatDrForm();
    var m_data = {
      doctorID: this.data?.doctorID,
      departmentid: this.data?.departmentid,
   
    };
    this.ConsdrForm.patchValue(m_data);

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
    this.getDepartmentList();
    this.getDoctorList();

    this.filteredOptionsDep = this.ConsdrForm.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterdept(value)),

    );

    this.filteredOptionsDoc = this.ConsdrForm.get('DoctorID').valueChanges.pipe(
      startWith(''),
      map(value => this._filteradmittedDoctor1(value)),

    );
   
    setTimeout(function () {
      let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
      element.click();
    }, 1000);
  }


  // createSearchForm() {
  //   return this.formBuilder.group({
  //     DoctorID: '',
  //     Departmentid: ''
  //   });
  // }

  setDropdownObjs() {
    debugger
    const toSelect = this.DepartmentList.find(c => c.value == this.registerObj1.DepartmentId);
    this.ConsdrForm.get('Departmentid').setValue(toSelect);

    const toSelect1 = this.DoctorList.find(c => c.value == this.registerObj1.DoctorId);
    this.ConsdrForm.get('DoctorID').setValue(toSelect1);
    
    this.ConsdrForm.updateValueAndValidity();
  }
 
  

  registerObj1 = new AdmissionPersonlModel({});
  
  getDepartmentList() {
    var mode="Department"
    this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
      this.DepartmentList = data;
      // if (this.registerObj1) {
      //   const ddValue = this.DepartmentList.filter(c => c.DepartmentId == this.registerObj1.DepartmentId);
      //   this.ConsdrForm.get('Departmentid').setValue(ddValue[0]);
      //   //  this.OnChangeDoctorList(this.registerObj1);
      //   this.ConsdrForm.updateValueAndValidity();
      //   return;
      // }
    });

  }

  getDoctorList() {
     var mode="ConDoctor"

    this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
      this.DoctorList = data;
      // if (this.data) {
      //   const ddValue = this.DoctorList.filter(c => c.DoctorId == this.registerObj1.DoctorId);
      //   this.ConsdrForm.get('DoctorID').setValue(ddValue[0]);
      //   this.ConsdrForm.updateValueAndValidity();
      //   return;
      // }
    });
  }


  private _filterdept(value: any): string[] {
    if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.text.toLowerCase().includes(filterValue));
    }
  }

  private _filteradmittedDoctor1(value: any): string[] {
    if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      return this.DoctorList.filter(option => option.text.toLowerCase().includes(filterValue));
    }
  }
 

  getOptionTextDep(option) {
    return option && option.text ? option.text : '';
  }

  OnChangeDoctorList(departmentObj) {
    debugger
  //   if(flag)
  //   departmentObj.DepartmentId=departmentObj.DepartmentId
  // else
  // departmentObj.DepartmentId=departmentObj.Departmentid

    // this.ConsdrForm.get('DoctorID').reset();
    // this.isDepartmentSelected = true;
    // this._OpAppointmentService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(
    //   data => {
    //     this.DoctorList = data;
    //     // this.ConsdrForm.get('DoctorId').setValue(this.DoctorList[0]);      
    //     return;
    //   });
    //   this.filteredOptionsDoc = this.ConsdrForm.get('DoctorID').valueChanges.pipe(
    //     startWith(''),
    //     map(value => this._filteradmittedDoctor1(value)),
  
    //   );
  
  }

  
  getOptionTextDoc(option) {
    return option && option.text ? option.text : '';
  }
 
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;

  public onEnterdept(event): void {
    if (event.which === 13) {
      this.deptdoc.nativeElement.focus();
    }
  }
  

 
 
  onSubmit() {
      // if (this.ConsdrForm.valid) {
        debugger
        var m_data={
          "visitId": 0,
          "regId": 0,
          "consultantDocId":this.ConsdrForm.get("DoctorID").value.value || 0,
          "departmentId": this.ConsdrForm.get("Departmentid").value.value || 0
        }
          this._AppointmentlistService.EditConDoctor(m_data).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      // }
  }

  
  
  getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
  }


  onClear(val: boolean) {
      this.ConsdrForm.reset();
      this.dialogRef.close(val);
  }

  onClose(){
    this.dialogRef.close();
  }
}
