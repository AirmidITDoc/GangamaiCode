import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PharmacyClearenceService } from './pharmacy-clearence.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { NewIssueTrackerComponent } from './new-issue-tracker/new-issue-tracker.component';

@Component({
  selector: 'app-pharmacy-clearence',
  templateUrl: './pharmacy-clearence.component.html',
  styleUrls: ['./pharmacy-clearence.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PharmacyClearenceComponent implements OnInit {
  displayedColumns = [
   // 'IssueTrackerId',
    'IssueRaisedDate',
    'IssueRaisedTime',
    'IssueSummary',
    'IssueDescription',
    'UploadImagePath',
    'ImageName',
    'IssueStatus',
    'IssueAssigned',
    'AddedBy',
    'AddedDatetime',
    'Action'
  ];
 
  sIsLoading: string = '';
  isLoading = true;
  Store1List:any=[];
  screenFromString = 'admission-form';

  
  dsIssueTracker = new MatTableDataSource<_IssueTrackerList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IssueTracker: PharmacyClearenceService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getIssuTrackerList();
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getIssuTrackerList() {
    this.sIsLoading = 'loading-data';
     this._IssueTracker.getIssuTrackerList().subscribe(data => {
     this.dsIssueTracker.data = data as _IssueTrackerList[];
     console.log(this.dsIssueTracker.data)
     this.dsIssueTracker.sort = this.sort;
     this.dsIssueTracker.paginator = this.paginator;
     this.sIsLoading = '';
   },
     error => {
       this.sIsLoading = '';
     });
 }

  OpenPopUp(){
    const dialogRef = this._matDialog.open(NewIssueTrackerComponent,
      {
        maxWidth: "75vw",
        height: '70%',
        width: '100%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
       
    });
  }

}

export class _IssueTrackerList {
 // IssueTrackerId: Number;
  IssueRaisedDate: number;
  IssueRaisedTime:number;
  IssueSummary:string;
  IssueDescription:string;
  UploadImagePath: any;
  ImageName:any;
  IssueStatus:any;
  IssueAssigned: any;
  AddedBy:any;
  AddedDatetime:any;
   
  constructor(_IssueTrackerList) {
    {
      //this.IssueTrackerId = _IssueTrackerList.IssueTrackerId || 0;
      this.IssueRaisedDate = _IssueTrackerList.IssueRaisedDate || 0;
      this.IssueRaisedTime = _IssueTrackerList.IssueRaisedTime || 0;
      this.IssueSummary = _IssueTrackerList.IssueSummary || "";
      this.IssueDescription = _IssueTrackerList.IssueDescription || "";
      this.UploadImagePath = _IssueTrackerList.UploadImagePath || "";
      this.ImageName = _IssueTrackerList.ImageName || "";
      this.IssueStatus = _IssueTrackerList.IssueStatus || "";
      this.IssueAssigned = _IssueTrackerList.IssueAssigned || "";
      this.AddedBy = _IssueTrackerList.AddedBy || 0;
      this.AddedDatetime = _IssueTrackerList.AddedDatetime || 0;
    }
  }
}

