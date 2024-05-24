import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DiscountAfterSalesBillService } from './discount-after-sales-bill.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-discount-after-sales-bill',
  templateUrl: './discount-after-sales-bill.component.html',
  styleUrls: ['./discount-after-sales-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DiscountAfterSalesBillComponent implements OnInit {
  displayedColumns = [
    'Date',
    'SalesNo',
    'TotalAmt',
    'DiscountAmt',
    'NetAmount',
    'PaidAmount',
    'RefundAmount',
    'BalanceAmt',
    'PaidAmt',
    'BillBalAmt',
    'Discper',
    'PrDiscPer',
    'AFTBalAmt',
    'CashPay',
    'CardPay',
    'PayTM',
    'NeftPay'
  ];

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  ItemfilteredOptions:any;
  noOptionFound:any;
  filteredOptions:any;

  dsSalesBillList = new MatTableDataSource<SalesBillList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

  constructor(
    public _DiscAftSalesBillService: DiscountAfterSalesBillService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) { 
    this.dateTimeObj = dateTimeObj;
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  } 
  onClear(){
    this._DiscAftSalesBillService.SearchGroupForm.reset();
  }
  getSalesList(){

  }
}
export class SalesBillList {

  Date: any;
  SalesNo: number;
  TotalAmt: number;
  DisountAmt: any;
  NetAmount: number;
  PaidAmount: number;
  RefundAmount: number;
  BalanceAmt: any;
  PaidAmt: any;
  BillBalAmt: any;
  Discper:any;
  PrDiscPer:any;
  AFTBalAmt:any;
  CashPay:any;
  CardPay:any;
  NeftPay:any;
  PayTM:any;

  constructor(SalesBillList) {
    {
      this.Date = SalesBillList.Date || 0;
      this.SalesNo = SalesBillList.SalesNo || 0;
      this.TotalAmt = SalesBillList.TotalAmt || 0;
      this.DisountAmt = SalesBillList.DisountAmt || 0;
      this.NetAmount = SalesBillList.NetAmount || 0;
      this.PaidAmount = SalesBillList.PaidAmount || 0;
      this.RefundAmount = SalesBillList.RefundAmount || 0;
      this.BalanceAmt = SalesBillList.BalanceAmt || 0;
      this.PaidAmt = SalesBillList.PaidAmt || 0;
      this.BillBalAmt = SalesBillList.BillBalAmt || 0;
      this.Discper = SalesBillList.Discper || 0;
      this.PrDiscPer = SalesBillList.PrDiscPer || 0;
      this.AFTBalAmt = SalesBillList.AFTBalAmt || 0; 
      this.CashPay = SalesBillList.CashPay || 0;
      this.CardPay = SalesBillList.CardPay || 0;
      this.NeftPay = SalesBillList.NeftPay || 0;
      this.PayTM = SalesBillList.PayTM || 0;

    }
  } 
}
