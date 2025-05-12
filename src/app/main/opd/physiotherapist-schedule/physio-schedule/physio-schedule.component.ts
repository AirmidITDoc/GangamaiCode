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
    'PhysioDate',
    'RegNo',
    'PatientName',
    'Age',
    'OPDNo',
    'StartDate',
    'EndDate',
    'Intervals',
    'NoSessions', 
    'DoctorName',
    'AddedBy',
    'Action'
  ]
  selectedAdvanceObj: any;
  PatientName: any;
  isRegIdSelected: boolean = false;

  dsSchedulerList = new MatTableDataSource<scheduleList>();
  dspatientSchedulerList = new MatTableDataSource<scheduleList>();

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
      console.log(this.selectedAdvanceObj)
      this.getVisitWiseschedulerlist();
    }
    this.getallschedulerlist();
  }

  PatientListfilteredOptions: any;
  noOptionFound: any;
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
    this.getVisitWiseschedulerlist();
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.FirstName + ' ' + option.MiddleName + ' ' + option.LastName;
  }



  startDate: string = '';
  specificDate: Date;
  vNOSessions: any = 0;
  vNOIntervals: any = 0;
  scheduleDates: any = [];
  chargelist: any = [];
  generateSchedule1(): void {

       if (this.selectedAdvanceObj.RegNo == '' || this.selectedAdvanceObj.RegNo  == 0 || this.selectedAdvanceObj.RegNo  == null) {
      this.toastr.warning('Please select patient', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
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

    let totaldays = 0
    const startdate = this._PhysiotherapistScheduleService.SchedulerForm.get('StartDate').value
    this.scheduleDates = [];
    // const interval = this.vNOSessions / this.vNOSessions;

    for (let i = 0; i < this.vNOSessions; i++) {
      const sessionDate = new Date(startdate);
      sessionDate.setDate(startdate.getDate() + Math.round(i * this.vNOIntervals));
      totaldays = Math.round(i * this.vNOIntervals)
      this.scheduleDates.push(
        {
          SessionDate: this.datePipe.transform(sessionDate, "yyyy-MM-dd 00:00:00.000") || '01/01/1999'
        })
      console.log(this.scheduleDates)
      console.log(totaldays)
    }

    // Calculate end date
    this.specificDate = new Date(startdate);
    this.specificDate.setDate(startdate.getDate() + totaldays);
  }
  getallschedulerlist() {
    this._PhysiotherapistScheduleService.getallschedulerlist().subscribe((data) => { 
      this.dspatientSchedulerList.data = data as scheduleList[]
      console.log(this.dspatientSchedulerList.data)
    })
  }

  getVisitWiseschedulerlist() {
    var vdata = {
      "VisitId": this.selectedAdvanceObj.VisitId || 0
    }
    this._PhysiotherapistScheduleService.getVisitWiseschedulerlist(vdata).subscribe((data) => {
      this.dsSchedulerList.data = data as scheduleList[] 
      console.log(data[0]) 
       console.log(this.dsSchedulerList)
      console.log(this.dsSchedulerList.data)
    })
  }

  //select cehckbox
  tableElementChecked(event, element) {
    if (event.checked) {
      // this.interimArray.push(element);
      // // console.log(this.interimArray)
    }
    // else if (this.interimArray.length > 0) {
    //   let index = this.interimArray.indexOf(element);
    //   if (index !== -1) {
    //     this.interimArray.splice(index, 1);
    //   }
    // }
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
  getphysiodetlist(row) {
    const dialogRef = this._matDialog.open(PhysioScheduleDetailComponent,
      {
        maxHeight: "100%",
        width: "70%",
        height: "80%",
        data: row
      }
    )
    dialogRef.afterClosed().subscribe(result => {
    });
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