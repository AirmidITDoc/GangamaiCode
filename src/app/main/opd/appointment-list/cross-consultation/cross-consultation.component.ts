import { Component, OnInit } from '@angular/core';
import { AppointmentlistService } from '../appointmentlist.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-cross-consultation',
  templateUrl: './cross-consultation.component.html',
  styleUrls: ['./cross-consultation.component.scss']
})
export class CrossConsultationComponent implements OnInit {
  crossconForm:FormGroup;
  date= new Date().toISOString();
  screenFromString = 'admission-form';

  autocompleteModedepartment: string = "Department";
  autocompleteModedeptdoc: string = "ConDoctor";


  constructor( public _AppointmentlistService: AppointmentlistService, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrossConsultationComponent>,   public datePipe: DatePipe,
    public _matDialog: MatDialog, public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.crossconForm = this.createCrossConForm();
   
  }


  createCrossConForm() {
    return this.formBuilder.group({
      Departmentid: ['', [
        Validators.required,
      ]],
      DoctorID:  ['', [
        Validators.required,
      ]],
      VisitDate:  [(new Date()).toISOString()],
      VisitTime: '',
      AuthorityName: '',
      ABuckleNo: '',
      PoliceStation: '',

    });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
  }



  onSubmit() {
    debugger
  
    var m_data = {
      "visitId": 0,
            "regId": 0,
            "visitDate":"2024-09-18T11:24:02.656Z",//  this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "visitTime":"2024-09-18T11:24:02.656Z",//this.dateTimeObj.time,
            "unitId": 0,
            "patientTypeId": 0,
            "consultantDocId":this.deptdocId,
            "refDocId": 0,
            "tariffId": 0,
            "companyId": 0,
            "addedBy": 0,
            "updatedBy": 0,
            "isCancelledBy": 0,
            "isCancelled": true,
            "isCancelledDate":"2024-09-18T11:24:02.656Z",
            "classId": 0,
            "departmentId":this.departmentId,
            "patientOldNew": 0,
            "firstFollowupVisit": 0,
            "appPurposeId": 0,
            "followupDate":"2024-09-18T11:24:02.656Z",
            "crossConsulFlag": 0,
            "phoneAppId": 0
    }
    console.log(m_data);
       this._AppointmentlistService.crossconsultSave(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }

  onClear(val: boolean) {
    this.crossconForm.reset();
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
