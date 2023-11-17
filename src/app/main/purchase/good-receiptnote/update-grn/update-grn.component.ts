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

@Component({
  selector: 'app-update-grn',
  templateUrl: './update-grn.component.html',
  styleUrls: ['./update-grn.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
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


  StoreList: any = [];
  StoreName: any;
  ItemID: any;
  VatPercentage: any;
  GSTPer: any;
  Specification: any;
  VatAmount: any;
  FinalNetAmount: any;
  FinalDisAmount: any;
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

  Status3List = [
    { id: 1, name: "GST Before Disc" },
    { id: 2, name: "GST After Disc" },
    { id: 3, name: "GST On Pur +FreeQty" },
    { id: 4, name: "GST OnMRP" },
    { id: 5, name: "GST After 2Disc" }
  ];
  GSTAmt: any;
  DiscAmt: any;

  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateGRNComponent>,
    private accountService: AuthenticationService,

  ) { }

  ngOnInit(): void {

    if (this.data) {

      this.registerObj = this.data.Obj;
      this.InvoiceNo = this.registerObj.InvoiceNo;
      this.GateEntryNo = this.registerObj.GateEntryNo
      this.getGRNList(this.registerObj.GRNID);
      this.setDropdownObjs();
    }

    this.getToStoreSearchList();
    // this.getSupplierSearchList();
    this.getSupplierSearchCombo();
    this.getFromStoreSearchList();
    this.getToStoreSearchCombo();
    this.getSupplierSearchCombo();
    this.gePharStoreList();


  }

  setDropdownObjs() {
    debugger

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



  getGRNList(el) {
    debugger
    var Param = {
      "GRNId": 41693// el,

    }
    this._GRNList.getGrnItemDetailList(Param).subscribe(data => {
      this.dsItemNameList.data = data as ItemNameList[];
      this.dsTempItemNameList.data = data as ItemNameList[];
      console.log(data)
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
        ItemName: this._GRNList.userFormGroup.get('ItemName').value.ItemName || '',
        UOM: this.UOM,
        HSNCode: this.HSNCode,
        BatchNo: this.BatchNo,
        ExpDate: this.ExpDate,
        Qty: this.Qty,
        FreeQty: this.FreeQty,
        MRP: this.MRP,
        Rate: this.Rate,
        TotalAmount: this.TotalAmount,
        Disc: this.Disc,
        DisAmount: this.DisAmount,
        GST: this.GST,
        GSTAmount: this.GSTAmount,
        CGST: this.CGST,
        CGSTAmount: this.CGSTAmount,
        SGST: this.SGST,
        SGSTAmount: this.SGSTAmount,
        IGST: this.IGST,
        IGSTAmount: this.IGSTAmount,
        NetAmount: this.NetAmount,

      });

    this.dsItemNameList.data = this.chargeslist
    this._GRNList.userFormGroup.reset();
    this.add=false;
    this.itemname.nativeElement.focus();
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


  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';

  }

  calculateTotalAmount() {
    debugger
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
    debugger
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

  calculateGSTperAmount() {

    if (this.GST) {

      this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(2);
      this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);

    }
  }

  calculateGSTAmount() {
    debugger
    if (this.GSTAmount > 0) {

      this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(2);
      this._GRNList.userFormGroup.get('NetAmount').setValue(this.NetAmount);
    } else if (this.GST == 0) {
      this.GSTAmount = 0;
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
      this.SGSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.SGST)) / 100).toFixed(2);
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
    CGSTAmt = element.reduce((sum, { CGSTAmount }) => sum += +(CGSTAmount || 0), 0); this.CGSTAmount
    this.CGSTFinalAmount = CGSTAmt;
    return CGSTAmt;
  }

  getSGSTAmt(element) {
    let SGSTAmt;
    SGSTAmt = element.reduce((sum, { SGSTAmount }) => sum += +(SGSTAmount || 0), 0);
    this.SGSTFinalAmount = SGSTAmt;
    return SGSTAmt;
  }

  getIGSTAmt(element) {
    let IGSTAmt;
    IGSTAmt = element.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
    this.IGSTFinalAmount = IGSTAmt;
    return IGSTAmt;
  }

  getTotalAmt(element) {
    let TotalAmt;
    TotalAmt = element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
    this.TotalFinalAmount = TotalAmt;

    let FinalDisAmount
    FinalDisAmount = element.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0);

    this.FinalDisAmount = FinalDisAmount;

    let FinalNetAmount;
    FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.FinalNetAmount = (FinalNetAmount).toFixed(2);
    this.NetPayamount = this.FinalNetAmount;

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
      this._GRNList.GRNFirstForm.get('StoreId').setValue(this.StoreList[0]);
      this.StoreName = this._GRNList.GRNFirstForm.get('StoreId').value.StoreName;
    });
  }


  getSupplierSearchCombo() {
    
    this._GRNList.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      console.log(data);
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._GRNList.GRNSearchGroup.get('Supplier_Id').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
      if (this.data) {
        debugger
        const ddValue = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierId);
        this._GRNList.GRNFirstForm.get('Supplier_Id').setValue(ddValue);
      }
    });
  }





  getSelectedObj(obj) {
    this.accountService
    debugger
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.Qty = obj.BalanceQty;

    if (this.Qty > 0) {
      this.UOM = obj.UOM;
      this.Rate = obj.PurchaseRate;
      this.TotalAmount = (parseInt(obj.BalanceQty) * parseFloat(this.Rate)).toFixed(2);
      this.NetAmount = this.TotalAmount;
      this.VatPercentage = obj.VatPercentage;
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


  getGRNItemList() {
    debugger
    var m_data = {
      "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
      "StoreId": 2// this._GRNList.GRNSearchGroup.get('StoreId').value.storeid || 0
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

  getItemNameList() {
    var Param = {

      "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
      "StoreId": 1//this._IndentID.IndentSearchGroup.get("Status").value.Status
    }
    console.log(Param);
    this._GRNList.getItemNameList(Param).subscribe(data => {
      this.filteredOptions = data;
      console.log(this.filteredOptions)
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
    this._GRNList.GRNSearchGroup.reset();
    this._GRNList.userFormGroup.reset();
    this.dsItemNameList.data = [];
  }

  delete(elm) {
    this.dsItemNameList.data = this.dsItemNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
  }



  OnSave() {
    debugger
    let updateGRNHeaderObj = {};
    updateGRNHeaderObj['grnDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['grnTime'] = this.dateTimeObj.time;
    updateGRNHeaderObj['storeId'] = this._GRNList.GRNFirstForm.get('StoreId').value.Storeid || 0;
    updateGRNHeaderObj['supplierID'] = this._GRNList.GRNFirstForm.get('Supplier_Id').value.SupplierId || 0;
    updateGRNHeaderObj['invoiceNo'] = this._GRNList.GRNFirstForm.get('InvoiceNo').value || 0;
    updateGRNHeaderObj['deliveryNo'] = 0,//this._GRNList.GRNFirstForm.get('Supplier_Id').value.SupplierId || 0;
      updateGRNHeaderObj['gateEntryNo'] = this._GRNList.GRNFirstForm.get('GateEntryNo').value || 0;
    updateGRNHeaderObj['cash_CreditType'] = true,
      updateGRNHeaderObj['grnType'] = 0;
    updateGRNHeaderObj['totalAmount'] = this.TotalFinalAmount;
    updateGRNHeaderObj['totalDiscAmount'] = this.FinalDisAmount;
    updateGRNHeaderObj['totalVATAmount'] = this.VatAmount;
    updateGRNHeaderObj['netAmount'] = this.FinalNetAmount;
    updateGRNHeaderObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || 0;
    updateGRNHeaderObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || 0;
    updateGRNHeaderObj['isVerified'] = false;
    updateGRNHeaderObj['isClosed'] = false;
    updateGRNHeaderObj['addedBy'] = this.accountService.currentUserValue.user.id,
      updateGRNHeaderObj['invDate'] = this.dateTimeObj.date;
    updateGRNHeaderObj['debitNote'] = 0;
    updateGRNHeaderObj['creditNote'] = 0;
    updateGRNHeaderObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharges').value || 0;
    updateGRNHeaderObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
    updateGRNHeaderObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;
    updateGRNHeaderObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;
    updateGRNHeaderObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;
    updateGRNHeaderObj['tranProcessId'] = 0;
    updateGRNHeaderObj['tranProcessMode'] = "";
    updateGRNHeaderObj['billDiscAmt'] = this.FinalDisAmount || 0;
    updateGRNHeaderObj['grnid'] = this.registerObj.GRNId;

    let SavegrnDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {

      console.log(element);

      let grnDetailSaveObj = {};
      grnDetailSaveObj['grnDetID'] = 0;
      grnDetailSaveObj['grnId'] = this.registerObj.GRNId;;
      grnDetailSaveObj['itemId'] = element.ItemID;
      grnDetailSaveObj['uomId'] = element.UOM;
      grnDetailSaveObj['receiveQty'] = element.Qty;
      grnDetailSaveObj['freeQty'] = element.FreeQty;
      grnDetailSaveObj['mrp'] = element.MRP;
      grnDetailSaveObj['rate'] = element.Rate;
      grnDetailSaveObj['totalAmount'] = element.TotalAmount;
      grnDetailSaveObj['conversionFactor'] = 0;//element.vatAmount;
      grnDetailSaveObj['vatPercentage'] = element.VatPer;;
      grnDetailSaveObj['vatAmount'] = element.VatAmt;
      grnDetailSaveObj['discPercentage'] = element.Disc;
      grnDetailSaveObj['discAmount'] = element.DisAmount;
      grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
      grnDetailSaveObj['landedRate'] = 0;//this.CgstAmt;
      grnDetailSaveObj['netAmount'] = element.NetAmount;
      grnDetailSaveObj['grossAmount'] = element.NetAmount;
      grnDetailSaveObj['totalQty'] = element.Qty;
      grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
      grnDetailSaveObj['batchNo'] = element.BatchNo;
      grnDetailSaveObj['batchExpDate'] = this.dateTimeObj.date;
      grnDetailSaveObj['purUnitRate'] = 0; //this.SgstPer;
      grnDetailSaveObj['purUnitRateWF'] = 0; //this.SgstPer;
      grnDetailSaveObj['cgstPer'] = element.CGST || 0;
      grnDetailSaveObj['cgstAmt'] = element.CGSTAmount || 0;
      grnDetailSaveObj['sgstPer'] = element.SGST || 0;
      grnDetailSaveObj['sgstAmt'] = element.SGSTAmount || 0;
      grnDetailSaveObj['igstPer'] = element.IGST || 0;
      grnDetailSaveObj['igstAmt'] = element.IGSTAmount || 0;
      grnDetailSaveObj['mrP_Strip'] = element.MRP_Strip || 0;
      grnDetailSaveObj['isVerified'] = 0,//element.SGSTAmount;
        grnDetailSaveObj['igstPer'] = element.IGST || 0;
      grnDetailSaveObj['isVerifiedDatetime'] = this.dateTimeObj.time;
      grnDetailSaveObj['isVerifiedUserId'] = 1;//this.SgstAmt;

      SavegrnDetailObj.push(grnDetailSaveObj);

    });

    let delete_GRNDetailsobj = {}
    delete_GRNDetailsobj["GRNId"] = this.registerObj.GRNId;


    let submitData = {
      "updateGRNHeader": updateGRNHeaderObj,
      "delete_GRNDetails": delete_GRNDetailsobj,
      "grnDetailSave": SavegrnDetailObj
    };

    console.log(submitData);

    this._GRNList.GRNSave(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Updated GRN !', 'Record Updated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'GRN not Updated', 'error');
      }
      // this.isLoading = '';
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
      // this.itemname.nativeElement.focus();
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

  onChangeStatus3(event) {
    debugger
    if (event.value.name == 'GST Before Disc') {

      if (parseFloat(this.GST) > 0) {

        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST After Disc') {
      debugger

      let disc = this._GRNList.userFormGroup.get('Disc').value
      if (disc > 0) {
        this.DisAmount = (disc * parseFloat(this.TotalAmount) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DisAmount)).toFixed(4);
        if (parseFloat(this.GST) > 0) {
          this.GSTAmount = ((parseFloat(this.NetAmount) * parseFloat(this.GST)) / 100).toFixed(4);
          this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmount)).toFixed(4);
        }
      }
      else {
        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST On Pur +FreeQty') {
      if (parseFloat(this.GST) > 0) {

        let TotalQty = parseInt(this.Qty) + parseInt(this.FreeQty)
        this.TotalAmount = (parseFloat(this.Rate) * TotalQty).toFixed(2);
        this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);
      }
    }
    else if (event.value.name == 'GST OnMRP') {
      this.TotalAmount = (parseFloat(this.MRP) * this.Qty).toFixed(2);
      this.GSTAmount = ((parseFloat(this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(4);
      this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmount)).toFixed(4);

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

