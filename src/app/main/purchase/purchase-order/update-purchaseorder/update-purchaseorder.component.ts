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

@Component({
  selector: 'app-update-purchaseorder',
  templateUrl: './update-purchaseorder.component.html',
  styleUrls: ['./update-purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatePurchaseorderComponent implements OnInit {

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
  grandTotalAmount: any = 0.0;
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
  DiscAmount: any = 0;
  GSTAmount: any = 0;
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
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    private snackBarService: SnackBarService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UpdatePurchaseorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if (this.data.chkNewGRN == 2) {
      this.registerObj = this.data.Obj;
      this.getOldPurchaseOrder(this.registerObj.PurchaseID);
    }
    this.getGSTtypeList();
    this.getPaymentTermList();
    this.getSupplierSearchCombo();
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

  getSupplierSearchCombo() {
    this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      // console.log(data);
      this.optionsMarital = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._PurchaseOrder.userFormGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
      if (this.data) {
        const toSelectSUpplierId = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierID);
        this._PurchaseOrder.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
        this.vAddress = toSelectSUpplierId.Address;
        this.vMobile = toSelectSUpplierId.Mobile;
        this.vContact = toSelectSUpplierId.ContactPerson;
        this.vGSTNo = toSelectSUpplierId.GSTNo;
        this.vEmail = toSelectSUpplierId.Email;
      }
    });

  }
  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsMarital.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }
  getSelectedSupplierObj(obj) {
    this.SupplierID = obj.SupplierId;
    this.vAddress = obj.Address;
    this.vMobile = obj.Mobile;
    this.vContact = obj.ContactPerson;
    this.vGSTNo = obj.GSTNo;
    this.vEmail = obj.Email;
    this.getSupplierRate();
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
  onAdd() {
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vMRP == '' || this.vMRP == null || this.vMRP == undefined)) {
      this.toastr.warning('Please enter a MRP', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
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
          CGSTPer: ((this.vGSTPer) / 2) || 0,
          CGSTAmt: ((this.vGSTAmt) / 2) || 0,
          SGSTPer: ((this.vGSTPer) / 2) || 0,
          SGSTAmt: ((this.vGSTAmt) / 2) || 0,
          VatAmount: this.vGSTAmt || 0,
          VatPer: this.vGSTPer || 0,
          GSTAmount: this.vGSTAmt || 0,
          GrandTotalAmount: this.vNetAmount || 0,
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
  getSelectedObj(obj) {
    this.ItemId = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.vUOM = obj.UnitofMeasurementId;
    this.vConversionFactor = obj.ConversionFactor;
    this.vHSNcode = obj.HSNcode;
    this.vQty = '';
    this.vMRP = '';
    this.vRate = '';
    this.vDis = '';
    this.vTotalAmount = (parseInt(this.vQty) * parseFloat(this.vRate)).toFixed(2);
    this.vNetAmount = this.vTotalAmount;
    //this.VatPercentage = obj.VatPercentage;
    this.vGSTPer = (obj.SGSTPer + obj.CGSTPer);
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
    let updatePurchaseOrderHeaderObj = {};
    updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date;
    updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
    updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    updatePurchaseOrderHeaderObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt;
    updatePurchaseOrderHeaderObj['discAmount'] = this.DiscAmount;
    updatePurchaseOrderHeaderObj['taxAmount'] = (parseInt(this.GSTAmount)).toFixed(2);
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
    updatePurchaseOrderHeaderObj['totCGSTAmt'] = (parseInt(this.GSTAmount) / 2).toFixed(2);
    updatePurchaseOrderHeaderObj['totSGSTAmt'] = (parseInt(this.GSTAmount) / 2).toFixed(2);
    updatePurchaseOrderHeaderObj['totIGSTAmt'] = 0;
    updatePurchaseOrderHeaderObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    updatePurchaseOrderHeaderObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    updatePurchaseOrderHeaderObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['purchaseId'] = this.registerObj.PurchaseID;

    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemId;
      purchaseDetailInsertObj['uomId'] = element.UOMID;
      purchaseDetailInsertObj['qty'] = element.Qty || 0;
      purchaseDetailInsertObj['rate'] = element.Rate || 0;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.VatAmount;
      purchaseDetailInsertObj['vatPer'] = element.VatPer;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = element.CGSTPer;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt;
      purchaseDetailInsertObj['sgstPer'] = element.SGSTPer;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt;
      purchaseDetailInsertObj['igstPer'] = 0;
      purchaseDetailInsertObj['igstAmt'] = 0;
      purchaseDetailInsertObj['DefRate'] = element.DefRate;
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
    //console.log(submitData);
    this._PurchaseOrder.InsertPurchaseUpdate(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this._matDialog.closeAll();
        this.OnReset()
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
    let purchaseHeaderInsertObj = {};
    purchaseHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date;
    purchaseHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
    purchaseHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    purchaseHeaderInsertObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    purchaseHeaderInsertObj['totalAmount'] = this.FinalTotalAmt;
    purchaseHeaderInsertObj['discAmount'] = this.DiscAmount;
    purchaseHeaderInsertObj['taxAmount'] = (parseInt(this.GSTAmount)).toFixed(2);
    purchaseHeaderInsertObj['freightAmount'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['octriAmount'] = this._PurchaseOrder.FinalPurchaseform.get('OctriAmount').value || 0;
    purchaseHeaderInsertObj['grandTotal'] = this.FinalNetAmount;
    purchaseHeaderInsertObj['isclosed'] = false;
    purchaseHeaderInsertObj['isVerified'] = false;
    purchaseHeaderInsertObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
    purchaseHeaderInsertObj['taxID'] = 0;
    purchaseHeaderInsertObj['addedBy'] = this.accountService.currentUserValue.user.id,
      purchaseHeaderInsertObj['updatedBy'] = this.accountService.currentUserValue.user.id,
      purchaseHeaderInsertObj['paymentTermId'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentTerm').value.Id || 0;
    purchaseHeaderInsertObj['modeofPayment'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentMode').value.Id || 0;
    purchaseHeaderInsertObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Worrenty').value || 0;
    purchaseHeaderInsertObj['roundVal'] = 0;
    purchaseHeaderInsertObj['totCGSTAmt'] = (parseInt(this.GSTAmount) / 2).toFixed(2);;
    purchaseHeaderInsertObj['totSGSTAmt'] = (parseInt(this.GSTAmount) / 2).toFixed(2);;
    purchaseHeaderInsertObj['totIGSTAmt'] = 0;
    purchaseHeaderInsertObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    purchaseHeaderInsertObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    purchaseHeaderInsertObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['purchaseId'] = 0;

    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemId;
      purchaseDetailInsertObj['uomId'] = element.UOMID;
      purchaseDetailInsertObj['qty'] = element.Qty || 0;
      purchaseDetailInsertObj['rate'] = element.Rate || 0;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.VatAmount;
      purchaseDetailInsertObj['vatPer'] = element.VatPer;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = element.CGSTPer;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt;
      purchaseDetailInsertObj['sgstPer'] = element.SGSTPer;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt;
      purchaseDetailInsertObj['igstPer'] = 0;
      purchaseDetailInsertObj['igstAmt'] = 0;
      purchaseDetailInsertObj['DefRate'] = element.DefRate;
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
  editedFinalQty: any = 0;
  editedFinalRate: any = 0;
  onQtyEdit(event: any, contact: ItemNameList) {
    const editedQty = parseFloat(event.target.textContent) || 0;
    this.editedFinalQty = editedQty;
    contact.Qty = editedQty;

    if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);
      let TotalAmt = ((contact.TotalAmount) - (contact.DiscAmount));
      //Gst
      //Gst
      contact.CGSTAmt = (((TotalAmt) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((TotalAmt) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((TotalAmt) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((TotalAmt) * (contact.VatPer)) / 100);

      contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount));
    } else {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //Gst
      contact.CGSTAmt = (((contact.TotalAmount) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((contact.TotalAmount) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((contact.TotalAmount) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((contact.TotalAmount) * (contact.VatPer)) / 100);

      let totalAmt = ((contact.TotalAmount) + (contact.VatAmount));
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);

      contact.GrandTotalAmount = ((totalAmt) - (contact.DiscAmount));
    }
  }
  onRateEdit(event: any, contact: ItemNameList) {
    const editedRate = parseFloat(event.target.textContent) || 0;
    this.editedFinalRate = editedRate;
    contact.Rate = editedRate;

    if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);
      let TotalAmt = ((contact.TotalAmount) - (contact.DiscAmount));
      //Gst
      //Gst
      contact.CGSTAmt = (((TotalAmt) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((TotalAmt) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((TotalAmt) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((TotalAmt) * (contact.VatPer)) / 100);

      contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount));
    } else {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //Gst
      contact.CGSTAmt = (((contact.TotalAmount) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((contact.TotalAmount) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((contact.TotalAmount) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((contact.TotalAmount) * (contact.VatPer)) / 100);

      let totalAmt = ((contact.TotalAmount) + (contact.VatAmount));
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);

      contact.GrandTotalAmount = ((totalAmt) - (contact.DiscAmount));
    }
  }
  getCellCalculation(contact, Qty) {

    if (contact.Rate > contact.DefRate) {
      Swal.fire("Please Check defined Supplier Rate for product ...!!!");
    }

    if (contact.Qty > 0 && contact.Rate > 0) {
      contact.IGSTPer = 0;
      if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //disc
        contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);
        let TotalAmt = ((contact.TotalAmount) - (contact.DiscAmount));
        //Gst
        contact.VatPer = ((contact.CGSTPer) + (contact.SGSTPer) + (contact.IGSTPer))
        contact.CGSTAmt = (((TotalAmt) * (contact.CGSTPer)) / 100);
        contact.SGSTAmt = (((TotalAmt) * (contact.SGSTPer)) / 100);
        contact.IGSTAmt = (((TotalAmt) * (contact.IGSTPer)) / 100);
        contact.VatAmount = (((TotalAmt) * (contact.VatPer)) / 100);
        contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount));
      }
      else if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST Before Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //Gst
        contact.VatPer = ((contact.CGSTPer) + (contact.SGSTPer) + (contact.IGSTPer))
        contact.CGSTAmt = (((contact.TotalAmount) * (contact.CGSTPer)) / 100);
        contact.SGSTAmt = (((contact.TotalAmount) * (contact.SGSTPer)) / 100);
        contact.IGSTAmt = (((contact.TotalAmount) * (contact.IGSTPer)) / 100);
        contact.VatAmount = (((contact.TotalAmount) * (contact.VatPer)) / 100);
        let totalAmt = ((contact.TotalAmount) + (contact.VatAmount));
        //disc
        contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);
        contact.GrandTotalAmount = ((totalAmt) - (contact.DiscAmount));
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
      if (this.vRate <= this.vMRP) {
        this.calculateTotalAmt();
      } else {
        this.toastr.warning('Enter Purchase Rate lessthan MRP', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        this.vRate=this.vMRP;
      }
    }
    if (this.vDefRate == '' || this.vDefRate !== 0) {
      if (this.vRate > this.vDefRate) {
        Swal.fire("Please Check defined Supplier Rate for product ...!!!");
      }
    } else {
      this.toastr.warning('Defined rate is not defined for this Item.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
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
        let totalamt = (parseFloat(this.vTotalAmount) - parseInt(this.vDiscAmt)).toFixed(2);

        this.vGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vGSTPer)) / 100).toFixed(2);

        this.vNetAmount = (parseFloat(totalamt) + parseFloat(this.vGSTAmt)).toFixed(2);

      } else {
        this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
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
        this.vGSTAmt = ((totalamt * parseFloat(this.vGSTPer)) / 100).toFixed(2);
        this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
        this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
      } else {
        this.vGSTAmt = ((this.vTotalAmount * parseFloat(this.vGSTPer)) / 100).toFixed(2);
        this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
        this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
      }
    }
  }

  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, { GrandTotalAmount }) => sum += +(GrandTotalAmount || 0), 0);

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
    this.GSTAmount = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
    return this.GSTAmount;
    this.CGSTAmount = (element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0)).toFixed(2);
    this.SGSTAmount = (element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0)).toFixed(2);
    this.IGSTAmount = (element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0)).toFixed(2);
  }

  getTotalDisc(element) {
    this.DiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0);
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

  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
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

  public onEnterSupplier(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
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

