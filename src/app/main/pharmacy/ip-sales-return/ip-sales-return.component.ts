import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IpSalesReturnService } from './ip-sales-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { IndentList } from '../sales/sales.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ip-sales-return',
  templateUrl: './ip-sales-return.component.html',
  styleUrls: ['./ip-sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IpSalesReturnComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  isRegIdSelected:boolean=false;
  PatientListfilteredOptions: any;
  ItemfilteredOptions:any;
  noOptionFound:any;
  filteredOptions:any;
  isItemIdSelected:any;
  Store1List: any = [];
  screenFromString = 'admission-form';
  chargeslist: any = []; 
  dateTimeObj: any;
 ;
 dsIpSaleItemList = new MatTableDataSource<IPSalesItemList>();
  SelectedList = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();
 
  displayedColumns = [
    'SalesNo',
    'ItemName',
    'BatchNo',
    'ExpDate',
    'MRP',
    'Qty',
    'ReturnQty',
    'TotalAmt',
    'GST',
    'GSTAmt',
    'Disc',
    'DiscAmt',
    'NetAmount'
  ];
 

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IpSalesRetService: IpSalesReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    public toastr: ToastrService,

  ) { }

  ngOnInit(): void {  
  }
   
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  getSearchList() {
    var m_data = {
      "Keyword": `${this._IpSalesRetService.userFormGroup.get('RegID').value}%`
    }
    if (this._IpSalesRetService.userFormGroup.get('RegID').value.length >= 1) {
      this._IpSalesRetService.getAdmittedpatientlist(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(resData)
        this.PatientListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        } 
      });
    } 
  } 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.PatientName + ' (' + option.RegID + ')';
  }
  vRegNo:any;
  vPatienName:any;
  vMobileNo:any;
  vAdmissionDate:any;
  vReturnQty:any;
  vItemName:any;
  vRegId:any;
  vAdmissionID:any;
  vTotalQty:any;
  vSalesNo:any;
  vBatchNo:any;
  vBatchExpDate:any;
  vUnitMRP:any;
  vVatPer:any;
  vDiscPer:any; 
  vFinalGSTAmt:any;
  vFinalDiscAmount:any;
  getSelectedObj(obj){
    console.log(obj)
   this.vRegNo = obj.RegNo;
   this.vPatienName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.PatientName;
   this.vAdmissionDate = obj.AdmissionDate;
   this.vMobileNo = obj.MobileNo; 
   this.vAdmissionID = obj.AdmissionID;
   this.vRegId = obj.RegID
   //this.getItemNameList(this.vRegId);
   this.itemname.nativeElement.focus();
  }
  filteredOptionsItem:any;
  getItemNameList() {
    var Param = {
      "RegNo":  this.vRegNo || 0,
      "StoreId":  this.accountService.currentUserValue.user.storeId || 0,
      "ItemName":  `${this._IpSalesRetService.userFormGroup.get('ItemName').value}%`, 
      "BatchNo":  0
    }
    console.log(Param)
    this._IpSalesRetService.getCashItemList(Param).subscribe(data => {
      this.ItemfilteredOptions = data;
      console.log(this.ItemfilteredOptions)
      this.filteredOptionsItem = data;
      if (this.ItemfilteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  getItemOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  getSelectedItemObj(obj){
    console.log(obj)
    this.vTotalQty = obj.Qty;
    this.vSalesNo = obj.SalesNo; 
    this.vBatchNo = obj.BatchNo;
    this.vBatchExpDate = obj.BatchExpDate
    this.vUnitMRP = obj.UnitMRP;
    this.vVatPer = obj.VatPer; 
    this.vDiscPer = obj.DiscPer;
    this.vRegId = obj.RegID
  }
 OnAdd(){
  if ((this.vReturnQty == '' || this.vReturnQty == null || this.vReturnQty == undefined)) {
    this.toastr.warning('Please enter a Return Qty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  const isDuplicate = this.dsIpSaleItemList.data.some(item => item.BatchNo === this.vBatchNo);
  if (!isDuplicate) {
    this.chargeslist = this.dsIpSaleItemList.data;
    this.chargeslist.push(
      {
        SalesNo:this.vSalesNo || 0,
        ItemName:this._IpSalesRetService.userFormGroup.get('ItemName').value.ItemName || '',
        BatchNo: this.vBatchNo || 0,
        ExpDate: this.vBatchExpDate || 0,
        MRP: this.vUnitMRP || 0,
        Qty: this.vTotalQty || 0,
        ReturnQty: this.vReturnQty || 0,
        TotalAmt:   this.TotalAmt || 0,
        GST:this.vVatPer || 0,
        GSTAmt:this.GSTAmt || 0,
        Disc:this.vDiscPer || 0,
        DiscAmt:this.DiscAmt || 0,
        NetAmount:  this.NetAmt || 0
      });
    this.dsIpSaleItemList.data = this.chargeslist;
  } else {
    this.toastr.warning('Selected Item already added in the list', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
  }
  this.ItemReset();
  this.itemname.nativeElement.focus();
 }
 ItemReset(){
this.vItemName = '';
this.vReturnQty = 0 ;
this.vTotalQty = 0 ;
 }
 TotalAmt:any;
 GSTAmt:any;
 DiscAmt:any; 
 NetAmt:any;
 vFinalNetAmount:any;
 vFinalTotalAmt:any
calculation(){
  if(parseInt(this.vReturnQty) > parseInt(this.vTotalQty)){
    this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    this.vReturnQty= 0;
  }else{
    this.TotalAmt = (parseFloat(this.vUnitMRP) * parseFloat(this.vReturnQty)).toFixed(2);
    this.GSTAmt =  ((parseFloat(this.vVatPer) * parseFloat(this.TotalAmt))/100).toFixed(2) || 0;
    this.DiscAmt =  ((parseFloat(this.vDiscPer) * parseFloat(this.TotalAmt))/100).toFixed(2) || 0;
    this.NetAmt = ((parseFloat(this.TotalAmt) +  parseFloat(this.GSTAmt)) - parseFloat(this.DiscAmt)).toFixed(2);
  }

} 
getCellCalculation(contact, ReturnQty) {
  if (parseInt(contact.ReturnQty) > parseInt(contact.Qty)) {
    this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    contact.ReturnQty = 0;
    contact.ReturnQty = ''; 
    contact.TotalAmount = 0;
    contact.GSTAmt = 0;
    contact.DiscAmt = 0;
    contact.NetAmount = 0;
  }
  else { 
    contact.TotalAmount = (parseFloat(contact.MRP) * parseFloat(contact.ReturnQty)).toFixed(2);
    contact.GSTAmt=  ((parseFloat(contact.GST) * parseFloat(contact.TotalAmount))/100).toFixed(2) || 0;
    contact.DiscAmt=  ((parseFloat(contact.Disc) * parseFloat(contact.TotalAmount))/100).toFixed(2) || 0;
    contact.NetAmount = ((parseFloat(contact.TotalAmount) +  parseFloat(contact.GSTAmt)) - parseFloat(contact.DiscAmt)).toFixed(2);
  }
}
getTotalAmt(element) {
 
  this.vFinalNetAmount = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
  this.vFinalTotalAmt = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
  this.vFinalGSTAmt = (element.reduce((sum, { GSTAmt }) => sum += +(GSTAmt || 0), 0)).toFixed(2);
  this.vFinalDiscAmount = (element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0)).toFixed(2);
 
  return this.vFinalNetAmount;
}
keyPressAlphanumeric(event) {
  var inp = String.fromCharCode(event.keyCode);
  if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
} 
  getCreditItemList() { 
    var Param = { 
      "RegNo":this.vRegNo || 0,
      "StoreId":  this.accountService.currentUserValue.user.storeId || 0,
      "ItemId":  this._IpSalesRetService.userFormGroup.get('ItemName').value.ItemID || 0,
      "BatchNo":  0
    }
    console.log(Param)
    this._IpSalesRetService.getCreditItemList(Param).subscribe(data => {
      this.ItemfilteredOptions = data as IPSalesItemList[];
      console.log(this.dsIpSaleItemList.data)
      this.dsIpSaleItemList.sort = this.sort;
      this.dsIpSaleItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
 
 

   
  onSave() {

  }

  onClose() {

  }

  onClear() {

  }
  @ViewChild('itemname') itemname: ElementRef;
  @ViewChild('ReturnQty') ReturnQty: ElementRef; 
 
  public onEnteritemName(event): void {
    if (event.which === 13) {
      this.ReturnQty.nativeElement.focus();
    }
  }
} 
export class IPSalesItemList {
  SalesNo: Number;
  ExpDate: number;
  ItemName: string;
  BatchNo: string;
  MRP: number;
  Qty: any;;
  ReturnQty: any;
  TotalAmt: any;
  GST:any;
  Disc:any;
  GSTAmt:any;
  DiscAmt:any;
  NetAmount:any;

  /**
   * Constructor
   *
   * @param IPSalesItemList
   */
  constructor(IPSalesItemList) {
    {
      this.SalesNo = IPSalesItemList.SalesNo || 0;
      this.ExpDate = IPSalesItemList.ExpDate || 0;
      this.ItemName = IPSalesItemList.ItemName || "";
      this.BatchNo = IPSalesItemList.BatchNo || "";
      this.MRP = IPSalesItemList.MRP || 0;
      this.Qty = IPSalesItemList.Qty || 0;
      this.ReturnQty = IPSalesItemList.ReturnQty ||  0;
      this.TotalAmt = IPSalesItemList.TotalAmt ||  0;
      this.GST = IPSalesItemList.GST ||  0;
      this.Disc = IPSalesItemList.Disc ||  0;
      this.GSTAmt = IPSalesItemList.GSTAmt ||  0;
      this.DiscAmt = IPSalesItemList.DiscAmt ||  0;
      this.NetAmount = IPSalesItemList.NetAmount ||  0;
    }
  }
}

// <!-- (keyup)="getTotalAmount(contact)" -->