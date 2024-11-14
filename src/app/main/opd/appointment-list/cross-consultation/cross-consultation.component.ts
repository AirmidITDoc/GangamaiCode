import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppointmentlistService } from '../appointmentlist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDetailObj } from '../../appointment/appointment.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CrossConsultationComponent implements OnInit {
  crossconForm:FormGroup;

  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: AdmissionPersonlModel;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();
  DepartmentList: any = [];
  DoctorList: any = [];
  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;

  filteredOptionsDep: Observable<string[]>;
  // filteredOptionsDep: any;
  // filteredOptionsDoc: any;
  filteredOptionsDoc: Observable<string[]>;
  saveflag: boolean = true;

  optionsDep: any[] = [];
  optionsDoc: any[] = [];
  PatientHeaderObj: AdvanceDetailObj;
  VisitId: any;
  RegId:any;
  PatientName: any;
  vUnitId: any;
  vPatienttypeId: any;
  vOPIPNo: any;
  VisitDate: any;
  date: Date;


  constructor(public _AppointmentlistService: AppointmentlistService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<CrossConsultationComponent>,
    private router: Router
  ) {
    
    this.date = new Date();

    if (this.data) {
      this.selectedAdvanceObj = data;
      console.log(this.selectedAdvanceObj);
      this.PatientHeaderObj = this.data;
      this.registerObj1 = this.data;
      console.log(this.registerObj1);
      this.VisitId = this.selectedAdvanceObj.VisitId;
      this.RegId = this.selectedAdvanceObj.RegId;
      
      this.PatientName = this.PatientHeaderObj.PatientName;
      this.vOPIPNo=this.PatientHeaderObj.RegId;
      this.vOPIPNo=this.selectedAdvanceObj.OPDNo;
      this.VisitDate=this.PatientHeaderObj.VistDateTime;
      this.selectedAdvanceObj.AgeDay= this.selectedAdvanceObj.AgeDay.trim();
      this.selectedAdvanceObj.AgeMonth= this.selectedAdvanceObj.AgeMonth.trim();
      this.selectedAdvanceObj.AgeYear= this.selectedAdvanceObj.AgeYear.trim();
     
    }
  }

  ngOnInit(): void {
    this.crossconForm = this.createCrossConForm();
    this.getDepartmentList();
    this.getDoctorList();
    this.setDropdownObjs();

   
    this.filteredOptionsDep = this.crossconForm.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => this._filterdept(value)),

    );

    this.filteredOptionsDoc = this.crossconForm.get('DoctorID').valueChanges.pipe(
      startWith(''),
      map(value => this._filteradmittedDoctor1(value)),

    );
  }

  createCrossConForm() {
    return this.formBuilder.group({
      Departmentid: ['', [
        Validators.required,
      ]],
      DoctorID:  ['', [
        Validators.required,
      ]],
      VisitDate: '',
      VisitTime: '',
     

    });
  }

  setDropdownObjs() {
    debugger
    const toSelect = this.DepartmentList.find(c => c.DepartmentId == this.registerObj1.DepartmentId);
    this.crossconForm.get('Departmentid').setValue(toSelect);

    const toSelect1 = this.DoctorList.find(c => c.DoctorId == this.registerObj1.DoctorId);
    this.crossconForm.get('DoctorID').setValue(toSelect1);
    
    this.crossconForm.updateValueAndValidity();
  }
 
  

  registerObj1 = new AdmissionPersonlModel({});
  
  getDepartmentList() {
    var mode="Department"
    this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
      this.DepartmentList = data;
      console.log(data)
    //   if (this.registerObj1) {
    //     const ddValue = this.DepartmentList.filter(c => c.DepartmentId == this.registerObj1.DepartmentId);
    //     this.crossconForm.get('Departmentid').setValue(ddValue[0]);
    //     //  this.OnChangeDoctorList(this.registerObj1);
    //     this.crossconForm.updateValueAndValidity();
    //     return;
    //   }
    });

  }

  getDoctorList() {
    var mode="ConDoctor"

    this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
      this.DoctorList = data;
      console.log(data)
      if (this.data) {
        // const ddValue = this.DoctorList.filter(c => c.DoctorId == this.registerObj1.doctorId);
        // this.crossconForm.get('DoctorID').setValue(ddValue[0]);
        this.crossconForm.updateValueAndValidity();
        return;
      }
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
  
    // this.crossconForm.get('DoctorID').reset();
    // this.isDepartmentSelected = true;
    // this._AppointmentlistService.getMaster(departmentObj.DepartmentId,1).subscribe(
    //   data => {
    //     this.DoctorList = data;
    //     // this.crossconForm.get('DoctorId').setValue(this.DoctorList[0]);      
    //     return;
    //   });
    //   this.filteredOptionsDoc = this.crossconForm.get('DoctorID').valueChanges.pipe(
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
  public onEnterdeptdoc(event): void {
    if (event.which === 13) {
      
      this.saveflag = false;
    }
  }
  onChangeDoctor(option) {
    if (option)
      this.saveflag = false;
  }


  
  getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
  }


  onSubmit() {
    debugger
   

    this.RegId=165577
    if(!this.DoctorList.some(item => item.value ===this.crossconForm.get('DoctorID').value.value)){
      this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.crossconForm.get('Departmentid').value){
      if(!this.DepartmentList.some(item => item.value ===this.crossconForm.get('Departmentid').value.value)){
        this.toastr.warning('Please Select valid DepartmentName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    var m_data = {
      "visitId": 0,
            "regId":  this.RegId,
            "visitDate":"2024-09-18T11:24:02.656Z",//  this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "visitTime":"2024-09-18T11:24:02.656Z",//this.dateTimeObj.time,
            "unitId": 0,
            "patientTypeId": 0,
            "consultantDocId":parseInt(this.crossconForm.get('DoctorID').value.value)|| 0,
            "refDocId": 0,
            "tariffId": 0,
            "companyId": 0,
            "addedBy": 0,
            "updatedBy": 0,
            "isCancelledBy": 0,
            "isCancelled": true,
            "isCancelledDate":"2024-09-18T11:24:02.656Z",
            "classId": 0,
            "departmentId":parseInt(this.crossconForm.get('Departmentid').value.value) || 0,
            "patientOldNew": 0,
            "firstFollowupVisit": 0,
            "appPurposeId": 0,
            "followupDate":"2024-09-18T11:24:02.656Z",
            "crossConsulFlag": 0,
            "phoneAppId": 0
    }
    console.log(m_data);
       this._AppointmentlistService.crossconsultSave(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }

  onClear(val: boolean) {
    this.crossconForm.reset();
    this.dialogRef.close(val);
  }
  onClose(){
    this.dialogRef.close();
  }
}
