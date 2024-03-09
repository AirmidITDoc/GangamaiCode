import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IndentService } from './indent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IndentComponent implements OnInit {
  displayedColumns = [
    'IsInchargeVerify',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'action',
  ];
  displayedColumns1 = [
    'ItemName',
    'Qty',
    'IssQty',
    'Bal',
  ];
  displayedColumns2 = [
    'ItemID',
    'ItemName',
    'IndentQuantity',
    'Action'
  ];
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
  filteredOptionsStoreList: Observable<string[]>;
  vRemark: any;
  vIndentId: any;

  dsIndentSearchList = new MatTableDataSource<IndentID>();

  dsIndentDetailsSearchList = new MatTableDataSource<IndentList>();

  dsIndentNameList = new MatTableDataSource<IndentNameList>();
  dsTempItemNameList = new MatTableDataSource<IndentNameList>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  //service filter
  public ToStoreFilterCtrl: FormControl = new FormControl();
  public filteredToStore: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();
  constructor(
    public _IndentService: IndentService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService

  ) { }

  ngOnInit(): void {
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getIndentID();
    this.getTostoreListCombobox();

    this.filteredOptionsStore = this._IndentService.newIndentFrom.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStore(value)),
    );
    this.filteredOptionsStoreList = this._IndentService.IndentSearchGroup.get('ToStoreId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterToStoreList(value)),

    );

  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getIndentID() {
    var Param = {
      "FromStoreId": this._loggedService.currentUserValue.user.storeId,
      "ToStoreId": this._IndentService.IndentSearchGroup.get('ToStoreId').value.StoreId || 0,
      "From_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": this._IndentService.IndentSearchGroup.get("Status").value || 0,
    }
    console.log(Param)
    this._IndentService.getIndentID(Param).subscribe(data => {
      this.dsIndentSearchList.data = data as IndentID[];
      console.log(this.dsIndentSearchList)
      this.dsIndentSearchList.sort = this.sort;
      this.dsIndentSearchList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getIndentList(Params) {
    var Param = {
      "IndentId": Params.IndentId
    }
    this._IndentService.getIndentList(Param).subscribe(data => {
      this.dsIndentDetailsSearchList.data = data as IndentList[];
      this.dsIndentDetailsSearchList.sort = this.sort;
      this.dsIndentDetailsSearchList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  vStoreId2: any = 0
  getToStoreSearchList() {
    this._IndentService.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList1 = data;
    });
  }
  private _filterToStoreList(value: any): string[] {
    if (value) {
      const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
      return this.ToStoreList1.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextStoresList(option) {
    return option && option.StoreName ? option.StoreName : '';
  }
  getFromStoreSearchList() {
    var data = {
      "Id": this._loggedService.currentUserValue.user.storeId
    }
    this._IndentService.getFromStoreNameSearch(data).subscribe(data => {
      this.FromStoreList = data;
      this._IndentService.IndentSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
      this._IndentService.StoreFrom.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }
  getTostoreListCombobox() {
    this._IndentService.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList = data;
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
      "StoreId": this._IndentService.StoreFrom.get('FromStoreId').value.storeid
    }
    this._IndentService.getIndentNameList(Param).subscribe(data => {
      this.filteredOptions = data;
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
    this.vQty = '';
    this.qty.nativeElement.focus();
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
      this.dsIndentNameList.data = [];
      this.chargeslist = this.dsTempItemNameList.data;
      this.chargeslist.push(
        {
          ItemID: this._IndentService.newIndentFrom.get('ItemName').value.ItemID || 0,
          ItemName: this._IndentService.newIndentFrom.get('ItemName').value.ItemName,
          IndentQuantity: this._IndentService.newIndentFrom.get('Qty').value || 0,
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
      let InsertIndentObj = {};
      InsertIndentObj['indentDate'] = this.dateTimeObj.date;
      InsertIndentObj['indentTime'] = this.dateTimeObj.time;
      InsertIndentObj['fromStoreId'] = this._loggedService.currentUserValue.user.storeId;
      InsertIndentObj['toStoreId'] = this._IndentService.newIndentFrom.get('ToStoreId').value.StoreId;
      InsertIndentObj['addedby'] = this.accountService.currentUserValue.user.id;

      let InsertIndentDetObj = [];
      this.dsIndentNameList.data.forEach((element) => {
        let IndentDetInsertObj = {};
        IndentDetInsertObj['indentId'] = 0;
        IndentDetInsertObj['itemId'] = element.ItemID;
        IndentDetInsertObj['qty'] = element.IndentQuantity;
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
          this.getIndentID();
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
      let updateIndent = {};
      updateIndent['indentId'] = this.dateTimeObj.time;
      updateIndent['fromStoreId'] = this._loggedService.currentUserValue.user.storeId;
      updateIndent['toStoreId'] = this._IndentService.newIndentFrom.get('ToStoreId').value.StoreId;

      let insertIndentDetail = [];
      this.dsIndentNameList.data.forEach((element) => {
        let insertIndentDetailobj = {};
        insertIndentDetailobj['indentId'] = 0;
        insertIndentDetailobj['itemId'] = element.ItemID;
        insertIndentDetailobj['qty'] = element.IndentQuantity;
        insertIndentDetail.push(insertIndentDetailobj);
      });

      let deleteIndent = {};
      deleteIndent['indentId'] = 0;

      let submitData = {
        "updateIndent": updateIndent,
        "insertIndentDetail": insertIndentDetail,
        "deleteIndent": deleteIndent
      };

      console.log(submitData);

      this._IndentService.InsertIndentSave(submitData).subscribe(response => {
        if (response) {
          this.toastr.success('Record New Indent Saved Successfully.', 'Saved !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.OnReset();
          this.getIndentID();
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
    }

  }

  selectedIndex: string = '';
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  OnEdit(row, tabGroup: MatTabGroup) {

    const tabIndex = row === 'tab1' ? 0 : 1;
    tabGroup.selectedIndex = tabIndex;
    // console.log(row)
    var vdata = {
      ToStoreId: row.ToStoreId,
      StoreName: row.ToStoreName
    }
    // console.log(vdata)
    this._IndentService.populateForm(vdata);

    this.vRemark = row.Remark;
    const selectedToStore = this.ToStoreList.filter(c => c.StoreId == row.ToStoreId);
    this._IndentService.newIndentFrom.get('ToStoreId').setValue(selectedToStore);

    // console.log(selectedToStore);
    // console.log(row.ToStoreId)
    this.getupdateIndentList(row);

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
  onVerify(row) {
    var vdata = {
      "indentVerify": {
        "indentId": row.IndentId,
        "isInchargeVerify": true,
        "isInchargeVerifyId": 1
      }
    }
    console.log(vdata);
    console.log(row);
    this._IndentService.VerifyIndent(vdata).subscribe(response => {
      if (response) {
        this.toastr.success('Record Indent Verified Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.getIndentID();
      } else {
        this.toastr.error('Record Indent Data not Verified !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('Record Indent Data not Verified mmmmmmmmmm!, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });

  }
  OnReset() {
    this._IndentService.newIndentFrom.reset();
    this.dsIndentNameList.data = [];
  }
  onClear() {
    this._IndentService.IndentSearchGroup.reset();
  }

  @ViewChild('itemname') itemname: ElementRef;
  @ViewChild('qty') qty: ElementRef;

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
}

export class IndentNameList {
  Action: any;
  ItemID: any;
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
      this.ItemID = IndentNameList.ItemID || 0;
      this.ItemName = IndentNameList.ItemName || "";
      this.Qty = IndentNameList.Qty || 0;
      this.HospitalBalance = IndentNameList.HospitalBalance || 0;
      this.IndentQuantity = IndentNameList.IndentQuantity || 0;
      this.CurrentBalance = IndentNameList.CurrentBalance || 0;

    }
  }
}

export class IndentList {

  ItemName: string;
  Qty: number;
  IssQty: number;
  BalQty: any;
  StoreName: any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {

      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.BalQty = IndentList.BalQty || 0;
      this.StoreName = IndentList.StoreName || '';
    }
  }
}
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: number;
  IsInchargeVerify: string;
  IndentId: any;
  FromStoreId: boolean;

  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || "";
      this.IndentId = IndentID.IndentId || "";
      this.FromStoreId = IndentID.FromStoreId || "";

    }
  }
}

function addaddIndentForm() {
  throw new Error('Function not implemented.');
}

