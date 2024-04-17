import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CustomerBillRaiseService } from '../customer-bill-raise.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';


@Component({
  selector: 'app-new-bill-raise',
  templateUrl: './new-bill-raise.component.html',
  styleUrls: ['./new-bill-raise.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewBillRaiseComponent implements OnInit {

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;
  vInvoiceNo:any;
  vCustomerId:any;
  vAmount:any;
  vDescription:any;
  isCustomerIdSelected:boolean=false;
  registerObj:any;
  filteredOptions: Observable<string[]>;
  CustomerList:any=[];
  
  
  constructor(
    public _CustomerBill: CustomerBillRaiseService,
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
    
    this.filteredOptions = this._CustomerBill.myform.get('CustomerId').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
   this.getCustomerSearch() ;


    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.vAmount = this.registerObj.Amount;
      this.vInvoiceNo = this.registerObj.InvNumber;
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
  filteredOptionsCutomer:any;
  noOptionFound:any;
  vSupplierId:any;
  vCustomerName:any;
  // getCustomerSearchCombo() { 
  //   var m_data = {
  //     'CustomerName': `${this._CustomerBill.myform.get('CustomerId').value}%`
  //   }
  //   console.log(m_data)
  //   this._CustomerBill.getCustomerSearchCombo(m_data).subscribe(data => {
  //     this.filteredOptionsCutomer = data;
  //     console.log(this.filteredOptionsCutomer)
  //     if (this.filteredOptionsCutomer.length == 0) {
  //       this.noOptionFound = true;
  //     } else {
  //       this.noOptionFound = false;
  //     }
  //   });
  //   if(this.registerObj.CustomerId){
  //     const Customerselected = this.filteredOptionsCutomer.some(item => item.CustomerId == this.registerObj.CustomerId);
  //     this._CustomerBill.myform.get('CustomerId').setValue(Customerselected);
  //     //this._CustomerBill.myform.get('CustomerId').setValue
  //   }
  // }
  getOptionText(option) {
    return option && option.CustomerName ? option.CustomerName : '';
  }
  getCustomerSearch() { 
      var m_data = {
        'CustomerName': this._CustomerBill.myform.get('CustomerId').value || "%"
      }
      console.log(m_data)
      this._CustomerBill.getCustomerSearchCombo(m_data).subscribe(data => {
        this.CustomerList = data;
        console.log(this.CustomerList)
        if(this.registerObj.CustomerId >= 0){
          const Customerselected = this.CustomerList.find(c => c.CustomerId == this.registerObj.CustomerId);
          this._CustomerBill.myform.get('CustomerId').setValue(Customerselected);
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
  Savebtn:boolean=false;
  onSubmit(){
    if ((this.vInvoiceNo == '' || this.vInvoiceNo == null || this.vInvoiceNo == undefined)) {
      this.toastr.warning('Please enter a InvoiceNo', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
  }
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
  if(!this.registerObj.CustomerId){
  this.Savebtn = true;
  let customerInvoiceRaiseInsert = {};
  customerInvoiceRaiseInsert['invNumber'] = this._CustomerBill.myform.get('InvoiceNo').value || 0;
  customerInvoiceRaiseInsert['invDate'] = this.datePipe.transform(this._CustomerBill.myform.get('InvoiceDate').value, 'MM/dd/YYYY');
  customerInvoiceRaiseInsert['customerId'] = this._CustomerBill.myform.get('CustomerId').value.CustomerId ||  0;
  customerInvoiceRaiseInsert['amount'] = this._CustomerBill.myform.get('Amount').value || 0;
  customerInvoiceRaiseInsert['invoiceRaisedId'] = 0;
  customerInvoiceRaiseInsert['createdBy'] = this._loggedService.currentUserValue.user.id || 0;


  let submitData = {
    "customerInvoiceRaiseInsert": customerInvoiceRaiseInsert,
  };
  console.log(submitData);
  this._CustomerBill.SaveCustomerBill(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
      this.Savebtn = false;
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
}else{

  this.Savebtn = true;
  let customerInvoiceRaiseUpdate = {};
  customerInvoiceRaiseUpdate['invNumber'] = this._CustomerBill.myform.get('InvoiceNo').value || 0;
  customerInvoiceRaiseUpdate['invDate'] = this.datePipe.transform(this._CustomerBill.myform.get('InvoiceDate').value, 'MM/dd/YYYY');
  customerInvoiceRaiseUpdate['customerId'] = this._CustomerBill.myform.get('CustomerId').value.CustomerId ||  0;
  customerInvoiceRaiseUpdate['amount'] = this._CustomerBill.myform.get('Amount').value || 0;
  customerInvoiceRaiseUpdate['createdBy'] = this._loggedService.currentUserValue.user.id || 0;
  customerInvoiceRaiseUpdate['createdOn'] = this.datePipe.transform(this._CustomerBill.myform.get('InvoiceDate').value, 'MM/dd/YYYY');
  customerInvoiceRaiseUpdate['modifiedBy'] =this._loggedService.currentUserValue.user.id || 0;
  customerInvoiceRaiseUpdate['modifiedOn'] =  this.datePipe.transform(this._CustomerBill.myform.get('InvoiceDate').value, 'MM/dd/YYYY');
  customerInvoiceRaiseUpdate['invoiceRaisedId'] = 0;


  let submitData = {
    "customerInvoiceRaiseUpdate": customerInvoiceRaiseUpdate,
  };
  console.log(submitData);
  this._CustomerBill.UpdateCustomerBill(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Updated Successfully.', 'Updated !', {
        toastClass: 'tostr-tost custom-toast-success',
      }); 
      this.Savebtn = false;
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
  onReset(){
    this._CustomerBill.myform.reset();
    this.onClose(); 
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
