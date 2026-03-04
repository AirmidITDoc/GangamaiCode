import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { GRNItemResponseType, GSTType, ToastType } from '../../good-receiptnote/new-grn/types';
import { FinalFormModel } from '../../purchase-order/new-purchaseorder/types';
import { PurchaseFormModel } from '../../purchase-order/purchase-requisition/types';
import { WorkOrderService } from '../work-order.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-update-workorder',
  templateUrl: './update-workorder.component.html',
  styleUrls: ['./update-workorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateWorkorderComponent implements OnInit {
  WorkOrderStoreForm: FormGroup;
  WorkorderItemForm: FormGroup;
  WorkorderFinalForm: FormGroup;


  displayedColumnsnew: string[] = [
    'ItemName',
    'Qty',
    'Rate',
    'TotalAmount',
    'DiscPer',
    'DiscAmount',
    'Vat',
    'VatAmt',
    'NetAmt',
    //'Specification' ,
    'action'
  ];

  ItemID: any = 0;
  ItemName: any;
  chargeslist: any = [];
  FinalNetAmount: any;
  FinalTotalAmount: any;
  FinalDiscAmount: any;
  FinalVatAmount: any;
  Remark: any;
  vQty: any;
  vRate: any;
  vDis: any;
  vTotalAmount: any;
  vDiscAmt: any;
  vGST: any;
  vGSTAmt: any;
  vNetAmount: any;
  vSpecification: any;
  isSupplierIdSelected: boolean = false;
  dateTimeObj: any;
  filteredOptionssupplier: any;
  noOptionFoundsupplier: any;
  GSTType: any;
  GSTTypeList: any;
  registerObj: any;
  vSupplierId: any;
  vWorkId: any = 0;
  vItemName: any;
  workOrderForm: FormGroup;
  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  autocompleteModeGSTType: string = "GstCalcType";
  autocompleteModeGSTTypesValues: string = "GSTTypes";

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();

  constructor(public _WorkOrderService: WorkOrderService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateWorkorderComponent>,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService) { }

  ngOnInit(): void {
    this.WorkOrderStoreForm = this._WorkOrderService.createStoreFrom();
    this.WorkorderItemForm = this._WorkOrderService.getWorOrderItemForm();
    this.WorkorderFinalForm = this._WorkOrderService.getWorkOrderFinalForm();
    this.WorkOrderStoreForm.markAllAsTouched();
    this.WorkorderItemForm.markAllAsTouched();
    this.WorkorderFinalForm.markAllAsTouched();

    this.workOrderForm = this.CreateworkOrderForm();
    this.workOrderArray.push(this.createworkOrderInsert());

    if (this.data) {
      // this.registerObj = this.data;
      console.log(this.data)
      this.vWorkId = this.data.Obj.woId
      console.log(this.data.Obj.woId)
      this.WorkOrderStoreForm.get('StoreId').setValue(this.data.Obj.storeId);
      this.WorkOrderStoreForm.get('SupplierName').setValue(this.data.Obj.supplierId);
      this.WorkorderFinalForm.get('Remark').setValue(this.data.Obj.woRemark);
      this.WorkorderFinalForm.get('discAmount').setValue(this.data.Obj.woDiscAmount ?? 0);
      this.WorkorderFinalForm.get('totalAmount').setValue(this.data.Obj.woTotalAmount ?? 0);
      this.WorkorderFinalForm.get('vatAmount').setValue(this.data.Obj.woVatAmount);
      this.WorkorderFinalForm.get('netAmount').setValue(this.data.Obj.woNetAmount);
      this.WorkOrderStoreForm.get('workId').setValue(this.data.Obj.woId);

      this.getWorkOrderItemDetailList(this.vWorkId);
    }
  }

  CreateworkOrderForm() {
    return this._formBuilder.group({
      workOrders: this._formBuilder.group({
        woId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
        time: [this.datePipe.transform(new Date(), 'shortTime')],
        storeId: [this.accountService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        supplierID: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        vatAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        discAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        isclosed: false,
        remark: [''],
        addedby: [this.accountService.currentUserValue.userId],
        updatedBy: [this.accountService.currentUserValue.userId],
        isCancelled: false,
        isCancelledBy: 0
      }),
      workOrderDetails: this._formBuilder.array([]),
    })
  }

  createworkOrderInsert(element: any = {}): FormGroup {
    return this._formBuilder.group({
      woId: [this.vWorkId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemName: [element.ItemName],
      qty: [element.Qty],
      rate: [element.Rate],
      totalAmount: [element.TotalAmount],
      discPer: [element.DiscPer ?? 0],
      discAmount: [element.DiscAmount ?? 0],
      vatPer: [element.GST ?? 0],
      vatAmount: [element.GSTAmount ?? 0],
      netAmount: [element.NetAmount],
      remark: "",
    });
  }

  get workOrderArray(): FormArray {
    return this.workOrderForm.get('workOrderDetails') as FormArray;
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getWorkOrderItemDetailList(Id) {

    var Param = {

      "first": 0,
      "rows": 10,
      "sortField": "WOId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "WOId",
          "fieldValue": String(Id),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._WorkOrderService.getItemListUpdates(Param).subscribe(data => {
      this.dsItemNameList.data = data.data as ItemNameList[];
      this.chargeslist = data as ItemNameList[];

      this.dsItemNameList.data.forEach(element => {

        console.log(element)

        element.ItemName = element.itemName,
          element.Qty = element.qty,
          element.Rate = element.rate,
          element.TotalAmount = element.totalAmount,
          element.NetAmount = element.netAmount,
          element.DiscAmount = element.discAmount,
          element.DiscPer = element.discPer,
          element.GST = element.vatPer,
          element.GSTAmount = element.vatAmount,
          element.Remark = element.remark

      });
      console.log(this.dsItemNameList);
      this.getGSTTotalAmt(this.dsItemNameList.data);
    });
  }

  getSelectedObj(obj) {
    console.log(obj);
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.vQty = ''
    this.vRate = '';
    this.vTotalAmount = 0;
    this.vDis = '';
    this.vDiscAmt = 0;
    this.vGST = obj.VatPercentage;
    this.vGSTAmt = 0;
    this.vNetAmount = 0;
  }

  vstoreId: any = "2";
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }

  getSelectedSupplierObj(obj) {
    // setTimeout(() => {
    //   this._PurchaseOrder.getSupplierById(obj.value).subscribe((response) => {
    //     this.SupplierObj = response;
    //     console.log(response)
    //     this.vSupplierId = this.SupplierObj.supplierId
    //     
    //     this.vAddress = this.SupplierObj.address;
    //     this.vMobile = this.SupplierObj.mobile;
    //     this.vContact = this.SupplierObj.contactPerson;
    //     this.vGSTNo = this.SupplierObj.gstNo;
    //     this.vEmail = this.SupplierObj.email;
    //     this.getSupplierRate();

    //   });

    // }, 100);
  }

  onAdd() {

    if ((this.WorkorderItemForm.get("Qty").value == 0 || this.WorkorderItemForm.get("Qty").value == "")) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.WorkorderItemForm.get("UnitRate").value == 0 || this.WorkorderItemForm.get("UnitRate").value == "")) {
      this.toastr.warning('Please enter a Rate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const isDuplicate = this.dsItemNameList.data.some(item => item.ItemId === this.WorkorderItemForm.get('ItemName').value.itemId);
    if (!isDuplicate) {

      this.chargeslist = this.dsTempItemNameList.data;

      const formValues = this.WorkorderItemForm.getRawValue() as PurchaseFormModel;
      console.log(formValues)
      if (formValues.ItemName) {
        const selectedItem = this.WorkorderItemForm.get('ItemName').value; ///////// need to check
        const newItem = new ItemNameList({
          ...formValues,
          ItemName: selectedItem.itemName,
          ItemId: selectedItem.itemId,
          Rate: formValues.UnitRate,// this.userFormGroup.get("Rate").value,// this.vRate || 0,
          Qty: formValues.Qty || 0,
          TotalAmount: formValues.TotalAmount || 0,
          DiscPer: formValues.Disc || 0,
          DiscAmount: formValues.DiscAmount || 0,
          GST: formValues.GST || 0,
          GSTAmount: formValues.GSTAmount || 0,
          NetAmount: formValues.NetAmount || 0,
          MRP: formValues.MRP || 0,

        });
        this.dsItemNameList.data = [...this.dsItemNameList.data, newItem];
        this.updateFinalForm();
      }
    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ResetItem();
    const itemNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
    if (itemNameElement) {
      itemNameElement.focus();
    }
  }

  updateFinalForm() {
    const form = this.WorkorderFinalForm;
    const itemList = this.dsItemNameList.data;

    const totalAmount = +itemList.reduce((sum, { TotalAmount }) => sum + +(TotalAmount || 0), 0).toFixed(2);

    const vatAmount = +itemList.reduce((sum, { GSTAmount }) => sum + +(GSTAmount || 0), 0).toFixed(2);

    const netAmount = +itemList.reduce((sum, { NetAmount }) => sum + +(NetAmount || 0), 0).toFixed(2);

    const discAmount = +itemList.reduce((sum, { DiscAmount }) => sum + +(DiscAmount || 0), 0).toFixed(2);

    form.patchValue(
      {
        totalAmount,
        vatAmount,
        netAmount,
        discAmount,
      },
      { emitEvent: false }
    );

    form.get('discAmount')?.markAsPristine();
    form.get('discAmount')?.markAsUntouched();
    form.get('vatAmount')?.markAsPristine();
    form.get('vatAmount')?.markAsUntouched();
  }

  getSelectedItem(item: GRNItemResponseType): void {
    console.log(item)

    this.WorkorderItemForm.patchValue({
      UOMId: item.umoId,
      ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
      Qty: '',// item.balanceQty,
      CGSTPer: item.cgstPer,
      SGSTPer: item.sgstPer,
      IGSTPer: item.igstPer,
      GST: item.cgstPer + item.sgstPer + item.igstPer,
      HSNcode: item.hsNcode
    });
  }

  ResetItem() {
    const form = this.WorkorderItemForm;

    form.patchValue({
      WorkId: '',
      ItemName: '',
      ItemId: '',
      Qty: '',
      UnitRate: '',
      TotalAmount: '',
      Disc: '',
      DiscAmount: '',
      GST: '',
      GSTAmount: '',
      VatAmt: '',
      NetAmount: '',
      Specification: '',
    });
    this.WorkorderItemForm.markAsUntouched();
  }

  deleteTableRow(element) {
    let index = this.dsItemNameList.data.findIndex(x => x.ItemId === element.ItemId);
    if (index >= 0) {
      this.dsItemNameList.data.splice(index, 1);
      this.dsItemNameList.data = [...this.dsItemNameList.data]; // refresh table
      this.chargeslist = [...this.dsItemNameList.data]; // sync chargeslist
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  calculateTotalAmount() {

    this.validateFormValues();
    const form = this.WorkorderItemForm;
    const final = this.WorkorderFinalForm;
    const qty = +form.get('Qty').value || 0;
    const rate = +form.get('UnitRate').value || 0;

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
      // form.patchValue({
      //   TotalAmount: 0,
      //   DiscAmount: 0,
      //   GSTAmount: 0,
      //   NetAmount: 0,

      // });
    }

    // final.patchValue  ({
    //     FinalDiscAmount:this.FinalDiscAmount,
    //     FinalTotalAmount: totalAmount,
    //     // NetAmount: netAmount,
    //     FinalNetAmount:this.FinalNetAmount
    // });
    this.calculateDiscperAmount();
    // this.calculateGSTType();

  }

  validateFormValues() {
    const form = this.WorkorderItemForm;
    const values = form.getRawValue() as PurchaseFormModel;
    if (+values.Qty < 0) {
      this._WorkOrderService.showToast('Quantity should be greater than 0', ToastType.WARNING);
      form.patchValue({
        Qty: 0,
      });
    }

    if (+values.MRP < 0) {
      this._WorkOrderService.showToast('MRP should be greater than 0', ToastType.WARNING);
      form.patchValue({
        MRP: 0,
      });
    }
    if (+values.Rate < 0) {
      this._WorkOrderService.showToast('Rate should be greater than 0', ToastType.WARNING);
      form.patchValue({
        Rate: 0,
      });
    }
    if (+values.Rate > +values.MRP) {
      this._WorkOrderService.showToast('Rate should be less than MRP', ToastType.WARNING);
      form.patchValue({
        Rate: 0,
      });
    }

  }

  getchangegstper(rate: any): void {
    this.calculateDiscperAmount();
  }

  calculateDiscperAmount() {
    let disc = this.WorkorderItemForm.get('Disc').value || 0;
    this.vGST = this.WorkorderItemForm.get('GST').value || 0;
    if (disc >= 100) {
      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.WorkorderItemForm.get('Disc').setValue(0);
    }
    if (disc) {
      this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2) || 0;
      this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(2);

      if (this.WorkOrderStoreForm.get('GSTType').value.Name == "GST After Disc") {

        this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
        let totalamt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(2);

        this.vGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vGST)) / 100).toFixed(2);

        this.vNetAmount = (parseFloat(totalamt) + parseFloat(this.vGSTAmt)).toFixed(2);

      } else {
        this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
        this.vGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vGST)) / 100).toFixed(2);
        let totalamt = (parseFloat(this.vTotalAmount) + (parseFloat(this.vGSTAmt))).toFixed(2);
        this.vNetAmount = ((parseFloat(totalamt)) - parseFloat(this.vDiscAmt)).toFixed(2);
      }
    } else {
      this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
      this.vGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vGST)) / 100).toFixed(2);
      let totalamt = (parseFloat(this.vTotalAmount) + (parseFloat(this.vGSTAmt))).toFixed(2);
      this.vNetAmount = ((parseFloat(totalamt)) - parseFloat(this.vDiscAmt)).toFixed(2);
    }
  }

  finalCalculation() {
    this.calculateTotalAmount();
    // this.calculateDiscperAmount();
    this.calculateDiscperAmount();
    if (this.dsItemNameList.data.length > 0) {
      for (let i = 0; i < this.dsItemNameList.data.length; i++) {
        this.getCellCalculation(this.dsItemNameList.data[i], null);
      }
    }
  }

  GSTTypeName = "GST Before Disc"
  IsDiscPer2: boolean = false;
  onGSTTypeChange(event: { value: number, text: string }) {
    console.log(event)
    this.GSTTypeName = event.text
    this.calculateGSTType(event.text as GSTType);
    if (event.text == "GST After TwoTime Disc") {
      this.IsDiscPer2 = true
    } else {
      this.IsDiscPer2 = false
    }
  }

  calculateGSTType(type: GSTType = GSTType.GST_BEFORE_DISC) {
    const form = this.WorkorderItemForm;
    const formValues = form.getRawValue() as PurchaseFormModel;
    const values = this._WorkOrderService.normalizeValues(formValues);
    const calculation = this._WorkOrderService.getGSTCalculation(formValues.GSTType || type, values);

    // Update form with calculated values
    form.patchValue({

      GSTAmount: calculation.totalGSTAmount.toFixed(2),
      NetAmount: calculation.netAmount.toFixed(2)
    }, { emitEvent: false });
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
  getCellCalculation(contact, ReceiveQty) {
    const qty = parseFloat(contact.Qty) || 0;
    const rate = parseFloat(contact.Rate) || 0;
    const discPer = parseFloat(contact.DiscPer) || 0;
    const gst = parseFloat(contact.GST) || 0;

    if (qty > 0 && rate > 0) {
      if (this.GSTTypeName == 'GST After Disc') {
        contact.TotalAmount = parseFloat((qty * rate).toFixed(2));
        contact.DiscAmount = parseFloat(((contact.TotalAmount * discPer) / 100).toFixed(2));

        let TotalAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount));

        contact.GSTAmount = parseFloat(((TotalAmt * gst) / 100).toFixed(2));
        contact.NetAmount = ((TotalAmt) + parseFloat(contact.GSTAmount)).toFixed(2);;

      }
      else if (this.GSTTypeName == 'GST Before Disc') {

        contact.TotalAmount = parseFloat((qty * rate).toFixed(2));
        contact.GSTAmount = parseFloat(((contact.TotalAmount * gst) / 100).toFixed(2));

        let totalAmt = (parseFloat(contact.TotalAmount) + parseFloat(contact.GSTAmount));

        contact.DiscAmount = parseFloat(((contact.TotalAmount * discPer) / 100).toFixed(2));
        contact.NetAmount = ((totalAmt) - parseFloat(contact.DiscAmount)).toFixed(2);;
      }
    }
    else {
      contact.TotalAmount = 0;
      contact.DiscAmount = 0;
      contact.VATAmount = 0;
      contact.NetAmount = 0;
    }
    this.getGSTTotalAmt([contact]);
    // this._WorkOrderService.validateGSTRates(contact);
  }

  getGSTTotalAmt(element: any[]) {
    if (!element || !Array.isArray(element)) {
      element = [];
    }

    this.FinalNetAmount = +element.reduce((sum, { NetAmount }) => sum + +(NetAmount || 0), 0).toFixed(2);
    this.FinalVatAmount = +element.reduce((sum, { GSTAmount }) => sum + +(GSTAmount || 0), 0).toFixed(2);
    this.FinalDiscAmount = +element.reduce((sum, { DiscAmount }) => sum + +(DiscAmount || 0), 0).toFixed(2);
    this.FinalTotalAmount = +element.reduce((sum, { TotalAmount }) => sum + +(TotalAmount || 0), 0).toFixed(2);

    this.WorkorderFinalForm.patchValue({
      discAmount: this.FinalDiscAmount ?? 0,
      totalAmount: this.FinalTotalAmount ?? 0,
      vatAmount: this.FinalVatAmount ?? 0,
      netAmount: this.FinalNetAmount ?? 0
    }, { emitEvent: false });

    // reset error state (optional)
    Object.keys(this.WorkorderFinalForm.controls).forEach(key => {
      this.WorkorderFinalForm.get(key)?.markAsPristine();
      this.WorkorderFinalForm.get(key)?.markAsUntouched();
    });
  }

  OnSave() {
    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const formattedDate = this.datePipe.transform(this.workOrderForm.get('workOrders.date').value, "yyyy-MM-dd");
    const formattedTime = this.datePipe.transform(new Date(), "HH:mm:ss");
    this.workOrderForm.get('workOrders.date').setValue(formattedDate);
    this.workOrderForm.get('workOrders.time').setValue(formattedDate + ' ' + formattedTime);
    debugger
    this.workOrderForm.get('workOrders.supplierID').setValue(this.WorkOrderStoreForm.get("SupplierName").value)
    this.workOrderForm.get('workOrders.totalAmount').setValue(this.WorkorderFinalForm.get("totalAmount").value)
    this.workOrderForm.get('workOrders.vatAmount').setValue(this.WorkorderFinalForm.get("vatAmount").value)
    this.workOrderForm.get('workOrders.discAmount').setValue(this.WorkorderFinalForm.get("discAmount").value)
    this.workOrderForm.get('workOrders.netAmount').setValue(this.WorkorderFinalForm.get("netAmount").value)
    this.workOrderForm.get('workOrders.remark').setValue(this.WorkorderFinalForm.get("Remark").value)




    this.workOrderArray.clear();
    this.dsItemNameList.data.forEach(item => {
      this.workOrderArray.push(this.createworkOrderInsert(item));
    });
    console.log(this.workOrderForm.value)
    console.log(this.WorkorderFinalForm.value)
    // if (!this.workOrderForm.invalid) {

      if (this.vWorkId == 0) {
        (this.workOrderForm.get('workOrders') as FormGroup).removeControl('updatedBy');

        console.log(this.workOrderForm.value)
        this._WorkOrderService.InsertWorkorderSave(this.workOrderForm.value).subscribe(response => {
          this.viewgetWorkorderReportPdf(response)
          this._matDialog.closeAll();
        });
      }
      else {
        this.workOrderForm.get('workOrders.woId').setValue(this.vWorkId),

          (this.workOrderForm.get('workOrders') as FormGroup).removeControl('addedby');
        (this.workOrderForm.get('workOrders') as FormGroup).removeControl('isCancelled');
        (this.workOrderForm.get('workOrders') as FormGroup).removeControl('isCancelledBy');

        console.log(this.workOrderForm.value);
        this._WorkOrderService.WorkorderUpdate(this.workOrderForm.value).subscribe(response => {
          this.viewgetWorkorderReportPdf(response)
          this._matDialog.closeAll();

        });
      }
    // } else {
    //   let invalidFields = [];

    //   if (this.workOrderForm.invalid) {
    //     for (const controlName in this.workOrderForm.controls) {
    //       if (this.workOrderForm.controls[controlName].invalid) {
    //         invalidFields.push(`Final Form: ${controlName}`);
    //       }
    //     }
    //   }
    //   if (this.WorkOrderStoreForm.invalid) {
    //     for (const controlName in this.WorkOrderStoreForm.controls) {
    //       if (this.WorkOrderStoreForm.controls[controlName].invalid) {
    //         invalidFields.push(`Store Form: ${controlName}`);
    //       }
    //     }
    //   }
    //   if (invalidFields.length > 0) {
    //     invalidFields.forEach(field => {
    //       this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
    //       );
    //     });
    //   }

    // }
  }

  viewgetWorkorderReportPdf(element) {
    this.commonService.Onprint("WOId", element, "WorkOrder");
  }

  ItemFromReset() {
    this.WorkorderItemForm.reset({
      // SupplierName: '',
      // GSTType: '',
      WorkId: '',
      ItemName: '',
      ItemId: 0,
      Qty: '',
      UnitRate: 0,
      TotalAmount: 0,
      Disc: 0,
      DiscAmount: 0,
      GST: 0,
      GSTAmount: 0,
      VatAmt: 0,
      NetAmount: 0,
      Specification: '',
    });
  }


  onClose() {
    this._matDialog.closeAll();
    this.WorkorderItemForm.reset();
    this.dsItemNameList.data = [];
    this.chargeslist.data = [];
  }
  OnReset() {
    this.WorkorderItemForm.reset();
    this.dsItemNameList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList.data = [];
  }


  selectedRowIndex: any;
  arrowUpEvent() {
    this.selectedRowIndex--;
  }

  arrowDownEvent() {
    this.selectedRowIndex++;
  }
  highlight(contact: any) {
    this.selectedRowIndex = contact;
  }


}
export class ItemNameList {
  ItemId: any;
  ItemName: string;
  itemName: string;
  qty: any;
  rate: any;
  totalAmount: any;
  discAmount: any;
  discPer: any;
  vatPer: number;
  vatAmount: number;
  netAmount: number;
  remark: string;
  WorkId: any;
  ConstantId: any;
  WORemark: any;
  WODiscAmount: any;
  WOTotalAmount: any;
  WoNetAmount: any;
  WOVatAmount: any;
  UnitRate: any;



  Qty: any;
  Rate: any;
  TotalAmount: any;
  DiscAmount: any;
  DiscPer: any;
  GST: number;
  GSTAmount: number;
  NetAmount: number;
  Remark: string;

  constructor(ItemNameList) {
    {
      this.ItemName = ItemNameList.ItemName || "";
      this.itemName = ItemNameList.itemName || "";
      this.ItemId = ItemNameList.ItemId || 0;
      this.qty = ItemNameList.qty || 0;
      this.rate = ItemNameList.rate || 0;
      this.totalAmount = ItemNameList.totalAmount || 0;
      this.discPer = ItemNameList.discPer || 0;
      this.discAmount = ItemNameList.discAmount || 0;
      this.vatPer = ItemNameList.vatPer || 0;
      this.vatAmount = ItemNameList.vatAmount || 0;
      this.netAmount = ItemNameList.NetAmount || 0;
      this.remark = ItemNameList.Remark || "";
      this.WorkId = ItemNameList.WorkId || 0;
      this.ConstantId = ItemNameList.ConstantId || 0;
      this.UnitRate = ItemNameList.UnitRate || 0;



      this.Qty = ItemNameList.Qty || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.DiscAmount = ItemNameList.DiscAmount || 0;
      this.DiscPer = ItemNameList.DiscPer || 0;
      this.GST = ItemNameList.GST || 0;
      this.GSTAmount = ItemNameList.GSTAmount || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
      this.Remark = ItemNameList.Remark || 0;
    }
  }
}