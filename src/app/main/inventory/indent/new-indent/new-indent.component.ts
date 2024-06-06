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
  
  isItemIdSelected: boolean = false;
  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  FromStoreList: any = [];
  screenFromString = 'admission-form';
  Status: boolean = false;
  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  vItemId: any;
  ItemName: any;
  vQty: any;
  chargeslist: any = [];
  ToStoreList1: any = [];
  isStoreSelected: boolean = false;
  filteredOptionsStore: Observable<string[]>; 
  vRemark: any;
  vIndentId: any;
vprintflag:boolean=false;
vToStoreId:any=0;
vItemNamekit:any;
vQtykit:any;
registerObj:any;

  dsIndentNameList = new MatTableDataSource<IndentNameList>();
  dsTempItemNameList = new MatTableDataSource<IndentNameList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
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
    
    this.filteredOptionsStore = this._IndentService.newIndentFrom.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStore(value)),
    );
    this.getTostoreListCombobox();
    this.getFromStoreSearchList();
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj);
      this.getupdateIndentList(this.registerObj);
    }

  }
  getFromStoreSearchList() {
    var data = {
      "Id": this._loggedService.currentUserValue.user.storeId
    }
    this._IndentService.getFromStoreNameSearch(data).subscribe(data => {
      this.FromStoreList = data;
      this._IndentService.StoreFrom.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }
  getTostoreListCombobox() {
    this._IndentService.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList = data;
      console.log(this.ToStoreList)
      if (this.data) {
        const ddValue = this.ToStoreList.filter(c => c.StoreId == this.vToStoreId);
        this._IndentService.newIndentFrom.get('ToStoreId').setValue(ddValue[0]);
      } 
    });
    
  }
  private _filterToStore(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.ToStoreList.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextStores(option) {
    return option && option.StoreName ? option.StoreName : '';
  }
  getIndentItemName() {
    var Param = {
      "ItemName": `${this._IndentService.newIndentFrom.get('ItemName').value}%`,
      "StoreId": this._IndentService.newIndentFrom.get('ToStoreId').value.StoreId
    }
    this._IndentService.getIndentNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      console.log(this.filteredOptions)
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  getSelectedObj(obj) {
    this.vItemId = obj.ItemID,
      this.ItemName = obj.ItemName;
      this.vQty = '' ; //obj.BalQty;
  }

  onAdd() {
    if ((this.vItemName == '' || this.vItemName == null || this.vItemName == undefined)) {
      this.toastr.warning('Please enter a item', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = this.dsIndentNameList.data.some(item => item.ItemID === this._IndentService.newIndentFrom.get('ItemName').value.ItemID);
    if (!isDuplicate) {
      this.chargeslist = this.dsIndentNameList.data;
      this.chargeslist.push(
        {
          ItemId: this._IndentService.newIndentFrom.get('ItemName').value.ItemID || 0,
          ItemName: this._IndentService.newIndentFrom.get('ItemName').value.ItemName,
          Qty: this._IndentService.newIndentFrom.get('Qty').value || 0,
        });
      this.dsIndentNameList.data = this.chargeslist;
    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ItemReset();
    this.itemname.nativeElement.focus();
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
      this.sIsLoading = '';
      console.log(this.dsIndentNameList)
    },
      error => {
        this.sIsLoading = '';
      });
  }
  OnSave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
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
      let InsertIndentObj = {};
      InsertIndentObj['indentDate'] = formattedDate;
      InsertIndentObj['indentTime'] = formattedTime;
      InsertIndentObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId;
      InsertIndentObj['toStoreId'] = this._IndentService.newIndentFrom.get('ToStoreId').value.StoreId;
      InsertIndentObj['addedby'] = this._loggedService.currentUserValue.user.id;
      InsertIndentObj['comments'] = '';

      let InsertIndentDetObj = [];
      this.dsIndentNameList.data.forEach((element) => {
        debugger
        let IndentDetInsertObj = {};
        IndentDetInsertObj['indentId'] = 0;
        IndentDetInsertObj['itemId'] = element.ItemId;
        IndentDetInsertObj['qty'] = element.Qty;
        InsertIndentDetObj.push(IndentDetInsertObj);
      });

      let submitData = {
        "insertIndent": InsertIndentObj,
        "insertIndentDetail": InsertIndentDetObj,
      };

      console.log(submitData);

      this._IndentService.InsertIndentSave(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record New Indent Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset();
          this.onClose();
          this.viewgetIndentReportPdf(response,this.vprintflag);
           
        } else {
          this.toastr.error('New Issue Indent Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      }, error => {
        this.toastr.error('New Issue Indent Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      });
    } else {

      debugger
      let updateIndent = {};
      updateIndent['indentId'] = this.vIndentId;
      updateIndent['fromStoreId'] = this._loggedService.currentUserValue.user.storeId;
      updateIndent['toStoreId'] = this._IndentService.newIndentFrom.get('ToStoreId').value.StoreId;

      let insertIndentDetail = [];
      this.dsIndentNameList.data.forEach((element) => {
        debugger
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
  OnReset() {
    this._IndentService.newIndentFrom.reset();
    this.dsIndentNameList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList.data = [];
  }
  onClose(){
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
  
  
  SpinLoading: boolean = false;
      
  viewgetIndentReportPdf(contact,vprintflag) {
    let IndentId

    if(vprintflag){
       IndentId=contact.IndentId
    }else{
      IndentId=contact
    }
    console.log(contact)
    this.sIsLoading == 'loading-data'
  
    setTimeout(() => {
    this.SpinLoading =true;
    //  this.AdList=true;
    this._IndentService.getIndentwiseview(IndentId).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Indent Report Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
  }
  
  viewgetIndentVerifyReportPdf(contact) {
  
    console.log(contact)
    this.sIsLoading == 'loading-data'
  
    setTimeout(() => {
    this.SpinLoading =true;
   
    this._IndentService.getIndentVerifyview(contact.IndentId).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Indent Verify Report Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
  }
}
export class IndentNameList {
  Action: any;
  ItemID: any;
  ItemId:any;
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