import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CustomerInformationService } from './customer-information.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CustomerInformationComponent implements OnInit {
  displayedColumns: string[] = [
    'CustomerId',
    'CustomerName',
    'InstallationDate',
    'Address',
    'MobileNo',
    'ContactPersonName',
    'ContactPersonMobileNo',
    'PinCode',
    'Action'
  ];
  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;

  dsCustomerInfo = new MatTableDataSource<CustomerInfoList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _CustomerInfo: CustomerInformationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getCustomerList();
  }
  onClose(){
    this._matDialog.closeAll();
  } 
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  getCustomerList(){
    this.sIsLoading = 'loading-data';
    this._CustomerInfo.getCustomerList().subscribe(data =>{
      this.dsCustomerInfo.data = data as CustomerInfoList[];
      console.log(this.dsCustomerInfo.data)
      this.dsCustomerInfo.sort = this.sort;
      this.dsCustomerInfo.paginator = this.paginator
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });
  }
  NewCustomer(){
    const dialogRef = this._matDialog.open(NewCustomerComponent,
      {
        maxWidth: "85vw",
        height: '85%',
        width: '100%',
        
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }
  OnEdit(contact){
    console.log(contact)
    const dialogRef = this._matDialog.open(NewCustomerComponent,
      {
        maxWidth: "85vw",
        height: '85%',
        width: '100%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCustomerList();
    });
  }
}
export class CustomerInfoList {
  CustomerName: any;
  InstallationDate: any;
  Address: string;
  PinCode: string;
  MobileNo: any;
  ContactPersonName:string;
  ContactPersonMobileNo:any;
  constructor(CustomerInfoList) {
    {
      this.CustomerName = CustomerInfoList.CustomerName || '';
      this.ContactPersonName = CustomerInfoList.ContactPersonName || '';
      this.InstallationDate = CustomerInfoList.InstallationDate || 0;
      this.Address = CustomerInfoList.Address || '';
      this.PinCode = CustomerInfoList.PinCode || 0;
      this.MobileNo = CustomerInfoList.MobileNo || 0;
      this.ContactPersonMobileNo = CustomerInfoList.ContactPersonMobileNo || 0;

    }
  }
}