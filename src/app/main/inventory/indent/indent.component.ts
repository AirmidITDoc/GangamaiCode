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
import { FormBuilder, FormGroup } from '@angular/forms';

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
  IndentForm:FormGroup;
  labelPosition: 'before' | 'after' = 'after';


  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  ItemCode:any;
  ItemName:any;
  Qty:any;
  chargeslist: any = [];

  dsIndentID = new MatTableDataSource<IndentID>();

  dsIndentList = new MatTableDataSource<IndentList>();

  dataSource = new MatTableDataSource<IndentList>();
  
  displayedColumns = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
    'ItemID',
    'ItemName',
    'Qty'
    // 'IssQty',
    // 'Bal',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IndentID: IndentService,
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
    this.getIndentID()
  }


  getOptionText(option) {
    
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }

  getIndentForm() {
    return this._formBuilder.group({
      
      ItemName:  [''],
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

  getIndentID() {
    // this.sIsLoading = 'loading-data';
    var Param = {

      "ToStoreId": this._IndentID.IndentSearchGroup.get('ToStoreId').value.ToStoreId || 0,
      "From_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": 0//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    console.log(Param);
    this._IndentID.getIndentID(Param).subscribe(data => {
      this.dsIndentID.data = data as IndentID[];
      console.log(this.dsIndentID.data)
      this.dsIndentID.sort = this.sort;
      this.dsIndentID.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  
  getIndentItemName(){
    var Param = {

      "ItemName": `${this.IndentForm.get('ItemName').value}%`,
      "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    console.log(Param);
    this._IndentID.getIndentNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      console.log( this.filteredOptions )
            if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }

  getSelectedObj(obj) {
  this.ItemCode=obj.ItemID,
    this.ItemName = obj.ItemName;
    this.Qty = 32//obj.BalQty;
   
  }


  onAdd(){
    this.dataSource.data = [];
    // this.chargeslist=this.chargeslist;
    this.chargeslist.push(
      {
        ItemID:this.ItemCode,
        ItemName: this.ItemName,
        Qty: this.Qty
      });

      this.dataSource.data=this.chargeslist
  }


  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    // this.nextPage$.next();
  }


  getIndentList(Params) {
    // this.sIsLoading = 'loading-data';
    var Param = {
      "IndentId": Params.IndentId
    }
    this._IndentID.getIndentList(Param).subscribe(data => {
      this.dsIndentList.data = data as IndentList[];
      this.dsIndentList.sort = this.sort;
      this.dsIndentList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  onclickrow(contact) {
    Swal.fire("Row selected :" + contact)
  }

  getToStoreSearchList() {
    this._IndentID.getToStoreNameSearch().subscribe(data => {
      this.ToStoreList = data;
    });
  }

  getFromStoreSearchList() {
    var data = {
      "Id": 1
    }
    this._IndentID.getFromStoreNameSearch(data).subscribe(data => {
      this.FromStoreList = data;
      this._IndentID.IndentSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }

  onClear() {

  }
}

export class IndentList {
  ItemID:any;
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
      this.ItemID = IndentList.ItemID || 0;
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

