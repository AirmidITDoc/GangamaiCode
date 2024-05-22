import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
// import { NewIssueTrackerComponent } from './new-issue-tracker/new-issue-tracker.component'; 
// import { PharmacyClearenceService } from './pharmacy-clearence.service';
import { CustomerInformationComponent } from 'app/main/Customer/customer-information/customer-information.component';
import { CustomerBillRaiseComponent } from 'app/main/Customer/customer-bill-raise/customer-bill-raise.component';
import { NewCustomerComponent } from 'app/main/Customer/customer-information/new-customer/new-customer.component';
import { NewBillRaiseComponent } from 'app/main/Customer/customer-bill-raise/new-bill-raise/new-bill-raise.component';
import { IssueTrackerService } from './issue-tracker.service';

@Component({
  selector: 'app-issue-tracker',
  templateUrl: './issue-tracker.component.html',
  styleUrls: ['./issue-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueTrackerComponent implements OnInit {
  displayedColumns = [
    // 'IssueTrackerId',
    'IssueRaisedDate',
    'IssueRaisedTime',
    'IssueSummary',
    'IssueDescription',
    'UploadImagePath',
    // 'ImageName',
    'IssueStatus',
    'IssueAssigned',
    'AddedBy',
    'AddedDatetime',
    'Action'
  ];

  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  screenFromString = 'admission-form';
  ConstanyTypeList: any = [];
  ConstanyAssignedList: any = [];

  dsIssueTracker = new MatTableDataSource<IssueTrackerList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IssueTracker: IssueTrackerService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getIssuTrackerList();
    this.getIssueStatusList();
    this.getIssueAssignedList();
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
    // let vstatus=this._IssueTracker.MyFrom.get('IssueStatus').value.Value || '%';
    // let vassigned=this._IssueTracker.MyFrom.get('IssueAssigned').value.Value || '%';
    // console.log(vassigned)
    // console.log(vstatus)
    var vdata = {
      'IssueStatus': this._IssueTracker.MyFrom.get('IssueStatus').value.Value || '%',
      'IssueAssigned': this._IssueTracker.MyFrom.get('IssueAssigned').value.Value || '%'
    }
    console.log(vdata)
    this.sIsLoading = 'loading-data';
    this._IssueTracker.getIssuTrackerList(vdata).subscribe(data => {
      this.dsIssueTracker.data = data as IssueTrackerList[];
      console.log(this.dsIssueTracker.data)
      this.dsIssueTracker.sort = this.sort;
      this.dsIssueTracker.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getIssueStatusList() {
    var vdata = {
      'ConstanyType': 'ISSUE_STATUS',
    }
    this._IssueTracker.getConstantsList(vdata).subscribe(data => {
      this.ConstanyTypeList = data
      console.log(this.ConstanyTypeList)
    });
  }
  getIssueAssignedList() {
    var vdata = {
      'ConstanyType': 'ISSUE_ASSIGNED',
    }
    this._IssueTracker.getConstantsList(vdata).subscribe(data => {
      this.ConstanyAssignedList = data
      console.log(this.ConstanyAssignedList)
    });
  }




  OpenPopUp() {
    // const dialogRef = this._matDialog.open(NewIssueTrackerComponent,
    //   {
    //     maxWidth: "75vw",
    //     height: '72%',
    //     width: '100%',

    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   this.getIssuTrackerList();
    // });
  }
  CustomerList() {
    const dialogRef = this._matDialog.open(CustomerInformationComponent,
      {
        maxWidth: "85vw",
        height: '85%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      //this.getIssuTrackerList();
    });
  }
  NewCustomer() {
    const dialogRef = this._matDialog.open(NewCustomerComponent,
      {
        maxWidth: "85vw",
        height: '60%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  NewCustomerBill() {
    const dialogRef = this._matDialog.open(NewBillRaiseComponent,
      {
        maxWidth: "85vw",
        height: '60%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  CustomerbillList() {
    const dialogRef = this._matDialog.open(CustomerBillRaiseComponent,
      {
        maxWidth: "85vw",
        height: '85%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      //this.getIssuTrackerList();
    });
  }
  onEdit(contact) {
    // const dialogRef = this._matDialog.open(NewIssueTrackerComponent,
    //   {
    //     maxWidth: "75vw",
    //     height: '72%',
    //     width: '100%',
    //     data: {
    //       Obj: contact,

    //     }
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   this.getIssuTrackerList();
    // });
  }


}

export class IssueTrackerList {
  // IssueTrackerId: Number;
  IssueRaisedDate: number;
  IssueRaisedTime: number;
  IssueSummary: string;
  IssueDescription: string;
  UploadImagePath: any;
  ImageName: any;
  IssueStatus: any;
  IssueAssigned: any
  AddedBy: any;
  AddedDatetime: any;
  IssueRaised: any;
  IssueTrackerId: any
  IssueStatusId: any;
  constructor(IssueTrackerList) {
    {
      //this.IssueTrackerId = _IssueTrackerList.IssueTrackerId || 0;
      this.IssueRaisedDate = IssueTrackerList.IssueRaisedDate || 0;
      this.IssueRaisedTime = IssueTrackerList.IssueRaisedTime || 0;
      this.IssueSummary = IssueTrackerList.IssueSummary || "";
      this.IssueDescription = IssueTrackerList.IssueDescription || "";
      this.UploadImagePath = IssueTrackerList.UploadImagePath || "";
      this.ImageName = IssueTrackerList.ImageName || "";
      this.IssueStatus = IssueTrackerList.IssueStatus || "";
      this.IssueAssigned = IssueTrackerList.IssueAssigned || "";
      this.AddedBy = IssueTrackerList.AddedBy || 0;
      this.AddedDatetime = IssueTrackerList.AddedDatetime || 0;
      this.IssueRaised = IssueTrackerList.IssueRaised || '';
      this.IssueTrackerId = IssueTrackerList.IssueTrackerId || 0;
      this.IssueStatusId = IssueTrackerList.IssueStatusId || 0;
    }
  }
}

  