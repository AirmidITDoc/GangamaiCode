import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { AppointmentlistService } from '../appointmentlist.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

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
    public _formBuilder: UntypedFormBuilder,
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
              visitId: 0,
              // regId:this.data.regId,
              refDocId: ['', [
                  Validators.required, notEmptyOrZeroValidator()]],
  
          });
      }
  

  onSubmit() {
    if (this.RefrancedrForm.valid) {
   
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
    console.log(obj);
    this.refdocId = obj
  }
}
function notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return value > 0 ? null : { greaterThanZero: { value: value } };
      };
}