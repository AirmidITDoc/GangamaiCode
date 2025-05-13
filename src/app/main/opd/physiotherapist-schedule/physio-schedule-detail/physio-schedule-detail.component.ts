import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PhysiotherapistScheduleService } from '../physiotherapist-schedule.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { scheduleList } from '../physio-schedule/physio-schedule.component';
import { UpdatePhysioScheduleDetailComponent } from '../update-physio-schedule-detail/update-physio-schedule-detail.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
    
      
      @ViewChild(MatSort) sort: MatSort; 
       @ViewChild('Firstpaginator', { static: true }) public Firstpaginator: MatPaginator;

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
      this.dSchedulerDetList.data = data as scheduleList[];
       this.dSchedulerDetList.sort = this.sort;
        this.dSchedulerDetList.paginator = this.Firstpaginator;
      console.log(this.dSchedulerDetList.data)
    })
  }
    UpdateScheduledet(row) {
      const dialogRef = this._matDialog.open(UpdatePhysioScheduleDetailComponent,
        {
          maxWidth: "100%",
          width: '60%',
          height: '35%',
          data: row
        }
      )
      dialogRef.afterClosed().subscribe(result => {
         this.getschedulerdetlist();
      });
    }
}
