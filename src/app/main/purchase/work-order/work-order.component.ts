import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { WorkOrderService } from './work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemNameList } from '../purchase-order/purchase-order.component';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { UpdateWorkorderComponent } from './update-workorder/update-workorder.component';
import { SearchInforObj } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';

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
    'WOId',
    'Date',
    'SupplierName',
    'WOTotalAmount',
    'WOVatAmount',
    'WODiscAmount',
    'WoNetAmount',
    'Remark'  
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
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private _loggedService: AuthenticationService,
    public datePipe:DatePipe,
    
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
  debugger
  this.sIsLoading = 'loading-data';
  var m_data = {
    "ToStoreId": 10003,//this._WorkOrderService.myFormGroup.get("StoreId").value.storeid || 0,
    "From_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("startdate").value, "MM-dd-yyyy") || '01/01/1900',
    "To_Dt": this.datePipe.transform(this._WorkOrderService.myFormGroup.get("enddate").value, "MM-dd-yyyy") || '01/01/1900',
    "Supplier_Id":194// this._WorkOrderService.myFormGroup.get("SupplierName").value.SupplierId  || 0
    
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

 

getSearchItemList() {
  var m_data = {
    "ItemName": `${this._WorkOrderService.NewWorkForm.get('ItemID').value}%`
    // "ItemID": 1//this._IssueToDep.userFormGroup.get('ItemID').value.ItemID || 0 
  }
  // console.log(m_data);
  if (this._WorkOrderService.NewWorkForm.get('ItemID').value.length >= 2) {
    this._WorkOrderService.getItemlist(m_data).subscribe(data => {
      this.filteredOptionsItem = data;
      // console.log(this.filteredOptionsItem.data);
      this.filteredOptionsItem = data;
      if (this.filteredOptionsItem.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
}
getOptionItemText(option) {
  this.ItemId = option.ItemID;
  if (!option) return '';
  return option.ItemID + ' ' + option.ItemName ;
}
getSelectedObjItem(obj) {
 // console.log(obj);

}   




newWorkorder(){
  this.chkNewWorkorder=1;
  const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
    {
      maxWidth: "100%",
      height: '95%',
      width: '95%',
      data: {
        chkNewWorkorder:this.chkNewWorkorder
      }
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result);
  });
}



onEdit(contact){
  this.chkNewWorkorder=2;
  console.log(contact)
  this.advanceDataStored.storage = new SearchInforObj(contact);
  // this._PurchaseOrder.populateForm();
  const dialogRef = this._matDialog.open(UpdateWorkorderComponent,
    {
      maxWidth: "100%",
      height: '95%',
      width: '95%',
      data : {
        Obj : contact,
        chkNewWorkorder:this.chkNewWorkorder
      }
    });
  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed - Insert Action', result);
  });
}
}

export class WorkOrderList {
  Date: Number;
  WOId:any;
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
      this.WOId = WorkOrderList.WOId || 0;
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

