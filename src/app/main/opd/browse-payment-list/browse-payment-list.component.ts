import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BrowsePaymentListService } from './browse-payment-list.service';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-browse-payment-list',
  templateUrl: './browse-payment-list.component.html',
  styleUrls: ['./browse-payment-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BrowsePaymentListComponent implements OnInit {

  click: boolean = false;
  MouseEvent = true;
  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  displayedColumns = [
    'RegNo',
    'PatientName',
    'PaymentDate',
    'PBillNo',
    'ReceiptNo',
    'PayDate',
    'UserName',
    'TotalAmt',
    'BalanceAmt',
    'CashPayAmount',
    'ChequePayAmount',
    'CardPayAmount',
    'AdvanceUsedAmount',
    'PaidAmount',
    'NEFTPayAmount',
    'PayTMAmount',
    'buttons'
  ];
  dataSource = new MatTableDataSource<BrowseOpdPaymentReceipt>();

  constructor(
    private _fuseSidebarService: FuseSidebarService,
    public _BrowseOpdPaymentReceiptService: BrowsePaymentListService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.getBrowseOpdPaymentReceiptList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  onShow(event: MouseEvent) {
    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        this.getBrowseOpdPaymentReceiptList();
      }
    }, 10);
    this.MouseEvent = true;
  }
  onClear() {
    this._BrowseOpdPaymentReceiptService.myFilterform.get('FirstName').reset();
    this._BrowseOpdPaymentReceiptService.myFilterform.get('LastName').reset();
    this._BrowseOpdPaymentReceiptService.myFilterform.get('RegNo').reset();
    this._BrowseOpdPaymentReceiptService.myFilterform.get('PBillNo').reset();
    this._BrowseOpdPaymentReceiptService.myFilterform.get('ReceiptNo').reset();
  }


  getBrowseOpdPaymentReceiptList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._BrowseOpdPaymentReceiptService.myFilterform.get("LastName").value + '%' || "%",
      "From_Dt": this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._BrowseOpdPaymentReceiptService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Reg_No": this._BrowseOpdPaymentReceiptService.myFilterform.get("RegNo").value || 0,
      "PBillNo": this._BrowseOpdPaymentReceiptService.myFilterform.get("PBillNo").value || 0,
      "ReceiptNo": this._BrowseOpdPaymentReceiptService.myFilterform.get("ReceiptNo").value || 0,
    }
    this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptList(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as BrowseOpdPaymentReceipt[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }
}

export class BrowseOpdPaymentReceipt {
  PaymentId: Number;
  BillNo: Number;
  RegNo: number;
  RegId: number;
  PatientName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  TotalAmt: number;
  BalanceAmt: number;
  Remark: string;
  PaymentDate: any;
  CashPayAmount: number;
  ChequePayAmount: number;
  CardPayAmount: number;
  AdvanceUsedAmount: number;
  AdvanceId: number;
  RefundId: number;
  IsCancelled: boolean;
  AddBy: number;
  UserName: string;
  PBillNo: string;
  ReceiptNo: string;
  TransactionType: number;
  PayDate: Date;
  PaidAmount: number;
  NEFTPayAmount: number;
  PayTMAmount: number;

  /**
   * Constructor
   *
   * @param BrowseOpdPaymentReceipt
   */
  constructor(BrowseOpdPaymentReceipt) {
    {
      this.PaymentId = BrowseOpdPaymentReceipt.PaymentId || '';
      this.BillNo = BrowseOpdPaymentReceipt.BillNo || '';
      this.RegNo = BrowseOpdPaymentReceipt.RegNo || '';
      this.RegId = BrowseOpdPaymentReceipt.RegId || '';
      this.PatientName = BrowseOpdPaymentReceipt.PatientName || '';
      this.FirstName = BrowseOpdPaymentReceipt.FirstName || '';
      this.MiddleName = BrowseOpdPaymentReceipt.MiddleName || '';
      this.LastName = BrowseOpdPaymentReceipt.LastName || '';
      this.TotalAmt = BrowseOpdPaymentReceipt.TotalAmt || '';
      this.BalanceAmt = BrowseOpdPaymentReceipt.BalanceAmt || '';

      this.Remark = BrowseOpdPaymentReceipt.Remark || '';
      this.PaymentDate = BrowseOpdPaymentReceipt.PaymentDate || '';
      this.CashPayAmount = BrowseOpdPaymentReceipt.CashPayAmount || '';
      this.ChequePayAmount = BrowseOpdPaymentReceipt.ChequePayAmount || '';
      this.CardPayAmount = BrowseOpdPaymentReceipt.CardPayAmount || '';
      this.AdvanceUsedAmount = BrowseOpdPaymentReceipt.AdvanceUsedAmount || '';
      this.AdvanceId = BrowseOpdPaymentReceipt.AdvanceId || '';
      this.RefundId = BrowseOpdPaymentReceipt.RefundId || '';
      this.IsCancelled = BrowseOpdPaymentReceipt.IsCancelled || '';
      this.AddBy = BrowseOpdPaymentReceipt.AddBy || '';

      this.UserName = BrowseOpdPaymentReceipt.UserName || '';
      this.ReceiptNo = BrowseOpdPaymentReceipt.ReceiptNo || '';
      this.PBillNo = BrowseOpdPaymentReceipt.PBillNo || '';
      this.TransactionType = BrowseOpdPaymentReceipt.TransactionType || '';
      this.PayDate = BrowseOpdPaymentReceipt.PayDate || '';
      this.PaidAmount = BrowseOpdPaymentReceipt.PaidAmount || '';
      this.NEFTPayAmount = BrowseOpdPaymentReceipt.NEFTPayAmount || '';
      this.PayTMAmount = BrowseOpdPaymentReceipt.PayTMAmount || '';
    }

  }
}