import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentlistService } from '../appointmentlist.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { VisitMaster1 } from '../appointment-list.component';

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
@ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(
    public _AppointmentlistService: AppointmentlistService,
    public dialogRef: MatDialogRef<EditConsultantDoctorComponent>,
    private _formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.ConsdrForm = this.createConsultatDrForm();

  }

  createConsultatDrForm() {
    return this._formBuilder.group({
        visitId:  this.data.visitId,
        regId: this.data.regId,
        consultantDocId: this.data.doctorId,
        departmentId: this.data.departmentId,
    });
}

  onSubmit() {
    if (this.ConsdrForm.valid) {

      console.log(this.ConsdrForm.value)
      this._AppointmentlistService.EditConDoctor(this.ConsdrForm.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      });
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
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
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
