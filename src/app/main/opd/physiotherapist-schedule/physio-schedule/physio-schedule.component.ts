import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PhysiotherapistScheduleService } from '../physiotherapist-schedule.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { element } from 'protractor';
import { PhysioScheduleDetailComponent } from '../physio-schedule-detail/physio-schedule-detail.component';

@Component({
  selector: 'app-physio-schedule',
  templateUrl: './physio-schedule.component.html',
  styleUrls: ['./physio-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PhysioScheduleComponent implements OnInit {
 displayingcolumns = [ 
    'SessionStartdate',
    'Intervals',
    'NoSessions',
    'SessionEndDate',
    'IsCompleted',
    'Comments', 
    'AddedBy',
    'Action'
  ]

  startDate: string = '';
  specificDate: Date;
  vNOSessions: any = 0;
  vNOIntervals: any = 0;
  scheduleDates: any = []; 
    PatientListfilteredOptions: any;
  noOptionFound: any;
  selectedAdvanceObj: any;
  PatientName: any;
  isRegIdSelected: boolean = false;
   screenFromString ='physio-form'; 
   dateTimeObj:any;
    RegId:any;


   dSchedulerDetList = new MatTableDataSource<scheduleList>()

  constructor(
    public _PhysiotherapistScheduleService: PhysiotherapistScheduleService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PhysioScheduleComponent>,
    private _loggedAcount: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.selectedAdvanceObj = this.data;
      this.PatientName = this.selectedAdvanceObj?.PatientName;
      this.RegId = this.selectedAdvanceObj.RegId ;
      console.log(this.selectedAdvanceObj)
      //this.getschedulerdetlist(this.selectedAdvanceObj);
    } 
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  // Patient Search;
  getSearchList() {
    var m_data = {
      "Keyword": `${this._PhysiotherapistScheduleService.SchedulerForm.get('RegId').value}%`
    }
    this._PhysiotherapistScheduleService.getPatientVisitedListSearch(m_data).subscribe(data => {
      this.PatientListfilteredOptions = data;
      if (this.PatientListfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getSelectedObj(obj) {
    console.log(obj)
    this.selectedAdvanceObj = obj;
    this.PatientName = obj.FirstName + " " + obj.LastName; 
     this.RegId = obj.RegID ;
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName;
  }



  generateSchedule1(): void {
    const formValue = this._PhysiotherapistScheduleService.SchedulerForm.value
    if (this.RegId == '' || this.RegId == 0 || this.RegId == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (formValue.StartDate == '' || formValue.StartDate == 0 || formValue.StartDate == null || formValue.StartDate == undefined) {
      this.toastr.warning('Enter StartDate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (formValue.NoIntervals == '' || formValue.NoIntervals == 0 || formValue.NoIntervals == null) {
      this.toastr.warning('Enter No of Intervals', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (formValue.NoSessions == '' || formValue.NoSessions == 0 || formValue.NoSessions == null) {
      this.toastr.warning('Enter No of no. sessions', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let totaldays = 0
    this.scheduleDates = [];
    // const interval = this.vNOSessions / this.vNOSessions; 
    for (let i = 0; i < this.vNOSessions; i++) {
      const sessionDate = new Date(formValue.StartDate);
      sessionDate.setDate(formValue.StartDate.getDate() + Math.round(i * this.vNOIntervals));
      totaldays = Math.round(i * this.vNOIntervals)
      this.scheduleDates.push(
        {
          SessionDate: this.datePipe.transform(sessionDate, "yyyy-MM-dd 00:00:00.000") || '01/01/1999'
        })
    }
    // Calculate end date
    this.specificDate = new Date(formValue.StartDate);
    this.specificDate.setDate(formValue.StartDate.getDate() + totaldays);  

    let m_data = {
      "insertPhysiotherapyHeader": {
        "physioId": 0,
        "physioDate": this.dateTimeObj.date,
        "physioTime": this.dateTimeObj.time,
        "visitiId": this.selectedAdvanceObj.VisitId || 0,
        "regId": this.RegId || 0,
        "startdate": this.datePipe.transform(formValue.StartDate, 'yyyy-MM-dd') || '1999-01-01',
        "interval": formValue.NoIntervals || 0,
        "noSession": formValue.NoSessions || 0,
        "endDate": this.datePipe.transform(this.specificDate, 'yyyy-MM-dd') || '1999-01-01',
        "createdBy": this._loggedAcount.currentUserValue.user.id || 0
      }
    }
    console.log(m_data)
    this._PhysiotherapistScheduleService.SavePhysio(m_data).subscribe(response => {
      console.log(response)
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getReset();
        this.getschedulerdetlist(response);
      }
      else {
        this.toastr.error('Record Data not Saved !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    })
  }  
  getReset(){
    this._PhysiotherapistScheduleService.SchedulerForm.patchValue(
      {
        NoIntervals: 0,
        NoSessions:0,
        StartDate:new Date()
      }
    )
  }
   getschedulerdetlist(PhysioId){
    debugger
    var vdata={
      "PhysioId":PhysioId
    }
    this._PhysiotherapistScheduleService.getschedulerdetlist(vdata).subscribe(data=>{
      this.dSchedulerDetList.data = data as scheduleList[]
      console.log(this.dSchedulerDetList.data)
    })
  }
 

  getSchedule() {
    if (this.vNOIntervals == '' || this.vNOIntervals == 0 || this.vNOIntervals == null) {
      this.toastr.warning('Enter No of Intervals', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.vNOIntervals = ''
      return;
    }
     if (this.vNOSessions == '' || this.vNOSessions == 0 || this.vNOSessions == null) {
      this.toastr.warning('Enter No of no. sessions', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.vNOSessions = ''
      return;
    }
  }
  deleteTableRow(row) {

  }

}
export class scheduleList {
  StartDate: any;
  EndDate: any;
  Intervals: any;
  AddedBy: any;
  NoSessions: any;
  PhysioDate: any;
  RegNo: any;
  PatientName: any;
  Age: any;
  OPDNo: any;
  DoctorName: any;
  SessionStartdate: any;
  SessionEndDate: any;
  IsCompleted: any;
  Comments: any;

  constructor(scheduleList) {
    {
      this.StartDate = scheduleList.StartDate || '';
      this.EndDate = scheduleList.EndDate || '';
      this.Intervals = scheduleList.Intervals || 0;
      this.AddedBy = scheduleList.AddedBy || '';
      this.NoSessions = scheduleList.NoSessions || 0;
      this.PhysioDate = scheduleList.PhysioDate || 0;
      this.PatientName = scheduleList.PatientName || '';
      this.OPDNo = scheduleList.OPDNo || '';
      this.RegNo = scheduleList.RegNo || 0;
      this.DoctorName = scheduleList.DoctorName || '';
      this.SessionEndDate = scheduleList.SessionEndDate || 0;
      this.SessionStartdate = scheduleList.SessionStartdate || 0;
      this.Comments = scheduleList.Comments || '';
      this.IsCompleted = scheduleList.IsCompleted || '';
      this.Age = scheduleList.Age || 0;
    }
  }
}