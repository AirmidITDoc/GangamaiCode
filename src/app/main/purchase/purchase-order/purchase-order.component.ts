import { Component, OnInit, ViewChild, Renderer2, ViewEncapsulation, ChangeDetectorRef, ElementRef, TemplateRef } from '@angular/core';
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
import { UntypedFormBuilder, FormControl, FormGroup } from '@angular/forms';
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
import { gridModel, gridModel1, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { NewPurchaseorderComponent } from './new-purchaseorder/new-purchaseorder.component';



@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class PurchaseOrderComponent implements OnInit {
  mysearchform: FormGroup;
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  StoreId:any = String(this.accountService.currentUserValue.user.storeId);
  SupplierId = "0";
  status= "0";

  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;

  @ViewChild('iconisClosed') iconisClosed!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'isVerified')!.template = this.isVerifiedstatus;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
   
  }
  @ViewChild('isVerifiedstatus') isVerifiedstatus!: TemplateRef<any>;
  hasSelectedContacts: boolean;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  allcolumns = [

    { heading: "Verify", key: "isVerified", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:70 },
    { heading: "PurchaseNo", key: "purchaseNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Date", key: "pDate", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA' , width: 100, type: gridColumnTypes.amount },
    { heading: "Disc Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', width: 100 , type: gridColumnTypes.amount },
    { heading: "Net Amt", key: "grandTotal", sort: true, align: 'left', emptySign: 'NA', width: 100, type: gridColumnTypes.amount },
    { heading: "Remark", key: "remarks", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "AddedByName", key: "addedByName", sort: true, align: 'left', emptySign: 'NA', width: 150  },
    {
      heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
  } 
  ];

  gridConfig: gridModel = {
    apiUrl: "Purchase/PurchaseOrderList",
    columnsList: this.allcolumns,
    sortField: "PurchaseID",
    sortOrder: 0,
    filters: [{ fieldName: "ToStoreId", fieldValue:  this.StoreId, opType: OperatorComparer.Equals },
    { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
    { fieldName: "IsVerify", fieldValue: String(this.status), opType: OperatorComparer.Equals },
    { fieldName: "Supplier_Id", fieldValue:  String(this.SupplierId), opType: OperatorComparer.Equals }
    ]
  }
  gridConfig1: gridModel = new gridModel();

  isShowDetailTable: boolean = false;
  GetDetails1(data: any): void {
    debugger
    console.log("detailList:", data)
    let ID = data.purchaseID;

    this.gridConfig1 = {
      apiUrl: "Purchase/PurchaseItemList",
      columnsList: [
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "MRP", key: "mrp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Rate", key: "rate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "DiscPer", key: "discPer", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "DiscAmount", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
      
        { heading: "CGSTPer", key: "cgstPer", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "CGSTAmount", key: "cgstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
       
        { heading: "SGSTPer", key: "sgstPer", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "SGSTAmount", key: "sgstAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount},
        { heading: "IGSTPer", key: "igstPer", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IGSTAmount", key: "igstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "GSTPer", key: "vatPer", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "GSTAmount", key: "vatAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
       

        { heading: "TotalAmount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA' },
     
        { heading: "NetAmount", key: "grandTotalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
      ],
      sortField: "PurDetId",
      sortOrder: 0,
      filters: [
        { fieldName: "PurchaseId", fieldValue: String(ID), opType: OperatorComparer.Equals }
      ]
    };
    this.isShowDetailTable = true;
    // setTimeout(() => {
      this.grid1.gridConfig = this.gridConfig1;
      this.grid1.bindGridData();
    // }, 100);
  }

  constructor(public _PurchaseOrderService: PurchaseOrderService, public _matDialog: MatDialog,
    public toastr: ToastrService, private commonService: PrintserviceService,private accountService: AuthenticationService,
    public datePipe: DatePipe,) { }

  ngOnInit(): void {
    this.mysearchform = this._PurchaseOrderService.PurchaseSearchFrom();
  }


  viewgetPurchaseorderReportPdf(element) {
    this.commonService.Onprint("PurchaseID", element.PurchaseID, "Purchaseorder");
  }

  onSave(row: any = null) {
    let that = this;
    const dialogRef = this._matDialog.open(NewPurchaseorderComponent,
      {  maxWidth: "100%",
        height: '98%',
        width: '98%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
    this.grid.bindGridData();
  });
  }

  selectChangeStore(value) {   
    if(value.value!==0)
       this.StoreId=value.value
   else
   this.StoreId="0" 

   this.onChangeFirst(event);
}
   ListView(value) {
    if (value.value !== 0)
        this.StoreId = value.value
      else
        this.StoreId = "0"
   this.onChangeFirst(value);
  }

  ListView1(value) {
        if (value.value !== 0)
        this.SupplierId = value.value
      else
        this.SupplierId = "0"
        this.onChangeFirst(value);
  }

  onChangeFirst(value) {
    
  if(this.mysearchform.get('Status').value == true){
      this.status = "1"
  }else{
      this.status = "0"
  }

  debugger
    this.isShowDetailTable = false;
    this.fromDate = this.datePipe.transform(this.mysearchform.get('startdate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.mysearchform.get('enddate').value, "yyyy-MM-dd")
    this.StoreId = this.mysearchform.get("StoreId").value || this.StoreId
    this.SupplierId = this.SupplierId
   
    this.getfilterdata();
  }

  getfilterdata() {
    debugger
    this.gridConfig = {
      apiUrl: "Purchase/PurchaseOrderList",
      columnsList: this.allcolumns,
      sortField: "PurchaseID",
      sortOrder: 0,
      filters: [
        { fieldName: "ToStoreId", fieldValue: this.StoreId, opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "IsVerify", fieldValue:  this.status, opType: OperatorComparer.Equals },
        { fieldName: "Supplier_Id", fieldValue: this.SupplierId, opType: OperatorComparer.Equals }
      ],
      row: 25
    }
   console.log( this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

  }
  OnWhatsPoSend(){}
  POEmail(contact) {
   
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
    
  }

  onVerify(row) {
   
    let submitData = {
      "purchaseId": row.purchaseID,
      "isVerifiedId": 1

    };
   this._PurchaseOrderService.getVerifyPurchaseOrdert(submitData).subscribe(response => {
      this.toastr.success(response);
      if (response) {
        this.commonService.Onprint("PurchaseID", row.purchaseID, "Purchaseorder");
        this.onChangeFirst(event);
       }
 
     });
  }
  chkNewGRN: any;
  OnEdit(contact) {
    console.log(contact)
    if(this.mysearchform.get('Status').value == 0 ){
      // this.chkNewGRN = 2;
      // console.log(contact)
      // this.advanceDataStored.storage = new SearchInforObj(contact);
     
      const dialogRef = this._matDialog.open(NewPurchaseorderComponent,
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
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
      });
    }
    else{
      this.toastr.warning('Verified Record connot be edited', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
   
   
  }

}





export class ItemNameList {
  Action: string;
  ItemID: any;
  ItemId: any;
  ItemName: string;
  Qty: number;
  UOM: number;
  Rate: any;
  TotalAmount: any;
  Dis: any;
  Disc: any;
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
  DisAmount: any;
  Mobile: any
  taxAmount: any;
  GSTAmt: any;
  VatAmount: any;
  VatPer: any;
  DefRate: any;
  SupplierName: any;
  PurchaseDate: any;
  GSTType: any;
  ConversionFactor: number;
  TotalQty: number;
  purchaseID: any;
  CGSTAmount: any;
  SGSTAmount: any;
  IGSTAmount: any;
  CGST: any;
  SGST: any;
  IGST: any;

  purDetId: any;
  itemName: any;
  qty: any;
  rate: any;
  totalAmount: any;
  discAmount: any;
  discPer: any;
 grandTotalAmount: any;
  mrp: any;
 cgstPer: any;
 cgstAmt: any;
 sgstPer: any;
 sgstAmt: any;
 igstPer: any;
 igstAmt: any;
 defRate: any;
 specification: any;
 itemId: any;
 uomid: any;
 freightAmount: any;
 transportChanges: any;
 handlingCharges: any;
 octriAmount: any;
 worrenty: any;
 remarks: any;
  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
      this.Action = ItemNameList.Action || "";
      this.ItemID = ItemNameList.ItemID || 0;
      this.ItemId = ItemNameList.ItemId || 0;
      this.ItemName = ItemNameList.ItemName || "";
      this.Qty = ItemNameList.Quantity || 0;
      this.Qty = ItemNameList.Qty || 0;
      this.UOM = ItemNameList.UOM || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.Dis = ItemNameList.Dis || 0;
      this.Disc = ItemNameList.Disc || 0;
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
      this.Worrenty = ItemNameList.Worrenty || "";
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
      this.purchaseID = ItemNameList.purchaseID || 0;
      this.GrandTotalAmount = ItemNameList.GrandTotalAmount || 0;
      this.CGSTAmount = ItemNameList.CGSTAmount || 0;
      this.SGSTAmount = ItemNameList.SGSTAmount || 0;
      this.IGSTAmount = ItemNameList.IGSTAmount || 0;
      this.CGST = ItemNameList.CGST || 0;
      this.SGST = ItemNameList.SGST || 0;
      this.IGST = ItemNameList.IGST || 0;
      this.DiscPer= ItemNameList.DiscPer || 0;

      this.purDetId= ItemNameList.purDetId || 0;
      this.itemName= ItemNameList.itemName || "";
      this.qty= ItemNameList.qty || 0;
      this.rate= ItemNameList.rate || 0;
      this.totalAmount= ItemNameList.totalAmount || 0;
      this.discAmount= ItemNameList.discAmount || 0;
      this.discPer= ItemNameList.discPer || 0;
      this. grandTotalAmount= ItemNameList.grandTotalAmount || 0;
      this.mrp= ItemNameList.mrp || 0;
      this.cgstPer= ItemNameList.cgstPer || 0;
      this.cgstAmt= ItemNameList.cgstAmt || 0;
      this.sgstPer= ItemNameList.sgstPer || 0;
      this.sgstAmt= ItemNameList.sgstAmt || 0;
      this.igstPer= ItemNameList.igstPer || 0;
      this.igstAmt= ItemNameList.igstAmt || 0;
      this.defRate= ItemNameList.defRate || 0;
      this.specification= ItemNameList.specification || 0;
      this.itemId= ItemNameList.itemId || 0;
      this.uomid= ItemNameList.uomid || 0;
      this.freightAmount= ItemNameList.freightAmount || 0;
      this.transportChanges= ItemNameList.transportChanges || 0;
      this.handlingCharges= ItemNameList.handlingCharges || 0;
      this.octriAmount= ItemNameList.octriAmount || 0;
      this.worrenty= ItemNameList.worrenty || 0;
      this.remarks= ItemNameList.remarks || 0;

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
  Remarks: any;
  Mobile: any;
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
  Disc: any;
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
  Remarks: any;
  Mobile: any;
  PaymentTermId: any;
  ModeOfPayment: any;
  DiscAmount: any;
  TaxAmount: any;
  GrandTotal: any;
  AddedByName: any;
  VerifiedName: any;
  TransportChanges: any
  HandlingCharges: any;
  FreightAmount: any;
  OctriAmount: any;
  constructor(PurchaseOrder) {
    {
      this.PurchaseNo = PurchaseOrder.PurchaseNo || 0;
      this.GrandTotal = PurchaseOrder.GrandTotal || 0;
      this.PurchaseDate = PurchaseOrder.PurchaseDate || 0;
      this.PurchaseTime = PurchaseOrder.PurchaseTime || "";
      this.StoreName = PurchaseOrder.StoreName || "";
      this.SupplierName = PurchaseOrder.SupplierName || 0;
      this.TotalAmount = PurchaseOrder.TotalAmount || 0;
      this.PurchaseId = PurchaseOrder.PurchaseId || "";
      this.FromStoreId = PurchaseOrder.FromStoreId || "";
      this.ItemTotalAmount = PurchaseOrder.ItemTotalAmount || "";
      this.Remarks = PurchaseOrder.Remarks || '';
      this.Mobile = PurchaseOrder.Mobile || 0;
      this.GrandTotalAmount = PurchaseOrder.GrandTotalAmount || 0;
      this.Disc= PurchaseOrder.Disc || 0;
      this.DiscAmount= PurchaseOrder.DiscAmount || 0;
    }
  }
}

function elseif(GST: any) {
  throw new Error('Function not implemented.');
}

