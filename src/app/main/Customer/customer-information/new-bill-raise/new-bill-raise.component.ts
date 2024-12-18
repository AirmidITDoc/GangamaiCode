import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerInformationService } from '../customer-information.service';


@Component({
  selector: 'app-new-bill-raise',
  templateUrl: './new-bill-raise.component.html',
  styleUrls: ['./new-bill-raise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewBillRaiseComponent implements OnInit {

  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;
  vCustomerId: any;
  vAmount: any;
  vDescription: any;
  isCustomerIdSelected: boolean = false;
  registerObj: any;
  filteredOptions: Observable<string[]>;
  CustomerList: any = [];
  RtrvCustomerId: any
  filteredOptionsCutomer: any;
  noOptionFound: any;
  vSupplierId: any;
  vCustomerName: any; 


  constructor(
    public _CustomerInfo: CustomerInformationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private elementRef: ElementRef,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewBillRaiseComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {

    this.getCustomerSearch();
    if (this.data) {
      if(this.data.FormName == 0){
        this.registerObj = this.data.Obj;
        console.log(this.registerObj)
        this.RtrvCustomerId = this.registerObj.CustomerId
        this.vAmount= this.registerObj.Amount
        this.OnEdit(this.registerObj)
      }
      else if(this.data.FormName == 1){
        this.registerObj = this.data.Obj;
        console.log('new',this.registerObj) 
      } 
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


  getCustomerSearch() {
    var m_data = {
      'CustomerName': this._CustomerInfo.Billmyform.get('CustomerId').value || "%"
    }
    console.log(m_data)
    this._CustomerInfo.getCustomerSearchCombo(m_data).subscribe(data => {
      this.CustomerList = data;
      console.log(this.CustomerList)
      this.filteredOptions = this._CustomerInfo.Billmyform.get('CustomerId').valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value)),
      );

      if (this.data) {
        const Customerselected = this.CustomerList.find(c => c.CustomerId == this.registerObj.CustomerId);
        this._CustomerInfo.Billmyform.get('CustomerId').setValue(Customerselected);
        console.log(Customerselected)
      }
    });
  }
  private _filter(value: any): string[] {
    if (value) {
      const filterValue = value && value.CustomerName ? value.CustomerName.toLowerCase() : value.toLowerCase();
      return this.CustomerList.filter(option => option.CustomerName.toLowerCase().includes(filterValue));
    }
  }
  getOptionText(option) {
    return option && option.CustomerName ? option.CustomerName : '';
  }
  onSubmit() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if ((this.vCustomerId == '' || this.vCustomerId == null || this.vCustomerId == undefined)) {
      this.toastr.warning('Please enter a CustomerId', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vAmount == '' || this.vAmount == null || this.vAmount == undefined)) {
      this.toastr.warning('Please enter a Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.RtrvCustomerId) {
      let customerInvoiceRaiseInsert = {};
      customerInvoiceRaiseInsert['invNumber'] = 0;
      customerInvoiceRaiseInsert['invDate'] = formattedDate;
      customerInvoiceRaiseInsert['customerId'] = this._CustomerInfo.Billmyform.get('CustomerId').value.CustomerId || 0;
      customerInvoiceRaiseInsert['amount'] = this._CustomerInfo.Billmyform.get('Amount').value || 0;
      customerInvoiceRaiseInsert['invoiceRaisedId'] = this._loggedService.currentUserValue.user.id || 0;
      customerInvoiceRaiseInsert['createdBy'] = this._loggedService.currentUserValue.user.id || 0;

      let submitData = {
        "customerInvoiceRaiseInsert": customerInvoiceRaiseInsert,
      };
      console.log(submitData);
      this._CustomerInfo.SaveCustomerBill(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onReset()
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
    } else {
      let customerInvoiceRaiseUpdate = {};
      customerInvoiceRaiseUpdate['invNumber'] = 0;
      customerInvoiceRaiseUpdate['invDate'] = formattedDate;
      customerInvoiceRaiseUpdate['customerId'] = this._CustomerInfo.Billmyform.get('CustomerId').value.CustomerId || 0;
      customerInvoiceRaiseUpdate['amount'] = this._CustomerInfo.Billmyform.get('Amount').value || 0;
      customerInvoiceRaiseUpdate['createdBy'] = this._loggedService.currentUserValue.user.id || 0;
      customerInvoiceRaiseUpdate['createdOn'] = formattedDate;
      customerInvoiceRaiseUpdate['modifiedBy'] = this._loggedService.currentUserValue.user.id || 0;
      customerInvoiceRaiseUpdate['modifiedOn'] = formattedDate;
      customerInvoiceRaiseUpdate['invoiceRaisedId'] = this._loggedService.currentUserValue.user.id || 0;


      let submitData = {
        "customerInvoiceRaiseUpdate": customerInvoiceRaiseUpdate,
      };
      console.log(submitData);
      this._CustomerInfo.UpdateCustomerBill(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record Updated Successfully.', 'Updated !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.onReset()
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
  onReset() {
    this._CustomerInfo.Billmyform.reset();
    this.onClose();
  }
  onClose() {
    this.dialogRef.close();
  }
  OnEdit(row) {
    var mdata = {
      CustomerId: row.CustomerId,
      Amount: row.Amount
      //Description: row.Amount,
  
    }
    this._CustomerInfo.PopulateFormbillRise(mdata);
  }
}
