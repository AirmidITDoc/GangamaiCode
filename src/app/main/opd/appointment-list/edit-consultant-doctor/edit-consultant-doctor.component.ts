import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { VisitMaster1 } from '../appointment-list.component';
import { AppointmentlistService } from '../appointmentlist.service';

@Component({
  selector: 'app-edit-consultant-doctor',
  templateUrl: './edit-consultant-doctor.component.html',
  styleUrls: ['./edit-consultant-doctor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditConsultantDoctorComponent implements OnInit {

  ConsdrForm: FormGroup;

  VisitId: any = 0;
  RegId: any = 0;
  Departmentid = 0;
  DoctorID = 0;
  regobj=new VisitMaster1({})
  autocompletedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";
  screenFromString = 'admission-form';
@ViewChild('ddldoctor') ddldoctor: AirmidDropDownComponent;

  constructor(
    public _AppointmentlistService: AppointmentlistService,
    public dialogRef: MatDialogRef<EditConsultantDoctorComponent>,
    private _formBuilder: UntypedFormBuilder,private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    console.log(this.data)
   
    setTimeout(() => {
      this._AppointmentlistService.getDoctorsByDepartment(this.data.departmentId).subscribe((data:any)=>{
        this.ddldoctor.options=data;
        this.ddldoctor.bindGridAutoComplete();
            });
  }, 500);
  this.ConsdrForm = this.createConsultatDrForm();
  this.ConsdrForm.markAllAsTouched();
  this.ConsdrForm.get("consultantDocId").setValue(this.data.doctorId)
  }

  createConsultatDrForm() {
    return this._formBuilder.group({
        visitId:  [this.data.visitId,[this._FormvalidationserviceService.onlyNumberValidator()]],
        regId: [this.data.regId,[this._FormvalidationserviceService.onlyNumberValidator()]],
        consultantDocId:[this.data.doctorId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        departmentId:  [this.data.departmentId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
       
    });
}

  onSubmit() {
    if (this.ConsdrForm.valid) {
  console.log(this.ConsdrForm.value)
      this._AppointmentlistService.EditConDoctor(this.ConsdrForm.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      });
    }else {
      let invalidFields = [];
      if (this.ConsdrForm.invalid) {
          for (const controlName in this.ConsdrForm.controls) {
              if (this.ConsdrForm.controls[controlName].invalid) { invalidFields.push(`Edit Doctor Form: ${controlName}`); }
          }
      }
    
      if (invalidFields.length > 0) {
          invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

  }
  }
getValidationMessages() {
    return {
      departmentId: [
        { name: "required", Message: "Department Name is required" }
      ],
      consultantDocId: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }

  selectChangedepartment(obj: any) {
    this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddldoctor.options = data;
      this.ddldoctor.bindGridAutoComplete();
  });
   }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onClear(val: boolean) {
    this.ConsdrForm.reset();
    this.dialogRef.close(val);
  }

  onClose() {
    this.dialogRef.close();
  }


  
}
