import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { SupplierPaymentStatusService } from './supplier-payment-status.service';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierPaymentListComponent } from './supplier-payment-list/supplier-payment-list.component';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { element } from 'protractor';
import { error } from 'console';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-supplier-payment-status',
  templateUrl: './supplier-payment-status.component.html',
  styleUrls: ['./supplier-payment-status.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierPaymentStatusComponent implements OnInit {
  displayedColumns = [
    'CheckBox',
    'GRNNo',
    'GRNDate',
    'SupplierName',
    'InvoiceNo',
    'NetAmount',
    'PaidAmount',
    'BalAmount',
    'InvDate',
   // 'action',
  ];
  
  isSupplierSelected:boolean=false;
  ToStoreList:any=[];
  dateTimeObj:any;
  filteredSupplier:any;
  noOptionFound:any;
  sIsLoading:string='';
  vSupplierName:any;
  vInvoiceNo:any;
  GRNID:any;
  SelectedList:any=[];
  vNetAmount:any=0;
  vPaidAmount:any=0;
  vBalanceAmount:any=0;
  CurrentDate = new Date()

  dsSupplierpayList =new MatTableDataSource<SupplierPayStatusList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  constructor(
    public _SupplierPaymentStatusService : SupplierPaymentStatusService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getStoreList();
    this.getSupplierPayStatusList();
  } 
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._SupplierPaymentStatusService.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      this._SupplierPaymentStatusService.SearchFormGroup.get('ToStoreId').setValue(this.ToStoreList[0]);
    });
  }
  getSupplierList(){
    var vdata={
      'SupplierName': `${this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value}%`
    }
    this._SupplierPaymentStatusService.getSupplierSearchList(vdata).subscribe((data) =>{
      this.filteredSupplier = data ;
      if(this.filteredSupplier.length == 0){
        this.noOptionFound = true;
      }else{
        this.noOptionFound = false;
      }
    });
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  getSelectedSupplierObj(obj){
    this.getSupplierPayStatusList();
  }
                                
  getSupplierPayStatusList(){
    this.sIsLoading = '';
    var vdata={
      'ToStoreId': this.accountService.currentUserValue.user.storeId || 0,
      'From_Dt':this.datePipe.transform(this._SupplierPaymentStatusService.SearchFormGroup.get('start').value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'To_Dt':this.datePipe.transform(this._SupplierPaymentStatusService.SearchFormGroup.get('end').value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'IsPaymentProcess':this._SupplierPaymentStatusService.SearchFormGroup.get('Status').value || 0,
      'Supplier_Id':this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value.SupplierId || 0,
    }
    console.log(vdata)
    this._SupplierPaymentStatusService.getSupplierPayStatusList(vdata).subscribe((data) =>{
      this.dsSupplierpayList.data = data as SupplierPayStatusList[];
      console.log(this.dsSupplierpayList)
      this.dsSupplierpayList.sort =this.sort;
      this.dsSupplierpayList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });

      this.vNetAmount = 0;
      this.vPaidAmount = 0;
      this.vBalanceAmount = 0;
  } 


    selection = new SelectionModel<SupplierPayStatusList>(true, []);
    masterToggle() {
      debugger
        // if there is a selection then clear that selection
        if(this._SupplierPaymentStatusService.SearchFormGroup.get('Status').value == 1){
          this.toastr.warning('Please select unpaid list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
        if(!this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value){
          this.toastr.warning('Please select supplier Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
        if(this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value){
          if(!this.filteredSupplier.some(item=> item.SupplierId == this._SupplierPaymentStatusService.SearchFormGroup.get('SupplierId').value.SupplierId)){
            this.toastr.warning('Please select valid supplier Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          } 
        }  
      if (this.isSomeSelected()) {
      this.vNetAmount = 0;
      this.vPaidAmount = 0;
      this.vBalanceAmount = 0;
      this.selection.clear();
      this.SelectedList=[];
      } else {
        this.isAllSelected()
          ? this.selection.clear()
          : this.dsSupplierpayList.data.forEach(row => this.selection.select(row)); 

        this.dsSupplierpayList.data.forEach(element => {
          console.log(element)  
          this.GRNID = element.GRNID;
          this.vNetAmount += element.NetAmount
          this.vPaidAmount += element.PaidAmount
          this.vBalanceAmount += element.BalAmount
          this.SelectedList.push(element)
        })
     
      } 
        //this.SelectedList.push(this.selection.selected); 
        console.log(this.SelectedList)   
    } 
    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dsSupplierpayList.data.length;

      return numSelected === numRows;
  }

    isSomeSelected() { 
        return this.selection.selected.length > 0;
    }

 
  OnSelectSUpplier(event, element) {   
    this.GRNID = element.GRNID;
    if (event.checked) {
      if (this.SelectedList.length > 0) {
        if (!this.SelectedList.some(item => item.SupplierName == element.SupplierName)) {
          this.toastr.warning('Please select same supplier Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          }); 
          this.SelectedList = [];
          this.selection.clear()
          this.getSupplierPayStatusList();
          return;
        }  
        this.SelectedList.push(element) 
      } else {
        this.SelectedList.push(element)
      }

      this.vNetAmount += element.NetAmount
      this.vPaidAmount += element.PaidAmount
      this.vBalanceAmount += element.BalAmount
    }
    else {
      let index = this.SelectedList.indexOf(element);
      if (index >= 0) {
        this.SelectedList.splice(index, 1);
      }
      this.vNetAmount -= element.NetAmount
      this.vPaidAmount -= element.PaidAmount
      this.vBalanceAmount -= element.BalAmount


    }
    console.log(this.SelectedList)
  }
 
 
  // tableElementChecked(event, element) { 
  //   this.GRNID =  element.GRNID;
  //   if (event.checked) {
  //     console.log(element) 
  //     this.SelectedList.push(element)
  //     this.vNetAmount += element.NetAmount
  //     this.vPaidAmount += element.PaidAmount
  //     this.vBalanceAmount += element.BalAmount 
  //   }
  //   else{
  //     let index = this.SelectedList.indexOf(element);
  //     if (index >= 0) {
  //         this.SelectedList.splice(index, 1); 
  //     } 
  //     this.vNetAmount -= element.NetAmount
  //     this.vPaidAmount -= element.PaidAmount
  //     this.vBalanceAmount -= element.BalAmount
  //   }
  //   console.log(this.SelectedList) 
  // }

  OnSave() { 
    debugger
    if (!this.dsSupplierpayList.data.length) {
      this.toastr.warning('Please add Supplier list in table', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vBalanceAmount == 0 && this.vNetAmount == 0 ) {
      this.toastr.warning('Please select Check Box', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let grnHeaderPayStatus = [];
    this.SelectedList.forEach((element) => {
      let grnHeaderPayStatusObj = {};
      grnHeaderPayStatusObj['grnId'] = element.GRNID || 0;
      grnHeaderPayStatusObj['paidAmount'] = element.BalAmount || 0;
      grnHeaderPayStatusObj['balAmount'] =  element.PaidAmount || 0;
      grnHeaderPayStatus.push(grnHeaderPayStatusObj);
    });

    let SupPayDetPayStatus = [];
    this.SelectedList.forEach((element) => {
      let SupPayDetPayStatusObj = {};
      SupPayDetPayStatusObj['supPayId'] = 0
      SupPayDetPayStatusObj['supGrnId'] = element.GRNID || 0;
      SupPayDetPayStatus.push(SupPayDetPayStatusObj);
    });

    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(this.CurrentDate, 'dd/MM/YYYY') || '01/01/1900' 
    PatientHeaderObj['GRNID'] = this.GRNID; 
    PatientHeaderObj['NetPayAmount'] = this._SupplierPaymentStatusService.SearchFormGroup.get('NetAmount').value || 0;


    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "Phar-SupplierPay",
          advanceObj: PatientHeaderObj,
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)

      let submitData = {
        'tgrnHeaderPayStatus': grnHeaderPayStatus,
        'tSupPayDetPayStatus': SupPayDetPayStatus,
        'tgrNsupppayInsert': result.submitDataPay.ipPaymentInsert
      }
      console.log(submitData)
      this._SupplierPaymentStatusService.InsertSupplierPay(submitData).subscribe((response) => {
        if (response) {
          this.toastr.success('Supplier payment Successfuly', 'Saved', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.getSupplierPayStatusList();
          this.OnReset();
        }
        else {
          this.toastr.warning('Supplier payment Not Saved', 'Error', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      },
        error => {
          this.toastr.warning('Please Check Api Error', 'Error', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      );
    });
  }
  onClear(){
    this._SupplierPaymentStatusService.SearchFormGroup.reset({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      SupplierId:[''],
      Status:['0'],
    });
  }
  OnReset(){
    this.getSupplierList();
    this.vNetAmount = 0;
    this.vPaidAmount = 0;
    this.vBalanceAmount = 0;
    this.SelectedList = [];
    this.selection.clear();
  }
  getSupplierPaymentList() {  
    this.dsSupplierpayList.data = []; 
    const dialogRef = this._matDialog.open(SupplierPaymentListComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
       //console.log(result)  
    });
  }
  getSupplierPaymentReport(){
    
  }
}

export class SupplierPayStatusList{
  GRNNo: any;
  SupplierName: string;
  GRNDate: number;
  InvoiceNo: number;
  NetAmount: any;
  PaidAmount: any;
  BalAmount: any;
  InvDate:any;
  Mobile:any;
  GRNID:any;
constructor(SupplierPayStatusList){
  {
    this.GRNNo = SupplierPayStatusList.GRNNo || 0;
    this.SupplierName = SupplierPayStatusList.SupplierName || '';
    this.GRNDate = SupplierPayStatusList.GRNDate || 0;
    this.InvoiceNo = SupplierPayStatusList.InvoiceNo || 0;
    this.NetAmount = SupplierPayStatusList.NetAmount || 0;
    this.PaidAmount = SupplierPayStatusList.PaidAmount || 0;
    this.BalAmount = SupplierPayStatusList.BalAmount || '';
    this.InvDate = SupplierPayStatusList.InvDate || '';
    this.Mobile = SupplierPayStatusList.Mobile || 0;
    this.GRNID = SupplierPayStatusList.GRNID || 0;
  }
}
}
