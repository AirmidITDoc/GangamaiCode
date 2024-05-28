import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { GRNReturnWithoutGRNService } from './grnreturn-without-grn.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { NewGRNReturnComponent } from './new-grnreturn/new-grnreturn.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-grn-return-withoutgrn',
  templateUrl: './grn-return-withoutgrn.component.html',
  styleUrls: ['./grn-return-withoutgrn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class GrnReturnWithoutgrnComponent implements OnInit {
  displayedColumns = [
    'Status',
    'GRNReturnId',
    'GRNReturnNo',
    'GRNReturnDate',
    //'StoreName',
    'SupplierName',
    'UserName',
    'GSTAmount',
    'NetAmount',
    'Remark',
    'AddedBy',
    'action',
  ];
  displayedColumns1 = [
    // "Action",
    "ItemName",
    "BatchNo",
    "BatchExpiryDate",
     "Conversion",
    "ReturnQty",
    "TotalQty",
    "MRP",
    "LandedRate",
    "Totalamt",
    "GST",
    "GSTAmount",
    "NetAmount",
    "StkId",
  ];
  dateTimeObj: any;
  isSupplierIdSelected:boolean=false;
  vSupplierId:any;
  StoreList:any;
  sIsLoading: string;
  vsupplierName:any;
  filteredOptionssupplier:any;
  noOptionFoundsupplier:any;
  SpinLoading: boolean = false;

  dsGRNReturnWithoutList = new MatTableDataSource<GRNReturnList>();
  dsGRNReturnItemDetList = new MatTableDataSource<ItemNameList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('paginator1', { static: true }) public paginator1: MatPaginator;
  constructor(
    public _GRNReturnService: GRNReturnWithoutGRNService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _fuseSidebarService: FuseSidebarService,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.getGRNReturnList();
    this.gePharStoreList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._GRNReturnService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._GRNReturnService.GRNReturnSearchFrom.get('FromStoreId').setValue(this.StoreList[0]);
    });
  }
 
  getSupplierSearchCombo() {
    var m_data = {
      'SupplierName': `${this._GRNReturnService.GRNReturnSearchFrom.get('SupplierId').value}%`
    }
    this._GRNReturnService.getSupplierList(m_data).subscribe(data => {
      this.filteredOptionssupplier = data;
      if (this.filteredOptionssupplier.length == 0) {
        this.noOptionFoundsupplier = true;
      } else {
        this.noOptionFoundsupplier = false;
      }
    });
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }

  getGRNReturnList() {
    var Param = {
      "ToStoreId": this._loggedService.currentUserValue.user.storeId || 0,
      "From_Dt": this.datePipe.transform(this._GRNReturnService.GRNReturnSearchFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._GRNReturnService.GRNReturnSearchFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "SupplierId": this._GRNReturnService.GRNReturnSearchFrom.get('SupplierId').value.SupplierId || 0 ,
      "IsVerify": this._GRNReturnService.GRNReturnSearchFrom.get("Status").value || 0,
    }
    console.log(Param);
    this._GRNReturnService.getGRNReturnList(Param).subscribe((data) => {
      this.dsGRNReturnWithoutList.data = data as GRNReturnList[];
      console.log(this.dsGRNReturnWithoutList.data);
      this.dsGRNReturnWithoutList.sort = this.sort;
      this.dsGRNReturnWithoutList.paginator = this.paginator;
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });
  }
 
  getGRNReturnItemDetList(Params) {
    this.sIsLoading = 'loading-data';
    var Param = {
      "GRNReturnId": Params.GRNReturnId
    }
    this._GRNReturnService.getGRNReturnItemDetList(Param).subscribe(data => {
      this.dsGRNReturnItemDetList.data = data as ItemNameList[];
      this.dsGRNReturnItemDetList.sort = this.sort;
      this.dsGRNReturnItemDetList.paginator = this.paginator1;
      this.sIsLoading = '';
      console.log(this.dsGRNReturnItemDetList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onClear(){

  }

  viewgetgrnreturnReportPdf(row) {
    debugger
    setTimeout(() => {
      this.SpinLoading = true;
      this._GRNReturnService.getGRNreturnreportview(
        row.GRNReturnId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "95vw",
            height: '850px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "GRN RETURN REPORT Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }
  newGRNRetunr(){
    const dialogRef = this._matDialog.open(NewGRNReturnComponent,
      {
        maxWidth: "100%",
        height: '90%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getGRNReturnList();
    });
    
  }
  getVerify(row) {

    let updateGRNReturnVerifyStatus = {};
    updateGRNReturnVerifyStatus['grnReturnId'] = row.GRNReturnId;
    updateGRNReturnVerifyStatus['isVerifiedUserId'] = this._loggedService.currentUserValue.user.id;

    let submitObj = {
      "updateGRNReturnVerifyStatus": updateGRNReturnVerifyStatus
    }
   // console.log(submitObj)
    this._GRNReturnService.getVerifyGRNReturn(submitObj).subscribe(response => {
      if (response) {
        this.toastr.success('Record Verified Successfully.', 'Verified !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('Record Not Verified !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      // this.isLoading = '';
    },
      success => {
        this.toastr.success('Record Verified Successfully.', 'Verified !', {
          toastClass: 'tostr-tost custom-toast-success',
        });

      });
    this.getGRNReturnList();
  }
}
export class GRNReturnList {
  GRNReturnId: number;
  GRNReturnDate: number;
  StoreName: string;
  SupplierName: string;
  GSTAmount: number;
  NetAmount: number;
  Remark: string;
  AddedBy: number;
  action: number;
  GRNReturnNo: number;
  UserName: any;

  constructor(GRNReturnList) {
    {
      this.GRNReturnId = GRNReturnList.GRNReturnId || 0;
      this.GRNReturnDate = GRNReturnList.GRNReturnDate || 0;
      this.StoreName = GRNReturnList.StoreName || "";
      this.SupplierName = GRNReturnList.SupplierName || "";
      this.GSTAmount = GRNReturnList.GSTAmount || 0;
      this.NetAmount = GRNReturnList.NetAmount || 0;
      this.Remark = GRNReturnList.Remark || "";
      this.AddedBy = GRNReturnList.AddedBy || 0;
      this.GRNReturnNo = GRNReturnList.GRNReturnNo || 0;
      this.UserName = GRNReturnList.UserName || '';
    }
  }
}
export class ItemNameList {

  ItemName: string;
  BatchNo: number;
  BatchExpiryDate: number;
  Conversion:any;
  BalQty: number;
  ReturnQty: number;
  PureRate: number;
  Amount: number;
  GST: number;
  GSTAmount: number;
  NetAmount: number;
  BQty: number;
  StkId: number;
  TotalQty:any;
  MRP:number;
  LandedRate: number;
  Totalamt:any;
  ItemId:any;
  ExpDate:any;
  Qty:any;
  PurRate:any;
  VatPercentage:any;
  VatAmount:any;
  TotalAmount:any;
  BalanceQty:any;
  UnitMRP:any;
  PurchaseRate:any;
  ConversionFactor:any;
  StockId:any;

  constructor(ItemNameList) {
    {
      this.ItemName = ItemNameList.ItemName || "";
      this.BatchNo = ItemNameList.BatchNo || 0;
      this.BatchExpiryDate = ItemNameList.BatchExpiryDate || 0;
      this.BalQty = ItemNameList.BalQty || 0;
      this.ReturnQty = ItemNameList.ReturnQty || 0;
      this.PureRate = ItemNameList.PureRate || 0;
      this.Amount = ItemNameList.Amount || 0;
      this.GST = ItemNameList.GST || 0;
      this.GSTAmount = ItemNameList.GSTAmount || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
      this.BQty = ItemNameList.BQty || 0;
      this.StkId = ItemNameList.StkId || 0;
      this.Conversion = ItemNameList.Conversion || 0;
      this.TotalQty = ItemNameList.totalQty || 0;
      this.MRP = ItemNameList.MRP || 0;
      this.LandedRate = ItemNameList.LandedRate || 0;
      this.Totalamt = ItemNameList.Totalamt || 0;
      this.StockId = ItemNameList.StockId || 0;
      this.ConversionFactor = ItemNameList.ConversionFactor || 0;
      this.PurchaseRate = ItemNameList.PurchaseRate || 0;
      this.UnitMRP = ItemNameList.UnitMRP || 0;
      this.BalanceQty = ItemNameList.BalanceQty || 0;
    }
  }
}
