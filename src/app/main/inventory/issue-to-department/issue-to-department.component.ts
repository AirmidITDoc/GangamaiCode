import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IssueToDepartmentService } from './issue-to-department.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';

@Component({
  selector: 'app-issue-to-department',
  templateUrl: './issue-to-department.component.html',
  styleUrls: ['./issue-to-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueToDepartmentComponent implements OnInit {
  displayedColumns: string[] = [
    'action',
    'IssueNo',
    'IssueDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'TotalAmount',
    'TotalVatAmount',
    'NetAmount',
    'Remark',
    'Receivedby'

  ];
  displayedColumns1: string[] = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'VatPercentage',
    'PerUnitLandedRate',
    'LandedTotalAmount',
  ]

  displayedNewIssuesList3: string[] = [
    'ItemId',
    'ItemName',
    'BatchNO',
    'ExpDate',
    'BalanceQty',
    'Qty',
    'UnitRate',
    'GSTAmount',
    'TotalAmount',
    'Action'
  ];
  displayedNewIssuesList1: string[] = [
    'ItemName',
    'Qty'
  ]
  displayedNewIssuesList2: string[] = [
    'BatchNo',
    'ExpDateNo',
    'BalQty'
  ]
  hasSelectedContacts: boolean;
  isItemIdSelected: boolean = false;
  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  FromStoreList: any = [];
  screenFromString = 'admission-form';
  filteredOptions: any;

  showAutocomplete = false;
  noOptionFound: boolean = false;
  ItemCode: any;
  ItemName: any;
  Qty: any;
  filteredOptionsItem: any;
  ItemId: any;
  BalanceQty: any;
  vBatchNo: any;
  vBatchExpDate: any;
  vUnitMRP: any;
  vQty: any = 0;
  IssQty: any;
  vBal: any;
  StoreName: any;
  GSTPer: any;
  vMRP: any;
  DiscPer: any = 0;
  vDiscAmt: any = 0;
  vNetAmt: any = 0;
  vTotalMRP: any = 0;
  vBalanceQty: any;
  currentDate = new Date();
  vVatPer: any;
  vCgstPer: any;
  vSgstPer: any;
  vIgstPer: any;
  vTotalAmount: any;
  vVatAmount: any;
  vStockId: any;
  vStoreId: any;
  vLandedRate: any;
  vPurchaseRate: any;
  vItemObj: NewIssueList3;
  chargeslist: any = [];
  vItemID: any;
  FromStoreList1: any = [];
  ToStoreList1:any= [];
  vFinalTotalAmount: any;
  vFinalGSTAmount:any;

  dsIssueToDep = new MatTableDataSource<IssueToDep>();

  dsIssueItemList = new MatTableDataSource<IssueItemList>();

  dsNewIssueList1 = new MatTableDataSource<NewIssueList1>();
  dsNewIssueList2 = new MatTableDataSource<NewIssueList2>();
  dsNewIssueList3 = new MatTableDataSource<NewIssueList3>();
  dsTempItemNameList = new MatTableDataSource<NewIssueList3>();



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    public _IssueToDep: IssueToDepartmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService

  ) { }

  ngOnInit(): void {

    this.getToStoreSearchList();
    this.gePharStoreList();
    this.getToStoreList();
    this.getPharStoreList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  getToStoreSearchList() {
    this._IssueToDep.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
      this._IssueToDep.IssueSearchGroup.get('ToStoreId').setValue(this.ToStoreList[0]);
      //console.log(this.ToStoreList);
    });
  }

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._IssueToDep.getLoggedStoreList(vdata).subscribe(data => {
      this.FromStoreList = data;
      //console.log(this.FromStoreList);
      this._IssueToDep.IssueSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0])
    });
  }
  getIssueToDepList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "FromStoreId": this._IssueToDep.IssueSearchGroup.get('ToStoreId').value.StoreId,
      "ToStoreId": this._loggedService.currentUserValue.user.storeId || 1,
      "From_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IssueToDep.IssueSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsVerify": 0,
    }
    //console.log(vdata)
    this._IssueToDep.getIssueToDepList(vdata).subscribe(data => {
      this.dsIssueToDep.data = data as IssueToDep[];
      this.dsIssueToDep.sort = this.sort;
      this.dsIssueToDep.paginator = this.paginator;
      this.sIsLoading = '';
      // console.log(this.dsIssueToDep.data);
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getIssueItemList(Param) {

    var vdata = {
      "IssueId": Param
    }
    this._IssueToDep.getIssueItemList(vdata).subscribe(data => {
      this.dsIssueItemList.data = data as IssueItemList[];
      this.dsIssueItemList.sort = this.sort;
      this.dsIssueItemList.paginator = this.paginator;
      // console.log(this.dsIssueItemList.data);
    });
  }
  OnSelect(Param) {
    //console.log(Param.IssueId);
    this.getIssueItemList(Param.IssueId)
  }

  //second tab
  getSearchItemList() {
    var m_data = {
      "ItemName": `${this._IssueToDep.NewIssueGroup.get('ItemID').value}%`,
      "StoreId": this._IssueToDep.NewIssueGroup.get('FromStoreId').value.storeid
    }
    console.log(m_data);
    this._IssueToDep.getItemlist(m_data).subscribe(data => {
      this.filteredOptionsItem = data;
      console.log(this.filteredOptionsItem);
      this.filteredOptionsItem = data;
      if (this.filteredOptionsItem.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });

  }
  getOptionItemText(option) {
    this.vItemID = option.ItemID;
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }

  getSelectedObjItem(obj) {
    // console.log(obj);
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemId;
    this.BalanceQty = obj.BalanceQty;
    if (this.BalanceQty > 0) {
      this.getBatch();
    }
  }
  getToStoreList() {
    this._IssueToDep.getToStoreSearchList().subscribe(data => {
      this.ToStoreList1 = data;
      //console.log(this.ToStoreList);
    });
  }
  getPharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._IssueToDep.getLoggedStoreList(vdata).subscribe(data => {
      this.FromStoreList1 = data;
      //console.log(this.FromStoreList);
      this._IssueToDep.NewIssueGroup.get('FromStoreId').setValue(this.FromStoreList1[0])
    });
  }

  onRepeat() {
    if (this.chargeslist.length > 0) {
      this.chargeslist.forEach((element) => {
        if (element.ItemId == this.ItemId) {
          this.toastr.warning('Selected Item already added in the list', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          this.ItemReset();
        } else {
          this.onAdd();
        }
      });
    } else {
      this.onAdd();
    }
  }
  onAdd() {
    let gstper = ((this.vCgstPer) + (this.vSgstPer) + (this.vIgstPer));
    this.dsNewIssueList3.data = [];
    this.chargeslist = this.dsTempItemNameList.data;
    this.chargeslist.push(
      {
        ItemId: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId || 0,
        ItemName: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemName || '',
        BatchNo: this.vBatchNo,
        BatchExpDate: this.vBatchExpDate || '01/01/1900',
        BalanceQty: this.vBalanceQty || 0,
        Qty: this.vQty || 0,
        UnitRate: this.vUnitMRP || 0,
        GSTAmount: (((this.vTotalAmount) * (gstper))/ 100).toFixed(2),
        TotalAmount: this.vTotalAmount || 0,
      });
    console.log(this.chargeslist);
    this.dsNewIssueList3.data = this.chargeslist
    this.ItemReset();
    this.itemid.nativeElement.focus();
    this._IssueToDep.NewIssueGroup.get('ItemID').setValue('');
    this.addbutton = false;
  }
  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsNewIssueList3.data = [];
      this.dsNewIssueList3.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }
  ItemReset() {
    this.ItemName = " ";
    this.vItemID = 0;
    this.vBatchNo = " ";
    this.vBalanceQty = 0;
    this.vQty = " ";
    this.vUnitMRP = 0;
    this.vTotalAmount = 0;
  }
  CalculateTotalAmt() {
    if (this.vQty > this.vBalanceQty) {
      Swal.fire("Enter Qty less than Balance");
      this._IssueToDep.NewIssueGroup.get('Qty').setValue(0);
    }
    if (this.vQty && this.vUnitMRP) {
      this.vTotalAmount = (parseInt(this.vQty) * parseInt(this.vUnitMRP)).toFixed(2);
    }
 
  }
   getTotalamt(element) {
    this.vFinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    this.vFinalGSTAmount = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);

    return this.vFinalTotalAmount;
  }
 
  OnSave() {
    let insertheaderObj = {};
    insertheaderObj['itemid'] =  this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId;
    insertheaderObj['ItemName'] =  this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId;
    insertheaderObj['BatchNo'] =  this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId;
    insertheaderObj['BatchExpDate'] = this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId;

     let isertItemdetailsObj = [];
    this.dsNewIssueList3.data.forEach(element => {
      let insertitemdetail = {} ;
      insertitemdetail['itemid'] = element.ItemId;
      insertitemdetail['ItemName'] = element.ItemName;
      insertitemdetail['BatchNo'] = element.BatchNo;
      insertitemdetail['BatchExpDate'] = element.BatchExpDate;
      insertitemdetail['BalanceQty'] = element.BalanceQty;
      insertitemdetail['Qty'] = element.Qty;
      insertitemdetail['UnitRate'] = element.UnitRate;
      insertitemdetail['GSTAmount'] = element.GSTAmount;
      insertitemdetail['TotalAmount'] = element.TotalAmount;
      isertItemdetailsObj.push(insertitemdetail);
    });
    let submitData = {
      "isertItemdetailsObj": isertItemdetailsObj,
      "insertheaderObj": insertheaderObj,
    };

    console.log(submitData);

    this._IssueToDep.IssuetodepSave(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record New Issue To Department Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        //this._matDialog.closeAll();
        this.OnReset();

      } else {
        this.toastr.error('New Issue To Department Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New Issue To Department Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  OnReset() {
    this._IssueToDep.NewIssueGroup.reset();
    this.dsNewIssueList1.data = [];
    this.dsNewIssueList2.data = [];
    this.dsNewIssueList3.data = [];
  }

  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('Batchno') Batchno: ElementRef;
  @ViewChild('Rate') Rate: ElementRef;
  @ViewChild('BalQuantity') BalQuantity: ElementRef;
  @ViewChild('Quantity') Quantity: ElementRef;
  addbutton: Boolean = false;
  // @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  public onEnterFromstore(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.Batchno.nativeElement.focus();
    }
  }
  public onEnterBatchNo(event): void {
    if (event.which === 13) {
      this.BalQuantity.nativeElement.focus();
    }
  }
  public onEnterBalQty(event): void {
    if (event.which === 13) {
      this.Quantity.nativeElement.focus();
    }
  }
  public onEnterQty(event): void {
    if (event.which === 13) {
      this.Rate.nativeElement.focus();
     // this.addbutton = false;

    }
  }
  public onEnterRate(event): void {
    if (event.which === 13) {
      // this.Rate.nativeElement.focus();
      // this.addbutton.focus();
      //this.addbutton = true;
    }
  }
  getBatch() {
    this.Quantity.nativeElement.focus();
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "800px",
        minWidth: '800px',
        width: '800px',
        height: '380px',
        disableClose: true,
        data: {
          "ItemId": this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId,
          "StoreId": this._IssueToDep.NewIssueGroup.get('FromStoreId').value.storeid
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);

      this.vBatchNo = result.BatchNo;
      this.vBatchExpDate = this.datePipe.transform(result.BatchExpDate, "MM-dd-yyyy");
      this.vMRP = result.UnitMRP;
      this.vQty = '';
      this.vBal = result.BalanceAmt;
      this.GSTPer = result.VatPercentage;

      this.vTotalMRP = this.vQty * this.vMRP;
      this.vDiscAmt = 0;
      this.vNetAmt = this.vTotalMRP;
      this.vBalanceQty = result.BalanceQty;
      this.vItemObj = result;

      this.vVatPer = result.VatPercentage;
      // console.log(this.VatPer);
      this.vCgstPer = result.CGSTPer;
      this.vSgstPer = result.SGSTPer;
      this.vIgstPer = result.IGSTPer;

      this.vVatAmount = result.VatPercentage;
      this.vStockId = result.StockId
      this.vStoreId = result.StoreId;
      this.vLandedRate = result.LandedRate;
      this.vPurchaseRate = result.PurchaseRate;
      this.vUnitMRP = result.UnitMRP;
    });
  }
  // public onEnterBatchno(event): void {
  //   if (event.which === 13) {
  //     this.InvoiceNo1.nativeElement.focus()
  //   }
  // }

  // lastDay: string = '';
  // ExpDate:any;
  // calculateLastDay(inputDate: string) {

  //   if (inputDate && inputDate.length === 6) {
  //     const month = +inputDate.substring(0, 2);
  //     const year = +inputDate.substring(2, 6);

  //     if (month >= 1 && month <= 12) {
  //       const lastDay = this.getLastDayOfMonth(month, year);
  //       this.lastDay = `${lastDay}/${this.pad(month)}/${year}`;
  //       // this.ExpDate =new Date(this.lastDay);
  //       console.log(this.lastDay )
  //      this._IssueToDep.NewIssueGroup.get('ExpDatess').setValue(this.lastDay)
  //      // this.ExpDate = this.lastDay;
  //     } else {
  //       this.lastDay = 'Invalid month';
  //     }
  //   } else {
  //     this.lastDay = 'Invalid input';
  //   } 
  // }

  // getLastDayOfMonth(month: number, year: number): number {
  //   return new Date(year, month, 0).getDate();
  // }

  // pad(n: number): string {
  //   return n < 10 ? '0' + n : n.toString();
  // }

}
export class NewIssueList3 {

  ItemId: any;
  ItemName: any;
  BatchNO: any;
  ExpDate: any;
  BalanceQty: any;
  Qty: any;
  UnitRate: any;
  TotalAmount: any;
  BatchNo: string;
  BatchExpDate: any;
  QtyPerDay: any;
  UnitMRP: any;
  Bal: number;
  StoreId: any;
  StoreName: any;
  GSTPer: any;
  GSTAmount: any;
  TotalMRP: any;
  DiscPer: any;
  DiscAmt: any;
  NetAmt: any;
  StockId: any;
  ReturnQty: any;
  Total: any;
  VatPer: any;
  VatAmount: any;
  LandedRate: any;
  CgstPer: any;
  CGSTAmt: any;
  SgstPer: any;
  SGSTAmt: any;
  IgstPer: any;
  IGSTAmt: any;
  DiscAmount: any;
  NetAmount: any;

  constructor(NewIssueList3) {
    this.ItemId = NewIssueList3.ItemId || 0;
    this.ItemName = NewIssueList3.ItemName || '';
    this.BatchNO = NewIssueList3.BatchNO || 0;
    this.ExpDate = NewIssueList3.ExpDate || 1 / 2 / 23;
    this.BalanceQty = NewIssueList3.BalanceQty || 0;
    this.Qty = NewIssueList3.Qty || 0;
    this.UnitRate = NewIssueList3.UnitRate || 0;
    this.TotalAmount = NewIssueList3.TotalAmount || 0;
    this.BatchExpDate = NewIssueList3.BatchExpDate || "";
    this.UnitMRP = NewIssueList3.UnitMRP || "";
    this.QtyPerDay = NewIssueList3.QtyPerDay || 0;
    this.Bal = NewIssueList3.Bal || 0;
    this.StoreId = NewIssueList3.StoreId || 0;
    this.StoreName = NewIssueList3.StoreName || '';
    this.GSTPer = NewIssueList3.GSTPer || "";
    this.TotalMRP = NewIssueList3.TotalMRP || 0;
    this.DiscAmt = NewIssueList3.DiscAmt || 0;
    this.NetAmt = NewIssueList3.NetAmt || 0;
    this.StockId = NewIssueList3.StockId || 0;
    this.NetAmt = NewIssueList3.NetAmt || 0;
    this.ReturnQty = NewIssueList3.ReturnQty || 0;
    this.TotalAmount = NewIssueList3.TotalAmount || 0;
    this.Total = NewIssueList3.Total || '';
    this.VatPer = NewIssueList3.VatPer || 0;
    this.VatAmount = NewIssueList3.VatAmount || 0;
    this.LandedRate = NewIssueList3.LandedRate || 0;
    this.CgstPer = NewIssueList3.CgstPer || 0;
    this.CGSTAmt = NewIssueList3.CGSTAmt || 0;
    this.SgstPer = NewIssueList3.SgstPer || 0;
    this.SGSTAmt = NewIssueList3.SGSTAmt || 0;
    this.IgstPer = NewIssueList3.IgstPer || 0;
    this.IGSTAmt = NewIssueList3.IGSTAmt || 0;
    this.NetAmount = NewIssueList3.NetAmount || 0;
    this.DiscAmount = NewIssueList3.DiscAmount || 0;
  }
}

export class NewIssueList2 {

  BatchNo: any;
  ExpDateNo; any;
  BalQty: any;

  constructor(NewIssueList2) {
    this.BatchNo = NewIssueList2.BatchNo || 0;
    this.ExpDateNo = NewIssueList2.ExpDateNo || 1 / 2 / 23;
    this.BalQty = NewIssueList2.BalQty || 0;

  }
}
export class NewIssueList1 {

  ItemName: any;
  Qty; any;

  constructor(NewIssueList1) {
    this.ItemName = NewIssueList1.ItemName || '';
    this.Qty = NewIssueList1.Qty || 0;

  }
}

export class IssueItemList {
  ItemName: string;
  BatchNo: number;
  BatchExpDate: number;
  Qty: number;
  PerUnitLandedRate: number;
  LandedTotalAmount: number;
  VatPercentage: number;
  StoreId: any;
  StoreName: any;

  constructor(IssueItemList) {
    {
      this.ItemName = IssueItemList.ItemName || "";
      this.BatchNo = IssueItemList.BatchNo || 0;
      this.BatchExpDate = IssueItemList.BatchExpDate || 0;
      this.Qty = IssueItemList.Qty || 0;
      this.PerUnitLandedRate = IssueItemList.PerUnitLandedRate || 0;
      this.LandedTotalAmount = IssueItemList.LandedTotalAmount || 0;
      this.VatPercentage = IssueItemList.VatPercentage || 0;
      this.StoreId = IssueItemList.StoreId || 0;
      this.StoreName = IssueItemList.StoreName || "";
    }
  }
}

export class IssueToDep {
  IssueNo: Number;
  IssueDate: number;
  FromStoreName: string;
  ToStoreName: string;
  NetAmount: number;
  Remark: string;
  Receivedby: string;
  IssueDepId: number;

  constructor(IssueToDep) {
    {
      this.IssueNo = IssueToDep.IssueNo || 0;
      this.IssueDate = IssueToDep.IssueDate || 0;
      this.FromStoreName = IssueToDep.FromStoreName || "";
      this.ToStoreName = IssueToDep.ToStoreName || "";
      this.NetAmount = IssueToDep.NetAmount || 0;
      this.Remark = IssueToDep.Remark || "";
      this.Receivedby = IssueToDep.Receivedby || "";
      this.IssueDepId = IssueToDep.IssueDepId || 0;
    }
  }
}

