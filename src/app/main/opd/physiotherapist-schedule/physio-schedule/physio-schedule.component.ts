import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PhysiotherapistScheduleService } from '../physiotherapist-schedule.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-physio-schedule',
  templateUrl: './physio-schedule.component.html',
  styleUrls: ['./physio-schedule.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PhysioScheduleComponent implements OnInit {
displayingcolumns = [
  'SrNo',
  'PatientName',
  'DoctorName' ,
  'StartDate',
  'EndDate',
  'Intervals', 
  'Action'
]
  vNOIntervals: any;
  selectedAdvanceObj:any;

  dsSchedulerList = new MatTableDataSource 
  constructor(
    public _PhysiotherapistScheduleService: PhysiotherapistScheduleService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public datePipe: DatePipe, 
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PhysioScheduleComponent>,
         private router: Router,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.selectedAdvanceObj = this.data
      console.log(this.selectedAdvanceObj)
    }
  }
viewPhoneAppointment(){
    this.router.navigate(['/opd/view-phone-appointment']);
}

  startDate: string = '';
  intervalInput: string = '';
  appointmentDates: string[] = [];

  generateSchedule(): void {
    if (!this.startDate || !this.intervalInput) {
      alert('Please provide both start date and intervals.');
      return;
    }

    const intervals = this.parseIntervals(this.intervalInput);
    if (intervals.length === 0) {
      alert('Please enter valid intervals (positive integers separated by commas).');
      return;
    }

    this.dsSchedulerList.data = this.calculateAppointmentDates(this.startDate, intervals);
    console.log(this.dsSchedulerList.data)
  }

  private parseIntervals(input: string): number[] {
    return input
      .split(',')
      .map(item => item.trim())
      .filter(item => /^\d+$/.test(item))
      .map(item => parseInt(item, 10))
      .filter(num => num > 0);
  }

  private calculateAppointmentDates(startDateStr: string, intervals: number[]): string[] {
    const result: string[] = [];
    let currentDate = new Date(startDateStr);

    for (const interval of intervals) {
      currentDate.setDate(currentDate.getDate() + interval);
      result.push(currentDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    }

    return result;
  }




 



  totalDays: number = 20;
  vNOSessions: number = 0;
  vNoDays: number = 0;

 
  
  scheduleDates: Date[] = [];
 

  generateSchedule1(): void {
    const startdate = this._PhysiotherapistScheduleService.SchedulerForm.get('StartDate').value
    this.scheduleDates = [];
    const interval = this.vNoDays / this.vNOSessions;

    for (let i = 0; i < this.vNOSessions; i++) {
      const sessionDate = new Date(startdate);
      sessionDate.setDate(startdate.getDate() + Math.round(i * interval));
      this.scheduleDates.push(sessionDate);
    }

    // Calculate end date
    this.specificDate = new Date(startdate);
    this.specificDate.setDate(startdate.getDate() + this.totalDays);
  }





















  vDays: any = 10;
  followUpDate: string;
  specificDate :Date;
  onDaysChange() { 
    debugger
   const formValue = this._PhysiotherapistScheduleService.SchedulerForm
    if (this.vNOIntervals > 0) {
      const today = new Date();
      const todaydays = today.getDate()
      const followDays = ((todaydays) + parseInt(this.vNOIntervals))
      console.log(followDays)
      const followUp = new Date();
      followUp.setDate((todaydays) + parseInt(this.vDays));
      this.followUpDate = this.datePipe.transform(followUp.toDateString(), 'MM/dd/YYYY');
      this.specificDate = new Date(this.followUpDate);
      console.log(this.followUpDate)
    } 
    else {
      if(this.vNOIntervals == '' || this.vNOIntervals == 0 || this.vNOIntervals == null || this.vNOIntervals == undefined)
       this.specificDate = new Date();
    }
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

  getSchedule(){
    if(this.vNOIntervals == '' || this.vNOIntervals == '0' || this.vNOIntervals == null){
      this.toastr.warning('Enter No of Intervals', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      }); 
      this.vNOIntervals = ''
      return;
    }
  }
  deleteTableRow(row){

  }
}
export class scheduleList {
  StartDate: any;
  EndDate: any;
  Intervals: any;

  constructor(scheduleList) {
    {
      this.StartDate = scheduleList.StartDate || '';
      this.EndDate = scheduleList.EndDate || '';
      this.Intervals = scheduleList.Intervals || 0;
    }
  }
}