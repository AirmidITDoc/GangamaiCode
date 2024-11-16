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
  filteredOptionsDoc: Observable<string[]>;
  Doctor2List:any=[];
  DepartmentList:any=[];
  isDoctorSelected: boolean = false;
  isDepartmentSelected: boolean = false;
  filteredOptionsDep: Observable<string[]>;
  VisitId:any=0;
  RegId:any=0;

  constructor(
      public _AppointmentlistService: AppointmentlistService,
      public dialogRef: MatDialogRef<EditConsultantDoctorComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public datePipe: DatePipe,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.ConsdrForm = this._AppointmentlistService.createConsultatDrForm();
      this.getDepartmentList();
      this.getDoctor2List();
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


      this.filteredOptionsDep = this.ConsdrForm.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
    );

      this.filteredOptionsDoc = this.ConsdrForm.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoc(value) : this.Doctor2List.slice()),
    );

  }


  getDepartmentList() {
    var mode="Department"
           this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
               this.DepartmentList = data;
               console.log(data)
              this.filteredOptionsDep = this.ConsdrForm.get('Departmentid').valueChanges.pipe(
                   startWith(''),
                   map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
               );
             
           });
   
       }

       

  getDoctor2List() {
    var mode="ConDoctor"
    this._AppointmentlistService.getMaster(mode,1).subscribe(data => { this.Doctor2List = data; })
}


private _filterDoc(value: any): string[] {
  if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.Doctor2List.filter(option => option.text.toLowerCase().includes(filterValue));
  }

}
 
private _filterDep(value: any): string[] {
  if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      return this.DepartmentList.filter(option => option.text.toLowerCase().includes(filterValue));
  }

}


getOptionTextDoc(option) {

  return option && option.text ? option.text : '';

}
getOptionTextDep(option) {

  return option && option.text ? option.text : '';
}

OnChangeDoctorList1(departmentObj) {

  this.isDepartmentSelected = true;
  // this._AppointmentlistService.getDoctorMasterCombo(departmentObj).subscribe(
  //     data => {
  //         this.DoctorList = data;

  //         this.optionsDoc = this.DoctorList.slice();
  //         this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
  //             startWith(''),
  //             map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
  //         );
  //     })

  

}

  onSubmit() {
      // if (this.ConsdrForm.valid) {
        debugger
        var m_data={
          "visitId":2,// this.VisitId,
          "regId":1,// this.RegId,
          "consultantDocId":this.ConsdrForm.get("DoctorID").value.value || 0,
           "departmentId": this.ConsdrForm.get("Departmentid").value.value || 0
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
}
