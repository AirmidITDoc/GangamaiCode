import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatSelect } from '@angular/material/select';

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
  isChecked: boolean = true;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;


  StoreList:any=[];
  StoreName:any;
  ItemID:any;
  VatPercentage:any;
  GSTPer:any;
  Specification:any;
  VatAmount:any;
  FinalNetAmount:any;
  FinalDisAmount:any;
  NetPayamount:any;
  CGSTFinalAmount:any;
  SGSTFinalAmount:any;
  IGSTFinalAmount:any;
  TotalFinalAmount:any;

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
    'GST',
    'GSTAmount',
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
  BatchNo: any;
  Qty: any;
  ExpDate: any;
  MRP: any;
  FreeQty: any=0;
  Rate: any;
  TotalAmount: any;
  Disc: any=0;
  DisAmount: any=0;
  CGST: any;
  CGSTAmount: any;
  SGST: any;
  SGSTAmount: any;
  IGST: any=0;
  IGSTAmount: any=0;
  NetAmount: any;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsItemName: Observable<string[]>;
  optionsToStore: any;
  optionsFrom: any;
  optionsMarital: any;
  optionsSupplier: any;
  optionsItemName: any;
  renderer: any;
  GST: any=0;
  GSTAmount: any=0;

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
    this.gePharStoreList();
    this.getGRNList() ;
    
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  
// getSelectedObj(obj) {

//   this.ItemName = obj.ItemName;
//   this.UOM = obj.UOM;
//   this.HSNCode = obj.HSNCode;
//   this.BatchNo = obj.BatchNo; 
//   this.ExpDate = obj.ExpDate;
//   this.Qty = obj.Qty;
//   this.FreeQty = obj.FreeQty;
//   this.MRP = obj.MRP;
//   this.Rate = obj.Rate;
//   this.TotalAmount = obj.TotalAmount;
//   this.Disc = obj.Disc;
//   this.DisAmount = obj.DisAmount;
//   this.GST = obj.GST;
//   this.GSTAmount = obj.GSTAmount;
//   this.CGST = obj.CGST;
//   this.CGSTAmount = obj.CGSTAmount;
//   this.SGST = obj.SGST;
//   this.SGSTAmount = obj.SGSTAmount;
//   this.IGST = obj.IGST;
//   this.IGSTAmount = obj.IGSTAmount;
//   this.NetAmount = obj.NetAmount;
 
// }
 
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
      GST:this.GST ,
      GSTAmount : this.GSTAmount ,
      CGST:this.CGST ,
      CGSTAmount : this.CGSTAmount ,
      SGST: this.SGST ,
      SGSTAmount : this.SGSTAmount,
      IGST: this.IGST ,
      IGSTAmount:this.IGSTAmount ,
      NetAmount :this.NetAmount ,

    });

    this.dsItemNameList.data=this.chargeslist
    this._GRNList.userFormGroup.reset();
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


deleteTableRow(element) {
  let index = this.chargeslist.indexOf(element);
  if (index >= 0) {
    this.chargeslist.splice(index, 1);
    this.dsItemNameList.data = [];
    this.dsItemNameList.data = this.chargeslist;
  }
  Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
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
  debugger
  if (this.Rate && this.Qty) {
    // this.TotalAmount = Math.round(parseInt(this.Rate) * parseInt(this.Qty)).toString();

    this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(2);
    this.NetAmount = this.TotalAmount;
    // Swal.fire(this.NetAmount)
    // this.calculatePersc();
  }
}

calculateDiscAmount() {
  if (this.Disc) {
    this.NetAmount =  (parseFloat(this.NetAmount) - parseFloat(this.DisAmount)).toFixed(2);
  }
}

calculateDiscperAmount(){
  debugger
  if (this.Disc) {
    let dis=this._GRNList.userFormGroup.get('Disc').value
    this.DisAmount = (parseFloat(dis) * parseFloat(this.NetAmount) /100).toFixed(2);
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

calculateGSTperAmount() {

  if (this.GST) {
  
    this.GSTAmount = ((parseFloat (this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
    this.NetAmount =(parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
    this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
 
  }
}

calculateGSTAmount() 
{
  debugger
  if (this.GSTAmount > 0) {
   
   this.NetAmount= (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(2);
   this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
  }else if(this.GST==0){
    this.GSTAmount=0;
  }
}

calculateCGSTAmount() {
 if (this.CGST) {
  
    this.CGSTAmount = (parseFloat(this.TotalAmount) * (parseFloat(this.CGST)) / 100).toFixed(2);
    this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.CGSTAmount)).toFixed(2);
    // this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
 
  }
  
}

calculateSGSTAmount() {
  if (this.SGST) {
    this.SGSTAmount =((parseFloat(this.TotalAmount) * parseFloat(this.SGST)) / 100).toFixed(2);
    this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.SGSTAmount)).toFixed(2);
    // this.calculatePersc();
  }
}

calculateIGSTAmount() {
  if (this.IGST) {
    this.IGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.IGST)) / 100).toFixed(2);
    this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.IGSTAmount)).toFixed(2);
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
  CGSTAmt = element.reduce((sum, { CGSTAmount }) => sum += +(CGSTAmount || 0), 0);this.CGSTAmount
this.CGSTFinalAmount=CGSTAmt;
  return CGSTAmt;
}

getSGSTAmt(element) {
  let SGSTAmt;
  SGSTAmt = element.reduce((sum, { SGSTAmount }) => sum += +(SGSTAmount || 0), 0);
  this.SGSTFinalAmount=SGSTAmt;
  return SGSTAmt;
}

getIGSTAmt(element)
{
  let IGSTAmt;
  IGSTAmt = element.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
  this.IGSTFinalAmount=IGSTAmt;
  return IGSTAmt;
}

getTotalAmt(element)
{
  let TotalAmt;
  TotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
  this.TotalFinalAmount=TotalAmt;

  let FinalDisAmount
  FinalDisAmount = element.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0);

  this.FinalDisAmount=FinalDisAmount;

  let FinalNetAmount;
  FinalNetAmount= element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
   this.FinalNetAmount= (FinalNetAmount).toFixed(2);
   this.NetPayamount= this.FinalNetAmount;

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

    gePharStoreList() {
      debugger
      var vdata = {
        Id: this.accountService.currentUserValue.user.storeId
      }
      this._GRNList.getLoggedStoreList(vdata).subscribe(data => {
        this.StoreList = data;
        this._GRNList.GRNSearchGroup.get('StoreId').setValue(this.StoreList[0]);
        this.StoreName = this._GRNList.GRNSearchGroup.get('StoreId').value.StoreName;
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

  
        
  getGRNItemList() {
    debugger
    var m_data = {
      "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
      "StoreId":2// this._GRNList.GRNSearchGroup.get('StoreId').value.storeid || 0
    }
    if (this._GRNList.userFormGroup.get('ItemName').value.length >= 2) {
      this._GRNList.getItemNameList(m_data).subscribe(data => {
        this.filteredOptions = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }

  getSelectedObj(obj) {this.accountService
    debugger
    this.ItemID=obj.ItemId;
    this.ItemName = obj.ItemName;
    this.Qty = obj.BalanceQty;
    
    if(this.Qty > 0){
      this.UOM = obj.UOM;
      this.Rate = obj.PurchaseRate;
      this.TotalAmount = (parseInt(obj.BalanceQty)* parseFloat(this.Rate)).toFixed(2);
     this.NetAmount=  this.TotalAmount ;
      this.VatPercentage=obj.VatPercentage;
      // this.CGSTPer =onj.CGSTPer;
      this.GSTPer = obj.GSTPer;
      this.GSTAmount = 0;
      // this.NetAmount = obj.NetAmount;
      // this.MRP = obj.MRP;
      this.Specification = obj.Specification;
    }
    // this.qty.nativeElement.focus();
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
    Id: this.accountService.currentUserValue.user.storeId
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
  focusNextService() {
    this.renderer.selectRootElement('#myInput').focus();
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

  OnSave() {
      debugger
    let grnSaveObj = {};
    grnSaveObj['grnDate'] = this.dateTimeObj.date;
    grnSaveObj['grnTime'] = this.dateTimeObj.time;
    grnSaveObj['storeId'] = this._GRNList.GRNFirstForm.get('StoreId').value.Storeid || 0;
    grnSaveObj['supplierID'] = this._GRNList.GRNFirstForm.get('Supplier_Id').value.SupplierId || 0;
    grnSaveObj['invoiceNo'] = this._GRNList.GRNFirstForm.get('InvoiceNo').value || 0;
    grnSaveObj['deliveryNo'] = 0,//this._GRNList.GRNFirstForm.get('Supplier_Id').value.SupplierId || 0;
    grnSaveObj['gateEntryNo'] = this._GRNList.GRNFirstForm.get('GateEntryNo').value || 0;
    grnSaveObj['cash_CreditType'] = true,
    grnSaveObj['grnType'] = 0;
    grnSaveObj['totalAmount'] = this.TotalFinalAmount;
    grnSaveObj['totalDiscAmount'] =  this.FinalDisAmount ;
    grnSaveObj['totalVATAmount'] = this.VatAmount;
    grnSaveObj['netAmount'] =this.FinalNetAmount;
    grnSaveObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || 0;
    grnSaveObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || 0;
    grnSaveObj['isVerified'] = false;
    grnSaveObj['isClosed'] =false;
    grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id,
    grnSaveObj['invDate'] = this.dateTimeObj.date;
    grnSaveObj['debitNote'] = 0;
    grnSaveObj['creditNote'] = 0;
    grnSaveObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharges').value || 0;
    grnSaveObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
    grnSaveObj['totCGSTAmt'] = this.CGSTFinalAmount;
    grnSaveObj['totSGSTAmt'] =this.SGSTFinalAmount;
    grnSaveObj['totIGSTAmt'] =this.IGSTFinalAmount;
    grnSaveObj['tranProcessId'] = 0;
    grnSaveObj['tranProcessMode'] = "";
    grnSaveObj['billDiscAmt'] = this.FinalDisAmount;
    grnSaveObj['grnid'] = 0;
   
    let SavegrnDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
  
      console.log(element);
  
      let grnDetailSaveObj = {};
      grnDetailSaveObj['grnDetID'] = 0;
      grnDetailSaveObj['grnId'] = 0;
      grnDetailSaveObj['itemId'] = element.ItemID;
      grnDetailSaveObj['uomId'] = element.UOM;
      grnDetailSaveObj['receiveQty'] = element.Qty;
      grnDetailSaveObj['freeQty'] = element.FreeQty;
      grnDetailSaveObj['mrp'] =  element.MRP;
      grnDetailSaveObj['rate'] = element.Rate;
      grnDetailSaveObj['totalAmount'] = element.TotalAmount;
      grnDetailSaveObj['conversionFactor'] = 0 ;//element.vatAmount;
      grnDetailSaveObj['vatPercentage'] =element.VatPer;;
      grnDetailSaveObj['vatAmount'] = element.VatAmt;
      grnDetailSaveObj['discPercentage'] = element.Disc;
      grnDetailSaveObj['discAmount'] = element.DisAmount;
      grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
      grnDetailSaveObj['landedRate'] = 0 ;//this.CgstAmt;
      grnDetailSaveObj['netAmount'] = element.NetAmount;
      grnDetailSaveObj['grossAmount'] = element.NetAmount;
      grnDetailSaveObj['totalQty'] = element.Qty;
      grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
      grnDetailSaveObj['batchNo'] = element.BatchNo;
      grnDetailSaveObj['batchExpDate'] = this.dateTimeObj.date;
      grnDetailSaveObj['purUnitRate'] = 0; //this.SgstPer;
      grnDetailSaveObj['purUnitRateWF'] = 0; //this.SgstPer;
      grnDetailSaveObj['cgstPer'] = element.CGST;
      grnDetailSaveObj['cgstAmt'] = element.CGSTAmount;
      grnDetailSaveObj['sgstPer'] = element.SGST;
      grnDetailSaveObj['sgstAmt'] = element.SGSTAmount;
      grnDetailSaveObj['igstPer'] =element.IGST;
      grnDetailSaveObj['igstAmt'] = element.IGSTAmount;
      grnDetailSaveObj['mrP_Strip'] = element.MRP_Strip;
      grnDetailSaveObj['isVerified'] = 0,//element.SGSTAmount;
      grnDetailSaveObj['igstPer'] =element.IGST;
      grnDetailSaveObj['isVerifiedDatetime'] = this.dateTimeObj.time;
      grnDetailSaveObj['isVerifiedUserId'] = 1 ;//this.SgstAmt;

      SavegrnDetailObj.push(grnDetailSaveObj);
  
    });

    let updateItemMasterGSTPerObjarray = [];
    this.dsItemNameList.data.forEach((element) => {
  
      console.log(element);
  
      let updateItemMasterGSTPerObj = {};
      // updateItemMasterGSTPerObj['grnDetID'] = 0;
      // updateItemMasterGSTPerObj['grnId'] = 0;
      updateItemMasterGSTPerObj['itemId'] = element.ItemID;
      updateItemMasterGSTPerObj['cgst'] = element.CGST;
      updateItemMasterGSTPerObj['sgst'] = element.SGST;
      updateItemMasterGSTPerObj['igst'] = element.IGST;
      updateItemMasterGSTPerObj['hsNcode'] = element.HSNCode;
      updateItemMasterGSTPerObjarray.push(updateItemMasterGSTPerObj);
    });
  
    let submitData = {
      "grnSave": grnSaveObj,
      "grnDetailSave": SavegrnDetailObj,
      "updateItemMasterGSTPer":updateItemMasterGSTPerObjarray
    };
  
    console.log(submitData);
  
      this._GRNList.GRNSave(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Save GRN !', 'Record Generated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'GRN not saved', 'error');
      }
      // this.isLoading = '';
    });
  
  }


  // @ViewChild('SupplierId') SupplierId: MatSelect;





  @ViewChild('InvoiceNo') InvoiceNo: ElementRef;
  @ViewChild('DateOfInvoice') DateOfInvoice: ElementRef;
  @ViewChild('GateEntryNo') GateEntryNo: ElementRef;
  @ViewChild('Status2') Status2: ElementRef;

  @ViewChild('itemname') itemname: ElementRef;
  @ViewChild('Uom') Uom: ElementRef;
  @ViewChild('hsncode') hsncode: ElementRef;
  @ViewChild('batchno') batchno: ElementRef;
  @ViewChild('expdate') expdate: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('freeqty') freeqty: ElementRef;
  @ViewChild('mrp') mrp: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('disc') disc: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('cgst') cgst: ElementRef;
  @ViewChild('sgst') sgst: ElementRef;
  @ViewChild('igst') igst: ElementRef;


  @ViewChild('Remark') Remark: ElementRef;
  @ViewChild('ReceivedBy') ReceivedBy: ElementRef;
  @ViewChild('DebitAmount') DebitAmount: ElementRef;
  @ViewChild('CreditAmount') CreditAmount: ElementRef;
  @ViewChild('DiscAmount') DiscAmount: ElementRef;
  @ViewChild('NetPayamt') NetPayamt: ElementRef;
  @ViewChild('OtherCharges') OtherCharges: ElementRef;
  @ViewChild('RoundingAmt') RoundingAmt: ElementRef;
  

  
  // public onEnterItemName(event): void {
  //   if (event.which === 13) {
  //     this.hsncode.nativeElement.focus();
  //   }
  // }
 

    
  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.Uom.nativeElement.focus();
    }
  }
  

  public onEnterUOM(event): void {
    if (event.which === 13) {
      this.hsncode.nativeElement.focus();
    }
  }
  public onEnterHSNCode(event): void {
    if (event.which === 13) {
      this.batchno.nativeElement.focus();
    }
  }
  
  public onEnterBatchNo(event): void {
    if (event.which === 13) {
      this.expdate.nativeElement.focus();
    }
  }

  public onEnterExpDate(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }

  public onEnterQty(event): void {
    if (event.which === 13) {
      this.freeqty.nativeElement.focus();
    }
  }
  
  public onEnterFreeQty(event): void {
    if (event.which === 13) {
      this.mrp.nativeElement.focus();
    }
  }
  
  public onEnterMRP(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
    }
  }
  
  public onEnterRate(event): void {
    if (event.which === 13) {
      this.disc.nativeElement.focus();
    }
  }

  public onEnterDisc(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
    }
  }

  public onEnterGST(event): void {
    if (event.which === 13) {
      this.cgst.nativeElement.focus();
    }
  }

  public onEnterCGST(event): void {
    if (event.which === 13) {
      this.sgst.nativeElement.focus();
    }
  }

  public onEnterSGST(event): void {
    if (event.which === 13) {
      this.igst.nativeElement.focus();
    }
  }

  public onEnterIGST(event): void {
    if (event.which === 13) {
      this.itemname.nativeElement.focus();
           
    }
  }


  
  public onEnterSupplier(event): void {
    if (event.which === 13) {
      this.InvoiceNo.nativeElement.focus()
      }
  }

  public onEnterInvoiceNo(event): void {
    if (event.which === 13) {
      this.DateOfBirth.nativeElement.focus()
    }
  }

  public onEnterDateOfInvoice(event): void {
    if (event.which === 13) {
      
      this.GateEntryNo.nativeElement.focus()
    }
  }
  public onEnterGateEntryNo(event): void {
    if (event.which === 13) {
      this.itemname.nativeElement.focus()
     
    }
  }


  public onEnterRemark(event): void {
    if (event.which === 13) {
      this.ReceivedBy.nativeElement.focus();
    }
  }

  public onEnterReceivedBy(event): void {
    if (event.which === 13) {
      this.DebitAmount.nativeElement.focus();
    }
  }

  public onEnterDebitAmount(event): void {
    if (event.which === 13) {
      this.CreditAmount.nativeElement.focus();
    }
  }

  public onEnterCreditAmount(event): void {
    if (event.which === 13) {
      this.DiscAmount.nativeElement.focus();
    }
  }

  
  public onEnterDiscAmount(event): void {
    if (event.which === 13) {
      this.NetPayamt.nativeElement.focus();
    }
  }

  
  public onEnterNetPayamt(event): void {
    if (event.which === 13) {
      this.OtherCharges.nativeElement.focus();
    }
  }

  public onEnterOtherCharges(event): void {
    if (event.which === 13) {
      this.RoundingAmt.nativeElement.focus();
    }
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
  GST: number;
  GSTAmount: number;
  CGST: number;
  CGSTAmount: number;
  SGST: number;
  SGSTAmount: number;
  IGST: number;
  IGSTAmount: number;
  NetAmount: number;
  position: number;
   ItemID: any;
   VatPer: any;
   VatAmt: any;
   MRP_Strip:any;
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
      this.GST = ItemNameList.GST || 0;
      this.GSTAmount = ItemNameList.GSTAmount || 0;
      this.CGST = ItemNameList.CGST || 0;
      this.CGSTAmount = ItemNameList.CGSTAmount || 0;
      this.SGST = ItemNameList.SGST || 0;
      this.SGSTAmount = ItemNameList.SGSTAmount || 0;
      this.IGST = ItemNameList.IGST || 0;
      this.IGSTAmount = ItemNameList.IGSTAmount || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
      this.ItemID = ItemNameList.ItemID || 0;
      this.VatPer = ItemNameList.VatPer || 0;
      this.VatAmt = ItemNameList.VatAmt || 0;
      this.MRP_Strip = ItemNameList.MRP_Strip || 0;
    }
  }
}
