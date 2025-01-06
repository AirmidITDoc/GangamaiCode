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
import { UntypedFormBuilder, UntypedFormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { IndentList } from 'app/main/pharmacy/sales/sales.component';
import { MatSelect } from '@angular/material/select';
import { UpdatePurchaseorderComponent } from './update-purchaseorder/update-purchaseorder.component';
import { SearchInforObj } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ToastrService } from 'ngx-toastr'; 
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';



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
  SpinLoading:boolean=false;

  Filepath: any;
  loadingarry: any = [];
  currentDate = new Date();
  IsLoading: boolean = false;

  dsPurchaseOrder = new MatTableDataSource<PurchaseOrder>();

  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  // dsItemNameList = new MatTableDataSource<ItemNameList>();

  displayedColumns = [
    'Status',
    'PurchaseNo',
    'PurchaseDate',
    'SupplierName',
    'TotalAmount',
    'DiscAmount',
    'GrandTotal',
    'Remarks',
    'AddedByName',
    'action',
  ];

  displayedColumns1 = [
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
  dateTimeObj: any;


  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _formBuilder: UntypedFormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,

  ) { }

  ngOnInit(): void {
    this.getFromStoreSearch();
    this.getPurchaseOrderList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  resultsLength = 0;

  getPurchaseOrderList() {
    var Param = {
      "ToStoreId": this.accountService.currentUserValue.storeId, //this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').value.storeid || 0,
      "From_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000"), 
      "To_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") ,
      "IsVerify": this._PurchaseOrder.PurchaseSearchGroup.get("Status").value || 0,
      "Supplier_Id": this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').value.SupplierId || 0,
      Start:(this.paginator?.pageIndex??1),
      Length:(this.paginator?.pageSize??12),
      // Sort:this.sort?.active??'VisitId',
      // Order:this.sort?.direction??'asc'
    }
    console.log(Param);
    this._PurchaseOrder.getPurchaseOrder(Param).subscribe(data => {
      this.dsPurchaseOrder.data = data["Table1"]??[] as PurchaseOrder[];
      this.dsPurchaseOrder.sort = this.sort;
      this.resultsLength= data["Table"][0]["total_row"];
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

 
  disableSelect = new UntypedFormControl(false);
 
  highlight(contact) {
    this.selectedRowIndex = contact.ItemID;
  }

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }
  getFromStoreSearch() {

    var data = {
      Id: this.accountService.currentUserValue.storeId
    }
    this._PurchaseOrder.getFromStoreSearchList(data).subscribe(data => {
      this.FromStoreList = data;
      // console.log(data)
      this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }
  filteredOptionssupplier:any;
  noOptionFoundsupplier:any;
  vSupplierId:any;
  getSupplierSearchCombo() {
    var m_data = {
      'SupplierName': `${this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').value}%`
    }
    //console.log(m_data)
    this._PurchaseOrder.getSupplierSearchList(m_data).subscribe(data => {
      this.filteredOptionssupplier = data;
    //  console.log(this.filteredOptionssupplier)
      if (this.filteredOptionssupplier.length == 0) {
        this.noOptionFoundsupplier = true;
      } else {
        this.noOptionFoundsupplier = false;
      }
    });
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
 
 

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
      this.getPurchaseOrderList();
    });
    this.getPurchaseOrderList();
  }

  
  POEmail(contact) {
    console.log(contact)
    const dialogRef = this._matDialog.open(EmailSendComponent,
      {
        maxWidth: "100%",
        height: '75%',
        width: '55%',
        data: {
          Obj:contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
    this.getPurchaseOrderList();
  }

  onEdit(contact) {
    if(this._PurchaseOrder.PurchaseSearchGroup.get('Status').value == 0 ){
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
        this.getPurchaseOrderList();
      });
    }
    else{
      this.toastr.warning('Verified Record connot be edited', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
   
   
  }



  TotalAmt: any = 0;
  TotalUnit: any = 0;
  TotalRate: any = 0;
  TotalNetAmt: any = 0;
  TOtalDiscPer: any = 0;
  TotalGSTAmt: any = 0;
  finalamt:any;

  
  viewgetPurchaseorderReportPdf(row) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      
   this._PurchaseOrder.getPurchaseorderreportview(
    row.PurchaseID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "PURCHASE ORDER Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
       
    });
   
    },100);
  }

 
  
  getWhatsappshareSales(el) {
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": 11,//el.RegNo,
        "smsString": "Dear" + el.PatientName + ",Your Sales Bill has been successfully completed. UHID is " + el.SalesNo + " For, more deatils, call 08352249399. Thank You, JSS Super Speciality Hospitals, Near S-Hyper Mart, Vijayapur " || '',
        "isSent": 0,
        "smsType": 'Purchase',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el.PurchaseID,
        "PatientType":2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": this.Filepath || '',
        "smsOutGoingID": 0

      }
    }
    console.log(m_data);
    this._PurchaseOrder.InsertWhatsappPurchaseorder(m_data).subscribe(response => {
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
    el.button.disbled = false;
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
  Rate: any;
  TotalAmount: any;
  Dis: any;
  DiscAmount: any;
  GST: number;
  GSTAmount: any;
  CGSTPer: any;
  CGSTAmt: any;
  SGSTPer: any;
  SGSTAmt: any;
  IGSTPer: any;
  IGSTAmt: any;
  // CGSTPer:any;
  NetAmount: any;
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
  VatAmount:any;
  VatPer:any;
  DefRate:any;
  SupplierName:any;
  PurchaseDate:any;
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
      this.DefRate = ItemNameList.DefRate || 0;
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
  DiscAmount:any;
  TaxAmount:any;
  GrandTotal:any;
  AddedByName:any;
  VerifiedName:any;
  TransportChanges:any
  HandlingCharges:any;
  FreightAmount:any;
  OctriAmount:any;
  constructor(PurchaseOrder) {
    {
      this.PurchaseNo = PurchaseOrder.PurchaseNo || 0;
      this.GrandTotal = PurchaseOrder.GrandTotal || 0;
      this.PurchaseDate = PurchaseOrder.PurchaseDate || 0;
      this.PurchaseTime = PurchaseOrder.PurchaseTime || "";
      this.StoreName = PurchaseOrder.StoreName || "";
      this.SupplierName = PurchaseOrder.SupplierName || 0;
      this.TotalAmount = PurchaseOrder.TotalAmount ||  0;
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

