import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DeliverychallanService } from './deliverychallan.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { UpdatedeliveryComponent } from './updatedelivery/updatedelivery.component';

@Component({
  selector: 'app-deliverychallan',
  templateUrl: './deliverychallan.component.html',
  styleUrls: ['./deliverychallan.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class DeliverychallanComponent implements OnInit {
  displayedColumns = [
    'Status',
    'DeliveryNo',
    'DeliveryDate',
    'InvoiceNo',
    'SupplierName',
    'TotalAmount',
    'TotalDiscAmount',
    'TotalVATAmount',
    'NetAmount',
    'RoundingAmt',
    'DebitNote',
    'CreditNote',
    'Cash_CreditType',
    'ReceivedBy',
    'IsClosed',
    'Action1',
  ];

  displayedColumns1 = [
    "ItemName",
    "BatchNo",
    "BatchExpDate",
    "ReceiveQty",
    "FreeQty",
    "MRP",
    "Rate",
    "TotalAmount",
    "ConversionFactor",
    "VatPercentage",
    "DiscPercentage",
    //"LandedRate",
    "NetAmount",
    "TotalQty",

  ];

 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filteredOptions: any;
  isPaymentSelected:boolean = false;
  isSupplierSelected:boolean = false;
  noOptionFound: boolean;
  ItemName: any;
  UOM: any = 0;
  HSNCode: any = 0;
  Dis: any = 0;
  BatchNo: any;
  Qty: any;
  ExpDate: any;
  MRP: any;
  FreeQty: any = 0;
  Rate: any;
  TotalAmount: any;
  Disc: any = 0;
  DisAmount: any = 0;
  CGST: any;
  CGSTAmount: any;
  SGST: any;
  SGSTAmount: any;
  IGST: any = 0;
  IGSTAmount: any = 0;
  NetAmount: any;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsItemName: Observable<string[]>;
  optionsToStore: any;
  optionsFrom: any;
  optionsMarital: any;
  optionsSupplier: any;
  optionsItemName: any;
  renderer: any;
  GST: any = 0;
  GSTAmount: any = 0;
  GSTAmt: any;
  DiscAmt: any;
  tab: number = 3;
  selectedIndex = 0;
  sIsLoading:string ;
  SupplierList:any=[];
  StoreList:any=[];
  StoreName:any;



  dsGRNList = new MatTableDataSource<GRNList>();

  dsGrnItemList = new MatTableDataSource<GrnItemList>();

  constructor(
    public _DeliveryService: DeliverychallanService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    // this.getToStoreSearchList();
    // this.getSupplierSearchList();
    this.getSupplierSearchCombo();
    // this.getFromStoreSearchList();
    this.getToStoreSearchCombo();
    this.getSupplierSearchCombo();
    // this.gePharStoreList();
    this.getGRNList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getGRNList() {

    var Param = {

      "ToStoreId": this.accountService.currentUserValue.user.storeId,// this._GRNService.GRNSearchGroup.get('ToStoreId').value.storeid,
      "From_Dt": this.datePipe.transform(this._DeliveryService.GRNSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._DeliveryService.GRNSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsVerify": this._DeliveryService.GRNSearchGroup.get("Status1").value || 0,
      "Supplier_Id": this._DeliveryService.GRNSearchGroup.get('SupplierId').value.SupplierId || 0,
    }
   // console.log(Param);
    this._DeliveryService.getGRNList(Param).subscribe(data => {
      this.dsGRNList.data = data as GRNList[];
      this.dsGRNList.sort = this.sort;
      this.dsGRNList.paginator = this.paginator;
      console.log(this.dsGRNList);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getGrnItemDetailList(Params) {
    debugger
    this.sIsLoading = 'loading-data';
    var Param = {
      "GrnId": Params.GRNID
    }
    this._DeliveryService.getGrnItemList(Param).subscribe(data => {
      this.dsGrnItemList.data = data as GrnItemList[];
      //console.log(data)
      this.dsGrnItemList.sort = this.sort;
      this.dsGrnItemList.paginator = this.paginator;
      this.sIsLoading = '';
       console.log(this.dsGrnItemList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }
  
  getSupplierSearchCombo() {

    this._DeliveryService.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
     // console.log(data);
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._DeliveryService.GRNSearchGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );

    });
  }
  getToStoreSearchCombo() {

    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._DeliveryService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._DeliveryService.GRNSearchGroup.get('ToStoreId').setValue(this.StoreList[0]);
      this.StoreName = this._DeliveryService.GRNSearchGroup.get('ToStoreId').value.StoreName;
    });
  }
  private _filterSupplier(value: any): any {
    throw new Error('Method not implemented.');
  }
  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';

  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';

  }
  @ViewChild('GRNListTemplate') GRNListTemplate: ElementRef;
  reportPrintObjList: GRNList[] = [];
  printTemplate: any;
  reportPrintObj: GRNList;
  reportPrintObjTax: GRNList;
  subscriptionArr: Subscription[] = [];
  TotalAmt: any = 0;
  TotalQty: any = 0;
  TotalRate: any = 0;
  TotalNetAmt: any = 0;
  TOtalDiscPer: any = 0;
  TotalGSTAmt: any = 0;

  getPrint(el) {

    var m_data = {
      "GRNID": el.GRNID
    }
    console.log(m_data);
    this._DeliveryService.getPrintGRNList(m_data).subscribe(data => {
      this.reportPrintObjList = data as GRNList[];
      // debugger
      for (let i = 0; i < 10; i++) {
        this.reportPrintObj = data[0] as GRNList;
        this.TotalAmt += data[i].TotalAmount
        this.TotalQty += data[i].TotalQty
        this.TotalRate += data[i].Rate
        this.TOtalDiscPer += data[i].TotalDiscAmount
        this.TotalGSTAmt += data[i].TotalVATAmount
        this.TotalNetAmt += data[i].NetPayble

        console.log(this.reportPrintObjList);

        setTimeout(() => {
          this.print3();
        }, 1000);
      }
    })

  }

  print3() {
    let popupWin, printContents;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');

    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
      <style type="text/css" media="print">
    @page { size: portrait; }
  </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.GRNListTemplate.nativeElement.innerHTML}</body>
    <script>
      var css = '@page { size: portrait; }',
      head = document.head || document.getElementsByTagName('head')[0],
      style = document.createElement('style');
      style.type = 'text/css';
      style.media = 'print';
  
      if (style.styleSheet){
          style.styleSheet.cssText = css;
      } else {
          style.appendChild(document.createTextNode(css));
      }
      head.appendChild(style);
    </script>
    </html>`);
    // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
    // </html>`);

    popupWin.document.close();
  }
  msg:any;
  onVerify(row) {
    var Param = {
      "updateGRNVerifyStatus": {
      "grnid": row.GRNID,
      "isVerified": true, 
    }
  }
    console.log(Param)
    this._DeliveryService.getVerifyGRN(Param).subscribe(data => {
      this.msg = data;
      console.log(this.msg);
      // if(data){
      //   this.toastr.success('Record Verified Successfully.', 'Verified !', {
      //     toastClass: 'tostr-tost custom-toast-success',
      //   }); 
      // }
      } ,success => {
        this.toastr.success('Record Verified Successfully.', 'Verified !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      });this.getGRNList();
  }
  onClear() {
  }
  
  onEdit(contact) {

    // console.log(contact)

    const dialogRef = this._matDialog.open(UpdatedeliveryComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

newDelivery(){
  // this.chkNewGRN=1;
    const dialogRef = this._matDialog.open(UpdatedeliveryComponent,
      {
        maxWidth: "100%",
        height: '95%',
         width: '95%',
        // data: {
        //   chkNewGRN:this.chkNewGRN
        // }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
    //this.getGRNList();
}
}
export class GRNList {
  DeliveryNo: number;
  DeliveryDate: number;
  InvoiceNo: number;
  SupplierName: string;
  TotalAmount: number;
  TotalDiscAmount: number;
  TotalVATAmount: number;
  NetAmount: number;
  RoundingAmt: number;
  DebitNote: number;
  CreditNote: number;
  InvDate: number;
  Cash_CreditType: string;
  ReceivedBy: any;
  IsClosed: any;
  GSTNo:any;

  /**
   * Constructor
   *
   * @param GRNList
   */
  constructor(GRNList) {
    {
      this.DeliveryNo = GRNList.DeliveryNo || 0;
      this.DeliveryDate = GRNList.DeliveryDate || 0;
      this.InvoiceNo = GRNList.InvoiceNo || 0;
      this.SupplierName = GRNList.SupplierName || "";
      this.TotalAmount = GRNList.TotalAmount || 0;
      this.TotalDiscAmount = GRNList.TotalDiscAmount || 0;
      this.TotalVATAmount = GRNList.TotalVATAmount || 0;
      this.NetAmount = GRNList.NetAmount || 0;
      this.RoundingAmt = GRNList.RoundingAmt || 0;
      this.DebitNote = GRNList.DebitNote || 0;
      this.CreditNote = GRNList.CreditNote || 0;
      this.InvDate = GRNList.InvDate || 0;
      this.Cash_CreditType = GRNList.Cash_CreditType || "";
      this.ReceivedBy = GRNList.ReceivedBy || 0;
      this.IsClosed = GRNList.IsClosed || 0;
      this.GSTNo = GRNList.GSTNo || 0;
    }
  }
}
export class GrnItemList {

  ItemID:any;
  ItemName: string;
  BatchNo: number;
  BatchExpDate: number;
  ReceiveQty: number;
  FreeQty: number;
  MRP: number;
  Rate: number;
  TotalAmount: number;
  ConversionFactor: number;
  VatPercentage: number;
  DiscPercentage: number;
  LandedRate: number;
  NetAmount: number;
  TotalQty: number;

  /**
   * Constructor
   *
   * @param GrnItemList
   */
  constructor(GrnItemList) {
    {

      this.ItemID = GrnItemList.ItemID || 0;
      this.ItemName = GrnItemList.ItemName || "";
      this.BatchNo = GrnItemList.BatchNo || 0;
      this.BatchExpDate = GrnItemList.BatchExpDate || 0;
      this.ReceiveQty = GrnItemList.ReceiveQty || 0;
      this.FreeQty = GrnItemList.FreeQty || 0;
      this.MRP = GrnItemList.MRP || 0;
      this.Rate = GrnItemList.Rate || 0;
      this.TotalAmount = GrnItemList.TotalAmount || 0;
      this.ConversionFactor = GrnItemList.ConversionFactor || 0;
      this.VatPercentage = GrnItemList.VatPercentage || 0;
      this.DiscPercentage = GrnItemList.DiscPercentage || 0;
      this.LandedRate = GrnItemList.LandedRate || 0;
      this.NetAmount = GrnItemList.NetAmount || 0;
      this.TotalQty = GrnItemList.TotalQty || 0;

    }
  }
}
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
  ItemId:any;
  VatPer: any;
  VatAmt: any;
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
  StoreId:any;
  totalVATAmount:any;
  ConversionFactor:any;
  ReceiveQty: any;
  CGSTAmt: number;
  CGSTPer: number;
  SGSTAmt: number;
  SGSTPer: number;
  IGSTPer: number;
  IGSTAmt: number;
  HSNcode: any;
  VatAmount: number;
  VatPercentage: number;
  id: number;
  ConstantId: number;
  discPercentage: number;
  discAmount: number;
  DiscPercentage: number;
  DiscAmount: number;
  PaymentType:any;
  GRNType:any;
  DateOfInvoice:any;
  EwalBillDate:Date;
  CurrentDate=new Date();
  Tranprocessmode:any;
  Cash_CreditType:any;
  tranProcessMode:any;
  
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
      this.Disc = ItemNameList.Disc  ;
      this.DisAmount = ItemNameList.DisAmount || 0;
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
      this.VatAmt = ItemNameList.VatAmt || 0;
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
      this.Tranprocessmode = ItemNameList.Tranprocessmode || "";
      this.EwalBillDate=ItemNameList.EwalBillDate || this.CurrentDate;
      this.PaymentDate=ItemNameList.PaymentDate ||  this.CurrentDate;
      this.DateOfInvoice=ItemNameList.DateOfInvoice ||  this.CurrentDate;
    }
  }
}
