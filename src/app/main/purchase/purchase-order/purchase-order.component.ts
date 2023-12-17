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
  // PatientName: any;
  ItemObj: IndentList;
  chkNewGRN: any;

  TotalQty: any = 0;

  FreightList = [
    { id: 1, name: "NILL" },
    { id: 2, name: "RS 240" },
    { id: 3, name: "RS 2500" },
    { id: 4, name: "RS 360" },
    // {id: 5, name: "England"}
  ];



  DeliveryDateList = [
    { id: 1, name: "1 WEEK" },
    { id: 2, name: "20 DAYS" },
    { id: 3, name: "30 Days" },
    { id: 4, name: "AS PER FINALQUOTATION" },
    { id: 5, name: "IMMIDATE" }
  ];


  PaymentModeList = [
    { id: 1, name: "CASH" },
    { id: 2, name: "CHEQUE" },
    { id: 3, name: "30 Days" },
    { id: 4, name: "D D" },
    { id: 5, name: "ECS" }
  ];

  TaxNatureList = [
    { id: 1, name: "EXCISE DUTY 10.3 PERCENT CST13.5 PER" },
    { id: 2, name: "INCLUSIVE" },
    { id: 3, name: "VAT" },
    { id: 4, name: "VAT 12.5 INCLUSIVE" },
    { id: 5, name: "VAT 12.5 EXTRA" }
  ];

  PaymentList = [
    { id: 1, name: "Cash" },
    { id: 2, name: "DD" },
    { id: 3, name: "Cheque" },
    { id: 4, name: "Credit" },
    // {id: 5, name: "VAT 12.5 EXTRA"}
  ];
  dsPurchaseOrder = new MatTableDataSource<PurchaseOrder>();

  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();

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
    'TotalAmount',
    'MRP',
    'GrandTotalAmount',
  ];

  displayedColumns2 = [
    'Action',
    // 'ItemID',
    'ItemName',
    'Qty',
    'UOM',
    'Rate',
    'TotalAmount',
    'Dis',
    'DiscAmount',
    'GST',
    'GSTAmount',
    'NetAmount',
    'MRP',
    'Specification',
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

    // this.OnReset();
    // this.getItemNameList();
    // this.getStoreSearchCombo();
    this.getFromStoreSearch();
    this.getSupplierSearchCombo();
    // this.getToStoreSearchList();
    // this.getItemNameSearchCombo();
    // this.getItemNameList();
    // this.gePharStoreList();
    //this.getPurchaseOrderList();
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
    console.log(Param);
    this._PurchaseOrder.getPurchaseOrder(Param).subscribe(data => {
      this.dsPurchaseOrder.data = data as PurchaseOrder[];
      console.log(this.dsPurchaseOrder);
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
      //console.log(this.dsPurchaseItemList);
    },
      error => {
        this.sIsLoading = '';
      });
  }
  msg:any;
  isEditMode = true;
  onVerify(row) {
    var Param = {
      "update_POVerify_Status": {
      "purchaseID": row.PurchaseID,
      "isVerified": true,
      "isVerifiedId":1, 
      "verifiedDateTime":  "2023-12-15T08:51:49.380Z"    
    }
  }
    console.log(Param)
    this._PurchaseOrder.getVerifyPurchaseOrdert(Param).subscribe(data => {
      this.msg = data;
      console.log(this.msg);
      if(data){
        this.toastr.success('Record Verified Successfully.', 'Verified !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.isEditMode = false;
      }
      
      },error => {
        this.toastr.error('Record Not Verified !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
  }
 
  
  

 


  // getOptionText(option) {

  //   if (!option)
  //     return '';
  //   return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  // }

  // deleteTableRow(element) {
  //   let index = this.chargeslist.indexOf(element);
  //   if (index >= 0) {
  //     this.chargeslist.splice(index, 1);
  //     this.dsItemNameList.data = [];
  //     this.dsItemNameList.data = this.chargeslist;
  //   }
  //   Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  // }


  // focusNextService() {
  //   // this.renderer.selectRootElement('#myInput').focus();
  // }


  // getPharItemList() {
  //   var m_data = {
  //     "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
  //     "StoreId": this._PurchaseOrder.PurchaseStoreform.get('StoreId').value.storeid || 0
  //   }
  //   if (this._PurchaseOrder.userFormGroup.get('ItemName').value.length >= 2) {
  //     this._PurchaseOrder.getItemList(m_data).subscribe(data => {
  //       this.filteredOptions = data;
  //       if (this.filteredOptions.length == 0) {
  //         this.noOptionFound = true;
  //       } else {
  //         this.noOptionFound = false;
  //       }
  //     });
  //   }
  // }


  //   getSelectedObj(obj) {
  //   // this.registerObj = obj;
  //   this.ItemName = obj.ItemName;
  //   this.ItemId = obj.ItemId;
  //   this.BalanceQty = obj.BalanceQty;

  //   if (this.BalanceQty > 0) {
  //     this.getBatch();
  //   }
  // }

  disableSelect = new FormControl(false);

  // OnSave() {

  //   // if(!this._PurchaseOrder.PurchaseStoreform.get("purchaseId").value) {
  //   let purchaseHeaderInsertObj = {};
  //   purchaseHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date;
  //   purchaseHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
  //   purchaseHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId;
  //   purchaseHeaderInsertObj['supplierID'] = this._PurchaseOrder.PurchaseStoreform.get('SupplierId').value.SupplierId || 0;
  //   purchaseHeaderInsertObj['totalAmount'] = this.FinalTotalAmt;
  //   purchaseHeaderInsertObj['discAmount'] = this.DiscAmount;
  //   purchaseHeaderInsertObj['taxAmount'] = 0;
  //   purchaseHeaderInsertObj['freightAmount'] = this._PurchaseOrder.PurchaseStoreform.get('Freight').value || 0;
  //   purchaseHeaderInsertObj['octriAmount'] = 0;
  //   purchaseHeaderInsertObj['grandTotal'] = this.FinalNetAmount;
  //   purchaseHeaderInsertObj['isclosed'] = false;
  //   purchaseHeaderInsertObj['isVerified'] = false;
  //   purchaseHeaderInsertObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
  //   purchaseHeaderInsertObj['taxID'] = 0;

  //   purchaseHeaderInsertObj['addedBy'] = this.accountService.currentUserValue.user.id,
  //   purchaseHeaderInsertObj['updatedBy'] = this.accountService.currentUserValue.user.id,
  //   purchaseHeaderInsertObj['paymentTermId'] = this._PurchaseOrder.PurchaseStoreform.get('PaymentTerm').value.id || '';
  //   purchaseHeaderInsertObj['modeofPayment'] = this._PurchaseOrder.PurchaseStoreform.get('PaymentMode').value.id || '';
  //   purchaseHeaderInsertObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Warranty').value || 0;
  //   purchaseHeaderInsertObj['roundVal'] = 0;
  //   purchaseHeaderInsertObj['totCGSTAmt'] = this.GSTAmount;
  //   purchaseHeaderInsertObj['totSGSTAmt'] = this.SGSTAmount;
  //   purchaseHeaderInsertObj['totIGSTAmt'] = this.IGSTAmount;
  //   purchaseHeaderInsertObj['transportChanges'] = 0;
  //   purchaseHeaderInsertObj['handlingCharges'] = 0;
  //   purchaseHeaderInsertObj['freightCharges'] = 0;
  //   purchaseHeaderInsertObj['purchaseId'] = 0;

  //   let InsertpurchaseDetailObj = [];
  //   this.dsItemNameList.data.forEach((element) => {
  //     let purchaseDetailInsertObj = {};
  //     purchaseDetailInsertObj['purchaseId'] = 0;
  //     purchaseDetailInsertObj['itemId'] = element.ItemID;
  //     purchaseDetailInsertObj['uomId'] = element.UOMID;
  //     purchaseDetailInsertObj['qty'] = element.Qty;
  //     purchaseDetailInsertObj['rate'] = element.Rate;
  //     purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
  //     purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
  //     purchaseDetailInsertObj['discPer'] = element.DiscPer;
  //     purchaseDetailInsertObj['vatAmount'] = element.vatAmount;
  //     purchaseDetailInsertObj['vatPer'] = element.vatPer;;
  //     purchaseDetailInsertObj['grandTotalAmount'] = element.NetAmount;
  //     purchaseDetailInsertObj['mrp'] = element.MRP;
  //     purchaseDetailInsertObj['specification'] = element.Specification;
  //     purchaseDetailInsertObj['cgstPer'] = element.CGSTPer;
  //     purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt;
  //     purchaseDetailInsertObj['sgstPer'] = element.SGSTPer;
  //     purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt;
  //     purchaseDetailInsertObj['igstPer'] = element.IGSTPer;
  //     purchaseDetailInsertObj['igstAmt'] = element.IGSTAmt;
  //     InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
  //   });

  //   let submitData = {
  //     "purchaseHeaderInsert": purchaseHeaderInsertObj,
  //     "purchaseDetailInsert": InsertpurchaseDetailObj,
  //   };
  //   console.log(submitData);
  //   this._PurchaseOrder.InsertPurchaseSave(submitData).subscribe(response => {
  //     if (response) {
  //       Swal.fire('Save Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
  //         if (result.isConfirmed) {
  //           let m = response;
  //           // this._matDialog.closeAll();
  //           this.OnReset();

  //         }
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Purchase not saved', 'error');
  //     }
  //     // this.isLoading = '';
  //   });
  // // }
  // // else{

  // //   let updatePurchaseOrderHeaderObj = {};
  // //   updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date;
  // //   updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
  // //   updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId;
  // //   updatePurchaseOrderHeaderObj['supplierID'] = this._PurchaseOrder.PurchaseStoreform.get('SupplierId').value.SupplierId || 0;
  // //   updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt;
  // //   updatePurchaseOrderHeaderObj['discAmount'] = this.DiscAmount;
  // //   updatePurchaseOrderHeaderObj['taxAmount'] = 0;
  // //   updatePurchaseOrderHeaderObj['freightAmount'] = this._PurchaseOrder.PurchaseStoreform.get('Freight').value || 0;
  // //   updatePurchaseOrderHeaderObj['octriAmount'] = 0;
  // //   updatePurchaseOrderHeaderObj['grandTotal'] = this.FinalNetAmount;
  // //   updatePurchaseOrderHeaderObj['isclosed'] = false;
  // //   updatePurchaseOrderHeaderObj['isVerified'] = false;
  // //   updatePurchaseOrderHeaderObj['remarks'] = "";
  // //   updatePurchaseOrderHeaderObj['taxID'] = 0;

  // //   updatePurchaseOrderHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
  // //   updatePurchaseOrderHeaderObj['paymentTermId'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentTerm').value.value || '';
  // //   updatePurchaseOrderHeaderObj['modeofPayment'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentMode').value || '';
  // //   updatePurchaseOrderHeaderObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Warranty').value || 0;
  // //   updatePurchaseOrderHeaderObj['roundVal'] = 0;
  // //   updatePurchaseOrderHeaderObj['totCGSTAmt'] = this.GSTAmount;
  // //   updatePurchaseOrderHeaderObj['totSGSTAmt'] = this.SGSTAmount;
  // //   updatePurchaseOrderHeaderObj['totIGSTAmt'] = this.IGSTAmount;
  // //   updatePurchaseOrderHeaderObj['transportChanges'] = 0;
  // //   updatePurchaseOrderHeaderObj['handlingCharges'] = 0;
  // //   updatePurchaseOrderHeaderObj['freightCharges'] = 0;
  // //   updatePurchaseOrderHeaderObj['purchaseId'] = 0;


  // //   let delete_PurchaseDetailsObj = {};
  // //   delete_PurchaseDetailsObj['purchaseID'] = 0;

  // //   let update_POVerify_StatusObjarray = [];
  // //   this.dsItemNameList.data.forEach((element) => {
  // //     let update_POVerify_StatusObj = {};
  // //     update_POVerify_StatusObj['purchaseId'] = 0;
  // //     update_POVerify_StatusObj['itemId'] = element.ItemID;
  // //     update_POVerify_StatusObj['uomId'] = element.UOMID;
  // //     update_POVerify_StatusObj['qty'] = element.Qty;
  // //     update_POVerify_StatusObj['rate'] = element.Rate;
  // //     update_POVerify_StatusObjarray.push(update_POVerify_StatusObj);
  // //   });

  // //   let submitData = {
  // //     "updatePurchaseOrderHeader": updatePurchaseOrderHeaderObj,
  // //      "delete_PurchaseDetails": delete_PurchaseDetailsObj,
  // //     "update_POVerify_StatusObj": update_POVerify_StatusObjarray,
  // //   };
  // //   console.log(submitData);
  // //   this._PurchaseOrder.InsertPurchaseUpdate(submitData).subscribe(response => {
  // //     if (response) {
  // //       Swal.fire('Update Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
  // //         if (result.isConfirmed) {
  // //           let m = response;
  // //           // this._matDialog.closeAll();
  // //           // this.OnReset()
  // //         }
  // //       });
  // //     } else {
  // //       Swal.fire('Error !', 'Purchase not Updated', 'error');
  // //     }
  // //     // this.isLoading = '';
  // //   });
  // // }
  // }

  // calculateTotalAmount() {
  //   if (this.Rate && this.Qty) {
  //     this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(4);
  //     this.NetAmount = this.TotalAmount;
  //     // this.calculatePersc();
  //   }
  // }

  // getTotalNet(element) {
  //   let NetAmt;
  //   this.FinalNetAmount =(element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
  //   return this.FinalNetAmount;
  // }

  // getTotalGST(element) {

  //   this.GSTAmount = element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0);
  //   return this.GSTAmount;

  //   this.CGSTAmount = element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0);


  //   this.SGSTAmount = element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0);


  //   this.IGSTAmount = element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0);


  // }

  // getTotalDisc(element) {

  //   this.DiscAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);
  //   return this.DiscAmount;
  // }

  // getTotalAmt(element) {

  //   this.FinalTotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
  //   return this.FinalTotalAmt;
  // }

  // calculateDiscperAmount() {

  //   if (this.Dis) {
  //     let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
  //     this.DiscAmt = ((disc * parseFloat(this.NetAmount)) / 100).toFixed(4);
  //     // this.DiscAmount =  DiscAmt
  //     this.NetAmount = (parseFloat(this.NetAmount) - parseFloat(this.DiscAmt)).toFixed(4);

  //   }

  // }

  // calculateDiscAmount() {
  //   if (this.Dis) {
  //     this.NetAmount =(parseFloat(this.NetAmount) - parseFloat(this.DiscAmount));
  //     // this.DiscAmount;
  //     // this.calculatePersc();
  //   }
  // }

  // calculateGSTperAmount() {

  //   if (this.GSTPer) {

  //     this.GSTAmt = ((parseFloat(this.NetAmount) * parseFloat(this.GSTPer)) / 100).toFixed(4);
  //     this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(4);
  //     this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);

  //   }
  // }

  // calculateGSTAmount(){
  //   if (this.GSTAmt) {

  //     // this.GSTAmount = Math.round((this.NetAmount * parseInt(this.GST)) / 100);
  //     this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(4);
  //     this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);

  //   }
  // }

  // calculatePersc() {
  //   if (this.Dis) {
  //     this.Dis = Math.round(this.TotalAmount * parseInt(this.DiscAmount)) / 100;
  //     this.NetAmount = this.TotalAmount - this.Dis;
  //     this._PurchaseOrder.userFormGroup.get('calculateDiscAmount').disable();
  //   }

  // }

  highlight(contact) {
    this.selectedRowIndex = contact.ItemID;
  }

  OnReset() {
    this._PurchaseOrder.PurchaseSearchGroup.reset();
    this._PurchaseOrder.userFormGroup.reset();
    this._PurchaseOrder.PurchaseStoreform.reset();
    this._PurchaseOrder.FinalPurchaseform.reset();
    this.dsItemNameList.data = [];
  }

  // delete(elm) {
  //   this.dsItemNameList.data = this.dsItemNameList.data
  //     .filter(i => i !== elm)
  //     .map((i, idx) => (i.position = (idx + 1), i));
  // }

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  // onScroll() {
  //   //Note: This is called multiple times after the scroll has reached the 80% threshold position.
  //   // this.nextPage$.next();
  // }

  // getToStoreSearchList() {

  //   var vdata = {
  //     Id: this.accountService.currentUserValue.user.storeId
  //   }
  //   console.log(vdata);
  //   this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
  //     this.ToStoreList = data;
  //    /// console.log(this.ToStoreList);
  //     this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').setValue(this.Store1List[0]);
  //   });
  // }

  // getSupplierSearchList() {
  //   this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
  //     this.SupplierList = data;
  //   });
  // }

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
      this.filteredoptionsSupplier = this._PurchaseOrder.userFormGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );

    });
  }

  // getStoreSearchCombo() {
  //   // this._PurchaseOrder.getToStoreSearchList().subscribe(data => {
  //   //   this.ToStoreList = data;
  //   //   console.log(data);
  //   //   this.optionsPayment = this.ToStoreList.slice();
  //   //   this.filteredoptionsPayment = this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').valueChanges.pipe(
  //   //     startWith(''),
  //   //     map(value => value ? this._filterPayment(value) : this.ToStoreList.slice()),
  //   //   );

  //   // });

  //   var vdata = {
  //     Id: this.accountService.currentUserValue.user.storeId
  //   }
  //   this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
  //     this.StoreList = data;
  //     this._PurchaseOrder.PurchaseStoreform.get('StoreId').setValue(this.StoreList[0]);
  //     this.StoreName = this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').value.StoreName;
  //   });

  // }

  // getItemNameSearchCombo() {
  //   var Param = {

  //     "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
  //     "StoreId": this._PurchaseOrder.userFormGroup.get("StoreId").value.StoreId || 0
  //   }
  //   // console.log(Param);
  //   this._PurchaseOrder.getItemNameList(Param).subscribe(data =>{
  //       this.ItemName = data;
  //       // console.log(data);
  //       this.optionsItemName = this.ItemName.slice();
  //       this.filteredoptionsItemName = this._PurchaseOrder.userFormGroup.get('ItemName').valueChanges.pipe(
  //         startWith(''),
  //         map(value => value ? this._filterItemName(value) : this.ItemName.slice()),
  //       );

  //     });
  //   }

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
      console.log(data)
      this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }


  getItemNameList() {

    var Param = {

      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%` || '%',
      "StoreId": this._PurchaseOrder.userFormGroup.get("StoreId").value.StoreId || 0
    }
    // console.log(Param);
    this._PurchaseOrder.getItemNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      // console.log( this.filteredOptions )
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }



  @ViewChild('SupplierId') SupplierId: MatSelect;
  @ViewChild('Freight1') Freight1: ElementRef;

  @ViewChild('DeliveryDate1') DeliveryDate1: ElementRef;
  @ViewChild('PaymentMode') PaymentMode: MatSelect;

  @ViewChild('Paymentterm') Paymentterm: MatSelect;

  @ViewChild('TaxNature1') TaxNature1: MatSelect;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('dis') dis: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('mrp') mrp: ElementRef;
  @ViewChild('specification') specification: ElementRef;
  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  @ViewChild('Warranty') Warranty: MatSelect;
  @ViewChild('Schedule') Schedule: MatSelect;

  @ViewChild('OtherTax') OtherTax: ElementRef;
  @ViewChild('Remark') Remark: ElementRef;

  public onEnterSupplier(event): void {
    if (event.which === 13) {

      // if (this.Freight) this.Freight.focus();
      this.Freight1.nativeElement.focus();
    }
  }


  public onEnterFreight(event): void {
    if (event.which === 13) {
      this.DeliveryDate1.nativeElement.focus();
      // if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  }
  public onEnterDeliveryDate(event): void {
    if (event.which === 13) {

      if (this.Paymentterm) this.Paymentterm.focus();
    }
  }
  public onEnterPaymentMode(event): void {
    if (event.which === 13) {
      // this.Paymentterm.nativeElement.focus();
      if (this.TaxNature1) this.TaxNature1.focus();
    }
  }
  public onEnterTaxNature(event): void {
    if (event.which === 13) {

      this.itemid.nativeElement.focus();
    }
  }

  public onEnterPaymentTerm(event): void {
    if (event.which === 13) {

      if (this.PaymentMode) this.PaymentMode.focus();
    }
  }
  public onEnterItemName(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }
  public onEnterQty(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
    }
  }
  public onEnterRate(event): void {
    if (event.which === 13) {
      this.dis.nativeElement.focus();
    }
  }
  public onEnterDis(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
    }
  }
  public onEnterGST(event): void {
    if (event.which === 13) {
      this.mrp.nativeElement.focus();
    }
  }
  public onEnterMRP(event): void {
    if (event.which === 13) {
      this.specification.nativeElement.focus();
    }
  }
  public onEnterSpecification(event): void {

    if (event.which === 13) {
      this.add = true;
      this.addbutton.focus();
    }
  }

  public onEnterWarranty(event): void {
    if (event.which === 13) {

      if (this.Schedule) this.Schedule.focus();
    }
  }

  public onEnterSchedule(event): void {
    if (event.which === 13) {
      this.OtherTax.nativeElement.focus();
    }
  }

  public onEnterOtherTax(event): void {
    if (event.which === 13) {
      this.Remark.nativeElement.focus();
    }
  }
  public onEnterRemark(event): void {
    if (event.which === 13) {
      this.specification.nativeElement.focus();
    }
  }


  gePharStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._PurchaseOrder.PurchaseStoreform.get('StoreId').setValue(this.StoreList[0]);
      this.StoreName = this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').value;
    });
  }

  getSelectedObj(obj) {
    // this.accountService
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.Qty = 1; //obj.BalanceQty;

    if (this.Qty > 0) {
      this.UOM = obj.UOM;
      this.Rate = obj.PurchaseRate;
      this.TotalAmount = (parseInt(this.Qty) * parseFloat(this.Rate)).toFixed(4);
      this.NetAmount = this.TotalAmount;
      this.VatPercentage = obj.VatPercentage;
      // this.CGSTPer =onj.CGSTPer;
      this.GSTPer = obj.GSTPer;
      this.GSTAmount = 0;
      // this.NetAmount = obj.NetAmount;
      // this.MRP = obj.MRP;
      this.Specification = obj.Specification;
    }
    this.qty.nativeElement.focus();
  }


  onAdd() {
    this.dsItemNameList.data = [];
    this.chargeslist.push(
      {
        ItemID: this.ItemID,
        ItemName: this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemName || '',
        Qty: this.Qty || 0,
        UOM: this.UOM,
        Rate: this.Rate || 0,
        TotalAmount: this.TotalAmount,
        Dis: this.Dis || 0,
        DiscAmount: this.DiscAmt,
        VatAmount: this.VatAmount,
        VatPer: this.VatPer,
        CGSTPer: this.CgstPer,
        CGSTAmt: this.CGSTAmt,
        SGSTPer: this.SgstPer,
        SGSTAmt: this.SGSTAmt,
        IGSTPer: this.IgstPer,
        IGSTAmt: this.IGSTAmt,
        GST: this.GSTPer || 0,
        GSTAmount: this.GSTAmt || 0,
        NetAmount: this.NetAmount,
        MRP: this.MRP || 0,
        Specification: this.Specification || '',



      });

    this.dsItemNameList.data = this.chargeslist;
    // this.ResetItem();
    this._PurchaseOrder.userFormGroup.reset();
    this.itemid.nativeElement.focus();
    this.add = false;
  }

  onChangeDiscountMode(event) {

    if (event.value == 'true') {

      if (parseFloat(this.GSTPer) > 0) {

        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(4);
      }
    }
    else if (event.value == 'false') {

      // if (parseFloat(this.GSTPer) > 0) {
      let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
      if (disc > 0) {
        this.DiscAmt = (disc * parseFloat(this.TotalAmount) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DiscAmt)).toFixed(4);
        if (parseFloat(this.GSTPer) > 0) {
          this.GSTAmt = ((parseFloat(this.NetAmount) * parseFloat(this.GSTPer)) / 100).toFixed(4);
          this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(4);
        }
      }
      else {
        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(4);
      }
    }
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
    });
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
    console.log(m_data);
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
  Status3Id:any;
  Warranty: any;
  Remark: any;
  Schedule: any;
  OtherTax: any;
  WorkId: any;

  WODiscAmount: any;
  WOTotalAmount: any;
  WoNetAmount: any;
  WOVatAmount: any;
  

  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
      this.Action = ItemNameList.Action || "";
      this.ItemID = ItemNameList.ItemID || 0;
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
      this.TaxNatureId = ItemNameList.TaxNatureId || '';
      this.Status3Id = ItemNameList.Status3Id || '';
      this.Warranty = ItemNameList.Warranty || '';
      this.Remark = ItemNameList.Remark || '';
      this.Schedule = ItemNameList.Schedule || '';
      this.OtherTax = ItemNameList.OtherTax || '';
      this.WorkId = ItemNameList.WorkId || '';
      this.WODiscAmount = ItemNameList.WODiscAmount || '';
      this.WOTotalAmount = ItemNameList.WOTotalAmount || '';
      this.WoNetAmount = ItemNameList.WoNetAmount || '';
      this.WOVatAmount = ItemNameList.WOVatAmount || '';

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
  GrandTotalAmount: any;
  VatAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;
  VatPer: any;




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
    }
  }
}

function elseif(GST: any) {
  throw new Error('Function not implemented.');
}

