import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { IndentService } from '../indent.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { map, startWith } from 'rxjs/operators';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { FormGroup } from '@angular/forms';
import { GRNItemResponseType } from 'app/main/purchase/good-receiptnote/new-grn/types';

@Component({
  selector: 'app-new-indent',
  templateUrl: './new-indent.component.html',
  styleUrls: ['./new-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIndentComponent implements OnInit {
  StoreFrom:FormGroup;
  IndentForm:FormGroup;
  displayedColumns2 = [
    'ItemID',
    'ItemName',
    'IndentQuantity',
    'Action'
  ];

  vsaveflag: boolean = true;
  Status: boolean = false;
  showAutocomplete = false;
  vprintflag: boolean = false;
  vItemId: any;
  ItemName: any;
  vQty: any;
  chargeslist: any = [];
  vRemark: any;
  vIndentId: any;
  vToStoreId: any = 0;
  vItemNamekit: any;
  vQtykit: any;
  registerObj: any;
  ItemID=0;
  dateTimeObj: any;

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
     private commonService: PrintserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewIndentComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
this.StoreFrom=this._IndentService.CreateStoreFrom();
this.IndentForm=this._IndentService.createnewindentfrom();

    if (this.data) {
      this.registerObj = this.data;
      console.log(this.registerObj);
      this.StoreFrom.get("ToStoreId").setValue(this.registerObj.toStoreId)
      this.IndentForm.get("Remark").setValue(this.registerObj.remarks)
      debugger
      this.getupdateIndentList(this.registerObj.indentId);
    }

  }

  onAdd() {

    if (!this.IndentForm.get('ItemName')?.value) {
      this.toastr.warning('Please select Item', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    debugger
    const selectedItem = this.IndentForm.get('ItemName').value;
    const iscekDuplicate = this.dsIndentNameList.data.some(item => item.ItemID == this.IndentForm.get('ItemName').value.itemId)
    if (!iscekDuplicate) {
      this.dsIndentNameList.data = [];
      this.chargeslist.push(
        {
          ItemID: this.IndentForm.get("ItemName").value || 0,
          ItemName:this.IndentForm.get("ItemName").value.formattedText  || '',
          Qty: this.IndentForm.get('Qty').value || this.vQty,
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
            Remark:"",
            ItemNameKit:"",
            Qtykit:0
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
    console.log(Param)
    this._IndentService.getIndentList(Param).subscribe(data => {
      this.dsIndentNameList.data = data.data as IndentNameList[];
      console.log(data)
      this.chargeslist = data as IndentNameList[];
      this.dsIndentNameList.sort = this.sort;
      this.dsIndentNameList.paginator = this.paginator;
      console.log(this.dsIndentNameList)
    });
  }
  OnSave() {
   
    if ((!this.dsIndentNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.IndentForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.IndentForm.get('IndentId').value) {
     
      let InsertIndentDetObj = [];
      this.dsIndentNameList.data.forEach((element) => {
        console.log(element)
        let IndentDetInsertObj = {};
        IndentDetInsertObj['indentId'] = 0;
        IndentDetInsertObj['itemId'] = element.ItemID;
        IndentDetInsertObj['qty'] = element.Qty;
        InsertIndentDetObj.push(IndentDetInsertObj);
      });

      let submitData = {
        "indentId": 0,
        "indentDate":this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
        "indentTime": this.datePipe.transform(this.dateTimeObj.date, 'shortTime'),
        "fromStoreId": this._loggedService.currentUserValue.user.storeId,
        "toStoreId": this.StoreFrom.get('ToStoreId').value,
        "comments": this.IndentForm.get("Remark").value || "",
        "tIndentDetails": InsertIndentDetObj
      };

      console.log(submitData);

      this._IndentService.InsertIndentSave(submitData).subscribe(response => {
        this.toastr.success(response.message);
      if (response) {
        this.viewgetIndentReportPdf(response)
        this._matDialog.closeAll();
      }

    });
    } else {

      let updateIndent = {};
      updateIndent['indentId'] = this.vIndentId;
      updateIndent['fromStoreId'] = this._loggedService.currentUserValue.storeId;
      updateIndent['toStoreId'] = this.IndentForm.get('ToStoreId').value.StoreId;

      let insertIndentDetail = [];
      this.dsIndentNameList.data.forEach((element) => {

        let insertIndentDetailobj = {};
        insertIndentDetailobj['indentId'] = this.vIndentId;
        insertIndentDetailobj['itemId'] = element.ItemId;
        insertIndentDetailobj['qty'] = element.Qty;
        insertIndentDetail.push(insertIndentDetailobj);
      });

      let deleteIndent = {};
      deleteIndent['indentId'] = this.vIndentId;

      let submitData = {
        "updateIndent": updateIndent,
        "insertIndentDetail": insertIndentDetail,
        "deleteIndent": deleteIndent
      };

      console.log(submitData);

      this._IndentService.InsertIndentUpdate(submitData).subscribe(response => {
        this.toastr.success(response.message);
        if (response) {
          this.viewgetIndentReportPdf(response)
          this._matDialog.closeAll();
        }
  
      });
    }

  }

  
    getSelectedItem(item: GRNItemResponseType): void {
     
      this.ItemID = item.itemId
     
      this.IndentForm.patchValue({
        UOMId: item.umoId,
        ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
        Qty: item.balanceQty,
        CGSTPer: item.cgstPer,
        SGSTPer: item.sgstPer,
        IGSTPer: item.igstPer,
        GST: item.cgstPer + item.sgstPer + item.igstPer,
        HSNcode: item.hsNcode
  
      });
  
    }
    
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
    console.log(this.dateTimeObj)
  }

  getValidationMessages() {
    return {
      FromStoreId: [
        // { name: "required", Message: "Store Name is required" }
      ],
      ToStoreId: [
        // { name: "required", Message: "Ward Name is required" }
      ],
      ItemName: []
    };
  }

  OnReset() {
    this.IndentForm.reset();
    this.dsIndentNameList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList.data = [];
  }
  onClose() {
    this._matDialog.closeAll();
  }

 
  viewgetIndentReportPdf(Id) {
    this.commonService.Onprint("IndentId", Id, "IndentWiseReport");
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

    }
  }
}