import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
  selector: 'app-indent',
  templateUrl: './indent.component.html',
  styleUrls: ['./indent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IndentComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  FromStoreList: any = [];
  screenFromString = 'admission-form';
  IndentForm: FormGroup;

  labelPosition: 'before' | 'after' = 'after';

  Status: boolean = false;
  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  ItemCode: any;
  ItemName: any;
  Qty: any;
  chargeslist: any = [];

  dsIndentSearchList = new MatTableDataSource<IndentID>();

  dsIndentDetailsSearchList = new MatTableDataSource<IndentList>();

  dsIndentNameList = new MatTableDataSource<IndentNameList>();

  displayedColumns = [
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'Qty',
    'IssQty',
    'Bal',
  ];

  displayedColumns2 = [
    'Action',
    'ItemID',
    'ItemName',
    'HospitalBalance',
    'IndentQuantity',
    'CurrentBalance',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  addIndentFormGroup: any;
  subscriptionArr: any;
  reportPrintObj: IndentList;
  row: any;
  IndentNameList: any;

  constructor(
    public _IndentService: IndentService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,


  ) {
    this.IndentForm = this.getIndentForm();
  }


  ngOnInit(): void {
    // this.getFromStoreSearchList();
    this.getIndentItemName();
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getIndentID();

  }

  getOptionText(option) {

    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }

  getIndentForm() {
    return this._formBuilder.group({

      ItemName: [''],
      Qty: ['']

    });

  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  delete(elm) {
    this.dsIndentNameList.data = this.dsIndentNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
  }
  getIndentID() {
    // this.sIsLoading = 'loading-data';
    var Param = {

      "ToStoreId": this._IndentService.IndentSearchGroup.get('ToStoreId').value.ToStoreId || 0,
      "From_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IndentService.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": 0//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    console.log(Param);
    this._IndentService.getIndentID(Param).subscribe(data => {
      this.dsIndentSearchList.data = data as IndentID[];
      this.dsIndentSearchList.sort = this.sort;
      this.dsIndentSearchList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getIndentItemName() {
    var Param = {

      "ItemName": `${this.IndentForm.get('ItemName').value}%`,
      "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
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

  getSelectedObj(obj) {
    this.ItemCode = obj.ItemID,
      this.ItemName = obj.ItemName;
    this.Qty = obj.Qty;
  }

  onAdd() {

    // this.dsIndentNameList.forEach
    // If(this.ItemCode)
    this.dsIndentNameList.data = [];
    // this.chargeslist=this.chargeslist;
    this.chargeslist.push(
      {
        ItemID: this.ItemCode,
        ItemName: this.ItemName,
        Qty: this.Qty
      });

    this.dsIndentNameList.data = this.chargeslist
  }

  OnSave() {

    let InsertIndentObj = {};
    InsertIndentObj['indentDate'] = this.dateTimeObj.date;
    InsertIndentObj['indentTime'] = this.dateTimeObj.date;
    InsertIndentObj['fromStoreId'] = this._IndentService.IndentSearchGroup.get('FromStoreId').value.storeid;
    InsertIndentObj['toStoreId'] = this._IndentService.IndentSearchGroup.get('ToStoreId').value.StoreId;
    InsertIndentObj['addedby'] = this.accountService.currentUserValue.user.id;

    let InsertIndentDetObj = [];
    this.dsIndentNameList.data.forEach((element) => {
      let IndentDetInsertObj = {};
      IndentDetInsertObj['indentId'] = 0;
      IndentDetInsertObj['itemId'] = element.ItemID;
      IndentDetInsertObj['Qty'] = element.Qty;
      InsertIndentDetObj.push(IndentDetInsertObj);
    });

    let submitData = {
      "insertIndent": InsertIndentObj,
      "insertIndentDetail": InsertIndentDetObj,
    };

    this._IndentService.InsertIndentSave(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Save Indent!', 'Record Generated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Indent not saved', 'error');
      }
      // this.isLoading = '';
    });

  }

  OnReset() {
    this._IndentService.IndentSearchGroup.reset();
    this.IndentForm.reset();
    this.IndentForm.reset();
    this.dsIndentNameList.data=[];
  }

  disableSelect = new FormControl(true);

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    // this.nextPage$.next();
  }

  getIndentList(Params) {
    // this.sIsLoading = 'loading-data';
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

  getToStoreSearchList() {
    this._IndentService.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList = data;
    });
  }

  getFromStoreSearchList() {
    var data = {
      "Id": 1
    }
    this._IndentService.getFromStoreNameSearch(data).subscribe(data => {
      this.FromStoreList = data;
      this._IndentService.IndentSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }

  onClear() {

  }
  onView() {

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

