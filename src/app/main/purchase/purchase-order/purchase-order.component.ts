import { Component, OnInit, ViewChild, Renderer2, ViewEncapsulation, ChangeDetectorRef, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PurchaseOrderService } from './purchase-order.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PurchaseOrderComponent implements OnInit {
  [x: string]: any;

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList:any=[];
  FromStoreList:any;
  SupplierList:any;
  screenFromString = 'admission-form';
  ItemID:any=0;
  labelPosition: 'before' | 'after' = 'after';
  isSupplierSelected: boolean = false;
  isPaymentSelected : boolean = false;
  isItemNameSelected : boolean = false;
  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  chargeslist: any = [];
  optionsMarital: any[] = [];

  state = false;
  optionsInc = null;
  allKeysIncomings = [
    {value: 'volvo', viewValue: 'Volvo'},
    {value: 'saab', viewValue: 'Saab'},
    {value: 'mercedes', viewValue: 'Mercedes'}
  ];
  
  dsPurchaseOrder = new MatTableDataSource<PurchaseOrder>();

  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();
  
  dsItemNameList = new MatTableDataSource<ItemNameList>();

  displayedColumns = [
    'PurchaseNo',
    'PurchaseDate',
    'PurchaseTime',
    'StoreName',
    'SupplierName',
    'TotalAmount',
    'action',
  ];

  displayedColumns1 = [
   'ItemName',
   'Qty',
   'Rate',
  ];

  displayedColumns2 = [
    'Action',
   // 'ItemID',
    'ItemName',
    'Qty',
    'UOM',
    'Rate',
    'TotalAmount',
    'Dis',
    'DiscAmount',
    'GST',
    'GSTAmount',
    'NetAmount',
    'MRP',
    'Specification',
   ];

   
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ItemName: any;
  UOM:any;
  Qty:any;
  Rate:any;
  TotalAmount:any;
  Dis:any=0;
  GST:any=0;
  NetAmount:any;
  Specification:string;
  renderer: any;
  disableTextbox: boolean;
  DiscAmount: any=0;
  GSTAmount: any =0;
  MRP: any;
  selectedRowIndex: any;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsPayment: Observable<string[]>;

  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
    
  ) { }

  ngOnInit(): void {
    this.getItemNameList();
    this.getPaymentSearchCombo();
    this.getFromStoreSearchList();
    this.getPurchaseOrder(); 
    this.getSupplierSearchCombo();
    this.getToStoreSearchList();
    this.getItemNameSearchCombo();
    this.getItemNameList();
  }
  
  getOptionText(option) {
    
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }

  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsItemNameList.data = [];
      this.dsItemNameList.data = this.chargeslist;
    }
    Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getPurchaseOrder() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').value.ToStoreId || 0,
       "From_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._PurchaseOrder.PurchaseSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "IsVerify": 0 ,//this._IndentID.IndentSearchGroup.get("Status").value || 1,
       "SupplierId": this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').value.SupplierId || 0,
    }
      this._PurchaseOrder.getPurchaseOrder(Param).subscribe(data => {
      this.dsPurchaseOrder.data = data as PurchaseOrder[];
      console.log(this.dsPurchaseOrder.data)
      this.dsPurchaseOrder.sort = this.sort;
      this.dsPurchaseOrder.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getPurchaseItemList(Params){
   debugger
    var Param = {
      "PurchaseId":10357
    }
      this._PurchaseOrder.getPurchaseItemList(Param).subscribe(data => {
      this.dsPurchaseItemList.data = data as PurchaseItemList[];
      this.dsPurchaseItemList.sort = this.sort;
      this.dsPurchaseItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


disableSelect = new FormControl(true);


OnSave() {

  let purchaseHeaderInsertObj = {};
  purchaseHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date;
  purchaseHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
  purchaseHeaderInsertObj['storeId'] = this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').value.ToStoreId || 0;
  purchaseHeaderInsertObj['supplierID'] = this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').value.SupplierId || 0;
  purchaseHeaderInsertObj['totalAmount'] = 0;
  purchaseHeaderInsertObj['discAmount'] = 0;
  purchaseHeaderInsertObj['taxAmount'] = 0;
  purchaseHeaderInsertObj['freightAmount'] = 0;
  purchaseHeaderInsertObj['octriAmount'] = 0;
  purchaseHeaderInsertObj['grandTotal'] = 0;
  purchaseHeaderInsertObj['isclosed'] = 0;
  purchaseHeaderInsertObj['isVerified'] = 0;
  purchaseHeaderInsertObj['remarks'] = "";
  purchaseHeaderInsertObj['taxID'] = 0;
  purchaseHeaderInsertObj['addedby'] = 0;
  purchaseHeaderInsertObj['updatedBy'] = 0;
  purchaseHeaderInsertObj['paymentTermId'] =0;
  purchaseHeaderInsertObj['modeofPayment'] = 0;
  purchaseHeaderInsertObj['worrenty'] = "";
  purchaseHeaderInsertObj['roundVal'] =0;
  purchaseHeaderInsertObj['totCGSTAmt'] = 0;
  purchaseHeaderInsertObj['totSGSTAmt'] = 0;
  purchaseHeaderInsertObj['totIGSTAmt'] =0;
  purchaseHeaderInsertObj['transportChanges'] = 0;
  purchaseHeaderInsertObj['handlingCharges'] = 0;
  purchaseHeaderInsertObj['freightCharges'] = 0;
  purchaseHeaderInsertObj['purchaseId'] = 0;
 
  let InsertpurchaseDetailObj = [];
  this.dsItemNameList.data.forEach((element) => {
    let purchaseDetailInsertObj = {};
    purchaseDetailInsertObj['purchaseId'] = 0;
    purchaseDetailInsertObj['itemId'] =  element.Specification;
    purchaseDetailInsertObj['uomId'] =  element.Specification;
    purchaseDetailInsertObj['qty'] =  element.Qty;
    purchaseDetailInsertObj['rate'] = element.Rate;
    purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
    purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
    purchaseDetailInsertObj['discPer'] = element.DiscPer;
    purchaseDetailInsertObj['vatAmount'] = element.vatAmount;
    purchaseDetailInsertObj['vatPer'] = element.vatPer;
    purchaseDetailInsertObj['grandTotalAmount'] = this.grandTotalAmount;
    purchaseDetailInsertObj['mrp'] = element.MRP;
    purchaseDetailInsertObj['specification'] = element.Specification;
    purchaseDetailInsertObj['cgstPer'] =  this.CgstPer;
    purchaseDetailInsertObj['cgstAmt'] = this.CgstAmt;
    purchaseDetailInsertObj['sgstPer'] = this.SgstPer;
    purchaseDetailInsertObj['sgstAmt'] = this.SgstAmt;
    purchaseDetailInsertObj['igstPer'] = this.IgstPer;
    purchaseDetailInsertObj['igstAmt'] = this.IgstAmt;
    InsertpurchaseDetailObj.push(purchaseDetailInsertObj);

  });

  let submitData = {
    "insertPurchaseOrder": purchaseHeaderInsertObj,
    "insertPurchaseDetail": InsertpurchaseDetailObj,
  };

    this._PurchaseOrder.InsertPurchaseSave(submitData).subscribe(response => {
    if (response) {
      Swal.fire('Save Purchase!', 'Record Generated Successfully !', 'success').then((result) => {
        if (result.isConfirmed) {
          let m = response;
          this._matDialog.closeAll();
        }
      });
    } else {
      Swal.fire('Error !', 'Purchase not saved', 'error');
    }
    // this.isLoading = '';
  });

}
calculateTotalAmount() {
  if (this.Rate && this.Qty) {
    this.TotalAmount = Math.round(parseInt(this.Rate) * parseInt(this.Qty)).toString();
    this.NetAmount = this.TotalAmount;
    // this.calculatePersc();
  }
}

getTotalNet(element) {
  let NetAmt;
  NetAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0) , 0);
  return NetAmt;
}

getTotalGST(element) {
  let GSTAmt;
  GSTAmt = element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0);
  return GSTAmt;
}

getTotalDisc(element) {
  let Dis;
  Dis = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0);
  return Dis;
}

getTotalAmt(element)
{
  let TotalAmt;
  TotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
  return TotalAmt;
}

calculateDiscperAmount(){
  if (this.Dis) {
    let disc=this._PurchaseOrder.userFormGroup.get('Dis').value
    this.DiscAmount = Math.round(disc * parseInt(this.NetAmount) /100 );
    // this.DiscAmount =  DiscAmt
    this.NetAmount = this.NetAmount - this.DiscAmount;

  }
    
}

calculateDiscAmount() {
  if (this.Dis) {
    this.NetAmount = this.NetAmount - this.DiscAmount;
    // this.DiscAmount;
    // this.calculatePersc();
  }
}

calculateGSTperAmount() {

  if (this.GST) {
  
    this.GSTAmount = Math.round((this.TotalAmount * parseInt(this.GST)) / 100);
    this.NetAmount = Math.round(parseInt(this.TotalAmount) + parseInt(this.GSTAmount));
    this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);
 
  }
}

calculateGSTAmount(){
  if (this.GSTAmount) {
  
    // this.GSTAmount = Math.round((this.NetAmount * parseInt(this.GST)) / 100);
    this.NetAmount = Math.round(parseInt(this.NetAmount) + parseInt(this.GSTAmount));

    this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);
 
  }
}

calculatePersc(){
  if (this.Dis)
  {
    this.Dis =Math.round(this.TotalAmount * parseInt(this.DiscAmount)) / 100;
    this.NetAmount= this.TotalAmount - this.Dis;
    this._PurchaseOrder.userFormGroup.get('calculateDiscAmount').disable();    
  }

}

  highlight(contact){
    this.selectedRowIndex = contact.ItemID;
  }

  OnReset() {
    this._PurchaseOrder.PurchaseSearchGroup.reset();
    this._PurchaseOrder.userFormGroup.reset();
    this.dsItemNameList.data=[];
  }

  delete(elm) {
    this.dsItemNameList.data = this.dsItemNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
  }

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

onScroll() {
  //Note: This is called multiple times after the scroll has reached the 80% threshold position.
  // this.nextPage$.next();
}

getToStoreSearchList() {
  this._PurchaseOrder.getToStoreSearchList().subscribe(data => {
    this.ToStoreList = data;
  });
}

// getSupplierSearchList() {
//   this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
//     this.SupplierList = data;
//   });
// }

getOptionTextSupplier(option) {
  return option && option.SupplierName ? option.SupplierName : '';

}

getOptionTextPayment(option) {
  return option && option.StoreName ? option.StoreName : '';

}

getOptionTextItemName(option) {
  return option && option.ItemName ? option.ItemName : '';

}

getSupplierSearchCombo() {
debugger
  this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
    this.SupplierList = data;
    console.log(data);
    this.optionsMarital = this.SupplierList.slice();
    this.filteredoptionsSupplier = this._PurchaseOrder.PurchaseSearchGroup.get('SupplierId').valueChanges.pipe(
      startWith(''),
      map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
    );

  });
}

getPaymentSearchCombo() {
  debugger
    this._PurchaseOrder.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
      console.log(data);
      this.optionsPayment = this.ToStoreList.slice();
      this.filteredoptionsPayment = this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPayment(value) : this.ToStoreList.slice()),
      );
  
    });
  }

  getItemNameSearchCombo() {
    var Param = {

      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
      "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    console.log(Param);
    this._PurchaseOrder.getItemNameList(Param).subscribe(data =>{
        this.ItemName = data;
        console.log(data);
        this.optionsItemName = this.ItemName.slice();
        this.filteredoptionsItemName = this._PurchaseOrder.userFormGroup.get('ItemName').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterItemName(value) : this.ItemName.slice()),
        );
    
      });
    }

private _filterSupplier(value: any): string[] {
  if (value) {
    const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
    return this.optionsMarital.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
  }
}

private _filterPayment(value: any): string[] {
  if (value) {
    const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
    return this.optionsPayment.filter(option => option.StoreName.toLowerCase().includes(filterValue));
  }
}

private _filterItemName(value: any): string[] {
  if (value) {
    const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
    return this.optionsItemName.filter(option => option.ItemName.toLowerCase().includes(filterValue));
  }
}

getFromStoreSearchList() {
  var data = {
    "Id": 1
  }
  this._PurchaseOrder.getFromStoreSearchList(data).subscribe(data => {
    this.FromStoreList = data;
    this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
  });
}
  getItemNameList(){
    var Param = {

      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
      "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    console.log(Param);
    this._PurchaseOrder.getItemNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      console.log( this.filteredOptions )
            if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  @ViewChild('itemname') itemname: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('dis') dis: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('mrp') mrp: ElementRef;
  @ViewChild('specification') specification: ElementRef;
 
  
  public onEnterItemName(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }

  public onEnterQty(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
    }
  }
  
  public onEnterRate(event): void {
    if (event.which === 13) {
      this.dis.nativeElement.focus();
    }
  }

  public onEnterDis(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
    }
  }

  public onEnterGST(event): void {
    if (event.which === 13) {
      this.mrp.nativeElement.focus();
    }
  }

  public onEnterMRP(event): void {
    if (event.which === 13) {
      this.specification.nativeElement.focus();
    }
  }

  public onEnterSpecification(event): void {
    if (event.which === 13) {
      this.itemname.nativeElement.focus();
    }
  }
  
getSelectedObj(obj) {
  this.ItemID=obj.ItemID;
  this.ItemName = obj.ItemName;
  this.Qty = obj.Qty;
  this.UOM = obj.UOM;
  this.Rate = obj.Rate;
  this.TotalAmount = obj.TotalAmount;
  this.Dis = 0;
  this.DiscAmount = 0;
  this.GST = 0;
  this.GSTAmount = 0;
  this.NetAmount = obj.NetAmount;
  this.MRP = obj.MRP;
  this.Specification = obj.Specification;
}

onAdd(){
  debugger
  this.dsItemNameList.data = [];
  // this.chargeslist=this.chargeslist;
  this.chargeslist.push(
    {
      ItemID:this.ItemID,
      ItemName:this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemName || '',
      Qty:this.Qty,
      UOM:this.UOM,
      Rate:this.Rate ,
      TotalAmount:this.TotalAmount,
      Dis :this.Dis ,
      DiscAmount:this.DiscAmount,
      GST:this.GST,
      GSTAmount :this.GSTAmount ,
      NetAmount:this.NetAmount,
      MRP:this.MRP ,
      Specification:this.Specification ,

    });

    this.dsItemNameList.data=this.chargeslist;
  }


  
  onClose(){ } 
  onClear(){ }
}

export class ItemNameList {
    Action:string;
    ItemID:any;
    ItemName:string;
    Qty:number;
    UOM:number;
    Rate:number;
    TotalAmount:number;
    Dis:number;
    DiscAmount:number;
    GST:number;
    GSTAmount:number;
    NetAmount:number;
    MRP:number;
    Specification:string;
    position: number;
  DiscPer: any;
  vatAmount: any;
  vatPer: any;
  /**
   * Constructor
   *
   * @param ItemNameList
   */
  constructor(ItemNameList) {
    {
      this.Action = ItemNameList.Action || "";
      this.ItemID = ItemNameList.ItemID || 0;
      this.ItemName = ItemNameList.ItemName || "";
      this.Qty = ItemNameList.Quantity || 0;
      this.UOM = ItemNameList.UOM || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.Dis =ItemNameList.Dis || 0;
      this.DiscAmount = ItemNameList.DiscAmount || 0;
      this.GST =ItemNameList.GST || 0;
      this.GSTAmount = ItemNameList.GSTAmount || 0;
      this.NetAmount =ItemNameList.NetAmount || 0;
      this.MRP = ItemNameList.MRP || 0;
      this.Specification =ItemNameList.Specification || "";
    }
  }
}

export class PurchaseItemList {
  ItemName: string;
  Qty: number;
  Rate:number;
  StoreId:any;
  SupplierId:any;
  StoreName:any;
  /**
   * Constructor
   *
   * @param PurchaseItemList
   */
  constructor(PurchaseItemList) {
    {
      this.ItemName = PurchaseItemList.ItemName || "";
      this.Qty = PurchaseItemList.Qty || 0;
      this.Rate = PurchaseItemList.Rate || 0;
      this.StoreId = PurchaseItemList.StoreId || 0;
      this.SupplierId = PurchaseItemList.SupplierId || 0;
      this.StoreName =PurchaseItemList.StoreName || '';
    }
  }
}
export class PurchaseOrder {
  PurchaseNo: string;
  PurchaseDate: number;
  PurchaseTime:number;
  StoreName:number;
  SupplierName:string;
  TotalAmount:number;
  PurchaseId:any;
  FromStoreId:boolean;
  
  /**
   * Constructor
   *
   * @param PurchaseOrder
   */
  constructor(PurchaseOrder) {
    {
      this.PurchaseNo = PurchaseOrder.PurchaseNo || 0;
      this.PurchaseDate = PurchaseOrder.PurchaseDate || 0;
      this.PurchaseTime = PurchaseOrder.PurchaseTime || "";
      this.StoreName = PurchaseOrder.StoreName || "";
      this.SupplierName = PurchaseOrder.SupplierName || 0;
      this.TotalAmount = PurchaseOrder.TotalAmount || "";
      this.PurchaseId = PurchaseOrder.PurchaseId || "";
      this.FromStoreId = PurchaseOrder.FromStoreId || "";
    }
  }
}

function elseif(GST: any) {
  throw new Error('Function not implemented.');
}

