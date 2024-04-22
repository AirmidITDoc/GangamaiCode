import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomerInformationService } from '../customer-information.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ElementRef} from "@angular/core";


@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewCustomerComponent implements OnInit {

  dateTimeObj:any;
  registerObj:any;
  sIsLoading: string = '';
  isLoading = true;
  vCustomerName:any;
  vPersonMobileNo:any;
  vpersonName:any;
  vPinCode:any;
  vMobileNo:any;
  vaddress:any;
  vCustomerId:any;


  constructor(
    public _CustomerInfo: CustomerInformationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<NewCustomerComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vCustomerName = this.registerObj.CustomerName
      this.vMobileNo = this.registerObj.CustomerMobileNo
      this.vaddress = this.registerObj.CustomerAddress
      this.vPinCode = this.registerObj.CustomerPinCode
      this.vpersonName = this.registerObj.ContactPersonName
      this.vPersonMobileNo = this.registerObj.ContactPersonMobileNo
      this.vCustomerId =this.registerObj.CustomerId;
    }
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  focusNext(nextElementId: string): void {
    const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }
  Savebtn:boolean=false;
  onSubmit(){
    if ((this.vCustomerName == '' || this.vCustomerName == null || this.vCustomerName == undefined)) {
      this.toastr.warning('Please enter a CustomerName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
  }
  if ((this.vaddress == '' || this.vaddress == null || this.vaddress == undefined)) {
    this.toastr.warning('Please enter a Address', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
}
if ((this.vMobileNo == '' || this.vMobileNo == null || this.vMobileNo == undefined)) {
  this.toastr.warning('Please enter a MobileNo', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
  });
  return;
}
  if ((this.vPinCode == '' || this.vPinCode == null || this.vPinCode == undefined)) {
    this.toastr.warning('Please enter a PinCode', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
    if ((this.vpersonName == '' || this.vpersonName == null || this.vpersonName == undefined)) {
        this.toastr.warning('Please enter a Contact personName', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
    }
    
  if ((this.vPersonMobileNo == '' || this.vPersonMobileNo == null || this.vPersonMobileNo == undefined)) {
    this.toastr.warning('Please enter a contact PersonMobileNo', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
}
    if (!this.vCustomerId) {
      this.Savebtn = true;
      this.sIsLoading = 'loading-data';
      let customerInformationInsertObj = {};
      customerInformationInsertObj['customerId'] = 0;
      customerInformationInsertObj['customerName'] = this._CustomerInfo.myform.get('CustomerName').value || '';
      customerInformationInsertObj['customerAddress'] = this._CustomerInfo.myform.get('Address').value || '';
      customerInformationInsertObj['customerMobileNO'] = this._CustomerInfo.myform.get('MobileNo').value || 0;
      customerInformationInsertObj['customerPinCode'] = this._CustomerInfo.myform.get('PinCode').value || 0;
      customerInformationInsertObj['contactPersonName'] = this._CustomerInfo.myform.get('personName').value || '';
      customerInformationInsertObj['contactPersonMobileNo'] = this._CustomerInfo.myform.get('PersonMobileNo').value || 0;
      customerInformationInsertObj['installationDate'] = this._CustomerInfo.myform.get('InstallationDate').value;
      customerInformationInsertObj['amcDate'] = this._CustomerInfo.myform.get('InstallationDate').value;
      customerInformationInsertObj['createdBy'] = this._loggedService.currentUserValue.user.id || 0;


      let submitData = {
        "customerInformationInsert": customerInformationInsertObj,
      };
      console.log(submitData);
      this._CustomerInfo.SaveCustomer(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          }); this._matDialog.closeAll();
          this.Savebtn = false;
        }
        else {
          this.toastr.error('New Custome Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }

      }, error => {
        this.toastr.error('New Custome Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }
      else{
 
        this.Savebtn = true;
        this.sIsLoading = 'loading-data';
        let customerInformationUpdate = {};
        customerInformationUpdate['customerId'] = this.registerObj.CustomerId;
        customerInformationUpdate['customerName'] = this._CustomerInfo.myform.get('CustomerName').value || '';
        customerInformationUpdate['customerAddress'] = this._CustomerInfo.myform.get('Address').value || '';
        customerInformationUpdate['customerMobileNO'] = this._CustomerInfo.myform.get('MobileNo').value || 0;
        customerInformationUpdate['customerPinCode'] = this._CustomerInfo.myform.get('PinCode').value || 0;
        customerInformationUpdate['contactPersonName'] = this._CustomerInfo.myform.get('personName').value || '';
        customerInformationUpdate['contactPersonMobileNo'] = this._CustomerInfo.myform.get('PersonMobileNo').value || 0;
        customerInformationUpdate['installationDate'] = this._CustomerInfo.myform.get('InstallationDate').value;
        customerInformationUpdate['amcDate'] = this._CustomerInfo.myform.get('InstallationDate').value;
        customerInformationUpdate['createdBy'] = this._loggedService.currentUserValue.user.id || 0;
        customerInformationUpdate['createdDatetime'] = this._CustomerInfo.myform.get('InstallationDate').value;
        customerInformationUpdate['modifiedBy'] = this._loggedService.currentUserValue.user.id || 0;
        customerInformationUpdate['modifieddatetime'] = this._CustomerInfo.myform.get('InstallationDate').value;
  
  
        let submitData = {
          "customerInformationUpdate": customerInformationUpdate,
        };
        console.log(submitData);
        this._CustomerInfo.UpdateCustomer(submitData).subscribe(response => {
          if (response) {
            this.toastr.success('Record Updated Successfully.', 'Updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            }); this._matDialog.closeAll();
            this.Savebtn = false;
          }
          else {
            this.toastr.error('New Custome Data not Updated !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
  
        }, error => {
          this.toastr.error('New Custome Data not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        });
      }
  }
  onReset(){
this._CustomerInfo.myform.reset();
this.onClose();
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
