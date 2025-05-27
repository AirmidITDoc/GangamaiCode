import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppointmentlistService } from '../appointmentlist.service';
import { UntypedFormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
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
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';


@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CrossConsultationComponent implements OnInit {
  crossconForm: FormGroup;
  @Input() control: AbstractControl | null = null;
  
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
    private accountService: AuthenticationService,private _FormvalidationserviceService: FormvalidationserviceService,
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
   
    this.crossconForm = this.createCrossConForm();
    this.crossconForm.markAllAsTouched();
    this.crossconForm.get("consultantDocId").setValue(this.data.doctorId)
  }


  createCrossConForm() {

    return this.formBuilder.group({
      visitId:  [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      regId: [this.data.regId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      visitDate: "",
      visitTime: " ",
      unitId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      patientTypeId: this.data.patientTypeId,
      consultantDocId:   [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDocId:[ this.data.refDocId,[this._FormvalidationserviceService.onlyNumberValidator()]],
      tariffId:[ this.data.tariffId,[this._FormvalidationserviceService.onlyNumberValidator()]],
      companyId:[ this.data.companyId,[this._FormvalidationserviceService.onlyNumberValidator()]],
      addedBy: [this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      updatedBy: [this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      isCancelled: true,
      isCancelledBy:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: new Date(),
      classId:[ this.data.classId,[this._FormvalidationserviceService.onlyNumberValidator()]],
      departmentId: [this.data.departmentId, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      patientOldNew: this.data.patientOldNew,
      firstFollowupVisit: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      appPurposeId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      followupDate: new Date(),
      crossConsulFlag: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      phoneAppId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],

    });
  }

  onSubmit() {
    console.log(this.crossconForm.value);

    let data = this.crossconForm.value;
    data.departmentId = this.crossconForm.get('departmentId').value
    data.consultantDocId = parseInt(this.crossconForm.get('consultantDocId').value)
     this.crossconForm.get('visitDate').setValue(this.datePipe.transform(this.crossconForm.get('visitDate').value, 'yyyy-MM-dd'))
      this.crossconForm.get('visitTime').setValue(this.datePipe.transform(this.crossconForm.get('visitTime').value, 'yyyy-MM-ddTHH:mm'))

     console.log(this.crossconForm.value)

    if(this.crossconForm.valid){
    this._AppointmentlistService.crossconsultSave(this.crossconForm.value).subscribe((response) => {
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


