import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PurchaseOrderService } from '../purchase-order.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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

import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { invalid } from 'moment';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ItemNameList, PurchaseItemList } from '../purchase-order.component';
import { PurchaseModule } from '../../purchase.module';
import { GRNFinalFormModel, GRNItemResponseType, GSTType, ToastType } from '../../good-receiptnote/new-grn/types';
import { SupplierMaster } from 'app/main/setup/inventory/supplier-master/supplier-master.component';
import { PurchaseFormModel } from './types';

@Component({
  selector: 'app-update-purchaseorder',
  templateUrl: './update-purchaseorder.component.html',
  styleUrls: ['./update-purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatePurchaseorderComponent implements OnInit {
  userFormGroup: FormGroup;
  FinalPurchaseform: FormGroup;
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  autocompleteModeGSTType: string = "GstCalcType";
  autocompletepaymentterm: string = "TermofPayment";
  autocompletepaymentmode: string = "PaymentMode";


  vsaveflag: boolean = true;
  displayedColumns2 = [
    // 'ItemID',
    'ItemName',
   
    'Qty',
    'UOM',
    // 'MRP',
    'Rate',
    'DefRate',
    'TotalAmount',
    'DiscPer',
    'DiscAmount',
    'CGST',
    'CGSTAmount',
    'SGST',
    'SGSTAmount',
    'IGST',
    'IGSTAmount',
    // 'GST',
    'GSTAmount',
    'NetAmount',
    'Specification',
    'Action',
  ];
  displayedColumns3 = [

    'supplierName',
    'receiveQty',
    'freeQty',
    'mrp',
    'rate',
    // 'discpercentage',
    // 'DiscAmount',
    'vatPercentage'
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
  SupplierObj = new SupplierMaster({});
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


  vDisc: any = 0;
  vDisc2: any = 0;
  vDisAmount: any = 0;
  vDisAmount2: any;
  vCGST: any;
  vCGSTAmount: any;
  vSGST: any;
  vSGSTAmount: any;
  vIGST: any = 0;
  vIGSTAmount: any = 0;
  vGST: any = 0;
  vGSTAmount: any = 0;
  FinalLandedrate: any;
  FinalpurUnitRate: any;
  FinalpurUnitrateWF: any;
  FinalUnitMRP: any;
  FinalTotalQty: any;
  vPurchaseId: any;
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
    this.userFormGroup = this._PurchaseOrder.getPurchaseOrderForm();
    this.FinalPurchaseform = this._PurchaseOrder.getPurchaseOrderFinalForm()
    if (this.data.chkNewGRN == 2) {
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)

      this.getOldPurchaseOrder(this.registerObj.purchaseID);
    }
    if (this.registerObj.PurchaseID) {
      this.userFormGroup.get('PurchaseDate').setValue(this.registerObj.PurchaseDate);
    } else {
      this.userFormGroup.get('PurchaseDate').setValue(new Date());
    }

  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

  vSupplierId: any;
  vsupplierName: any;
  getSelectedSupplierObj(obj) {
    // this.SupplierID = obj.SupplierId;

    console.log(obj)
    setTimeout(() => {
      this._PurchaseOrder.getSupplierById(obj.value).subscribe((response) => {
        this.SupplierObj = response;

        this.vAddress = this.SupplierObj.address;
        this.vMobile = this.SupplierObj.mobile;
        this.vContact = this.SupplierObj.contactPerson;
        this.vGSTNo = this.SupplierObj.gstNo;
        this.vEmail = this.SupplierObj.email;
        this.getSupplierRate();

      });

    }, 500);


  }


  // finalCalculation() {

  //   this.calculateTotalAmt();
  //   this.calculateDiscperAmount();
  //   // this.calculateDiscperAmount();
  //   if (this.dsItemNameList.data.length > 0) {
  //     for (let i = 0; i < this.dsItemNameList.data.length; i++) {
  //       this.getCellCalculation(this.dsItemNameList.data[i], null);
  //     }
  //   }
  //   //this.calculateDiscAmount();
  // }

  onAdd() {

    debugger
    if ((this.userFormGroup.get("Qty").value == 0 || this.userFormGroup.get("Qty").value == "")) {
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
    if ((this.userFormGroup.get("Rate").value == 0 || this.userFormGroup.get("Rate").value == "")) {
      this.toastr.warning('Please enter a Rate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = 0// this.dsItemNameList.data.some(item => item.ItemId === this.userFormGroup.get('ItemName').value.itemId);

    if (!isDuplicate) {
      // this.dsItemNameList.data = []
      // this.chargeslist.push(
      //   {
      //     ItemId: this.userFormGroup.get('ItemName').value.itemId,
      //     ItemName: this.userFormGroup.get('ItemName').value.itemName || '',
      //     Qty: this.userFormGroup.get("Qty").value ,//this.vQty || 0,
      //     UOMID: this.vUOM || 0,
      //     Rate:this.userFormGroup.get("Rate").value,// this.vRate || 0,
      //     TotalAmount: this.vTotalAmount || 0,
      //     DiscPer: this.vDis || 0,
      //     DiscAmount: this.vDiscAmt || 0,
      //     CGSTPer: this.vCGSTPer || 0,
      //     CGSTAmt: this.vCGSTAmt || 0,
      //     SGSTPer: this.vSGSTPer || 0,
      //     SGSTAmt: this.vSGSTAmt || 0,
      //     IGSTPer: this.vIGSTPer || 0,
      //     IGSTAmt:  this.vIGSTAmt || 0,
      //     VatAmount: this.vGSTAmt || 0,
      //     VatPer: this.vGSTPer || 0,
      //     GSTAmount:this.vGSTAmt || 0,
      //     GrandTotalAmount:this.vNetAmount || 0,
      //     MRP: this.vMRP || 0,
      //     DefRate: this.vDefRate || 0,
      //     Specification: this.vSpecification || '',
      //   });
      // this.dsItemNameList.data = this.chargeslist;
      const formValues = this.userFormGroup.getRawValue() as PurchaseFormModel;
      console.log(formValues)
      if (formValues.ItemName) {
        const newItem = new ItemNameList({
          ...formValues,
          ItemName: formValues.ItemName.itemName,
          // TotalQty: formValues.Qty,
          ItemId: formValues.ItemName.itemId,
          UOM: this.vUOM || 0,
          Rate:formValues.Rate,// this.userFormGroup.get("Rate").value,// this.vRate || 0,
          Qty: formValues.Qty || 0,
          TotalAmount: formValues.TotalAmount || 0,
          DiscPer: formValues.Disc || 0,
          DiscAmount: formValues.DiscAmount || 0,
          CGST: formValues.CGSTPer || 0,
          CGSTAmount: formValues.CGSTAmount || 0,
          SGST: formValues.SGSTPer || 0,
          SGSTAmount: formValues.SGSTAmount || 0,
          IGST: formValues.IGSTPer || 0,
          IGSTAmont: formValues.IGSTAmount || 0,
          GST: formValues.GSTPer || 0,
          GSTAmount: formValues.GSTAmount || 0,
          NetAmount: formValues.NetAmount || 0,
          MRP: formValues.MRP || 0,
          DefRate: formValues.DefRate || 0,
          Specification: formValues.Specification || '',
        });
        console.log(newItem)
        console.log(this.dsItemNameList.data)
        this.dsItemNameList.data = [...this.dsItemNameList.data, newItem];
        this.updatePurchaseFinalForm();
      }
    }

    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    // this.itemid.nativeElement.focus();
    this.add = false;
    this.resetFormItem();
  }


  updatePurchaseFinalForm() {
    const form = this.userFormGroup;
    const itemList = this.dsItemNameList.data;
    const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    const updatableFormValues: GRNFinalFormModel = {
      TotalAmt: itemList.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(2),
      VatAmount: itemList.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0).toFixed(2),
      NetPayamt: netAmount.toFixed(2),
      RoundingAmt: Math.round(netAmount),
      DiscAmount: itemList.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0).toFixed(2)
    } as GRNFinalFormModel;

    form.patchValue({
      ...updatableFormValues
    });
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

  getOldPurchaseOrder(el) {
    var Param = {

      "first": 0,
      "rows": 10,
      "sortField": "purchaseID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "purchaseID",
          "fieldValue": "2",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }


    this._PurchaseOrder.getPurchaseOrderDetail(Param).subscribe(data => {
      this.dsItemNameList.data = data.data as ItemNameList[];
      this.chargeslist = data as ItemNameList[];
      this.dsItemNameList.sort = this.sort;
      this.dsItemNameList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  vCGSTPer: any;
  vSGSTPer: any;
  vIGSTPer: any;
  vCGSTAmt: any=0;
  vSGSTAmt: any=0;
  vIGSTAmt: any=0;
  getSelectedObj(obj) {
    console.log(obj)
    this.ItemId = obj.itemId;
    this.ItemName = obj.itemName;
    this.vUOM = obj.umoId;
    this.vConversionFactor = obj.converFactor;
    this.vHSNcode = obj.hsNcode;
    this.vQty = 0;
    this.vMRP = 0;
    this.vRate = '';
    this.vDis = '';
    this.vCGSTPer = obj.cgstPer
    this.vSGSTPer = obj.sgstPer
    this.vIGSTPer = obj.igstPer
    // this.vIGSTAmt = obj.CGSTPer
    this.vTotalAmount = (parseInt(this.vQty) * parseFloat(this.vRate)).toFixed(2);
    this.vNetAmount = this.vTotalAmount;
    //this.VatPercentage = obj.VatPercentage;
    this.vGSTPer = (obj.SGSTPer + obj.CGSTPer + obj.IGSTPer);
    // this.GSTAmount = 0;
    this.vSpecification = obj.Specification || '';
    this.getLastThreeItemInfo();
    // this.qty.nativeElement.focus();
    this.getSupplierRate();
  }

  getLastThreeItemInfo() {
    var vdata = {

      "first": 0,
      "rows": 10,
      "sortField": "ItemId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ItemId",
          "fieldValue": "14453",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }


    this._PurchaseOrder.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data.data as LastThreeItemList[]; this.sIsLoading = '';
    });
  }
  supplierRateList: any = [];
  getSupplierRate() {
    this.supplierRateList = [];
    var data =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ItemId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ItemId",
          "fieldValue": "1",
          "opType": "Equals"
        },
        {
          "fieldName": "SupplierId",
          "fieldValue": "1",
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }
    console.log(data);
    this._PurchaseOrder.getSupplierRateList(data).subscribe(data => {
      // console.log(data)
      this.supplierRateList = data
      let SupplierRate = 0;
      // SupplierRate = this.supplierRateList[0].SupplierRate;
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
  keyPressCharater(event) {
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
    this.vsaveflag = true
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
    // if (this.FinalPurchaseform.invalid) {
    //   this.toastr.warning('please check from is invalid', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }

    let updatePurchaseOrderHeaderObj = {};
    updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date /// this.datePipe.transform(this.userFormGroup.get('PurchaseDate').value, "yyyy-MM-dd");
    updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
    updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.storeId;
    updatePurchaseOrderHeaderObj['supplierID'] = this.userFormGroup.get('SupplierId').value.SupplierId || 0;
    updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt;
    updatePurchaseOrderHeaderObj['discAmount'] = (parseFloat(this.DiscAmount)).toFixed(2);
    updatePurchaseOrderHeaderObj['taxAmount'] = (parseFloat(this.GSTAmount)).toFixed(2);
    updatePurchaseOrderHeaderObj['freightAmount'] = this.FinalPurchaseform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['octriAmount'] = this.FinalPurchaseform.get('OctriAmount').value || 0;
    updatePurchaseOrderHeaderObj['grandTotal'] = this.FinalNetAmount;
    updatePurchaseOrderHeaderObj['isclosed'] = false;
    updatePurchaseOrderHeaderObj['isVerified'] = false;
    updatePurchaseOrderHeaderObj['remarks'] = this.FinalPurchaseform.get('Remark').value || '';
    updatePurchaseOrderHeaderObj['taxID'] = 0;
    updatePurchaseOrderHeaderObj['updatedBy'] = this.accountService.currentUserValue.userId,
    updatePurchaseOrderHeaderObj['paymentTermId'] = this.paymentterm || 0;
    updatePurchaseOrderHeaderObj['modeofPayment'] = this.paymentmode|| 0;
    updatePurchaseOrderHeaderObj['worrenty'] = this.FinalPurchaseform.get('Worrenty').value || 0;
    updatePurchaseOrderHeaderObj['roundVal'] = 0;
    updatePurchaseOrderHeaderObj['totCGSTAmt'] = (parseFloat(this.vCGSTAmt)).toFixed(2);
    updatePurchaseOrderHeaderObj['totSGSTAmt'] = (parseFloat(this.vSGSTAmt)).toFixed(2);
    updatePurchaseOrderHeaderObj['totIGSTAmt'] = (parseFloat(this.vIGSTAmt)).toFixed(2);
    updatePurchaseOrderHeaderObj['transportChanges'] = this.FinalPurchaseform.get('TransportCharges').value || 0;
    updatePurchaseOrderHeaderObj['handlingCharges'] = this.FinalPurchaseform.get('HandlingCharges').value || 0;
    updatePurchaseOrderHeaderObj['freightCharges'] = this.FinalPurchaseform.get('Freight').value || 0;
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
      purchaseDetailInsertObj['vatAmount'] = element.GSTAmount;
      purchaseDetailInsertObj['vatPer'] = element.GST;
      purchaseDetailInsertObj['grandTotalAmount'] = element.NetAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = element.CGST;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmount;
      purchaseDetailInsertObj['sgstPer'] = element.SGST;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmount;
      purchaseDetailInsertObj['igstPer'] = element.IGST;
      purchaseDetailInsertObj['igstAmt'] = element.IGSTAmount;
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
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseUpdate(submitData).subscribe(response => {
      this.toastr.success(response.message);
      if (response) {
        this.viewgetPurchaseorderReportPdf(response)
        this._matDialog.closeAll();
      }
    });
  }

  OnSavenew() {
    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if (this.FinalPurchaseform.invalid) {
    //   this.toastr.warning('please check from is invalid', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }



    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {

      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemId;
      purchaseDetailInsertObj['uomid'] = element.UOMID;
      purchaseDetailInsertObj['qty'] = element.Qty || 0;
      purchaseDetailInsertObj['rate'] = element.Rate || 0;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.GSTAmount;
      purchaseDetailInsertObj['vatPer'] = element.GST;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.NetAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstper'] = element.CGSTPer;
      purchaseDetailInsertObj['cgstamt'] = element.CGSTAmt;
      purchaseDetailInsertObj['sgstper'] = element.SGSTPer;
      purchaseDetailInsertObj['sgstamt'] = element.SGSTAmt;
      purchaseDetailInsertObj['igstper'] = element.IGSTPer;
      purchaseDetailInsertObj['igstamt'] = element.IGSTAmt;
      purchaseDetailInsertObj['defRate'] = element.DefRate;
      purchaseDetailInsertObj['vendDiscPer'] = 0;
      purchaseDetailInsertObj['vendDiscAm'] = 0;
      InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
    });

    let submitData = {
      "purchaseId": 0,
      "purchaseNo": "string",
      "storeId": 2,
      "supplierId": this.userFormGroup.get('SupplierId').value || 0,
      "totalAmount": this.FinalTotalAmt,
      "discAmount": this.DiscAmount,
      "taxAmount": (parseFloat(this.GSTAmount)).toFixed(2),
      "freightAmount": this.FinalPurchaseform.get('Freight').value || 0,
      "octriAmount": this.FinalPurchaseform.get('OctriAmount').value || 0,
      "grandTotal": this.FinalNetAmount,
      "isclosed": true,
      "isVerified": true,
      "remarks": this.FinalPurchaseform.get('Remark').value || '',
      "taxId": 0,
      "paymentTermId": this.paymentterm,// this.FinalPurchaseform.get('PaymentTerm').value.value || 0,
      "modeofPayment": this.paymentmode,// this.FinalPurchaseform.get('PaymentMode').value.value || 0,
      "worrenty": this.FinalPurchaseform.get('Worrenty').value || 0,
      "roundVal": 0,
      "prefix": "string",
      "isVerifiedId": 0,
      "verifiedDateTime":this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
      "totCgstamt": (parseFloat(this.vCGSTAmt)).toFixed(2),
      "totSgstamt": (parseFloat(this.vSGSTAmt)).toFixed(2),
      "totIgstamt": (parseFloat(this.vIGSTAmt)).toFixed(2),
      "transportChanges": this.FinalPurchaseform.get('TransportCharges').value || 0,
      "handlingCharges": this.FinalPurchaseform.get('HandlingCharges').value || 0,
      "freightCharges": this.FinalPurchaseform.get('Freight').value || 0,
      "tPurchaseDetails": InsertpurchaseDetailObj
    };
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseSave(submitData).subscribe(response => {
      this.toastr.success(response.message);
      if (response) {
        this.viewgetPurchaseorderReportPdf(response)
        this._matDialog.closeAll();
      }

    });
  }
  IgstPercentage: any = 0;
  CgstPercentage: any = 0;
  SgstPercentage: any = 0;

  // getCellCalculation(item: ItemNameList) {
  //       // Validate PO Quantity
  //       // if (!this.newGRNService.validatePOQuantity(contact)) {
  //       //     Swal.fire("Qty Should Be less than PO Qty");
  //       //     return;
  //       // }
  //       this.newGRNService.validateCellData(item);

  //       // Calculate basic values
  //       this.newGRNService.calculateBasicValues(item);
  //       // Validate GST Rates
  //       this.newGRNService.validateGSTRates(item);

  //       const updatedItem = this.calculateCellGSTType(item);
  //       Object.assign(item, updatedItem);

  //       this.updatePurchaseFinalForm();
  //   }

  getCellCalculation(contact, Qty) {

    if (contact.DefRate > 0) {
      if (contact.Rate > contact.DefRate) {
        Swal.fire("Please Check defined Supplier Rate for product ...!!!");
      }
    }
    if (contact.SGSTPer == "" || contact.SGSTPer == null || contact.SGSTPer == undefined) {
      contact.SGSTAmt = 0;
      //contact.SGSTPer = this.SgstPercentage 
    }
    if (contact.CGSTPer == "" || contact.CGSTPer == null || contact.CGSTPer == undefined) {
      contact.CGSTAmt = 0;
      //contact.CGSTPer = this.CgstPercentage 
    }
    if (contact.IGSTPer == "" || contact.IGSTPer == null || contact.IGSTPer == undefined) {
      contact.IGSTAmt = 0;
      //contact.IGSTPer = this.IgstPercentage 
    }

    if (contact.Qty > 0 && contact.Rate > 0) {

      this.IgstPercentage = contact.IGSTPer;
      this.CgstPercentage = contact.CGSTPer;
      this.SgstPercentage = contact.SGSTPer;
      if (this.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //disc
        contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
        let TotalAmt: any = 0;
        TotalAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);
        //Gst
        contact.VatPer = (parseFloat(this.CgstPercentage) + parseFloat(this.SgstPercentage) + parseFloat(this.IgstPercentage)).toFixed(2);
        contact.CGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.CgstPercentage)) / 100).toFixed(2);
        contact.SGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.SgstPercentage)) / 100).toFixed(2);
        contact.IGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.IgstPercentage)) / 100).toFixed(2);
        contact.VatAmount = ((parseFloat(TotalAmt) * parseFloat(contact.VatPer)) / 100).toFixed(2);
        contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount)).toFixed(2);
      }
      else if (this.userFormGroup.get('Status3').value.Name == 'GST Before Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //Gst
        contact.VatPer = (parseFloat(this.CgstPercentage) + parseFloat(this.SgstPercentage) + parseFloat(this.IgstPercentage)).toFixed(2);
        contact.CGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.CgstPercentage)) / 100).toFixed(2);
        contact.SGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.SgstPercentage)) / 100).toFixed(2);
        contact.IGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.IgstPercentage)) / 100).toFixed(2);
        contact.VatAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VatPer)) / 100).toFixed(2);
        let totalAmt: any = 0
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
    else if (this.vDefRate) {
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
    let Qty = this.userFormGroup.get('Qty').value
    if (Qty > 0 && this.vRate > 0) {
      if (Qty && this.vRate) {
        this.vTotalAmount = ((this.vRate) * (this.vQty)).toFixed(2);
        this.vNetAmount = this.vTotalAmount;
        //Dicount calculation
        this.vDiscAmt = ((this.vTotalAmount * this.vDis) / 100).toFixed(2);
        let totalamt = this.vTotalAmount - this.userFormGroup.get('DiscAmount').value;
        //GST Calculation 
      }
    } else {
      this.userFormGroup.get('TotalAmount').setValue(0);
      this.userFormGroup.get('DiscAmount').setValue(0);
      this.userFormGroup.get('GSTAmount').setValue(0);
      this.userFormGroup.get('NetAmount').setValue(0);
    }
    this.calculateGSTType();
  }
  calculateDiscperAmount() {
    let disc = this.userFormGroup.get('Dis').value
    if (disc >= 100) {
      // Swal.fire("Enter Discount less than 100");
      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.userFormGroup.get('Dis').setValue(0);
    }
    if (disc) {
      let disc = this.userFormGroup.get('Dis').value
      this.vNetAmount = ((this.vTotalAmount) - (this.userFormGroup.get('DiscAmount').value)).toFixed(2);
      if (this.userFormGroup.get('Status3').value.Name == "GST After Disc") {

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

  // calculateGSTperAmount() {
  //   // if (this.vGSTPer) {
  //   if (this.userFormGroup.get('Status3').value.Name == "GST After Disc") {
  //     let totalamt = this.vTotalAmount - this.userFormGroup.get('DiscAmount').value

  //     this.vSGSTAmt = ((totalamt * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
  //     this.vCGSTAmt = ((totalamt * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
  //     this.vIGSTAmt = ((totalamt * parseFloat(this.vIGSTPer)) / 100).toFixed(2);

  //     this.vGSTAmt = ((totalamt * parseFloat(this.vGSTPer)) / 100).toFixed(2);
  //     this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
  //     this.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
  //   } else {
  //     this.vSGSTAmt = ((this.vTotalAmount * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
  //     this.vCGSTAmt = ((this.vTotalAmount * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
  //     this.vIGSTAmt = ((this.vTotalAmount * parseFloat(this.vIGSTPer)) / 100).toFixed(2);

  //     this.vGSTAmt = ((this.vTotalAmount * parseFloat(this.vGSTPer)) / 100).toFixed(2);
  //     this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this.userFormGroup.get('DiscAmount').value) + parseFloat(this.vGSTAmt)).toFixed(2);
  //     this.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
  //   }
  //   // }
  // }

  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, { GrandTotalAmount }) => sum += +(GrandTotalAmount), 0);

    let handlingCharges = this.FinalPurchaseform.get('HandlingCharges').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(handlingCharges)).toFixed(2);

    let transportChanges = this.FinalPurchaseform.get('TransportCharges').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(transportChanges)).toFixed(2);

    let Freight = this.FinalPurchaseform.get('Freight').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(Freight)).toFixed(2);

    let OctriAmt = this.FinalPurchaseform.get('OctriAmount').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(OctriAmt)).toFixed(2);

    return this.FinalNetAmount;
  }

  getTotalGST(element) {
    this.GSTAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    // console.log(this.GSTAmount)
    return this.GSTAmount;
    this.CGSTAmount = (element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0)).toFixed(2);
    this.SGSTAmount = (element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0)).toFixed(2);
    this.IGSTAmount = (element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0)).toFixed(2);
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
    this.userFormGroup.reset();
    this.FinalPurchaseform.reset();
    this.dsItemNameList.data = [];
    this.resetFormItem();
    this._matDialog.closeAll();
  }

  // ItemFormreset() {
  //   this.vItemNames = "";
  //   this.ItemID = 0;
  //   this.vQty = 0;
  //   this.vUOM = 0;
  //   this.vRate = 0;
  //   this.vTotalAmount = 0;
  //   this.vDis = 0;
  //   this.vDiscAmt = 0;
  //   this.vGSTPer = 0;
  //   this.vGSTAmt = 0;
  //   this.vCGSTPer = 0;
  //   this.vCGSTAmt = 0;
  //   this.vSGSTPer = 0;
  //   this.vSGSTAmt = 0;
  //   this.vIGSTPer = 0;
  //   this.vIGSTAmt = 0;
  //   this.vNetAmount = 0;
  //   this.vMRP = 0;
  //   this.vConversionFactor = 0;
  //   this.vHSNcode = 0;
  //   this.vDefRate = 0;
  //   this.vSpecification = "";
  // }
  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
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

  // public onEnterSupplier(event): void {
  //   if (event.which === 13) {
  //     this.PurchaseDate.nativeElement.focus();
  //   }
  // }
  // public onEnterGSTType(event): void {
  //   if (event.which === 13) {
  //     this.itemid.nativeElement.focus();
  //   }
  // }

  // public onEnterItemName(event): void {
  //   if (event.which === 13) {
  //     this.qty.nativeElement.focus();
  //   }
  // }
  // public onEnterQty(event): void {
  //   if (event.which === 13) {
  //     this.mrp.nativeElement.focus();
  //     //this.add = false;
  //   }
  // }
  // public onEnterMRP(event): void {
  //   if (event.which === 13) {
  //     this.rate.nativeElement.focus();
  //     //this.add = false;
  //   }
  // }
  // public onEnterRate(event): void {
  //   if (event.which === 13) {
  //     this.dis.nativeElement.focus();
  //     // this.add = false;
  //     this.vDis.setValue('');
  //   }
  // }
  // public onEnterTotal(event): void {
  //   if (event.which === 13) {
  //     this.dis.nativeElement.focus();
  //     // this.add = false;
  //   }
  // }
  // public onEnterDis(event): void {
  //   if (event.which === 13) {
  //     this.gst.nativeElement.focus();
  //     // this.add = false;
  //   }
  // }
  // public onEnterGST(event): void {
  //   if (event.which === 13) {
  //     this.specification.nativeElement.focus();
  //     //this.add = false;
  //   }
  // }

  // public onEnterSpecification(event): void {
  //   if (event.which === 13) {
  //     //this.add = false;
  //   }
  // }

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

    if (this.dsItemNameList.data.length > 0) {
      this.vsaveflag = false
    }
  }
  IsDiscPer2: boolean = false;
  onGSTTypeChange(event: { value: number, text: string }) {
    console.log(event)
    this.calculateGSTType(event.text as GSTType);
    if (event.text == "GST After TwoTime Disc") {
      this.IsDiscPer2 = true
    } else {
      this.IsDiscPer2 = false
    }
  }

  viewgetPurchaseorderReportPdf(PurchaseID) {

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

  //new 
  vstoreId: any = '';
  selectChangeStore(obj: any) {
    debugger
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }

  getSelectedItem(item: GRNItemResponseType): void {
    console.log(item)
    // if (this.mock) {
    //     return;
    // }
    this.userFormGroup.patchValue({
      UOMId: item.umoId,
      ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
      Qty: item.balanceQty,
      CGSTPer: item.cgstPer,
      SGSTPer: item.sgstPer,
      IGSTPer: item.igstPer,
      GST: item.cgstPer + item.sgstPer + item.igstPer,
      HSNcode: item.hsNcode

    });
    this.calculateTotalamt();
  }

  //   calculateTotalamt() {
  //     debugger
  //     this.validateFormValues();
  //     const form = this.userFormGroup;
  //    const qty = +form.get('Qty').value || 0;
  //     // const freeqty = +form.get('FreeQty').value || 0;
  //     const rate = +form.get('Rate').value || 0;
  //     const conversionFactor = +form.get('ConversionFactor').value || 1;
  //    // const totalQty = (qty + freeqty) * conversionFactor;
  //     let totalAmount = 0;
  //     let netAmount = 0;

  //     if (qty > 0 && rate > 0) {
  //         totalAmount = rate * qty;
  //         netAmount = totalAmount;

  //         // Update form values
  //         form.patchValue({
  //             TotalAmount: totalAmount,
  //             NetAmount: netAmount,
  //             // FinalTotalQty: totalQty
  //         });

  //         // Trigger discount and GST calculations
  //         // this.calculateDiscperAmount();
  //     } else {
  //         // Reset all calculated values
  //         form.patchValue({
  //             TotalAmount: 0,
  //             DiscAmount: 0,
  //             DiscAmount2: 0,
  //             CGSTAmount: 0,
  //             SGSTAmount: 0,
  //             IGSTAmount: 0,
  //             GSTAmount: 0,
  //             NetAmount: 0,
  //             // FinalTotalQty: totalQty
  //         });
  //     }
  //     this.calculateDiscAmount();
  //     // this.calculateGSTType();
  // }

  calculateTotalamt() {
    this.validateFormValues();
    const form = this.userFormGroup;
    // Get values with proper type conversion
    const qty = +form.get('Qty').value || 0;
    // const freeqty = +form.get('FreeQty').value || 0;
    const rate = +form.get('Rate').value || 0;
    const conversionFactor = +form.get('ConversionFactor').value || 1;
    debugger
    let totalAmount = 0;
    let netAmount = 0;

    if (qty > 0 && rate > 0) {
      totalAmount = rate * qty;
      netAmount = totalAmount;
      form.patchValue({
        TotalAmount: totalAmount,
        NetAmount: netAmount,
        // FinalTotalQty: totalQty
      });

      // Trigger discount and GST calculations
      // this.calculateDiscperAmount();
    } else {
      // Reset all calculated values
      form.patchValue({
        TotalAmount: 0,
        DiscAmount: 0,
        DiscAmount2: 0,
        CGSTAmount: 0,
        SGSTAmount: 0,
        IGSTAmount: 0,
        GSTAmount: 0,
        NetAmount: 0,
        // FinalTotalQty: totalQty
      });
    }
    this.calculateDiscountAmount();
    this.calculateGSTType();
  }
  calculateDiscper2Amt() { }
  // Calculate discount when discount percentage changes
  calculateDiscountAmount() {
    debugger
    const form = this.userFormGroup;
    const values = form.getRawValue() as PurchaseFormModel;

    // Get and validate discount percentage
    const discountPercentage = Number(this.userFormGroup.get("Disc").value) // Number(values.Disc || 0);
    if (discountPercentage >= 100 || discountPercentage < 0) {
      this._PurchaseOrder.showToast('Discount percentage should be between 0 and 100', ToastType.WARNING);
      form.patchValue({ Disc: 0 });
      this.calculateGSTType();
      return;
    }

    // Calculate discount amount
    const totalAmount = Number(values.TotalAmount || 0);
    const discountAmount = Number(((totalAmount * discountPercentage) / 100).toFixed(2));

    // Update form with new discount amount
    form.patchValue({
      DiscAmount: discountAmount
    }, { emitEvent: false });

    // // Recalculate GST after discount update
    this.calculateGSTType();
  }
  calculateGSTType(type: GSTType = GSTType.GST_BEFORE_DISC) {
    
    const form = this.userFormGroup;
    const formValues = form.getRawValue() as PurchaseFormModel;
    const values = this._PurchaseOrder.normalizeValues(formValues);
    const calculation = this._PurchaseOrder.getGSTCalculation(formValues.GSTType || type, values);
console.log(calculation)
    // Update form with calculated values
    form.patchValue({
      IGST: type === GSTType.GST_AFTER_DISC ? 0 : values.igst,
      CGSTAmount: calculation.cgstAmount.toFixed(2),
      SGSTAmount: calculation.sgstAmount.toFixed(2),
      IGSTAmount: calculation.igstAmount.toFixed(2),
      GSTAmount: calculation.totalGSTAmount.toFixed(2),
      NetAmount: calculation.netAmount.toFixed(2)
    }, { emitEvent: false });
    debugger
    this.vCGSTAmt=this.vCGSTAmt + calculation.cgstAmount.toFixed(2)
    this.vSGSTAmt= this.vSGSTAmt+calculation.sgstAmount.toFixed(2)
    this.vIGSTAmt= this.vIGSTAmt+calculation.igstAmount.toFixed(2)
  }
  calculateCellGSTType(item: ItemNameList): ItemNameList {
    // Validate input
    if (!item) return item;

    try {
      // Get all required values with proper type conversion
      const values = this._PurchaseOrder.normalizeValues(item);

      // Get GST Calculation
      const calculation = this._PurchaseOrder.getGSTCalculation(item.GSTType, values);

      // Create updated item with new values
      return {
        ...item,
        // IGST: item.GSTType === GSTType.GST_AFTER_DISC ? 0 : values.igst,
        // CGSTAmount: Number(calculation.cgstAmount.toFixed(2)),
        // SGSTAmount: Number(calculation.sgstAmount.toFixed(2)),
        // IGSTAmount: Number(calculation.igstAmount.toFixed(2)),
        VatAmount: Number(calculation.totalGSTAmount.toFixed(2)),
        NetAmount: Number(calculation.netAmount.toFixed(2)),
        // Add any additional calculated fields
        // LandedRate: calculation.netAmount / (item.TotalQty || 1),
        // PurUnitRate: item.TotalAmount / (item.Qty * item.ConversionFactor),
        // PurUnitRateWF: item.TotalAmount / (item.TotalQty || 1),
        // UnitMRP: item.MRP / item.ConversionFactor
      };
    } catch (error) {
      console.error('Error calculating GST:', error);
      return item;
    }
  }

  calculateDiscAmount() {
    let IGSTPer = 0;
    this.vIGST = IGSTPer
    let discAmount1 = this.userFormGroup.get('DiscAmount').value;
    if (discAmount1 >= 100) {
      //Swal.fire("Enter Discount less than 100");
      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.userFormGroup.get('Disc').setValue('');
    }
    debugger
    if (discAmount1 >= 0) {
      let discAmount1 = this.userFormGroup.get('DiscAmount').value;
      // if (this.userFormGroup.get('GSTType').value.Name == 'GST After Disc') {testing
      //disc
      this.vDisc = ((parseFloat(discAmount1) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
      let TotalAmt = (parseFloat(this.vTotalAmount) - parseFloat(discAmount1)).toFixed(2);
      //Gst
      this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
      this.vCGSTAmount = ((parseFloat(TotalAmt) * parseFloat(this.vCGST)) / 100).toFixed(2);
      this.vSGSTAmount = ((parseFloat(TotalAmt) * parseFloat(this.vSGST)) / 100).toFixed(2);
      this.vIGSTAmount = ((parseFloat(TotalAmt) * parseFloat(this.vIGST)) / 100).toFixed(2);
      this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
      this.vNetAmount = ((parseFloat(TotalAmt) + parseFloat(this.vGSTAmount))).toFixed(2);
      // } else {
      //     //Gst
      //     this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
      //     this.vCGSTAmount = ((parseFloat(this.vTotalAmount) * parseFloat(this.vCGST)) / 100).toFixed(2);
      //     this.vSGSTAmount = ((parseFloat(this.vTotalAmount) * parseFloat(this.vSGST)) / 100).toFixed(2);
      //     this.vIGSTAmount = ((parseFloat(this.vTotalAmount) * parseFloat(this.vIGST)) / 100).toFixed(2);
      //     this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
      //     let TotalAmt = (parseFloat(this.vTotalAmount) + parseFloat(this.vGSTAmount)).toFixed(2);
      //     this.vDisc = ((parseFloat(discAmount1) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
      //     this.vNetAmount = (parseFloat(TotalAmt) - parseFloat(discAmount1)).toFixed(2);
      // }
    }
    this.FinalLandedrate = (parseInt(this.vNetAmount) / parseInt(this.FinalTotalQty)) || 0,
      this.FinalpurUnitRate = (parseInt(this.vTotalAmount) / (parseInt(this.vQty) * parseInt(this.vConversionFactor))) || 0
    this.FinalpurUnitrateWF = (parseInt(this.vTotalAmount) / parseInt(this.FinalTotalQty) * parseInt(this.vConversionFactor)) || 0
  }
paymentmode=0;
paymentterm=0;
  selPaymentterm(event){
this.paymentterm=event.value
  }

  selPaymentmode(event){
    this.paymentmode=event.value
  }

  validateFormValues() {
    const form = this.userFormGroup;
    const values = form.getRawValue() as PurchaseFormModel;
    if (+values.Qty < 0) {
      this._PurchaseOrder.showToast('Quantity should be greater than 0', ToastType.WARNING);
      form.patchValue({
        Qty: 0,
      });
    }

    if (+values.MRP < 0) {
      this._PurchaseOrder.showToast('MRP should be greater than 0', ToastType.WARNING);
      form.patchValue({
        MRP: 0,
      });
    }
    if (+values.Rate < 0) {
      this._PurchaseOrder.showToast('Rate should be greater than 0', ToastType.WARNING);
      form.patchValue({
        Rate: 0,
      });
    }
    if (+values.Rate > +values.MRP) {
      this._PurchaseOrder.showToast('Rate should be less than MRP', ToastType.WARNING);
      form.patchValue({
        Rate: 0,
      });
    }
    if (+values.ConversionFactor < 0) {
      this._PurchaseOrder.showToast('Conversion Factor should be greater than 0', ToastType.WARNING);
      form.patchValue({
        ConversionFactor: 1,
      });
    }
  }

  resetForm() {
    this.userFormGroup.reset();
    this.dsItemNameList.data = [];

  }


  resetFormItem() {
    const form = this.userFormGroup;

    form.patchValue({
      ItemName: "",
      ConversionFactor: 1,
      Qty: 0,
      UOMId: 0,
      HSNCode: "",
      BatchNo: "",
      ExpDate: "",
      FreeQty: 0,
      Rate: 0,
      MRP: 0,
      Disc: 0,
      Disc2: 0,
      DisAmount: 0,
      DisAmount2: 0,
      CGST: 0,
      CGSTAmount: 0,
      SGST: 0,
      SGSTAmount: 0,
      IGST: 0,
      GST: 0,
      GSTAmount: 0,
      TotalAmount: 0,
      NetAmount: 0,
      FinalTotalQty: 0,
      HSNcode: ''
    });
    this.userFormGroup.markAsUntouched();
  }
  selectChangeSupplier(supplier: any): void {
    console.log({ supplier });
  }

  getValidationMessages() {
    return {
      supplierId: [
        // { name: "required", Message: "SupplierId is required" }
      ],
      itemName: [
        // { name: "required", Message: "Item Name is required" }
      ],
      batchNo: [
        // { name: "required", Message: "Batch No is required" }
      ],
      invoiceNo: [
        // { name: "required", Message: "Invoice No is required" }
      ],
      gateEntryNo: [
        // { name: "required", Message: "Gate Entry No is required" }
      ],
      mrp: [
        // { name: "required", Message: "MRP is required" }
      ],
      rate: [
        // { name: "required", Message: "Rate is required" }
      ],
      GSTType: [
        // { name: "required", Message: "GSTType is required" }
      ],

    };
  }
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

