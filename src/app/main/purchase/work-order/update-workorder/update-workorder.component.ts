import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { WorkOrderService } from '../work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { GRNItemResponseType, GSTType, ToastType } from '../../good-receiptnote/new-grn/types';
import { PurchaseFormModel } from '../../purchase-order/update-purchaseorder/types';
import { FinalFormModel } from '../../purchase-order/new-purchaseorder/types';

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
  screenFromString = 'Common-form';

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

  autocompletestore: string = "Store";
  autocompleteSupplier: string = "SupplierMaster"
  autocompleteModeGSTType: string = "GstCalcType";

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();

  constructor(public _WorkOrderService: WorkOrderService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateWorkorderComponent>,
    private accountService: AuthenticationService,
    private snackBarService: SnackBarService,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
    this.WorkOrderStoreForm = this._WorkOrderService.createStoreFrom();
    this.WorkorderItemForm = this._WorkOrderService.getWorOrderItemForm();
    this.WorkorderFinalForm = this._WorkOrderService.getWorkOrderFinalForm();
    this.WorkOrderStoreForm.markAllAsTouched();
    this.WorkorderItemForm.markAllAsTouched();
    this.WorkorderFinalForm.markAllAsTouched();



    if (this.data) {
      // this.registerObj = this.data;
      console.log(this.data)
      this.vWorkId = this.data.Obj.woId
      console.log(this.data.Obj.woId)
      this.WorkOrderStoreForm.get('StoreId').setValue(this.data.Obj.storeId);
      this.WorkOrderStoreForm.get('SupplierName').setValue(this.data.Obj.supplierId);
      this.WorkorderFinalForm.get('Remark').setValue(this.data.Obj.woRemark);
      this.WorkorderFinalForm.get('discAmount').setValue(this.data.Obj.woDiscAmount);
      this.WorkorderFinalForm.get('totalAmount').setValue(this.data.Obj.woTotalAmount);
      this.WorkorderFinalForm.get('vatAmount').setValue(this.data.Obj.woVatAmount);
      this.WorkorderFinalForm.get('netAmount').setValue(this.data.Obj.woNetAmount);
      this.WorkOrderStoreForm.get('workId').setValue(this.data.Obj.woId);

      this.getWorkOrderItemDetailList(this.vWorkId);
    }
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

debugger
      const formValues = this.WorkorderItemForm.getRawValue() as PurchaseFormModel;
      console.log(formValues)
      if (formValues.ItemName) {
        const newItem = new ItemNameList({
          ...formValues,
          ItemName: formValues.ItemName.itemName,
          ItemID: formValues.ItemName.itemId,
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
    const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    const updatableFormValues: FinalFormModel = {
      totalAmount: itemList.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(4),
      vatAmount: itemList.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0).toFixed(4),
      netAmount: netAmount.toFixed(4),
      discAmount: itemList.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0).toFixed(4)
    } as FinalFormModel;

    form.patchValue({
      ...updatableFormValues
    });
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
      ItemID: '',
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
  //   calculateTotalAmount() {
  //     
  //     if (this.WorkorderItemForm.get("Qty").value > 0 && this.WorkorderItemForm.get("UnitRate").value > 0) {
  //       // if (this.vQty  && this.vRate) {
  //       this.vTotalAmount = (parseFloat(this.WorkorderItemForm.get("Qty").value) * parseInt(this.WorkorderItemForm.get("UnitRate").value)).toFixed(2);
  //       this.vNetAmount = parseFloat(this.vTotalAmount);
  //     }else{
  //       this.WorkorderItemForm.get('TotalAmount').setValue(0);
  //       this.WorkorderItemForm.get('DiscAmt').setValue(0);
  //       this.WorkorderItemForm.get('GSTAmount').setValue(0);
  //       this.WorkorderItemForm.get('NetAmount').setValue(0);
  //     }
  //     this.calculateDiscperAmount();
  //      this.calculateGSTType();
  //   // }
  // }

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



  calculateDiscperAmount() {

    let disc = this.WorkorderItemForm.get('Disc').value || 0;
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
    // this.calculateDiscAmount();
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
      // IGST: type === GSTType.GST_AFTER_DISC ? 0 : values.igst,
      // CGSTAmount: calculation.cgstAmount.toFixed(2),
      // SGSTAmount: calculation.sgstAmount.toFixed(2),
      // IGSTAmount: calculation.igstAmount.toFixed(2),
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
debugger


    if (contact.Qty > 0 && contact.Rate > 0) {
      if (this.GSTTypeName == 'GST After Disc') {

        //total amt
        contact.TotalAmount = (parseFloat(contact.Qty) * parseFloat(contact.Rate)).toFixed(2);;
        //disc
        contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);;
        let TotalAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount));
        //Gst
        contact.GSTAmount = (((TotalAmt) * parseFloat(contact.GST)) / 100).toFixed(2);;
        contact.NetAmount = ((TotalAmt) + parseFloat(contact.GSTAmount)).toFixed(2);;

      }
      else if (this.GSTTypeName == 'GST Before Disc') {
        //total amt
        contact.TotalAmount = (parseFloat(contact.Qty) * parseFloat(contact.Rate)).toFixed(2);;
        //Gst
        contact.GSTAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.GST)) / 100).toFixed(2);;
        let totalAmt = (parseFloat(contact.TotalAmount) + parseFloat(contact.GSTAmount));
        //disc
        contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);;
        contact.NetAmount = ((totalAmt) - parseFloat(contact.DiscAmount)).toFixed(2);;
      }
    }
    else {
      contact.TotalAmount = 0;
      contact.DiscAmount = 0;
      contact.VATAmount = 0;
      contact.NetAmount = 0;
    }
  }
  getTotalNet(element) {
    this.FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0).toFixed(2);
    return this.FinalNetAmount;
  }
  getTotalVAT(element) {
    this.FinalVatAmount = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
    return this.FinalVatAmount;
  }
  getTotalDisc(element) {
    this.FinalDiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0).toFixed(2);
    return this.FinalDiscAmount;
  }
  getTotalAmt(element) {
    this.FinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    return this.FinalTotalAmount;
  }
  OnSave() {

    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if (this.WorkorderFinalForm.invalid) {
    //   this.toastr.warning('please check from is invalid', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    // if ((!this.WorkOrderStoreForm.get("SupplierName").value)) {
    //   this.toastr.warning('Please enter a SupplierName', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    console.log(this.WorkOrderStoreForm.value)
    debugger
if(!this.WorkOrderStoreForm.invalid){
    let InsertWorkDetailarrayObj = [];

    let insertWorkObj = {};
    insertWorkObj['woId'] = 0
    insertWorkObj['date'] = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd")
    insertWorkObj['time'] = this.dateTimeObj.time
    insertWorkObj['storeId'] = this.WorkOrderStoreForm.get("StoreId").value
    insertWorkObj['supplierID'] = this.WorkOrderStoreForm.get("SupplierName").value
    insertWorkObj['totalAmount'] = this.WorkorderFinalForm.get("totalAmount").value
    insertWorkObj['vatAmount'] = this.WorkorderFinalForm.get("vatAmount").value
    insertWorkObj['discAmount'] = this.WorkorderFinalForm.get("discAmount").value
    insertWorkObj['netAmount'] = this.WorkorderFinalForm.get("netAmount").value
    insertWorkObj['isclosed'] = true
    insertWorkObj['remark'] = this.WorkorderFinalForm.get("Remark").value
    insertWorkObj['addedBy'] = this.accountService.currentUserValue.userId;
    insertWorkObj['isCancelled'] = false;
    insertWorkObj['isCancelledBy'] = 0;



    let UpdateWorkObj = {};
    UpdateWorkObj['woId'] = this.vWorkId
    UpdateWorkObj['storeId'] = this.WorkOrderStoreForm.get("StoreId").value
    UpdateWorkObj['supplierID'] = this.WorkOrderStoreForm.get("SupplierName").value
    UpdateWorkObj['totalAmount'] = this.WorkorderFinalForm.get("totalAmount").value
    UpdateWorkObj['vatAmount'] = this.WorkorderFinalForm.get("vatAmount").value
    UpdateWorkObj['discAmount'] = this.WorkorderFinalForm.get("discAmount").value
    UpdateWorkObj['netAmount'] = this.WorkorderFinalForm.get("netAmount").value
    UpdateWorkObj['isclosed'] = true
    UpdateWorkObj['remark'] = this.WorkorderFinalForm.get("Remark").value
    UpdateWorkObj['updatedBy'] = this.accountService.currentUserValue.userId;

    this.dsItemNameList.data.forEach((element) => {
      let insertWorkDetailaObj = {};
      insertWorkDetailaObj['woId'] = this.vWorkId;
      insertWorkDetailaObj['itemName'] = element.ItemName;
      insertWorkDetailaObj['qty'] = element.Qty;
      insertWorkDetailaObj['rate'] = element.Rate;
      insertWorkDetailaObj['totalAmount'] = element.TotalAmount;
      insertWorkDetailaObj['discAmount'] = element.DiscAmount;
      insertWorkDetailaObj['discPer'] = element.DiscPer;
      insertWorkDetailaObj['vatAmount'] = element.GSTAmount;
      insertWorkDetailaObj['vatPer'] = element.GST;;
      insertWorkDetailaObj['netAmount'] = element.NetAmount;
      insertWorkDetailaObj['remark'] = "";

      InsertWorkDetailarrayObj.push(insertWorkDetailaObj);
    });

    if (this.vWorkId == 0) {
      console.log(this.WorkorderFinalForm.value)
      let submitData = {
        "workOrders": insertWorkObj,//this.WorkorderFinalForm.value,
        "workOrderDetails": InsertWorkDetailarrayObj,
      };
      console.log(submitData);
      this._WorkOrderService.InsertWorkorderSave(submitData).subscribe(response => {
        this.toastr.success(response.message);
        if (response) {
          this.viewgetWorkorderReportPdf(response)
          this._matDialog.closeAll();
        }
      });
    } else {

      let submitData = {
        "updateWorkOrders": UpdateWorkObj,
        "workOrderDetail": InsertWorkDetailarrayObj
      };
      console.log(submitData);
      this._WorkOrderService.WorkorderUpdate(submitData).subscribe(response => {
        this.toastr.success(response.message);
       this.viewgetWorkorderReportPdf(response)
          this._matDialog.closeAll();
        
      });
    }
  }else {
        let invalidFields = [];

        if (this.WorkorderFinalForm.invalid) {
          for (const controlName in this.WorkorderFinalForm.controls) {
            if (this.WorkorderFinalForm.controls[controlName].invalid) {
              invalidFields.push(`Final Form: ${controlName}`);
            }
          }
        }
        if (this.WorkOrderStoreForm.invalid) {
          for (const controlName in this.WorkOrderStoreForm.controls) {
            if (this.WorkOrderStoreForm.controls[controlName].invalid) {
              invalidFields.push(`Store Form: ${controlName}`);
            }
          }
        }
        if (invalidFields.length > 0) {
          invalidFields.forEach(field => {
            this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
            );
          });
        }

      }
  }

  viewgetWorkorderReportPdf(WOId) {

  }

  ItemFromReset() {
    this.WorkorderItemForm.reset({
      // SupplierName: '',
      // GSTType: '',
      WorkId: '',
      ItemName: '',
      ItemID: 0,
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