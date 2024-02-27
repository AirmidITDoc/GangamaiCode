import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from './good-receiptnote.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { UpdateGRNComponent } from './update-grn/update-grn.component';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GrnemailComponent } from './grnemail/grnemail.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { EmailComponent } from '../purchase-order/email/email.component';
import { QrcodegeneratorComponent } from 'app/main/purchase/good-receiptnote/qrcodegenerator/qrcodegenerator.component';

@Component({
  selector: 'app-good-receiptnote',
  templateUrl: './good-receiptnote.component.html',
  styleUrls: ['./good-receiptnote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class GoodReceiptnoteComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  FromStoreList: any;
  SupplierList: any;
  screenFromString = 'admission-form';
  isPaymentSelected: boolean = false;
  isSupplierSelected: boolean = false;
  isItemNameSelected: boolean = false;
  registerObj = new RegInsert({});
  chargeslist: any = [];
  isChecked: boolean = true;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;


  StoreList: any = [];
  StoreName: any;
  ItemID: any;
  VatPercentage: any;
  GSTPer: any;
  Specification: any;
  VatAmount: any;
  FinalNetAmount: any;
  FinalDisAmount: any;
  NetPayamount: any;
  CGSTFinalAmount: any;
  SGSTFinalAmount: any;
  IGSTFinalAmount: any;
  TotalFinalAmount: any;
  chkNewGRN: any;
  SpinLoading: boolean = false;
  dsGRNList = new MatTableDataSource<GRNList>();

  dsGrnItemList = new MatTableDataSource<GrnItemList>();

  dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();

  displayedColumns = [
    'Status',
    'GrnNumber',
    'GRNDate',
    'InvoiceNo',
    'SupplierName',
    'TotalAmount',
    'TotalDiscAmount',
    'TotalVATAmount',
    'NetAmount',
    'RoundingAmt',
    'DebitNote',
    'CreditNote',
    // 'InvDate',
    'Cash_CreditType',
    'ReceivedBy',
    'IsClosed',
    'Action1',
  ];

  displayedColumns1 = [
    "ItemName",
    "BatchNo",
    "BatchExpDate",
    "ConversionFactor",
    "ReceiveQty",
    "FreeQty",
    "MRP",
    "Rate",
    "TotalAmount",
    "VatPercentage",
    "DiscPercentage",
    "LandedRate",
    "NetAmount",
    "TotalQty",
    "stockid",
    "IsVerified",
    "IsVerifiedDatetime",
    "IsVerifiedUserId"
  ];

  displayedColumns3 = [
    'SupplierName',
    'ReceiveQty',
    'FreeQty',
    'MRP',
    'Rate',
    'discpercentage',
    // 'DiscAmount',
    'VatPercentage'
  ]

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  filteredOptions: any;
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

  Filepath: any;
  loadingarry: any = [];
  currentDate = new Date();
  IsLoading: boolean = false;

  constructor(
    public _GRNService: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private accountService: AuthenticationService,

  ) { }

  ngOnInit(): void {

    // this.OnReset();
    this.getToStoreSearchList();
    // this.getSupplierSearchList();
    this.getSupplierSearchCombo();
    // this.getFromStoreSearchList();
    this.getToStoreSearchCombo();
    this.getSupplierSearchCombo();
    this.gePharStoreList();
    this.getGRNList();

  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  onAdd() {
    //debugger
    this.dsItemNameList.data = [];
    // this.chargeslist=this.chargeslist;
    this.chargeslist.push(
      {
        ItemId: this.ItemID,
        ItemName: this._GRNService.userFormGroup.get('ItemName').value.ItemName || '',
        UOM: this.UOM,
        HSNCode: this.HSNCode,
        BatchNo: this.BatchNo,
        ExpDate: this.ExpDate,
        Qty: this.Qty,
        FreeQty: this.FreeQty,
        MRP: this.MRP,
        Rate: this.Rate,
        TotalAmount: this.TotalAmount,
        Disc: this.Disc,
        DisAmount: this.DisAmount,
        GST: this.GST,
        GSTAmount: this.GSTAmount,
        CGST: this.CGST,
        CGSTAmount: this.CGSTAmount,
        SGST: this.SGST,
        SGSTAmount: this.SGSTAmount,
        IGST: this.IGST,
        IGSTAmount: this.IGSTAmount,
        NetAmount: this.NetAmount,

      });

    this.dsItemNameList.data = this.chargeslist
    this._GRNService.userFormGroup.reset();
    this.add = false;
    this.itemname.nativeElement.focus();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';

  }


  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';

  }


  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsItemNameList.data = [];
      this.dsItemNameList.data = this.chargeslist;
    }
    Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  }

  getOptionText(option) {

    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }
  getGRNList() {

    var Param = {

      "ToStoreId": this.accountService.currentUserValue.user.storeId,// this._GRNService.GRNSearchGroup.get('ToStoreId').value.storeid,
      "From_Dt": this.datePipe.transform(this._GRNService.GRNSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._GRNService.GRNSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsVerify": this._GRNService.GRNSearchGroup.get("Status1").value || 0,
      "Supplier_Id": this._GRNService.GRNSearchGroup.get('SupplierId').value.SupplierId || 0,
    }
    //console.log(Param);
    this._GRNService.getGRNList(Param).subscribe(data => {
      this.dsGRNList.data = data as GRNList[];
      this.dsGRNList.sort = this.sort;
      this.dsGRNList.paginator = this.paginator;
      //console.log(this.dsGRNList);
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';

  }

  calculateTotalAmount() {

    if (this.Rate && this.Qty) {
      // this.TotalAmount = Math.round(parseInt(this.Rate) * parseInt(this.Qty)).toString();

      this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(2);
      this.NetAmount = this.TotalAmount;
    }
  }

  calculateDiscAmount() {
    if (this.Disc) {
      this.NetAmount = (parseFloat(this.NetAmount) - parseFloat(this.DisAmount)).toFixed(2);
    }
  }

  calculateDiscperAmount() {

    if (this.Disc) {
      let dis = this._GRNService.userFormGroup.get('Disc').value
      this.DisAmount = (parseFloat(dis) * parseFloat(this.NetAmount) / 100).toFixed(2);
      // this.DiscAmount =  DiscAmt
      this.NetAmount = this.NetAmount - this.DisAmount;

    }
  }

  calculatePersc() {
    if (this.Disc) {
      this.Disc = Math.round(this.TotalAmount * parseInt(this.DisAmount)) / 100;
      this.NetAmount = this.TotalAmount - this.Disc;
      this._GRNService.userFormGroup.get('calculateDiscAmount').disable();
    }
  }

  calculateGSTperAmount() {

    if (this.GST) {

      this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
      this._GRNService.userFormGroup.get('NetAmount').setValue(this.NetAmount);

    }
  }

  calculateGSTAmount() {

    if (this.GSTAmount > 0) {

      this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(2);
      this._GRNService.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    } else if (this.GST == 0) {
      this.GSTAmount = 0;
    }
  }

  calculateCGSTAmount() {
    if (this.CGST) {

      this.CGSTAmount = (parseFloat(this.TotalAmount) * (parseFloat(this.CGST)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.CGSTAmount)).toFixed(2);
      // this._GRNService.userFormGroup.get('NetAmount').setValue(this.NetAmount);

    }

  }

  calculateSGSTAmount() {
    if (this.SGST) {
      this.SGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.SGST)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.SGSTAmount)).toFixed(2);
      // this.calculatePersc();
    }
  }

  calculateIGSTAmount() {
    if (this.IGST) {
      this.IGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.IGST)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.IGSTAmount)).toFixed(2);
      // this.calculatePersc();
    }
  }

  // getGSTAmt(element) {
  //   let GSTAmt;
  //   GSTAmt = element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0) , 0);
  //   return GSTAmt;
  // }

  getCGSTAmt(element) {
    let CGSTAmt;
    CGSTAmt = element.reduce((sum, { CGSTAmount }) => sum += +(CGSTAmount || 0), 0); this.CGSTAmount
    this.CGSTFinalAmount = CGSTAmt;
    return CGSTAmt;
  }

  getSGSTAmt(element) {
    let SGSTAmt;
    SGSTAmt = element.reduce((sum, { SGSTAmount }) => sum += +(SGSTAmount || 0), 0);
    this.SGSTFinalAmount = SGSTAmt;
    return SGSTAmt;
  }

  getIGSTAmt(element) {
    let IGSTAmt;
    IGSTAmt = element.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
    this.IGSTFinalAmount = IGSTAmt;
    return IGSTAmt;
  }

  getTotalAmt(element) {
    let TotalAmt;
    TotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
    this.TotalFinalAmount = TotalAmt;

    let FinalDisAmount
    FinalDisAmount = element.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0);

    this.FinalDisAmount = FinalDisAmount;

    let FinalNetAmount;
    FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.FinalNetAmount = (FinalNetAmount).toFixed(2);
    this.NetPayamount = this.FinalNetAmount;

    return TotalAmt;
  }

  getToStoreSearchCombo() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._GRNService.GRNSearchGroup.get('ToStoreId').setValue(this.StoreList[0]);
      this.StoreName = this._GRNService.GRNSearchGroup.get('ToStoreId').value.StoreName;
    });
  }

  gePharStoreList() {

    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._GRNService.GRNStoreForm.get('StoreId').setValue(this.StoreList[0]);
      this.StoreName = this._GRNService.GRNStoreForm.get('StoreId').value.StoreName;
    });
  }


  getSupplierSearchCombo() {

    this._GRNService.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      // console.log(data);
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._GRNService.GRNSearchGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );

    });
  }



  getGRNItemList() {
    // debugger
    var m_data = {
      "ItemName": `${this._GRNService.userFormGroup.get('ItemName').value}%`,
      "StoreId": this._GRNService.GRNStoreForm.get('StoreId').value.storeid || 0
    }
    if (this._GRNService.userFormGroup.get('ItemName').value.length >= 1) {
      this._GRNService.getItemNameList(m_data).subscribe(data => {
        this.filteredOptions = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }

  getSelectedObj(obj) {
    this.accountService

    this.ItemID = obj.ItemId || obj.ItemID;
    this.ItemName = obj.ItemName;
    this.Qty = obj.BalanceQty;

    if (this.Qty > 0) {
      this.UOM = obj.UOM;
      this.Rate = obj.PurchaseRate;
      this.TotalAmount = (parseInt(obj.BalanceQty) * parseFloat(this.Rate)).toFixed(2);
      this.NetAmount = this.TotalAmount;
      this.VatPercentage = obj.VatPercentage;
      // this.CGSTPer =onj.CGSTPer;
      this.GSTPer = obj.GSTPer;
      this.GSTAmount = 0;
      // this.NetAmount = obj.NetAmount;
      // this.MRP = obj.MRP;
      this.Specification = obj.Specification;
    }
    // this.qty.nativeElement.focus();
  }
  private _filterStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsToStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }

  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsSupplier.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }

  private _filterItemName(value: any): string[] {
    if (value) {
      const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
      return this.optionsItemName.filter(option => option.ItemName.toLowerCase().includes(filterValue));
    }
  }

  getGrnItemDetailList(Params) {
    //debugger
    this.sIsLoading = 'loading-data';
    var Param = {
      "GrnId": Params.GRNID
    }
    this._GRNService.getGrnItemList(Param).subscribe(data => {
      this.dsGrnItemList.data = data as GrnItemList[];
      //console.log(data)
      this.dsGrnItemList.sort = this.sort;
      this.dsGrnItemList.paginator = this.paginator;
      this.sIsLoading = '';
      // console.log(this.dsGrnItemList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onclickrow(contact) {
    Swal.fire("Row selected :" + contact)
  }

  getToStoreSearchList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNService.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      this._GRNService.GRNSearchGroup.get('ToStoreId').setValue(this.ToStoreList[0]);
      this.StoreName = this._GRNService.GRNSearchGroup.get('ToStoreId').value.StoreName;
    });
  }

  getSupplierSearchList1() {
    this._GRNService.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      //console.log(this.SupplierList);
    });
  }


  getItemNameList() {
    var Param = {

      "ItemName": `${this._GRNService.userFormGroup.get('ItemName').value}%`,
      "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    // console.log(Param);
    this._GRNService.getItemNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      // console.log(this.filteredOptions)
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  onClear() {
  }
  focusNextService() {
    // this.renderer.selectRootElement('#myInput').focus();
  }
  OnReset() {
    this._GRNService.GRNSearchGroup.reset();
    this._GRNService.userFormGroup.reset();
    this.dsItemNameList.data = [];
  }

  delete(elm) {
    this.dsItemNameList.data = this.dsItemNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
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
  TotalDiscPer: any = 0;
  TotalCGSTPer: any = 0;
  TotalSGSTPer: any = 0;
  TotalGSTAmt: any = 0;
  TotalCGSTAmt: any = 0;
  TotalSGSTAmt: any = 0;
  TotalNetAmount: any = 0;
  TotalOtherCharge: any = 0;
  finalamt: any = 0;
  openQrCodePrintDialog(row) {
    debugger
    setTimeout(() => {
      this.SpinLoading = true;
      const dialogRef = this._matDialog.open(QrcodegeneratorComponent,
        {
          data: {
            QrCodeData: row.stockid,
            Qty:row.ReceiveQty,
            title: "Grn QR"
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
    }, 100);
  }

  viewgetCurrentstockReportPdf(row) {

    setTimeout(() => {
      this.SpinLoading = true;
      this._GRNService.getGRNreportview(
        row.GRNID
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "GRN REPORT Viewer"
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

  getPrint(el) {
    var m_data = {
      "GRNID": el.GRNID
    }
    //console.log(m_data);
    this._GRNService.getPrintGRNList(m_data).subscribe(data => {
      this.reportPrintObjList = data as GRNList[];
      // const toword =require('num-words')
      // this.finalamt = toword(this.reportPrintObjList[0].NetPayble);
      setTimeout(() => {
        this.print3();
      }, 1000);

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
  LastThreeItemList(contact) {
    // console.log(contact);
    var vdata = {
      'ItemId': contact.ItemId,
    }
    this._GRNService.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
      //console.log(this.dsLastThreeItemList.data)
    });
  }
  getLastThreeItemInfo() {
    var vdata = {
      'ItemId': this._GRNService.userFormGroup.get('ItemName').value.ItemID || 0,
    }
    this._GRNService.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
      //console.log(this.dsLastThreeItemList.data)
    });
  }

  OnSavenew() {
    // debugger
    let grnSaveObj = {};
    grnSaveObj['grnDate'] = this.dateTimeObj.date;
    grnSaveObj['grnTime'] = this.dateTimeObj.time;
    grnSaveObj['storeId'] = this._GRNService.GRNStoreForm.get('StoreId').value.storeid || 0;
    grnSaveObj['supplierID'] = this._GRNService.GRNFirstForm.get('SupplierId').value.SupplierId || 0;
    grnSaveObj['invoiceNo'] = this._GRNService.GRNFirstForm.get('InvoiceNo').value || 0;
    grnSaveObj['deliveryNo'] = 0,//this._GRNService.GRNFirstForm.get('Supplier_Id').value.SupplierId || 0;
      grnSaveObj['gateEntryNo'] = this._GRNService.GRNFirstForm.get('GateEntryNo').value || 0;
    grnSaveObj['cash_CreditType'] = true,
      grnSaveObj['grnType'] = 0;
    grnSaveObj['totalAmount'] = this.TotalFinalAmount;
    grnSaveObj['totalDiscAmount'] = this.FinalDisAmount;
    grnSaveObj['totalVATAmount'] = this.VatAmount;
    grnSaveObj['netAmount'] = this.FinalNetAmount;
    grnSaveObj['remark'] = this._GRNService.GRNFinalForm.get('Remark').value || 0;
    grnSaveObj['receivedBy'] = this._GRNService.GRNFinalForm.get('ReceivedBy').value || 0;
    grnSaveObj['isVerified'] = false;
    grnSaveObj['isClosed'] = false;
    grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id,
      grnSaveObj['invDate'] = this.dateTimeObj.date;
    grnSaveObj['debitNote'] = this._GRNService.GRNFinalForm.get('DebitAmount').value || '';
    grnSaveObj['creditNote'] = this._GRNService.GRNFinalForm.get('CreditAmount').value || '';
    grnSaveObj['otherCharge'] = this._GRNService.GRNFinalForm.get('OtherCharges').value || 0;
    grnSaveObj['roundingAmt'] = this._GRNService.GRNFinalForm.get('RoundingAmt').value || 0;
    grnSaveObj['totCGSTAmt'] = this.CGSTFinalAmount;
    grnSaveObj['totSGSTAmt'] = this.SGSTFinalAmount;
    grnSaveObj['totIGSTAmt'] = this.IGSTFinalAmount;
    grnSaveObj['tranProcessId'] = 0;
    grnSaveObj['tranProcessMode'] = "";
    grnSaveObj['billDiscAmt'] = this.FinalDisAmount;
    grnSaveObj['grnid'] = 0;

    let SavegrnDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {

      //console.log(element);

      let grnDetailSaveObj = {};
      //  grnDetailSaveObj['grnDetID'] = 0;
      grnDetailSaveObj['grnId'] = 0;
      grnDetailSaveObj['itemId'] = element.ItemID;
      grnDetailSaveObj['uomId'] = element.UOMId;
      grnDetailSaveObj['receiveQty'] = element.Qty;
      grnDetailSaveObj['freeQty'] = element.FreeQty;
      grnDetailSaveObj['mrp'] = element.MRP;
      grnDetailSaveObj['rate'] = element.Rate;
      grnDetailSaveObj['totalAmount'] = element.TotalAmount;
      grnDetailSaveObj['conversionFactor'] = 0;//element.vatAmount;
      grnDetailSaveObj['vatPercentage'] = element.VatPer || 0;
      grnDetailSaveObj['vatAmount'] = element.VatAmt || 0;
      grnDetailSaveObj['discPercentage'] = element.Disc || 0;
      grnDetailSaveObj['discAmount'] = element.DisAmount || 0;
      grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
      grnDetailSaveObj['landedRate'] = 0;//this.CgstAmt;
      grnDetailSaveObj['netAmount'] = element.NetAmount;
      grnDetailSaveObj['grossAmount'] = element.NetAmount;
      grnDetailSaveObj['totalQty'] = element.Qty;
      grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
      grnDetailSaveObj['batchNo'] = element.BatchNo;
      grnDetailSaveObj['batchExpDate'] = this.dateTimeObj.date;
      grnDetailSaveObj['purUnitRate'] = 0; //this.SgstPer;
      grnDetailSaveObj['purUnitRateWF'] = 0; //this.SgstPer;
      grnDetailSaveObj['cgstPer'] = element.CGST || 0;
      grnDetailSaveObj['cgstAmt'] = element.CGSTAmount || 0;
      grnDetailSaveObj['sgstPer'] = element.SGST || 0;
      grnDetailSaveObj['sgstAmt'] = element.SGSTAmount || 0;
      grnDetailSaveObj['igstPer'] = element.IGST || 0;
      grnDetailSaveObj['igstAmt'] = element.IGSTAmount || 0;
      grnDetailSaveObj['mrP_Strip'] = element.MRP_Strip || 0;
      grnDetailSaveObj['isVerified'] = 0,//element.SGSTAmount;
        grnDetailSaveObj['igstPer'] = element.IGST || 0;
      grnDetailSaveObj['isVerifiedDatetime'] = this.dateTimeObj.time;
      grnDetailSaveObj['isVerifiedUserId'] = 1;//this.SgstAmt;

      SavegrnDetailObj.push(grnDetailSaveObj);

    });

    let updateItemMasterGSTPerObjarray = [];
    this.dsItemNameList.data.forEach((element) => {

      //console.log(element);

      let updateItemMasterGSTPerObj = {};
      // updateItemMasterGSTPerObj['grnDetID'] = 0;
      // updateItemMasterGSTPerObj['grnId'] = 0;
      updateItemMasterGSTPerObj['itemId'] = element.ItemID;
      updateItemMasterGSTPerObj['cgst'] = element.CGST || 0;
      updateItemMasterGSTPerObj['sgst'] = element.SGST || 0;
      updateItemMasterGSTPerObj['igst'] = element.IGST || 0;
      updateItemMasterGSTPerObj['hsNcode'] = element.HSNCode;
      updateItemMasterGSTPerObjarray.push(updateItemMasterGSTPerObj);
    });

    let submitData = {
      "grnSave": grnSaveObj,
      "grnDetailSave": SavegrnDetailObj,
      "updateItemMasterGSTPer": updateItemMasterGSTPerObjarray
    };

    //console.log(submitData);

    this._GRNService.GRNSave(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Save GRN !', 'Record Generated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
            this.OnReset();
          }
        });
      } else {
        Swal.fire('Error !', 'GRN not saved', 'error');
      }
      // this.isLoading = '';
    });

  }



  // @ViewChild('SupplierId') SupplierId: MatSelect;





  @ViewChild('InvoiceNo') InvoiceNo: ElementRef;
  @ViewChild('DateOfInvoice') DateOfInvoice: ElementRef;
  @ViewChild('GateEntryNo') GateEntryNo: ElementRef;
  @ViewChild('Status2') Status2: ElementRef;

  @ViewChild('itemname') itemname: ElementRef;
  @ViewChild('Uom') Uom: ElementRef;
  @ViewChild('hsncode') hsncode: ElementRef;
  @ViewChild('batchno') batchno: ElementRef;
  @ViewChild('expdate') expdate: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('freeqty') freeqty: ElementRef;
  @ViewChild('mrp') mrp: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('disc') disc: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('cgst') cgst: ElementRef;
  @ViewChild('sgst') sgst: ElementRef;
  @ViewChild('igst') igst: ElementRef;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  add: boolean = false;
  @ViewChild('Remark') Remark: ElementRef;
  @ViewChild('ReceivedBy') ReceivedBy: ElementRef;
  @ViewChild('DebitAmount') DebitAmount: ElementRef;
  @ViewChild('CreditAmount') CreditAmount: ElementRef;
  @ViewChild('DiscAmount') DiscAmount: ElementRef;
  @ViewChild('NetPayamt') NetPayamt: ElementRef;
  @ViewChild('OtherCharges') OtherCharges: ElementRef;
  @ViewChild('RoundingAmt') RoundingAmt: ElementRef;



  // public onEnterItemName(event): void {
  //   if (event.which === 13) {
  //     this.hsncode.nativeElement.focus();
  //   }
  // }



  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.Uom.nativeElement.focus();
    }
  }


  public onEnterUOM(event): void {
    if (event.which === 13) {
      this.hsncode.nativeElement.focus();
    }
  }
  public onEnterHSNCode(event): void {
    if (event.which === 13) {
      this.batchno.nativeElement.focus();
    }
  }

  public onEnterBatchNo(event): void {
    if (event.which === 13) {
      this.expdate.nativeElement.focus();
    }
  }

  public onEnterExpDate(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }

  public onEnterQty(event): void {
    if (event.which === 13) {
      this.freeqty.nativeElement.focus();
    }
  }

  public onEnterFreeQty(event): void {
    if (event.which === 13) {
      this.mrp.nativeElement.focus();
    }
  }

  public onEnterMRP(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
    }
  }

  public onEnterRate(event): void {
    if (event.which === 13) {
      this.disc.nativeElement.focus();
    }
  }

  public onEnterDisc(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
    }
  }

  public onEnterGST(event): void {
    if (event.which === 13) {
      this.cgst.nativeElement.focus();
    }
  }

  public onEnterCGST(event): void {
    if (event.which === 13) {
      this.sgst.nativeElement.focus();
    }
  }

  public onEnterSGST(event): void {
    if (event.which === 13) {
      this.igst.nativeElement.focus();
    }
  }

  public onEnterIGST(event): void {
    if (event.which === 13) {
      // this.itemname.nativeElement.focus();
      this.add = true;
      this.addbutton.focus();
    }
  }



  public onEnterSupplier(event): void {
    if (event.which === 13) {
      this.InvoiceNo.nativeElement.focus()
    }
  }

  public onEnterInvoiceNo(event): void {
    if (event.which === 13) {
      this.DateOfInvoice.nativeElement.focus()
    }
  }

  public onEnterDateOfInvoice(event): void {
    if (event.which === 13) {

      this.GateEntryNo.nativeElement.focus()
    }
  }
  public onEnterGateEntryNo(event): void {
    if (event.which === 13) {
      this.itemname.nativeElement.focus()

    }
  }


  public onEnterRemark(event): void {
    if (event.which === 13) {
      this.ReceivedBy.nativeElement.focus();
    }
  }

  public onEnterReceivedBy(event): void {
    if (event.which === 13) {
      this.DebitAmount.nativeElement.focus();
    }
  }

  public onEnterDebitAmount(event): void {
    if (event.which === 13) {
      this.CreditAmount.nativeElement.focus();
    }
  }

  public onEnterCreditAmount(event): void {
    if (event.which === 13) {
      this.DiscAmount.nativeElement.focus();
    }
  }


  public onEnterDiscAmount(event): void {
    if (event.which === 13) {
      this.NetPayamt.nativeElement.focus();
    }
  }


  public onEnterNetPayamt(event): void {
    if (event.which === 13) {
      this.OtherCharges.nativeElement.focus();
    }
  }

  public onEnterOtherCharges(event): void {
    if (event.which === 13) {
      this.RoundingAmt.nativeElement.focus();
    }
  }

  newGRNEntry() {
    this.chkNewGRN = 1;
    const dialogRef = this._matDialog.open(UpdateGRNComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          chkNewGRN: this.chkNewGRN
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getGRNList();
    });
    this.getGRNList();
  }
  GRNEmail(contact) {
    console.log(contact)
    const dialogRef = this._matDialog.open(EmailComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
    this.getGRNList();
  }

  onEdit(contact) {
    this.chkNewGRN = 2;
    console.log(contact);
    const dialogRef = this._matDialog.open(UpdateGRNComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: contact,
          chkNewGRN: this.chkNewGRN
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getGRNList();
    });
  }


  onChangeStatus3(event) {

    if (event.value.name == 'GST Before Disc') {

      if (parseFloat(this.GST) > 0) {

        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST After Disc') {


      let disc = this._GRNService.userFormGroup.get('Disc').value
      if (disc > 0) {
        this.DisAmount = (disc * parseFloat(this.TotalAmount) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DisAmount)).toFixed(4);
        if (parseFloat(this.GST) > 0) {
          this.GSTAmount = ((parseFloat(this.NetAmount) * parseFloat(this.GST)) / 100).toFixed(4);
          this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(4);
        }
      }
      else {
        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST On Pur +FreeQty') {
      if (parseFloat(this.GST) > 0) {

        let TotalQty = parseInt(this.Qty) + parseInt(this.FreeQty)
        this.TotalAmount = (parseFloat(this.Rate) * TotalQty).toFixed(2);
        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST OnMRP') {
      this.TotalAmount = (parseFloat(this.MRP) * this.Qty).toFixed(2);
      this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);

    }
    else if (event.value.name == 'GST After 2Disc') {
    }
  }

  msg: any;
  onVerify(row) {
    var Param = {
      "updateGRNVerifyStatus": {
        "grnid": row.GRNID,
        "isVerified": true,
      }
    }
    //console.log(Param)
    this._GRNService.getVerifyGRN(Param).subscribe(data => {
      this.msg = data;
      //console.log(this.msg);
      // if(data){
      //   this.toastr.success('Record Verified Successfully.', 'Verified !', {
      //     toastClass: 'tostr-tost custom-toast-success',
      //   }); 
      // }
    }, success => {
      this.toastr.success('Record Verified Successfully.', 'Verified !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }); this.getGRNList();
  }




  getWhatsappshareSales(el) {
    debugger
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": 22,//el.RegNo,
        "smsString": "Dear" + el.PatientName + ",Your GRN has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
        "isSent": 0,
        "smsType": 'GRN',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el.GRNID,
        "PatientType": 2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": this.Filepath || '',
        "smsOutGoingID": 0

      }
    }
    console.log(m_data);
    this._GRNService.InsertWhatsappGRN(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Congratulations !', 'WhatsApp Sms  Data  save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();

          }
        });
      } else {
        Swal.fire('Error !', 'Whatsapp Sms Data  not saved', 'error');
      }

    });
    this.IsLoading = false;
    el.button.disable = false;
  }
  deleteRow(row) {
    // debugger
    // const index = this.dsGRNList.data.indexOf(row);
    // if (index >= 0) {
    //   this.dsGRNList.data.splice(index, 1);
    //   // this.grntablelist.data = [];
    //   // this.grntablelist = this.dsItemNameList.data;
    // }
    // this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
    //   toastClass: 'tostr-tost custom-toast-success',
    // });
    // this.getGRNList();
  }
}

export class GRNList {
  GrnNumber: number;
  GRNDate: number;
  GRNTime: any;
  InvoiceNo: number;
  SupplierName: string;
  TotalAmount: any;
  TotalDiscAmount: any;
  TotalVATAmount: any;
  NetAmount: any;
  RoundingAmt: number;
  DebitNote: number;
  CreditNote: number;
  InvDate: number;
  Cash_CreditType: string;
  ReceivedBy: any;
  IsClosed: any;
  GSTNo: any;
  Remark: any;
  Mobile: any;
  Address: any;
  Email: any;
  Phone: any;
  PONo: any;
  EwayBillNo: any;
  EwayBillDate: Date;
  OtherCharge: any;
  Rate: any;
  CGSTPer: any;
  SGSTPer: any;
  CGSTAmt: any;
  SGSTAmt: any;
  NetPayble: any
  AddedByName: any;
  GrandTotalAount: any;
  TotCGSTAmt: any;
  TotSGSTAmt: any;

  /**
   * Constructor
   *
   * @param GRNList
   */
  constructor(GRNList) {
    {
      this.GrnNumber = GRNList.GrnNumber || 0;
      this.GRNDate = GRNList.GRNDate || 0;
      this.GRNTime = GRNList.GRNTime || '';
      this.InvoiceNo = GRNList.InvoiceNo || 0;
      this.SupplierName = GRNList.SupplierName || "";
      this.TotalAmount = GRNList.TotalAmount || 0;
      this.TotalDiscAmount = GRNList.TotalDiscAmount || 0;
      this.TotalVATAmount = GRNList.TotalVATAmount || 0;
      this.NetPayble = GRNList.NetPayble || 0;
      this.NetAmount = GRNList.NetAmount || 0;
      this.RoundingAmt = GRNList.RoundingAmt || 0;
      this.DebitNote = GRNList.DebitNote || 0;
      this.CreditNote = GRNList.CreditNote || 0;
      this.InvDate = GRNList.InvDate || 0;
      this.Cash_CreditType = GRNList.Cash_CreditType || "";
      this.ReceivedBy = GRNList.ReceivedBy || 0;
      this.IsClosed = GRNList.IsClosed || 0;
      this.GSTNo = GRNList.GSTNo || 0;
      this.Remark = GRNList.Remark || "";
      this.TotSGSTAmt = GRNList.TotSGSTAmt || 0;
      this.TotCGSTAmt = GRNList.TotCGSTAmt || 0;
    }
  }
}

export class GrnItemList {

  ItemID: any;
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
  ItemId: any;
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
  VatPercentage: number;
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
  Cash_CreditType: any;
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
    }
  }
}
export class LastThreeItemList {
  ItemID: any;
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

  constructor(LastThreeItemList) {
    {

      this.ItemID = LastThreeItemList.ItemID || 0;
      this.ItemName = LastThreeItemList.ItemName || "";
      this.BatchNo = LastThreeItemList.BatchNo || 0;
      this.BatchExpDate = LastThreeItemList.BatchExpDate || 0;
      this.ReceiveQty = LastThreeItemList.ReceiveQty || 0;
      this.FreeQty = LastThreeItemList.FreeQty || 0;
      this.MRP = LastThreeItemList.MRP || 0;

    }
  }
}
