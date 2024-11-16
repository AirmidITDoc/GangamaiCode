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
  date: Date;
  screenFromString = 'admission-form';
  Doctor1List:any=[];
  DepartmentList:any=[];
  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;

  filteredOptionsDoc: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
  constructor( public _AppointmentlistService: AppointmentlistService, private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrossConsultationComponent>,   public datePipe: DatePipe,
    public _matDialog: MatDialog, public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.crossconForm = this.createCrossConForm();
    this.getDepartmentList();

    this.getDoctor1List();


    this.filteredOptionsDep = this.crossconForm.get('Departmentid').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
  );


  this.filteredOptionsDoc = this.crossconForm.get('DoctorID').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterDoc(value) : this.Doctor1List.slice()),
  );
  }


  createCrossConForm() {
    return this.formBuilder.group({
      Departmentid: ['', [
        Validators.required,
      ]],
      DoctorID:  ['', [
        Validators.required,
      ]],
      VisitDate: '',
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


  getDepartmentList() {
    var mode="Department"
           this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
               this.DepartmentList = data;
               console.log(data)
              
               this.filteredOptionsDep = this.crossconForm.get('Departmentid').valueChanges.pipe(
                   startWith(''),
                   map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
               );
             
           });
   
       }

       
       private _filterDep(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.DepartmentList.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }
           
    getDoctor1List() {
      var mode="ConDoctor"
     this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
         this.Doctor1List = data;
          this.filteredOptionsDoc = this.crossconForm.get('DoctorID').valueChanges.pipe(
             startWith(''),
             map(value => value ? this._filterDoc(value) : this.Doctor1List.slice()),
         );

     });
 }

 private _filterDoc(value: any): string[] {
  if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      return this.Doctor1List.filter(option => option.text.toLowerCase().includes(filterValue));
  }

}


getOptionTextDep(option) {

  return option && option.text ? option.text : '';
}


getOptionTextDoc(option) {

  return option && option.text ? option.text : '';

}

public onEnterdept(event): void {
  if (event.which === 13) {
      // if (value == undefined) {
      //     this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
      //         toastClass: 'tostr-tost custom-toast-warning',
      //     });
      //     return;
      // } else {
          // this.deptdoc.nativeElement.focus();
      // }
  }
}
OnChangeDoctorList(departmentObj) {
  debugger
         
          // this._AppointmentlistService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(
          //     data => {
          //         this.DoctorList = data;
          //         console.log(data)
          //         this.optionsDoc = this.DoctorList.slice();
          //         this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
          //             startWith(''),
          //             map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
          //         );
          //     })
  
          // if (this.configService.configParams.DoctorId) {
  
              // this.configService.configParams.DoctorId = 269;
              // const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
              // this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
              // this.doctorset();
          // }
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
            "consultantDocId":this.crossconForm.get('DoctorID').value.value || 0,
            "refDocId": 0,
            "tariffId": 0,
            "companyId": 0,
            "addedBy": 0,
            "updatedBy": 0,
            "isCancelledBy": 0,
            "isCancelled": true,
            "isCancelledDate":"2024-09-18T11:24:02.656Z",
            "classId": 0,
            "departmentId":this.crossconForm.get('Departmentid').value.value || 0,
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
}
