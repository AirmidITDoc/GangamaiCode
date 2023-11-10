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
import { Observable } from 'rxjs';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { IndentList } from 'app/main/pharmacy/sales/sales.component';
import { MatSelect } from '@angular/material/select';



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


  dsPurchaseOrder = new MatTableDataSource<PurchaseOrder>();

  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();

  displayedColumns = [
    'PurchaseNo',
    'PurchaseDate',
    'PurchaseTime',
    'StoreName',
    'SupplierName',
    'TotalAmount',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'Qty',
    'Rate',
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

  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,


  ) { }

  ngOnInit(): void {
    // this.getItemNameList();
    this.getPaymentSearchCombo();
    this.getFromStoreSearchList();
    this.getPurchaseOrder();
    this.getSupplierSearchCombo();
    this.getToStoreSearchList();
    // this.getItemNameSearchCombo();
    // this.getItemNameList();
    this.gePharStoreList();
  }

  getOptionText(option) {

    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

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

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getPurchaseOrder() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      "ToStoreId": 10003,// this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').value.ToStoreId || 0,
      "From_Dt": '2022-10-01 00:00:00.000',//this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": '2022-10-01 00:00:00.000',// this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsVerify": 0,//this._IndentID.IndentSearchGroup.get("Status").value || 1,
      "Supplier_Id": 28// this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').value.SupplierId || 0,
    }
    this._PurchaseOrder.getPurchaseOrder(Param).subscribe(data => {
      this.dsPurchaseOrder.data = data as PurchaseOrder[];
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
      "PurchaseId": 3
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

  focusNextService() {
    // this.renderer.selectRootElement('#myInput').focus();
  }


  getPharItemList() {
    var m_data = {
      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
      "StoreId": this._PurchaseOrder.PurchaseStoreform.get('StoreId').value.storeid || 0
    }
    if (this._PurchaseOrder.userFormGroup.get('ItemName').value.length >= 2) {
      this._PurchaseOrder.getItemList(m_data).subscribe(data => {
        this.filteredOptions = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }


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

  OnSave() {
    debugger
    if(!this._PurchaseOrder.PurchaseStoreform.get("purchaseId").value) {
    let purchaseHeaderInsertObj = {};
    purchaseHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date;
    purchaseHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
    purchaseHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    purchaseHeaderInsertObj['supplierID'] = this._PurchaseOrder.PurchaseStoreform.get('SupplierId').value.SupplierId || 0;
    purchaseHeaderInsertObj['totalAmount'] = this.FinalTotalAmt;
    purchaseHeaderInsertObj['discAmount'] = this.DiscAmount;
    purchaseHeaderInsertObj['taxAmount'] = 0;
    purchaseHeaderInsertObj['freightAmount'] = this._PurchaseOrder.PurchaseStoreform.get('Freight').value || 0;
    purchaseHeaderInsertObj['octriAmount'] = 0;
    purchaseHeaderInsertObj['grandTotal'] = this.FinalNetAmount;
    purchaseHeaderInsertObj['isclosed'] = false;
    purchaseHeaderInsertObj['isVerified'] = false;
    purchaseHeaderInsertObj['remarks'] = "";
    purchaseHeaderInsertObj['taxID'] = 0;
    debugger
    purchaseHeaderInsertObj['updatedBy'] = this.accountService.currentUserValue.user.id,
      purchaseHeaderInsertObj['paymentTermId'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentTerm').value.value || '';
      purchaseHeaderInsertObj['modeofPayment'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentMode').value || '';
      purchaseHeaderInsertObj['worrenty'] = this._PurchaseOrder.userFormGroup.get('Warranty').value || 0;
    purchaseHeaderInsertObj['roundVal'] = 0;
    purchaseHeaderInsertObj['totCGSTAmt'] = this.GSTAmount;
    purchaseHeaderInsertObj['totSGSTAmt'] = this.SGSTAmount;
    purchaseHeaderInsertObj['totIGSTAmt'] = this.IGSTAmount;
    purchaseHeaderInsertObj['transportChanges'] = 0;
    purchaseHeaderInsertObj['handlingCharges'] = 0;
    purchaseHeaderInsertObj['freightCharges'] = 0;
    purchaseHeaderInsertObj['purchaseId'] = 0;

    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemID;
      purchaseDetailInsertObj['uomId'] = element.UOMID;
      purchaseDetailInsertObj['qty'] = element.Qty;
      purchaseDetailInsertObj['rate'] = element.Rate;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.vatAmount;
      purchaseDetailInsertObj['vatPer'] = element.vatPer;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.NetAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = element.CGSTPer;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt;
      purchaseDetailInsertObj['sgstPer'] = element.SGSTPer;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt;
      purchaseDetailInsertObj['igstPer'] = element.IGSTPer;
      purchaseDetailInsertObj['igstAmt'] = element.IGSTAmt;
      InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
    });

    let submitData = {
      "purchaseHeaderInsert": purchaseHeaderInsertObj,
      "purchaseDetailInsert": InsertpurchaseDetailObj,
    };
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseSave(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Save Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            // this._matDialog.closeAll();
            // this.OnReset()
          }
        });
      } else {
        Swal.fire('Error !', 'Purchase not saved', 'error');
      }
      // this.isLoading = '';
    });
  }
  else{

  }
  }

  calculateTotalAmount() {
    if (this.Rate && this.Qty) {
      this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(4);
      this.NetAmount = this.TotalAmount;
      // this.calculatePersc();
    }
  }

  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    return this.FinalNetAmount;
  }

  getTotalGST(element) {

    this.GSTAmount = element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0);
    return this.GSTAmount;

    this.CGSTAmount = element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0);


    this.SGSTAmount = element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0);


    this.IGSTAmount = element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0);


  }

  getTotalDisc(element) {

    this.DiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0);
    return this.DiscAmount;
  }

  getTotalAmt(element) {

    this.FinalTotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
    return this.FinalTotalAmt;
  }

  calculateDiscperAmount() {
    debugger
    if (this.Dis) {
      let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
      this.DiscAmt = ((disc * parseFloat(this.NetAmount)) / 100).toFixed(4);
      // this.DiscAmount =  DiscAmt
      this.NetAmount = (parseFloat(this.NetAmount) - parseFloat(this.DiscAmt)).toFixed(4);

    }

  }

  calculateDiscAmount() {
    if (this.Dis) {
      this.NetAmount =(parseFloat(this.NetAmount) - parseFloat(this.DiscAmount));
      // this.DiscAmount;
      // this.calculatePersc();
    }
  }

  calculateGSTperAmount() {

    if (this.GSTPer) {

      this.GSTAmt = ((parseFloat(this.NetAmount) * parseFloat(this.GSTPer)) / 100).toFixed(4);
      this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(4);
      this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);

    }
  }

  // calculateGSTAmount(){
  //   if (this.GSTAmt) {

  //     // this.GSTAmount = Math.round((this.NetAmount * parseInt(this.GST)) / 100);
  //     this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(4);
  //     this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);

  //   }
  // }

  calculatePersc() {
    if (this.Dis) {
      this.Dis = Math.round(this.TotalAmount * parseInt(this.DiscAmount)) / 100;
      this.NetAmount = this.TotalAmount - this.Dis;
      this._PurchaseOrder.userFormGroup.get('calculateDiscAmount').disable();
    }

  }

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

  delete(elm) {
    this.dsItemNameList.data = this.dsItemNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
  }

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    // this.nextPage$.next();
  }

  getToStoreSearchList() {

    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    console.log(vdata);
    this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      console.log(this.ToStoreList);
      this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').setValue(this.Store1List[0]);
    });
  }

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
      this.filteredoptionsSupplier = this._PurchaseOrder.PurchaseStoreform.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );

    });
  }

  getPaymentSearchCombo() {
    this._PurchaseOrder.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
      console.log(data);
      this.optionsPayment = this.ToStoreList.slice();
      this.filteredoptionsPayment = this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPayment(value) : this.ToStoreList.slice()),
      );

    });
  }

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

  getFromStoreSearchList() {
    var data = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._PurchaseOrder.getFromStoreSearchList(data).subscribe(data => {
      this.FromStoreList = data;
      this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }


  getItemNameList() {
    debugger
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
  @ViewChild('Freight') Freight: MatSelect;

  @ViewChild('DeliveryDate') DeliveryDate: MatSelect;
  @ViewChild('PaymentMode') PaymentMode: MatSelect;

  @ViewChild('Paymentterm') Paymentterm: ElementRef;



  @ViewChild('TaxNature') TaxNature: MatSelect;
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

      if (this.Freight) this.Freight.focus();
    }
  }


  public onEnterFreight(event): void {
    if (event.which === 13) {

      if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  }
  public onEnterDeliveryDate(event): void {
    if (event.which === 13) {

      if (this.PaymentMode) this.PaymentMode.focus();
    }
  }
  public onEnterPaymentMode(event): void {
    if (event.which === 13) {
      this.Paymentterm.nativeElement.focus();

    }
  }
  public onEnterPaymentTerm(event): void {
    if (event.which === 13) {

      if (this.TaxNature) this.TaxNature.focus();
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
    debugger
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
  // public onEnterRemark(event): void {
  //   if (event.which === 13) {
  //     this.specification.nativeElement.focus();
  //   }
  // }


  gePharStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._PurchaseOrder.PurchaseStoreform.get('StoreId').setValue(this.StoreList[0]);
      this.StoreName = this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').value.StoreName;
    });
  }

  getSelectedObj(obj) {
    this.accountService
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
        UOM: this.UOM || 0,
        Rate: this.Rate || 0,
        TotalAmount: this.TotalAmount,
        Dis: this.Dis || 0,
        DiscAmount: this.DiscAmt,
        VatAmount: this.VatAmount,
        VatPer: this.DiscAmt,
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
    debugger
    if (event.value == 'true') {

      if (parseFloat(this.GSTPer) > 0) {

        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(4);
      }
    }
    else if (event.value == 'false') {
      debugger
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
    }
  }
}

export class PurchaseItemList {
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

  /**
   * Constructor
   *
   * @param PurchaseOrder
   */
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

