import { Component, OnInit, ViewChild, Renderer2, ViewEncapsulation, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PurchaseOrderService } from './purchase-order.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { IndentList } from 'app/main/pharmacy/sales/sales.component';
import { MatSelect } from '@angular/material/select';
import { UpdatePurchaseorderComponent } from './update-purchaseorder/update-purchaseorder.component';
import { SearchInforObj } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ToastrService } from 'ngx-toastr'; 
import { EmailComponent } from './email/email.component';



@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class PurchaseOrderComponent implements OnInit {
  // [x: string]: any;

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  StoreList: any = [];
  Store1List: any = [];
  StoreName: any;
  FromStoreList: any;
  SupplierList: any;
  screenFromString = 'admission-form';
  ItemID: any = 0;
  labelPosition: 'before' | 'after' = 'after';
  isSupplierSelected: boolean = false;
  isPaymentSelected: boolean = false;
  isItemNameSelected: boolean = false;
  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  chargeslist: any = [];
  optionsMarital: any[] = [];
  optionsPayment: any[] = [];
  optionsItemName: any[] = [];

  GSTAmt: any = 0.0;
  CGSTAmount: any;
  IGSTAmount: any;
  SGSTAmount: any = 0.0;
  grandTotalAmount: any = 0.0;
  isItemIdSelected: boolean = false;
  VatPercentage: any = 0.0;
  state = false;
  optionsInc = null;


  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any = 1;
  IssQty: any;
  Bal: any;

  GSTPer: any;
  MRP: any;
  DiscPer: any = 0;
  DiscAmt: any = 0;
  FinalDiscPer: any = 0;
  FinalDiscAmt: any = 0;
  NetAmt: any = 0;
  TotalMRP: any = 0;
  FinalTotalAmt: any;
  FinalNetAmount: any = 0;
  FinalGSTAmt: any = 0;

  VatPer: any;
  CgstPer: any;
  SgstPer: any;
  IgstPer: any;

  VatAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;

  PaymentTerm: any;
  ItemObj: IndentList;
  chkNewGRN: any;

  TotalQty: any = 0;


  dsPurchaseOrder = new MatTableDataSource<PurchaseOrder>();

  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  // dsItemNameList = new MatTableDataSource<ItemNameList>();

  displayedColumns = [
    'Status',
    'PurchaseNo',
    'PurchaseDate',
    'PurchaseTime',
    'StoreName',
    'SupplierName',
    'TotalAmount',
    'action',
  ];

  displayedColumns1 = [
    'PurchaseId',
    'ItemName',
    'Qty',
    'Rate',
    'DiscPer',
    'DiscAmount',
    'VatPer',
    'VatAmount',
    'TotalAmount',
    'MRP',
    'GrandTotalAmount',
  ];
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ItemName: any;
  UOM: any;
  BalanceQty: any;
  Rate: any;
  TotalAmount: any;
  Dis: any = 0;
  GST: any = 0;
  NetAmount: any;
  Specification: string;
  renderer: any;
  disableTextbox: boolean;
  DiscAmount: any = 0;
  GSTAmount: any = 0;

  selectedRowIndex: any;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsPayment: Observable<string[]>;
  @ViewChild('PurchaseOrderTemplate') PurchaseOrderTemplate: ElementRef;
  reportPrintObjList: PurchaseOrder[] = [];
  printTemplate: any;
  reportPrintObj: PurchaseOrder;
  reportPrintObjTax: PurchaseOrder;
  subscriptionArr: Subscription[] = [];

  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,

  ) { }

  ngOnInit(): void {

    this.getFromStoreSearch();
    this.getSupplierSearchCombo();
  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getPurchaseOrderList() {

    var Param = {
      "ToStoreId": this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').value.storeid || 0,
      "From_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2022-10-01 00:00:00.000',
      "To_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '2022-10-01 00:00:00.000',
      "IsVerify": this._PurchaseOrder.PurchaseSearchGroup.get("Status").value,
      "Supplier_Id": this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').value.SupplierId || 0,
    }
    // console.log(Param);
    this._PurchaseOrder.getPurchaseOrder(Param).subscribe(data => {
      this.dsPurchaseOrder.data = data as PurchaseOrder[];
      //console.log(this.dsPurchaseOrder);
      this.dsPurchaseOrder.sort = this.sort;
      this.dsPurchaseOrder.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getPurchaseItemList(Params) {

    var Param = {
      "PurchaseId": Params.PurchaseID
    }
    this._PurchaseOrder.getPurchaseItemList(Param).subscribe(data => {
      this.dsPurchaseItemList.data = data as PurchaseItemList[];
      this.dsPurchaseItemList.sort = this.sort;
      this.dsPurchaseItemList.paginator = this.paginator;
      this.sIsLoading = '';
     // console.log(this.dsPurchaseItemList);
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onVerify(row) {
    let update_POVerify_Status = {};
    update_POVerify_Status['purchaseID'] = row.PurchaseID;
    update_POVerify_Status['isVerified'] = true;
    update_POVerify_Status['isVerifiedId'] = 1;

    let submitData = {
      "update_POVerify_Status": update_POVerify_Status,
    };
   // console.log(submitData);
    this._PurchaseOrder.getVerifyPurchaseOrdert(submitData).subscribe(response => {
    //   if (response) {
    //     this.toastr.success('Record Verified Successfully.', 'Verified !', {
    //       toastClass: 'tostr-tost custom-toast-success',
    //     });

    //   } else {
    //     this.toastr.error('Record Not Verified !, Please check error..', 'Error !', {
    //       toastClass: 'tostr-tost custom-toast-error',
    //     });
    //   }
    //   // this.isLoading = '';
    },
    success => {
      this.toastr.success('Record Verified Successfully.', 'Verified !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.getPurchaseOrderList();
    });
  }

 
  disableSelect = new FormControl(false);
 
  highlight(contact) {
    this.selectedRowIndex = contact.ItemID;
  }

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }

  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';
  }

  getSupplierSearchCombo() {
    this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      // console.log(data);
      this.optionsMarital = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );

    });
  }


  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsMarital.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }

  private _filterPayment(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.optionsPayment.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }

  private _filterItemName(value: any): string[] {
    if (value) {
      const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
      return this.optionsItemName.filter(option => option.ItemName.toLowerCase().includes(filterValue));
    }
  }

  getFromStoreSearch() {

    var data = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._PurchaseOrder.getFromStoreSearchList(data).subscribe(data => {
      this.FromStoreList = data;
      // console.log(data)
      this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }
  // gePharStoreList() {
  //   var vdata = {
  //     Id: this.accountService.currentUserValue.user.storeId
  //   }
  //   this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
  //     this.StoreList = data;
  //     this._PurchaseOrder.PurchaseStoreform.get('StoreId').setValue(this.StoreList[0]);
  //     this.StoreName = this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').value;
  //   });
  // }
 
 

  newPurchaseorder() {
    this.chkNewGRN = 1;
    const dialogRef = this._matDialog.open(UpdatePurchaseorderComponent,
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
    });
    this.getPurchaseOrderList();
  }
  POEmail() {
    this.chkNewGRN = 1;
    const dialogRef = this._matDialog.open(EmailComponent,
      {
        maxWidth: "100%",
        height: '55%',
        width: '55%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
    this.getPurchaseOrderList();
  }

  onEdit(contact) {
    this.chkNewGRN = 2;
    console.log(contact)
    this.advanceDataStored.storage = new SearchInforObj(contact);
    // this._PurchaseOrder.populateForm();
    const dialogRef = this._matDialog.open(UpdatePurchaseorderComponent,
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
    });
    this.getPurchaseOrderList();
  }



  TotalAmt: any = 0;
  TotalUnit: any = 0;
  TotalRate: any = 0;
  TotalNetAmt: any = 0;
  TOtalDiscPer: any = 0;
  TotalGSTAmt: any = 0;

  getPrint(el) {

    var m_data = {
      "PurchaseID": el.PurchaseID
    }
    //console.log(m_data);
    this._PurchaseOrder.getPrintPurchaseOrdert(m_data).subscribe(data => {
      this.reportPrintObjList = data as PurchaseOrder[];
      // debugger
      for (let i = 0; i < 10; i++) {
        this.reportPrintObj = data[0] as PurchaseOrder;
        this.TotalAmt += data[i].ItemTotalAmount
        this.TotalQty += data[i].Qty
        this.TotalRate += data[i].Rate
        this.TOtalDiscPer += data[i].DiscAmount
        this.TotalGSTAmt += data[i].VatAmount
        this.TotalNetAmt += data[i].GrandTotalAmount

        // console.log(this.TotalAmt);
        // console.log(this.reportPrintObjList[i]["Qty"]);
        //   this.TotalQty=this.TotalQty + parseInt(this.reportPrintObj[i]["Qty"]);
        //   console.log(this.TotalQty)

        // console.log(this.reportPrintObjList);

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
    popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.PurchaseOrderTemplate.nativeElement.innerHTML}</body>
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


  onClose() { }
  onClear() { }
}

export class ItemNameList {
  Action: string;
  ItemID: any;
  ItemId:any;
  ItemName: string;
  Qty: number;
  UOM: number;
  Rate: number;
  TotalAmount: number;
  Dis: number;
  DiscAmount: number;
  GST: number;
  GSTAmount: number;
  CGSTPer: any;
  CGSTAmt: any;
  SGSTPer: any;
  SGSTAmt: any;
  IGSTPer: any;
  IGSTAmt: any;
  // CGSTPer:any;
  NetAmount: number;
  MRP: number;
  Specification: string;
  position: number;
  DiscPer: any;
  vatAmount: any;
  vatPer: any;
  UOMID: any;
  PurchaseID: any;
  SupplierID: any;
  PaymentTermId: any;
  FreightAmount: any;
  DeliveryDate: any;
  ModeOfPayment: any;
  TaxNatureId: any;
  Status3Id: any;
  Warranty: any;
  Remark: any;
  Schedule: any;
  OctriAmount: any;
  WorkId: any;
  Remarks: any;
  Worrenty: any;
  WODiscAmount: any;
  WOTotalAmount: any;
  WoNetAmount: any;
  WOVatAmount: any;
  GrandTotalAmount: any;
  taxID: number;
  TransportChanges: any;
  HandlingCharges: any;
  ConstantId: number;
  roundVal: any;
  DisAmount:any;
  Mobile:any
  taxAmount:any;
  GSTAmt:any;
  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
      this.Action = ItemNameList.Action || "";
      this.ItemID = ItemNameList.ItemID || 0;
      this.ItemId=ItemNameList.ItemId || 0;
      this.ItemName = ItemNameList.ItemName || "";
      this.Qty = ItemNameList.Quantity || 0;
      this.UOM = ItemNameList.UOM || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.Dis = ItemNameList.Dis || 0;
      this.DiscAmount = ItemNameList.DiscAmount || 0;
      this.GST = ItemNameList.GST || 0;
      this.GSTAmount = ItemNameList.GSTAmount || 0;
      this.CGSTPer = ItemNameList.CGSTPer || 0;
      this.CGSTAmt = ItemNameList.CGSTAmt || 0;
      this.SGSTPer = ItemNameList.SGSTPer || 0;
      this.SGSTAmt = ItemNameList.SGSTAmt || 0;
      this.IGSTPer = ItemNameList.IGSTPer || 0;
      this.IGSTAmt = ItemNameList.IGSTAmt || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
      this.MRP = ItemNameList.MRP || 0;
      this.Specification = ItemNameList.Specification || "";
      this.PurchaseID = ItemNameList.PurchaseID || "";
      this.SupplierID = ItemNameList.SupplierID || 0;
      this.FreightAmount = ItemNameList.FreightAmount || 0;
      this.PaymentTermId = ItemNameList.PaymentTermId || 0;
      this.DeliveryDate = ItemNameList.DeliveryDate || '';
      this.ModeOfPayment = ItemNameList.ModeOfPayment || '';
      this.TaxNatureId = ItemNameList.TaxNatureId || 0;
      this.Status3Id = ItemNameList.Status3Id || 0;
      this.Worrenty = ItemNameList.Worrenty || '';
      this.Remark = ItemNameList.Remark || '';
      this.Schedule = ItemNameList.Schedule || '';
      this.roundVal = ItemNameList.roundVal || 0;
      this.WorkId = ItemNameList.WorkId || 0;
      this.WODiscAmount = ItemNameList.WODiscAmount || 0;
      this.WOTotalAmount = ItemNameList.WOTotalAmount || 0;
      this.WoNetAmount = ItemNameList.WoNetAmount || 0;
      this.WOVatAmount = ItemNameList.WOVatAmount || 0;
      this.OctriAmount = ItemNameList.OctriAmount || 0;
      this.HandlingCharges = ItemNameList.HandlingCharges || 0;
      this.TransportChanges = ItemNameList.TransportChanges || 0;
      this.DisAmount = ItemNameList.DisAmount || 0;
      this.taxAmount = ItemNameList.taxAmount || 0;
    }
  }
}

export class PurchaseItemList {
  ItemID: any;
  ItemName: string;
  Qty: number;
  Rate: number;
  StoreId: any;
  SupplierId: any;
  StoreName: any;
  Remarks:any;
  Mobile:any;
  /**
   * Constructor
   *
   * @param PurchaseItemList
   */
  constructor(PurchaseItemList) {
    {
      this.ItemID = PurchaseItemList.ItemID || "";
      this.ItemName = PurchaseItemList.ItemName || "";
      this.Qty = PurchaseItemList.Qty || 0;
      this.Rate = PurchaseItemList.Rate || 0;
      this.StoreId = PurchaseItemList.StoreId || 0;
      this.SupplierId = PurchaseItemList.SupplierId || 0;
      this.StoreName = PurchaseItemList.StoreName || '';
      this.Remarks = PurchaseItemList.Remarks || '';
      this.Mobile = PurchaseItemList.Mobile || 0;
    }
  }
}
export class PurchaseOrder {
  PurchaseNo: string;
  PurchaseDate: number;
  PurchaseTime: number;
  StoreName: number;
  SupplierName: string;
  TotalAmount: number;
  PurchaseId: any;
  FromStoreId: boolean;
  ItemTotalAmount: any;
  ItemDiscAmount: any;
  DiscPer: any;
  Address: any;
  Phone: any;
  Fax: any;
  Email: any;
  GSTNo: any;
  ItemName: any;
  UnitofMeasurementName: any;
  Qty: any;
  Rate: any;
  CGSTPer: any;
  SGSTPer: any;
  IGSTPer: any;
  GrandTotalAmount: number;
  VatAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;
  VatPer: any;
  Remarks:any;
  Mobile:any;
  PaymentTermId:any;
  ModeOfPayment: any;



  constructor(PurchaseOrder) {
    {
      this.PurchaseNo = PurchaseOrder.PurchaseNo || 0;
      this.PurchaseDate = PurchaseOrder.PurchaseDate || 0;
      this.PurchaseTime = PurchaseOrder.PurchaseTime || "";
      this.StoreName = PurchaseOrder.StoreName || "";
      this.SupplierName = PurchaseOrder.SupplierName || 0;
      this.TotalAmount = PurchaseOrder.TotalAmount || "";
      this.PurchaseId = PurchaseOrder.PurchaseId || "";
      this.FromStoreId = PurchaseOrder.FromStoreId || "";
      this.ItemTotalAmount = PurchaseOrder.ItemTotalAmount || "";
      this.Remarks = PurchaseOrder.Remarks || '';
      this.Mobile = PurchaseOrder.Mobile || 0;
    }
  }
}

function elseif(GST: any) {
  throw new Error('Function not implemented.');
}

