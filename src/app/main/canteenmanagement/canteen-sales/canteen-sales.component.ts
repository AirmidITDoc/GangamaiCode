import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CanteenmanagementService } from '../canteenmanagement.service';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { parseInt } from 'lodash';

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
    'Price'
    //'Qty'
  ];
  displayedColumns1 = [
    'ItemName',
    'Price',
    'Qty',
    //'ReturnQty',
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
    'ItemName',
    'Qty',
    'NetAmount',
  ];

  sIsLoading: string;
  isItemIdSelected:boolean=false;
  chargeslist: any = [];
  Itemsearch: string;
  vTotalFinalAmount:any;
  vDiscAmt:any;
  vDisc:any;
  
  dsItemTable1= new MatTableDataSource<ItemTable1List>();
  dsItemDetTable2 = new MatTableDataSource<ItemDetTable2List>();
  dsBillList = new MatTableDataSource<BillList>();
  dsBillDetailList = new MatTableDataSource<BillDetailList>();
  dsNursingBillList = new MatTableDataSource<NursingBillList>();

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
  applyFilter() {
    this.dsItemTable1.filter = this.Itemsearch.trim().toLowerCase();
  }
  clearSearch() {
    this.Itemsearch = '';
    this.applyFilter();
  }
  getItemTable1List() {
    this.sIsLoading = 'loading-data';
    var vdata = {   
      "ItemName":'%',
      "IsOtherOrIsEmployee": this._CanteenmanagementService.userFormGroup.get('Type').value 
    }
     //console.log(vdata);
      this._CanteenmanagementService.getItemTable1List(vdata).subscribe(data => {
      this.dsItemTable1.data = data as ItemTable1List[];
    // console.log(this.dsItemTable1.data)
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
   // console.log(row);
    this.sIsLoading = 'loading-data';
    this.sIsLoading = 'save';
    this.dsItemDetTable2.data = [];
    // if (this.chargeslist && this.chargeslist.length > 0) {
    //   let duplicateItem = this.chargeslist.filter((con, index) => con.ItemID === row.ItemID);
    //   if (duplicateItem && duplicateItem.length == 0) {
    //     this.addChargList(row);
    //     return;
    //   }
    //   this.sIsLoading = '';
    //   this.dsItemDetTable2.data = this.chargeslist;
    // } else if (this.chargeslist && this.chargeslist.length == 0) {
      this.addChargList(row);
    // }
  }

  addChargList(row) {
   // debugger
    
    this.chargeslist.push(
      {
        // ItemID: row.ItemID,
        ItemName: row.ItemName,
        Price: row.price || 0,
        Qty:0,
        Amount : 0
      });
    this.sIsLoading = '';
   //  console.log(this.chargeslist);
    this.dsItemDetTable2.data = this.chargeslist;
  }

onQtyEdit(event: any, contact:ItemDetTable2List  ) {
    const editedQty = parseFloat(event.target.textContent) || 0;
    contact.Qty = editedQty;
    contact.Amount = (contact.Qty * contact.Price);
    this. getTotalAmount();
  }
  getTotalAmount(): number {
    this.vTotalFinalAmount = 0;
    for (let i = 0; i < this.chargeslist.length; i++) {
      this.vTotalFinalAmount  += this.chargeslist[i].Amount;
    }
    this.CalculateDiscount();
    
    //this._CanteenmanagementService.userFormGroup.get('Discount').setValue('');
    return  this.vTotalFinalAmount ;
    
  }

   
  CalculateDiscount(){
    let disc = this._CanteenmanagementService.userFormGroup.get('Discount').value;
   
    if(disc >= 100 && disc > 0 ){
      Swal.fire('Enter Disount Less Than 100')
      this._CanteenmanagementService.userFormGroup.get('Discount').setValue(0);
      this._CanteenmanagementService.userFormGroup.get('DiscAmt').setValue(0);
      //this._CanteenmanagementService.userFormGroup.get('TotalAoumt').setValue(this.vTotalFinalAmount);
      this.vTotalFinalAmount.toFixed(2);
    }
    if(disc){
      let dis = this._CanteenmanagementService.userFormGroup.get('Discount').value ;
      this.vDiscAmt = ((dis * parseInt(this.vTotalFinalAmount)) / 100).toFixed(2);
      this.vTotalFinalAmount = this.vTotalFinalAmount - this.vDiscAmt;
    //  total = this.vTotalFinalAmount.toFixed(2);
    // this.CalculateDisAmt();
    }
   
  }
  CalculateDisAmt(){
    this.vTotalFinalAmount = (parseInt(this.vTotalFinalAmount) - parseInt(this.vDiscAmt));
  }
 
  @ViewChild('Code') Code: ElementRef;
  @ViewChild('CustomerName') CustomerName: ElementRef;
  public onEnterCode(event): void {
    if (event.which === 13) {
      this.CustomerName.nativeElement.focus()
    }
  }
  public onEnterCustomer(event): void {
    if (event.which === 13) {
      this.CustomerName.nativeElement.focus()
    }
  }

//BillList
  getBillList() {
    this.sIsLoading = 'loading-data';
    var vdata = {    
      "FromDate":this.datePipe.transform(this._CanteenmanagementService.BillListFrom.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate":  this.datePipe.transform(this._CanteenmanagementService.BillListFrom.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    }
    // console.log(vdata);
      this._CanteenmanagementService.getBillList(vdata).subscribe(data => {
      this.dsBillList.data = data as BillList[];
    // console.log(this.dsBillList.data)
      this.dsBillList.sort = this.sort;
      this.dsBillList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 
  //BillDetailList
  getBillDetList(Param) {
    this.sIsLoading = 'loading-data';
    var vdata = {    
      "BillNo": Param.BillNo,
     }
    // console.log(vdata);
      this._CanteenmanagementService.getBillDetList(vdata).subscribe(data => {
      this.dsBillDetailList.data = data as BillDetailList[];
    // console.log(this.dsBillDetailList.data)
      this.dsBillDetailList.sort = this.sort;
      this.dsBillDetailList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 

  //Nursing List
  getNursingBillList(){
    this.sIsLoading = 'loading-data';
    var vdata={
      'FromDate': this.datePipe.transform(this._CanteenmanagementService.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        'ToDate': this.datePipe.transform(this._CanteenmanagementService.userFormGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        'Reg_No':  0,    
    }
   // console.log(vdata);
    this._CanteenmanagementService.getNursingBillList(vdata).subscribe(data =>{
      this.dsNursingBillList.data = data as NursingBillList[];
     // console.log(this.dsNursingBillList.data)
       this.dsNursingBillList.sort = this.sort;
       this.dsNursingBillList.paginator = this.paginator;
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
  Qty:any;
 // ReturnQty:any;
 
  constructor(ItemTable1List) {
    {
      this.Code = ItemTable1List.Code || 0;
      this.Price = ItemTable1List.Price || 0;
      this.ItemName = ItemTable1List.ItemName || "";
      this.Qty = ItemTable1List.Qty || 0;
      //this.ReturnQty = ItemTable1List.ReturnQty || 0;
    }
  }
}
export class ItemDetTable2List {
 
  ItemName:string;
  Qty: any;
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
 
  ItemName:string;
  Qty: Number;
  NetAmount:number;
 
  constructor(BillDetailList) {
    {
      this.NetAmount = BillDetailList.NetAmount || 0;
      this.Qty = BillDetailList.Qty || 0;
      this.ItemName = BillDetailList.ItemName || "";
    }
  }
}
export class NursingBillList {
 
  WardName:string;
  Date: Number;
 
  constructor(NursingBillList) {
    {
      this.Date = NursingBillList.Date || 0;
      this.WardName = NursingBillList.WardName || "";
    }
  }
}