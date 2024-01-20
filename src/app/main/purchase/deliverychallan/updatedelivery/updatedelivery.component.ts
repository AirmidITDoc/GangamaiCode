import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { DeliverychallanService } from '../deliverychallan.service';
import { fuseAnimations } from '@fuse/animations';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ItemNameList } from '../deliverychallan.component';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import moment, { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-updatedelivery',
  templateUrl: './updatedelivery.component.html',
  styleUrls: ['./updatedelivery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatedeliveryComponent implements OnInit {
  displayedColumns2 = [
    'ItemName',
    'ConversionFactor',
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
  displayedColumns3 = [
    'ItemId',
    'SupplierName',
    'ReceiveQty',
    'FreeQty',
    'MRP',
    'Rate',
    'VatPercentage'
  ]
 // const moment = _rollupMoment || _moment;
 sIsLoading: string = '';
  isLoading = true;
  // ToStoreList: any = [];
  // FromStoreList: any;
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

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();
  dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();

  constructor(
    public __DeliveryService: DeliverychallanService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdatedeliveryComponent>,
    private accountService: AuthenticationService,
    private snackBarService: SnackBarService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    
    if (this.data) {
      // debugger
      this.registerObj = this.data.Obj;
      this.InvoiceNo = this.registerObj.InvoiceNo;
      this.GateEntryNo = this.registerObj.GateEntryNo;
      this.SupplierId = this.registerObj.SupplierId;
      this.StoreId = this.registerObj.StoreId;

     // this.getGRNItemDetailList(this.registerObj);
    } 
    this.getSupplierSearchCombo();
    this.gePharStoreList();
    this.getGSTtypeList();
    this.getLastThreeItemInfo();
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
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {

    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this.__DeliveryService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      console.log(this.StoreList)
      this.__DeliveryService.GRNStoreForm.get('StoreId').setValue(this.StoreList[0]);

      // this.StoreName = this._GRNList.GRNStoreForm.get('StoreId').value.StoreName;

      // if (this.data) {
      //   const toSelectstoreId = this.StoreList.find(c => c.storeId == this.registerObj.StoreId);
      //   this._GRNList.GRNStoreForm.get('StoreId').setValue(toSelectstoreId);
      // }
    });
  }
  getGSTtypeList() {
    var vdata = {
      'ConstanyType': 'GST_CALC_TYPE',
    }
    this.__DeliveryService.getGSTtypeList(vdata).subscribe(data => {
      this.GSTTypeList = data;
       console.log( this.GSTTypeList);
       if (this.data) {
        const toSelectGSTType = this.GSTTypeList.find(c => c.Name == this.registerObj.Tranprocessmode);
        this.__DeliveryService.userFormGroup.get('GSTType').setValue(toSelectGSTType);
       console.log(toSelectGSTType);  
       console.log(this.registerObj); 
       } 
    });
  }
  getSupplierSearchCombo() {

    this.__DeliveryService.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      //console.log(data);
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this.__DeliveryService.GRNSearchGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
      if (this.data) {

        const toSelectSUpplierId = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierId);
        this.__DeliveryService.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
       // console.log(toSelectSUpplierId);
        this.vMobile =toSelectSUpplierId.Mobile;
        this.vContact =toSelectSUpplierId.ContactPerson;   
       }
    });
  }

  getSelectedSupplierObj(obj) {
    this.vMobile = obj.Mobile;
    this.vContact = obj.ContactPerson;
  }

  getOptionTextSupplier(option) {

    return option && option.SupplierName ? option.SupplierName : '';
  }
  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsSupplier.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  }

  getGRNItemList() {
    // debugger
    var m_data = {
      "ItemName": `${this.__DeliveryService.userFormGroup.get('ItemName').value}%`,
      "StoreId": this.__DeliveryService.GRNStoreForm.get('StoreId').value.storeid
    }
    //console.log(m_data)
    //if (this._GRNList.userFormGroup.get('ItemName').value.length >= 1) {
    this.__DeliveryService.getItemNameList(m_data).subscribe(data => {
      this.filteredOptions = data;
      //console.log(this.filteredOptions)
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
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
  getOptionText(option) {

    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }
  getGRNItemDetailList(el) {
    // debugger
    var Param = {
      "GRNID": el.GRNID,

    }
    //console.log(Param);
    this.__DeliveryService.getGrnItemDetailList(Param).subscribe(data => {
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
  calculateTotalamt(){
    let Qty = this.__DeliveryService.userFormGroup.get('Qty').value
    if (Qty >= 100) {
      Swal.fire("Enter Qty less than 100");
      this.__DeliveryService.userFormGroup.get('Qty').setValue('');
    }
      if (this.Rate && Qty) {
        this.TotalAmount = (parseFloat(this.Rate) * parseInt(Qty)).toFixed(2);
        this.NetAmount = parseFloat(this.TotalAmount);
        this.__DeliveryService.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    }
    this.calculateGSTAmount();
  }
  calculateDiscperAmount() {
    let disc = this.__DeliveryService.userFormGroup.get('Disc').value
    if (disc >= 100) {
      Swal.fire("Enter Discount less than 100");
      this.__DeliveryService.userFormGroup.get('Disc').setValue('');
    }
    
     if (disc) {
      let dis = this.__DeliveryService.userFormGroup.get('Disc').value || 0;
      this.DisAmount = ((parseFloat(this.TotalAmount) * parseFloat(dis)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DisAmount)).toFixed(2);
      //this.__DeliveryService.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    }
    this.calculateGSTAmount();
    
  }
  calculateGSTAmount() {
    this.__DeliveryService.userFormGroup.get('IGST').setValue(0);
    this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));
    this.CGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.CGST)) / 100).toFixed(2);
    this.SGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.SGST)) / 100).toFixed(2);
    this.IGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.IGST)) / 100).toFixed(2);
    this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);
    let netamt = ((parseFloat(this.GSTAmount)) + (parseFloat(this.TotalAmount))).toFixed(2);
     this.__DeliveryService.userFormGroup.get('NetAmount').setValue(netamt);
    
  }
  OnchekPurchaserateValidation() {
    let mrp = this.__DeliveryService.userFormGroup.get('MRP').value
    if (mrp <= this.Rate) {
      Swal.fire("Enter Purchase Rate Less Than MRP");
      this.__DeliveryService.userFormGroup.get('Rate').setValue('');
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

    this.vDiffNetRoundAmt= ((FinalRoundAmt) - parseFloat(this.vFinalNetAmount)).toFixed(2);
    return this.vTotalFinalAmount;
  }
  calculateGSTType(event) {

    if (event.value.Name == "GST After Disc") {
      this.IGST = 0;
      let totalamt = this.TotalAmount - this.__DeliveryService.userFormGroup.get('DisAmount').value
      this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));

      this.CGSTAmount = ((totalamt * parseFloat(this.CGST)) / 100).toFixed(2);
      this.SGSTAmount = ((totalamt * parseFloat(this.SGST)) / 100).toFixed(2);
      this.IGSTAmount = ((totalamt * parseFloat(this.IGST)) / 100).toFixed(2);
      this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);

      this.NetAmount = (totalamt + parseFloat(this.GSTAmount)).toFixed(2);
      this.__DeliveryService.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    } else {
      this.GST = ((parseFloat(this.CGST)) + (parseFloat(this.SGST)) + (parseFloat(this.IGST)));
      this.CGSTAmount = ((this.TotalAmount * parseFloat(this.CGST)) / 100).toFixed(2);
      this.SGSTAmount = ((this.TotalAmount * parseFloat(this.SGST)) / 100).toFixed(2);
      this.IGSTAmount = ((this.TotalAmount * parseFloat(this.IGST)) / 100).toFixed(2);
      this.GSTAmount = ((parseFloat(this.CGSTAmount)) + (parseFloat(this.SGSTAmount)) + (parseFloat(this.IGSTAmount))).toFixed(2);

      this.GSTAmt = ((this.TotalAmount * parseFloat(this.GSTPer)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.__DeliveryService.userFormGroup.get('DisAmount').value) + parseFloat(this.GSTAmount)).toFixed(2);
      this.__DeliveryService.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    }

  }

  onAdd(event) {
    this.dsItemNameList.data = [];
    this.chargeslist = this.dsTempItemNameList.data;
    this.chargeslist.push(
      {
        ItemId: this.__DeliveryService.userFormGroup.get('ItemName').value.ItemID || 0,
        ItemName: this.__DeliveryService.userFormGroup.get('ItemName').value.ItemName || '',
        ConversionFactor: this.ConversionFactor || 0,
        UOMId: this.UOM,
        HSNcode: this.HSNCode,
        BatchNo: this.BatchNo,
        BatchExpDate: this.datePipe.transform(this.date.value, "yyyy-MM"),
        ReceiveQty: this.Qty || 0,
        FreeQty: this.FreeQty || 0,
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
    this.NetAmount = 0;
    // this.itemname.nativeElement.focus();
  }
  ItemReset(){
   this.ItemName= "";
   this.ConversionFactor = "";
   this.UOM = "";
   this.HSNCode= "";
   this.BatchNo= "";
   this.Qty= "";
   this.FreeQty= "";
   this.MRP= "";
   this.Rate= "";
   this.TotalAmount= "";
   this.Disc= "";
   this.DisAmount= "";
   this.GST= "";
   this.GSTAmount= "";
   this.CGST= "";
   this.CGSTAmount = "";
   this.SGST = "";
   this.SGSTAmount= "";
   this.IGST= "";
   this.IGSTAmount= "";
   this.NetAmount= "";

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

  onClose() {
    this.dialogRef.close();
  }
  
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

  focusNextService() {
    this.renderer.selectRootElement('#myInput').focus();
  }
  OnReset() {
    // this._GRNList.GRNSearchGroup.reset();
    this.__DeliveryService.userFormGroup.reset();
    //this._GRNList.GRNFirstForm.reset();
    this.dsItemNameList.data = [];
  }


  getLastThreeItemInfo() {
    var vdata = {
      'ItemId': this.__DeliveryService.userFormGroup.get('ItemName').value.ItemID || 0,
    }
    this.__DeliveryService.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
      //console.log(this.dsLastThreeItemList.data)
    });
  }
  OnSave() {
    if (!this.registerObj.GRNID) {
      this.OnSavenew();
    } else {
      this.OnSaveEdit()
    }
  }

  PaymentTypeChk() {
    if (this.__DeliveryService.userFormGroup.get('PaymentType').value == 'Credit') {
      this.PaymentType = false;
    }
    else if (this.__DeliveryService.userFormGroup.get('PaymentType').value == 'Cash') {
      this.PaymentType = true;
    }
  }

  OnSavenew() {
    let nowDate = new Date();
    let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
    this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
    debugger
    let grnSaveObj = {};
    grnSaveObj['grnDate'] = this.dateTimeObj.date;
    grnSaveObj['grnTime'] = this.dateTimeObj.time;
    grnSaveObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    grnSaveObj['supplierID'] = this.__DeliveryService.userFormGroup.get('SupplierId').value.SupplierId || this.SupplierId;
    grnSaveObj['invoiceNo'] = this.__DeliveryService.userFormGroup.get('InvoiceNo').value ||  0;
    grnSaveObj['deliveryNo'] = 0;
    grnSaveObj['gateEntryNo'] = this.__DeliveryService.userFormGroup.get('GateEntryNo').value ||  0;
    grnSaveObj['cash_CreditType'] = this.__DeliveryService.userFormGroup.get('PaymentType').value;
    grnSaveObj['grnType'] = this.__DeliveryService.userFormGroup.get('GRNType').value;
    grnSaveObj['totalAmount'] = this.__DeliveryService.GRNFinalForm.get('TotalAmt').value || 0;
    grnSaveObj['totalDiscAmount'] = this.__DeliveryService.GRNFinalForm.get('DiscAmount').value || 0;
    grnSaveObj['totalVATAmount'] = this.__DeliveryService.GRNFinalForm.get('VatAmount').value || 0;
    grnSaveObj['netAmount'] = this.__DeliveryService.GRNFinalForm.get('NetPayamt').value || 0;
    grnSaveObj['remark'] = this.__DeliveryService.GRNFinalForm.get('Remark').value || '';
    grnSaveObj['receivedBy'] = this.__DeliveryService.GRNFinalForm.get('ReceivedBy').value || '';
    grnSaveObj['isVerified'] = false;
    grnSaveObj['isClosed'] = false;
    grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id || 0;
    grnSaveObj['invDate'] = this.__DeliveryService.userFormGroup.get('DateOfInvoice').value  || 0;
    grnSaveObj['debitNote'] = this.__DeliveryService.GRNFinalForm.get('DebitAmount').value || 0;
    grnSaveObj['creditNote'] = this.__DeliveryService.GRNFinalForm.get('CreditAmount').value || 0;
    grnSaveObj['otherCharge'] = this.__DeliveryService.GRNFinalForm.get('OtherCharges').value || 0;
    grnSaveObj['roundingAmt'] = this.__DeliveryService.GRNFinalForm.get('RoundingAmt').value || 0;
    grnSaveObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;
    grnSaveObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;
    grnSaveObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;
    grnSaveObj['tranProcessId'] = this.__DeliveryService.userFormGroup.get('GSTType').value.ConstantId || 0;
    grnSaveObj['tranProcessMode'] = this.__DeliveryService.userFormGroup.get('GSTType').value.Name || '';
    grnSaveObj['BillDiscAmt'] = this.vFinalDisAmount || 0;
    grnSaveObj['grnid'] = 0;

    let SavegrnDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {

      //console.log(element);

      let grnDetailSaveObj = {};
      grnDetailSaveObj['grnDetID'] = 0;
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
      grnDetailSaveObj['totalQty'] = element.ReceiveQty || 0;
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

    this.__DeliveryService.GRNSave(submitData).subscribe(response => {
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
    updateGRNHeaderObj['grnDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['grnTime'] = this.dateTimeObj.time;
    updateGRNHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
    updateGRNHeaderObj['supplierID'] = this.__DeliveryService.userFormGroup.get('SupplierId').value.SupplierId || 0;
    updateGRNHeaderObj['invoiceNo'] = this.__DeliveryService.userFormGroup.get('InvoiceNo').value || 0;
    updateGRNHeaderObj['deliveryNo'] = 0;
    updateGRNHeaderObj['gateEntryNo'] = this.__DeliveryService.userFormGroup.get('GateEntryNo').value || 0;
    updateGRNHeaderObj['cash_CreditType'] = this.__DeliveryService.userFormGroup.get('PaymentType').value;
    updateGRNHeaderObj['grnType'] = this.__DeliveryService.userFormGroup.get('GRNType').value;
    updateGRNHeaderObj['totalAmount'] = this.__DeliveryService.GRNFinalForm.get('TotalAmt').value || 0;
    updateGRNHeaderObj['totalDiscAmount'] = this.__DeliveryService.GRNFinalForm.get('DiscAmount').value || 0;
    updateGRNHeaderObj['totalVATAmount'] = this.__DeliveryService.GRNFinalForm.get('VatAmount').value || 0;
    updateGRNHeaderObj['netAmount'] = this.__DeliveryService.GRNFinalForm.get('NetPayamt').value || 0;
    updateGRNHeaderObj['remark'] = this.__DeliveryService.GRNFinalForm.get('Remark').value || '';
    updateGRNHeaderObj['receivedBy'] = this.__DeliveryService.GRNFinalForm.get('ReceivedBy').value || '';
    updateGRNHeaderObj['isClosed'] = false;
    updateGRNHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
      updateGRNHeaderObj['invDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['debitNote'] = this.__DeliveryService.GRNFinalForm.get('DebitAmount').value || 0;
    updateGRNHeaderObj['creditNote'] = this.__DeliveryService.GRNFinalForm.get('CreditAmount').value || 0;
    updateGRNHeaderObj['otherCharge'] = this.__DeliveryService.GRNFinalForm.get('OtherCharges').value || 0;
    updateGRNHeaderObj['roundingAmt'] = this.__DeliveryService.GRNFinalForm.get('RoundingAmt').value || 0;
    updateGRNHeaderObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;
    updateGRNHeaderObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;
    updateGRNHeaderObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;
    updateGRNHeaderObj['tranProcessId'] = this.__DeliveryService.userFormGroup.get('GSTType').value.ConstantId || 0;
    updateGRNHeaderObj['tranProcessMode'] = this.__DeliveryService.userFormGroup.get('GSTType').value.Name || '';
    updateGRNHeaderObj['billDiscAmt'] = this.vFinalDisAmount || 0;
    updateGRNHeaderObj['grnid'] = this.registerObj.GRNID;

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
      grnDetailSaveObj['totalQty'] = element.ReceiveQty || 0;
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
    this.__DeliveryService.GRNEdit(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this._matDialog.closeAll();
        this.OnReset()
      }
    }, error => {
      this.toastr.error('New GRN Data not Updated !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });

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
