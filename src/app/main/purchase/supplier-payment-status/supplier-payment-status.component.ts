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
    'GRNReturnNo',
    'GRNReturnDate',
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
  }
  SelectedArray: any = [];
  tableElementChecked(event, element) {
    if (event.checked) {
      console.log(element) 
      this.vNetAmount += element.NetAmount
      this.vPaidAmount += element.PaidAmount
      this.vBalanceAmount += element.BalAmount
      // this.SelectedArray.push(element);
    }
    else{
      this.vNetAmount -= element.NetAmount
      this.vPaidAmount -= element.PaidAmount
      this.vBalanceAmount -= element.BalAmount
    }
    //console.log(this.SelectedArray) 
  }
  vNetAmount:any=0;
  vPaidAmount:any=0;
  vBalanceAmount:any=0;
  OnSave(){
    if ((this.vBalanceAmount < 0)) {
      this.toastr.warning('Please select Check Box', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
    let SupplierPayDetailsObj = {};
    SupplierPayDetailsObj['NetAmount'] = this.vNetAmount;
    SupplierPayDetailsObj['PaidAmount'] = this.vPaidAmount;
    SupplierPayDetailsObj['BalAmount'] = this.vBalanceAmount; 
    // this.isLoading123=false;
    const dialogRef = this._matDialog.open(OpPaymentNewComponent,
      {
        data: {
          vPatientHeaderObj: SupplierPayDetailsObj,
          FromName: "Phar-SupplierPay"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
  });
}
  onClear(){

  }
  OnReset(){
    this.getSupplierList();
    this.vNetAmount = 0;
    this.vPaidAmount = 0;
    this.vBalanceAmount = 0;
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
}

export class SupplierPayStatusList{
  GRNReturnNo: any;
  SupplierName: string;
  GRNReturnDate: number;
  InvoiceNo: number;
  NetAmount: any;
  PaidAmount: any;
  BalAmount: any;
  InvDate:any;
  Mobile:any;
constructor(SupplierPayStatusList){
  {
    this.GRNReturnNo = SupplierPayStatusList.GRNReturnNo || 0;
    this.SupplierName = SupplierPayStatusList.SupplierName || '';
    this.GRNReturnDate = SupplierPayStatusList.GRNReturnDate || 0;
    this.InvoiceNo = SupplierPayStatusList.InvoiceNo || 0;
    this.NetAmount = SupplierPayStatusList.NetAmount || 0;
    this.PaidAmount = SupplierPayStatusList.PaidAmount || 0;
    this.BalAmount = SupplierPayStatusList.BalAmount || '';
    this.InvDate = SupplierPayStatusList.InvDate || '';
    this.Mobile = SupplierPayStatusList.Mobile || 0;
  }
}
}
