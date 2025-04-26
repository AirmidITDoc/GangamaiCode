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
import { VisitMaster1 } from '../appointment-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AuthenticationService } from 'app/core/services/authentication.service';


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

  screenFromString = 'appointment';

  registerObj1 = new VisitMaster1({});

  autocompletedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";
  @ViewChild('ddldoctor') ddldoctor: AirmidDropDownComponent;

  docList: any = [];
  optionsDoctor: any[] = [];
  filteredOptionsdoc: Observable<string[]>;
  isdocSelected: boolean = false;
  regId = 0;
  constructor(public _AppointmentlistService: AppointmentlistService, private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<CrossConsultationComponent>, public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog, public toastr: ToastrService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this._AppointmentlistService.getDoctorsByDepartment(this.data.departmentId).subscribe((data: any) => {
        this.ddldoctor.options = data;
        this.ddldoctor.bindGridAutoComplete();
      });
    }, 500);
    // console.log(this.data)

    this.crossconForm = this.createCrossConForm();
    this.crossconForm.markAllAsTouched();
    this.crossconForm.get("consultantDocId").setValue(this.data.doctorId)
  }


  createCrossConForm() {

    return this.formBuilder.group({
      visitId: 0,
      regId: this.data.regId,
      visitDate: "",// this.registerObj1.visitTime,
      visitTime: " ",// this.datePipe.transform(new Date(),'yyyy-MM-ddTHH:mm'),
      unitId: 1,// this.data.unitId,
      patientTypeId: this.data.patientTypeId,
      consultantDocId: ['', Validators.required],
      refDocId: this.data.refDocId,
      tariffId: this.data.tariffId,
      companyId: this.data.companyId,
      addedBy: this.accountService.currentUserValue.userId,
      updatedBy: this.accountService.currentUserValue.userId,
      isCancelled: true,
      isCancelledBy: 0,
      isCancelledDate: new Date(),
      classId: this.data.classId,
      departmentId: [this.data.departmentId, Validators.required],
      patientOldNew: this.data.patientOldNew,
      firstFollowupVisit: 0,
      appPurposeId: 0,//this.registerObj1.VisitDate,
      followupDate: new Date(),
      crossConsulFlag: 1,
      phoneAppId: 0,// this.registerObj1.VisitDate,

    });
  }

  onSubmit() {
    console.log(this.crossconForm.value);

    let data = this.crossconForm.value;
    data.departmentId = this.crossconForm.get('departmentId').value
    data.consultantDocId = parseInt(this.crossconForm.get('consultantDocId').value)
    data.visitTime = this.datePipe.transform(this.crossconForm.get('visitTime').value, 'yyyy-MM-ddTHH:mm')
    data.visitDate = this.datePipe.transform(this.crossconForm.get('visitTime').value, 'yyyy-MM-dd')
    data.visitId = 0;
    data.addedBy = this.accountService.currentUserValue.userId,
    data.updatedBy = this.accountService.currentUserValue.userId

    if(this.crossconForm.valid){
    this._AppointmentlistService.crossconsultSave(data).subscribe((response) => {
    this.toastr.success(response);
      this.onClear(true);
    });
  }else {
    let invalidFields = [];
    if (this.crossconForm.invalid) {
        for (const controlName in this.crossconForm.controls) {
            if (this.crossconForm.controls[controlName].invalid) { invalidFields.push(`Cross Consultation Form: ${controlName}`); }
        }
    }
  
    if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
    }

  }
}


  selectChangedepartment(obj: any) {
    this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddldoctor.options = data;
      this.ddldoctor.bindGridAutoComplete();
    });
  }


  getValidationMessages() {
    return {
      Departmentid: [
        { name: "required", Message: "Department Name is required" }
      ],
      consultantDocId: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClear(val: boolean) {
    this.crossconForm.reset();
    this.dialogRef.close(val);
  }
  onClose() {
    this.dialogRef.close();
  }



}


