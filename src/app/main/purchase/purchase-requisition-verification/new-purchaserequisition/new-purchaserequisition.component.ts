import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseRequisitionVerificationService } from '../purchase-requisition-verification.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { GRNItemResponseType } from '../../good-receiptnote/new-grn/types';
import { fuseAnimations } from '@fuse/animations';
import { StoreUnitContextService } from 'app/main/shared/services/storeunit-context.service';

@Component({
  selector: 'app-new-purchaserequisition',
  templateUrl: './new-purchaserequisition.component.html',
  styleUrls: ['./new-purchaserequisition.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPurchaserequisitionComponent {
  PrequiSaveFrom: FormGroup;
  PrequiItemSaveFrom: FormGroup;
  displayedColumns = [
    'ItemID',
    'ItemName',
    // 'IndentQuantity',
    'VerifyQuantity',
    'Action'
  ];

    Stores = [];

  vsaveflag: boolean = true;
    showAutocomplete = false;
  vprintflag: boolean = false;
  vItemId: any;
  ItemName: any;
  vstoreId: any = 0;
  storeId = 0
  vQty: any;
  chargeslist: any = [];
  vRemark: any;
  purchaseRequisitionId: any = 0;
  vToStoreId: any = 0;
  vItemNamekit: any;
  vQtykit: any;
  registerObj: any;
  ItemID = 0;
  dateTimeObj: any;
  status: any;
  Qty = 0
  ApiUrl = ''
  dsRequisitionList = new MatTableDataSource<IndentNameList>();
  dsTempItemNameList = new MatTableDataSource<IndentNameList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autocompletestore: string = "Store";
  autocompleteitem: string = "ItemType"; //Item

  constructor(
    public _PurchaseRequisitionVerificationService: PurchaseRequisitionVerificationService,
    public _matDialog: MatDialog,private contextSvc: StoreUnitContextService,
    public datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewPurchaserequisitionComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    debugger


    this.vstoreId = this._loggedService.currentUserValue.user.storeId;

    // this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vstoreId}&ItemName=`
    this.ApiUrl = `ItemMaster/GetItemListForGRNOrPOBySp?StoreId=${this.vToStoreId}&ItemName=`
    this.PrequiSaveFrom = this.CreatePrequiSaveFrom();
    this.PrequiItemSaveFrom = this._PurchaseRequisitionVerificationService.createnewPurchaserequfrom();
    this.PrequiSaveFrom.markAllAsTouched();

    this.PrequidetailArray.push(this.createdetailInsert());

    if (this.data) {
      this.registerObj = this.data.Obj;
      this.purchaseRequisitionId = this.data.Obj.purchaseRequisitionId
      this.vRemark = this.data.Obj.comments
      this.vToStoreId=this.data.Obj
      console.log(this.registerObj);
      this.PrequiSaveFrom.get("toStoreId").setValue(this.registerObj.toStoreId)
      this.PrequiSaveFrom.get("comments").setValue(this.registerObj.remarks)

debugger
      if (this.registerObj.priority == true) { 
        this.PrequiSaveFrom.get('priority').setValue(true)
      }
      else { 
        this.PrequiSaveFrom.get('priority').setValue(false)
      }
      this.getupdateList(this.registerObj.purchaseRequisitionId);
    }
 const ctx = this.contextSvc.getContext();
        if (ctx) {
            this.storeId = ctx.storeId;
            // this.unitId = ctx.unitId;
            this.Stores = ctx.Stores;
            // this.Units = ctx.Units;
        }
  }
  get PrequidetailArray(): FormArray {
    return this.PrequiSaveFrom.get('tPurchaseRequisitionDetails') as FormArray;
  }
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vToStoreId = obj.value
    this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vToStoreId}&ItemName=`

  }
  CreatePrequiSaveFrom() {
    return this._formBuilder.group({
      purchaseRequisitionId: this.purchaseRequisitionId,
      purchaseRequisitionDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      purchaseRequisitionTime: this.datePipe.transform(new Date(), 'shortTime'),
      unitId: [this._loggedService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      priority: false,
      fromStoreId: [this._loggedService.currentUserValue.user.storeId,[Validators.required]],
      toStoreId: [ this.vToStoreId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      comments: "",
      isclosed: false,
      isverify: false,
      isInchargeVerify: false,
      isInchargeVerifyId: 0,
      isInchargeVerifyDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      isCancelledBy: 0,
      isCancelledDateTime: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      addedby: 0,
      isCancelled: false,
      tPurchaseRequisitionDetails: this._formBuilder.array([]),
    });
  }
  // || element.VerifyQuantit
  createdetailInsert(element: any = {}): FormGroup {
    debugger
    return this._formBuilder.group({
      purchaseRequisitionDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      purchaseRequisitionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [element.ItemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [element.Qty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      verifiedQty: [element.Qty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isclosed: [false],
      indQty: [0 | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      issQty: [0],

    });
  }

  onAdd() {

    if (!this.PrequiItemSaveFrom.get('ItemName')?.value) {
      this.toastr.warning('Please select Item', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.PrequiItemSaveFrom.get('Qty')?.value == "0" || this.PrequiItemSaveFrom.get('Qty')?.value == " ") {
      this.toastr.warning('Please select Qty', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const selectedItem = this.PrequiItemSaveFrom.get('ItemName').value;
    const iscekDuplicate = this.dsRequisitionList.data.some(item => item.ItemID == this.PrequiItemSaveFrom.get('ItemName').value.itemId)

    if (!iscekDuplicate && this.PrequiItemSaveFrom.get("ItemName").value.itemId !== 0) {
      this.dsRequisitionList.data = [];
      debugger
      this.chargeslist.push(
        {
          ItemID: this.PrequiItemSaveFrom.get("ItemName").value.itemId || 0,
          ItemName: this.PrequiItemSaveFrom.get("ItemName").value.itemName || '',
          Qty: this.PrequiItemSaveFrom.get('Qty').value || this.vQty,
          VerifyQuantity: this.PrequiItemSaveFrom.get('Qty').value || this.vQty,

        });
      this.dsRequisitionList.data = this.chargeslist

    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    const itemNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
    if (itemNameElement) {
      itemNameElement.focus();
    }

    this.PrequiItemSaveFrom.get('ItemName').reset('');
    this.PrequiItemSaveFrom.get('Qty').reset('');
  }

  setpriority(event) {
    console.log(event)
    this.status = event.checked
  }

  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsRequisitionList.data = [];
      this.dsRequisitionList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  vItemName: any;
  ItemReset() {
    this.vItemId = '';
    this.ItemName = '';
    this.vItemName = 0;
    this.vQty = 0;
  }

  resetFormItem() {
    const form = this.PrequiItemSaveFrom;

    form.patchValue({
      ItemName: "",
      Qty: 0,
      Remark: "",
      ItemNameKit: "",
      Qtykit: 0
    });
    this.PrequiItemSaveFrom.markAsUntouched();
  }
  getupdateList(Id) {
    var Param = {

      "first": 0,
      "rows": 9999,
      "sortField": "purchaseRequisitionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "PurchaseRequisitionId",
          "fieldValue": String(Id),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._PurchaseRequisitionVerificationService.getDetailList(Param).subscribe(data => {
      console.log(data.data)

      this.dsRequisitionList.data = data.data as IndentNameList[];
      this.chargeslist = data.data as IndentNameList[];

      this.dsRequisitionList.data.forEach(element => {
        console.log(element)
        element.indentId = element.indentId,
          element.ItemName = element.itemName,
          element.ItemID = element.itemId,
          element.Qty = element.qty,
          element.indQty = element.qty,
          element.issQty = 0,//element.issQty,
          element.bal = element.bal

      });
    });

    console.log(this.dsRequisitionList)
  }
  OnSave() {

    if ((!this.dsRequisitionList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.PrequidetailArray.clear();
    if (this.dsRequisitionList.data.length === 0) {
      this.toastr.warning('No data in the item list!', 'Warning');
      return;
    }

    this.dsRequisitionList.data.forEach(item => {
      this.PrequidetailArray.push(this.createdetailInsert(item));
    });

debugger
    // if (this.status == "1")
    //   this.PrequiSaveFrom.get('priority').setValue(true)
    // else
    //   this.PrequiSaveFrom.get('priority').setValue(false)

    if (!this.PrequiSaveFrom.invalid) {
      this.PrequiSaveFrom.get("purchaseRequisitionId").setValue(this.purchaseRequisitionId)
      console.log(this.PrequiSaveFrom.value)

      this._PurchaseRequisitionVerificationService.PurchaseRequisitionSave(this.PrequiSaveFrom.value).subscribe(response => {
        // this.viewgetReportPdf(response)
        this._matDialog.closeAll();


      });
    } else {
      let invalidFields = [];
      if (this.PrequiSaveFrom.invalid) {
        for (const controlName in this.PrequiSaveFrom.controls) {
          if (this.PrequiSaveFrom.controls[controlName].invalid) { invalidFields.push(`Requsition Form: ${controlName}`); }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

    }

  }

  getSelectedItem(item: GRNItemResponseType): void {
    debugger
    this.ItemID = item.itemId

    this.PrequiSaveFrom.patchValue({
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
  VerifyQuantity = 0

  getCellCalculation(contact, Qty, Id) {

    console.log(this.VerifyQuantity)
    // if (Id == 2) {
    //   debugger
    //   this.VerifyQuantity = Qty;
    //   contact.VerifyQuantity = this.VerifyQuantity
    // }

    console.log(contact)
    if (parseFloat(contact.Qty) < 0) {
      this.toastr.warning('Issue Qty cannot be 0.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      contact.Qty = 0;
      contact.Qty = '';
      contact.VatAmount = 0;
      contact.LandedRateandedTotal = 0;
    }
   

  }


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

  getValidationMessages() {
    return {
      FromStoreId: [
        { name: "required", Message: "Store Name is required" }
      ],
      ToStoreId: [
        { name: "required", Message: "Ward Name is required" }
      ],
      ItemName: [],
      Qty: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Qty is required" },

      ],
      Qtykit: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Qty is required" },

      ],
      storeId: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Qty is required" },

      ],
    };
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

  OnReset() {
    this.PrequiSaveFrom.reset();
    this.dsRequisitionList.data = [];
    this.chargeslist = [];
    this.dsTempItemNameList.data = [];
  }
  onClose() {
    this._matDialog.closeAll();
  }


  viewgetReportPdf(Id) {
    this.commonService.Onprint("IndentId", Id, "IndentwiseReport");
  }

  // viewgetIndentVerifyReportPdf(Id) {
  //   this.commonService.Onprint("IndentId", Id, "IndentWiseReport");
  // }


}
export class IndentNameList {
  Action: any;
  ItemID: any;
  ItemId: any;
  ItemName: string;
  Qty: number;
  HospitalBalance: number;
  IndentQuantity: number;
  CurrentBalance: number;
  position: number;
  indentId: any;
  indentDetailsId
  itemId: any;
  qty: any;
  indQty: any;
  issQty: any;
  bal: any;
  itemName: any;
  VerifyQuantity: any;
  /**
   * Constructor
   *
   * @param IndentNameList
   */
  constructor(IndentNameList) {
    {
      this.Action = IndentNameList.Action || 0;
      this.ItemId = IndentNameList.ItemId || 0;
      this.ItemID = IndentNameList.ItemID || 0;
      this.ItemName = IndentNameList.ItemName || "";
      this.Qty = IndentNameList.Qty || 0;
      this.HospitalBalance = IndentNameList.HospitalBalance || 0;
      this.IndentQuantity = IndentNameList.IndentQuantity || 0;
      this.CurrentBalance = IndentNameList.CurrentBalance || 0;
      this.indentId = IndentNameList.indentId || 0;
      this.indentDetailsId = IndentNameList.indentDetailsId || 0;
      this.itemId = IndentNameList.itemId || 0;
      this.qty = IndentNameList.qty || 0;
      this.indQty = IndentNameList.indQty || 0;
      this.issQty = IndentNameList.issQty || 0;
      this.bal = IndentNameList.bal || 0;
      this.itemName = IndentNameList.itemName || "";
      this.VerifyQuantity = IndentNameList.VerifyQuantity || 0;
    }
  }
}