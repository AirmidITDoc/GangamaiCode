import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GRNList, GrnItemList, ItemNameList } from '../good-receiptnote.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { GoodReceiptnoteService } from '../good-receiptnote.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-update-grn',
  templateUrl: './update-grn.component.html',
  styleUrls: ['./update-grn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class UpdateGRNComponent implements OnInit {
  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  FromStoreList: any;
  SupplierList: any;
  screenFromString = 'admission-form';
  isPaymentSelected: boolean = false;
  isSupplierSelected: boolean = false;
  isItemNameSelected: boolean = false;
  registerObj = new ItemNameList({});
  chargeslist: any = [];
  isChecked: boolean = true;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;
PaymentType:any;

  StoreList: any = [];
  StoreName: any;
  ItemID: any;
  VatPercentage: any;
  GSTPer: any;
  Specification: any;
  VatAmount: any;
  FinalNetAmount: any;
  FinalDisAmount: any;
  FinalVatAmount:any;
  NetPayamount: any;
  CGSTFinalAmount: any;
  SGSTFinalAmount: any;
  IGSTFinalAmount: any;
  TotalFinalAmount: any;

  dsGRNList = new MatTableDataSource<GRNList>();

  dsGrnItemList = new MatTableDataSource<GrnItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();


  displayedColumns2 = [
   
    'ItemName',
    'UOMId',
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
    "GST",
    'GSTAmount',
    'CGST',
    'CGSTAmount',
    'SGST',
    'SGSTAmount',
    'IGST',
    'IGSTAmount',
    'NetAmount',
    'buttons',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  filteredOptions: any;
  noOptionFound: boolean;
  ItemName: any;
  UOM: any = 0;
  HSNCode: any = 0;
  Dis: any = 0;
  BatchNo: any;
  Qty: any;
  ExpDate: any;
  MRP: any;
  FreeQty: any = 0;
  Rate: any;
  TotalAmount: any;
  Disc: any = 0;
  DisAmount: any = 0;
  CGST: any;
  CGSTAmount: any;
  SGST: any;
  SGSTAmount: any;
  IGST: any = 0;
  IGSTAmount: any = 0;
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
  GST: any = 0;
  GSTAmount: any = 0;
  InvoiceNo: any;
  GateEntryNo: any;
  SupplierId: any;
  StoreId: any;

  Status3List = [
    { id: 1, name: "GST Before Disc" },
    { id: 2, name: "GST After Disc" },
    { id: 3, name: "GST On MRP" },
    { id: 4, name: "GST On Pur +FreeQty" },
    { id: 5, name: "GST on MRP Plus FreeQty" },
    { id: 6, name: "GST After 2Disc" }
  ];
  GSTAmt: any;
  DiscAmt: any;
  IGSTAmt: any;
  CGSTAmt: any;
  SGSTAmt: any;

  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateGRNComponent>,
    private accountService: AuthenticationService,
    private snackBarService: SnackBarService,
    public toastr : ToastrService,
  ) { }

  ngOnInit(): void {

    if (this.data.chkNewGRN==2) {
// debugger
      this.registerObj = this.data.Obj;
      this.InvoiceNo = this.registerObj.InvoiceNo;
      this.GateEntryNo = this.registerObj.GateEntryNo;
      this.SupplierId = this.registerObj.SupplierId;
      this.StoreId =this.registerObj.StoreId;
     
      // this.HSNCode = this.registerObj.HSNCode;
      // this.ExpDate = this.registerObj.ExpDate;
      // this.Disc = this.registerObj.Disc;
      // this.DisAmount = this.registerObj.DisAmount;
      // this.GST = this.GST;
      // this.GSTAmount = this.registerObj.GSTAmount
      this.getGRNItemDetailList(this.registerObj);
      this.setDropdownObjs();
    }

    this.getToStoreSearchList();
    // this.getSupplierSearchList();
    this.getFromStoreSearchList();
    this.getToStoreSearchCombo();
    this.getSupplierSearchCombo();
    this.gePharStoreList();


  }
  date = new FormControl(moment());

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);

    console.log( this.datePipe.transform(this.date.value, "yyyy-MM"));
   
    datepicker.close();
  }


  
  setDropdownObjs() {
    const toSelectStatusId = this.Status3List.find(c => c.id == this.registerObj.id);
    this._GRNList.GRNFirstForm.get('Status3').setValue(toSelectStatusId);

    //  const toSelectPaymentTerm = this.Status3List.find(c => c.id == this.registerObj.Status3);
    //  this._GRNList.GRNSearchGroup.get('Status3').setValue(toSelectPaymentTerm);


    //  const toSelect = this.PaymentModeList.find(c => c.id == this.registerObj.ModeOfPayment);
    //  this._PurchaseOrder.PurchaseStoreform.get('PaymentMode').setValue(toSelect);

    //  const toSelectCity = this.TaxNatureList.find(c => c.id == this.registerObj.TaxNature);
    //  this._PurchaseOrder.PurchaseStoreform.get('TaxNature').setValue(toSelectCity);

    // this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);

    // this.onChangeCityList(this.personalFormGroup.get('CityId').value);

    // this.personalFormGroup.updateValueAndValidity();
    // this.dialogRef.close();

  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }



  getGRNItemDetailList(el) {
    debugger
    var Param = {
      "GRNID":  el.GRNID,

    }
    this._GRNList.getGrnItemDetailList(Param).subscribe(data => {
      this.dsItemNameList.data = data as ItemNameList[];
      this.dsTempItemNameList.data = data as ItemNameList[];
      //console.log(data)
      // this.dsItemNameList.sort = this.sort;
      // this.dsItemNameList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onAdd() {
    this.dsItemNameList.data = [];
    this.chargeslist = this.dsTempItemNameList.data;
    this.chargeslist.push(
      {
        ItemId:this._GRNList.userFormGroup.get('ItemName').value.ItemID || 0,
        ItemName: this._GRNList.userFormGroup.get('ItemName').value.ItemName || '',
        UOMId: this.UOM,
        HSNcode: this.HSNCode,
        BatchNo: this.BatchNo,
        BatchExpDate: this.datePipe.transform(this.date.value, "yyyy-MM"),
        ReceiveQty: this.Qty,
        FreeQty: this.FreeQty,
        MRP: this.MRP,
        Rate: this.Rate,
        TotalAmount: this.TotalAmount,
        DiscPercentage: this.Disc,
        DiscAmount: this.DisAmount,
        VatPercentage: this.GST,
        VatAmount: this.GSTAmount,
        CGSTPer: this.CGST,
        CGSTAmt: this.CGSTAmount,
        SGSTPer: this.SGST,
        SGSTAmt: this.SGSTAmount,
        IGSTPer: this.IGST,
        IGSTAmt: this.IGSTAmount,
        NetAmount: this.NetAmount,

      });

    // this.dsItemNameList.data = this.chargeslist
    // this._GRNList.userFormGroup.reset();
    // this.add=false;
    // this.itemname.nativeElement.focus();
   // console.log(this.chargeslist);
    this.dsItemNameList.data = this.chargeslist
    this._GRNList.userFormGroup.reset();
    //this.ItemID.nativeElement.focus();
    this.add=false; 
  }

  
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';

  }

  getSelectedObjSupp(obj) {
    this.SupplierId = obj.SupplierId;
  }

  getOptionTextSupplier(option) {
 
    return option && option.SupplierName ? option.SupplierName : '';
 }

  getOptionText(option) {

    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }


  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';

  }

  calculateTotalAmount() {
    
    if (this.Rate && this.Qty) {
      // this.TotalAmount = Math.round(parseInt(this.Rate) * parseInt(this.Qty)).toString();

      this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(2);
      this.NetAmount = this.TotalAmount;

    }
  }

  calculateDiscAmount() {
    if (this.Disc) {
      this.NetAmount = (parseFloat(this.NetAmount) - parseFloat(this.DisAmount)).toFixed(2);
    }
  }

  calculateDiscperAmount() {
    
    if (this.Disc) {
      let dis = this._GRNList.userFormGroup.get('Disc').value
      this.DisAmount = (parseFloat(dis) * parseFloat(this.NetAmount) / 100).toFixed(2);
      // this.DiscAmount =  DiscAmt
      this.NetAmount = this.NetAmount - this.DisAmount;

    }
  }

  calculatePersc() {
    if (this.Disc) {
      this.Disc = Math.round(this.TotalAmount * parseInt(this.DisAmount)) / 100;
      this.NetAmount = this.TotalAmount - this.Disc;
      this._GRNList.userFormGroup.get('calculateDiscAmount').disable();
    }
  }


  TotalGSTPer(){
    this.GST=0;
    this.GST += parseFloat(this.CGST) ;
    this.GST += parseFloat(this.SGST) ;
    this.GST += parseFloat(this.IGST) ;  
    return this.GST.toFixed(2);
  }

  TotalGSTAmount(){
    if(this.GSTAmount) {
    this.GSTAmount = (parseFloat(this.CGSTAmount) + parseFloat(this.SGSTAmount) + parseFloat(this.IGSTAmount)).toFixed(2);
    this._GRNList.userFormGroup.get('GSTAmount').setValue(this.GSTAmount);
  }
}

  calculateGSTperAmount() {

    // if (this.GST) {

    //   this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
    //   this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
    //   this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);

    // }
  }

  calculateGSTAmount() {
    
    // if (this.GSTAmount) {

    //   this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(2);
    //   this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    // } else if (this.GST == 0) {
    //   this.GSTAmount = 0;
    // }
  }

  calculateCGSTAmount() {
    if (this.CGST) {
    //  this.GST =  (parseFloat(this.GST) + parseFloat(this.CGST)).toFixed(2);
      this.CGSTAmount = (parseFloat(this.TotalAmount) * (parseFloat(this.CGST)) / 100).toFixed(2);
      this.GSTAmount = (parseFloat(this.GSTAmount) + parseFloat(this.CGSTAmount)).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.CGSTAmount)).toFixed(2);
      // this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);

    }

  }

  calculateSGSTAmount() {
    if (this.SGST) {
     // this.GST =  (parseFloat(this.GST) + parseFloat(this.SGST)).toFixed(2);
      this.SGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.SGST)) / 100).toFixed(2);
      this.GSTAmount = (parseFloat(this.GSTAmount) + parseFloat(this.SGSTAmount)).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.SGSTAmount)).toFixed(2);
      // this.calculatePersc();
    }
  }

  calculateIGSTAmount() {
    if (this.IGST) {
     // this.GST =  (parseFloat(this.GST) + parseFloat(this.IGST)).toFixed(2);
      this.IGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.IGST)) / 100).toFixed(2);
      this.GSTAmount = (parseFloat(this.GSTAmount) + parseFloat(this.IGSTAmount)).toFixed(2);
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
    CGSTAmt = element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0); this.CGSTAmount
    this.CGSTFinalAmount = CGSTAmt;
    return CGSTAmt;
  }

  getSGSTAmt(element) {
    let SGSTAmt;
    SGSTAmt = element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0);
    this.SGSTFinalAmount = SGSTAmt;
    return SGSTAmt;
  }

  getIGSTAmt(element) {
    let IGSTAmt;
    IGSTAmt = element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0);
    this.IGSTFinalAmount = IGSTAmt;
    return IGSTAmt;
  }

  getTotalAmt(element) {
    let TotalAmt;
    TotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
    this.TotalFinalAmount = TotalAmt;

    let FinalDisAmount
    this.FinalDisAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);

    let FinalVatAmount
    this.FinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    

    
    let FinalNetAmount;
    FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.FinalNetAmount = (FinalNetAmount).toFixed(2);
    this.NetPayamount = this.FinalNetAmount;

    return TotalAmt;
  }

  getToStoreSearchCombo() {
    this._GRNList.getToStoreSearchList().subscribe(data => {
      this.ToStoreList = data;
     // console.log(data);
      this.optionsToStore = this.ToStoreList.slice();
      this.filteredoptionsToStore = this._GRNList.GRNSearchGroup.get('ToStoreId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterStore(value) : this.ToStoreList.slice()),
      );

    });
  }

  gePharStoreList() {
    
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNList.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._GRNList.GRNFirstForm.get('StoreId').setValue(this.StoreList[0]);
      this.StoreName = this._GRNList.GRNFirstForm.get('StoreId').value.StoreName;
    });
  }


  getSupplierSearchCombo() {
    
    this._GRNList.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
     //console.log(data);
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._GRNList.GRNSearchGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
      if (this.data) {
        
        const toSelectSUpplierId = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierId);
        this._GRNList.GRNFirstForm.get('SupplierId').setValue(toSelectSUpplierId);
        //this._GRNList.GRNFirstForm.get('SupplierId').setValue(this.SupplierList[0]);
        

      
      }
    });
  }

  // getSelectedObj(obj) {
  //   //debugger
  //   this.accountService
  //   this.ItemID = obj.ItemID;
  //   this.ItemName = obj.ItemName;
  //   this.Qty = obj.BalanceQty;

  //   if (this.Qty > 0) {
  //     this.UOM = obj.UOMId;
  //     this.Rate = obj.PurchaseRate;
  //     this.TotalAmount = (parseInt(obj.BalanceQty) * parseFloat(this.Rate)).toFixed(2);
  //     this.NetAmount = this.TotalAmount;
  //     this.VatPercentage = obj.VatPercentage;
  //     // this.CGSTPer =onj.CGSTPer;
  //     this.GSTPer = obj.GSTPer;
  //     this.GSTAmount = 0;
  //     // this.NetAmount = obj.NetAmount;
  //     // this.MRP = obj.MRP;
  //     this.Specification = obj.Specification;
  //   }
  //   // this.qty.nativeElement.focus();
  // }
  getSelectedObj(obj) {
    this.accountService
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.Qty = obj.BalQty //obj.BalanceQty;

    if (this.Qty > 0) {
      this.UOM = obj.UnitofMeasurementId;
      this.HSNCode = obj.HSNcode;
      this.Rate = obj.PurchaseRate;
      this.TotalAmount = (parseInt(this.Qty) * parseFloat(this.Rate)).toFixed(4);
      this.NetAmount = this.TotalAmount;
      this.VatPercentage = obj.VatPercentage;
      this.SGST = obj.SGSTPer;
      this.CGST = obj.CGSTPer;
      this.GSTPer = obj.GSTPer;
      this.GSTAmount = 0;
      // this.NetAmount = obj.NetAmount;
       this.MRP = obj.UnitMRP;
      this.Specification = obj.Specification;
    }
    this.qty.nativeElement.focus();
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


  getGRNItemList() {
    // debugger
    var m_data = {
      "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
      "StoreId": this._GRNList.GRNFirstForm.get('StoreId').value.storeid 
    }
    //console.log(m_data)
    //if (this._GRNList.userFormGroup.get('ItemName').value.length >= 1) {
      this._GRNList.getItemNameList(m_data).subscribe(data => {
        this.filteredOptions = data;
       // console.log( this.filteredOptions )
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
    
 
 

  onclickrow(contact) {
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
     // console.log(this.SupplierList);
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

  getItemNameList() {
    var Param = {

      "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
      "StoreId": this._GRNList.GRNFirstForm.get("StoreId").value.storeid || 0
    }
    //console.log(Param);
    this._GRNList.getItemNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      //console.log(this.filteredOptions)
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
  onClear() {
  }
  focusNextService() {
   this.renderer.selectRootElement('#myInput').focus();
  }
  OnReset() {
   // this._GRNList.GRNSearchGroup.reset();
    this._GRNList.userFormGroup.reset();
    this.dsItemNameList.data = [];
  }

  delete(elm) {
    this.dsItemNameList.data = this.dsItemNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
  }



  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsItemNameList.data = [];
      this.dsItemNameList.data = this.chargeslist;
    }
    //Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }


  OnSave(){
    if(this.data.chkNewGRN==1)
    {
      this.OnSavenew();
    }else if(this.data.chkNewGRN==2){
      this.OnSaveEdit()
    }
  }

  PaymentTypeChk(){
    if (this._GRNList.GRNFirstForm.get('PaymentType').value == 'Credit') {
      this.PaymentType=false;
    }
    else if(this._GRNList.GRNFirstForm.get('PaymentType').value == 'Cash') {
      this.PaymentType=true;
    }
  }

  OnSavenew() {
    //console.log(this.supplierID)
    debugger
        let grnSaveObj = {};
        grnSaveObj['grnDate'] = this.dateTimeObj.date;
        grnSaveObj['grnTime'] = this.dateTimeObj.time;
        grnSaveObj['storeId'] = this._GRNList.GRNFirstForm.get('StoreId').value.storeid || 0;
        grnSaveObj['supplierID'] = this._GRNList.GRNFirstForm.get('SupplierId').value.SupplierId || this.SupplierId;
        grnSaveObj['invoiceNo'] = this._GRNList.GRNFirstForm.get('InvoiceNo').value || 0;
        grnSaveObj['deliveryNo'] = 0,//this._GRNList.GRNFirstForm.get('Supplier_Id').value.SupplierId || 0;
        grnSaveObj['gateEntryNo'] = this._GRNList.GRNFirstForm.get('GateEntryNo').value || 0;
        grnSaveObj['cash_CreditType'] =  this._GRNList.GRNFirstForm.get('PaymentType').value;
        grnSaveObj['grnType'] = this._GRNList.GRNFirstForm.get('GRNType').value;
        grnSaveObj['totalAmount'] = this.TotalFinalAmount;
        grnSaveObj['totalDiscAmount'] = this.FinalDisAmount;
        grnSaveObj['totalVATAmount'] = this.FinalVatAmount;
        grnSaveObj['netAmount'] = this.FinalNetAmount;
        grnSaveObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
        grnSaveObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
        grnSaveObj['isVerified'] = false;
        grnSaveObj['isClosed'] = false;
        grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id,
        grnSaveObj['invDate'] = this.dateTimeObj.date;
        grnSaveObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
        grnSaveObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
        grnSaveObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharges').value || 0;
        grnSaveObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
        grnSaveObj['totCGSTAmt'] = this.CGSTAmount  || 0;//this._GRNList.userFormGroup.get('CGSTAmount').value || 0;
        grnSaveObj['totSGSTAmt'] =  this.SGSTAmount || 0;//this._GRNList.userFormGroup.get('SGSTAmount').value || 0;
        grnSaveObj['totIGSTAmt'] =  this.IGSTAmount || 0;//this._GRNList.userFormGroup.get('IGSTAmount').value || 0;
        grnSaveObj['tranProcessId'] = this._GRNList.GRNFirstForm.get('Status3').value.id || 0;
        grnSaveObj['tranProcessMode'] = this._GRNList.GRNFirstForm.get('Status3').value.name ||  '';
        grnSaveObj['BillDiscAmt'] = this.FinalDisAmount || 0;
        grnSaveObj['grnid'] = 0;
    
        let SavegrnDetailObj = [];
        this.dsItemNameList.data.forEach((element) => {
    
          //console.log(element);
    
          let grnDetailSaveObj = {};
          grnDetailSaveObj['grnDetID'] = 0;
          grnDetailSaveObj['grnId'] = 0;
          grnDetailSaveObj['itemId'] = element.ItemId;
          grnDetailSaveObj['uomId'] = element.UOMId;
          grnDetailSaveObj['receiveQty'] = element.ReceiveQty;
          grnDetailSaveObj['freeQty'] = element.FreeQty;
          grnDetailSaveObj['mrp'] = element.MRP;
          grnDetailSaveObj['rate'] = element.Rate;
          grnDetailSaveObj['totalAmount'] = element.TotalAmount;
          grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
          grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
          grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
          grnDetailSaveObj['discPercentage'] = element.Disc || 0;
          grnDetailSaveObj['discAmount'] = element.DisAmount || 0;
          grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
          grnDetailSaveObj['landedRate'] = 0;//this.CgstAmt;
          grnDetailSaveObj['netAmount'] = element.NetAmount;
          grnDetailSaveObj['grossAmount'] = element.NetAmount;
          grnDetailSaveObj['totalQty'] = element.ReceiveQty;
          grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
          grnDetailSaveObj['batchNo'] = element.BatchNo;
          grnDetailSaveObj['batchExpDate'] = this.datePipe.transform(this.date.value, "yyyy-MM")||this.date.value;
          grnDetailSaveObj['purUnitRate'] = 0; //this.SgstPer;
          grnDetailSaveObj['purUnitRateWF'] = 0; //this.SgstPer;
          grnDetailSaveObj['cgstPer'] = element.CGSTPer || 0;
          grnDetailSaveObj['cgstAmt'] = element.CGSTAmt || 0;
          grnDetailSaveObj['sgstPer'] = element.SGSTPer || 0;
          grnDetailSaveObj['sgstAmt'] = element.SGSTAmt || 0;
          grnDetailSaveObj['igstPer'] = element.IGSTPer || 0;
          grnDetailSaveObj['igstAmt'] = element.IGSTAmt || 0;
          grnDetailSaveObj['mrP_Strip'] = element.MRP_Strip || 0;
          grnDetailSaveObj['isVerified'] = 0,//element.SGSTAmount;
          grnDetailSaveObj['igstPer'] = element.IGST || 0;
          grnDetailSaveObj['isVerifiedDatetime'] = this.dateTimeObj.time;
          grnDetailSaveObj['isVerifiedUserId'] = 1;//this.SgstAmt;
    
          SavegrnDetailObj.push(grnDetailSaveObj);
    
        });
    
        let updateItemMasterGSTPerObjarray = [];
        this.dsItemNameList.data.forEach((element) => {
          let updateItemMasterGSTPerObj = {};
          updateItemMasterGSTPerObj['itemId'] = element.ItemId;
          updateItemMasterGSTPerObj['cgst'] = element.CGSTPer || 0;
          updateItemMasterGSTPerObj['sgst'] = element.SGSTPer || 0;
          updateItemMasterGSTPerObj['igst'] = element.IGSTPer || 0;
          updateItemMasterGSTPerObj['hsNcode'] = element.HSNcode;
          updateItemMasterGSTPerObjarray.push(updateItemMasterGSTPerObj);
        });
    
        let submitData = {
          "grnSave": grnSaveObj,
          "grnDetailSave": SavegrnDetailObj,
          "updateItemMasterGSTPer": updateItemMasterGSTPerObjarray
        };
    
        console.log(submitData);
    
        this._GRNList.GRNSave(submitData).subscribe(response => {
          if (response) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            // Swal.fire('Save GRN !', 'Record Generated Successfully !', 'success').then((result) => {
            //   if (result.isConfirmed) {
            //     let m = response;
                this._matDialog.closeAll();
                this.OnReset();
            //   }
            // });
          } else {
            this.toastr.error('New GRN Data not saved !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        },error => {
          this.toastr.error('New GRN Data not saved !, Please check API error..', 'Error !', {
           toastClass: 'tostr-tost custom-toast-error',
         });
       });
    
      }
    

  OnSaveEdit() {
    
    let updateGRNHeaderObj = {};
    updateGRNHeaderObj['grnDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['grnTime'] = this.dateTimeObj.time;
    updateGRNHeaderObj['storeId'] = this._GRNList.GRNFirstForm.get('StoreId').value.Storeid || 0;
    updateGRNHeaderObj['supplierID'] = this._GRNList.GRNFirstForm.get('SupplierId').value.SupplierId || 0;
    updateGRNHeaderObj['invoiceNo'] = this._GRNList.GRNFirstForm.get('InvoiceNo').value || 0;
    updateGRNHeaderObj['deliveryNo'] = 0,//this._GRNList.GRNFirstForm.get('SupplierId').value.SupplierId || 0;
    updateGRNHeaderObj['gateEntryNo'] = this._GRNList.GRNFirstForm.get('GateEntryNo').value || 0;
    updateGRNHeaderObj['cash_CreditType'] =  this._GRNList.GRNFirstForm.get('PaymentType').value;
    updateGRNHeaderObj['grnType'] = this._GRNList.GRNFirstForm.get('GRNType').value;
    updateGRNHeaderObj['totalAmount'] = this.TotalFinalAmount;
    updateGRNHeaderObj['totalDiscAmount'] = this.FinalDisAmount;
    updateGRNHeaderObj['totalVATAmount'] = this.FinalVatAmount;
    updateGRNHeaderObj['netAmount'] = this.FinalNetAmount;
    updateGRNHeaderObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || 0;
    updateGRNHeaderObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || 0;
    updateGRNHeaderObj['isVerified'] = false;
    updateGRNHeaderObj['isClosed'] = false;
    updateGRNHeaderObj['addedBy'] = this.accountService.currentUserValue.user.id,
    updateGRNHeaderObj['invDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
    updateGRNHeaderObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
    updateGRNHeaderObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharges').value || 0;
    updateGRNHeaderObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
    updateGRNHeaderObj['totCGSTAmt'] = this.CGSTAmount || 0;
    updateGRNHeaderObj['totSGSTAmt'] = this.SGSTAmount || 0;
    updateGRNHeaderObj['totIGSTAmt'] = this.IGSTAmount || 0;
    updateGRNHeaderObj['tranProcessId'] = this._GRNList.GRNFirstForm.get('Status3').value.id || 0;
    updateGRNHeaderObj['tranProcessMode'] =  this._GRNList.GRNFirstForm.get('Status3').value.name ||  '';
    updateGRNHeaderObj['billDiscAmt'] = this.FinalDisAmount || 0;
    updateGRNHeaderObj['grnid'] = this.registerObj.GRNID;

    let SavegrnDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      debugger
      console.log(element);

      let grnDetailSaveObj = {};
      grnDetailSaveObj['grnDetID'] = 0;
      grnDetailSaveObj['grnId'] = this.registerObj.GRNID;
      grnDetailSaveObj['itemId'] = element.ItemId || element.ItemID;
      grnDetailSaveObj['uomId'] = element.UOMId;
      grnDetailSaveObj['receiveQty'] = element.ReceiveQty;
      grnDetailSaveObj['freeQty'] = element.FreeQty;
      grnDetailSaveObj['mrp'] = element.MRP;
      grnDetailSaveObj['rate'] = element.Rate;
      grnDetailSaveObj['totalAmount'] = element.TotalAmount;
      grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
      grnDetailSaveObj['vatPercentage'] = element.VatPercentage;;
      grnDetailSaveObj['vatAmount'] = element.VatAmount;
      grnDetailSaveObj['discPercentage'] = element.Disc;
      grnDetailSaveObj['discAmount'] = element.DisAmount;
      grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
      grnDetailSaveObj['landedRate'] = 0;//this.CgstAmt;
      grnDetailSaveObj['netAmount'] = element.NetAmount;
      grnDetailSaveObj['grossAmount'] = element.NetAmount;
      grnDetailSaveObj['totalQty'] = element.ReceiveQty;
      grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
      grnDetailSaveObj['batchNo'] = element.BatchNo;
      grnDetailSaveObj['batchExpDate'] =this.datePipe.transform(this.date.value, "yyyy-MM")||this.date.value;
      grnDetailSaveObj['purUnitRate'] = 0; //this.SgstPer;
      grnDetailSaveObj['purUnitRateWF'] = 0; //this.SgstPer;
      grnDetailSaveObj['cgstPer'] = element.CGSTPer || 0;
      grnDetailSaveObj['cgstAmt'] = element.CGSTAmt || 0;
      grnDetailSaveObj['sgstPer'] = element.SGSTPer || 0;
      grnDetailSaveObj['sgstAmt'] = element.SGSTAmt || 0;
      grnDetailSaveObj['igstPer'] = element.IGSTPer || 0;
      grnDetailSaveObj['igstAmt'] = element.IGSTAmt || 0;
      grnDetailSaveObj['mrP_Strip'] = element.MRP_Strip || 0;
      grnDetailSaveObj['isVerified'] = 0,//element.SGSTAmount;
        grnDetailSaveObj['igstPer'] = element.IGST || 0;
      grnDetailSaveObj['isVerifiedDatetime'] = this.dateTimeObj.time;
      grnDetailSaveObj['isVerifiedUserId'] = 1;//this.SgstAmt;

      SavegrnDetailObj.push(grnDetailSaveObj);

    });

    let delete_GRNDetailsobj = {}
    delete_GRNDetailsobj["GRNId"] = this.registerObj.GRNID;


    let submitData = {
      "updateGRNHeader": updateGRNHeaderObj,
      "delete_GRNDetails": delete_GRNDetailsobj,
      "grnDetailSave": SavegrnDetailObj
    };

    console.log(submitData);
debugger
    this._GRNList.GRNEdit(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        // Swal.fire('Updated GRN !', 'Record Updated Successfully !', 'success').then((result) => {
          // if (result.isConfirmed) {
          //   let m = response;
            this._matDialog.closeAll();
       // }  
      } 
   
    },error => {
      this.toastr.error('New GRN Data not Updated !, Please check API error..', 'Error !', {
       toastClass: 'tostr-tost custom-toast-error',
     });
   });

  }
  // @ViewChild('SupplierId') SupplierId: MatSelect;





  @ViewChild('InvoiceNo1') InvoiceNo1: ElementRef;
  @ViewChild('DateOfInvoice') DateOfInvoice: ElementRef;
  @ViewChild('GateEntryNo1') GateEntryNo1: ElementRef;
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
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  add: boolean = false;
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
       this.gst.nativeElement.focus();
     
    }
  }
  public onEnterGST(event): void {
    if (event.which === 13) {
     // this.cgst.nativeElement.focus();
     this.add = true;
      this.addbutton.focus();
    }
  }



  public onEnterSupplier(event): void {
    if (event.which === 13) {
      this.InvoiceNo1.nativeElement.focus()
    }
  }

  public onEnterInvoiceNo(event): void {
    if (event.which === 13) {
      this.DateOfInvoice.nativeElement.focus()
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
      this.GSTAmount.nativeElement.focus();
    }
  }
  public onEnterVatAmount(event): void {
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

  onEdit(contact) {

    // console.log(contact)

    const dialogRef = this._matDialog.open(UpdateGRNComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data: {
          Obj: contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  onChangeDiscountMode(event) {
    
    if (event.value.name == 'GST Before Disc') {

      if (parseFloat(this.GST) > 0) {

        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
      }
    }
    else if (event.value.name == 'GST After Disc') {
      

      let disc = this._GRNList.userFormGroup.get('Disc').value
      if (disc > 0) {
        this.DisAmount = (disc * parseFloat(this.TotalAmount) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DisAmount)).toFixed(2);
        if (parseFloat(this.GST) > 0) {
          this.GSTAmount = ((parseFloat(this.NetAmount) * parseFloat(this.GST)) / 100).toFixed(2);
          this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(2);
        }
      }
      else {
        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
      }
    }
    else if (event.value.name == 'GST On Pur +FreeQty') {
      if (parseFloat(this.GST) > 0) {

        let TotalQty = parseInt(this.Qty) + parseInt(this.FreeQty)
        this.TotalAmount = (parseFloat(this.Rate) * TotalQty).toFixed(2);
        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
      }
    }
    else if (event.value.name == 'GST OnMRP') {
      this.TotalAmount = (parseFloat(this.MRP) * this.Qty).toFixed(2);
      this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);

    }
    else if (event.value.name == 'GST After 2Disc') {
    }
  }

  onClose() {
    this.dialogRef.close();

  }

  onScroll() {
  }
}

