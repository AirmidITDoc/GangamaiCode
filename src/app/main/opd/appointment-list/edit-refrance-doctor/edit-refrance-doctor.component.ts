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


  RefrancedrForm: FormGroup;

  VisitId: any = 0;
  RegId: any = 0;
  DoctorID=0
  autocompleteModerefdoc: string = "ConDoctor";
  filteredOptionsRefrenceDoc: any;
  RefDoctorList: any = [];
  isRefDoctorSelected: boolean = false;
  screenFromString = 'admission-form';
  
  constructor(
    public _AppointmentlistService: AppointmentlistService,
    public _formBuilder: UntypedFormBuilder,private _FormvalidationserviceService: FormvalidationserviceService,
    public dialogRef: MatDialogRef<EditRefranceDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog:MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.RefrancedrForm = this.createRefranceDrForm();
      this.RefrancedrForm.patchValue(this.data);
}

    createRefranceDrForm() {
          return this._formBuilder.group({
              visitId: [this.data.visitId,[this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
             refDocId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  });}
  

  onSubmit() {
    if (!this.RefrancedrForm.invalid) {
   
    console.log(this.RefrancedrForm.value);
    this._AppointmentlistService.EditRefDoctor(this.RefrancedrForm.value).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    });
    }else {
      let invalidFields = [];
      if (this.RefrancedrForm.invalid) {
          for (const controlName in this.RefrancedrForm.controls) {
              if (this.RefrancedrForm.controls[controlName].invalid) { invalidFields.push(`Edit Doctor Form: ${controlName}`); }
          }
      }
    
      if (invalidFields.length > 0) {
          invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

  }
  }
  RefDoctorId=0;
  onCancleRefDoc() {
    this.RefrancedrForm.get("refDocId").setValue(0)
    console.log(this.RefrancedrForm.value);
    this._AppointmentlistService.EditRefDoctor(this.RefrancedrForm.value).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    });
    }

 
  getValidationMessages() {
    return {
      refDocId: [
            { name: "required", Message: "Doctor Name is required" }
        ]
    };
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClear(val: boolean) {
    this.RefrancedrForm.reset();
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
