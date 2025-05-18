import { Component, ElementRef, HostListener, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ItemNameList, PurchaseItemList } from '../purchase-order.component';
import { SupplierMaster } from 'app/main/setup/inventory/supplier-master/supplier-master.component';
import { IndentList } from 'app/main/pharmacy/sales/sales.component';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { PurchaseOrderService } from '../purchase-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { FinalFormModel, GRNItemResponseType, GSTType, PurchaseFormModel, ToastType } from '../update-purchaseorder/types';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-purchaseorder',
  templateUrl: './new-purchaseorder.component.html',
  styleUrls: ['./new-purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewPurchaseorderComponent {

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
    'UOM',
    'Qty',

    'MRP',
    'Rate',
    'DefRate',
    'TotalAmount',
    'DiscPer',
    'DiscAmount',
    'CGSTPer',
    'CGSTAmount',
    'SGSTPer',
    'SGSTAmount',
    'IGSTPer',
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
    'discpercentage',
    'DiscAmount',
    'vatPercentage'
  ]

  sIsLoading: string = '';
  isLoading = true;

  StoreName: any;
  screenFromString = 'purchase-form';
  ItemID: any = "0";
  labelPosition: 'before' | 'after' = 'after';
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  chargeslist: any = [];
  optionsMarital: any[] = [];
  optionsPayment: any[] = [];
  optionsItemName: any[] = [];
  vDefRate: any = 0;
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
  // SupplierID: any;
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

  vDisAmount: any = 0;
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

  FinalUnitMRP: any;
  FinalTotalQty: any;
  vPurchaseId: any = 0;

  PurchaseID = 0;
  vSupplierId: any = 0;
  vsupplierName: any;
  vCGSTPer: any;
  vSGSTPer: any;
  vIGSTPer: any;
  vCGSTAmt: any = 0;
  vSGSTAmt: any = 0;
  vIGSTAmt: any = 0;
  paymentmode = 0;
  paymentterm = 0;
  PurchaseNo = ""
  CGSTFinalAmount: any;
  SGSTFinalAmount: any;
  IGSTFinalAmount: any;
  RoundingAmt = 0
  lastsupplierflag: boolean = false;
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
    private commonService: PrintserviceService,
    public dialogRef: MatDialogRef<NewPurchaseorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.userFormGroup = this._PurchaseOrder.getPurchaseOrderForm();
    this.FinalPurchaseform = this._PurchaseOrder.getPurchaseOrderFinalForm()
    this.userFormGroup.markAllAsTouched();
    this.FinalPurchaseform.markAllAsTouched();

    console.log(this.data)

    if (this.data) {
      this.registerObj = this.data.Obj
      this.PurchaseID = this.data.Obj.purchaseID
      this.vSupplierId = this.data.Obj.supplierID
      this.vstoreId = this.data.Obj.storeId
      this.PurchaseNo = this.data.Obj.purchaseNo
      this.FinalTotalAmt = this.data.Obj.totalAmount
      this.DiscAmount = this.data.Obj.discAmount
      this.GSTAmount = this.data.Obj.taxAmount
      this.paymentterm = this.data.Obj.paymentTermId
      this.paymentmode = this.data.Obj.modeOfPayment

      // setTimeout(() => {
      this._PurchaseOrder.getSupplierById(this.data.Obj.supplierID).subscribe((response) => {
        console.log(response)
        this.SupplierObj = response;

        this.vAddress = this.SupplierObj.address;
        this.vMobile = this.SupplierObj.mobile;
        this.vContact = this.SupplierObj.contactPerson;
        this.vGSTNo = this.SupplierObj.gstNo;
        this.vEmail = this.SupplierObj.email;

        let SupplierRate = 0;
        SupplierRate = this.supplierRateList[0].SupplierRate;
        this.vDefRate = SupplierRate;

      });
      this.userFormGroup.get('SupplierId').setValue(this.data.Obj.supplierID);

      this.FinalPurchaseform.get('PaymentTerm').setValue(this.data.Obj.paymentTermId);
      this.FinalPurchaseform.get('PaymentMode').setValue(this.data.Obj.modeOfPayment);
      this.FinalPurchaseform.get('Remark').setValue(this.data.Obj.remarks);
      this.FinalPurchaseform.get('HandlingCharges').setValue(this.data.Obj.handlingCharges);
      this.FinalPurchaseform.get('TransportCharges').setValue(this.data.Obj.transportChanges);
      this.FinalPurchaseform.get('Freight').setValue(this.data.Obj.freightAmount);
      this.FinalPurchaseform.get('OctriAmount').setValue(this.data.Obj.octriAmount);
      this.FinalPurchaseform.get('Worrenty').setValue(this.data.Obj.worrenty);

      // }, 100);
      this.getOldPurchaseOrder(this.data.Obj.purchaseID);
    }

  }

  getSelectedSupplierObj(obj) {
    // setTimeout(() => {
    this._PurchaseOrder.getSupplierById(obj.value).subscribe((response) => {
      this.SupplierObj = response;
      console.log(response)
      this.vSupplierId = this.SupplierObj.supplierId
      debugger
      this.vAddress = this.SupplierObj.address;
      this.vMobile = this.SupplierObj.mobile;
      this.vContact = this.SupplierObj.contactPerson;
      this.vGSTNo = this.SupplierObj.gstNo;
      this.vEmail = this.SupplierObj.email;
      this.getSupplierRate();

    });

    // }, 100);
  }

  onAdd() {
    if ((this.userFormGroup.get("Qty").value == 0 || this.userFormGroup.get("Qty").value == "")) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.userFormGroup.get("Rate").value == 0 || this.userFormGroup.get("Rate").value == "")) {
      this.toastr.warning('Please enter a Rate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const isDuplicate = this.dsItemNameList.data.some(item => item.ItemId === this.userFormGroup.get('ItemName').value.itemId);
    debugger
    if (!isDuplicate) {

      const formValues = this.userFormGroup.getRawValue() as PurchaseFormModel;
      console.log(formValues)
      if (formValues.ItemName) {
        const newItem = new ItemNameList({
          ...formValues,
          ItemName: formValues.ItemName.itemName,
          // TotalQty: formValues.Qty,
          ItemId: formValues.ItemName.itemId,
          UOM: formValues.UOMId || 0,
          UOMID: formValues.UOMId || 0,
          Rate: formValues.Rate,// this.userFormGroup.get("Rate").value,// this.vRate || 0,
          Qty: formValues.Qty || 0,
          TotalAmount: formValues.TotalAmount || 0,
          DiscPer: formValues.Disc || 0,
          DiscAmount: formValues.DiscAmount || 0,
          CGSTPer: formValues.CGSTPer || 0,
          CGSTAmount: formValues.CGSTAmount || 0,
          CGSTAmt: formValues.CGSTAmount || 0,

          SGSTPer: formValues.SGSTPer || 0,
          SGSTAmount: formValues.SGSTAmount || 0,
          SGSTAmt: formValues.SGSTAmount || 0,

          IGST: formValues.IGSTPer || 0,
          IGSTAmont: formValues.IGSTAmount || 0,
          IGSTAmt: formValues.IGSTAmount || 0,

          GST: formValues.GST || 0,
          GSTAmount: formValues.GSTAmount || 0,
          NetAmount: formValues.NetAmount || 0,
          MRP: formValues.MRP || 0,
          DefRate: formValues.DefRate || 0,
          Specification: formValues.Specification || '',
        });
        console.log(newItem)
        this.lastsupplierflag = false;
        this.dsItemNameList.data = [...this.dsItemNameList.data, newItem];
        this.updatePurchaseFinalForm();
      }
    }

    else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    const itemNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
    if (itemNameElement) {
      itemNameElement.focus();
    }
    this.resetFormItem();
  }


  updatePurchaseFinalForm() {
    const form = this.userFormGroup;
    const itemList = this.dsItemNameList.data;
    const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    const updatableFormValues: FinalFormModel = {
      TotalAmt: itemList.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(4),
      VatAmount: itemList.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0).toFixed(4),
      NetPayamt: netAmount.toFixed(4),
      RoundingAmt: Math.round(netAmount),
      DiscAmount: itemList.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0).toFixed(4)
    } as FinalFormModel;
    this.RoundingAmt = Math.round(netAmount)
    form.patchValue({
      ...updatableFormValues
    });
  }


  deleteTableRow(row: ItemNameList) {
    //  if (row.IsVerifiedUserId == 1) {
    //      this.newGRNService.showToast('Verified Record should not be Deleted .', ToastType.SUCCESS);
    //  } else {
    this.dsItemNameList.data = this.dsItemNameList.data.filter(item => item !== row);
    this._PurchaseOrder.showToast('Record Deleted Successfully.', ToastType.SUCCESS);
    this.updatePurchaseFinalForm();
    //  }
    debugger
    if (this.dsItemNameList.data.length == 0) {
      this.FinalPurchaseform.get("TransportCharges").setValue(0)
      this.FinalPurchaseform.get("Freight").setValue(0)
      this.FinalPurchaseform.get("OctriAmount").setValue(0)
    }
  }

  getOldPurchaseOrder(Id) {

    var Param = {

      "first": 0,
      "rows": 10,
      "sortField": "PurchaseID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "PurchaseID",
          "fieldValue": String(Id),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }


    this._PurchaseOrder.getPurchaseOrderDetail(Param).subscribe(data => {

      this.dsItemNameList.data = data.data as ItemNameList[];
      this.chargeslist = data as ItemNameList[];

      this.dsItemNameList.data.forEach(element => {

        console.log(element)

        element.ItemName = element.itemName,
          element.ItemId = element.itemId,
          element.Qty = element.qty,
          element.Rate = element.rate,
          element.TotalAmount = element.totalAmount,
          element.DiscAmount = element.discAmount,
          element.DiscPer = element.discPer,
          element.VatPer = element.vatPer,
          element.VatAmount = element.vatAmount,
          element.GST = element.vatPer,
          element.GSTAmount = element.vatAmount,
          element.GSTAmt = element.vatAmount,
          element.NetAmount = element.grandTotalAmount,
          element.MRP = element.mrp
        element.CGSTPer = element.cgstPer,
          element.CGSTAmount = element.cgstAmt,
          element.SGSTPer = element.sgstPer,
          element.SGSTAmount = element.sgstAmt,
          element.IGST = element.igstPer,
          element.IGSTAmount = element.igstAmt
        element.DefRate = element.defRate,
          element.Specification = element.specification
        element.UOM = element.uomid

      });
    });
    console.log(this.dsItemNameList)
  }


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

    this.vTotalAmount = (parseInt(this.vQty) * parseFloat(this.vRate)).toFixed(4);
    this.vNetAmount = this.vTotalAmount;
    this.vGSTPer = (obj.SGSTPer + obj.CGSTPer + obj.IGSTPer);
    this.vSpecification = obj.Specification || '';
    this.getLastThreeItemInfo();

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
          "fieldValue": String(this.ItemID),
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
          "fieldValue": String(this.ItemID),
          "opType": "Equals"
        },
        {
          "fieldName": "SupplierId",
          "fieldValue": String(this.vSupplierId),
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
      console.log(data);
      debugger
      if (data.data[0]) {
        // this.supplierRateList = data.data[0]
        let SupplierRate = data.data[0].supplierRate;
        this.vDefRate = SupplierRate;
        console.log(this.vDefRate)
      }
    });
  }

  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  // if (event.key === 'F4') {
  // this.OnSavenew();
  // } else if (event.key === 'F5') {

  //   this.OnSaveEdit();
  // }
  // }
// purchaseTime 
// "16-05-2025 11:56:53"

  OnSave() {
  debugger
    let Pdate;
    let pTime;
    if (this.PurchaseID !=0) {
    
      //  let date = new Date(this.data.Obj.purchaseTime);
      //  let formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
      // console.log(formattedDate)

      Pdate =this.datePipe.transform(this.data.Obj.purchaseTime, "yyyy-MM-dd") || '1900-01-01',
      pTime = this.data.Obj.purchaseTime
    } else {
      Pdate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd") || '1900-01-01',
        pTime = this.dateTimeObj.time;
    }

    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    console.log(this.FinalPurchaseform.value)

    debugger
    if (!this.FinalPurchaseform.invalid) {
      let InsertpurchaseDetailObj = [];
      this.dsItemNameList.data.forEach((element) => {
        // console.log(element)
        let purchaseDetailInsertObj = {};
        purchaseDetailInsertObj['purchaseId'] = this.PurchaseID;
        purchaseDetailInsertObj['itemId'] = element.ItemId;
        purchaseDetailInsertObj['uomid'] = element.UOM;
        purchaseDetailInsertObj['qty'] = element.Qty || 0;
        purchaseDetailInsertObj['rate'] = element.Rate || 0;
        purchaseDetailInsertObj['totalAmount'] = element.TotalAmount
        purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
        purchaseDetailInsertObj['discPer'] = element.DiscPer;
        purchaseDetailInsertObj['vatAmount'] = element.GSTAmount;
        purchaseDetailInsertObj['vatPer'] = element.GST;;
        purchaseDetailInsertObj['grandTotalAmount'] = element.NetAmount;
        purchaseDetailInsertObj['mrp'] = element.MRP;
        purchaseDetailInsertObj['specification'] = element.Specification;
        purchaseDetailInsertObj['cgstper'] = element.CGSTPer;
        purchaseDetailInsertObj['cgstamt'] = element.CGSTAmount;
        purchaseDetailInsertObj['sgstper'] = element.SGSTPer;
        purchaseDetailInsertObj['sgstamt'] = element.SGSTAmount;
        purchaseDetailInsertObj['igstper'] = element.IGSTPer;
        purchaseDetailInsertObj['igstamt'] = element.IGSTAmount;
        purchaseDetailInsertObj['defRate'] = element.DefRate;
        purchaseDetailInsertObj['vendDiscPer'] = 0;
        purchaseDetailInsertObj['vendDiscAm'] = 0;
        InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
      });

      let submitData = {
        "purchaseId": this.PurchaseID,
        "purchaseNo": this.PurchaseNo,
        "purchaseDate": Pdate,
        "purchaseTime": pTime,
        "storeId": this.vstoreId,
        "supplierId": this.vSupplierId,// this.userFormGroup.get('SupplierId').value || 0,
        "totalAmount": this.FinalTotalAmt,
        "discAmount": this.DiscAmount,
        "taxAmount": (parseFloat(this.GSTAmount)),
        "freightAmount": this.FinalPurchaseform.get('Freight').value || 0,
        "octriAmount": this.FinalPurchaseform.get('OctriAmount').value || 0,
        "grandTotal": this.FinalNetAmount,
        "isclosed": false,
        "isVerified": false,
        "remarks": this.FinalPurchaseform.get('Remark').value || '',
        "taxId": 0,
        "paymentTermId": this.paymentterm,// this.FinalPurchaseform.get('PaymentTerm').value.value || 0,
        "modeofPayment": this.paymentmode,// this.FinalPurchaseform.get('PaymentMode').value.value || 0,
        "worrenty": this.FinalPurchaseform.get('Worrenty').value || " ",
        "roundVal": Math.round(this.FinalNetAmount),
        "prefix": "",
        "isVerifiedId": 0,
        "verifiedDateTime": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
        "totCgstamt": (parseFloat(this.CGSTFinalAmount)),
        "totSgstamt": (parseFloat(this.SGSTFinalAmount)),
        "totIgstamt": (parseFloat(this.IGSTFinalAmount)),
        "transportChanges": this.FinalPurchaseform.get('TransportCharges').value || 0,
        "handlingCharges": this.FinalPurchaseform.get('HandlingCharges').value || 0,
        "freightCharges": this.FinalPurchaseform.get('Freight').value || 0,
        "isCancelled": false,
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
    } else {
      let invalidFields = [];
      if (this.FinalPurchaseform.invalid) {
        for (const controlName in this.FinalPurchaseform.controls) {
          if (this.FinalPurchaseform.controls[controlName].invalid) { invalidFields.push(`Purchase Form: ${controlName}`); }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

    }
  }
  viewgetPurchaseorderReportPdf(PurchaseID) {
    this.commonService.Onprint("PurchaseID", PurchaseID, "Purchaseorder");
  }
  getCellCalculation(item: ItemNameList) {

    this._PurchaseOrder.validateCellData(item);
    this._PurchaseOrder.calculateBasicValues(item);
    this._PurchaseOrder.validateGSTRates(item);

    const updatedItem = this.calculateCellGSTType(item);
    Object.assign(item, updatedItem);

    this.updatePurchaseFinalForm();
  }


  OnchekPurchaserateValidation() {

    if (this.vDefRate > 0) {
      if (parseFloat(this.userFormGroup.get("Rate").value) > parseFloat(this.vDefRate)) {
        Swal.fire("Please Check defined Supplier Rate for product ...!!!");
        this.vRate = 0
      } else { this.calculateTotalamt(); }

    } else if (this.vDefRate == 0) {
      if (this.userFormGroup.get("Rate").value) {
        this.calculateTotalamt();
      }
    }
  }


  onKeydown(e, data) { }
  // calculateTotalAmt() {
  //   let Qty = this.userFormGroup.get('Qty').value
  //   if (Qty > 0 && this.vRate > 0) {
  //     if (Qty && this.vRate) {
  //       this.vTotalAmount = ((this.vRate) * (this.vQty)).toFixed(4);
  //       this.vNetAmount = this.vTotalAmount;
  //       //Dicount calculation
  //       this.vDiscAmt = ((this.vTotalAmount * this.vDis) / 100).toFixed(4);
  //       let totalamt = this.vTotalAmount - this.userFormGroup.get('DiscAmount').value;
  //       //GST Calculation 
  //     }
  //   } else {
  //     this.userFormGroup.get('TotalAmount').setValue(0);
  //     this.userFormGroup.get('DiscAmount').setValue(0);
  //     this.userFormGroup.get('GSTAmount').setValue(0);
  //     this.userFormGroup.get('NetAmount').setValue(0);
  //   }
  //   this.calculateGSTType();
  // }
  // calculateDiscperAmount() {
  //   let disc = this.userFormGroup.get('Disc').value
  //   if (disc >= 100) {
  //      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     this.userFormGroup.get('Disc').setValue(0);
  //   }
  //   if (disc) {
  //     let disc = this.userFormGroup.get('Disc').value
  //     this.vNetAmount = ((this.vTotalAmount) - (this.userFormGroup.get('DiscAmount').value)).toFixed(4);
  //     if (this.userFormGroup.get('GSTType').value.Name == "GST After Disc") {

  //       this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(4);
  //       let totalamt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(4);
  //       this.vSGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vSGSTPer)) / 100).toFixed(4);
  //       this.vCGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vCGSTPer)) / 100).toFixed(4);
  //       this.vIGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vIGSTPer)) / 100).toFixed(4);
  //       this.vGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vGSTPer)) / 100).toFixed(4);
  //       this.vNetAmount = (parseFloat(totalamt) + parseFloat(this.vGSTAmt)).toFixed(4);

  //     } else {
  //       this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(4);
  //       this.vSGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vSGSTPer)) / 100).toFixed(4);
  //       this.vCGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vCGSTPer)) / 100).toFixed(4);
  //       this.vIGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vIGSTPer)) / 100).toFixed(4);
  //       this.vGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vGSTPer)) / 100).toFixed(4);
  //       let totalamt = (parseFloat(this.vTotalAmount) + (parseFloat(this.vGSTAmt))).toFixed(4);

  //       this.vNetAmount = ((parseFloat(totalamt)) - parseFloat(this.vDiscAmt)).toFixed(4);
  //     }
  //   }
  // }

  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount), 0);

    let handlingCharges = this.FinalPurchaseform.get('HandlingCharges').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(handlingCharges)).toFixed(4);

    let transportChanges = this.FinalPurchaseform.get('TransportCharges').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(transportChanges)).toFixed(4);

    let Freight = this.FinalPurchaseform.get('Freight').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(Freight)).toFixed(4);

    let OctriAmt = this.FinalPurchaseform.get('OctriAmount').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(OctriAmt)).toFixed(4);

    return this.FinalNetAmount;
  }

  getTotalGST(element) {
    this.GSTAmount = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(4);

    return this.GSTAmount;
    this.CGSTAmount = (element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0)).toFixed(4);
    this.SGSTAmount = (element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0)).toFixed(4);
    this.IGSTAmount = (element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0)).toFixed(4);
  }

  getTotalDisc(element) {
    this.DiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0);
    if (this.DiscAmount > 0)
      this.DiscAmount = this.DiscAmount.toFixed(4);
    return this.DiscAmount;
  }

  getTotalAmt(element) {
    this.FinalTotalAmt = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(4);
    return this.FinalTotalAmt;
  }
  highlight(contact) {
    this.selectedRowIndex = contact.ItemID;
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
  GSTTypeID: any = 0;
  GSTTypetext: any = 0;
  IsDiscPer2: boolean = false;
  onGSTTypeChange(event: { value: number, text: string }) {
    debugger
    // console.log(event)
    // this.GSTTypetext=event.text
    // this.GSTTypeID = event.value
    // this.calculateGSTType(event.text as GSTType);
    // if (event.text == "GST After TwoTime Disc") {
    //   this.IsDiscPer2 = true
    // } else {
    //   this.IsDiscPer2 = false
    // }

    console.log(event)
    this.GSTTypeID = event.value;
    const newGSTType = event.text as GSTType;
    this.calculateGSTType(newGSTType);
    if (event.text == "GST After TwoTime Disc") {
      this.IsDiscPer2 = true
    } else {
      this.IsDiscPer2 = false
    }

    // Update gst type of table data

    this.dsItemNameList.data.forEach((item) => {
      item.GSTType = newGSTType;
      this.getCellCalculation(item);
    })

  }


  getSelectedItem(item: GRNItemResponseType): void {
    console.log(item)
    this.lastsupplierflag = true
    this.ItemID = item.itemId
    // if (this.mock) {
    //     return;
    // }
    this.userFormGroup.patchValue({
      UOMId: item.umoId,
      ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
      Qty: 0,// item.balanceQty,
      CGSTPer: item.cgstPer,
      SGSTPer: item.sgstPer,
      IGSTPer: item.igstPer,
      GST: item.cgstPer + item.sgstPer + item.igstPer,
      HSNcode: item.hsNcode

    });

    this.getLastThreeItemInfo();
    const QtyElement = document.querySelector(`[name='Qty']`) as HTMLElement;
    if (QtyElement) {
      QtyElement.focus();
    }
    this.getSupplierRate();
  }

  calculateTotalamt() {
    // if (this.vDefRate == 0) {
    this.validateFormValues();
    const form = this.userFormGroup;
    const qty = +form.get('Qty').value || 0;
    const rate = +form.get('Rate').value || 0;

    let totalAmount = 0;
    let netAmount = 0;

    if (qty > 0 && rate > 0) {
      totalAmount = rate * qty;
      netAmount = totalAmount;
      form.patchValue({
        TotalAmount: totalAmount,
        NetAmount: netAmount,
      });
    } else {
      form.patchValue({
        TotalAmount: 0,
        DiscAmount: 0,
        DiscAmount2: 0,
        CGSTAmount: 0,
        SGSTAmount: 0,
        IGSTAmount: 0,
        GSTAmount: 0,
        NetAmount: 0,

      });
    }
    this.calculateDiscountAmount();
    this.calculateGSTType();
    // }
    // else {
    //   if (this.vDefRate > 0) {
    //     if (parseFloat(this.userFormGroup.get("Rate").value) > parseFloat(this.vDefRate)) {
    //       Swal.fire("Please Check defined Supplier Rate for product ...!!!");
    //       this.vRate = 0
    //     } else { this.calculateTotalamt(); }

    //   }
    // }
  }

  calculateDiscountAmount() {

    const form = this.userFormGroup;
    const values = form.getRawValue() as PurchaseFormModel;
    debugger
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
    const discountAmount = Number(((totalAmount * discountPercentage) / 100).toFixed(4));

    // Update form with new discount amount
    form.patchValue({
      DiscAmount: discountAmount
    }, { emitEvent: false });

    // // Recalculate GST after discount update
    this.calculateGSTType();
  }
  calculateGSTType(type: GSTType = GSTType.GST_BEFORE_DISC) {
    debugger
    const form = this.userFormGroup;
    const formValues = form.getRawValue() as PurchaseFormModel;
    const values = this._PurchaseOrder.normalizeValues(formValues);
    const calculation = this._PurchaseOrder.getGSTCalculation(this.GSTTypetext || type, values);

    // Update form with calculated values
    form.patchValue({
      IGST: type === GSTType.GST_AFTER_DISC ? 0 : values.igst,
      CGSTAmount: calculation.cgstAmount.toFixed(4),
      SGSTAmount: calculation.sgstAmount.toFixed(4),
      IGSTAmount: calculation.igstAmount.toFixed(4),
      GSTAmount: calculation.totalGSTAmount.toFixed(4),
      NetAmount: calculation.netAmount.toFixed(4)
    }, { emitEvent: false });
  }

  getCGSTAmt() {
    this.CGSTFinalAmount = this.dsItemNameList.data.reduce((sum, { CGSTAmount }) => sum += +(CGSTAmount || 0), 0);
    return this.CGSTFinalAmount
  }
  getSGSTAmt() {
    this.SGSTFinalAmount = this.dsItemNameList.data.reduce((sum, { SGSTAmount }) => sum += +(SGSTAmount || 0), 0);
    return this.SGSTFinalAmount
  }
  getIGSTAmt() {
    this.IGSTFinalAmount = this.dsItemNameList.data.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
    if (this.IGSTFinalAmount > 0)
      return this.IGSTFinalAmount
    else
      this.IGSTFinalAmount = 0
    return this.IGSTFinalAmount
  }
  getTotalAmount() {
    return this.dsItemNameList.data.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
  }
  calculateCellGSTType(item: ItemNameList): ItemNameList {

    if (!item) return item;
    debugger
    try {
      const values = this._PurchaseOrder.normalizeValues(item);
      const calculation = this._PurchaseOrder.getGSTCalculation(item.GSTType, values);
      return {
        ...item,
        IGST: item.GSTType === GSTType.GST_AFTER_DISC ? 0 : values.igst,
        CGSTAmount: Number(calculation.cgstAmount.toFixed(4)),
        SGSTAmount: Number(calculation.sgstAmount.toFixed(4)),
        IGSTAmount: Number(calculation.igstAmount.toFixed(4)),
        VatAmount: Number(calculation.totalGSTAmount.toFixed(4)),
        // GST: Number(calculation.totalGSTAmount.toFixed(4)),
        GSTAmount: Number(calculation.totalGSTAmount.toFixed(4)),
        NetAmount: Number(calculation.netAmount.toFixed(4)),
      };
    } catch (error) {
      console.error('Error calculating GST:', error);
      return item;
    }


  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }


  selPaymentterm(event) {
    this.paymentterm = event.value
  }

  selPaymentmode(event) {
    this.paymentmode = event.value
  }

  onClose() {
    this.dialogRef.close();
  }
  onClear() { }

  //new 
  vstoreId: any = "2";
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
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

  OnReset() {
    this.userFormGroup.reset();
    this.FinalPurchaseform.reset();
    this.dsItemNameList.data = [];
    this.resetFormItem();
    this._matDialog.closeAll();
  }


  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  resetFormItem() {
    const form = this.userFormGroup;

    form.patchValue({
      ItemName: "",
      ConversionFactor: 1,
      Qty: "",
      UOMId: 0,
      HSNCode: "",
      BatchNo: "",
      ExpDate: "",
      FreeQty: 0,
      Rate: "",
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
      TotalAmount: "",
      NetAmount: "",
      FinalTotalQty: 0,
      HSNcode: '',
      DefRate: 0
    });
    this.userFormGroup.markAsUntouched();
  }
  selectChangeSupplier(supplier: any): void {
    console.log({ supplier });
  }

  getValidationMessages() {
    return {
      supplierId: [
        { name: "required", Message: "SupplierId is required" }
      ],
      itemName: [
        { name: "required", Message: "Item Name is required" }
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
        { name: "required", Message: "MRP is required" }
      ],
      rate: [
        { name: "required", Message: "Rate is required" }
      ],
      GSTType: [
        { name: "required", Message: "GSTType is required" }
      ],
      Qty: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Qty is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
    };
  }

  isValidForm(): boolean {
    return this.dsItemNameList.data.every((i) => i.Qty > 0 && i.MRP > 0);
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

