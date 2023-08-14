import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PurchaseOrderService } from './purchase-order.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PurchaseOrderComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList:any=[];
  FromStoreList:any;
  SupplierList:any;
  screenFromString = 'admission-form';

  labelPosition: 'before' | 'after' = 'after';
  
  dsPurchaseOrder = new MatTableDataSource<PurchaseOrder>();

  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  displayedColumns = [
    'PurchaseNo',
    'PurchaseDate',
    'PurchaseTime',
    'StoreName',
    'SupplierName',
    'TotalAmount',
    'action',
  ];

  displayedColumns1 = [
   'ItemName',
   'Qty',
   'Rate',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getPurchaseOrder() 
    this.getSupplierSearchList()
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  newCreateUser(): void {
    // const dialogRef = this._matDialog.open(RoleTemplateMasterComponent,
    //   {
    //     maxWidth: "95vw",
    //     height: '50%',
    //     width: '100%',
    //   });
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed - Insert Action', result);
    //   //  this.getPhoneAppointList();
    // });
  }

  getPurchaseOrder() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "IsVerify": 0 ,//this._IndentID.IndentSearchGroup.get("Status").value || 1,
       "Supplier_Id": this._PurchaseOrder.PurchaseSearchGroup.get('Supplier_Id').value.Supplier_Id || 0,
    }
      this._PurchaseOrder.getPurchaseOrder(Param).subscribe(data => {
      this.dsPurchaseOrder.data = data as PurchaseOrder[];
      console.log(this.dsPurchaseOrder.data)
      this.dsPurchaseOrder.sort = this.sort;
      this.dsPurchaseOrder.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getPurchaseItemList(Params){
    // this.sIsLoading = 'loading-data';
    var Param = {
      "PurchaseId": Params.PurchaseId
    }
      this._PurchaseOrder.getPurchaseItemList(Param).subscribe(data => {
      this.dsPurchaseItemList.data = data as PurchaseItemList[];
      this.dsPurchaseItemList.sort = this.sort;
      this.dsPurchaseItemList.paginator = this.paginator;
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
  this._PurchaseOrder.getToStoreSearchList().subscribe(data => {
    this.ToStoreList = data;
  });
}


getSupplierSearchList() {
  this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
    this.SupplierList = data;
  });
}

getFromStoreSearchList() {
  var data = {
    "Id": 1
  }
  this._PurchaseOrder.getFromStoreSearchList(data).subscribe(data => {
    this.FromStoreList = data;
    this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
  });
}

  onClear(){
    
  }
}

export class PurchaseItemList {
  ItemName: string;
  Qty: number;
  Rate:number;
  StoreId:any;
  SupplierId:any;
  StoreName:any;
  /**
   * Constructor
   *
   * @param PurchaseItemList
   */
  constructor(PurchaseItemList) {
    {
      this.ItemName = PurchaseItemList.ItemName || "";
      this.Qty = PurchaseItemList.Qty || 0;
      this.Rate = PurchaseItemList.Rate || 0;
      this.StoreId = PurchaseItemList.StoreId || 0;
      this.SupplierId = PurchaseItemList.SupplierId || 0;
      this.StoreName =PurchaseItemList.StoreName || '';
    }
  }
}
export class PurchaseOrder {
  PurchaseNo: string;
  PurchaseDate: number;
  PurchaseTime:number;
  StoreName:number;
  SupplierName:string;
  TotalAmount:number;
  PurchaseId:any;
  FromStoreId:boolean;
  
  /**
   * Constructor
   *
   * @param PurchaseOrder
   */
  constructor(PurchaseOrder) {
    {
      this.PurchaseNo = PurchaseOrder.PurchaseNo || 0;
      this.PurchaseDate = PurchaseOrder.PurchaseDate || 0;
      this.PurchaseTime = PurchaseOrder.PurchaseTime || "";
      this.StoreName = PurchaseOrder.StoreName || "";
      this.SupplierName = PurchaseOrder.SupplierName || 0;
      this.TotalAmount = PurchaseOrder.TotalAmount || "";
      this.PurchaseId = PurchaseOrder.PurchaseId || "";
      this.FromStoreId = PurchaseOrder.FromStoreId || "";
    }
  }
}

