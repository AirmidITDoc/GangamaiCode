import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppointmentlistService } from '../appointmentlist.service';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { VisitMaster } from '../../appointment/appointment.component';
import { VisitMaster1 } from '../appointment-list.component';
import { AirmidAutocompleteComponent } from 'app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component';


@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CrossConsultationComponent implements OnInit {
  crossconForm: FormGroup;
  date = new Date().toISOString();
  screenFromString = 'admission-form';
  Departmentid = 0;
  DoctorID = 0;
  DoctorID1 = 0
  registerObj1 = new VisitMaster1({});


  autocompleteModedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";

  // DD from old code ?
  // filteredOptionsDoc: any;
  docList: any = [];
  optionsDoctor: any[] = [];
  filteredOptionsdoc: Observable<string[]>;
  isdocSelected: boolean = false;

  constructor(public _AppointmentlistService: AppointmentlistService, private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CrossConsultationComponent>, public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, public toastr: ToastrService
  ) {
   
  }

  ngOnInit(): void {


    if (this.data.visitId > 0) {
      setTimeout(() => {
        this._AppointmentlistService.getVisitById(this.data.visitId).subscribe((response) => {
          this.registerObj1 = response;
          this.registerObj1.visitTime= this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm')
          console.log(this.registerObj1)
        });
      }, 500);
    }
    else {
      this.crossconForm.reset();

    }
    this.crossconForm = this.createCrossConForm();
    if (this.data)

      this.getdoctorList1();

    // this.filteredOptionsdoc = this.crossconForm.get('DoctorID1').valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filterDoctor(value)),

    // );


  }


  createCrossConForm() {
    
    return this.formBuilder.group({
      visitId: 0,
      regId: 0,
      visitDate: this.registerObj1.visitTime,
      visitTime: this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm'),
      unitId: this.registerObj1.unitId,
      patientTypeId: this.registerObj1.patientTypeId,
      consultantDocId: this.registerObj1.consultantDocId,
      refDocId: this.registerObj1.refDocId,
      tariffId: this.registerObj1.tariffId,
      companyId: this.registerObj1.companyId,
      addedBy: 1,
      updatedBy: 1,
      isCancelled: true,
      isCancelledBy: 0,
      isCancelledDate: new Date(),
      classId: this.registerObj1.classId,
      departmentId: this.registerObj1.departmentId,
      patientOldNew: this.registerObj1.patientOldNew,
      firstFollowupVisit: this.registerObj1.firstFollowupVisit,
      appPurposeId: 0,//this.registerObj1.VisitDate,
      followupDate: new Date(),
      crossConsulFlag: 1,
      phoneAppId: 0,// this.registerObj1.VisitDate,

    });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

   @ViewChild('ddldoctor') ddldoctor: AirmidAutocompleteComponent;
  onChangeDepartment(e) {
    this.ddldoctor.SetSelection(e.doctorID);
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
   
    this.registerObj1.departmentId=parseInt(this.crossconForm.get('departmentId').value)
    this.registerObj1.consultantDocId=parseInt(this.crossconForm.get('consultantDocId').value)
    this.registerObj1.visitTime=this.datePipe.transform(this.crossconForm.get('visitTime').value,'yyyy-MM-ddTHH:mm')
    this.registerObj1.visitId=0
    this.registerObj1.addedBy=0
    this.registerObj1.updatedBy=0
    console.log(this.registerObj1);
    this._AppointmentlistService.crossconsultSave(this.registerObj1).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }


  // onSubmit1() {
  //   

  //   var m_data = {
  //     "visitId": 0,
  //     "regId": 0,
  //     "visitDate": this.datePipe.transform(this.crossconForm.get("VisitDate").value, 'yyyy-MM-dd') || this.dateTimeObj.date,
  //     "visitTime": "2024-09-18T11:24:02.656Z",// this.datePipe.transform(this.crossconForm.get("VisitDate").value, 'yyyy-MM-dd HH:mm:ss'),
  //     "unitId": 0,
  //     "patientTypeId": 0,
  //     "consultantDocId": this.crossconForm.get('DoctorID1').value,
  //     "refDocId": 0,
  //     "tariffId": 0,
  //     "companyId": 0,
  //     "addedBy": 0,
  //     "updatedBy": 0,
  //     "isCancelledBy": 0,
  //     "isCancelled": true,
  //     "isCancelledDate": "2024-09-18T11:24:02.656Z",
  //     "classId": 0,
  //     "departmentId": this.crossconForm.get('Departmentid').value,
  //     "patientOldNew": 0,
  //     "firstFollowupVisit": 0,
  //     "appPurposeId": 0,
  //     "followupDate": "2024-09-18T11:24:02.656Z",
  //     "crossConsulFlag": 0,
  //     "phoneAppId": 0
  //   }
  //   console.log(this.crossconForm.value);
  //   this._AppointmentlistService.crossconsultSave(this.crossconForm.value).subscribe((response) => {
  //     this.toastr.success(response.message);
  //     this.onClear(true);
  //   }, (error) => {
  //     this.toastr.error(error.message);
  //   });
  //   // }
  // }
  selectChangedepartment($event) {
    
    this.crossconForm.get("departmentId").setValue($event.value)
   }

  onClear(val: boolean) {
    this.crossconForm.reset();
    this.dialogRef.close(val);
  }
  onClose() {
    this.dialogRef.close();
  }
  //

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
      console.log(this.docList)
      this.optionsDoctor = this.docList.slice();
      this.filteredOptionsdoc = this.docList.slice();
      // this.filteredOptionsdoc = this.crossconForm.get('DoctorID').valueChanges.pipe(
      //   startWith(''),
      //   map(value => value ? this._filterDoctor(value) : this.docList.slice()),
      // );

    });

  }

  private _filterDoctor(value: any): string[] {
    if (value) {
      const filterValue = value && value.firstName ? value.firstName.toLowerCase() : value.toLowerCase();
      return this.optionsDoctor.filter(option => option.firstName.toLowerCase().includes(filterValue));
    }

  }



}


