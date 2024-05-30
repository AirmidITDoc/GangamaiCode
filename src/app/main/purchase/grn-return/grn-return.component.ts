import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GrnReturnService } from './grn-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { GrnListComponent } from './new-grnreturn/grn-list/grn-list.component';
import { ToastrService } from 'ngx-toastr';
import { GrnItemList } from '../good-receiptnote/good-receiptnote.component';
import { FormBuilder } from '@angular/forms';
import { NewGRNReturnComponent } from './new-grnreturn/new-grnreturn.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-grn-return',
  templateUrl: './grn-return.component.html',
  styleUrls: ['./grn-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GRNReturnComponent implements OnInit {
  displayedColumns = [
    'Status',
    'GRNReturnId',
    'GRNReturnNo',
    'GRNReturnDate',
    //'StoreName',
    'SupplierName',
    'UserName',
    'GSTAmount',
    'NetAmount',
    'Remark',
    'AddedBy',
    'action',
  ];
  
  displayedColumns1 = [
    // "Action",
    "ItemName",
    "BatchNo",
    "BatchExpiryDate",
     "Conversion",
    "ReturnQty",
    "TotalQty",
    "MRP",
    "LandedRate",
    "Totalamt",
    "GST",
    "GSTAmount",
    "NetAmount",
    "StkId",
  ];


  SpinLoading: boolean = false;
  ToStoreList: any = [];
  SupplierList: any;
  optionsToStore: any;
  optionsSupplier: any;
  isPaymentSelected: boolean = false;
  isSupplierSelected: boolean = false; 
  dateTimeObj: any;
  screenFromString = 'admission-form'; 
  sIsLoading: string;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>; 
  vGRNReturnItemFilter: any;
  VsupplierId:any=0
  vFinalTotalAmount:any=0
  vFinalNetAmount:any=0
  vFinalVatAmount:any=0
  vFinalDiscAmount:any=0;
  vRoundingAmt:any;

  dsGRNReturnList = new MatTableDataSource<GRNReturnList>();
  dsGRNReturnItemDetList = new MatTableDataSource<GRNReturnItemDetList>();


  dsGrnItemList = new MatTableDataSource<ItemNameList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('paginator1', { static: true }) public paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) public paginator2: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  // items: Item[] = [];
  // displayedColumns: string[] = ['name', 'quantity'];
  // constructor(private fb: FormBuilder) {
  //   // Initialize table data
  //   this.items.push({ name: 'Item 1', quantity: 10 });
  //   this.items.push({ name: 'Item 2', quantity: 5 });
  // }
  constructor(
    public _GRNReturnService: GrnReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
  ) { }
                                                                 
   isDataAvailableInColumn(column: string): boolean {
    return this.dsGrnItemList.data.some(item => !!item[column]);
  }
  ngOnInit(): void {
    this.getStoreList();
    this.getGRNReturnList();
    this.getSupplierSearchCombo();

    this.filteredoptionsSupplier = this._GRNReturnService.GRNReturnSearchFrom.get('SupplierId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterSupplier(value)),
    ); 
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNReturnService.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data; 
      this._GRNReturnService.GRNReturnSearchFrom.get('ToStoreId').setValue(this.ToStoreList[0]); 
    });
  }
  
  getSupplierSearchCombo() {
    var vdata={
      'SupplierName':`${this._GRNReturnService.GRNReturnSearchFrom.get('SupplierId').value}%`,
    }
    this._GRNReturnService.getSupplierSearchList(vdata).subscribe(data => {
      this.SupplierList = data; 
    });
  }
  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.SupplierList.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  } 
  
  getGRNReturnList() {
    this.sIsLoading = 'loading-data';
    var Param = {
      "ToStoreId": this.accountService.currentUserValue.user.storeId || 0,
      "From_Dt": this.datePipe.transform(this._GRNReturnService.GRNReturnSearchFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._GRNReturnService.GRNReturnSearchFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "SupplierId": this._GRNReturnService.GRNReturnSearchFrom.get('SupplierId').value.SupplierId || 0,
      "IsVerify": this._GRNReturnService.GRNReturnSearchFrom.get("Status").value || 0,
    }
    console.log(Param);
    this._GRNReturnService.getGRNReturnList(Param).subscribe(data => {
      this.dsGRNReturnList.data = data as GRNReturnList[];
     // console.log(this.dsGRNReturnList);
      this.dsGRNReturnList.sort = this.sort;
      this.dsGRNReturnList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getGRNReturnItemDetList(Params) {
    this.sIsLoading = 'loading-data';
    var Param = {
      "GRNReturnId": Params.GRNReturnId
    }
    this._GRNReturnService.getGRNReturnItemDetList(Param).subscribe(data => {
      this.dsGRNReturnItemDetList.data = data as GRNReturnItemDetList[];
      this.dsGRNReturnItemDetList.sort = this.sort;
      this.dsGRNReturnItemDetList.paginator = this.paginator1;
      this.sIsLoading = '';
     // console.log(this.dsGRNReturnItemDetList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }

onClear() { } 
  getVerify(row) {

    let updateGRNReturnVerifyStatus = {};
    updateGRNReturnVerifyStatus['grnReturnId'] = row.GRNReturnId;
    updateGRNReturnVerifyStatus['isVerifiedUserId'] = this.accountService.currentUserValue.user.id;

    let submitObj = {
      "updateGRNReturnVerifyStatus": updateGRNReturnVerifyStatus
    }
   // console.log(submitObj)
    this._GRNReturnService.getVerifyGRNReturn(submitObj).subscribe(response => {
      if (response) {
        this.toastr.success('Record Verified Successfully.', 'Verified !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('Record Not Verified !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      // this.isLoading = '';
    },
      success => {
        this.toastr.success('Record Verified Successfully.', 'Verified !', {
          toastClass: 'tostr-tost custom-toast-success',
        });

      });
    this.getGRNReturnList();
  }

getNewGRNRet(){
  const dialogRef = this._matDialog.open(NewGRNReturnComponent,
    {
      maxWidth: "100%",
      height: '95%',
      width: '95%',
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result);
   this.getGRNReturnList();
  });
}


viewgetGRNreturnReportPdf(row) {
  debugger
  setTimeout(() => {
    this.SpinLoading = true;
    this._GRNReturnService.getGRNreturnreportview(
      row.GRNReturnId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "GRN RETURN REPORT Viewer"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.SpinLoading = false;
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        this.SpinLoading = false;
      });
    });

  }, 100);
}
}

export class GRNReturnList {
  GRNReturnId: number;
  GRNReturnDate: number;
  StoreName: string;
  SupplierName: string;
  GSTAmount: number;
  NetAmount: number;
  Remark: string;
  AddedBy: number;
  action: number;
  GRNReturnNo: number;
  UserName: any;

  constructor(GRNReturnList) {
    {
      this.GRNReturnId = GRNReturnList.GRNReturnId || 0;
      this.GRNReturnDate = GRNReturnList.GRNReturnDate || 0;
      this.StoreName = GRNReturnList.StoreName || "";
      this.SupplierName = GRNReturnList.SupplierName || "";
      this.GSTAmount = GRNReturnList.GSTAmount || 0;
      this.NetAmount = GRNReturnList.NetAmount || 0;
      this.Remark = GRNReturnList.Remark || "";
      this.AddedBy = GRNReturnList.AddedBy || 0;
      this.GRNReturnNo = GRNReturnList.GRNReturnNo || 0;
      this.UserName = GRNReturnList.UserName || '';
    }
  }
}

export class GRNReturnItemDetList {

  ItemName: string;
  BatchNo: number;
  BatchExpiryDate: number;
  Conversion:any;
  BalQty: number;
  ReturnQty: number;
  PureRate: number;
  Amount: number;
  GST: number;
  GSTAmount: number;
  NetAmount: number;
  BQty: number;
  StkId: number;
  TotalQty:any;
  MRP:number;
  LandedRate: number;
  Totalamt:any;

  constructor(GRNReturnItemDetList) {
    {

      this.ItemName = GRNReturnItemDetList.ItemName || "";
      this.BatchNo = GRNReturnItemDetList.BatchNo || 0;
      this.BatchExpiryDate = GRNReturnItemDetList.BatchExpiryDate || 0;
      this.BalQty = GRNReturnItemDetList.BalQty || 0;
      this.ReturnQty = GRNReturnItemDetList.ReturnQty || 0;
      this.PureRate = GRNReturnItemDetList.PureRate || 0;
      this.Amount = GRNReturnItemDetList.Amount || 0;
      this.GST = GRNReturnItemDetList.GST || 0;
      this.GSTAmount = GRNReturnItemDetList.GSTAmount || 0;
      this.NetAmount = GRNReturnItemDetList.NetAmount || 0;
      this.BQty = GRNReturnItemDetList.BQty || 0;
      this.StkId = GRNReturnItemDetList.StkId || 0;
      this.Conversion = GRNReturnItemDetList.Conversion || 0;
      this.TotalQty = GRNReturnItemDetList.totalQty || 0;
      this.MRP = GRNReturnItemDetList.MRP || 0;
      this.LandedRate = GRNReturnItemDetList.LandedRate || 0;
      this.Totalamt = GRNReturnItemDetList.Totalamt || 0;
    }
  }
}

// export class NewGRNReturnItemList {

//   GRNNO: number;
//   ItemName: number;
//   BatchNo: number;
//   BalQty: number;
//   ReturnQty: number;
//   LandedRate: number;
//   TotalAmount: number;
//   GST: number;
//   GSTAmount: number;
//   NetAmount: number;
//   IsBatchRequired: number;
//   StkID: number;
//   CF: number;
//   TotalQty: number;
//   GrnId: number;
//   position:any;

//   constructor(NewGRNReturnItemList) {
//     {
//       this.GRNNO = NewGRNReturnItemList.GRNNO || 0;
//       this.ItemName = NewGRNReturnItemList.ItemName || 0;
//       this.BatchNo = NewGRNReturnItemList.BatchNo || 0;
//       this.BalQty = NewGRNReturnItemList.BalQty || 0;
//       this.ReturnQty = NewGRNReturnItemList.ReturnQty || 0;
//       this.LandedRate = NewGRNReturnItemList.LandedRate || 0;
//       this.TotalAmount = NewGRNReturnItemList.TotalAmount || 0;
//       this.GST = NewGRNReturnItemList.GST || 0;
//       this.GSTAmount = NewGRNReturnItemList.GSTAmount || 0;
//       this.NetAmount = NewGRNReturnItemList.NetAmount || 0;
//       this.IsBatchRequired = NewGRNReturnItemList.IsBatchRequired || 0;
//       this.StkID = NewGRNReturnItemList.StkID || 0;
//       this.CF = NewGRNReturnItemList.CF || 0;
//       this.TotalQty = NewGRNReturnItemList.TotalQty || 0;
//       this.GrnId = NewGRNReturnItemList.GrnId || 0;
//     }
//   }
// }
export class ItemNameList {
  // Action: string;

  ItemName: string;
  UOMId: number;
  HSNCode: number;
  BatchNo: number;
  ExpDate: number;
  Qty: number;
  FreeQty: number;
  MRP: number;
  Rate: number;
  TotalAmount: number;
  Disc: number;
  DisAmount: number;
  GSTNo: number;
  GSTAmount: number;
  CGST: number;
  CGSTAmount: number;
  SGST: number;
  SGSTAmount: number;
  IGST: number;
  IGSTAmount: number;
  NetAmount: number;
  position: number;
  ItemID: any;
  ItemId: any;
  MRP_Strip: any;
  GRNId: any;
  GRNID: any;
  InvoiceNo: any;
  GateEntryNo: any;
  SupplierId: any;
  GrnNumber: any;
  OtherCharge: any;
  DebitNote: any;
  CreditNote: any;
  RoundingAmt: any;
  InvDate: Date;
  PaymentDate: Date;
  TotalDiscAmount: any;
  ReceivedBy: any;
  Remark: any;
  StoreId: any;
  totalVATAmount: any;
  ConversionFactor: any;
  ReceiveQty: any;
  CGSTAmt: number;
  CGSTPer: number;
  SGSTAmt: number;
  SGSTPer: number;
  IGSTPer: number;
  IGSTAmt: number;
  HSNcode: any;
  VatAmount: number;
  VatPer: number;
  id: number;
  ConstantId: number;
  discPercentage: number;
  discAmount: number;
  DiscPercentage: number;
  DiscAmount: number;
  DiscPer2: number;
  DiscAmt2: number;
  PaymentType: any;
  GRNType: any;
  DateOfInvoice: any;
  EwayBillDate: Date;
  CurrentDate = new Date();
  Tranprocessmode: any;
  Cash_CreditType: boolean;
  tranProcessMode: any;
  EwayBillNo: any;
  TotalQty: any;
  UnitofMeasurementName: number;
  UnitofMeasurementId: any;
  POBalQty: any;
  PurchaseId: any;
  IsClosed: boolean;
  PurDetId: any;
  LandedRate: any;
  PurUnitRate: any;
  PurUnitRateWF: any;
  BatchExpDate: any;
  POQty: any;
  ItemDiscAmount:any;
  DiscPer:any;
  ItemTotalAmount:any;
  UOMID:any;
  GrandTotalAmount:any;
  TranProcessId:any;
  UnitMRP:any;
  IsVerified:any;
  IsVerifiedDatetime:any;
  IsVerifiedUserId:any;
  StkID:any;
  OtherTax:any
  BalanceQty:any;
  PurchaseID:any;
  GRNDetID:any;
  ReturnQty:any;
  
  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
    
      this.ItemName = ItemNameList.ItemName || "";
      this.UOMId = ItemNameList.UOMId || 0;
      this.HSNCode = ItemNameList.HSNCode || 0;
      this.BatchNo = ItemNameList.BatchNo || 0;
      this.ExpDate = ItemNameList.ExpDate || 0;
      this.Qty = ItemNameList.Qty || 0;
      this.FreeQty = ItemNameList.FreeQty || 0;
      this.MRP = ItemNameList.MRP || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.Disc = ItemNameList.Disc || '';
      this.DisAmount = ItemNameList.DisAmount || 0;
      this.DiscPer2 = ItemNameList.DiscPer2 || 0;
      this.DiscAmt2 = ItemNameList.DiscAmt2 || 0;
      this.GSTNo = ItemNameList.GSTNo || 0;
      this.GSTAmount = ItemNameList.GSTAmount || 0;
      this.CGST = ItemNameList.CGST || 0;
      this.CGSTAmount = ItemNameList.CGSTAmount || 0;
      this.SGST = ItemNameList.SGST || 0;
      this.SGSTAmount = ItemNameList.SGSTAmount || 0;
      this.IGST = ItemNameList.IGST || 0;
      this.IGSTAmount = ItemNameList.IGSTAmount || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
      this.ItemID = ItemNameList.ItemID || 0;
      this.ItemId = ItemNameList.ItemId || 0;
      this.VatPer = ItemNameList.VatPer || 0;
      this.MRP_Strip = ItemNameList.MRP_Strip || 0;
      this.GRNId = ItemNameList.GRNId || 0;
      this.GRNID = ItemNameList.GRNID || 0;
      this.InvoiceNo = ItemNameList.InvoiceNo || 0;
      this.GateEntryNo = ItemNameList.GateEntryNo || 0;
      this.SupplierId = ItemNameList.SupplierId || 0;
      this.GrnNumber = ItemNameList.GrnNumber || 0;
      this.OtherCharge = ItemNameList.OtherCharge || 0;
      this.DebitNote = ItemNameList.DebitNote || 0;
      this.CreditNote = ItemNameList.CreditNote || 0;
      this.RoundingAmt = ItemNameList.RoundingAmt || 0;
      this.InvDate = ItemNameList.InvDate || this.CurrentDate;;
      this.TotalDiscAmount = ItemNameList.TotalDiscAmount || 0;
      this.totalVATAmount = ItemNameList.totalVATAmount || 0;
      this.ReceivedBy = ItemNameList.ReceivedBy || ''
      this.Remark = ItemNameList.Remark || ''
      this.StoreId = ItemNameList.StoreId || 0;
      this.TotalQty = ItemNameList.TotalQty || 0;
      this.EwayBillNo = ItemNameList.EwayBillNo || 0;
      this.Tranprocessmode = ItemNameList.Tranprocessmode || "";
      this.EwayBillDate = ItemNameList.EwayBillDate || this.CurrentDate;
      this.PaymentDate = ItemNameList.PaymentDate || this.CurrentDate;
      this.DateOfInvoice = ItemNameList.DateOfInvoice || this.CurrentDate;
      this.LandedRate = ItemNameList.LandedRate || 0;
      this.PurUnitRate = ItemNameList.PurUnitRate || 0;
      this.PurUnitRateWF = ItemNameList.PurUnitRateWF || 0;
      this.BatchExpDate = ItemNameList.BatchExpDate || 0;
      this.PurchaseId = ItemNameList.PurchaseId || 0;
      this.ItemDiscAmount = ItemNameList.ItemDiscAmount || 0;
      this.DiscPer = ItemNameList.DiscPer || 0;
      this.ItemTotalAmount = ItemNameList.ItemTotalAmount || 0;
      this.UOMID = ItemNameList.UOMID || 0;
      this.GrandTotalAmount = ItemNameList.GrandTotalAmount || 0;
      this.UnitMRP = ItemNameList.UnitMRP || 0;
      this.IsVerified = ItemNameList.IsVerified || 0;
      this.IsVerifiedDatetime = ItemNameList.IsVerifiedDatetime || 0;
      this.IsVerifiedUserId = ItemNameList.IsVerifiedUserId || 0;
      this.StkID = ItemNameList.StkID || 0;
      this.OtherTax = ItemNameList.OtherTax || 0;
      this.BalanceQty = ItemNameList.BalanceQty || 0;
      this.GRNDetID = ItemNameList.GRNDetID || 0; 
       this.ReturnQty = ItemNameList.ReturnQty || 0;
       this.Cash_CreditType = ItemNameList.Cash_CreditType ;
    }
  }
}