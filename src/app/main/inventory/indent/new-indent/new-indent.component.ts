import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { IndentService } from '../indent.service';

@Component({
  selector: 'app-new-indent',
  templateUrl: './new-indent.component.html',
  styleUrls: ['./new-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIndentComponent implements OnInit {
  IndentSaveFrom: FormGroup;
  IndentForm: FormGroup;
  displayedColumns = [
    'ItemID',
    'ItemName',
    'IndentQuantity',
    'VerifyQuantity',
    'Action'
  ];

  vsaveflag: boolean = true;
  // Status: boolean = false;
  showAutocomplete = false;
  vprintflag: boolean = false;
  vItemId: any;
  ItemName: any;
  vstoreId:any = 0;
  storeId=0
  vQty: any;
  chargeslist: any = [];
  vRemark: any;
  IndentId: any = 0;
  vToStoreId: any = 0;
  vItemNamekit: any;
  vQtykit: any;
  registerObj: any;
  ItemID = 0;
  dateTimeObj: any;
  status: any;
  Qty = 0
  ApiUrl=''
  dsIndentNameList = new MatTableDataSource<IndentNameList>();
  dsTempItemNameList = new MatTableDataSource<IndentNameList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  autocompletestore: string = "Store";
  autocompleteitem: string = "ItemType"; //Item

  constructor(
    public _IndentService: IndentService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _formBuilder: UntypedFormBuilder,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewIndentComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    debugger

    console.log(this._loggedService.currentUserValue.user.storeId)
  //  this.vstoreId = this._loggedService.currentUserValue.user.storeId;
      this.storeId = this._loggedService.currentUserValue.user.storeId;

    // this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vstoreId}&ItemName=`
        this.ApiUrl = `ItemMaster/GetItemListForGRNOrPOBySp?StoreId=${this.vstoreId}&ItemName=`
    this.IndentSaveFrom = this.CreateIndentSaveFrom();
    this.IndentForm = this._IndentService.createnewindentfrom();
    this.IndentSaveFrom.markAllAsTouched();
    this.IndentForm.markAllAsTouched();
    this.IndentdetailArray.push(this.createdetailInsert());

    if (this.data) {
      this.registerObj = this.data.Obj;
      this.IndentId = this.data.Obj.indentId
      this.vRemark = this.data.Obj.comments
      console.log(this.registerObj);
      this.IndentSaveFrom.get("ToStoreId").setValue(this.registerObj.toStoreId)
      this.IndentSaveFrom.get("comments").setValue(this.registerObj.remarks)

      
      if (this.registerObj.priority == 'True') {
        this.status = '1'
        this.IndentSaveFrom.get('priority').setValue(true)
      }
      else {
        this.status = '0'
        this.IndentSaveFrom.get('priority').setValue(false)
      }
      this.getupdateIndentList(this.registerObj.indentId);
    }

  }
  get IndentdetailArray(): FormArray {
    return this.IndentSaveFrom.get('tIndentDetails') as FormArray;
  }
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
    this.ApiUrl = `ItemMaster/GetItemListForGRNOrPO?StoreId=${this.vstoreId}&ItemName=`

  }
  CreateIndentSaveFrom() {
    return this._formBuilder.group({
      unitId: [this._loggedService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      indentId: this.IndentId,
      IndentDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      IndentTime: this.datePipe.transform(new Date(), 'shortTime'),
      FromStoreId: [this._loggedService.currentUserValue.user.storeId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ToStoreId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isdeleted: 0,
      isverify: false,
      isclosed: false,
      comments: "",
      priority: [false],
      tIndentDetails: this._formBuilder.array([]),
    });
  }
  // || element.VerifyQuantit
  createdetailInsert(element: any = {}): FormGroup {
    debugger
    return this._formBuilder.group({
      indentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      itemId: [element.ItemID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      qty: [element.Qty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isclosed: [false],
      indQty: [0 | 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      issQty: [0],
      verifiedQty: [element.VerifyQuantity || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],

    });
  }

  onAdd() {

    if (!this.IndentForm.get('ItemName')?.value) {
      this.toastr.warning('Please select Item', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (this.IndentForm.get('Qty')?.value == "0" || this.IndentForm.get('Qty')?.value == " ") {
      this.toastr.warning('Please select Qty', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const selectedItem = this.IndentForm.get('ItemName').value;
    const iscekDuplicate = this.dsIndentNameList.data.some(item => item.ItemID == this.IndentForm.get('ItemName').value.itemId)

    if (!iscekDuplicate && this.IndentForm.get("ItemName").value.itemId !== 0) {
      this.dsIndentNameList.data = [];
      debugger
      this.chargeslist.push(
        {
          ItemID: this.IndentForm.get("ItemName").value.itemId || 0,
          ItemName: this.IndentForm.get("ItemName").value.itemName || '',
          Qty: this.IndentForm.get('Qty').value || this.vQty,
          VerifyQuantity: this.IndentForm.get('Qty').value || this.vQty,

        });
      this.dsIndentNameList.data = this.chargeslist

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

    this.IndentForm.get('ItemName').reset('');
    this.IndentForm.get('Qty').reset('');
  }

  setpriority(event) {
    console.log(event)
    this.status = event.checked
  }

  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsIndentNameList.data = [];
      this.dsIndentNameList.data = this.chargeslist;
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
    const form = this.IndentForm;

    form.patchValue({
      ItemName: "",
      Qty: 0,
      Remark: "",
      ItemNameKit: "",
      Qtykit: 0
    });
    this.IndentForm.markAsUntouched();
  }
  getupdateIndentList(Id) {
    var Param = {

      "first": 0,
      "rows": 10,
      "sortField": "IndentId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "IndentId",
          "fieldValue": String(Id),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }

    this._IndentService.getIndentList(Param).subscribe(data => {
      console.log(data.data)

      this.dsIndentNameList.data = data.data as IndentNameList[];
      this.chargeslist = data.data as IndentNameList[];

      this.dsIndentNameList.data.forEach(element => {
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

    console.log(this.dsIndentNameList)
  }
  OnSave() {

    if ((!this.dsIndentNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.IndentdetailArray.clear();
    if (this.dsIndentNameList.data.length === 0) {
      this.toastr.warning('No data in the item list!', 'Warning');
      return;
    }

    this.dsIndentNameList.data.forEach(item => {
      this.IndentdetailArray.push(this.createdetailInsert(item));
    });


    if (this.status == "1")
      this.IndentSaveFrom.get('priority').setValue(true)
    else
      this.IndentSaveFrom.get('priority').setValue(false)

    if (!this.IndentSaveFrom.invalid) {
      this.IndentSaveFrom.get("indentId").setValue(this.IndentId)
      console.log(this.IndentSaveFrom.value)

      this._IndentService.InsertIndentSave(this.IndentSaveFrom.value).subscribe(response => {
        this.viewgetIndentReportPdf(response)
        this._matDialog.closeAll();


      });
    } else {
      let invalidFields = [];
      if (this.IndentSaveFrom.invalid) {
        for (const controlName in this.IndentSaveFrom.controls) {
          if (this.IndentSaveFrom.controls[controlName].invalid) { invalidFields.push(`Indent Form: ${controlName}`); }
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

    this.IndentForm.patchValue({
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
  VerifyQuantity=0

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
    // else {
    //   if (contact.Qty > 0) {
    //     contact.LandedRateandedTotal = (parseFloat(contact.Qty) * parseFloat(contact.LandedRate)).toFixed(2);
    //     contact.VatAmount = ((parseFloat(contact.VatPer) * parseFloat(contact.LandedRateandedTotal)) / 100).toFixed(2);
    //     this.Indbalqty = (this.Indbalqty) - parseInt(Qty);
    //     contact.IssueBalQty = (this.Indbalqty)

    //     if (contact.IssueBalQty == 0)
    //       contact.IsClosed = true
    //     else
    //       contact.IsClosed = false
    //   }
    //   else {
    //     contact.Qty = 0;
    //     contact.Qty = '';
    //     contact.VatAmount = 0;
    //     contact.LandedRateandedTotal = 0;
    //   }
    // }

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
    this.IndentForm.reset();
    this.dsIndentNameList.data = [];
    this.chargeslist = [];
    this.dsTempItemNameList.data = [];
  }
  onClose() {
    this._matDialog.closeAll();
  }


  viewgetIndentReportPdf(Id) {
    this.commonService.Onprint("IndentId", Id, "IndentwiseReport");
  }

  viewgetIndentVerifyReportPdf(Id) {
    this.commonService.Onprint("IndentId", Id, "IndentWiseReport");
  }


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