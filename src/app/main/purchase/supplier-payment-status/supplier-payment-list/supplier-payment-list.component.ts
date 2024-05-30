import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations'; 
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { SupplierPaymentStatusService } from '../supplier-payment-status.service';

@Component({
  selector: 'app-supplier-payment-list',
  templateUrl: './supplier-payment-list.component.html',
  styleUrls: ['./supplier-payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SupplierPaymentListComponent implements OnInit {  
    displayedColumns = [
      'SupPayNo',
      'Date',
      'SupplierName',
      'TotalAmount',
      'CashPayAmt',
      'ChequePayAmt',
      'UserName',
      'PartyReceipt',
      'action',
    ];
    
    isSupplierSelected:boolean=false;
    ToStoreList:any=[];
    dateTimeObj:any;
    filteredSupplier:any;
    noOptionFound:any;
    sIsLoading:string='';
  
    dsSupplierList =new MatTableDataSource<SupplierPayStatusList>();
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
    }
    toggleSidebar(name): void {
      this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    getDateTime(dateTimeObj) {
      this.dateTimeObj = dateTimeObj;
    }
 
    getSupplierList(){
      var vdata={
        'SupplierName': `${this._SupplierPaymentStatusService.SupplierListForm.get('SupplierId').value}%`
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
        'From_Dt':this.datePipe.transform(this._SupplierPaymentStatusService.SupplierListForm.get('start').value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        'To_Dt':this.datePipe.transform(this._SupplierPaymentStatusService.SupplierListForm.get('end').value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        'IsPaymentProcess':this._SupplierPaymentStatusService.SupplierListForm.get('Status').value || 0,
        'Supplier_Id':this._SupplierPaymentStatusService.SupplierListForm.get('SupplierId').value.SupplierId || 0,
      }
      console.log(vdata)
      this._SupplierPaymentStatusService.getSupplierPayStatusList(vdata).subscribe((data) =>{
        this.dsSupplierList.data = data as SupplierPayStatusList[];
        console.log(this.dsSupplierList)
        this.dsSupplierList.sort =this.sort;
        this.dsSupplierList.paginator = this.paginator;
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
    }
  
    onClear(){
  
    }
    onClose(){
      this._matDialog.closeAll();
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
