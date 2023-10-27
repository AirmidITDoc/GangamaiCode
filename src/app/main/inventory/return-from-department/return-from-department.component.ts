import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ReturnFromDepartmentService } from './return-from-department.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({

  selector: 'app-return-from-department',
  templateUrl: './return-from-department.component.html',
  styleUrls: ['./return-from-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class ReturnFromDepartmentComponent implements OnInit {
  displayedColumns = [
    'action',
    'ReturnNo',
    'RDate',
    'FromStoreName',
    'ToStoreName',
    'PurchaseTotalAmount',
    'TotalVatAmount',
    'Remark',
    'Addedby',
  ];

  isLoading = true;
  ToStoreList: any = [];
  StoreList: any = [];


  dsReturnToDepList = new MatTableDataSource<ReturnTODepList>();



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  constructor(
    public _ReturnToDepartmentList: ReturnFromDepartmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    this.getToStoreSearchList();
   
    this.getReturnToDepartmentList()
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



  getReturnToDepartmentList() {

    var vdata = {
      "FromStoreId": this._ReturnToDepartmentList.ReturnSearchGroup.get('StoreId').value.storeid || 1,
      "ToStoreId": this._ReturnToDepartmentList.ReturnSearchGroup.get('ToStoreId').value.StoreId || 0,
      "From_Dt": this.datePipe.transform(this._ReturnToDepartmentList.ReturnSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._ReturnToDepartmentList.ReturnSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    console.log(vdata);
    this._ReturnToDepartmentList.getReturnToDepartmentList(vdata).subscribe(data => {
      this.dsReturnToDepList.data = data as ReturnTODepList[];
      this.dsReturnToDepList.sort = this.sort;
      this.dsReturnToDepList.paginator = this.paginator;
      console.log(this.dsReturnToDepList.data);
    });
  }
 


  getToStoreSearchList() {
    this._ReturnToDepartmentList.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
      //console.log(this.ToStoreList);
    });
  }

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    // console.log(vdata);
    this._ReturnToDepartmentList.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      // console.log(this.StoreList);
      this._ReturnToDepartmentList.ReturnSearchGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }

}

export class ReturnTODepList {
  ReturnNo: Number;
  RDate: number;
  FromStoreName: string;
  ToStoreName: string;
  PurchaseTotalAmount: number;
  TotalVatAmount: number;
  Remark: String;
  Addedby: string;
  

  constructor(ReturnTODepList) {
    {
      this.ReturnNo = ReturnTODepList.ReturnNo || 0;
      this.RDate = ReturnTODepList.RDate || 0;
      this.FromStoreName = ReturnTODepList.FromStoreName || "";
      this.ToStoreName = ReturnTODepList.ToStoreName || "";
      this.PurchaseTotalAmount = ReturnTODepList.PurchaseTotalAmount || 0;
      this.TotalVatAmount = ReturnTODepList.TotalVatAmount || 0;
      this.Remark = ReturnTODepList.Remark || "";
      this.Addedby = ReturnTODepList.Addedby || "";
      
    }
  }
}

