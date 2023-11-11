import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { WorkOrderService } from './work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.component.html',
  styleUrls: ['./work-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class WorkOrderComponent implements OnInit {
  displayedColumns:string[] = [
    'action',
    'WoNo',
    'Date',
    'SupplierName',
    'TotalAmt',
    'DiscAmt',
    'VatAmt',
    'NetAmt',
    'Remark'  
  ];

  displayedColumnsnew:string[] = [
    'action',
    'ItemName',
    'Qty',
    'Rate',
    'TotalAmount',
    'Disc',
    'DiscAmt',
    'Vat',
    'VatAmt',
    'NetAmt',
    'Specification' 
  ];

  sIsLoading: string = '';
  isLoading = true;
  StoreList:any=[];
  SupplierList:any=[];

  dsWorkOrderList=new MatTableDataSource<WorkOrderList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _WorkOrderService:WorkOrderService,
    private _fuseSidebarService: FuseSidebarService,
    private _loggedService: AuthenticationService,
    public datePipe:DatePipe
  ) { } 

  ngOnInit(): void {
    this.gePharStoreList();
    this.getSuppliernameList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    console.log(vdata);
    this._WorkOrderService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      // console.log(this.StoreList);
      this._WorkOrderService.myFormGroup.get('StoreId').setValue(this.StoreList[0]);
      this._WorkOrderService.NewWorkForm.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getSuppliernameList() {
    
 
    this._WorkOrderService.getSupplierList().subscribe(data => {
      this.SupplierList = data;
      console.log(this.SupplierList);
      this._WorkOrderService.myFormGroup.get('SupplierName').setValue(this.SupplierList[0]);
      this._WorkOrderService.NewWorkForm.get('SupplierName').setValue(this.SupplierList[0]);
    });
  } 
getWorkOrdersList() {
  this.sIsLoading = 'loading-data';
  var m_data = {
    "ToStoreId":this._WorkOrderService.myFormGroup.get("StoreId").value.storeid,
    "From_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("startdate").value, "MM-dd-yyyy") || '01/01/1900',
    "To_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("enddate").value, "MM-dd-yyyy") || '01/01/1900',
    "Supplier_Id": this._WorkOrderService.myFormGroup.get("SupplierName").value.SupplierId 
    
  }
  console.log(m_data);
  this._WorkOrderService.getWorkOrderList(m_data).subscribe(data => {
    this.dsWorkOrderList.data = data as WorkOrderList[];
    this.dsWorkOrderList.sort = this.sort;
    this.dsWorkOrderList.paginator = this.paginator;
    console.log(this.dsWorkOrderList.data);
    this.sIsLoading = '';
  },
    error => {
      this.sIsLoading = '';
    });

}   
       

}

export class WorkOrderList {
  Date: Number;
  WoNo: number;
  TotalAmt:number;
  SupplierName:string;
  DiscAmt:number;
  VatAmt:number;
  NetAmt:number;
  Remark:string;
  
  constructor(WorkOrderList) {
    {
      this.Date = WorkOrderList.Date || 0;
      this.WoNo = WorkOrderList.WoNo || 0;
      this.TotalAmt = WorkOrderList.TotalAmt || 0;
      this.SupplierName = WorkOrderList.SupplierName || "";
      this.DiscAmt = WorkOrderList.DiscAmt || 0;
      this.VatAmt = WorkOrderList.VatAmt || 0;
      this.NetAmt = WorkOrderList.NetAmt || 0;
      this.Remark = WorkOrderList.Remark || "";
       
    }
  }
}

