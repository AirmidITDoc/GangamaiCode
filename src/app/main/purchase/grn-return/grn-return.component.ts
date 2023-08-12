import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GrnReturnService } from './grn-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grn-return',
  templateUrl: './grn-return.component.html',
  styleUrls: ['./grn-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class GRNReturnComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;

  screenFromString = 'admission-form';
  ToStoreList:any=[];
  FromStoreList:any;
  SupplierList:any;

  labelPosition: 'before' | 'after' = 'after';
  
  dsGRNReturnList = new MatTableDataSource<GRNReturnList>();

  displayedColumns = [
    'GRNReturnNo',
    'GRNReturnDate',
    'StoreName',
    'SupplierName',
    'action',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _GRNReturnList: GrnReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getToStoreSearchList();
    this.getSupplierSearchList();
    this.getFromStoreSearchList();
    this.getGRNReturnList() 
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  
  getGRNReturnList() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._GRNReturnList.GRNSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._GRNReturnList.GRNSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._GRNReturnList.GRNSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "SupplierId": this._GRNReturnList.GRNSearchGroup.get('SupplierId').value.SupplierId || 0,
       "IsVerify": 0 ,//this._IndentID.IndentSearchGroup.get("Status").value || 1,
      
    }
      this._GRNReturnList.getGRNReturnList(Param).subscribe(data => {
      this.dsGRNReturnList.data = data as GRNReturnList[];
      console.log(this.dsGRNReturnList.data)
      this.dsGRNReturnList.sort = this.sort;
      this.dsGRNReturnList.paginator = this.paginator;
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
  this._GRNReturnList.getToStoreSearchList().subscribe(data => {
    this.ToStoreList = data;
  });
}


getSupplierSearchList() {
  this._GRNReturnList.getSupplierSearchList().subscribe(data => {
    this.SupplierList = data;
  });
}

getFromStoreSearchList() {
  var data = {
    "Id": 1
  }
  this._GRNReturnList.getFromStoreSearchList(data).subscribe(data => {
    this.FromStoreList = data;
    this._GRNReturnList.GRNSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
  });
}
  onClear(){
    
  }
}

export class GRNReturnList {
  GRNReturnNo: Number;
  GRNReturnDate: number;
  StoreName:string;
  SupplierName:string;
  StoreId:any;
  

  /**
   * Constructor
   *
   * @param GRNReturnList
   */
  constructor(GRNReturnList) {
    {
      this.GRNReturnNo = GRNReturnList.GRNReturnNo || 0;
      this.GRNReturnDate = GRNReturnList.GRNReturnDate || 0;
      this.StoreName = GRNReturnList.StoreName || "";
      this.SupplierName = GRNReturnList.SupplierName || "";
      this.StoreId = GRNReturnList.StoreId || 0 ;
     
    }
  }
}

