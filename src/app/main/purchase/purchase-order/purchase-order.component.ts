import { Component, OnInit, ViewChild, Renderer2, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
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
import { FormControl } from '@angular/forms';


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

  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  chargeslist: any = [];
  
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
  private _formBuilder: any;
  ItemName: any;
  UOM:any;
  Qty:any=0;
  Rate:any=0;
  TotalAmount:any=0;
  Dis:any=0;
  GST:any=0;
  NetAmount:any=0;
  Specification:string;
  renderer: any;
  disableTextbox: boolean;
  DiscAmount: any=0;
  GSTAmount: any =0;
  MRP: any=0;
  selectedRowIndex: any;
  
  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getItemNameList();
    this.getToStoreSearchList();
    this.getFromStoreSearchList();
    this.getPurchaseOrder() 
    this.getSupplierSearchList()
  }
  
  getOptionText(option) {
    
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

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
       "Supplier_Id": this._PurchaseOrder.PurchaseSearchGroup.get('Supplier_Id').value.Supplier_Id || 0,
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

// onclickrow(contact){
// Swal.fire("Row selected :" + contact)
// }

disableSelect = new FormControl(true);

focusNextQty() {
  this.renderer.selectRootElement('#Qty').focus();
}

focusNextRate() {
  this.renderer.selectRootElement('#Rate').focus();
}

focusNextDis() {
  this.renderer.selectRootElement('#Dis').focus();
}

focusNextDiscAmount() {
  this.renderer.selectRootElement('#DiscAmount').focus();
}

focusNextGST() {
  this.renderer.selectRootElement('#GST').focus();
}

focusNextMRP() {
  this.renderer.selectRootElement('#MRP').focus();
}

focusNextSpecification() {
  this.renderer.selectRootElement('#Specification').focus();
}

focusNextbtnAdd() {
  this.renderer.selectRootElement('#Add').focus();
}


onKeydown(event) {
  if (event.key === "Enter") {
    // console.log(event);

  }
}

calculateTotalAmount() {
  if (this.Rate && this.Qty) {
    this.TotalAmount = Math.round(parseInt(this.Rate) * parseInt(this.Qty)).toString();
    this.NetAmount = this.TotalAmount;
    this.calculatePersc();
  }
}

calculateDiscAmount() {
  if (this.Dis) {
    this.DiscAmount = parseInt(this.Dis).toString();
    this.DiscAmount;
    this.calculatePersc();
  }
}

calculateGSTAmount() {

  debugger
  if (this.GST) {
    this.GSTAmount = parseInt(this.GST);
    this.GSTAmount = Math.round((this.NetAmount * parseInt(this.GST)) / 100);
    this.NetAmount = this.NetAmount + this.GSTAmount;

    this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    console.log(this.NetAmount)
    this.calculatePersc();
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

getSupplierSearchList() {
  this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
    this.SupplierList = data;
  });
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

getSelectedObj(obj) {
  this.ItemID=obj.ItemID;
  this.ItemName = obj.ItemName;
  this.Qty = 32//obj.BalQty;
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
  this.dsItemNameList.data = [];
  // this.chargeslist=this.chargeslist;
  this.chargeslist.push(
    {
      ItemID:this.ItemID,
      ItemName:this.ItemName,
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

    this.dsItemNameList.data=this.chargeslist
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

