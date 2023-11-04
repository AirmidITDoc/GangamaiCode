import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { WorkOrderService } from './work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';

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

  sIsLoading: string = '';
  isLoading = true;
  StoreList:any=[];

  dsWorkOrderList=new MatTableDataSource<WorkOrderList>();

  constructor(
    public _WorkOrderService:WorkOrderService,
    private _fuseSidebarService: FuseSidebarService,
    private _loggedService: AuthenticationService,
  ) { } 

  ngOnInit(): void {
    this.gePharStoreList();
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

