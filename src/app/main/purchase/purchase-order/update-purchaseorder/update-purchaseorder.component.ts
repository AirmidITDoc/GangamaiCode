import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PurchaseOrderService } from '../purchase-order.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { map, startWith } from 'rxjs/operators';
import { IndentList } from 'app/main/inventory/patient-material-consumption/patient-material-consumption.component';
import { MatTableDataSource } from '@angular/material/table';
import { ItemNameList, PurchaseItemList, PurchaseOrder } from '../purchase-order.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-update-purchaseorder',
  templateUrl: './update-purchaseorder.component.html',
  styleUrls: ['./update-purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatePurchaseorderComponent implements OnInit {

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
  registerObj = new ItemNameList({});
  ItemObj: IndentList;


  
  FreightList = [
    { id: 1, name: "NILL" },
    { id: 2, name: "RS 240" },
    { id: 3, name: "RS 2500" },
    {id: 4, name: "RS 360"},
    // {id: 5, name: "England"}
  ];



DeliveryDateList = [
  { id: 1, name: "1 WEEK" },
  { id: 2, name: "20 DAYS" },
  { id: 3, name: "30 Days" },
  {id: 4, name: "AS PER FINALQUOTATION"},
  {id: 5, name: "IMMIDATE"}
];


PaymentModeList = [
  { id: 1, name: "CASH" },
  { id: 2, name: "CHEQUE" },
  { id: 3, name: "30 Days" },
  {id: 4, name: "D D"},
  {id: 5, name: "ECS"}
];



TaxNatureList = [
  { id: 1, name: "EXCISE DUTY 10.3 PERCENT CST13.5 PER" },
  { id: 2, name: "INCLUSIVE" },
  { id: 3, name: "VAT" },
  {id: 4, name: "VAT 12.5 INCLUSIVE"},
  {id: 5, name: "VAT 12.5 EXTRA"}
];
  
  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();


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
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,


  ) { }

  ngOnInit(): void {
   
   
    
    this.getPaymentSearchCombo();
    this.getFromStoreSearchList();
    this.getPurchaseOrder( this.registerObj.PurchaseID);
    this.getSupplierSearchCombo();
    this.getToStoreSearchList();
    // this.getItemNameSearchCombo();
    // this.getItemNameList();
    this.gePharStoreList();

    if(this.data){
      
      this.registerObj=this.data.Obj;
     
      //  this.setDropdownObjs1();
    }
 
  }

  
  setDropdownObjs1() {
   
    // const toSelect = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierID);
    // this._PurchaseOrder.PurchaseStoreform.get('SupplierId').setValue(toSelect);

    // const toSelectMarital = this.MaritalStatusList.find(c => c.MaritalStatusId == this.registerObj.MaritalStatusId);
    // this._PurchaseOrder.PurchaseStoreform.get('Freight').setValue(toSelectMarital);

    // const toSelectReligion = this.ReligionList.find(c => c.ReligionId == this.registerObj.ReligionId);
    // this.personalFormGroup.get('ReligionId').setValue(toSelectReligion);

    // const toSelectArea = this.AreaList.find(c => c.AreaId == this.registerObj.AreaId);
    // this.personalFormGroup.get('AreaId').setValue(toSelectArea);

    // const toSelectCity = this.cityList.find(c => c.CityId == this.registerObj.CityId);
    // this.personalFormGroup.get('CityId').setValue(toSelectCity);

    // this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
    
    // this.onChangeCityList(this.personalFormGroup.get('CityId').value);
    
    // this.personalFormGroup.updateValueAndValidity();
    // this.dialogRef.close();
    
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


  getPurchaseOrder(el) {
debugger
    var Param = {
      "PurchaseId": el,
     
    }
    this._PurchaseOrder.getPurchaseOrderDetail(Param).subscribe(data => {
      this.dsItemNameList.data = data as ItemNameList[];
      this.dsTempItemNameList.data= data as ItemNameList[];
      this.dsItemNameList.sort = this.sort;
      this.dsItemNameList.paginator = this.paginator;
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
   
    let updatePurchaseOrderHeaderObj = {};
    updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date;
    updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
    updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    updatePurchaseOrderHeaderObj['supplierID'] = this._PurchaseOrder.PurchaseStoreform.get('SupplierId').value.SupplierId || 0;
    updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt;
    updatePurchaseOrderHeaderObj['discAmount'] = this.DiscAmount;
    updatePurchaseOrderHeaderObj['taxAmount'] = 0;
    updatePurchaseOrderHeaderObj['freightAmount'] = this._PurchaseOrder.PurchaseStoreform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['octriAmount'] = 0;
    updatePurchaseOrderHeaderObj['grandTotal'] = this.FinalNetAmount;
    updatePurchaseOrderHeaderObj['isclosed'] = false;
    updatePurchaseOrderHeaderObj['isVerified'] = false;
    updatePurchaseOrderHeaderObj['remarks'] = "";
    updatePurchaseOrderHeaderObj['taxID'] = 0;
    
    updatePurchaseOrderHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
    updatePurchaseOrderHeaderObj['paymentTermId'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentTerm').value.value || '';
    updatePurchaseOrderHeaderObj['modeofPayment'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentMode').value || '';
    updatePurchaseOrderHeaderObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Warranty').value || 0;
    updatePurchaseOrderHeaderObj['roundVal'] = 0;
    updatePurchaseOrderHeaderObj['totCGSTAmt'] = this.GSTAmount;
    updatePurchaseOrderHeaderObj['totSGSTAmt'] = this.SGSTAmount;
    updatePurchaseOrderHeaderObj['totIGSTAmt'] = this.IGSTAmount;
    updatePurchaseOrderHeaderObj['transportChanges'] = 0;
    updatePurchaseOrderHeaderObj['handlingCharges'] = 0;
    updatePurchaseOrderHeaderObj['freightCharges'] = 0;
    updatePurchaseOrderHeaderObj['purchaseId'] = this.registerObj.PurchaseID;

    
    let delete_PurchaseDetailsObj = {};
    delete_PurchaseDetailsObj['purchaseID'] =this.registerObj.PurchaseID;

    let update_POVerify_StatusObjarray = [];
    this.dsItemNameList.data.forEach((element) => {
      let update_POVerify_StatusObj = {};
      update_POVerify_StatusObj['purchaseId'] = this.registerObj.PurchaseID;
      update_POVerify_StatusObj['itemId'] = element.ItemID;
      update_POVerify_StatusObj['uomId'] = element.UOMID;
      update_POVerify_StatusObj['qty'] = element.Qty;
      update_POVerify_StatusObj['rate'] = element.Rate;
      update_POVerify_StatusObjarray.push(update_POVerify_StatusObj);
    });

    let submitData = {
      "updatePurchaseOrderHeader": updatePurchaseOrderHeaderObj,
       "delete_PurchaseDetails": delete_PurchaseDetailsObj,
      "update_POVerify_StatusObj": update_POVerify_StatusObjarray,
    };
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseUpdate(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Update Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            // this._matDialog.closeAll();
            // this.OnReset()
          }
        });
      } else {
        Swal.fire('Error !', 'Purchase not Updated', 'error');
      }
      // this.isLoading = '';
    });
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
      console.log(data);
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
    debugger
    this.dsItemNameList.data = [];

    if (this.chargeslist.length ==0){
      this.chargeslist=this.dsTempItemNameList.data
    }
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

  onEdit(contact){

    console.log(contact)

    const dialogRef = this._matDialog.open(UpdatePurchaseorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data : {
          PurchaseObj : contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  onClose() { }
  onClear() { }
}



function elseif(GST: any) {
  throw new Error('Function not implemented.');
}
