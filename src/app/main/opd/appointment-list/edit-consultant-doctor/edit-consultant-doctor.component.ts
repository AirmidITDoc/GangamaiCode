import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppointmentlistService } from '../appointmentlist.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-consultant-doctor',
  templateUrl: './edit-consultant-doctor.component.html',
  styleUrls: ['./edit-consultant-doctor.component.scss']
})
export class EditConsultantDoctorComponent implements OnInit {

  ConsdrForm: FormGroup;

  VisitId:any=0;
  RegId:any=0;

  autocompleteModedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";


  constructor(
      public _AppointmentlistService: AppointmentlistService,
      public dialogRef: MatDialogRef<EditConsultantDoctorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public datePipe: DatePipe,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.ConsdrForm = this._AppointmentlistService.createConsultatDrForm();
    
      if(this.data){
        this.RegId=this.data.regId
        this.VisitId=this.data.visitId
            }

            
      var m_data = {
        doctorID: this.data?.doctorID,
        departmentid: this.data?.departmentid,
        // roomId: this.data?.roomId,
        // isAvailible: JSON.stringify(this.data?.isAvailible),
         // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.ConsdrForm.patchValue(m_data);


  }



  onSubmit() {
      // if (this.ConsdrForm.valid) {
        debugger
        var m_data={
          "visitId":2,// this.VisitId,
          "regId":1,// this.RegId,
          "consultantDocId":this.deptdocId,
           "departmentId": this.departmentId
        }
        console.log(m_data)
          this._AppointmentlistService.EditConDoctor(m_data).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      // }
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
  }


  onClear(val: boolean) {
      this.ConsdrForm.reset();
      this.dialogRef.close(val);
  }

  onClose(){
    this.dialogRef.close();
  }

  departmentId:any=0;
  deptdocId=0;
  selectChangedepartment(obj: any){
    console.log(obj);
    this.departmentId=obj.value
  }
  
  selectChangedeptdoc(obj: any){
    console.log(obj);
    this.deptdocId=obj.value
  }
}