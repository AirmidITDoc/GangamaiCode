import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CustomerInformationService } from './customer-information.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AMCDetailsComponent } from './amc-details/amc-details.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-customer-information',
  templateUrl: './customer-information.component.html',
  styleUrls: ['./customer-information.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CustomerInformationComponent implements OnInit {
  displayedColumns: string[] = [
    'IsActive',
    'CustomerId',
    'CustomerName',
    'InstallationDate',
    'AMCDueDate',
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
    this.onChangeIsactive();
    //this.getCustomerList();
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
  IsActive:any;
  onChangeIsactive() { 
    console.log(this._CustomerInfo.SearchForm.get('IsActive').value )
     if (this._CustomerInfo.SearchForm.get('IsActive').value == true) {
       this.IsActive = 1;
     }else{
       this.IsActive = 0;
     }
     this.getCustomerList(); 
   }
  getCustomerList(){
    this.sIsLoading = 'loading-data';
    var vdata={
      "CustomerName":this._CustomerInfo.SearchForm.get('CustomerName').value + '%' || '%',
      "IsActive": this.IsActive
    }
    console.log(vdata)
    this._CustomerInfo.getCustomerList(vdata).subscribe(data =>{
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
  onClear(){
    this._CustomerInfo.SearchForm.reset();
  }
  NewCustomer(){
    const dialogRef = this._matDialog.open(NewCustomerComponent,
      {
        maxWidth: "60vw",
        height: '55%',
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
        maxWidth: "60vw",
        height: '55%',
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
  ChkAMCDet(contact){
    console.log(contact)
    const dialogRef = this._matDialog.open(AMCDetailsComponent,
      {
        maxWidth: "80vw",
        height: '90%',
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
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  ActiveStatus(contact,CustomerId) {
    this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      {
        disableClose: false,
      }
    );
    if(contact.IsActive == 1){
      this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to Deactive?";
     }else{
      this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to Active?";
     } 

    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let Query 
        if(contact.IsActive == 1){
         Query = "Update T_CustomerInformation set IsActive=0 where CustomerId=" + CustomerId;
        }else{
          Query = "Update T_CustomerInformation set IsActive=1 where CustomerId=" + CustomerId;
        } 
        console.log(Query);
        this._CustomerInfo.deactivateTheStatus(Query).subscribe((response) => {
          if (response) {
            this.toastr.success('Record Updated Successfully.', 'Updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.getCustomerList();
          }
        })
      }
      this.confirmDialogRef = null;
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