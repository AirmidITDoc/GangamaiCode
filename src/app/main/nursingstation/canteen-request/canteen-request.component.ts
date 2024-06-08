import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CanteenRequestService } from './canteen-request.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NewCanteenRequestComponent } from './new-canteen-request/new-canteen-request.component';

@Component({
  selector: 'app-canteen-request',
  templateUrl: './canteen-request.component.html',
  styleUrls: ['./canteen-request.component.scss'],  
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CanteenRequestComponent implements OnInit {
  displayedColumns = [
    'Date',
    'RegNo',
    'PatientName',
    'VisitAdmDate',
    'WardName',
    'AddUserName',
    'IsBillgenerates',
    'action',
  ];
  displayedColumns1 = [
    'ItemName',
    'Qty' 
  ];

  sIsLoading: string = '';
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('secondPaginator', { static: true }) public secondPaginator: MatPaginator;

  dsCanteenSearchList = new MatTableDataSource<CanteenList>();
  dsCanteenDetailList = new MatTableDataSource<CanteenDetList>();
  
  constructor(
    public _CanteenRequestservice:CanteenRequestService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.getCanteenList();
  } 
  getCanteenList() {
    var Param = { 
      "FromDate": this.datePipe.transform(this._CanteenRequestservice.SearchMyForm.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate": this.datePipe.transform(this._CanteenRequestservice.SearchMyForm.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Reg_No": this._CanteenRequestservice.SearchMyForm.get("RegNo").value || 0,
    }
    console.log(Param)
    this._CanteenRequestservice.getCanteenList(Param).subscribe(data => {
      this.dsCanteenSearchList.data = data as CanteenList[];
      console.log(this.dsCanteenSearchList.data)
      this.dsCanteenSearchList.sort = this.sort;
      this.dsCanteenSearchList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getCanteenDetList(Params) {
    var Param = {
      "ReqId": Params.ReqId
    }
    this._CanteenRequestservice.getCanteenDetList(Param).subscribe(data => {
      this.dsCanteenDetailList.data = data as CanteenDetList[];
      console.log(this.dsCanteenDetailList.data)
      this.dsCanteenDetailList.sort = this.sort;
      this.dsCanteenDetailList.paginator = this.secondPaginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onClear(){

  }
  newRequest(){ 
    const dialogRef = this._matDialog.open(NewCanteenRequestComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '75%', 
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCanteenList();
    });
  }
}
export class CanteenList {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: number;
  IsInchargeVerify: string;
  CanteenList: any;
  FromStoreId: boolean;

  /**
   * Constructor
   *
   * @param CanteenList
   */
  constructor(CanteenList) {
    {
      this.IndentNo = CanteenList.IndentNo || 0;
      this.IndentDate = CanteenList.IndentDate || 0;
      this.FromStoreName = CanteenList.FromStoreName || "";
      this.ToStoreName = CanteenList.ToStoreName || "";
      this.Addedby = CanteenList.Addedby || 0;
      this.IsInchargeVerify = CanteenList.IsInchargeVerify || "";
      this.CanteenList = CanteenList.CanteenList || "";
      this.FromStoreId = CanteenList.FromStoreId || "";

    }
  }
}
export class CanteenDetList {

  ItemName: string;
  Qty: number;
  IssQty: number;
  BalQty: any;
  StoreName: any;
  /**
   * Constructor
   *
   * @param CanteenDetList
   */
  constructor(CanteenDetList) {
    {

      this.ItemName = CanteenDetList.ItemName || "";
      this.Qty = CanteenDetList.Qty || 0;
      this.IssQty = CanteenDetList.IssQty || 0;
      this.BalQty = CanteenDetList.BalQty || 0;
      this.StoreName = CanteenDetList.StoreName || '';
    }
  }
}