import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PurchaseOrderService } from '../purchase-order.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { map, startWith } from 'rxjs/operators';
import { IndentList } from 'app/main/inventory/patient-material-consumption/patient-material-consumption.component';
import { MatTableDataSource } from '@angular/material/table';
import { ItemNameList, PurchaseItemList, PurchaseOrder } from '../purchase-order.component';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';

@Component({
  selector: 'app-update-purchaseorder',
  templateUrl: './update-purchaseorder.component.html',
  styleUrls: ['./update-purchaseorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdatePurchaseorderComponent implements OnInit {

  displayedColumns2 = [
 
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
    'Action',
  ];

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  StoreList: any = [];
  Store1List: any = [];
  StoreName: any;
  FromStoreList: any;
  SupplierList: any;
  screenFromString = 'admission-form';
  ItemID: any = 0;
  labelPosition: 'before' | 'after' = 'after';
  isSupplierSelected: boolean = false;
  isPaymentSelected: boolean = false;
  isItemNameSelected: boolean = false;
  filteredOptions: any;
  ItemnameList = [];
  showAutocomplete = false;
  noOptionFound: boolean = false;
  chargeslist: any = [];
  optionsMarital: any[] = [];
  optionsPayment: any[] = [];
  optionsItemName: any[] = [];

  GSTAmt: any = 0.0;
  CGSTAmount: any;
  IGSTAmount: any;
  SGSTAmount: any = 0.0;
  grandTotalAmount: any = 0.0;
  isItemIdSelected: boolean = false;
  VatPercentage: any = 0.0;
  state = false;
  optionsInc = null;


  BatchNo: any;
  BatchExpDate: any;
  UnitMRP: any;
  Qty: any = 1;
  IssQty: any;
  Bal: any;

  GSTPer: any;
  MRP: any;
  DiscPer: any = 0;
  DiscAmt: any = 0;
  FinalDiscPer: any = 0;
  FinalDiscAmt: any = 0;
  NetAmt: any = 0;
  TotalMRP: any = 0;
  FinalTotalAmt: any;
  FinalNetAmount: any = 0;
  FinalGSTAmt: any = 0;

  VatPer: any;
  CgstPer: any;
  SgstPer: any;
  IgstPer: any;

  VatAmount: any;
  CGSTAmt: any;
  SGSTAmt: any;
  IGSTAmt: any;

  PaymentTerm: any;
  registerObj = new ItemNameList({});
  ItemObj: IndentList;

  ItemName: any;
  UOM: any;
  BalanceQty: any;
  Rate: any;
  TotalAmount: any;
  Dis: any = 0;
  GST: any = 0;
  NetAmount: any;
  Specification: string;
  renderer: any;
  disableTextbox: boolean;
  DiscAmount: any = 0;
  GSTAmount: any = 0;


  
  FreightList = [
    { id: 1, name: "NILL" },
    { id: 2, name: "RS 240" },
    { id: 3, name: "RS 2500" },
    {id: 4, name: "RS 360"},
    // {id: 5, name: "England"}
  ];

  Status3List = [
    { tranProcessId: 1, name: "GST Before Disc" },
    { tranProcessId: 2, name: "GST After Disc" },
  ];

DeliveryDateList = [
  { id: 1, name: "1 WEEK" },
  { id: 2, name: "20 DAYS" },
  { id: 3, name: "30 Days" },
  {id: 4, name: "AS PER FINALQUOTATION"},
  {id: 5, name: "IMMIDATE"}
];


PaymentModeList = [
  { id: 1, name: "CASH" },
  { id: 2, name: "CHEQUE" },
  { id: 3, name: "30 Days" },
  {id: 4, name: "D D"},
  {id: 5, name: "ECS"}
];

TaxNatureList = [
  { id: 1, name: "EXCISE DUTY 10.3 PERCENT CST13.5 PER" },
  { id: 2, name: "INCLUSIVE" },
  { id: 3, name: "VAT" },
  {id: 4, name: "VAT 12.5 INCLUSIVE"},
  {id: 5, name: "VAT 12.5 EXTRA"}
];

PaymentList = [
  { id: 1, name: "Cash" },
  { id: 2, name: "DD" },
  { id: 3, name: "Cheque" },
  {id: 4, name: "Credit"},
  // {id: 5, name: "VAT 12.5 EXTRA"}
];
  
  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  selectedRowIndex: any;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsPayment: Observable<string[]>;

  constructor(
  
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog,
    private _formBuilder: FormBuilder,
    private _fuseSidebarService: FuseSidebarService,
    private snackBarService: SnackBarService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<UpdatePurchaseorderComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr : ToastrService,
    private accountService: AuthenticationService,
  


  ) { }

  ngOnInit(): void {
   
    if (this.data.chkNewGRN==2) {
      
      this.registerObj=this.data.Obj;
     // this.Remark = this.registerObj.Remarks;
        this.getOldPurchaseOrder(this.registerObj.PurchaseID);    
         this.setDropdownObjs1();
 
    }
    
    // this.getTostoreSearchCombo();
    // this.getFromStoreSearchList();
    this.getSupplierSearchCombo();
    // this.getToStoreSearchList();
    // this.getItemNameSearchCombo();
    // this.getItemNameList();
    this.gePharStoreList();
  }

  
  setDropdownObjs1() {
    const toSelectPaymentTerm = this.PaymentList.find(c => c.id == this.registerObj.PaymentTermId);
    this._PurchaseOrder.userFormGroup.get('PaymentTerm').setValue(toSelectPaymentTerm);

    const toSelect = this.PaymentModeList.find(c => c.id == this.registerObj.ModeOfPayment);
    this._PurchaseOrder.userFormGroup.get('PaymentMode').setValue(toSelect);

    const toSelectTaxNature = this.TaxNatureList.find(c => c.id == this.registerObj.TaxNatureId);
    this._PurchaseOrder.userFormGroup.get('TaxNature').setValue(toSelectTaxNature);

    const toSelecttranProcessId = this.Status3List.find(c => c.tranProcessId == this.registerObj.tranProcessId);
    this._PurchaseOrder.userFormGroup.get('Status3').setValue(toSelecttranProcessId);

    const toSelectSchedule = this.DeliveryDateList.find(c => c.id == this.registerObj.Schedule);
    this._PurchaseOrder.FinalPurchaseform.get('Schedule').setValue(toSelectSchedule);

    
    // this.Status3List(this.userFormGroup.get('TaxNature').value.id);
    // this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
    
    // this.onChangeCityList(this.personalFormGroup.get('CityId').value);
    
    // this.personalFormGroup.updateValueAndValidity();
    // this.dialogRef.close();
    
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
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
    this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._PurchaseOrder.userFormGroup.get('FromStoreId').setValue(this.StoreList[0]);
     // this.StoreName = this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').value.StoreName;
    });
  }

  getSupplierSearchCombo() {
  
    this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      //console.log(data);
      this.optionsMarital = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._PurchaseOrder.userFormGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );

      if (this.data) {
        
        const toSelectSUpplierId = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierID);
        this._PurchaseOrder.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
       // this._PurchaseOrder.userFormGroup.get('SupplierId').setValue(this.SupplierList[0]);
      }
      

    });
  }
   

  onChangeDiscountMode(event) {
    //debugger
    if (event.value.name == 'GST Before Disc') {

      if (parseFloat(this.GSTPer) > 0) {

        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(2);
      }
    }
    else if (event.value.name == 'GST After Disc') {
      
      // if (parseFloat(this.GSTPer) > 0) {
      let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
      if (disc > 0) {
        this.DiscAmt = (disc * parseFloat(this.TotalAmount) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this.DiscAmt)).toFixed(2);
        if (parseFloat(this.GSTPer) > 0) {
          this.GSTAmt = ((parseFloat(this.NetAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
          this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(2);
        }
      } 
      else {
        this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(2);
      }
    }
    
  }
  

  // onChangeDiscountModeTable(event,contact:any) {
  //   debugger
  //  this.GSTPer=parseFloat(contact.GST);
    
  //   if (event.value.name == 'GST Before Disc') {

  //     if (parseFloat(contact.GST) > 0) {

  //       contact.GSTAmount = ((parseFloat(contact.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
  //       contact.NetAmount = (parseFloat(contact.TotalAmount) + parseFloat(contact.GSTAmount)).toFixed(2);
  //     }
  //   }
  //   else if (event.value.name == 'GST After Disc') {
      
  //     // if (parseFloat(this.GSTPer) > 0) {
  //      this.Dis=parseFloat(contact.Dis);
  //     let disc = this.Dis;
  //     if (disc > 0) {
  //       contact.DiscAmount = (disc * parseFloat(contact.TotalAmount) / 100).toFixed(2);
  //       contact.NetAmount = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);
  //       if (parseFloat(this.GSTPer) > 0) {
  //         contact.GSTAmount = ((parseFloat(contact.NetAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
  //         contact.NetAmount = (parseFloat(contact.NetAmount) + parseFloat( contact.GSTAmount)).toFixed(2);
  //       }
  //     } 
  //     else {
  //       contact.GSTAmount= ((parseFloat(contact.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
  //       contact.NetAmount = (parseFloat(contact.TotalAmount) + parseFloat( contact.GSTAmount)).toFixed(2);
  //     }
  //   }
  // }
  GrandTotalAmount:any;
  UnitofMeasurementName:any;
  onAdd(event) {
    
    this.dsItemNameList.data = [];

    if (this.chargeslist.length ==0){
      this.chargeslist=this.dsTempItemNameList.data
    }
    this.chargeslist.push(
      {
        ItemID: this.ItemID,
        ItemName: this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemName || '',
        Qty: this.Qty || 0,
        UOMID: this.UOM || 0,
        Rate: this.Rate || 0,
        TotalAmount:parseInt(this.TotalAmount).toFixed(2) || 0,
        DiscPer: this.Dis || 0,
        DiscAmount: parseInt(this.DiscAmt).toFixed(2)  || 0,
        VatAmount: this.GSTAmt || 0,
        VatPer: this.GSTPer|| 0,

        // CGSTPer: this.CgstPer,
        // CGSTAmt: this.CGSTAmt ||0,
        // SGSTPer: this.SgstPer,
        // SGSTAmt: this.SGSTAmt,
        // IGSTPer: this.IgstPer,
        // IGSTAmt: this.IGSTAmt,
        GST: this.GSTPer || 0,
        GSTAmount: this.GSTAmt || 0,
        GrandTotalAmount:parseInt(this.NetAmount).toFixed(2)   || 0,
        MRP: this.MRP || 0,
        Specification: this.Specification || '',

      });
     

    this.dsItemNameList.data = this.chargeslist;
    //this._PurchaseOrder.userFormGroup.reset();
    
    this.itemid.nativeElement.focus();
    this.add = false;
    this.ItemFormreset();
    
  }

  
  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsItemNameList.data = [];
      this.dsItemNameList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }

  getOptionText(option) {

    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';

  }

   
  getOldPurchaseOrder(el) {
debugger
    var Param = {
      "purchaseID": el,
     
    }
    this._PurchaseOrder.getPurchaseOrderDetail(Param).subscribe(data => {
      this.dsItemNameList.data = data as ItemNameList[];
      this.dsTempItemNameList.data= data as ItemNameList[];
      this.dsItemNameList.sort = this.sort;
      this.dsItemNameList.paginator = this.paginator;
      this.sIsLoading = '';
     console.log(this.dsItemNameList);
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getPurchaseItemList(Params) {
    var Param = {
      "PurchaseId": Params.purchaseId
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

  focusNextService() {
    // this.renderer.selectRootElement('#myInput').focus();
  }
  


  getPharItemList() {
    var m_data = {
      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
      "StoreId":this._PurchaseOrder.userFormGroup.get('FromStoreId').value.storeid 
    }
    console.log(m_data);
    // if (this._PurchaseOrder.userFormGroup.get('ItemName').value.length >= 2) 
      this._PurchaseOrder.getItemList(m_data).subscribe(data => {
        this.filteredOptions = data;
        console.log( this.filteredOptions )
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    
  }
  
  getItemNameList() {
    
    var Param = {

      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%` || '%',
      "StoreId": this._PurchaseOrder.userFormGroup.get('FromStoreId').value.storeid  || 0
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
    this.accountService
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.Qty = 0; //obj.BalanceQty;

    // if (this.Qty > 0) {
      this.UOM = obj.UOM;
      this.Rate = obj.PurchaseRate || 0;
      this.TotalAmount = (parseInt(this.Qty) * parseFloat(this.Rate)).toFixed(4);
      this.NetAmount = this.TotalAmount ||0;
      this.VatPercentage = obj.VatPercentage ||0;
      // this.CGSTPer =onj.CGSTPer;
      this.GSTPer = obj.GSTPer || 0
      this.GSTAmount = 0;
      // this.NetAmount = obj.NetAmount;
       this.MRP = obj.UnitMRP ||0;
      this.Specification = obj.Specification ||'';
    // }
    this.qty.nativeElement.focus();
  }


  disableSelect = new FormControl(false);

  OnSave(){
    if(this.data.chkNewGRN==1)
    {
      this.OnSavenew();
    }else if(this.data.chkNewGRN==2){
      this.OnSaveEdit()
    }
  }


  OnSaveEdit() {
    
   
    let updatePurchaseOrderHeaderObj = {};
    updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date;
    updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
    updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    updatePurchaseOrderHeaderObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt;
    updatePurchaseOrderHeaderObj['discAmount'] = this.DiscAmount;
    updatePurchaseOrderHeaderObj['taxAmount'] = 0;
    updatePurchaseOrderHeaderObj['freightAmount'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value.id || 0;
    updatePurchaseOrderHeaderObj['octriAmount'] = 0;
    updatePurchaseOrderHeaderObj['grandTotal'] = this.FinalNetAmount;
    updatePurchaseOrderHeaderObj['isclosed'] = false;
    updatePurchaseOrderHeaderObj['isVerified'] = false;
    updatePurchaseOrderHeaderObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
    updatePurchaseOrderHeaderObj['taxID'] = 0;
    updatePurchaseOrderHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
    updatePurchaseOrderHeaderObj['paymentTermId'] = this._PurchaseOrder.userFormGroup.get('PaymentTerm').value.id || '';
    updatePurchaseOrderHeaderObj['modeofPayment'] = this._PurchaseOrder.userFormGroup.get('PaymentMode').value.id || '';
    updatePurchaseOrderHeaderObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Worrenty').value || 0;
    updatePurchaseOrderHeaderObj['roundVal'] = this._PurchaseOrder.FinalPurchaseform.get('roundVal').value || 0;
    updatePurchaseOrderHeaderObj['totCGSTAmt'] = 0;//this.GSTAmount || 0;
    updatePurchaseOrderHeaderObj['totSGSTAmt'] =  0;
    updatePurchaseOrderHeaderObj['totIGSTAmt'] = 0;
    updatePurchaseOrderHeaderObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    updatePurchaseOrderHeaderObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    updatePurchaseOrderHeaderObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['purchaseId'] = this.registerObj.PurchaseID;
   
    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemID;
      purchaseDetailInsertObj['uomId'] = element.UOMID;
      purchaseDetailInsertObj['qty'] = element.Qty;
      purchaseDetailInsertObj['rate'] = element.Rate;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.GSTAmount;
      purchaseDetailInsertObj['vatPer'] = element.GST;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = 0;
      purchaseDetailInsertObj['cgstAmt'] = 0;
      purchaseDetailInsertObj['sgstPer'] = 0;
      purchaseDetailInsertObj['sgstAmt'] = 0;
      purchaseDetailInsertObj['igstPer'] = 0;
      purchaseDetailInsertObj['igstAmt'] = 0;
      
      InsertpurchaseDetailObj.push(purchaseDetailInsertObj);


    });
  
    let delete_PurchaseDetailsObj = {};
    delete_PurchaseDetailsObj['purchaseID'] =this.registerObj.PurchaseID;

    let submitData = {
      "updatePurchaseOrderHeader": updatePurchaseOrderHeaderObj,
      "delete_PurchaseDetails": delete_PurchaseDetailsObj,
      "purchaseDetailInsert": InsertpurchaseDetailObj,
    };
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseUpdate(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        // Swal.fire('Update Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
        //   if (result.isConfirmed) {
        //     let m = response;
        //     // this._matDialog.closeAll();
        //     // this.OnReset()
        //   }
        // });
        this._matDialog.closeAll();
         this.OnReset()
      } else {
        this.toastr.error('New Purchase  Data not Updated !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      // this.isLoading = '';
    },error => {
      this.toastr.error('New Purchase Order Data not Updated !, Please check API error..', 'Error !', {
       toastClass: 'tostr-tost custom-toast-error',
     });
   });
  }
  
  OnSavenew() {
    
    // if(!this._PurchaseOrder.PurchaseStoreform.get("purchaseId").value) {
    let purchaseHeaderInsertObj = {};
    purchaseHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date;
    purchaseHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
    purchaseHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    purchaseHeaderInsertObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    purchaseHeaderInsertObj['totalAmount'] = this.FinalTotalAmt;
    purchaseHeaderInsertObj['discAmount'] = this.DiscAmount;
    purchaseHeaderInsertObj['taxAmount'] = 0;
    purchaseHeaderInsertObj['freightAmount'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['octriAmount'] = 0;
    purchaseHeaderInsertObj['grandTotal'] = this.FinalNetAmount;
    purchaseHeaderInsertObj['isclosed'] = false;
    purchaseHeaderInsertObj['isVerified'] = false;
    purchaseHeaderInsertObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
    purchaseHeaderInsertObj['taxID'] = this._PurchaseOrder.userFormGroup.get('TaxNature').value.id || 0;;
    
    purchaseHeaderInsertObj['addedBy'] = this.accountService.currentUserValue.user.id,
    purchaseHeaderInsertObj['updatedBy'] = this.accountService.currentUserValue.user.id,
    purchaseHeaderInsertObj['paymentTermId'] = this._PurchaseOrder.userFormGroup.get('PaymentTerm').value.id || '';
    purchaseHeaderInsertObj['modeofPayment'] = this._PurchaseOrder.userFormGroup.get('PaymentMode').value.id || '';
    purchaseHeaderInsertObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Worrenty').value || 0;
    purchaseHeaderInsertObj['roundVal'] = this._PurchaseOrder.FinalPurchaseform.get('roundVal').value || 0;
    purchaseHeaderInsertObj['totCGSTAmt'] = 0;
    purchaseHeaderInsertObj['totSGSTAmt'] = 0;
    purchaseHeaderInsertObj['totIGSTAmt'] = 0;
    purchaseHeaderInsertObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    purchaseHeaderInsertObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    purchaseHeaderInsertObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['purchaseId'] = 0;

    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemID;
      purchaseDetailInsertObj['uomId'] = element.UOMID;
      purchaseDetailInsertObj['qty'] = element.Qty;
      purchaseDetailInsertObj['rate'] = element.Rate;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.GSTAmount;
      purchaseDetailInsertObj['vatPer'] = element.GST;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = 0;
      purchaseDetailInsertObj['cgstAmt'] = 0;
      purchaseDetailInsertObj['sgstPer'] = 0;
      purchaseDetailInsertObj['sgstAmt'] = 0;
      purchaseDetailInsertObj['igstPer'] = 0;
      purchaseDetailInsertObj['igstAmt'] = 0;
      InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
    });

    let submitData = {
      "purchaseHeaderInsert": purchaseHeaderInsertObj,
      "purchaseDetailInsert": InsertpurchaseDetailObj,
    };
    console.log(submitData);
    this._PurchaseOrder.InsertPurchaseSave(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        // Swal.fire('Save Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
        //   if (result.isConfirmed) {
        //     let m = response;
        //     // this._matDialog.closeAll();
        //     this.OnReset();

        //   }
        // });
        this._matDialog.closeAll();
        this.OnReset()
      } else {
        this.toastr.error('New Purchase  Data not saved !, Please check API error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
      // this.isLoading = '';
    },error => {
      this.toastr.error('New Purchase Order Data not saved !, Please check API error..', 'Error !', {
       toastClass: 'tostr-tost custom-toast-error',
     });
   });
  // }
  // else{

  //   let updatePurchaseOrderHeaderObj = {};
  //   updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date;
  //   updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
  //   updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId;
  //   updatePurchaseOrderHeaderObj['supplierID'] = this._PurchaseOrder.PurchaseStoreform.get('SupplierId').value.SupplierId || 0;
  //   updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt;
  //   updatePurchaseOrderHeaderObj['discAmount'] = this.DiscAmount;
  //   updatePurchaseOrderHeaderObj['taxAmount'] = 0;
  //   updatePurchaseOrderHeaderObj['freightAmount'] = this._PurchaseOrder.PurchaseStoreform.get('Freight').value || 0;
  //   updatePurchaseOrderHeaderObj['octriAmount'] = 0;
  //   updatePurchaseOrderHeaderObj['grandTotal'] = this.FinalNetAmount;
  //   updatePurchaseOrderHeaderObj['isclosed'] = false;
  //   updatePurchaseOrderHeaderObj['isVerified'] = false;
  //   updatePurchaseOrderHeaderObj['remarks'] = "";
  //   updatePurchaseOrderHeaderObj['taxID'] = 0;
    
  //   updatePurchaseOrderHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
  //   updatePurchaseOrderHeaderObj['paymentTermId'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentTerm').value.value || '';
  //   updatePurchaseOrderHeaderObj['modeofPayment'] = '',//this._PurchaseOrder.PurchaseSearchGroup.get('PaymentMode').value || '';
  //   updatePurchaseOrderHeaderObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Warranty').value || 0;
  //   updatePurchaseOrderHeaderObj['roundVal'] = 0;
  //   updatePurchaseOrderHeaderObj['totCGSTAmt'] = this.GSTAmount;
  //   updatePurchaseOrderHeaderObj['totSGSTAmt'] = this.SGSTAmount;
  //   updatePurchaseOrderHeaderObj['totIGSTAmt'] = this.IGSTAmount;
  //   updatePurchaseOrderHeaderObj['transportChanges'] = 0;
  //   updatePurchaseOrderHeaderObj['handlingCharges'] = 0;
  //   updatePurchaseOrderHeaderObj['freightCharges'] = 0;
  //   updatePurchaseOrderHeaderObj['purchaseId'] = 0;

    
  //   let delete_PurchaseDetailsObj = {};
  //   delete_PurchaseDetailsObj['purchaseID'] = 0;

  //   let update_POVerify_StatusObjarray = [];
  //   this.dsItemNameList.data.forEach((element) => {
  //     let update_POVerify_StatusObj = {};
  //     update_POVerify_StatusObj['purchaseId'] = 0;
  //     update_POVerify_StatusObj['itemId'] = element.ItemID;
  //     update_POVerify_StatusObj['uomId'] = element.UOMID;
  //     update_POVerify_StatusObj['qty'] = element.Qty;
  //     update_POVerify_StatusObj['rate'] = element.Rate;
  //     update_POVerify_StatusObjarray.push(update_POVerify_StatusObj);
  //   });

  //   let submitData = {
  //     "updatePurchaseOrderHeader": updatePurchaseOrderHeaderObj,
  //      "delete_PurchaseDetails": delete_PurchaseDetailsObj,
  //     "update_POVerify_StatusObj": update_POVerify_StatusObjarray,
  //   };
  //   console.log(submitData);
  //   this._PurchaseOrder.InsertPurchaseUpdate(submitData).subscribe(response => {
  //     if (response) {
  //       Swal.fire('Update Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
  //         if (result.isConfirmed) {
  //           let m = response;
  //           // this._matDialog.closeAll();
  //           // this.OnReset()
  //         }
  //       });
  //     } else {
  //       Swal.fire('Error !', 'Purchase not Updated', 'error');
  //     }
  //     // this.isLoading = '';
  //   });
  // }
  }
  calculateTotalAmount() {
    if (this.Rate && this.Qty) {
      this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(2);
      this.NetAmount = this.TotalAmount;
      // this.calculatePersc();
    }
  }

  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, { GrandTotalAmount }) => sum += +(GrandTotalAmount || 0), 0);
    return this.FinalNetAmount;
  }

  getTotalGST(element) {

    this.GSTAmount = (element.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0)).toFixed(2);
    return this.GSTAmount;

    this.CGSTAmount = (element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0)).toFixed(2);
    this.SGSTAmount = (element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0)).toFixed(2);
    this.IGSTAmount = (element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0)).toFixed(2);

  }

  getTotalDisc(element) {

    this.DiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0);
    return this.DiscAmount;
  }

  getTotalAmt(element) {

    this.FinalTotalAmt = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    return this.FinalTotalAmt;
  }

  calculateDiscperAmount() {
    
    if (this.Dis) {
      let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
      this.DiscAmt = ((disc * parseFloat(this.NetAmount)) / 100).toFixed(2);
      // this.DiscAmount =  DiscAmt
      this.NetAmount = (parseFloat(this.NetAmount) - parseFloat(this.DiscAmt)).toFixed(2);

    }

  }

  calculateDiscAmount() {
    if (this.Dis) {
      this.NetAmount =(parseFloat(this.NetAmount) - parseFloat(this.DiscAmount));
      // this.DiscAmount;
      // this.calculatePersc();
    }
  }

  calculateGSTperAmount() {

    if (this.GSTPer) {

      this.GSTAmt = ((parseFloat(this.NetAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
      this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(2);
      this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);

    }
  }

  // calculateGSTAmount(){
  //   if (this.GSTAmt) {

  //     // this.GSTAmount = Math.round((this.NetAmount * parseInt(this.GST)) / 100);
  //     this.NetAmount = (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(4);
  //     this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);

  //   }
  // }

  calculatePersc() {
    if (this.Dis) {
      this.Dis = Math.round(this.TotalAmount * parseInt(this.DiscAmount)) / 100;
      this.NetAmount = this.TotalAmount - this.Dis;
      this._PurchaseOrder.userFormGroup.get('calculateDiscAmount').disable();
    }

  }

  highlight(contact) {
    this.selectedRowIndex = contact.ItemID;
  }

  OnReset() {
    //this._PurchaseOrder.PurchaseSearchGroup.reset();
    this._PurchaseOrder.userFormGroup.reset();
    //this._PurchaseOrder.PurchaseStoreform.reset();
    this._PurchaseOrder.FinalPurchaseform.reset();
    this.dsItemNameList.data = [];
    this.ItemFormreset();
 
    
  }
  ItemNames:any;
  ItemFormreset() {
     this.ItemNames= "";
     this.ItemID= 0;
     this.Qty= 0;
     this.UOM = 0 ;
     this.Rate= 0;
     this.TotalAmount= 0;
     this.Dis= 0;
     this.DiscAmt= 0;
     this.GSTPer= 0;
     this.GSTAmt= 0;
     this.NetAmount= 0;
     this.MRP= 0;
    this.Specification= "";
    // this.Status3List = [];       
}
 

  delete(elm) {
    this.dsItemNameList.data = this.dsItemNameList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
  }

  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }
    // getFromStoreSearchList() {
  //   var data = {
  //     Id: this.accountService.currentUserValue.user.storeId
  //   }
  //   this._PurchaseOrder.getFromStoreSearchList(data).subscribe(data => {
  //     this.FromStoreList = data;
  //     this._PurchaseOrder.PurchaseSearchGroup.get('FromStoreId').setValue(this.FromStoreList[0]);
  //   });
  // }

  onScroll() {
    //Note: This is called multiple times after the scroll has reached the 80% threshold position.
    // this.nextPage$.next();
  }

  // getToStoreSearchList() {

  //   var vdata = {
  //     Id: this.accountService.currentUserValue.user.storeId
  //   }
  //   console.log(vdata);
  //   this._PurchaseOrder.getLoggedStoreList(vdata).subscribe(data => {
  //     this.ToStoreList = data;
  //     console.log(this.ToStoreList);
  //     this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').setValue(this.Store1List[0]);
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

 

  // getTostoreSearchCombo() {
  //   this._PurchaseOrder.getToStoreSearchList().subscribe(data => {
  //     this.ToStoreList = data;
  //     console.log(data);
  //     this.optionsPayment = this.ToStoreList.slice();
  //     this.filteredoptionsPayment = this._PurchaseOrder.PurchaseSearchGroup.get('ToStoreId').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterPayment(value) : this.ToStoreList.slice()),
  //     );

  //     // if (this.data) {
  //     //   
  //     //   const ddValue = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierID);
  //     //   this._PurchaseOrder.PurchaseStoreform.get('ToStoreId').setValue(ddValue);
  //     // }
  //   });
  // }

  // getItemNameSearchCombo() {
  //   var Param = {

  //     "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
  //     "StoreId": this._PurchaseOrder.userFormGroup.get("StoreId").value.StoreId || 0
  //   }
  //   // console.log(Param);
  //   this._PurchaseOrder.getItemNameList(Param).subscribe(data =>{
  //       this.ItemName = data;
  //       // console.log(data);
  //       this.optionsItemName = this.ItemName.slice();
  //       this.filteredoptionsItemName = this._PurchaseOrder.userFormGroup.get('ItemName').valueChanges.pipe(
  //         startWith(''),
  //         map(value => value ? this._filterItemName(value) : this.ItemName.slice()),
  //       );

  //     });
  //   }

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

  @ViewChild('SupplierId') SupplierId: MatSelect;
  @ViewChild('Freight1') Freight1: ElementRef;

  @ViewChild('DeliveryDate1') DeliveryDate1: ElementRef;
  @ViewChild('PaymentMode') PaymentMode: MatSelect;
  @ViewChild('Status3') Status3: MatSelect;
  @ViewChild('Paymentterm') Paymentterm: MatSelect;

  @ViewChild('TaxNature1') TaxNature1: MatSelect;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
   @ViewChild('uom') uom: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('totalamt') totalamt: ElementRef;
  @ViewChild('dis') dis: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('mrp') mrp: ElementRef;
  @ViewChild('specification') specification: ElementRef;
  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;

  
  @ViewChild('Schedule') Schedule: MatSelect;
  @ViewChild('Remark') Remark: ElementRef;
  @ViewChild('Worrenty') Worrenty: ElementRef;
  @ViewChild('roundVal') roundVal: ElementRef;
  @ViewChild('OtherTax') OtherTax: ElementRef;
  @ViewChild('TransportCharges') TransportCharges: ElementRef;

  public onEnterSupplier(event): void {
    if (event.which === 13) {

      // if (this.Freight) this.Freight.focus();
      this.Freight1.nativeElement.focus();
    }
  }

  public onEnterDeliveryDate(event): void {
    if (event.which === 13) {

      if (this.Paymentterm) this.Paymentterm.focus();
    }
  }
  public onEnterPaymentMode(event): void {
    if (event.which === 13) {
      // this.Paymentterm.nativeElement.focus();
      if (this.TaxNature1) this.TaxNature1.focus();
    }
  }

  public onEnterTaxNature(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
  public onEnterPaymentTerm(event): void {
    if (event.which === 13) {

      if (this.PaymentMode) this.PaymentMode.focus();
    }
  }
  public onEnterItemName(event): void {
    if (event.which === 13) {
     // if(this.ItemName) this.ItemName.focus();
      this.uom.nativeElement.focus();
    }
  }
  public onEnterunit(event): void {
    if (event.which === 13) {
      //if(this.UOM) this.UOM.focus();
      this.qty.nativeElement.focus();
    }
  }
  public onEnterQty(event): void {
    if (event.which === 13) {
      //if(this.Qty) this.Qty.focus();
      this.rate.nativeElement.focus();
    }
  }
  public onEnterRate(event): void {
    if (event.which === 13) {
      //if(this.Rate) this.Rate.focus();
     this.dis.nativeElement.focus();
    }
  }
  public onEnterTotal(event): void {
    if (event.which === 13) {
      //if(this.Rate) this.Rate.focus();
     this.dis.nativeElement.focus();
    }
  }
  public onEnterDis(event): void {
    if (event.which === 13) {
      //if(this.Dis) this.Dis.focus();
      this.gst.nativeElement.focus();
    }
  }
  public onEnterGST(event): void {
    if (event.which === 13) {
    //  if(this.GSTPer) this.GSTPer.focus();
      this.mrp.nativeElement.focus();
    }
  }
  public onEnterMRP(event): void {
    if (event.which === 13) {
      //if(this.MRP) this.MRP.focus();
      this.specification.nativeElement.focus();
    }
  }
  public onEnterSpecification(event): void {
   // debugger
    if (event.which === 13) {
     
      // setTimeout(() => {
        this.add = true;
        this.addbutton.focus();
  
      // }, 300);
    }
  }
  public onEnterHandlingcharge(event): void {
    if (event.which === 13) {
      this.TransportCharges.nativeElement.focus();
      // if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  } 
   public onEnterTransportcharge(event): void {
    if (event.which === 13) {
      this.Freight1.nativeElement.focus();
      // if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  }
  public onEnterFreight(event): void {
    if (event.which === 13) {
      this.Remark.nativeElement.focus();
      // if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  }
  public onEnterRemark(event): void {
    if (event.which === 13) {
      this.Worrenty.nativeElement.focus();
      // if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  }
  public onEnterWorrenty(event): void {
    if (event.which === 13) {
      //if (this.Warranty) this.Warranty.focus();
      this.roundVal.nativeElement.focus();
    }
  }
  public onEnterroundVal(event): void {
    if (event.which === 13) {
      this.roundVal.nativeElement.focus();
     // this.Remark.nativeElement.focus();
    }
  }
  // public onEnterSchedule(event): void {
  //   if (event.which === 13) {
  //     //if (this.Schedule) this.Schedule.focus();
  //     this.OtherTax.nativeElement.focus();
  //   }
  // }

  
  onEdit(contact){

    console.log(contact)

    const dialogRef = this._matDialog.open(UpdatePurchaseorderComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
        data : {
          PurchaseObj : contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  onClose() {
    this.dialogRef.close();
   }
  onClear() { }
}



function elseif(GST: any) {
  throw new Error('Function not implemented.');
}

