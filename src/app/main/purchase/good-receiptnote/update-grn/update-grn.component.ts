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

// export const MY_FORMATS = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM//YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };
@Component({
  selector: 'app-update-grn',
  templateUrl: './update-grn.component.html',
  styleUrls: ['./update-grn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  // providers: [

  //   {
  //     provide: DateAdapter,
  //     useClass: MomentDateAdapter,
  //     deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
  //   },

  //   { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  // ],
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
  PaymentType: any;
  StoreList: any = [];
  StoreName: any;
  ItemID: any;
  VatPercentage: any;
  GSTPer: any;
  Specification: any;
  VatAmount: any;
  vFinalNetAmount: any;
  vFinalDisAmount: any;
  vFinalVatAmount: any;
  vNetPayamount: any;
  CGSTFinalAmount: any;
  SGSTFinalAmount: any;
  IGSTFinalAmount: any;
  vTotalFinalAmount: any;
  GSTTypeList:any=[];
  RoundAmt:any=0;
  newDateTimeObj: any = {};
  dsGRNList = new MatTableDataSource<GRNList>();

  dsGrnItemList = new MatTableDataSource<GrnItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();
  dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();


  displayedColumns2 = [

    'ItemName',
    'ConversionFactor',
    'UOMId',
    'HSNCode',
    'BatchNo',
    'ExpDate',
    'Qty',
    'FreeQty',
    'TotalQty',
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

  displayedColumns3 = [
    'ItemId',
    'SupplierName',
    'ReceiveQty',
    'FreeQty',
    'MRP',
    'Rate',
    'VatPercentage'
  ]

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
  Name:any;
  StoreId: any;
  GSTAmt: any;
  DiscAmt: any;
  IGSTAmt: any;
  CGSTAmt: any;
  SGSTAmt: any;
  ConversionFactor: any;
  vMobile: any;
  vContact: any;
  vDiffNetRoundAmt: any;
  ItemId:any;
  vOtherCharges:any;


  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateGRNComponent>,
    private accountService: AuthenticationService,
    private snackBarService: SnackBarService,
    public toastr: ToastrService,

  ) { }
  @ViewChild('picker') datePickerElement = MatDatepicker;
  Cahchecked:any;
  Grntypechecked:any=0;
  ngOnInit(): void {

    if (this.data.chkNewGRN == 2) {
      debugger
      this.registerObj = this.data.Obj;
      this.InvoiceNo = this.registerObj.InvoiceNo;
      this.GateEntryNo = this.registerObj.GateEntryNo;
      this.SupplierId = this.registerObj.SupplierId;
      this.StoreId = this.registerObj.StoreId;
      console.log(this.registerObj.Cash_CreditType);
      console.log(this.registerObj.GRNType);
debugger
      if(this.registerObj.Cash_CreditType)
      this.Cahchecked=1;
     if(!this.registerObj.Cash_CreditType)
      this.Cahchecked=0;

      if(this.registerObj.GRNType)
        this.Grntypechecked=1;
       if(!this.registerObj.GRNType)
        this.Grntypechecked=0;

      

      this.getGRNItemDetailList(this.registerObj);
    }

    //this.getToStoreSearchList();
    // this.getSupplierSearchList();
    //this.getFromStoreSearchList();
   // this.getToStoreSearchCombo();
    this.getSupplierSearchCombo();
    this.gePharStoreList();
    this.getGSTtypeList();
   // this.getLastThreeItemInfo();
  }

  date = new FormControl(moment());
  minDate = new Date();
  maxDate = new Date(2024, 4, 1);
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {

    debugger
    const ctrlValue = this.date.value;
    const currentDate = new Date();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    if (ctrlValue && ctrlValue > currentDate) {
      // Swal.fire(" Please choose valid Date");
      this.date.setValue(this.date.value);
    }
    console.log(this.datePipe.transform(this.date.value, "yyyy-MM"));

    datepicker.close();
  }


// fromchange

  getGSTtypeList() {
    var vdata = {
      'ConstanyType': 'GST_CALC_TYPE',
    }
    this._GRNList.getGSTtypeList(vdata).subscribe(data => {
      this.GSTTypeList = data;
      // console.log( this.GSTTypeList);
       if (this.data) {
        const toSelectGSTType = this.GSTTypeList.find(c => c.Name == this.registerObj.Tranprocessmode);
        this._GRNList.userFormGroup.get('GSTType').setValue(toSelectGSTType);
       //console.log(toSelectGSTType);  
      console.log(this.registerObj); 
       } 
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
        this._GRNList.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
       // console.log(toSelectSUpplierId);
        this.vMobile = toSelectSUpplierId.Mobile; 
        this.vContact = toSelectSUpplierId.ContactPerson;   
        //console.log(toSelectSUpplierId.Mobile);
       }
    });
  }

  getSelectedSupplierObj(obj) {
    this.vMobile = obj.Mobile;
    this.vContact = obj.ContactPerson;
  }
  

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }



  getGRNItemDetailList(el) {
    // debugger
    var Param = {
      "GRNID": el.GRNID,

    }
    //console.log(Param);
    this._GRNList.getGrnItemDetailList(Param).subscribe(data => {
      this.dsItemNameList.data = data as ItemNameList[];
      this.chargeslist = data as ItemNameList[];
      this.dsTempItemNameList.data = data as ItemNameList[];
     // console.log(this.dsItemNameList)
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
 

  onAdd(event) {
    this.dsItemNameList.data = [];
    this.chargeslist = this.dsTempItemNameList.data;
    this.chargeslist.push(
      {
        ItemId: this._GRNList.userFormGroup.get('ItemName').value.ItemID || 0,
        ItemName: this._GRNList.userFormGroup.get('ItemName').value.ItemName || '',
        ConversionFactor: this.ConversionFactor || 0,
        UOMId: this.UOM,
        HSNcode: this.HSNCode,
        BatchNo: this.BatchNo,
        BatchExpDate: this.datePipe.transform(this.date.value, "yyyy-MM"),
        ReceiveQty: this.Qty || 0,
        FreeQty: this.FreeQty || 0,
        TotalQty : ((parseInt(this.Qty)) + (parseInt(this.FreeQty))) || 0,
        MRP: this.MRP || 0,
        Rate: this.Rate || 0,
        TotalAmount: this.TotalAmount || 0,
        DiscPercentage: this.Disc || 0,
        DiscAmount: this.DisAmount || 0,
        VatPercentage: this.GST || 0,
        VatAmount: this.GSTAmount || 0,
        CGSTPer: this.CGST || 0,
        CGSTAmt: this.CGSTAmount || 0,
        SGSTPer: this.SGST || 0,
        SGSTAmt: this.SGSTAmount || 0,
        IGSTPer: this.IGST || 0,
        IGSTAmt: this.IGSTAmount || 0,
        NetAmount: this.NetAmount || 0,

      });

    // this.dsItemNameList.data = this.chargeslist
    // this._GRNList.userFormGroup.reset();
    // this.add=false;

    // console.log(this.chargeslist);
    this.dsItemNameList.data = this.chargeslist
    //this._GRNList.userFormGroup.reset();
    this.ItemReset();
    //this.ItemID.nativeElement.focus();
    this.add = false;
    this.date.setValue(new Date());
    this._GRNList.userFormGroup.get('ItemName').setValue('');
    this.NetAmount = 0;
    // this.itemname.nativeElement.focus();
  }
  ItemReset(){
   this.ItemName = " ";
   this.ItemID = 0;
   this.ItemId = 0;
   this.ConversionFactor = "";
   this.UOM = "";
   this.HSNCode= "";
   this.BatchNo= "";
   this.Qty= 0;
   this.FreeQty= 0;
   this.MRP= 0;
   this.Rate=  0;
   this.TotalAmount= 0;
   this.Disc=  '';
   this.DisAmount= "";
   this.GST= 0;
   this.GSTAmount= 0;
   this.CGST=  0;
   this.CGSTAmount =  0;
   this.SGST =  0;
   this.SGSTAmount=  0;
   this.IGST=  0;
   this.IGSTAmount=  0;
   this.NetAmount=  0;

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


  // getOptionTextItemName(option) {
  //   return option && option.ItemName ? option.ItemName : '';

  // }
FinalTotalQty:any;
  calculateTotalamt(){
    let Qty = this._GRNList.userFormGroup.get('Qty').value;
    let freeqty = this._GRNList.userFormGroup.get('FreeQty').value;
    this.FinalTotalQty = (parseInt(Qty) + parseInt(freeqty));

    if (Qty >= 100) {
      Swal.fire("Enter Qty less than 100");
      this._GRNList.userFormGroup.get('Qty').setValue('');
    }
      if (this.Rate && Qty) {
        this.TotalAmount = (parseFloat(this.Rate) * parseInt(Qty)).toFixed(2);
        this.NetAmount = parseFloat(this.TotalAmount);
        this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    }
    this.calculateGSTAmount();
     //this.ItemID.nativeElement.focus();
  }


  // calculateTotalAmount() {

  //   debugger
  //   let Qty = this._GRNList.userFormGroup.get('Qty').value
  //   if (Qty >= 100) {
  //     Swal.fire("Enter Qty less than 100");
  //     this._GRNList.userFormGroup.get('Qty').setValue('');
  //   }
  //   if (this.Rate && Qty) {
  //     this.TotalAmount = (parseFloat(this.Rate) * parseInt(Qty)).toFixed(2);
  //     this.NetAmount = parseFloat(this.TotalAmount);
  //     this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
  //     //Discount calculation
  //     this.DisAmount = ((parseFloat(this.TotalAmount) * this.Disc) / 100).toFixed(2);
  //     let totalamt = this.TotalAmount - this._GRNList.userFormGroup.get('DisAmount').value;
  //     this.NetAmount = this.TotalAmount - this._GRNList.userFormGroup.get('DisAmount').value;

  //     this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
  //     //GST Calculation
  //     this.calculateGSTAmount();
  //   }
  // }
  calculateDiscperAmount() {
    let disc = this._GRNList.userFormGroup.get('Disc').value
    if (disc >= 100) {
      Swal.fire("Enter Discount less than 100");
      this._GRNList.userFormGroup.get('Disc').setValue('');
    }
    
     if (disc) {
      let dis = this._GRNList.userFormGroup.get('Disc').value || 0;
      this.DisAmount = ((parseFloat(this.TotalAmount) * parseFloat(dis)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DisAmount)).toFixed(2);
      //this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    }
    this.calculateGSTAmount();
    
  }
  calculateGSTAmount() {
    this._GRNList.userFormGroup.get('IGST').setValue(0);
    this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));
    this.CGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.CGST)) / 100).toFixed(2);
    this.SGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.SGST)) / 100).toFixed(2);
    this.IGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.IGST)) / 100).toFixed(2);
    this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);
    let netamt = ((parseFloat(this.GSTAmount)) + (parseFloat(this.TotalAmount))).toFixed(2);
     this._GRNList.userFormGroup.get('NetAmount').setValue(netamt);
    


    // if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST After Disc") {
    //   let totalamt = this.TotalAmount - this._GRNList.userFormGroup.get('DisAmount').value
    //   this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));

    //   this.CGSTAmount = ((totalamt * parseFloat(this.CGST)) / 100).toFixed(2);
    //   this.SGSTAmount = ((totalamt * parseFloat(this.SGST)) / 100).toFixed(2);
    //   this.IGSTAmount = ((totalamt * parseFloat(this.IGST)) / 100).toFixed(2);
    //   this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);

    //   this.NetAmount = (totalamt + parseFloat(this.GSTAmount)).toFixed(2);
    //   this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    // } else {
    //   this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));
    //   this.CGSTAmount = ((this.TotalAmount * parseFloat(this.CGST)) / 100).toFixed(2);
    //   this.SGSTAmount = ((this.TotalAmount * parseFloat(this.SGST)) / 100).toFixed(2);
    //   this.IGSTAmount = ((this.TotalAmount * parseFloat(this.IGST)) / 100).toFixed(2);
    //   this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);

    //   this.GSTAmt = ((this.TotalAmount * parseFloat(this.GSTPer)) / 100).toFixed(2);
    //   this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this._GRNList.userFormGroup.get('DisAmount').value) + parseFloat(this.GSTAmount)).toFixed(2);
    //   this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    // }

  }

  OnchekPurchaserateValidation() {
    let mrp = this._GRNList.userFormGroup.get('MRP').value
    if (mrp <= this.Rate) {
      Swal.fire("Enter Purchase Rate Less Than MRP");
      this._GRNList.userFormGroup.get('Rate').setValue('');

    }
    //this.disc.nativeElement.focus();
  }


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
    let FinalRoundAmt = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
    this.vTotalFinalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    this.vFinalDisAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);
    this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
    this.vFinalNetAmount= Math.round(FinalRoundAmt).toFixed(2); //(element.reduce((sum, { RoundNetAmt }) => sum += +(RoundNetAmt || 0), 0)).toFixed(2) || Math.round(this.FinalNetAmount);
    FinalRoundAmt= ((parseInt(this.vOtherCharges)) + FinalRoundAmt);
    this.vDiffNetRoundAmt= ((FinalRoundAmt) - parseFloat(this.vFinalNetAmount)).toFixed(2);
  
      let Othercharge = this._GRNList.GRNFinalForm.get("OtherCharges").value ;
    
     
    return this.vTotalFinalAmount;
  }

  calculateGSTType(event) {

    if (event.value.Name == "GST After Disc") {
      this.IGST = 0;
      let totalamt = this.TotalAmount - this._GRNList.userFormGroup.get('DisAmount').value
      this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));

      this.CGSTAmount = ((totalamt * parseFloat(this.CGST)) / 100).toFixed(2);
      this.SGSTAmount = ((totalamt * parseFloat(this.SGST)) / 100).toFixed(2);
      this.IGSTAmount = ((totalamt * parseFloat(this.IGST)) / 100).toFixed(2);
      this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);

      this.NetAmount = (totalamt + parseFloat(this.GSTAmount)).toFixed(2);
      this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    } else {
      this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));
      this.CGSTAmount = ((this.TotalAmount * parseFloat(this.CGST)) / 100).toFixed(2);
      this.SGSTAmount = ((this.TotalAmount * parseFloat(this.SGST)) / 100).toFixed(2);
      this.IGSTAmount = ((this.TotalAmount * parseFloat(this.IGST)) / 100).toFixed(2);
      this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);

      this.GSTAmt = ((this.TotalAmount * parseFloat(this.GSTPer)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this._GRNList.userFormGroup.get('DisAmount').value) + parseFloat(this.GSTAmount)).toFixed(2);
      this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    }

  }


  gePharStoreList() {

    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._GRNList.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._GRNList.GRNStoreForm.get('StoreId').setValue(this.StoreList[0]);

      // this.StoreName = this._GRNList.GRNStoreForm.get('StoreId').value.StoreName;

      // if (this.data) {
      //   const toSelectstoreId = this.StoreList.find(c => c.storeId == this.registerObj.StoreId);
      //   this._GRNList.GRNStoreForm.get('StoreId').setValue(toSelectstoreId);
      // }
    });
  }

 
  getSelectedObj(obj) {
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.ConversionFactor = obj.ConversionFactor;
    this.Qty = 0
    this.UOM = obj.UnitofMeasurementId;
    this.HSNCode = obj.HSNcode;
    this.Rate = obj.PurchaseRate;
    this.TotalAmount = (parseInt(this.Qty) * parseFloat(this.Rate)).toFixed(2);
    this.NetAmount = this.TotalAmount;
    this.VatPercentage = obj.VatPercentage;
    this.SGST = obj.SGSTPer;
    this.CGST = obj.CGSTPer || 0;
    this.GSTPer = obj.GSTPer || 0;
    this.GSTAmount = 0;
    this.MRP = obj.UnitMRP || 0;
    this.Specification = obj.Specification;
    // }
    //this.itemname.nativeElement.focus();
    this.getLastThreeItemInfo();
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
      "StoreId": this._GRNList.GRNStoreForm.get('StoreId').value.storeid
    }
    //console.log(m_data)
    //if (this._GRNList.userFormGroup.get('ItemName').value.length >= 1) {
    this._GRNList.getItemNameList(m_data).subscribe(data => {
      this.filteredOptions = data;
      //console.log(this.filteredOptions)
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

  getSupplierSearchList1() {
    this._GRNList.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      // console.log(this.SupplierList);
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
    //this._GRNList.GRNFirstForm.reset();
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


  OnSave() {
    if (this.data.chkNewGRN == 1) {
      this.OnSavenew();
    } else if (this.data.chkNewGRN == 2) {
      this.OnSaveEdit()
    }
  }

  // PaymentTypeChk() {
  //   if (this._GRNList.userFormGroup.get('PaymentType').value == 'Credit') {
  //     this.PaymentType = false;
  //   }
  //   else if (this._GRNList.userFormGroup.get('PaymentType').value == 'Cash') {
  //     this.PaymentType = true;
  //   }
  // }

  OnSavenew() {
    let nowDate = new Date();
    let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
    this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
    debugger
    let grnSaveObj = {};
    grnSaveObj['grnDate'] = this.dateTimeObj.date;
    grnSaveObj['grnTime'] = this.dateTimeObj.time;
    grnSaveObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    grnSaveObj['supplierID'] = this._GRNList.userFormGroup.get('SupplierId').value.SupplierId || this.SupplierId;
    grnSaveObj['invoiceNo'] = this._GRNList.userFormGroup.get('InvoiceNo').value ||  0;
    grnSaveObj['deliveryNo'] = 0;
    grnSaveObj['gateEntryNo'] = this._GRNList.userFormGroup.get('GateEntryNo').value ||  0;
    grnSaveObj['cash_CreditType'] = this._GRNList.userFormGroup.get('PaymentType').value;
    grnSaveObj['grnType'] = this._GRNList.userFormGroup.get('GRNType').value;
    grnSaveObj['totalAmount'] = this._GRNList.GRNFinalForm.get('TotalAmt').value || 0;
    grnSaveObj['totalDiscAmount'] = this._GRNList.GRNFinalForm.get('DiscAmount').value || 0;
    grnSaveObj['totalVATAmount'] = this._GRNList.GRNFinalForm.get('VatAmount').value || 0;
    grnSaveObj['netAmount'] = this._GRNList.GRNFinalForm.get('NetPayamt').value || 0;
    grnSaveObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
    grnSaveObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
    grnSaveObj['isVerified'] = false;
    grnSaveObj['isClosed'] = false;
    grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id || 0;
    grnSaveObj['invDate'] = this._GRNList.userFormGroup.get('DateOfInvoice').value  || 0;
    grnSaveObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
    grnSaveObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
    grnSaveObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharges').value || 0;
    grnSaveObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
    grnSaveObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('CGSTAmount').value || 0;
    grnSaveObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('SGSTAmount').value || 0;
    grnSaveObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('IGSTAmount').value || 0;
    grnSaveObj['tranProcessId'] = this._GRNList.userFormGroup.get('GSTType').value.ConstantId || 0;
    grnSaveObj['tranProcessMode'] = this._GRNList.userFormGroup.get('GSTType').value.Name || '';
    grnSaveObj['ewayBillNo'] = this._GRNList.GRNFinalForm.get('EwayBillNo').value || 0;
    grnSaveObj['ewayBillDate'] = this.datePipe.transform(this._GRNList.GRNFinalForm.get('EwalBillDate').value,"yyyy-MM-dd") || '01/01/1099';
    grnSaveObj['BillDiscAmt'] = this.vFinalDisAmount || 0;
    grnSaveObj['grnid'] = 0;
    
    let SavegrnDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {

      //console.log(element);

      let grnDetailSaveObj = {};
     // grnDetailSaveObj['grnDetID'] = 0;
      grnDetailSaveObj['grnId'] = 0;
      grnDetailSaveObj['itemId'] = element.ItemId || 0;
      grnDetailSaveObj['uomId'] = element.UOMId || 0;
      grnDetailSaveObj['receiveQty'] = element.ReceiveQty || 0;
      grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
      grnDetailSaveObj['mrp'] = element.MRP || 0;
      grnDetailSaveObj['rate'] = element.Rate || 0;
      grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
      grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
      grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
      grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
      grnDetailSaveObj['discPercentage'] = element.DiscPercentage || 0;
      grnDetailSaveObj['discAmount'] = element.DiscAmount || 0;
      grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
      grnDetailSaveObj['landedRate'] = 0;//this.CgstAmt;
      grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
      grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
      grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
      grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
      grnDetailSaveObj['batchNo'] = element.BatchNo || "";
      grnDetailSaveObj['batchExpDate'] = this.datePipe.transform(this.date.value, "yyyy-MM") || this.date.value;
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
      updateItemMasterGSTPerObj['itemId'] = element.ItemId || 0;
      updateItemMasterGSTPerObj['cgst'] = element.CGSTPer || 0;
      updateItemMasterGSTPerObj['sgst'] = element.SGSTPer || 0;
      updateItemMasterGSTPerObj['igst'] = element.IGSTPer || 0;
      updateItemMasterGSTPerObj['hsNcode'] = element.HSNcode || "";
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
        this._matDialog.closeAll();
        this.OnReset();
        
      } else {
        this.toastr.error('New GRN Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New GRN Data not saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });

  }


  OnSaveEdit() {

    let updateGRNHeaderObj = {};
    updateGRNHeaderObj['grnid'] = this.registerObj.GRNID;
    updateGRNHeaderObj['grnDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['grnTime'] = this.dateTimeObj.time;
    updateGRNHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
    updateGRNHeaderObj['supplierID'] = this._GRNList.userFormGroup.get('SupplierId').value.SupplierId || 0;
    updateGRNHeaderObj['invoiceNo'] = this._GRNList.userFormGroup.get('InvoiceNo').value || 0;
    updateGRNHeaderObj['deliveryNo'] = 0;
    updateGRNHeaderObj['gateEntryNo'] = this._GRNList.userFormGroup.get('GateEntryNo').value || 0;
    updateGRNHeaderObj['cash_CreditType'] = this._GRNList.userFormGroup.get('PaymentType').value;
    updateGRNHeaderObj['grnType'] = this._GRNList.userFormGroup.get('GRNType').value;
    updateGRNHeaderObj['totalAmount'] = this._GRNList.GRNFinalForm.get('TotalAmt').value || 0;
    updateGRNHeaderObj['totalDiscAmount'] = this._GRNList.GRNFinalForm.get('DiscAmount').value || 0;
    updateGRNHeaderObj['totalVATAmount'] = this._GRNList.GRNFinalForm.get('VatAmount').value || 0;
    updateGRNHeaderObj['netAmount'] = this._GRNList.GRNFinalForm.get('NetPayamt').value || 0;
    updateGRNHeaderObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
    updateGRNHeaderObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
    //updateGRNHeaderObj['isClosed'] = false;
    updateGRNHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
      updateGRNHeaderObj['invDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
    updateGRNHeaderObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
    updateGRNHeaderObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharges').value || 0;
    updateGRNHeaderObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
    updateGRNHeaderObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;
    updateGRNHeaderObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;
    updateGRNHeaderObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;
    updateGRNHeaderObj['tranProcessId'] = this._GRNList.userFormGroup.get('GSTType').value.ConstantId || 0;
    updateGRNHeaderObj['tranProcessMode'] = this._GRNList.userFormGroup.get('GSTType').value.Name || '';
    updateGRNHeaderObj['billDiscAmt'] = this.vFinalDisAmount || 0;

    let SavegrnDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      //debugger
      // console.log(element);

      let grnDetailSaveObj = {};
      grnDetailSaveObj['grnDetID'] = 0;
      grnDetailSaveObj['grnId'] = this.registerObj.GRNID;
      grnDetailSaveObj['itemId'] = element.ItemId || 0;
      grnDetailSaveObj['uomId'] = element.UOMId || 0;
      grnDetailSaveObj['receiveQty'] = element.ReceiveQty || 0;
      grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
      grnDetailSaveObj['mrp'] = element.MRP || 0;
      grnDetailSaveObj['rate'] = element.Rate || 0;
      grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
      grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
      grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
      grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
      grnDetailSaveObj['discPercentage'] = element.DiscPercentage || 0;
      grnDetailSaveObj['discAmount'] = element.DiscAmount || 0;
      grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
      grnDetailSaveObj['landedRate'] = 0;//this.CgstAmt;
      grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
      grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
      grnDetailSaveObj['totalQty'] = this.FinalTotalQty  || 0;
      grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
      grnDetailSaveObj['batchNo'] = element.BatchNo;
      grnDetailSaveObj['batchExpDate'] = this.datePipe.transform(this.date.value, "yyyy-MM") || this.date.value;
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
    //debugger
    this._GRNList.GRNEdit(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        // Swal.fire('Updated GRN !', 'Record Updated Successfully !', 'success').then((result) => {
        // if (result.isConfirmed) {
        //   let m = response;
        // this._matDialog.closeAll();
        // }  
        this._matDialog.closeAll();
        this.OnReset()
      }

    }, error => {
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
  @ViewChild('conversionfactor') conversionfactor: ElementRef;
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
  @ViewChild('EwayBillNo') EwayBillNo: ElementRef;



  // public onEnterItemName(event): void {
  //   if (event.which === 13) {
  //     this.hsncode.nativeElement.focus();
  //   }
  // }



  public onEnteritemid(event): void {
    if (event.which === 13) {
      this.batchno.nativeElement.focus();
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
  public onEnterConversionFactor(event): void {
    if (event.which === 13) {
      this.expdate.nativeElement.focus();
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
    //debugger
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
      this.DateOfInvoice.nativeElement.focus()
    }
  }

  public onEnterDateOfInvoice(event): void {
    if (event.which === 13) {

      this.InvoiceNo1.nativeElement.focus()
    }
  }

  public onEnterInvoiceNo(event): void {
    if (event.which === 13) {
      this.GateEntryNo.nativeElement.focus()
    }
  }

  public onEnterGateEntryNo(event): void {
    if (event.which === 13) {
      this.Status2.nativeElement.focus()

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
      this.EwayBillNo.nativeElement.focus();
    }
  }
  public onEnterEwayBillNo(event): void {
    if (event.which === 13) {
      this.OtherCharges.nativeElement.focus();
    }
  }

  public onEnterNetPayamt(event): void {
    if (event.which === 13) {
      this.OtherCharges.nativeElement.focus();
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


 

  public onEnterOtherCharges(event): void {
    if (event.which === 13) {
      this.RoundingAmt.nativeElement.focus();
    }
  }


  getLastThreeItemInfo() {
    var vdata = {
      'ItemId': this._GRNList.userFormGroup.get('ItemName').value.ItemID || 0,
    }
    this._GRNList.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
      //console.log(this.dsLastThreeItemList.data)
    });
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

  // onChangeDiscountMode(event) {

  //   if (event.value.Name == 'GST Before Disc') {

  //     if (parseFloat(this.GST) > 0) {

  //       this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
  //       this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
  //     }
  //   }
  //   else if (event.value.Name == 'GST After Disc') {


  //     let disc = this._GRNList.userFormGroup.get('Disc').value
  //     if (disc > 0) {
  //       this.DisAmount = (disc * parseFloat(this.TotalAmount) / 100).toFixed(2);
  //       this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DisAmount)).toFixed(2);
  //       if (parseFloat(this.GST) > 0) {
  //         this.GSTAmount = ((parseFloat(this.NetAmount) * parseFloat(this.GST)) / 100).toFixed(2);
  //         this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(2);
  //       }
  //     }
  //     else {
  //       this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
  //       this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
  //     }
  //   }


  // }

  onClose() {
    this.dialogRef.close();

  }

  onScroll() {
  }
}
export class LastThreeItemList {
  ItemID: any;
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

  constructor(LastThreeItemList) {
    {

      this.ItemID = LastThreeItemList.ItemID || 0;
      this.ItemName = LastThreeItemList.ItemName || "";
      this.BatchNo = LastThreeItemList.BatchNo || 0;
      this.BatchExpDate = LastThreeItemList.BatchExpDate || 0;
      this.ReceiveQty = LastThreeItemList.ReceiveQty || 0;
      this.FreeQty = LastThreeItemList.FreeQty || 0;
      this.MRP = LastThreeItemList.MRP || 0;

    }
  }
}


