import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CanteenmanagementService } from '../canteenmanagement.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-canteen-sales',
  templateUrl: './canteen-sales.component.html',
  styleUrls: ['./canteen-sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class CanteenSalesComponent implements OnInit {
  displayedColumns = [
    'Code',
    'ItemName',
    'Price',
  ];
  displayedColumns1 = [
    'ItemName',
    'Price',
    'Qty',
    'Amount'
  ];
  displayedColumns2 = [
    'Date',
    'WardName',
  ];
  displayedBillListColumns = [
    'PBillNo',
    'BDate',
    'CustomerName',
    'NetAmount',
    'PaidAmount',
    'BalanceAmount',
  ];
  displayedBillDetListColumns = [
    'PBillNo',
    'BDate',
    'CustomerName',
    'NetAmount',
    'PaidAmount',
    'BalanceAmount',
  ];

  sIsLoading: string;
  isItemIdSelected:boolean=false;
  chargeslist: any = [];

  dsItemTable1= new MatTableDataSource<ItemTable1List>();
  dsItemDetTable2 = new MatTableDataSource<ItemDetTable2List>();
  dsBillList = new MatTableDataSource<BillList>();
  dsBillDetailList = new MatTableDataSource<BillDetailList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
   
  constructor(
    public  _CanteenmanagementService:CanteenmanagementService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this. getItemTable1List();
  }
  getItemTable1List() {
    this.sIsLoading = 'loading-data';
    var vdata = {   
      "ItemName":'%',
      "IsOtherOrIsEmployee": this._CanteenmanagementService.userFormGroup.get('Type').value 
    }
     console.log(vdata);
      this._CanteenmanagementService.getItemTable1List(vdata).subscribe(data => {
      this.dsItemTable1.data = data as ItemTable1List[];
     console.log(this.dsItemTable1.data)
      this.dsItemTable1.sort = this.sort;
      this.dsItemTable1.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 

  // getItemDetailList(row) {
  //  console.log(row);
  //  this.sIsLoading = 'save';
  //  this.dsItemDetTable2.data = [];
  //  let duplicateItem = this.chargeslist.filter((con, index) => con.ItemID === row.ItemID);
  //  if (duplicateItem && duplicateItem.length == 0) {
  //   this.chargeslist.push(
  //     {
  //       ItemID: row.ItemID,
  //       ItemName: row.ItemName,
  //       Price: row.price || 0
  //     });
  //  }

  //   this.chargeslist.push(
  //     {
  //       ItemID: row.ItemID,
  //       ItemName: row.ItemName,
  //       Price: row.price || 0
  //     });
  // this.sIsLoading = '';
  //  console.log(this.chargeslist);
  // this.dsItemDetTable2.data = this.chargeslist;
  // }

  getItemDetailList(row) {
    console.log(row);
    this.sIsLoading = 'save';
    this.dsItemDetTable2.data = [];
    if (this.chargeslist && this.chargeslist.length > 0) {
      let duplicateItem = this.chargeslist.filter((con, index) => con.ItemID === row.ItemID);
      if (duplicateItem && duplicateItem.length == 0) {
        this.addChargList(row);
        return;
      }
      this.sIsLoading = '';
      this.dsItemDetTable2.data = this.chargeslist;
    } else if (this.chargeslist && this.chargeslist.length == 0) {
      this.addChargList(row);
    }
  }

  addChargList(row) {
    this.chargeslist.push(
      {
        ItemID: row.ItemID,
        ItemName: row.ItemName,
        Price: row.price || 0
      });
    this.sIsLoading = '';
     console.log(this.chargeslist);
    this.dsItemDetTable2.data = this.chargeslist;
  }
 RQty:any=0;
  calculateTotalAmt(contact,Qty) {
      this.RQty = parseInt(Qty);
      const total = (parseFloat(contact.Price) * parseInt(this.RQty)).toFixed(2);
       contact.Amount = total;
      console.log(contact.Price);
      console.log(this.RQty);
      console.log(total);
    }
  // getCGSTAmt(element) {
  //   let CGSTAmt;
  //   CGSTAmt = element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0); this.CGSTAmount
  //   this.CGSTFinalAmount = CGSTAmt;
  //   return CGSTAmt;
  // }
  getBillList() {
    this.sIsLoading = 'loading-data';
    var vdata = {    
      "FromDate":this.datePipe.transform(this._CanteenmanagementService.BillListFrom.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate":  this.datePipe.transform(this._CanteenmanagementService.BillListFrom.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
     console.log(vdata);
      this._CanteenmanagementService.getBillList(vdata).subscribe(data => {
      this.dsBillList.data = data as BillList[];
     console.log(this.dsBillList.data)
      this.dsBillList.sort = this.sort;
      this.dsBillList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 
  
  getBillDetList() {
    this.sIsLoading = 'loading-data';
    var vdata = {    
      "FromDate":this.datePipe.transform(this._CanteenmanagementService.BillListFrom.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate":  this.datePipe.transform(this._CanteenmanagementService.BillListFrom.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
     console.log(vdata);
      this._CanteenmanagementService.getBillList(vdata).subscribe(data => {
      this.dsBillList.data = data as BillList[];
     console.log(this.dsBillList.data)
      this.dsBillList.sort = this.sort;
      this.dsBillList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 
}
export class ItemTable1List {
 
  ItemName:string;
  Code: Number;
  Price:number;
 
  constructor(ItemTable1List) {
    {
      this.Code = ItemTable1List.Code || 0;
      this.Price = ItemTable1List.Price || 0;
      this.ItemName = ItemTable1List.ItemName || "";
    }
  }
}
export class ItemDetTable2List {
 
  ItemName:string;
  Qty: Number;
  Price:number;
  Amount:number;
 
  constructor(ItemTable1List) {
    {
      this.Qty = ItemTable1List.Qty || 0;
      this.Amount = ItemTable1List.Amount || 0;
      this.Price = ItemTable1List.Price || 0;
      this.ItemName = ItemTable1List.ItemName || "";
    }
  }
}
  export class BillList {
 
    CustomerName:string;
    PBillNo: Number;
    BDate:number;
    NetAmount:number;
    PaidAmount:number;
    BalanceAmount:number;
   
    constructor(BillList) {
      {
        this.PBillNo = BillList.PBillNo || 0;
        this.NetAmount = BillList.NetAmount || 0;
        this.BDate = BillList.BDate || 0;
        this.BalanceAmount = BillList.BalanceAmount || 0;
        this.PaidAmount = BillList.PaidAmount || 0;
        this.CustomerName = BillList.CustomerName || "";
      }
    }
}
export class BillDetailList {
 
  CustomerName:string;
  PBillNo: Number;
  BDate:number;
  NetAmount:number;
  PaidAmount:number;
  BalanceAmount:number;
 
  constructor(BillDetailList) {
    {
      this.PBillNo = BillDetailList.PBillNo || 0;
      this.NetAmount = BillDetailList.NetAmount || 0;
      this.BDate = BillDetailList.BDate || 0;
      this.BalanceAmount = BillDetailList.BalanceAmount || 0;
      this.PaidAmount = BillDetailList.PaidAmount || 0;
      this.CustomerName = BillDetailList.CustomerName || "";
    }
  }
}