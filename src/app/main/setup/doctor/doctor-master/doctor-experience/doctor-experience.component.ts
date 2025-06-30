import { Component, Inject } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DoctorMasterService } from '../doctor-master.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-doctor-experience',
  templateUrl: './doctor-experience.component.html',
  styleUrls: ['./doctor-experience.component.scss']
})
export class DoctorExperienceComponent {
  ExperienceForm: FormGroup
  autocompleteModecountry: string = "Country";
  autocompleteModecity: string = "City";

  registerObj = new ExperienceDetail({})
  duration = 0
  expyear = 0
  expmonth = 0
  expday = 0
  start: any
  end: any
  constructor(public _DoctorMasterService: DoctorMasterService,
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DoctorExperienceComponent>,

  ) {
  }

  ngOnInit(): void {
    this.ExperienceForm = this.createExperienceForm();
    this.ExperienceForm.markAllAsTouched();
  }

  createExperienceForm() {
    return this.formBuilder.group({

      doctorId: [0],

      hospitalName: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      startDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      endDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      YearsExp:['', [Validators.required]],
      MonthExp: [''],
      DaysExp: ['']

    });
  }

  isDatePckrDisabled: boolean = false;
  onChangeDate() {

    
    this.start = this.datePipe.transform(this.ExperienceForm.get('startDate').value, "yyyy-MM-dd") || "01/01/1900"
    this.end = this.datePipe.transform(this.ExperienceForm.get('endDate').value, "yyyy-MM-dd") || "01/01/1900"


    const start = new Date(this.ExperienceForm.get("startDate").value);
    const end = new Date(this.ExperienceForm.get("endDate").value);

    this.expyear = end.getFullYear() - start.getFullYear();
    this.expmonth = end.getMonth() - start.getMonth();
    this.expday = end.getDate() - start.getDate();

    if (this.expday < 0) {
      this.expmonth--;
      this.expday += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }

    if (this.expmonth < 0) {
      this.expyear--;
      this.expmonth += 12;
    }


  }

  onSubmit() {
    if (!this.ExperienceForm.invalid) {
      this.dialogRef.close(this.ExperienceForm.value)
    } else {
      let invalidFields = [];
      if (this.ExperienceForm.invalid) {
        for (const controlName in this.ExperienceForm.controls) {
          if (this.ExperienceForm.controls[controlName].invalid) { invalidFields.push(`Experience Form: ${controlName}`); }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }
    }
  }


  onClear(val: boolean) {
    this.ExperienceForm.reset();
    this.dialogRef.close();
  }

  getValidationMessages() {
    return {
      countryId: [],
      City: [],

    };
  }
  onClose() {
    this.dialogRef.close()
  }
}

export class ExperienceDetail {
  hospitalName: any;
  designation: any;
  startDate: any;
  endDate: any;
  // YearsExp: any;

  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(ExperienceDetail) {
    {
      this.hospitalName = ExperienceDetail.hospitalName || '';
      this.designation = ExperienceDetail.designation || '';
      this.startDate = ExperienceDetail.startDate || '';
      this.endDate = ExperienceDetail.endDate || '';
      // this.YearsExp = ExperienceDetail.YearsExp || '';


    }
  }
}