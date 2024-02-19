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
    'MRP',
    'Rate',
    'TotalAmount',
    'Dis',
    'DiscAmount',
    'CGST',
    'CGSTAmount',
    'SGST',
    'SGSTAmount',
    'GST',
    'GSTAmount',
    'NetAmount',
    'Specification',
    'Action',
  ];
  displayedColumns3 = [
    'SupplierName',
    'ReceiveQty',
    'FreeQty',
    'MRP',
    'Rate',
    'discpercentage',
    'DiscAmount',
    'VatPercentage'
  ]

  sIsLoading: string = '';
  isLoading = true;
  ToStoreList: any = [];
  StoreList: any = [];
  Store1List: any = [];
  StoreName: any;
  FromStoreList: any;
  SupplierList: any;
  screenFromString = 'purchase-form';
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

 // PaymentTerm: any;
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
  PaymentTermsList :any=[];
  ModeOfPaymentList:any=[];
  GSTTypeList:any=[];
  SupplierID:any;
  Address:any;
  Mobile:any;
  Contact:any;
  GSTNo:any;
  Email:any;
  vConversionFactor:any;
  vHSNcode:any;
  optionsupplier:any;
  GrandTotalAmount:any;
  UnitofMeasurementName:any;
  
  
  dsPurchaseItemList = new MatTableDataSource<PurchaseItemList>();

  dsItemNameList = new MatTableDataSource<ItemNameList>();
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();
  dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();

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
          
    }
 
    
    this.getGSTtypeList();
    this.getPaymentTermList();
    this.getSupplierSearchCombo();
    this.getModeOfPaymentList();
    this.gePharStoreList();
  }
  getPaymentTermList() {
    this._PurchaseOrder.getPaymentTermList().subscribe(data => {
      this.PaymentTermsList = data;
      if (this.data) {
        const toSelectConstantId = this.PaymentTermsList.find(c => c.ConstantId == this.registerObj.ConstantId);
        this._PurchaseOrder.FinalPurchaseform.get('PaymentTerm').setValue(toSelectConstantId);
       }
     });
  }

  getModeOfPaymentList() {
    this._PurchaseOrder.getModeOfPaymentList().subscribe(data => {
      this.ModeOfPaymentList = data;
      if (this.data) {
        const toSelectConstantId = this.ModeOfPaymentList.find(c => c.ConstantId == this.registerObj.ConstantId);
        this._PurchaseOrder.FinalPurchaseform.get('PaymentMode').setValue(toSelectConstantId);
       }
     });
  }

  getGSTtypeList() {
    var vdata = {
      'ConstanyType': 'GST_CALC_TYPE',
    }
    this._PurchaseOrder.getGSTtypeList(vdata).subscribe(data => {
      this.GSTTypeList = data;
     // console.log( this.GSTTypeList)
      if (this.data) {
        const toSelectConstantId = this.GSTTypeList.find(c => c.ConstantId == this.registerObj.ConstantId);
        this._PurchaseOrder.userFormGroup.get('Status3').setValue(toSelectConstantId);
       this._PurchaseOrder.userFormGroup.get('Status3').setValue(this.GSTTypeList[0]);
      }
     });
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
      this._PurchaseOrder.StoreFormGroup.get('StoreId').setValue(this.StoreList[0]);
     // this.StoreName = this._PurchaseOrder.PurchaseSearchGroup.get('StoreId').value.StoreName;
    });
  }

  getSupplierSearchCombo() {
  
    this._PurchaseOrder.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      //console.log(this.SupplierList);
       this.optionsupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._PurchaseOrder.userFormGroup.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );

      if (this.data) {
        const toSelectSUpplierId = this.SupplierList.find(c => c.SupplierId == this.registerObj.SupplierID);
        this._PurchaseOrder.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
       // console.log(toSelectSUpplierId)
        this.Address = toSelectSUpplierId.Address;
        this.Mobile = toSelectSUpplierId.Mobile;
        this.Contact = toSelectSUpplierId.ContactPerson;
        this.GSTNo = toSelectSUpplierId.GSTNo;
        this.Email = toSelectSUpplierId.Email;
      }
    });
  }
 
  getSelectedSupplierObj(obj) {
      this.SupplierID = obj.SupplierId;
      this.Address = obj.Address;
      this.Mobile = obj.Mobile;
      this.Contact = obj.ContactPerson;
      this.GSTNo = obj.GSTNo;
      this.Email = obj.Email;
  }
   
  calculateGSTType(event) {
  
      if (event.value.Name == "GST After Disc") {
        let totalamt = this.TotalAmount - this._PurchaseOrder.userFormGroup.get('DiscAmount').value

        this.GSTAmt = ((totalamt * parseFloat(this.GSTPer)) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.GSTAmt)).toFixed(2);
        this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);
      } else {
        this.GSTAmt = ((this.TotalAmount * parseFloat(this.GSTPer)) / 100).toFixed(2);
        this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.GSTAmt)).toFixed(2);
        this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);
      }
  }
 
  onAdd(event) {
    
    this.dsItemNameList.data = [];

    if (this.chargeslist.length ==0){
      this.chargeslist=this.dsTempItemNameList.data
    }
    this.chargeslist.push(
      {
        ItemId: this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemID ,
        ItemName: this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemName || '',
        Qty: this.Qty || 0,
        UOMID: this.UOM || 0,
        Rate: this.Rate || 0,
        TotalAmount:this.TotalAmount || 0,
        DiscPer: this.Dis || 0,
        DiscAmount: this.DiscAmt|| 0,
        CGSTPer:((this.GSTPer) / 2) || 0,
        CGSTAmt:((this.GSTAmt) / 2)  || 0,
        SGSTPer:((this.GSTPer) / 2)  || 0,
        SGSTAmt:((this.GSTAmt) / 2)  || 0,
        VatAmount: (parseInt(this.GSTAmt).toFixed(2)) || 0 ,
        VatPer: this.GSTPer|| 0,
      //  GST: this.GSTPer || 0,
        GSTAmount: this.GSTAmt || 0,
        GrandTotalAmount:(parseInt(this.NetAmount).toFixed(2)) || 0,
        MRP: this.MRP || 0,
        Specification: this.Specification || '',
        

      });
     //console.log(this.NetAmount);
    this.dsItemNameList.data = this.chargeslist;
    this.itemid.nativeElement.focus();
    this.add = false;
    this.ItemFormreset();
    
  }

  deleteTableRow(element) {

    debugger
   // console.log(this.chargeslist)
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsItemNameList.data = [];
      this.dsItemNameList.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
   // console.log(this.dsItemNameList.data)
    
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
     // this.dsTempItemNameList.data= data as ItemNameList[];
     this.chargeslist = data as ItemNameList[];
      this.dsItemNameList.sort = this.sort;
      this.dsItemNameList.paginator = this.paginator;
      this.sIsLoading = '';
     console.log(this.dsItemNameList);
    },
      error => {
        this.sIsLoading = '';
      });
  }
 
  getPharItemList() {
    var m_data = {
      "ItemName": `${this._PurchaseOrder.userFormGroup.get('ItemName').value}%`,
      "StoreId":this._PurchaseOrder.StoreFormGroup.get('StoreId').value.storeid 
    }
     // if (this._PurchaseOrder.userFormGroup.get('ItemName').value.length >= 2) 
      this._PurchaseOrder.getItemList(m_data).subscribe(data => {
        this.filteredOptions = data;
      console.log(this.filteredOptions);
         if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    
  }
  
 
  ItemId:any;
  getSelectedObj(obj) {
    this.ItemId = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.Qty = 0;
    this.UOM = obj.UnitofMeasurementId;
    this.vConversionFactor = obj.ConversionFactor;
    this.vHSNcode = obj.HSNcode;
    this.Rate = obj.PurchaseRate;
    this.Dis = '';
    this.TotalAmount = (parseInt(this.Qty) * parseFloat(this.Rate)).toFixed(2);
    this.NetAmount = this.TotalAmount || 0;
    this.VatPercentage = obj.VatPercentage || 0;
    this.GSTPer = (obj.SGSTPer + obj.CGSTPer);
    this.GSTAmount = 0;
    this.MRP = obj.UnitMRP || 0;
    this.Specification = obj.Specification || '';
    this.getLastThreeItemInfo();
  }
  getLastThreeItemInfo() {
    var vdata = {
      'ItemId': this._PurchaseOrder.userFormGroup.get('ItemName').value.ItemID || 0,
    }
    this._PurchaseOrder.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
      console.log(this.dsLastThreeItemList.data)
    });
  }


  disableSelect = new FormControl(false);
  // if(this.data.chkNewGRN==2)
  OnSave(){
    if(!this.registerObj.PurchaseID)
    {
      this.OnSavenew();
    }else {
      this.OnSaveEdit()
    }
  }
  OnSaveEdit() {
    debugger
    let updatePurchaseOrderHeaderObj = {};
    updatePurchaseOrderHeaderObj['purchaseDate'] = this.dateTimeObj.date;
    updatePurchaseOrderHeaderObj['purchaseTime'] = this.dateTimeObj.time;
    updatePurchaseOrderHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    updatePurchaseOrderHeaderObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    updatePurchaseOrderHeaderObj['totalAmount'] = this.FinalTotalAmt;
    updatePurchaseOrderHeaderObj['discAmount'] = this.DiscAmount;
    updatePurchaseOrderHeaderObj['taxAmount'] = (parseInt(this.GSTAmount)).toFixed(2);
    updatePurchaseOrderHeaderObj['freightAmount'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['octriAmount'] = this._PurchaseOrder.FinalPurchaseform.get('OctriAmount').value || 0;
    updatePurchaseOrderHeaderObj['grandTotal'] = this.FinalNetAmount;
    updatePurchaseOrderHeaderObj['isclosed'] = false;
    updatePurchaseOrderHeaderObj['isVerified'] = false;
    updatePurchaseOrderHeaderObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
    updatePurchaseOrderHeaderObj['taxID'] = 0;
    updatePurchaseOrderHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
    updatePurchaseOrderHeaderObj['paymentTermId'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentTerm').value.Id || 0;
    updatePurchaseOrderHeaderObj['modeofPayment'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentMode').value.Id ||  0;
    updatePurchaseOrderHeaderObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Worrenty').value || 0;
    updatePurchaseOrderHeaderObj['roundVal'] =  0;
    updatePurchaseOrderHeaderObj['totCGSTAmt'] = (parseInt(this.GSTAmount)/2).toFixed(2);
    updatePurchaseOrderHeaderObj['totSGSTAmt'] =  (parseInt(this.GSTAmount)/2).toFixed(2);
    updatePurchaseOrderHeaderObj['totIGSTAmt'] = 0;
    updatePurchaseOrderHeaderObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    updatePurchaseOrderHeaderObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    updatePurchaseOrderHeaderObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    updatePurchaseOrderHeaderObj['purchaseId'] = this.registerObj.PurchaseID;
   
    let InsertpurchaseDetailObj = [];
    debugger
    this.dsItemNameList.data.forEach((element) => {
      console.log(element);
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemId;
      purchaseDetailInsertObj['uomId'] = element.UOMID;
      purchaseDetailInsertObj['qty'] =  element.Qty || this.editedFinalQty || 0;
      purchaseDetailInsertObj['rate'] =  element.Rate || this.editedFinalRate || 0;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.VatAmount;
      purchaseDetailInsertObj['vatPer'] = element.VatPer;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = element.CGSTPer ;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt ;
      purchaseDetailInsertObj['sgstPer'] = element.SGSTPer ;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt ;
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
    
    let purchaseHeaderInsertObj = {};
    purchaseHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date;
    purchaseHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
    purchaseHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    purchaseHeaderInsertObj['supplierID'] = this._PurchaseOrder.userFormGroup.get('SupplierId').value.SupplierId || 0;
    purchaseHeaderInsertObj['totalAmount'] = this.FinalTotalAmt;
    purchaseHeaderInsertObj['discAmount'] = this.DiscAmount;
    purchaseHeaderInsertObj['taxAmount'] = (parseInt(this.GSTAmount)).toFixed(2);
    purchaseHeaderInsertObj['freightAmount'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['octriAmount'] = this._PurchaseOrder.FinalPurchaseform.get('OctriAmount').value || 0;
    purchaseHeaderInsertObj['grandTotal'] = this.FinalNetAmount;
    purchaseHeaderInsertObj['isclosed'] = false;
    purchaseHeaderInsertObj['isVerified'] = false;
    purchaseHeaderInsertObj['remarks'] = this._PurchaseOrder.FinalPurchaseform.get('Remark').value || '';
    purchaseHeaderInsertObj['taxID'] = 0 ; 
    
    purchaseHeaderInsertObj['addedBy'] = this.accountService.currentUserValue.user.id,
    purchaseHeaderInsertObj['updatedBy'] = this.accountService.currentUserValue.user.id,
    purchaseHeaderInsertObj['paymentTermId'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentTerm').value.Id || 0;
    purchaseHeaderInsertObj['modeofPayment'] = this._PurchaseOrder.FinalPurchaseform.get('PaymentMode').value.Id ||  0;
    purchaseHeaderInsertObj['worrenty'] = this._PurchaseOrder.FinalPurchaseform.get('Worrenty').value || 0;
    purchaseHeaderInsertObj['roundVal'] =  0;
    purchaseHeaderInsertObj['totCGSTAmt'] = (parseInt(this.GSTAmount)/2).toFixed(2);;
    purchaseHeaderInsertObj['totSGSTAmt'] = (parseInt(this.GSTAmount)/2).toFixed(2);;
    purchaseHeaderInsertObj['totIGSTAmt'] = 0;
    purchaseHeaderInsertObj['transportChanges'] = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value || 0;
    purchaseHeaderInsertObj['handlingCharges'] = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value || 0;
    purchaseHeaderInsertObj['freightCharges'] = this._PurchaseOrder.FinalPurchaseform.get('Freight').value || 0;
    purchaseHeaderInsertObj['purchaseId'] = 0;

    let InsertpurchaseDetailObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let purchaseDetailInsertObj = {};
      purchaseDetailInsertObj['purchaseId'] = 0;
      purchaseDetailInsertObj['itemId'] = element.ItemId;
      purchaseDetailInsertObj['uomId'] = element.UOMID;
      purchaseDetailInsertObj['qty'] = element.Qty || this.editedFinalQty || 0;
      purchaseDetailInsertObj['rate'] = element.Rate || this.editedFinalRate || 0;
      purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
      purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
      purchaseDetailInsertObj['discPer'] = element.DiscPer;
      purchaseDetailInsertObj['vatAmount'] = element.VatAmount;
      purchaseDetailInsertObj['vatPer'] = element.VatPer;;
      purchaseDetailInsertObj['grandTotalAmount'] = element.GrandTotalAmount;
      purchaseDetailInsertObj['mrp'] = element.MRP;
      purchaseDetailInsertObj['specification'] = element.Specification;
      purchaseDetailInsertObj['cgstPer'] = element.CGSTPer ;
      purchaseDetailInsertObj['cgstAmt'] = element.CGSTAmt ;
      purchaseDetailInsertObj['sgstPer'] = element.SGSTPer ;
      purchaseDetailInsertObj['sgstAmt'] = element.SGSTAmt ;
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
  }
editedFinalQty:any=0;
editedFinalRate:any=0;
  onQtyEdit(event: any, contact: ItemNameList) {
    const editedQty = parseFloat(event.target.textContent) || 0;
    this.editedFinalQty = editedQty;
    contact.Qty = editedQty;
   
    if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);
      let TotalAmt = ((contact.TotalAmount) - (contact.DiscAmount));
      //Gst
      //Gst
      contact.CGSTAmt = (((TotalAmt) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((TotalAmt) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((TotalAmt) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((TotalAmt) * (contact.VatPer)) / 100);

      contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount));
    } else {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //Gst
      contact.CGSTAmt = (((contact.TotalAmount) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((contact.TotalAmount) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((contact.TotalAmount) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((contact.TotalAmount) * (contact.VatPer)) / 100);

      let totalAmt = ((contact.TotalAmount) + (contact.VatAmount));
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);

      contact.GrandTotalAmount = ((totalAmt) - (contact.DiscAmount));
    }
  }
  onRateEdit(event: any, contact: ItemNameList) {
    const editedRate = parseFloat(event.target.textContent) || 0;
    this.editedFinalRate = editedRate;
    contact.Rate = editedRate;
   
    if (this._PurchaseOrder.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);
      let TotalAmt = ((contact.TotalAmount) - (contact.DiscAmount));
      //Gst
      contact.CGSTAmt = (((TotalAmt) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((TotalAmt) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((TotalAmt) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((TotalAmt) * (contact.VatPer)) / 100);

      contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount));
    } else {
      //total amt
      contact.TotalAmount = (contact.Qty * contact.Rate);
      //Gst
      contact.CGSTAmt = (((contact.TotalAmount) * (contact.CGSTPer)) / 100);
      contact.SGSTAmt = (((contact.TotalAmount) * (contact.SGSTPer)) / 100);
      contact.IGSTAmt = (((contact.TotalAmount) * (contact.IGSTPer)) / 100);
      contact.VatAmount = (((contact.TotalAmount) * (contact.VatPer)) / 100);

      let totalAmt = ((contact.TotalAmount) + (contact.VatAmount));
      //disc
      contact.DiscAmount = (((contact.TotalAmount) * (contact.DiscPer)) / 100);

      contact.GrandTotalAmount = ((totalAmt) - (contact.DiscAmount));
    }
  }
  OnchekPurchaserateValidation() {
    let mrp = this._PurchaseOrder.userFormGroup.get('MRP').value
    if (mrp <= this.Rate) {
      Swal.fire("Enter Purchase Rate Less Than MRP");
      this._PurchaseOrder.userFormGroup.get('Rate').setValue('');
    }
  }
 
  calculateTotalAmt() {
    let Qty = this._PurchaseOrder.userFormGroup.get('Qty').value
    // if (Qty >= 100) {
    //   Swal.fire("Enter Qty less than 100");
    // }
    if (Qty > 0 && this.Rate > 0){
    if (Qty && this.Rate) {
      this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(2);
      this.NetAmount = this.TotalAmount;
      //Dicount calculation
      this.DiscAmt = (( parseFloat(this.TotalAmount) * this.Dis) / 100).toFixed(2);
      let totalamt=this.TotalAmount - this._PurchaseOrder.userFormGroup.get('DiscAmount').value;
       //GST Calculation 
     }
    }else{
      this._PurchaseOrder.userFormGroup.get('TotalAmount').setValue(0);
      this._PurchaseOrder.userFormGroup.get('DiscAmount').setValue(0);
      this._PurchaseOrder.userFormGroup.get('GSTAmount').setValue(0);
      this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(0);
    }
    this.calculateGSTperAmount();
  }
  calculateDiscperAmount() {
    let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
    if (disc >= 100) {
      Swal.fire("Enter Discount less than 100");
      
    }
    if (disc) {
      let disc = this._PurchaseOrder.userFormGroup.get('Dis').value
      this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value)).toFixed(2);
      if(this._PurchaseOrder.userFormGroup.get('Status3').value.Name == "GST After Disc")
      {
        this.DiscAmt = ((parseFloat(this.TotalAmount) * disc) / 100).toFixed(2);
        let totalamt=  (parseFloat(this.TotalAmount) - (parseFloat(this.DiscAmt))).toFixed(2);

       this.GSTAmt = ((parseFloat(totalamt) * parseFloat(this.GSTPer)) / 100).toFixed(2);

       this.NetAmount = (parseFloat(totalamt) +  parseFloat(this.GSTAmt)).toFixed(2);

      }else{
     this.DiscAmt = ((parseFloat(this.TotalAmount) * disc) / 100).toFixed(2);
     this.GSTAmt = ((parseFloat(this.TotalAmount) * parseFloat(this.GSTPer)) / 100).toFixed(2);
     let totalamt=  (parseFloat(this.TotalAmount) + (parseFloat(this.GSTAmt))).toFixed(2);

     this.NetAmount = (parseFloat(totalamt) -  parseFloat(this.DiscAmt)).toFixed(2);
      }
    }
  }

  calculateGSTperAmount() {
    
    if (this.GSTPer) {
    
      if(this._PurchaseOrder.userFormGroup.get('Status3').value.Name == "GST After Disc")
      {
        let totalamt=this.TotalAmount - this._PurchaseOrder.userFormGroup.get('DiscAmount').value

       this.GSTAmt = ((totalamt * parseFloat(this.GSTPer)) / 100).toFixed(2);
       this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.GSTAmt)).toFixed(2);
       this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);
      }else{
       this.GSTAmt = (( this.TotalAmount * parseFloat(this.GSTPer)) / 100).toFixed(2);
       this.NetAmount = (parseFloat(this.TotalAmount) - parseFloat(this._PurchaseOrder.userFormGroup.get('DiscAmount').value) + parseFloat(this.GSTAmt)).toFixed(2);
       this._PurchaseOrder.userFormGroup.get('NetAmount').setValue(this.NetAmount);
      }
    }
  }
  // let Othercharge = this._GRNList.GRNFinalForm.get("OtherCharge").value ;
  //   FinalRoundAmt =  (parseFloat(FinalRoundAmt) +  parseFloat(Othercharge));

  //   let DebitAmount = this._GRNList.GRNFinalForm.get("DebitAmount").value ;
  //   FinalRoundAmt =  (parseFloat(FinalRoundAmt) +  parseFloat(DebitAmount));

  //   let CreditAmount = this._GRNList.GRNFinalForm.get("CreditAmount").value ;
  //   FinalRoundAmt =  (parseFloat(FinalRoundAmt) -  parseFloat(CreditAmount));

  getTotalNet(element) {
    let NetAmt;
    this.FinalNetAmount = element.reduce((sum, { GrandTotalAmount }) => sum += +(GrandTotalAmount || 0), 0);
    
    let handlingCharges = this._PurchaseOrder.FinalPurchaseform.get('HandlingCharges').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) +  parseFloat(handlingCharges)).toFixed(2);

    let transportChanges = this._PurchaseOrder.FinalPurchaseform.get('TransportCharges').value;
      this.FinalNetAmount = (parseFloat(this.FinalNetAmount) +  parseFloat(transportChanges)).toFixed(2);

    let Freight = this._PurchaseOrder.FinalPurchaseform.get('Freight').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) +  parseFloat(Freight)).toFixed(2);

    let OctriAmt = this._PurchaseOrder.FinalPurchaseform.get('OctriAmount').value;
    this.FinalNetAmount = (parseFloat(this.FinalNetAmount) +  parseFloat(OctriAmt)).toFixed(2);

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
  highlight(contact) {
    this.selectedRowIndex = contact.ItemID;
  }

  OnReset() {
    //this._PurchaseOrder.PurchaseSearchGroup.reset();
    this._PurchaseOrder.userFormGroup.reset();
    //this._PurchaseOrder.PurchaseOrderHeader.reset();
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
     this.vConversionFactor= 0;
     this.vHSNcode = 0;
    this.Specification= "";
    // this.Status3List = [];       
}
 
 


  toggleDisable() {
    this.disableTextbox = !this.disableTextbox;
  }

  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';

  }

  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';

  }

  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';

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

  @ViewChild('SupplierId') SupplierId: MatSelect;
  @ViewChild('Freight1') Freight1: ElementRef;

  @ViewChild('DeliveryDate1') DeliveryDate1: ElementRef;
  @ViewChild('PaymentMode') PaymentMode: MatSelect;
  @ViewChild('Status3') Status3: MatSelect;
  @ViewChild('PaymentTerm') PaymentTerm: MatSelect;

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
  @ViewChild('OctriAmount') OctriAmount: ElementRef;
  @ViewChild('TransportCharges') TransportCharges: ElementRef;
  @ViewChild('HandlingCharges') HandlingCharges: ElementRef;
  @ViewChild('ConversionFactor') ConversionFactor: ElementRef;
  @ViewChild('HSNcode') HSNcode: ElementRef;

  public onEnterSupplier(event): void {
    if (event.which === 13) {

      // if (this.Freight) this.Freight.focus();
      this.Freight1.nativeElement.focus();
    }
  }

  public onEnterDeliveryDate(event): void {
    if (event.which === 13) {

      if (this.PaymentTerm) this.PaymentTerm.focus();
    }
  }
  public onEnterTaxNature(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
 
  public onEnterItemName(event): void {
    if (event.which === 13) {
     // if(this.ItemName) this.ItemName.focus();
      this.qty.nativeElement.focus();
    }
  }
  
  // public onEnterunit(event): void {
  //   if (event.which === 13) {
  //     //if(this.UOM) this.UOM.focus();
  //     this.qty.nativeElement.focus();
  //   }
  // }
  public onEnterQty(event): void {
    if (event.which === 13) {
      //if(this.Qty) this.Qty.focus();
      this.mrp.nativeElement.focus();
    }
  }
  public onEnterMRP(event): void {
    if (event.which === 13) {
      //if(this.MRP) this.MRP.focus();
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
      this.specification.nativeElement.focus();
    }
  }
 
  public onEnterSpecification(event): void {
   // debugger
    if (event.which === 13) {
     
      // setTimeout(() => {
        // this.add = true;
        // this.addbutton.focus();
  
      // }, 300);
    }
  }
 
  public onEnterPaymentTerm(event): void {
    if (event.which === 13) {
      //this.OctriAmount.nativeElement.focus();
      if (this.PaymentMode) this.PaymentMode.focus();
    }
  }
  public onEnterPaymentMode(event): void {
    if (event.which === 13) {
      this.Remark.nativeElement.focus();
      // if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  }
  public onEnterRemark(event): void {
    if (event.which === 13) {
      this.HandlingCharges.nativeElement.focus();
    // if (this.PaymentTerm) this.PaymentTerm.focus();
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
     this.OctriAmount.nativeElement.focus();
      // if (this.DeliveryDate) this.DeliveryDate.focus();
    }
  }

  public onEnterOctriAmount(event): void {
    if (event.which === 13) {
      this.Worrenty.nativeElement.focus();
     // this.Remark.nativeElement.focus();
    }
  }
  public onEnterWorrenty(event): void {
    if (event.which === 13) {
      //if (this.Warranty) this.Warranty.focus();
      this.OctriAmount.nativeElement.focus();
    }
  }
 
  onEdit(contact){
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

