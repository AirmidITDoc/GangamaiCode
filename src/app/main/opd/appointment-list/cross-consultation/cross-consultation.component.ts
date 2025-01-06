import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AppointmentlistService } from '../appointmentlist.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { OperatorComparer } from 'app/core/models/gridRequest';

@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CrossConsultationComponent implements OnInit {
  crossconForm: UntypedFormGroup;
  date = new Date().toISOString();
  screenFromString = 'admission-form';
  Departmentid = 0;
  DoctorID = 0;
  DoctorID1 = 0
  autocompleteModedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";

  // DD from old code ?
  filteredOptionsDoc: any;


  constructor(public _AppointmentlistService: AppointmentlistService, private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CrossConsultationComponent>, public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, public toastr: ToastrService
  ) {
    if (this.data) {
      debugger
      console.log(this.data)
    }
  }

  ngOnInit(): void {

    this.crossconForm = this.createCrossConForm();
    if(this.data)
      
    this.getdoctorList1();

    this.filteredOptionsDoc = this.crossconForm.get('DoctorID1').valueChanges.pipe(
      startWith(''),
      map(value => this._filterDoctor(value)),

    );
  }


  createCrossConForm() {
    return this.formBuilder.group({
      Departmentid: ['', [
        Validators.required,
      ]],
      DoctorID: ['', [
        Validators.required,
      ]],
      DoctorID1: ['', [
        Validators.required,
      ]],
      VisitDate: [(new Date()).toISOString()],
      VisitTime: '',
      AuthorityName: '',
      ABuckleNo: '',
      PoliceStation: '',

    });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  getValidationMessages() {
    return {
      Departmentid: [
        { name: "required", Message: "Department Name is required" }
      ],
      DoctorID: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }

  onSubmit() {
    console.log(this.crossconForm.value);
    this._AppointmentlistService.crossconsultSave(this.crossconForm.value).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }


  onSubmit1() {
    debugger

    var m_data = {
      "visitId": 0,
      "regId": 0,
      "visitDate": this.datePipe.transform(this.crossconForm.get("VisitDate").value, 'yyyy-MM-dd') || this.dateTimeObj.date,
      "visitTime": "2024-09-18T11:24:02.656Z",// this.datePipe.transform(this.crossconForm.get("VisitDate").value, 'yyyy-MM-dd HH:mm:ss'),
      "unitId": 0,
      "patientTypeId": 0,
      "consultantDocId": this.crossconForm.get('DoctorID1').value,
      "refDocId": 0,
      "tariffId": 0,
      "companyId": 0,
      "addedBy": 0,
      "updatedBy": 0,
      "isCancelledBy": 0,
      "isCancelled": true,
      "isCancelledDate": "2024-09-18T11:24:02.656Z",
      "classId": 0,
      "departmentId": this.crossconForm.get('Departmentid').value,
      "patientOldNew": 0,
      "firstFollowupVisit": 0,
      "appPurposeId": 0,
      "followupDate": "2024-09-18T11:24:02.656Z",
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
    // }
  }
  selectChangedepartment($event){}

  onClear(val: boolean) {
    this.crossconForm.reset();
    this.dialogRef.close(val);
  }
  onClose() {
    this.dialogRef.close();
  }
  //
  docList: any = [];
  optionsDoctor: any[] = [];
  filteredOptionsdoc: Observable<string[]>;
  isdocSelected: boolean = false;
  getOptionTextDoc(option) {
    return option && option.firstName ? option.firstName : '';
  }

  getdoctorList1() {
    var d = {
      "first": 0,
      "rows": 25,
      sortField: "doctorId",
      sortOrder: 0,
      filters: [
        { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.Contains },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      "exportType": "JSON"

    }


    this._AppointmentlistService.getdoctorList(d).subscribe(data => {
      this.docList = data.data;
      console.log(data.data)
      this.optionsDoctor = this.docList.slice();
      this.filteredOptionsdoc = this.crossconForm.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctor(value) : this.docList.slice()),
      );

    });

  }

  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.firstName ? value.firstName.toLowerCase() : value.toLowerCase();
      return this.optionsDoctor.filter(option => option.firstName.toLowerCase().includes(filterValue));
    }

  }


  
}