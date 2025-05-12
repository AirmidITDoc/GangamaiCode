import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PhysiotherapistScheduleService } from '../physiotherapist-schedule.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { scheduleList } from '../physio-schedule/physio-schedule.component';

@Component({
  selector: 'app-physio-schedule-detail',
  templateUrl: './physio-schedule-detail.component.html',
  styleUrls: ['./physio-schedule-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PhysioScheduleDetailComponent implements OnInit {
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
registerObj:any;

    dSchedulerDetList = new MatTableDataSource<scheduleList>()
    
  constructor(
     public _PhysiotherapistScheduleService: PhysiotherapistScheduleService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<PhysioScheduleDetailComponent>,
        private _loggedAcount: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data
      console.log(this.registerObj)
      this.getschedulerdetlist();
    }
  }


   getschedulerdetlist(){
    var vdata={
      "PhysioId":this.registerObj.PhysioId
    }
    this._PhysiotherapistScheduleService.getschedulerdetlist(vdata).subscribe(data=>{
      this.dSchedulerDetList.data = data as scheduleList[]
      console.log(this.dSchedulerDetList.data)
    })
  }
}
