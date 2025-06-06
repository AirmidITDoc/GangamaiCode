import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { invalid } from 'moment';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-update-purchaseorder',
  templateUrl: './update-purchaseorder.component.html',
  styleUrls: ['./update-purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatePurchaseorderComponent implements OnInit {
  vsaveflag:boolean=true;
  displayedColumns2 = [
    // 'ItemID',
    'ItemName',
    'UOM',
    'Qty',
    'MRP',
    'Rate',
    'DefRate',
    'TotalAmount',
    'Dis',
    'DiscAmount',
    'CGST',
    'CGSTAmount',
    'SGST',
    'SGSTAmount',
    'IGST',
    'IGSTAmount',
    'GST',
    'GSTAmount',
    'NetAmount',
    'Specification',
    'Action',
  ];
  displayedColumns3 = [
    'SupplierName',
    'ReceiveQty',
    'FreeQty',
    'MRP',
    'Rate',
    'discpercentage',
    'DiscAmount',
    'VatPercentage'
  ]

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  StoreList: any = [];
  Store1List: any = [];
  StoreName: any;
  FromStoreList: any;
  SupplierList: any;
  screenFromString = 'purchase-form';
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
  vDefRate: any;
  vGSTAmt: any = 0.0;
  CGSTAmount: any;
  IGSTAmount: any;
  SGSTAmount: any = 0.0;
 // grandTotalAmount: any = 0.0;
  isItemIdSelected: boolean = false;
  VatPercentage: any = 0.0;
  state = false;
  optionsInc = null;


  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  vQty: any = 1;
  IssQty: any;
  Bal: any;
  disableSelect = new FormControl(false);
  vGSTPer: any;
  vMRP: any;
  DiscPer: any = 0;
  vDiscAmt: any = 0;
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

  // PaymentTerm: any;
  registerObj = new ItemNameList({});
  ItemObj: IndentList;

  ItemName: any;
  vUOM: any;
  BalanceQty: any;
  vRate: any;
  vTotalAmount: any;
  vDis: any = 0;
  GST: any = 0;
  vNetAmount: any;
  vSpecification: string;
  renderer: any;
  disableTextbox: boolean;
  DiscAmount: any;
  GSTAmount: any;
  PaymentTermsList: any = [];
  ModeOfPaymentList: any = [];
  GSTTypeList: any = [];
  SupplierID: any;
  vAddress: any;
  vMobile: any;
  vContact: any;
  vGSTNo: any;
  vEmail: any;
  vItemNames: any;
  vConversionFactor: any;
  vHSNcode: any;
  optionsupplier: any;
  GrandTotalAmount: any;
  UnitofMeasurementName: any;
  dateTimeObj: any;
  ItemId: any;
  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();
  dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedRowIndex: any;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsPayment: Observable<string[]>;

  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UpdatePurchaseorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if (this.data.chkNewGRN == 2) {
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.getSupplierSearchCombo();
      this.getOldPurchaseOrder(this.registerObj.PurchaseID);
    }
    if(this.registerObj.PurchaseID){
      this._PurchaseOrder.userFormGroup.get('PurchaseDate').setValue(this.registerObj.PurchaseDate);
    }else{
      this._PurchaseOrder.userFormGroup.get('PurchaseDate').setValue(new Date());
    }
    this.getGSTtypeList();
    this.getPaymentTermList();
    this.getModeOfPaymentList();
    this.gePharStoreList();
  }
  getPaymentTermList() {
    this._PurchaseOrder.getPaymentTermList().subscribe(data => {
      this.PaymentTermsList = data;
      if (this.data) {
        const toSelectConstantId = this.PaymentTermsList.find(c => c.ConstantId == this.registerObj.ConstantId);
        this._PurchaseOrder.FinalPurchaseform.get('PaymentTerm').setValue(toSelectConstantId);
      }
    });
  }
  getModeOfPaymentList() {
    this._PurchaseOrder.getModeOfPaymentList().subscribe(data => {
      this.ModeOfPaymentList = data;
      if (this.data) {
        const toSelectConstantId = this.ModeOfPaymentList.find(c => c.ConstantId == this.registerObj.ConstantId);
        this._PurchaseOrder.FinalPurchaseform.get('PaymentMode').setValue(toSelectConstantId);
      }
    });
  }
  getGSTtypeList() {
    var vdata = {
      'ConstanyType': 'GST_CALC_TYPE',
    }
    this._PurchaseOrder.getGSTtypeList(vdata).subscribe(data => {
      this.GSTTypeList = data;
      if (this.data) {
        const toSelectConstantId = this.GSTTypeList.find(c => c.ConstantId == this.registerObj.ConstantId);
        this._PurchaseOrder.userFormGroup.get('Status3').setValue(toSelectConstantId);
        this._PurchaseOrder.userFormGroup.get('Status3').setValue(this.GSTTypeList[0]);
      }
    });
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }
  gePharStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._PurchaseOrder.StoreFormGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  filteredOptionssupplier:any;
  noOptionFoundsupplier:any;
  vSupplierId:any;
  vsupplierName:any;
  getSupplierSearchCombo() {
    // if(this.vSupplierId){
    //   this.vsupplierName = this._PurchaseOrder.userFormGroup.get('SupplierId').value ;
    //  }
    //  else{ 
    //     this.vsupplierName = this.registerObj.SupplierName; 
    //  }
     if (this.vSupplierId) {
      this.vsupplierName = this._PurchaseOrder.userFormGroup.get('SupplierId').value ;
    }
    else if (this.data.chkNewGRN == 2) {
      let  EditSupplier = this._PurchaseOrder.userFormGroup.get('SupplierId').value;
      if(EditSupplier){
        this.vsupplierName = this._PurchaseOrder.userFormGroup.get('SupplierId').value;
      }else{
        this.vsupplierName = this.registerObj.SupplierName;
      }  
    }
    
   
    var m_data = {
      'SupplierName': `${this.vsupplierName}%`
    }
    this._PurchaseOrder.getSupplierSearchList(m_data).subscribe(data => {
      this.filteredOptionssupplier = data;
      if (this.filteredOptionssupplier.length == 0) {
        this.noOptionFoundsupplier = true;
      } else {
        this.noOptionFoundsupplier = false;
      }
      if (this.data.chkNewGRN == 2) { 
        const toSelectSUpplierId = this.filteredOptionssupplier.find(c => c.SupplierId == this.registerObj.SupplierID);
        this._PurchaseOrder.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
        this.vContact = toSelectSUpplierId.ContactPerson;
        this.vSupplierId =toSelectSUpplierId.SupplierName;
        this.SupplierID = toSelectSUpplierId.SupplierId;
        this.vAddress = toSelectSUpplierId.Address;
        this.vGSTNo = toSelectSUpplierId.GSTNo;
        this.vEmail = toSelectSUpplierId.Email;
        this.vMobile = toSelectSUpplierId.Mobile;
        this._PurchaseOrder.userFormGroup.get('SupplierId').setValue(this.filteredOptionssupplier[0]);
      }
    });
  }
  getSelectedSupplierObj(obj) {
   // this.SupplierID = obj.SupplierId;
    this.vAddress = obj.Address;
    this.vMobile = obj.Mobile;
    this.vContact = obj.ContactPerson;
    this.vGSTNo = obj.GSTNo;
    this.vEmail = obj.Email;
    this.getSupplierRate();
  }
  
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }

  calculateGSTType(event) {

    if (event.value.Name == "GST After Disc") {
      let totalamt = this.vTotalAmount - this._PurchaseOrder.userFormGroup.get('DiscAmount').value

      this.vGSTAmt = ((totalamt * parseFloat(this.vGSTPer)) / 100).toFixed(2);
      this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
      this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
    } else {
      this.vGSTAmt = ((this.vTotalAmount * parseFloat(this.vGSTPer)) / 100).toFixed(2);
      this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
      this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
    }
  }
  finalCalculation() {
    this.calculateTotalAmt();
    this.calculateDiscperAmount();
    this.calculateDiscperAmount();
    if (this.dsItemNameList.data.length > 0) {
      for (let i = 0; i < this.dsItemNameList.data.length; i++) {
        this.getCellCalculation(this.dsItemNameList.data[i], null);
      }
    }
    //this.calculateDiscAmount();
  }
 
  onAdd() {
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if ((this.vMRP == '' || this.vMRP == null || this.vMRP == undefined)) {
    //   this.toastr.warning('Please enter a MRP', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    if ((this.vRate == '' || this.vRate == null || this.vRate == undefined)) {
      this.toastr.warning('Please enter a Rate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = this.dsItemNameList.data.some(item => item.ItemId === this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemID);

    if (!isDuplicate) {
      this.dsItemNameList.data = []
      this.chargeslist.push(
        {
          ItemId: this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemID,
          ItemName: this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemName || '',
          Qty: this.vQty || 0,
          UOMID: this.vUOM || 0,
          Rate: this.vRate || 0,
          TotalAmount: this.vTotalAmount || 0,
          DiscPer: this.vDis || 0,
          DiscAmount: this.vDiscAmt || 0,
          CGSTPer: this.vCGSTPer || 0,
          CGSTAmt: this.vCGSTAmt || 0,
          SGSTPer: this.vSGSTPer || 0,
          SGSTAmt: this.vSGSTAmt || 0,
          IGSTPer: this.vIGSTPer || 0,
          IGSTAmt:  this.vIGSTAmt || 0,
          VatAmount: this.vGSTAmt || 0,
          VatPer: this.vGSTPer || 0,
          GSTAmount:this.vGSTAmt || 0,
          GrandTotalAmount:this.vNetAmount || 0,
          MRP: this.vMRP || 0,
          DefRate: this.vDefRate || 0,
          Specification: this.vSpecification || '',
        });
      this.dsItemNameList.data = this.chargeslist;
    }
    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.itemid.nativeElement.focus();
    this.add = false;
    this.ItemFormreset();
  }

  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsItemNameList.data = [];
      this.dsItemNameList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  getOldPurchaseOrder(el) {
    var Param = {
      "purchaseID": el,
    }
    this._PurchaseOrder.getPurchaseOrderDetail(Param).subscribe(data => {
      this.dsItemNameList.data = data as ItemNameList[];
      this.chargeslist = data as ItemNameList[];
      this.dsItemNameList.sort = this.sort;
      this.dsItemNameList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getPharItemList() {
    var m_data = {
      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
      "StoreId": this._PurchaseOrder.StoreFormGroup.get('StoreId').value.storeid
    }
    this._PurchaseOrder.getItemList(m_data).subscribe(data => {
      this.filteredOptions = data;
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });

  }
  vCGSTPer:any;
  vSGSTPer:any;
  vIGSTPer:any;
  vCGSTAmt:any; 
  vSGSTAmt:any;
  vIGSTAmt:any;
  getSelectedObj(obj) {
    console.log(obj)
    this.ItemId = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.vUOM = obj.UnitofMeasurementId;
    this.vConversionFactor = obj.ConversionFactor;
    this.vHSNcode = obj.HSNcode;
    this.vQty = '';
    this.vMRP = 0;
    this.vRate = '';
    this.vDis = '';
    this.vCGSTPer = obj.CGSTPer
    this.vSGSTPer = obj.SGSTPer
    this.vIGSTPer = obj.IGSTPer
    // this.vIGSTAmt = obj.CGSTPer
    this.vTotalAmount = (parseInt(this.vQty) * parseFloat(this.vRate)).toFixed(2);
    this.vNetAmount = this.vTotalAmount;
    //this.VatPercentage = obj.VatPercentage;
    this.vGSTPer = (obj.SGSTPer + obj.CGSTPer + obj.IGSTPer);
    // this.GSTAmount = 0;
    this.vSpecification = obj.Specification || '';
    this.getLastThreeItemInfo();
    this.qty.nativeElement.focus();
    this.getSupplierRate();
  }

  getLastThreeItemInfo() {
    var vdata = {
      'ItemId': this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemID || 0,
    }
    this._PurchaseOrder.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
    });
  }
  supplierRateList: any = [];
  getSupplierRate() {
    this.supplierRateList = [];
    let Query = "Select Isnull(SupplierRate,0) as SupplierRate from M_ItemWiseSupplierRate where ItemId= " + this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemID + " and SupplierId=" + this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId
    console.log(Query);
    this._PurchaseOrder.getSupplierRateList(Query).subscribe(data => {
      // console.log(data)
      this.supplierRateList = data
      let SupplierRate = 0;
      SupplierRate = this.supplierRateList[0].SupplierRate;
      this.vDefRate = SupplierRate;
      // console.log(this.vDefRate)
    });
  }
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  } 
  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'F4') {
      // Save functionality
      this.OnSavenew();
    } else if (event.key === 'F5') {
      // Edit functionality
      this.OnSaveEdit();
    }
  }
  OnSave() {
    this.vsaveflag=true
    if (!this.registerObj.PurchaseID) {
      this.OnSavenew();
    } else {
      this.OnSaveEdit()
    }
  }
  OnSaveEdit() {
    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._PurchaseOrder.FinalPurchaseform.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger
    let updatePurchaseOrderHeaderObj = {};
    updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date /// this.datePipe.transform(this._PurchaseOrder.userFormGroup.get('PurchaseDate').value, "yyyy-MM-dd");
    updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
    updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
    updatePurchaseOrderHeaderObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt || 0;
    updatePurchaseOrderHeaderObj['discAmount'] = (parseFloat(this.DiscAmount)).toFixed(2) || 0;
    updatePurchaseOrderHeaderObj['taxAmount'] = (parseFloat(this.GSTAmount)).toFixed(2) || 0;
    updatePurchaseOrderHeaderObj['freightAmount'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['octriAmount'] = this._PurchaseOrder.FinalPurchaseform.get('OctriAmount').value || 0;
    updatePurchaseOrderHeaderObj['grandTotal'] = this.FinalNetAmount;
    updatePurchaseOrderHeaderObj['isclosed'] = false;
    updatePurchaseOrderHeaderObj['isVerified'] = false;
    updatePurchaseOrderHeaderObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
    updatePurchaseOrderHeaderObj['taxID'] = 0;
    updatePurchaseOrderHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
    updatePurchaseOrderHeaderObj['paymentTermId'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentTerm').value.Id || 0;
    updatePurchaseOrderHeaderObj['modeofPayment'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentMode').value.Id || 0;
    updatePurchaseOrderHeaderObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Worrenty').value || 0;
    updatePurchaseOrderHeaderObj['roundVal'] = 0;
    updatePurchaseOrderHeaderObj['totCGSTAmt'] = (parseFloat(this.CGSTAmount)).toFixed(2) || 0;
    updatePurchaseOrderHeaderObj['totSGSTAmt'] = (parseFloat(this.SGSTAmount)).toFixed(2) || 0;
    updatePurchaseOrderHeaderObj['totIGSTAmt'] =(parseFloat(this.IGSTAmount)).toFixed(2) || 0;
    updatePurchaseOrderHeaderObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    updatePurchaseOrderHeaderObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    updatePurchaseOrderHeaderObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['purchaseId'] = this.registerObj.PurchaseID;
 
    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      debugger
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemId || 0;
      purchaseDetailInsertObj['uomId'] = element.UOMID || 0;
      purchaseDetailInsertObj['qty'] = element.Qty || 0;
      purchaseDetailInsertObj['rate'] = element.Rate || 0;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount || 0;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount || 0;
      purchaseDetailInsertObj['discPer'] =element.DiscPer || 0;
      purchaseDetailInsertObj['vatAmount'] = element.VatAmount || 0;
      purchaseDetailInsertObj['vatPer'] = element.VatPer || 0;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount || 0;
      purchaseDetailInsertObj['mrp'] = element.MRP || 0;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = element.CGSTPer || 0;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt || 0;
      purchaseDetailInsertObj['sgstPer'] = element.SGSTPer || 0;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt || 0;
      purchaseDetailInsertObj['igstPer'] = element.IGSTPer || 0;
      purchaseDetailInsertObj['igstAmt'] = element.IGSTAmt || 0;
      purchaseDetailInsertObj['DefRate'] = element.DefRate || 0;
      purchaseDetailInsertObj['VendDisPer'] = 0;
      purchaseDetailInsertObj['VendDiscAmt'] = 0;

      InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
    });

    let delete_PurchaseDetailsObj = {};
    delete_PurchaseDetailsObj['purchaseID'] = this.registerObj.PurchaseID;

    let submitData = {
      "updatePurchaseOrderHeader": updatePurchaseOrderHeaderObj,
      "delete_PurchaseDetails": delete_PurchaseDetailsObj,
      "purchaseDetailInsert": InsertpurchaseDetailObj,
    };
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseUpdate(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this._matDialog.closeAll();
        this.OnReset()
        this.viewgetPurchaseorderReportPdf(response);
      } else {
        this.toastr.error('New Purchase  Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New Purchase Order Data not Updated !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }

  OnSavenew() {
    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._PurchaseOrder.FinalPurchaseform.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger
    let purchaseHeaderInsertObj = {};
    purchaseHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date// this.datePipe.transform(this._PurchaseOrder.userFormGroup.get('PurchaseDate').value, "yyyy-MM-dd");
    purchaseHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
    purchaseHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
    purchaseHeaderInsertObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    purchaseHeaderInsertObj['totalAmount'] = this.FinalTotalAmt || 0;
    purchaseHeaderInsertObj['discAmount'] = this.DiscAmount || 0;
    purchaseHeaderInsertObj['taxAmount'] = (parseFloat(this.GSTAmount)).toFixed(2) || 0;
    purchaseHeaderInsertObj['freightAmount'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['octriAmount'] = this._PurchaseOrder.FinalPurchaseform.get('OctriAmount').value || 0;
    purchaseHeaderInsertObj['grandTotal'] = this.FinalNetAmount || 0;
    purchaseHeaderInsertObj['isclosed'] = false;
    purchaseHeaderInsertObj['isVerified'] = false;
    purchaseHeaderInsertObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
    purchaseHeaderInsertObj['taxID'] = 0;
    purchaseHeaderInsertObj['addedBy'] = this.accountService.currentUserValue.user.id || 0;
      purchaseHeaderInsertObj['updatedBy'] = this.accountService.currentUserValue.user.id || 0;
      purchaseHeaderInsertObj['paymentTermId'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentTerm').value.Id || 0;
    purchaseHeaderInsertObj['modeofPayment'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentMode').value.Id || 0;
    purchaseHeaderInsertObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Worrenty').value || 0;
    purchaseHeaderInsertObj['roundVal'] = 0;
    purchaseHeaderInsertObj['totCGSTAmt'] = (parseFloat(this.CGSTAmount)).toFixed(2) || 0;
    purchaseHeaderInsertObj['totSGSTAmt'] = (parseFloat(this.SGSTAmount)).toFixed(2) || 0;
    purchaseHeaderInsertObj['totIGSTAmt'] =(parseFloat(this.IGSTAmount)).toFixed(2) || 0;
    purchaseHeaderInsertObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    purchaseHeaderInsertObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    purchaseHeaderInsertObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['purchaseId'] = 0;

    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      debugger
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemId || 0;
      purchaseDetailInsertObj['uomId'] = element.UOMID || 0;
      purchaseDetailInsertObj['qty'] = element.Qty || 0;
      purchaseDetailInsertObj['rate'] = element.Rate || 0;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount || 0;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount || 0;
      purchaseDetailInsertObj['discPer'] = element.DiscPer || 0;
      purchaseDetailInsertObj['vatAmount'] = element.VatAmount || 0;
      purchaseDetailInsertObj['vatPer'] = element.VatPer || 0;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount || 0;
      purchaseDetailInsertObj['mrp'] = element.MRP || 0;
      purchaseDetailInsertObj['specification'] = element.Specification || 0;
      purchaseDetailInsertObj['cgstPer'] = element.CGSTPer || 0;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt || 0;
      purchaseDetailInsertObj['sgstPer'] = element.SGSTPer || 0;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt || 0;
      purchaseDetailInsertObj['igstPer'] =element.IGSTPer || 0;
      purchaseDetailInsertObj['igstAmt'] = element.IGSTAmt || 0;
      purchaseDetailInsertObj['DefRate'] = element.DefRate || 0;
      purchaseDetailInsertObj['VendDisPer'] = 0;
      purchaseDetailInsertObj['VendDiscAmt'] = 0;
      InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
    });

    let submitData = {
      "purchaseHeaderInsert": purchaseHeaderInsertObj,
      "purchaseDetailInsert": InsertpurchaseDetailObj,
    };
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseSave(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });

        this._matDialog.closeAll();
        this.OnReset()
        this.viewgetPurchaseorderReportPdf(response);
      } else {
        this.toastr.error('New Purchase  Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New Purchase Order Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  IgstPercentage:any = 0;
  CgstPercentage:any = 0;
  SgstPercentage:any = 0;
  getCellCalculation(contact, Qty) {
debugger
    if(contact.DefRate > 0){
      if (contact.Rate > contact.DefRate) {
        Swal.fire("Please Check defined Supplier Rate for product ...!!!");
      }   
    }
    if(contact.SGSTPer == "" || contact.SGSTPer == null || contact.SGSTPer == undefined){
      contact.SGSTAmt = 0;
      //contact.SGSTPer = this.SgstPercentage 
    }
    if(contact.CGSTPer == "" || contact.CGSTPer == null || contact.CGSTPer == undefined){
      contact.CGSTAmt = 0;
      //contact.CGSTPer = this.CgstPercentage 
    }
    if(contact.IGSTPer == "" || contact.IGSTPer == null || contact.IGSTPer == undefined){
      contact.IGSTAmt = 0;
      //contact.IGSTPer = this.IgstPercentage 
    }
   
    if (contact.Qty > 0 && contact.Rate > 0) {
     
      this.IgstPercentage =  contact.IGSTPer;
      this.CgstPercentage = contact.CGSTPer;
      this.SgstPercentage = contact.SGSTPer;
      if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //disc
        contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
        let TotalAmt: any=0;
        TotalAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);
        //Gst
        contact.VatPer = (parseFloat(this.CgstPercentage ) + parseFloat(this.SgstPercentage) + parseFloat(this.IgstPercentage)).toFixed(2);
        contact.CGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.CgstPercentage)) / 100).toFixed(2);
        contact.SGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.SgstPercentage)) / 100).toFixed(2);
        contact.IGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.IgstPercentage)) / 100).toFixed(2);
        contact.VatAmount = ((parseFloat(TotalAmt) * parseFloat(contact.VatPer)) / 100).toFixed(2);
        contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount)).toFixed(2);
      }
      else if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST Before Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //Gst
        contact.VatPer = (parseFloat(this.CgstPercentage ) + parseFloat(this.SgstPercentage) + parseFloat(this.IgstPercentage)).toFixed(2);
        contact.CGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.CgstPercentage)) / 100).toFixed(2);
        contact.SGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.SgstPercentage)) / 100).toFixed(2);
        contact.IGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.IgstPercentage)) / 100).toFixed(2);
        contact.VatAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VatPer)) / 100).toFixed(2);
        let totalAmt:any=0
        totalAmt = (parseFloat(contact.TotalAmount) + parseFloat(contact.VatAmount)).toFixed(2);
        //disc
        contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
        contact.GrandTotalAmount = (parseFloat(totalAmt) - parseFloat(contact.DiscAmount)).toFixed(2);
      }
      
    }
    else {
      contact.TotalAmount = 0;
      contact.DiscAmount = 0;
      contact.CGSTAmt = 0;
      contact.SGSTAmt = 0;
      contact.IGSTAmt = 0;
      contact.VatAmount = 0;
      contact.GrandTotalAmount = 0;
    }
  
  }
  OnchekPurchaserateValidation() {
    if (this.vRate) {
      // if (parseFloat(this.vRate) <= parseFloat(this.vMRP)) {
      //   this.calculateTotalAmt();
      // } else {
      //   this.toastr.warning('Enter Purchase Rate lessthan MRP', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   });
      //   this.vRate=this.vMRP;
      // }
      this.calculateTotalAmt();
    }
    else if(this.vDefRate){
       if (parseFloat(this.vRate) > parseFloat(this.vDefRate)) {
        Swal.fire("Please Check defined Supplier Rate for product ...!!!"); 
        this.calculateTotalAmt();
      } 
      // if (this.vDefRate == '' || this.vDefRate == 0) {
      //   this.toastr.warning('Defined rate is not defined for this Item.', 'Warning !', {
      //     toastClass: 'tostr-tost custom-toast-warning',
      //   }); 
      // } else {
      //   if (parseFloat(this.vRate) > parseFloat(this.vDefRate)) {
      //     Swal.fire("Please Check defined Supplier Rate for product ...!!!");
      //   }
      // }
    }
   
  }

  calculateTotalAmt() {
    let Qty = this._PurchaseOrder.userFormGroup.get('Qty').value
    if (Qty > 0 && this.vRate > 0) {
      if (Qty && this.vRate) {
        this.vTotalAmount = ((this.vRate) * (this.vQty)).toFixed(2);
        this.vNetAmount = this.vTotalAmount;
        //Dicount calculation
        this.vDiscAmt = ((this.vTotalAmount * this.vDis) / 100).toFixed(2);
        let totalamt = this.vTotalAmount - this._PurchaseOrder.userFormGroup.get('DiscAmount').value;
        //GST Calculation 
      }
    } else {
      this._PurchaseOrder.userFormGroup.get('TotalAmount').setValue(0);
      this._PurchaseOrder.userFormGroup.get('DiscAmount').setValue(0);
      this._PurchaseOrder.userFormGroup.get('GSTAmount').setValue(0);
      this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(0);
    }
    this.calculateGSTperAmount();
  }
  calculateDiscperAmount() {
    let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
    if (disc >= 100) {
      // Swal.fire("Enter Discount less than 100");
      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this._PurchaseOrder.userFormGroup.get('Dis').setValue(0);
    }
    if (disc) {
      let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
      this.vNetAmount = ((this.vTotalAmount) - (this._PurchaseOrder.userFormGroup.get('DiscAmount').value)).toFixed(2);
      if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == "GST After Disc") {

        this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
        let totalamt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(2);

        this.vSGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
        this.vCGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
        this.vIGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vIGSTPer)) / 100).toFixed(2);


        this.vGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vGSTPer)) / 100).toFixed(2);

        this.vNetAmount = (parseFloat(totalamt) + parseFloat(this.vGSTAmt)).toFixed(2);

      } else {
        this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
        this.vSGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
        this.vCGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
        this.vIGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vIGSTPer)) / 100).toFixed(2);
        this.vGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vGSTPer)) / 100).toFixed(2);
        let totalamt = (parseFloat(this.vTotalAmount) + (parseFloat(this.vGSTAmt))).toFixed(2);

        this.vNetAmount = ((parseFloat(totalamt)) - parseFloat(this.vDiscAmt)).toFixed(2);
      }
    }
  }

  calculateGSTperAmount() {
    if (this.vGSTPer) {
      if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == "GST After Disc") {
        let totalamt = this.vTotalAmount - this._PurchaseOrder.userFormGroup.get('DiscAmount').value

        this.vSGSTAmt = ((totalamt * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
        this.vCGSTAmt = ((totalamt * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
        this.vIGSTAmt = ((totalamt * parseFloat(this.vIGSTPer)) / 100).toFixed(2);

        this.vGSTAmt = ((totalamt * parseFloat(this.vGSTPer)) / 100).toFixed(2);
        this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
        this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
      } else {
        this.vSGSTAmt = ((this.vTotalAmount * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
        this.vCGSTAmt = ((this.vTotalAmount * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
        this.vIGSTAmt = ((this.vTotalAmount * parseFloat(this.vIGSTPer)) / 100).toFixed(2);

        this.vGSTAmt = ((this.vTotalAmount * parseFloat(this.vGSTPer)) / 100).toFixed(2);
        this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
        this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
      }
    }
  }

  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, {GrandTotalAmount}) => sum += +(GrandTotalAmount), 0);

    let handlingCharges = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(handlingCharges)).toFixed(2);

    let transportChanges = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(transportChanges)).toFixed(2);

    let Freight = this._PurchaseOrder.FinalPurchaseform.get('Freight').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(Freight)).toFixed(2);

    let OctriAmt = this._PurchaseOrder.FinalPurchaseform.get('OctriAmount').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(OctriAmt)).toFixed(2);

    return this.FinalNetAmount;
  }

  getTotalGST(element) {
    this.GSTAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
   // console.log(this.GSTAmount)
    this.CGSTAmount = (element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0)).toFixed(2);
    this.SGSTAmount = (element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0)).toFixed(2);
    this.IGSTAmount = (element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0)).toFixed(2);
    return this.GSTAmount;

  }
 
  getTotalDisc(element) {
    this.DiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0).toFixed(2);
   //console.log(this.DiscAmount)
    return this.DiscAmount;
  }

  getTotalAmt(element) {
    this.FinalTotalAmt = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    return this.FinalTotalAmt;
  }
  highlight(contact) {
    this.selectedRowIndex = contact.ItemID;
  }

  OnReset() {
    this._PurchaseOrder.userFormGroup.reset();
    this._PurchaseOrder.FinalPurchaseform.reset();
    this.dsItemNameList.data = [];
    this.ItemFormreset();
    this._matDialog.closeAll();
  }

  ItemFormreset() {
    this.vItemNames = "";
    this.ItemID = 0;
    this.vQty = 0;
    this.vUOM = 0;
    this.vRate = 0;
    this.vTotalAmount = 0;
    this.vDis = 0;
    this.vDiscAmt = 0;
    this.vGSTPer = 0;
    this.vGSTAmt = 0;
    this.vCGSTPer = 0;
    this.vCGSTAmt = 0;
    this.vSGSTPer = 0;
    this.vSGSTAmt = 0;
    this.vIGSTPer = 0;
    this.vIGSTAmt = 0;
    this.vNetAmount = 0;
    this.vMRP = 0;
    this.vConversionFactor = 0;
    this.vHSNcode = 0;
    this.vDefRate = 0;
    this.vSpecification = "";
  }
  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }



  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';
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

  @ViewChild('SupplierId') SupplierId: MatSelect;
  @ViewChild('gsttype') gsttype: ElementRef;
  @ViewChild('Freight1') Freight1: ElementRef;
  @ViewChild('DeliveryDate1') DeliveryDate1: ElementRef;
  @ViewChild('PaymentMode') PaymentMode: MatSelect;
  @ViewChild('Status3') Status3: MatSelect;
  @ViewChild('PaymentTerm') PaymentTerm: MatSelect;
  @ViewChild('TaxNature1') TaxNature1: MatSelect;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('uom') uom: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('totalamt') totalamt: ElementRef;
  @ViewChild('dis') dis: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('mrp') mrp: ElementRef;
  @ViewChild('specification') specification: ElementRef;
  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  @ViewChild('Schedule') Schedule: MatSelect;
  @ViewChild('Remark') Remark: ElementRef;
  @ViewChild('Worrenty') Worrenty: ElementRef;
  @ViewChild('roundVal') roundVal: ElementRef;
  @ViewChild('OctriAmount') OctriAmount: ElementRef;
  @ViewChild('TransportCharges') TransportCharges: ElementRef;
  @ViewChild('HandlingCharges') HandlingCharges: ElementRef;
  @ViewChild('ConversionFactor') ConversionFactor: ElementRef;
  @ViewChild('HSNcode') HSNcode: ElementRef;
  @ViewChild('PurchaseDate') PurchaseDate: ElementRef;

  public onEnterSupplier(event): void {
    if (event.which === 13) {
      this.PurchaseDate.nativeElement.focus();
    }
  }
  public onEnterGSTType(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }

  public onEnterItemName(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }
  public onEnterQty(event): void {
    if (event.which === 13) {
      this.mrp.nativeElement.focus();
      //this.add = false;
    }
  }
  public onEnterMRP(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
      //this.add = false;
    }
  }
  public onEnterRate(event): void {
    if (event.which === 13) {
      this.dis.nativeElement.focus();
      // this.add = false;
      this.vDis.setValue('');
    }
  }
  public onEnterTotal(event): void {
    if (event.which === 13) {
      this.dis.nativeElement.focus();
      // this.add = false;
    }
  }
  public onEnterDis(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
      // this.add = false;
    }
  }
  public onEnterGST(event): void {
    if (event.which === 13) {
      this.specification.nativeElement.focus();
      //this.add = false;
    }
  }

  public onEnterSpecification(event): void {
    if (event.which === 13) {
      //this.add = false;
    }
  }

  public onEnterPaymentTerm(event): void {
    if (event.which === 13) {
      if (this.PaymentMode) this.PaymentMode.focus();
    }
  }
  public onEnterPaymentMode(event): void {
    if (event.which === 13) {
      this.Remark.nativeElement.focus();
    }
  }
  public onEnterRemark(event): void {
    if (event.which === 13) {
      this.HandlingCharges.nativeElement.focus();
    }
  }
  public onEnterHandlingcharge(event): void {
    if (event.which === 13) {
      this.TransportCharges.nativeElement.focus();
    }
  }
  public onEnterTransportcharge(event): void {
    if (event.which === 13) {
      this.Freight1.nativeElement.focus();
    }
  }
  public onEnterFreight(event): void {
    if (event.which === 13) {
      this.OctriAmount.nativeElement.focus();
    }
  }

  public onEnterOctriAmount(event): void {
    if (event.which === 13) {
      this.Worrenty.nativeElement.focus();
    }
  }
  public onEnterWorrenty(event): void {
    if (event.which === 13) {
      this.OctriAmount.nativeElement.focus();
    }

    if(this.dsItemNameList.data.length > 0){
      this.vsaveflag=false
    }
  }


  viewgetPurchaseorderReportPdf(PurchaseID) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      
   this._PurchaseOrder.getPurchaseorderreportview(
    PurchaseID
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
  onEdit(contact) {
    const dialogRef = this._matDialog.open(UpdatePurchaseorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          PurchaseObj: contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  onClose() {
    this.dialogRef.close();
  }
  onClear() { }
}

function elseif(GST: any) {
  throw new Error('Function not implemented.');
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

