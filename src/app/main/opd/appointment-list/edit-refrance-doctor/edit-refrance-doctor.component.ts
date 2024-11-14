import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppointmentlistService } from '../appointmentlist.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-refrance-doctor',
  templateUrl: './edit-refrance-doctor.component.html',
  styleUrls: ['./edit-refrance-doctor.component.scss']
})
export class EditRefranceDoctorComponent implements OnInit {

  RegID:any=0;
  filteredOptionsDoc: any;
  RefDoctorList: any = [];
  isDoctorSelected: boolean = false;
  RefrancedrForm: FormGroup;
  VisitId:any;
  constructor(
      public _AppointmentlistService: AppointmentlistService,
      public dialogRef: MatDialogRef<EditRefranceDoctorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public datePipe: DatePipe,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.RefrancedrForm = this._AppointmentlistService.createRefranceDrForm();
      var m_data = {
        refDoctorId: this.data?.refDoctorId,
        // departmentid: this.data?.departmentid,
        // roomId: this.data?.roomId,
        // isAvailible: JSON.stringify(this.data?.isAvailible),
         // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.RefrancedrForm.patchValue(m_data);
if(this.data){
this.RegID=this.data.RegID
this.VisitId=this.data.VisitId
}
      this.getRefDoctorList();
   
    this.filteredOptionsDoc = this.RefrancedrForm.get('refDoctorId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterrefDoctorId(value)),

    );

  }

  
  private _filterrefDoctorId(value: any): string[] {
    if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      return this.RefDoctorList.filter(option => option.text.toLowerCase().includes(filterValue));
    }
  }

  getRefDoctorList() {
    var mode="RefDoctor"
    this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
      this.RefDoctorList = data;
      // if (this.PatientHeaderObj) {
      //   const ddValue = this.RefDoctorList.filter(c => c.DoctorId == this.PatientHeaderObj.RefDocId);
      //   this.searchFormGroup.get('refDoctorId').setValue(ddValue[0]);
      //   this.searchFormGroup.updateValueAndValidity();
      //   return;
      // }
    });
  }

  getOptionTextDoc(option) {
    return option && option.text ? option.text : '';
  }
  onSubmit() {
      // if (this.RefrancedrForm.valid) {
        debugger
        var m_data={
          "visitId":this.VisitId,
          "regId": this.RegID,
          "refDocId": this.RefrancedrForm.get("refDoctorId").value.value || 0
          
        }
          this._AppointmentlistService.EditRefDoctor(m_data).subscribe((response) => {
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
      this.RefrancedrForm.reset();
      this.dialogRef.close(val);
  }

  onClose(){
    this.dialogRef.close();
  }
}
