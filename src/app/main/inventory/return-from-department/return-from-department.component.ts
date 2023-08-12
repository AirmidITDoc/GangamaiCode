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

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList:any=[];
  FromStoreList:any;

  screenFromString = 'admission-form';

  labelPosition: 'before' | 'after' = 'after';
  
  dsReturnToDepartmentList = new MatTableDataSource<ReturnToDepartmentList>();

  displayedColumns = [
    'ReturnNo',
    'RDate',
    'FromStoreName',
    'ToStoreName',
    'PurchaseTotalAmount',
    'TotalVatAmount',
    'Remark',
    'Addedby',
    'action',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _ReturnToDepartmentList: ReturnFromDepartmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getReturnToDepartmentList() 
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

  getReturnToDepartmentList() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      "FromStoreId": this._ReturnToDepartmentList.ReturnSearchGroup.get('FromStoreId').value.FromStoreId || 1,
      "ToStoreId": this._ReturnToDepartmentList.ReturnSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._ReturnToDepartmentList.ReturnSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._ReturnToDepartmentList.ReturnSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  
    }
      this._ReturnToDepartmentList.getReturnToDepartmentList(Param).subscribe(data => {
      this.dsReturnToDepartmentList.data = data as ReturnToDepartmentList[];
      console.log(this.dsReturnToDepartmentList.data)
      this.dsReturnToDepartmentList.sort = this.sort;
      this.dsReturnToDepartmentList.paginator = this.paginator;
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
  this._ReturnToDepartmentList.getToStoreSearchList().subscribe(data => {
    this.ToStoreList = data;
  });
}

getFromStoreSearchList() {
  var data = {
    "Id": 1
  }
  this._ReturnToDepartmentList.getFromStoreSearchList(data).subscribe(data => {
    this.FromStoreList = data;
    this._ReturnToDepartmentList.ReturnSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
  });
}

  onClear(){
    
  }
}

export class ReturnToDepartmentList {
  ReturnNo: Number;
  RDate: number;
  FromStoreName:string;
  ToStoreName:string;
  PurchaseTotalAmount:number;
  TotalVatAmount: number;
  Remark:String;
  Addedby:string;
  FromStoreId:boolean;
  StoreId:any;
  StoreName:any;
  
  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.ReturnNo = IndentID.ReturnNo || 0;
      this.RDate = IndentID.RDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.PurchaseTotalAmount = IndentID.PurchaseTotalAmount || 0;
      this.TotalVatAmount = IndentID.TotalVatAmount || 0;
      this.Remark = IndentID.Remark || "";
      this.Addedby = IndentID.Addedby || "";
      this.FromStoreId = IndentID.FromStoreId || "";
      this.StoreId = IndentID.StoreId || "";
      this.StoreName = IndentID.StoreName || "";
    }
  }
}

