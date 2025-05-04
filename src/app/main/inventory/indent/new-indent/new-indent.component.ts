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

@Component({
  selector: 'app-new-indent',
  templateUrl: './new-indent.component.html',
  styleUrls: ['./new-indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIndentComponent implements OnInit {
  displayedColumns2 = [
    'ItemID',
    'ItemName',
    'IndentQuantity',
    'Action'
  ];

  vsaveflag: boolean = true;

  
  Status: boolean = false;
  
  showAutocomplete = false;
  
  vItemId: any;
  ItemName: any;
  vQty: any;
  chargeslist: any = [];
  vRemark: any;
  vIndentId: any;
  vprintflag: boolean = false;
  vToStoreId: any = 0;
  vItemNamekit: any;
  vQtykit: any;
  registerObj: any;

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
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewIndentComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {

    if (this.data) {
      this.registerObj = this.data;
      console.log(this.registerObj);
      this._IndentService.StoreFrom.get("ToStoreId").setValue(this.registerObj.toStoreId)
      this._IndentService.newIndentFrom.get("Remark").setValue(this.registerObj.remarks)
      this.getupdateIndentList(this.registerObj.indentId);
    }

  }

  itemid = 0;
  itemName = '';
  selectChangeItem(data) {
    this.itemid = data.value
    this.itemName = data.text
  }


  onAdd() {

    if (!this._IndentService.newIndentFrom.get('ItemName')?.value) {
      this.toastr.warning('Please select Item', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
    //   this.toastr.warning('Please enter a qty', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }
    const selectedItem = this._IndentService.newIndentFrom.get('ItemName').value;
    const iscekDuplicate = this.dsIndentNameList.data.some(item => item.ItemID == this.itemid)
    if (!iscekDuplicate) {
      this.dsIndentNameList.data = [];
      this.chargeslist.push(
        {
          ItemID: this.itemid || 0,
          ItemName: this.itemName || '',
          Qty: this._IndentService.newIndentFrom.get('Qty').value || this.vQty,
        });
      this.dsIndentNameList.data = this.chargeslist
      //console.log(this.dsItemList.data); 
    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this._IndentService.newIndentFrom.get('ItemName').reset('');
    this._IndentService.newIndentFrom.get('Qty').reset('');
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
  getupdateIndentList(Params) {
    var Param = {
      "IndentId": Params.IndentId
    }
    console.log(Param)
    this._IndentService.getIndentList(Param).subscribe(data => {
      this.dsIndentNameList.data = data as IndentNameList[];
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
    if (this._IndentService.newIndentFrom.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this._IndentService.newIndentFrom.get('IndentId').value) {
     
      let InsertIndentDetObj = [];
      this.dsIndentNameList.data.forEach((element) => {
        console.log(element)
        let IndentDetInsertObj = {};
        IndentDetInsertObj['indentId'] = 0;
        IndentDetInsertObj['itemId'] = element.ItemId;
        IndentDetInsertObj['qty'] = element.Qty;
        InsertIndentDetObj.push(IndentDetInsertObj);
      });

      let submitData = {
        "indentId": 0,
        "indentDate":this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
        "indentTime": this.datePipe.transform(this.dateTimeObj.date, 'shortTime'),
        "fromStoreId": this._loggedService.currentUserValue.user.storeId,
        "toStoreId": this._IndentService.newIndentFrom.get('ToStoreId').value,
        "comments": this._IndentService.newIndentFrom.get("Remark").value || "",
        "insertIndentDetail": InsertIndentDetObj
      };

      console.log(submitData);

      this._IndentService.InsertIndentSave(submitData).subscribe(response => {
        this.toastr.success(response.message);
      if (response) {
        // this.viewgetPurchaseorderReportPdf(response)
        this._matDialog.closeAll();
      }

    });
    } else {

      let updateIndent = {};
      updateIndent['indentId'] = this.vIndentId;
      updateIndent['fromStoreId'] = this._loggedService.currentUserValue.storeId;
      updateIndent['toStoreId'] = this._IndentService.newIndentFrom.get('ToStoreId').value.StoreId;

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
        if (response) {
          console.log(response)
          this.toastr.success('Record  Indent Updated Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset();
          this.onClose();
          //  this.viewgetIndentReportPdf(response,this.vprintflag);

        } else {
          this.toastr.error(' Issue Indent Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error(' Issue Indent Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    }

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
    this._IndentService.newIndentFrom.reset();
    this.dsIndentNameList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList.data = [];
  }
  onClose() {
    this._matDialog.closeAll();
  }

  @ViewChild('itemname') itemname: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('ItemNameKit') ItemNameKit: ElementRef;
  @ViewChild('qtykit') qtykit: ElementRef;

  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.itemname.nativeElement.focus();
    }
  }
  public onEnteritemName(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }
  public onEnterqty(event): void {
    if (event.which === 13) {
      //this.itemid.nativeElement.focus();
    }
  }
  public onEnteritemNamekit(event): void {
    if (event.which === 13) {
      this.qtykit.nativeElement.focus();
    }
  }
  public onEnterqtykit(event): void {
    if (event.which === 13) {
      //this.itemid.nativeElement.focus();
    }
  }

  viewgetIndentReportPdf(contact, vprintflag) {
  
  }

  viewgetIndentVerifyReportPdf(contact) {
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