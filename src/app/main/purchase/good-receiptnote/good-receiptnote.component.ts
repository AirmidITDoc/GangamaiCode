import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GoodReceiptnoteService } from './good-receiptnote.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-good-receiptnote',
  templateUrl: './good-receiptnote.component.html',
  styleUrls: ['./good-receiptnote.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class GoodReceiptnoteComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList:any=[];
  FromStoreList:any;
  SupplierList:any;
  screenFromString = 'admission-form';
  isPaymentSelected : boolean = false;
  isSupplierSelected: boolean = false;
  isItemNameSelected : boolean = false;
  registerObj = new RegInsert({});
  chargeslist: any = [];

  labelPosition: 'before' | 'after' = 'after';
  
  dsGRNList = new MatTableDataSource<GRNList>();

  dsGrnItemList = new MatTableDataSource<GrnItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();

  displayedColumns = [
    'GrnNumber',
    'GRNDate',
    'InvoiceNo',
    'SupplierName',
    'TotalAmount',
    'TotalDiscAmount',
    'TotalVATAmount',
    'NetAmount',
    'RoundingAmt',
    'DebitNote',
    'CreditNote',
    'InvDate',
    'Cash_CreditType',
    'ReceivedBy',
    'IsClosed',
    'action',
  ];

  displayedColumns1 = [
    
    "ItemName",
    "BatchNo",
    "BatchExpDate",
    "ReceiveQty",
    "FreeQty",
    "MRP",
    "Rate",
    "TotalAmount",
    "ConversionFactor",
    "VatPercentage",
    "DiscPercentage",
    "LandedRate",
    "NetAmount",
    "TotalQty",
   
  ];

  displayedColumns2 = [
    'Action',
    'ItemName',
    'UOM',
    'HSNCode',
    'BatchNo',
    'ExpDate',
    'Qty',
    'FreeQty',
    'MRP',
    'Rate',
    'TotalAmount',
    'Disc',
    'DisAmount',
    'CGST',
    'CGSTAmount',
    'SGST',
    'SGSTAmount',
    'IGST',
    'IGSTAmount',
    'NetAmount',
   ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filteredOptions: any;
  noOptionFound: boolean;
  ItemName: any;
  UOM: any=0;
  HSNCode: any=0;
  Dis:any=0;
  BatchNo: any=0;
  Qty: any=0;
  ExpDate: any=0;
  MRP: any=0;
  FreeQty: any=0;
  Rate: any=0;
  TotalAmount: any=0;
  Disc: any=0;
  DisAmount: any=0;
  CGST: any=0;
  CGSTAmount: any=0;
  SGST: any=0;
  SGSTAmount: any=0;
  IGST: any=0;
  IGSTAmount: any=0;
  NetAmount: any=0;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsItemName: Observable<string[]>;
  optionsToStore: any;
  optionsFrom: any;
  optionsMarital: any;
  optionsSupplier: any;
  optionsItemName: any;

  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
   
    
  ) { }

  ngOnInit(): void {
    this.getToStoreSearchList();
    // this.getSupplierSearchList();
    this.getSupplierSearchCombo();
    this.getFromStoreSearchList();
    this.getToStoreSearchCombo();
    this.getSupplierSearchCombo();
    this.getItemNameSearchCombo();
    this.getGRNList() 
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  
getSelectedObj(obj) {

  this.ItemName = obj.ItemName;
  this.UOM = obj.UOM;
  this.HSNCode = obj.HSNCode;
  this.BatchNo = obj.BatchNo; 
  this.ExpDate = obj.ExpDate;
  this.Qty = obj.Qty;
  this.FreeQty = obj.FreeQty;
  this.MRP = obj.MRP;
  this.Rate = obj.Rate;
  this.TotalAmount = obj.TotalAmount;
  this.Disc = obj.Disc;
  this.DisAmount = obj.DisAmount;
  this.CGST = obj.CGST;
  this.CGSTAmount = obj.CGSTAmount;
  this.SGST = obj.SGST;
  this.SGSTAmount = obj.SGSTAmount;
  this.IGST = obj.IGST;
  this.IGSTAmount = obj.IGSTAmount;
  this.NetAmount = obj.NetAmount;
 
}
 

onAdd(){
  this.dsItemNameList.data = [];
  // this.chargeslist=this.chargeslist;
  this.chargeslist.push(
    {
      
      ItemName: this._GRNList.userFormGroup.get('ItemName').value.ItemName || '',
      UOM: this.UOM,
      HSNCode:this.HSNCode ,
      BatchNo:this.BatchNo ,
      ExpDate: this.ExpDate ,
      Qty:this.Qty ,
      FreeQty : this.FreeQty ,
      MRP: this.MRP,
      Rate: this.Rate ,
      TotalAmount:this.TotalAmount ,
      Disc: this.Disc ,
      DisAmount : this.DisAmount ,
      CGST:this.CGST ,
      CGSTAmount : this.CGSTAmount ,
      SGST: this.SGST ,
      SGSTAmount : this.SGSTAmount,
      IGST: this.IGST ,
      IGSTAmount:this.IGSTAmount ,
      NetAmount :this.NetAmount ,

    });

    this.dsItemNameList.data=this.chargeslist
}
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';
  
  }


getOptionTextSupplier(option) {
  return option && option.SupplierName ? option.SupplierName : '';

}

  getOptionText(option) {
    
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }
  getGRNList() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._GRNList.GRNSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._GRNList.GRNSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._GRNList.GRNSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "IsVerify": this._GRNList.GRNSearchGroup.get("Status").value || 0,
       "Supplier_Id": this._GRNList.GRNSearchGroup.get('Supplier_Id').value.SupplierId || 0,
    }
    console.log(Param);
      this._GRNList.getGRNList(Param).subscribe(data => {
      this.dsGRNList.data = data as GRNList[];
      this.dsGRNList.sort = this.sort;
      this.dsGRNList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';
  
  }
  
calculateTotalAmount() {
  if (this.Rate && this.Qty) {
    this.TotalAmount = Math.round(parseInt(this.Rate) * parseInt(this.Qty)).toString();
    this.NetAmount = this.TotalAmount;
    // this.calculatePersc();
  }
}

calculateDiscAmount() {
  if (this.Disc) {
    this.NetAmount =  this.NetAmount - this.DisAmount;
  }
}

calculateDiscperAmount(){
  if (this.Disc) {
    let dis=this._GRNList.userFormGroup.get('Disc').value
    this.DisAmount = Math.round(dis * parseInt(this.NetAmount) /100 );
    // this.DiscAmount =  DiscAmt
    this.NetAmount = this.NetAmount - this.DisAmount;

  }
}

calculatePersc(){
  if (this.Disc)
  {
    this.Disc =Math.round(this.TotalAmount * parseInt(this.DisAmount)) / 100;
    this.NetAmount= this.TotalAmount - this.Disc;
    this._GRNList.userFormGroup.get('calculateDiscAmount').disable();    
  }

}

calculateCGSTAmount() {
  if (this.CGST) {
    this.CGSTAmount = Math.round(parseInt(this.CGST)).toString();
    this.CGSTAmount;
    // this.calculatePersc();
  }
}

calculateSGSTAmount() {
  if (this.SGST) {
    this.SGSTAmount = Math.round(parseInt(this.SGST)).toString();
    this.SGSTAmount;
    // this.calculatePersc();
  }
}


calculateIGSTAmount() {
  if (this.IGST) {
    this.IGSTAmount = Math.round(parseInt(this.IGST)).toString();
    this.IGSTAmount;
    // this.calculatePersc();
  }
}

// getGSTAmt(element) {
//   let GSTAmt;
//   GSTAmt = element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0) , 0);
//   return GSTAmt;
// }

getCGSTAmt(element) {
  let CGSTAmt;
  CGSTAmt = element.reduce((sum, { CGSTAmount }) => sum += +(CGSTAmount || 0), 0);
  return CGSTAmt;
}

getSGSTAmt(element) {
  let SGSTAmt;
  SGSTAmt = element.reduce((sum, { SGSTAmount }) => sum += +(SGSTAmount || 0), 0);
  return SGSTAmt;
}

getIGSTAmt(element)
{
  let IGSTAmt;
  IGSTAmt = element.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
  return IGSTAmt;
}

getTotalAmt(element)
{
  let TotalAmt;
  TotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
  return TotalAmt;
}

  getToStoreSearchCombo() {
      this._GRNList.getToStoreSearchList().subscribe(data => {
        this.ToStoreList = data;
        console.log(data);
        this.optionsToStore = this.ToStoreList.slice();
        this.filteredoptionsToStore = this._GRNList.GRNSearchGroup.get('ToStoreId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterStore(value) : this.ToStoreList.slice()),
        );
    
      });
    }

    getSupplierSearchCombo() {
      debugger
        this._GRNList.getSupplierSearchList().subscribe(data => {
          this.SupplierList = data;
          console.log(data);
          this.optionsSupplier = this.SupplierList.slice();
          this.filteredoptionsSupplier = this._GRNList.GRNSearchGroup.get('Supplier_Id').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
          );
      
        });
      }

      getItemNameSearchCombo() {
        var Param = {
    
          "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
          "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
        }
        console.log(Param);
        this._GRNList.getItemNameList(Param).subscribe(data =>{
            this.ItemName = data;
            console.log(data);
            this.optionsItemName = this.ItemName.slice();
            this.filteredoptionsItemName = this._GRNList.userFormGroup.get('ItemName').valueChanges.pipe(
              startWith(''),
              map(value => value ? this._filterItemName(value) : this.ItemName.slice()),
            );
        
          });
        }

 private _filterStore(value: any): string[] {
      if (value) {
        const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
        return this.optionsToStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
      }
}

    private _filterSupplier(value: any): string[] {
     if (value) {
    const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
    return this.optionsSupplier.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
  }
}

private _filterItemName(value: any): string[] {
  if (value) {
    const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
    return this.optionsItemName.filter(option => option.ItemName.toLowerCase().includes(filterValue));
  }
}
    
  getGrnItemList(Params){
    this.sIsLoading = 'loading-data';
    var Param = {
      "GrnId": Params.GRNID 
    }
      this._GRNList.getGrnItemList(Param).subscribe(data => {
      this.dsGrnItemList.data = data as GrnItemList[];
      this.dsGrnItemList.sort = this.sort;
      this.dsGrnItemList.paginator = this.paginator;
      this.sIsLoading = '';
      // console.log(this.dsGrnItemList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }

onclickrow(contact){
Swal.fire("Row selected :" + contact)
}
  
getToStoreSearchList() {
  this._GRNList.getToStoreSearchList().subscribe(data => {
    this.ToStoreList = data;
  });
}

getSupplierSearchList1() {
  this._GRNList.getSupplierSearchList().subscribe(data => {
    this.SupplierList = data;
    console.log(this.SupplierList);
  });
}

getFromStoreSearchList() {
  var data = {
    "Id": 1
  }
  this._GRNList.getFromStoreSearchList(data).subscribe(data => {
    this.FromStoreList = data;
    this._GRNList.GRNSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
  });
}

getItemNameList(){
  var Param = {

    "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
    "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
  }
  console.log(Param);
  this._GRNList.getItemNameList(Param).subscribe(data => {
    this.filteredOptions = data;
    console.log( this.filteredOptions )
          if (this.filteredOptions.length == 0) {
      this.noOptionFound = true;
    } else {
      this.noOptionFound = false;
    }
  });
}
  onClear(){
  }

  OnReset() {
    this._GRNList.GRNSearchGroup.reset();
    this._GRNList.userFormGroup.reset();
    this.dsItemNameList.data=[];
  }

  delete(elm) {
    this.dsItemNameList.data = this.dsItemNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
  }

  onScroll() {
  }
}

export class GRNList {
  GrnNumber: number;
  GRNDate: number;
  InvoiceNo:number;
  SupplierName:string;
  TotalAmount:number;
  TotalDiscAmount:number;
  TotalVATAmount:number;
  NetAmount:number;
  RoundingAmt:number;
  DebitNote:number;
  CreditNote:number;
  InvDate:number;
  Cash_CreditType:string;
  ReceivedBy:any;
  IsClosed:any;

  /**
   * Constructor
   *
   * @param GRNList
   */
  constructor(GRNList) {
    {
      this.GrnNumber = GRNList.GrnNumber || 0;
      this.GRNDate = GRNList.GRNDate || 0;
      this.InvoiceNo = GRNList.InvoiceNo || 0;
      this.SupplierName = GRNList.SupplierName ||"";
      this.TotalAmount = GRNList.TotalAmount || 0 ;
      this.TotalDiscAmount = GRNList.TotalDiscAmount || 0;
      this.TotalVATAmount = GRNList.TotalVATAmount || 0;
      this.NetAmount = GRNList.NetAmount || 0;
      this.RoundingAmt = GRNList.RoundingAmt || 0 ;
      this.DebitNote = GRNList.DebitNote || 0;
      this.CreditNote = GRNList.CreditNote || 0;
      this.InvDate = GRNList.InvDate || 0;
      this.Cash_CreditType = GRNList.Cash_CreditType || "";
      this.ReceivedBy = GRNList.ReceivedBy || 0;
      this.IsClosed = GRNList.IsClosed || 0 ;

    }
  }
}

    export class GrnItemList {
     
      ItemName: string;
      BatchNo: number;
      BatchExpDate: number;
      ReceiveQty: number;
      FreeQty: number;
      MRP: number;
      Rate: number;
      TotalAmount: number;
      ConversionFactor: number;
      VatPercentage: number;
      DiscPercentage: number;
      LandedRate: number;
      NetAmount: number;
      TotalQty: number;
      
      /**
       * Constructor
       *
       * @param GrnItemList
       */
      constructor(GrnItemList) {
        {
         
          this.ItemName = GrnItemList.ItemName || "";
          this.BatchNo = GrnItemList.BatchNo || 0;
          this.BatchExpDate = GrnItemList.BatchExpDate || 0;
          this.ReceiveQty =GrnItemList.ReceiveQty || 0;
          this.FreeQty = GrnItemList.FreeQty || 0;
          this.MRP = GrnItemList.MRP || 0;
          this.Rate = GrnItemList.Rate || 0;
          this.TotalAmount = GrnItemList.TotalAmount || 0;
          this.ConversionFactor = GrnItemList.ConversionFactor || 0;
          this.VatPercentage = GrnItemList.VatPercentage || 0;
          this.DiscPercentage = GrnItemList.DiscPercentage || 0;
          this.LandedRate = GrnItemList.LandedRate || 0;
          this.NetAmount = GrnItemList.NetAmount || 0;
          this.TotalQty = GrnItemList.TotalQty || 0;
        
        }
      }
    }

 export class ItemNameList {
  Action:string;
  ItemName: string;
  UOM: number;
  HSNCode: number;
  BatchNo: number;
  ExpDate: number;
  Qty: number;
  FreeQty: number;
  MRP: number;
  Rate: number;
  TotalAmount: number;
  Disc: number;
  DisAmount: number;
  CGST: number;
  CGSTAmount: number;
  SGST: number;
  SGSTAmount: number;
  IGST: number;
  IGSTAmount: number;
  NetAmount: number;
  position: number;
 
  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
      this.Action = ItemNameList.Action || "";
      this.ItemName = ItemNameList.ItemName || "";
      this.UOM = ItemNameList.UOM || 0;
      this.HSNCode = ItemNameList.HSNCode || 0;
      this.BatchNo = ItemNameList.BatchNo || 0;
      this.ExpDate = ItemNameList.ExpDate || 0;
      this.Qty = ItemNameList.Qty || 0;
      this.FreeQty = ItemNameList.FreeQty || 0;
      this.MRP = ItemNameList.MRP || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.Disc = ItemNameList.Disc || 0;
      this.DisAmount = ItemNameList.DisAmount || 0;
      this.CGST = ItemNameList.CGST || 0;
      this.CGSTAmount = ItemNameList.CGSTAmount || 0;
      this.SGST = ItemNameList.SGST || 0;
      this.SGSTAmount = ItemNameList.SGSTAmount || 0;
      this.IGST = ItemNameList.IGST || 0;
      this.IGSTAmount = ItemNameList.IGSTAmount || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
     
    }
  }
}
