import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IndentList } from 'app/main/pharmacy/sales/sales.component';
import { SupplierMaster } from 'app/main/setup/inventory/supplier-master/supplier-master.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { GRNFormModel } from '../../good-receiptnote/new-grn/types';
import { ItemNameList, PurchaseItemList } from '../purchase-order.component';
import { PurchaseOrderService } from '../purchase-order.service';
import { FinalFormModel, GRNItemResponseType, GSTType, PurchaseFormModel, ToastType } from '../update-purchaseorder/types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-purchaseorder',
  templateUrl: './new-purchaseorder.component.html',
  styleUrls: ['./new-purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewPurchaseorderComponent {
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


  userFormGroup: FormGroup;   // Item Calculation
  FinalPurchaseform: FormGroup;   // Footer Calculation
  PurchaseInsertform: FormGroup;   // Purchase Save Form

  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  autocompleteModeGSTType: string = "GstCalcType";
  autocompletepaymentterm: string = "TermofPayment";
  autocompletepaymentmode: string = "PaymentMode";  
  sIsLoading: string = '';
  isLoading = true; 
  screenFromString = 'Common-form';
  ItemID: any = "0";
  labelPosition: 'before' | 'after' = 'after';
  ItemnameList = [];
  chargeslist: any = [];
  vDefRate: any = 0;   
  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  vQty: any = 1;   
  vGSTPer: any;
  vMRP: any;
  DiscPer: any = 0;  
  NetAmt: any = 0; 
  FinalTotalAmt: any;
  FinalNetAmount: any = 0; 
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
  ItemName: any;
  vUOM: any; 
  vRate: any;
  vTotalAmount: any;  
  vNetAmount: any;
  vSpecification: string; 
  disableTextbox: boolean;
  DiscAmount: any;
  GSTAmount: any;  
  // SupplierID: any;
  vAddress: any;
  vMobile: any;
  vContact: any;
  vGSTNo: any;
  vEmail: any; 
  vConversionFactor: any;
  vHSNcode: any; 
  GrandTotalAmount: any; 
  dateTimeObj: any;
  ItemId: any;  
  vSupplierId: any = 0; 
  vCGSTPer: any;
  vSGSTPer: any;
  vIGSTPer: any; 
  paymentmode = 0;
  paymentterm = 0; 
  CGSTFinalAmount: any;
  SGSTFinalAmount: any;
  IGSTFinalAmount: any;
  RoundingAmt = 0
  lastsupplierflag: boolean = false; 

  dsItemNameList = new MatTableDataSource<ItemNameList>(); 
  dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  selectedRowIndex: any;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsPayment: Observable<string[]>;
  @ViewChild('qtyTextboxRef', { read: ElementRef }) qtyTextboxRef: ElementRef;

  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public dialogRef: MatDialogRef<NewPurchaseorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.userFormGroup = this.getPurchaseOrderForm();
    this.FinalPurchaseform = this.getPurchaseOrderFinalForm()
    this.userFormGroup.markAllAsTouched();
    this.FinalPurchaseform.markAllAsTouched();

    this.PurchaseInsertform = this.getPurchaseInsertFormnew();
    if (this.data) {
      this.registerObj = this.data.Obj 
      this.vSupplierId = this.data.Obj.supplierID
      this.vstoreId = this.data.Obj.storeId 
      this.FinalTotalAmt = this.data.Obj.totalAmount
      this.DiscAmount = this.data.Obj.discAmount
      this.GSTAmount = this.data.Obj.taxAmount
      this.paymentterm = this.data.Obj.paymentTermId
      this.paymentmode = this.data.Obj.modeOfPayment

      // setTimeout(() => {
      this._PurchaseOrder.getSupplierById(this.data.Obj.supplierID).subscribe((response) => {
        console.log(response)
        this.SupplierObj = response;
        this.userFormGroup.patchValue({
          Address: this.SupplierObj.address,
          Mobile: this.SupplierObj.mobile,
          Contact: this.SupplierObj.contactPerson,
          GSTNo: this.SupplierObj.gstNo,
          Email: this.SupplierObj.email,
        })
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

  // Item Calculation form
  getPurchaseOrderForm() {
    return this._formBuilder.group({ 
      StoreId: [this.accountService.currentUserValue.user.storeId, 
        [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      SupplierId: ['', [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Address: [''],
      Mobile: '',
      Contact: ['',[Validators.required]],
      GSTNo: '',
      Email: '',
      GSTType: [16],
      HSNcode:['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ItemName: ['', [Validators.required]],
      ConversionFactor:['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Qty: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      UOM: [''],
      UOMId: [''],
      Rate: ['', [this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      MRP: [''],
      TotalAmount:['', [this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      Disc: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      DiscAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      CGSTPer:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      CGSTAmount:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      SGSTPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      SGSTAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      IGSTPer:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      IGSTAmount:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      GST: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      GSTPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      GSTAmount: [''],
      NetAmount:['', [this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      Specification: [''],
      DefRate:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
    });
  }
  // Footer Calculation form
  getPurchaseOrderFinalForm() {
    return this._formBuilder.group({
      TransportCharges: [''],
      HandlingCharges: [''],
      Freight: [''],
      OctriAmount: [''],
      Worrenty: [''],
      roundVal: [''],
      NetAmount: [''],
      Remark: ['', [Validators.required]],
      PaymentTerm: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      PaymentMode: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  // Purchase Save Form 
  getPurchaseInsertFormnew() {
    return this._formBuilder.group({
      purchaseId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      purchaseNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      purchaseDate: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      purchaseTime: this.datePipe.transform(new Date(), "shorttime"),
      storeId: [0,[this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      supplierId: [0,[this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      totalAmount: [0,[this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      discAmount: [0,[this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      taxAmount: [0,[this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      freightAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      octriAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      grandTotal: [0,[this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isclosed: [false],
      isVerified: [false],
      remarks: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      taxId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      paymentTermId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      modeofPayment: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      worrenty: ['', this._FormvalidationserviceService.allowEmptyStringValidatorOnly()],
      roundVal: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      prefix: ['Purchase Order', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isVerifiedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      verifiedDateTime: this.datePipe.transform(new Date(), "yyyy-MM-dd"),
      totCgstamt: [ 0, this._FormvalidationserviceService.AllowDecimalNumberValidator()],
      totSgstamt: [ 0, this._FormvalidationserviceService.AllowDecimalNumberValidator()],
      totIgstamt: [ 0, this._FormvalidationserviceService.AllowDecimalNumberValidator()],
      transportChanges: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      handlingCharges: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      freightCharges: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      isCancelled: [false],
      tPurchaseDetails: this._formBuilder.array([])
    });
  }
  // Purchase Save Details Form
  createPurchasedetailForm(item: any = {}): FormGroup {
    return this._formBuilder.group({
      purchaseId: [item?.PurchaseID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [item?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      uomid: [item?.UOM , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      qty: [item?.Qty, [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      rate: [item?.Rate, [this._FormvalidationserviceService.AllowDecimalNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      totalAmount: [item?.TotalAmount, [this._FormvalidationserviceService.AllowDecimalNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      discAmount: [item?.DiscAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      discPer: [item?.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      vatAmount: [item?.GSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      vatPer: [item?.GST || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      grandTotalAmount: [item?.NetAmount, [this._FormvalidationserviceService.AllowDecimalNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mrp: [item?.MRP || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      specification: [item?.Specification || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      cgstper: [item?.CGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      cgstamt: [item?.CGSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      sgstper: [item?.SGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      sgstamt: [item?.SGSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      igstper: [item?.IGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      igstamt: [item?.IGSTAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]], 
      defRate: [item?.DefRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      vendDiscPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      vendDiscAm: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
    });
  }
  get purchasedetailArray(): FormArray {
    return this.PurchaseInsertform.get('tPurchaseDetails') as FormArray;
  }
  //Supplier select obj
  getSelectedSupplierObj(obj) {
    this._PurchaseOrder.getSupplierById(obj.value).subscribe((response) => {
      this.SupplierObj = response;
      this.vSupplierId = this.SupplierObj.supplierId
      this.userFormGroup.patchValue({
        Address: this.SupplierObj.address,
        Mobile: this.SupplierObj.mobile,
        Contact: this.SupplierObj.contactPerson,
        GSTNo: this.SupplierObj.gstNo,
        Email: this.SupplierObj.email,
      })
      this.getSupplierRate();
    });
  }
  // Add Item
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
  deleteTableRow(row: ItemNameList) {
    this.dsItemNameList.data = this.dsItemNameList.data.filter(item => item !== row);
    this._PurchaseOrder.showToast('Record Deleted Successfully.', ToastType.SUCCESS);
    this.updatePurchaseFinalForm();
    if (this.dsItemNameList.data.length == 0) {
      this.FinalPurchaseform.get("TransportCharges").setValue(0)
      this.FinalPurchaseform.get("Freight").setValue(0)
      this.FinalPurchaseform.get("OctriAmount").setValue(0)
    }
  } 
  //Item selected Obj
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
    this.vCGSTPer = obj.cgstPer
    this.vSGSTPer = obj.sgstPer
    this.vIGSTPer = obj.igstPer
    this.vTotalAmount = (parseInt(this.vQty) * parseFloat(this.vRate)).toFixed(2);
    this.vNetAmount = this.vTotalAmount;
    this.vGSTPer = (obj.SGSTPer + obj.CGSTPer + obj.IGSTPer);
    this.vSpecification = obj.Specification || '';
    this.getLastThreeItemInfo();
    this.getSupplierRate();
  } 
  OnSave() {  
    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }  
      debugger 
       const getpatchvalues = { 
      purchaseDate: this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd") || '1900-01-01',
      purchaseTime: this.dateTimeObj.time,
      storeId: this.accountService.currentUserValue.user.storeId,
      supplierId: Number(this.userFormGroup.get('SupplierId').value),
      totalAmount: this.FinalTotalAmt,
      discAmount: this.DiscAmount || 0,
      taxAmount: this.GSTAmount || 0,
      freightAmount:this.FinalPurchaseform.get('Freight').value || 0,
      octriAmount:this.FinalPurchaseform.get('OctriAmount').value || 0,
      grandTotal: this.FinalNetAmount,
      remarks: this.FinalPurchaseform.get('Remark').value || '', 
      paymentTermId: this.paymentterm,
      modeofPayment: this.paymentmode,
      worrenty: this.FinalPurchaseform.get('Worrenty').value || '',
      roundVal: Math.round(this.FinalNetAmount),   
      totCgstamt:this.CGSTFinalAmount || 0,
      totSgstamt:this.SGSTFinalAmount || 0,
      totIgstamt:this.IGSTFinalAmount || 0,
      transportChanges:this.FinalPurchaseform.get('TransportCharges').value || 0,
      handlingCharges: this.FinalPurchaseform.get('HandlingCharges').value || 0,
      freightCharges: this.FinalPurchaseform.get('Freight').value || 0,
      } 
       this.PurchaseInsertform.patchValue(getpatchvalues);
    if (this.PurchaseInsertform.valid) {
      this.purchasedetailArray.clear();
      this.dsItemNameList.data.forEach(item => {
        this.purchasedetailArray.push(this.createPurchasedetailForm(item));
      });

      if (this.registerObj?.purchaseID == 0) {
        console.log(this.PurchaseInsertform.value);
        this._PurchaseOrder.InsertPurchaseSave(this.PurchaseInsertform.value).subscribe(response => {
          this.viewgetPurchaseorderReportPdf(response)
          this.OnReset();
        });
      } else {
        this.PurchaseInsertform.get("purchaseId").setValue(this.registerObj?.purchaseID)
        this.PurchaseInsertform.get("purchaseNo").setValue(String(this.registerObj?.purchaseNo))
        console.log(this.PurchaseInsertform.value);
         this._PurchaseOrder.InsertPurchaseUpdate(this.PurchaseInsertform.value, this.registerObj?.purchaseID).subscribe(response => { 
          this.viewgetPurchaseorderReportPdf(this.registerObj?.purchaseID)
          this.OnReset();
        });
      }
    }
    else {
      let invalidFields = [];
      // if (this.FinalPurchaseform.invalid) {
      //   for (const controlName in this.FinalPurchaseform.controls) {
      //     if (this.FinalPurchaseform.controls[controlName].invalid) { invalidFields.push(`Purchase Form: ${controlName}`); }
      //   }
      // }

      if (this.FinalPurchaseform.invalid) {
        for (const controlName in this.FinalPurchaseform.controls) {
          const control = this.FinalPurchaseform.get(controlName);
          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Purchase details Data : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`Purchase From Data: ${controlName}`);
          }
        }
      }

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Please check this "${field}" is invalid.`, 'Warning',); });
      }
    }
  }
  viewgetPurchaseorderReportPdf(PurchaseID) {
    this.commonService.Onprint("PurchaseID", PurchaseID, "Purchaseorder");
  }
  // Table Calculation 
  getCellCalculation(item: ItemNameList) {
    this._PurchaseOrder.validateCellData(item);
    this._PurchaseOrder.calculateBasicValues(item);
    this._PurchaseOrder.validateGSTRates(item);
    const updatedItem = this.calculateCellGSTType(item);
    Object.assign(item, updatedItem);
    this.updatePurchaseFinalForm();
  }
  //Update footer Values
  updatePurchaseFinalForm() {
    const form = this.userFormGroup;
    const itemList = this.dsItemNameList.data;
    const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    const updatableFormValues: FinalFormModel = {
      TotalAmt: itemList.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(2),
      VatAmount: itemList.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0).toFixed(2),
      NetPayamt: netAmount.toFixed(2),
      RoundingAmt: Math.round(netAmount),
      DiscAmount: itemList.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0).toFixed(2)
    } as FinalFormModel;
    this.RoundingAmt = Math.round(netAmount)
    form.patchValue({
      ...updatableFormValues
    });
  }
  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount), 0);

    let handlingCharges = this.FinalPurchaseform.get('HandlingCharges').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(handlingCharges)).toFixed(2);

    let transportChanges = this.FinalPurchaseform.get('TransportCharges').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(transportChanges)).toFixed(2);

    let Freight = this.FinalPurchaseform.get('Freight').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(Freight)).toFixed(2);

    let OctriAmt = this.FinalPurchaseform.get('OctriAmount').value || 0;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(OctriAmt)).toFixed(2);

    this.FinalNetAmount = Math.ceil(this.FinalNetAmount)
    return this.FinalNetAmount;
  }
  getTotalGST(element) {
    this.GSTAmount = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2); 
    return this.GSTAmount; 
  }
  getTotalDisc(element) {
    this.DiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0);
    if (this.DiscAmount > 0)
      this.DiscAmount = this.DiscAmount.toFixed(2);
    return this.DiscAmount;
  }
  getTotalAmt(element) {
    this.FinalTotalAmt = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    return this.FinalTotalAmt;
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
    //debugger
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
      Qty: '',// item.balanceQty,
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

    setTimeout(() => {
      const nativeElement = this.qtyTextboxRef?.nativeElement;
      if (nativeElement) {
        const inputEl: HTMLInputElement = nativeElement.querySelector('input');
        if (inputEl) {
          inputEl.focus();
        }
      }
    }, 100);
  }
  calculateTotalamt() {
    debugger
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
    //debugger
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
    //debugger
    const form = this.userFormGroup;
    const formValues = form.getRawValue() as PurchaseFormModel;
    const values = this._PurchaseOrder.normalizeValues(formValues);
    const calculation = this._PurchaseOrder.getGSTCalculation(this.GSTTypetext || type, values);

    // Update form with calculated values
    form.patchValue({
      IGST: type === GSTType.GST_AFTER_DISC ? 0 : values.igst,
      CGSTAmount: calculation.cgstAmount.toFixed(2),
      SGSTAmount: calculation.sgstAmount.toFixed(2),
      IGSTAmount: calculation.igstAmount.toFixed(2),
      GSTAmount: calculation.totalGSTAmount.toFixed(2),
      NetAmount: calculation.netAmount.toFixed(2)
    }, { emitEvent: false });
  } 

  calculateCellGSTType(item: ItemNameList): ItemNameList {

    if (!item) return item;
    //debugger
    try {
      const values = this._PurchaseOrder.normalizeValues(item);
      const calculation = this._PurchaseOrder.getGSTCalculation(item.GSTType, values);
      return {
        ...item,
        IGST: item.GSTType === GSTType.GST_AFTER_DISC ? 0 : values.igst,
        CGSTAmount: Number(calculation.cgstAmount.toFixed(2)),
        SGSTAmount: Number(calculation.sgstAmount.toFixed(2)),
        IGSTAmount: Number(calculation.igstAmount.toFixed(2)),
        VatAmount: Number(calculation.totalGSTAmount.toFixed(2)),
        // GST: Number(calculation.totalGSTAmount.toFixed(2)),
        GSTAmount: Number(calculation.totalGSTAmount.toFixed(2)),
        NetAmount: Number(calculation.netAmount.toFixed(2)),
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
  //new 
  vstoreId: any = 0;
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }
  validateFormValues() {
    debugger
    const form = this.userFormGroup;
    const values = form.getRawValue() as PurchaseFormModel;
    if (+values.Qty < 0) {
      this._PurchaseOrder.showToast('Quantity should be greater than 0', ToastType.WARNING);
      form.patchValue({
        Qty: 0,
      });
    }

    // if (+values.MRP < 0) {
    //   this._PurchaseOrder.showToast('MRP should be greater than 0', ToastType.WARNING);
    //   form.patchValue({
    //     MRP: 0,
    //   });
    // }
    if (+values.Rate < 0) {
      this._PurchaseOrder.showToast('Rate should be greater than 0', ToastType.WARNING);
      form.patchValue({
        Rate: 0,
      });
    }
    // if (+values.Rate > +values.MRP) {
    //   this._PurchaseOrder.showToast('Rate should be less than MRP', ToastType.WARNING);
    //   form.patchValue({
    //     Rate: 0,
    //   });
    // }
    if (+values.ConversionFactor < 0) {
      this._PurchaseOrder.showToast('Conversion Factor should be greater than 0', ToastType.WARNING);
      form.patchValue({
        ConversionFactor: 1,
      });
    }
  }
  getchangegstper(rate: any, controlName: string): void {
          const formValues = this.userFormGroup.getRawValue() as GRNFormModel;
          // Predefined valid GST percentages (as numbers)
          const gstValues = [2.5, 6, 9, 14];
  
          const parsedRate = Number(rate);
  
          const isValid = gstValues.includes(parsedRate); 
    
          if (!isValid) {
              this._PurchaseOrder.showToast('Please enter GST percentage as 2.5%, 6%, 9% or 14%', ToastType.WARNING);
              this.userFormGroup.get(controlName)?.setValue('');
              const NameElement = document.querySelector(`[name='{{controlName}}']`) as HTMLElement;
              if (NameElement) {
                  NameElement.focus();
              }
              return;
          }  
          // Safely calculate GST total
          const GSTPer = Number(formValues.CGST || 0) + Number(formValues.SGST || 0) + Number(formValues.IGST || 0);
          this.userFormGroup.patchValue({
              GST: GSTPer
          });
          this.calculateTotalamt(); 
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
      CGSTPer: 0,
      CGSTAmount: 0,
      SGST: 0,
      SGSTPer: 0,
      SGSTAmount: 0,
      IGST: 0,
      IGSTPer: 0,
      GST: 0,
      GSTAmount: 0,
      TotalAmount: "",
      NetAmount: "",
      FinalTotalQty: 0,
      HSNcode: '',
      DefRate: 0
    });
    this.lastsupplierflag = false;
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
  // Last Three item list
  getLastThreeItemInfo() {
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "ItemId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ItemId", "fieldValue": String(this.ItemID), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    this._PurchaseOrder.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data.data as LastThreeItemList[]; this.sIsLoading = '';
    });
  }
  // Retreving Item Details Edit Time
  getOldPurchaseOrder(Id) {
    var Param = {
      "first": 0,
      "rows": 10,
      "sortField": "PurchaseID",
      "sortOrder": 0,
      "filters": [{ "fieldName": "PurchaseID", "fieldValue": String(Id), "opType": "Equals" }],
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
  // Defined Rate Validation
  OnchekPurchaserateValidation() {
    debugger
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
  supplierRateList: any = [];
  getSupplierRate() {
    this.supplierRateList = [];
    var data =
    {
      "first": 0,
      "rows": 10,
      "sortField": "ItemId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ItemId", "fieldValue": String(this.ItemID), "opType": "Equals" },
      { "fieldName": "SupplierId", "fieldValue": String(this.vSupplierId), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    } 
    this._PurchaseOrder.getSupplierRateList(data).subscribe(data => { 
      //debugger
      if (data.data[0]) {
        let SupplierRate = data.data[0].supplierRate;
        this.vDefRate = SupplierRate;
        console.log(this.vDefRate)
      }
    });
  }
  onKeydown(e, data) { }
  // @HostListener('document:keydown', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  // if (event.key === 'F4') {
  // this.OnSavenew();
  // } else if (event.key === 'F5') {

  //   this.OnSaveEdit();
  // }
  // }
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

