import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppointmentlistService } from '../appointmentlist.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-edit-refrance-doctor',
  templateUrl: './edit-refrance-doctor.component.html',
  styleUrls: ['./edit-refrance-doctor.component.scss']
})
export class EditRefranceDoctorComponent implements OnInit {


  RefrancedrForm: FormGroup;
  DepartmentList: any = []
  Doctor1List: any = []
  isDoctorSelected: boolean = false;

  filteredOptionsDoc: Observable<string[]>;
  VisitId:any=0;
  RegId:any=0;

  constructor(
    public _AppointmentlistService: AppointmentlistService,
    public dialogRef: MatDialogRef<EditRefranceDoctorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public datePipe: DatePipe,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.RefrancedrForm = this._AppointmentlistService.createRefranceDrForm();

    this.getDoctor1List();
    if(this.data){
this.RegId=this.data.regId
this.VisitId=this.data.visitId
    }

    var m_data = {
      refDoctorId: this.data?.refDoctorId,
      // departmentid: this.data?.departmentid,
      // roomId: this.data?.roomId,
      // isAvailible: JSON.stringify(this.data?.isAvailible),
      // isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.RefrancedrForm.patchValue(m_data);



    this.filteredOptionsDoc = this.RefrancedrForm.get('DoctorID').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterDoc(value) : this.Doctor1List.slice()),
    );


  }



  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.Doctor1List.filter(option => option.text.toLowerCase().includes(filterValue));
    }

  }

  getOptionTextDoc(option) {

    return option && option.text ? option.text : '';

  }

  getDoctor1List() {
    var mode = "RefDoctor"
    this._AppointmentlistService.getMaster(mode, 1).subscribe(data => {
      this.Doctor1List = data;
      this.Doctor1List = this.Doctor1List.slice();
      this.filteredOptionsDoc = this.RefrancedrForm.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoc(value) : this.Doctor1List.slice()),
      );

    });
  }

  onSubmit() {
    // if (this.RefrancedrForm.valid) {
    debugger
    var m_data = {
      "visitId": this.VisitId,
      "regId":this.RegId,
      "refDocId": this.RefrancedrForm.get("DoctorID").value.value || 0

    }
    console.log(m_data);
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

  onClose() {
    this.dialogRef.close();
  }
}
