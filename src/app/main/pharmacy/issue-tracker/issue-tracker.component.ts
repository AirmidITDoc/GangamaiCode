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
import { NewIssueTrackerComponent } from './new-issue-tracker/new-issue-tracker.component';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ImageViewComponent } from 'app/main/opd/appointment/image-view/image-view.component';

@Component({
  selector: 'app-issue-tracker',
  templateUrl: './issue-tracker.component.html',
  styleUrls: ['./issue-tracker.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueTrackerComponent implements OnInit {
  displayedColumns = [ 
    'Status',
    'IssueRaisedDate',
    'IssueNo',
    'CustomerName',
    'IssueName',
    // 'DocumentPath',
    'IssueDescription',
    'RaisedByName',
    'AssignedByName',
    'IssueStatus',
    'ResolvedDate',
    'DevComment',
    'Comment',
    'ReleaseStatus',  
    'AddedBy',
    'AddedDatetime',
    'ModifiedBy',
    'ModifiedDate',
    'Action'
  ];

  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  screenFromString = 'admission-form';
  ConstanyTypeList: any = [];
  ConstanyAssignedList: any = [];
  isCustomerSelected:boolean=false;
  filteredOptionsCustomer:Observable<string[]>;
  CustomerNameList:any=[];
  IssueRaisedList:any=[];
  IsRelease:any = 0;
  IsReviewStatus:any = 0;

  dsIssueTracker = new MatTableDataSource<IssueTrackerList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IssueTracker: IssueTrackerService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getIssuTrackerList();
    this.getIssueStatusList();
    this.getIssueAssignedList();
    this.getHospitalList();
    this.getIssueRaisedList();
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
    let StatusId = 0
    if(this._IssueTracker.MyFrom.get('IssueStatus').value){
      StatusId = this._IssueTracker.MyFrom.get('IssueStatus').value.ConstantId;
    }
    let RaisedById = 0
    if(this._IssueTracker.MyFrom.get('IssueRaised').value){
      RaisedById = this._IssueTracker.MyFrom.get('IssueRaised').value.ConstantId;
    }
    let AssignedToId = 0
    if(this._IssueTracker.MyFrom.get('IssueAssigned').value){
      AssignedToId = this._IssueTracker.MyFrom.get('IssueAssigned').value.ConstantId;
    }
    var vdata = {
      'From_Dt':this.datePipe.transform(this._IssueTracker.MyFrom.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      'To_Dt':this.datePipe.transform(this._IssueTracker.MyFrom.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      'ClientId': this._IssueTracker.MyFrom.get('CustomerId').value.CustomerId ||  0,
      'StatusId': StatusId ||  0,
      'RaisedById': RaisedById ||  0,
      'AssignedToId': AssignedToId || 0,
      'ReviewStatusId': this.IsReviewStatus ||  0,
      'ReleaseStatus': this.IsRelease ||  0
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
  getHospitalList() {
    this._IssueTracker.getCustomerNameList().subscribe(data => {
      this.CustomerNameList = data;
      console.log(this.CustomerNameList)
      this.filteredOptionsCustomer = this._IssueTracker.MyFrom.get('CustomerId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCustomer(value) : this.CustomerNameList.slice()),
      );  
    });
  } 
  getOptionTextCutomers(option) {
    return option && option.CustomerName ? option.CustomerName : '';
  }
  private _filterCustomer(value: any): string[] {
    if (value) {
      const filterValue = value && value.CustomerName ? value.CustomerName.toLowerCase() : value.toLowerCase();
      return this.CustomerNameList.filter(option => option.CustomerName.toLowerCase().includes(filterValue));
    } 
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
  getIssueRaisedList() {
    var vdata = {
      'ConstanyType': 'ISSUE_RAISED',
    }
    this._IssueTracker.getConstantsList(vdata).subscribe(data => {
      this.IssueRaisedList = data;
      console.log(this.IssueRaisedList); 
    });
  }
 
  onChangeIsactive(SiderOption) {
   // this.IsRelease = SiderOption.checked;
   console.log(this._IssueTracker.userFormGroup.get('CodeRelease').value)
    if (SiderOption.checked == true) {
      this.IsRelease = 1;
    }else{
      this.IsRelease = 0;
    } 
  }
  chkRevieStatus(SiderOption){
    console.log(this._IssueTracker.userFormGroup.get('vIsReviweStatus').value)
    if(SiderOption.checked == true){
      this.IsReviewStatus = 1;
    }else{
      this.IsReviewStatus = 0;
    } 
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
        height: '60%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      //this.getIssuTrackerList();
    });
  }
  OpenPopUp() {
    const dialogRef = this._matDialog.open(NewIssueTrackerComponent,
      {
        maxWidth: "75vw",
        height: '80%',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIssuTrackerList();
    });
  }
  onEdit(contact) {
    const dialogRef = this._matDialog.open(NewIssueTrackerComponent,
      {
        maxWidth: "75vw",
        height: '80%',
        width: '100%',
        data: {
          Obj: contact, 
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIssuTrackerList();
    });
  }
  onClear(){
    this._IssueTracker.MyFrom.reset();
  }
  StatusEditable:boolean=false;
  StatusenableEditing(row:IssueTrackerList) {
    row.StatusEditable = true;
    row.StatusName = '';
  }
  StatusdisableEditing(row:IssueTrackerList) {
    row.StatusEditable = false;
    row.StatusName = row.StatusName;
    this.getIssuTrackerList();
  }
  EditStatusId:any;
  DropDownValue(contact,value){ 
    console.log(value)
    console.log(value.ConstantId)
   this.EditStatusId = value.ConstantId;
   contact.StatusName = '';
  //  contact.StatusEditable = false;
  }
  OnSaveeditstatusName(contact){
    console.log(contact)
  let Query 
  Query = "update T_IssuetrackerInformation set StatusId = " + this.EditStatusId  + "where IssueId =" + contact.IssueId ;
  this._IssueTracker.UpdateStatusName(Query).subscribe(response =>{
    if (response) {
      this.toastr.success('Record Updated Successfully.', 'Updated !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.getIssuTrackerList();
    }
    else {
      this.toastr.error('Record Data not Updated !, Please check error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }  
  });
  }

  onViewImage(ele: any, type: string) { 
    let fileType;
    if (ele) { 
        const dialogRef = this._matDialog.open(ImageViewComponent,
            {
                width: '1100px',
                height: '95%',
                data: {
                    docData: type == 'img' ? ele : ele.doc,
                    type: type == 'img' ? "image" : ele.type
                }
            }
        );
        dialogRef.afterClosed().subscribe(result => { 
        });
    }
  }
}

export class IssueTrackerList {
  IssueDate:any;
  StatusEditable:any;
   IssueId: Number;
  IssueRaisedDate: number;
  IssueNo: number;
  IssueName: string;
  IssueDescription: string;
  RaisedByName:string;
  AssignedByName:string;
  DevComment:string;
  Comment:string;
  ReleaseStatus:any;
  ResolvedDate:any;
  UploadImagePath: any;
  ImageName: any;
  StatusName: any; 
  AddedBy: any;
  AddedDatetime: any;
  IssueRaised: any;
  IssueTrackerId: any
  StatusId: any;
  ModifiedBy:any;
  ModifiedDate:any; 
  IssueAssigned:any;
  CustomerName:any;
  ReviewStatusId:any;
  
  constructor(IssueTrackerList) {
    {
      this.IssueId = IssueTrackerList.IssueId || 0;
      this.IssueRaisedDate = IssueTrackerList.IssueRaisedDate || 0;
      this.IssueNo = IssueTrackerList.IssueNo || 0;
      this.IssueName = IssueTrackerList.IssueName || "";
      this.IssueDescription = IssueTrackerList.IssueDescription || "";
      this.UploadImagePath = IssueTrackerList.UploadImagePath || "";
      this.RaisedByName = IssueTrackerList.RaisedByName || "";
      this.AssignedByName = IssueTrackerList.AssignedByName || "";
      this.DevComment = IssueTrackerList.DevComment || "";
      this.Comment = IssueTrackerList.Comment || "";
      this.ReleaseStatus = IssueTrackerList.ReleaseStatus || 0;
      this.ResolvedDate = IssueTrackerList.ResolvedDate || 0;
      this.ImageName = IssueTrackerList.ImageName || "";
      this.StatusName = IssueTrackerList.StatusName || ""; 
      this.AddedBy = IssueTrackerList.AddedBy || 0;
      this.AddedDatetime = IssueTrackerList.AddedDatetime || 0;
      this.IssueRaised = IssueTrackerList.IssueRaised || '';
      this.IssueTrackerId = IssueTrackerList.IssueTrackerId || 0;
      this.StatusId = IssueTrackerList.StatusIdStatusName || 0;
      this.ModifiedDate = IssueTrackerList.ModifiedDate || 0;
      this.ModifiedBy = IssueTrackerList.ModifiedBy || 0; 
      this.CustomerName = IssueTrackerList.CustomerName || '';
    }
  }
}

  