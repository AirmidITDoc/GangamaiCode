import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from './good-receiptnote.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';

@Component({
  selector: 'app-good-receiptnote',
  templateUrl: './good-receiptnote.component.html',
  styleUrls: ['./good-receiptnote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class GoodReceiptnoteComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList:any=[];
  FromStoreList:any;
  SupplierList:any;
  screenFromString = 'admission-form';
  registerObj = new RegInsert({});

  labelPosition: 'before' | 'after' = 'after';
  
  dsGRNList = new MatTableDataSource<GRNList>();

  dsGrnItemList = new MatTableDataSource<GrnItemList>();

  displayedColumns = [
    'GRNID',
    'SupplierName',
    'StoreName',
    'GRNDate',
    'action',
  ];

  displayedColumns1 = [
   'ItemName',
   'BatchNo',
   'ReceiveQty',
  
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
   
    
  ) { }

  ngOnInit(): void {
    this.getToStoreSearchList();
    this.getSupplierSearchList();
    this.getFromStoreSearchList();
    this.getGRNList() 
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  

  onChangeDateofBirth(DateOfBirth) {
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());
      this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
      this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
      this.registerObj.DateofBirth = DateOfBirth;
      this._GRNList.GRNSearchGroup.get('DateOfBirth').setValue(DateOfBirth);
    }

  }
  getGRNList() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._GRNList.GRNSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._GRNList.GRNSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._GRNList.GRNSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "IsVerify": 0 ,//this._IndentID.IndentSearchGroup.get("Status").value || 1,
       "Supplier_Id": this._GRNList.GRNSearchGroup.get('Supplier_Id').value. Supplier_Id || 0,
    }
      this._GRNList.getGRNList(Param).subscribe(data => {
      this.dsGRNList.data = data as GRNList[];
      console.log(this.dsGRNList.data)
      this.dsGRNList.sort = this.sort;
      this.dsGRNList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getGrnItemList(Params){
    this.sIsLoading = 'loading-data';
    var Param = {
      "GrnId": Params.GrnId 
    }
      this._GRNList.getGrnItemList(Param).subscribe(data => {
      this.dsGrnItemList.data = data as GrnItemList[];
      this.dsGrnItemList.sort = this.sort;
      this.dsGrnItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  
onclickrow(contact){
Swal.fire("Row selected :" + contact)
}
  
getToStoreSearchList() {
  this._GRNList.getToStoreSearchList().subscribe(data => {
    this.ToStoreList = data;
  });
}

getSupplierSearchList() {
  this._GRNList.getSupplierSearchList().subscribe(data => {
    this.SupplierList = data;
  });
}

getFromStoreSearchList() {
  var data = {
    "Id": 1
  }
  this._GRNList.getFromStoreSearchList(data).subscribe(data => {
    this.FromStoreList = data;
    this._GRNList.GRNSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
  });
}

  onClear(){

  }
}

export class GrnItemList {
  ItemName: string;
  BatchNo: number;
  ReceiveQty:number;
  StoreId:any;
  StoreName:any;
  /**
   * Constructor
   *
   * @param GrnItemList
   */
  constructor(GrnItemList) {
    {
      this.ItemName = GrnItemList.ItemName || "";
      this.BatchNo = GrnItemList.BatchNo || 0;
      this.ReceiveQty = GrnItemList.ReceiveQty || 0;
      this.StoreId = GrnItemList.StoreId || 0;
      this.StoreName =GrnItemList.StoreName || '';
    }
  }
}
export class GRNList {
  GRNID: number;
  SupplierName: number;
  StoreName:string;
  GRNDate:number;
  SupplierId:any;
 
  /**
   * Constructor
   *
   * @param GRNList
   */
  constructor(GRNList) {
    {
      this.GRNID = GRNList.GRNID || 0;
      this.SupplierName = GRNList.SupplierName || "";
      this.StoreName = GRNList.StoreName || "";
      this.GRNDate = GRNList.GRNDate || 0;
      this.SupplierId = GRNList.SupplierId || 0;
      this.SupplierId = GRNList.SupplierId || 0 ;
    }
  }
}

