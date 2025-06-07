import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../appointmentlist.service';

@Component({
  selector: 'app-edit-refrance-doctor',
  templateUrl: './edit-refrance-doctor.component.html',
  styleUrls: ['./edit-refrance-doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditRefranceDoctorComponent implements OnInit {

  ReferdrForm: FormGroup;
  VisitId: any = 0;
  autocompleteModerefdoc: string = "ConDoctor";
  filteredOptionsRefrenceDoc: any;
  isRefDoctorSelected: boolean = false;

  constructor(
    public _AppointmentlistService: AppointmentlistService,
    public _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
    public dialogRef: MatDialogRef<EditRefranceDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.ReferdrForm = this.createReferDrForm();
    this.ReferdrForm.markAllAsTouched();
    this.ReferdrForm.patchValue(this.data);
  }

  createReferDrForm() {
    return this._formBuilder.group({
      visitId: [this.data?.visitId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDocId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }

  onSubmit() {
    if (!this.ReferdrForm.invalid) {
      this._AppointmentlistService.EditRefDoctor(this.ReferdrForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } else {
      let invalidFields = [];
      if (this.ReferdrForm.invalid) {
        for (const controlName in this.ReferdrForm.controls) {
          if (this.ReferdrForm.controls[controlName].invalid) { invalidFields.push(`Edit Doctor Form: ${controlName}`); }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

    }
  }
  RefDoctorId = 0;
  onCancleRefDoc() {
    this.ReferdrForm.get("refDocId").setValue(0)
    this._AppointmentlistService.EditRefDoctor(this.ReferdrForm.value).subscribe((response) => {
      this.onClear(true);
    });
  }

  getValidationMessages() {
    return {
      refDocId: [
        { name: "required", Message: "Ref Doctor Name is required" }
      ]
    };
  }
  onClear(val: boolean) {
    this.ReferdrForm.reset();
    this.dialogRef.close(val);
  }

  onClose() {
    this.dialogRef.close();
  }

  refdocId = 0
  selectChangerefdoc(obj: any) {
    this.refdocId = obj
  }
}
