import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { WorkOrderService } from '../work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-update-workorder',
  templateUrl: './update-workorder.component.html',
  styleUrls: ['./update-workorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateWorkorderComponent implements OnInit {
   
  displayedColumnsnew:string[] = [
    'ItemName',
    'Qty',
    'Rate',
    'TotalAmount',
    'Disc',
    'DiscAmt',
    'Vat',
    'VatAmt',
    'NetAmt',
    'Specification' ,
    'action'
  ];

  ItemID: any = 0;
  ItemName: any;
  screenFromString = 'admission-form';
  isItemIdSelected: boolean = false;
  chargeslist: any = [];
 filteredOptions: any;
 noOptionFound: boolean = false;
 sIsLoading: string = '';
 isLoading = true;
 StoreList:any=[];
 SupplierList:any=[];
 FinalNetAmount: any;
 FinalTotalAmount: any;
 FinalDiscAmount: any;
 FinalVatAmount:any;
 Remark:any;
 vQty:any;
 vRate:any;
 vDis:any;
 vTotalAmount:any;
 vDiscAmt:any;
 vGST:any;
 vGSTAmt:any;
 vNetAmount:any;
 vSpecification:any;
 isSupplierIdSelected:boolean=false;
 dateTimeObj: any;
 filteredOptionssupplier:any;
 noOptionFoundsupplier:any;
 GSTType:any;
 GSTTypeList:any;
 registerObj:any;
 vSupplierId:any;
 vWorkId:any;

  dsItemNameList = new MatTableDataSource<ItemNameList>();
 

  constructor(  public _WorkOrderService:WorkOrderService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _formBuilder: FormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    private snackBarService: SnackBarService,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
    if (this.data.Obj) {
      this.registerObj=this.data.Obj;
      console.log(this.registerObj)
      this.vWorkId = this.registerObj.WorkId
      this.FinalDiscAmount=this.registerObj.WODiscAmount;
      this.FinalTotalAmount=this.registerObj.WOTotalAmount;
      this.FinalNetAmount=this.registerObj.WoNetAmount;
      this.FinalVatAmount=this.registerObj.WOVatAmount;
      this.getSuppliernameList();
      console.log(this.FinalNetAmount, this.FinalTotalAmount);
    }
    
    this.gePharStoreList();
    this.getGSTtypeList();
  }

 
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getGSTtypeList() {
    var vdata = {
      'ConstanyType': 'GST_CALC_TYPE',
    }
    this._WorkOrderService.getGSTtypeList(vdata).subscribe(data => {
      this.GSTTypeList = data;
      this._WorkOrderService.WorkorderItemForm.get('GSTType').setValue(this.GSTTypeList[0]);
      if (this.data) {
        const toSelectConstantId = this.GSTTypeList.find(c => c.ConstantId == this.registerObj.ConstantId);
        this._WorkOrderService.WorkorderItemForm.get('GSTType').setValue(toSelectConstantId);
        this._WorkOrderService.WorkorderItemForm.get('GSTType').setValue(this.GSTTypeList[0]);
      }
    });
  }
  gePharStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    this._WorkOrderService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._WorkOrderService.WorkOrderStoreForm.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  vsupplierName:any;
  getSuppliernameList() {
    if(this.vSupplierId){
      this.vsupplierName = this._WorkOrderService.WorkorderItemForm.get('SupplierName').value ;
     }
     else{
       this.vsupplierName = this.registerObj.SupplierName;
     }
    var m_data = {
      'SupplierName': `${this.vsupplierName}%`
    }
    this._WorkOrderService.getSupplierList(m_data).subscribe(data => {
      this.filteredOptionssupplier = data;
      if (this.filteredOptionssupplier.length == 0) {
        this.noOptionFoundsupplier = true;
      } else {
        this.noOptionFoundsupplier = false;
      }
      if (this.registerObj.SupplierId > 0) { 
        const toSelectSUpplierId = this.filteredOptionssupplier.find(c => c.SupplierId == this.registerObj.SupplierId);
        this._WorkOrderService.WorkorderItemForm.get('SupplierName').setValue(toSelectSUpplierId);
        console.log(toSelectSUpplierId)
        this._WorkOrderService.WorkorderItemForm.get('SupplierName').setValue(this.filteredOptionssupplier[0]);
      }
    })
  }
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  getPharItemList() {
    var m_data = {
      "ItemName": `${this._WorkOrderService.WorkorderItemForm.get('ItemName').value}%`,
      "StoreId": this._WorkOrderService.WorkOrderStoreForm.get('StoreId').value.storeid || 0
    }
    if (this._WorkOrderService.WorkorderItemForm.get('ItemName').value.length >= 1) {
      this._WorkOrderService.getItemList(m_data).subscribe(data => {
        this.filteredOptions = data;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
  getOptionText(option) {
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  }
  getSelectedObj(obj) {
    console.log(obj);
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.vQty = ''
    this.vRate = '';
    this.vTotalAmount = 0;
    this.vDis = '';
    this.vDiscAmt = 0;
    this.vGST = obj.VatPercentage;
    this.vGSTAmt = 0;
    this.vNetAmount = 0;
  }

  onAdd() {
    //debugger
    if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
      this.toastr.warning('Please enter a Qty', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vRate == '' || this.vRate == null || this.vRate == undefined)) {
      this.toastr.warning('Please enter a Rate', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = this.dsItemNameList.data.some(item => item.ItemId ===  this._WorkOrderService.WorkorderItemForm.get('ItemName').value);
    if (!isDuplicate) { 
    this.dsItemNameList.data = [];
    this.chargeslist.push(
      {
        ItemID: this.ItemID,
        ItemName: this._WorkOrderService.WorkorderItemForm.get('ItemName').value.ItemName || '',
        Qty: this.vQty || 0,
        Rate: this.vRate || 0,
        TotalAmount: this.vTotalAmount || 0,
        Disc: this.vDis || 0,
        DiscAmt: this.vDiscAmt || 0,
        Vat: this.vGST || 0,
        VatAmt: this.vGSTAmt || 0,
        NetAmt: this.vNetAmount || 0,
        Specification: this.vSpecification || '',
      });
      this.dsItemNameList.data = this.chargeslist;

    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ResetItem();
    this.itemid.nativeElement.focus();
   
  }
  ResetItem(){
    this.ItemID = 0;
    this.ItemName = '';
    this._WorkOrderService.WorkorderItemForm.get('ItemName').setValue('');
    this.vQty = 0;
    this.vRate = 0;
    this.vDis = 0;
    this.vTotalAmount =0;
    this.vDiscAmt = 0;
    this.vGST =0;
    this.vGSTAmt = 0;
    this.vNetAmount =0;
    this.vSpecification = '';
  }
  deleteTableRow(element){
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
  calculateTotalAmount() {
    if (this.vQty > 0 && this.vRate > 0) {
      if (this.vQty  && this.vRate) {
      this.vTotalAmount = (parseFloat(this.vRate) * parseInt(this.vQty)).toFixed(2);
      this.vNetAmount = parseFloat(this.vTotalAmount);
    }else{
      this._WorkOrderService.WorkorderItemForm.get('TotalAmount').setValue(0);
      this._WorkOrderService.WorkorderItemForm.get('DiscAmt').setValue(0);
      this._WorkOrderService.WorkorderItemForm.get('GSTAmount').setValue(0);
      this._WorkOrderService.WorkorderItemForm.get('NetAmount').setValue(0);
    }
    this.calculateDiscperAmount();
  }
}
calculateDiscperAmount(){   
  let disc=this._WorkOrderService.WorkorderItemForm.get('Disc').value || 0;
    if (disc >= 100) {
      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this._WorkOrderService.WorkorderItemForm.get('Disc').setValue(0);
    }
    if (disc) {
    this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) /100).toFixed(2);
    this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(2); 

    if (this._WorkOrderService.WorkorderItemForm.get('GSTType').value.Name == "GST After Disc") {

      this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
      let totalamt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(2);

      this.vGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vGST)) / 100).toFixed(2);

      this.vNetAmount = (parseFloat(totalamt) + parseFloat(this.vGSTAmt)).toFixed(2);

    } else {
      this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
      this.vGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vGST)) / 100).toFixed(2);
      let totalamt = (parseFloat(this.vTotalAmount) + (parseFloat(this.vGSTAmt))).toFixed(2);
      this.vNetAmount = ((parseFloat(totalamt)) - parseFloat(this.vDiscAmt)).toFixed(2);
    }
  }
}
finalCalculation() {
  this.calculateTotalAmount();
  this.calculateDiscperAmount();
  this.calculateDiscperAmount();
  if (this.dsItemNameList.data.length > 0) {
    for (let i = 0; i < this.dsItemNameList.data.length; i++) {
      //this.getCellCalculation(this.dsItemNameList.data[i], null);
    }
  }
 // this.calculateDiscAmount();
}
getTotalNet(element) { 
  this.FinalNetAmount = element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0).toFixed(2);
  return this.FinalNetAmount;
}
getTotalVAT(element) {
  this.FinalVatAmount = (element.reduce((sum, { VatAmt }) => sum += +(VatAmt || 0), 0)).toFixed(2);
  return this.FinalVatAmount;
}
getTotalDisc(element) {
  this.FinalDiscAmount = element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0).toFixed(2);
  return this.FinalDiscAmount;
}
getTotalAmt(element) {
  this.FinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
  return this.FinalTotalAmount;
}
  OnSave() {
    //debugger
    if ((!this.dsItemNameList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._WorkOrderService.WorkorderFinalForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vSupplierId == '' || this.vSupplierId == null || this.vSupplierId == undefined)) {
      this.toastr.warning('Please enter a SupplierName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this._WorkOrderService.WorkorderItemForm.get('WorkId').value) {
    let workorderHeaderInsertObj = {};
    workorderHeaderInsertObj['date'] = this.dateTimeObj.date;
    workorderHeaderInsertObj['time'] = this.dateTimeObj.time;
    workorderHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    workorderHeaderInsertObj['supplierID'] = this._WorkOrderService.WorkorderItemForm.get('SupplierName').value.SupplierId || 0;
    workorderHeaderInsertObj['totalAmount'] = this.FinalTotalAmount;
    workorderHeaderInsertObj['vatAmount'] = this.FinalVatAmount;
    workorderHeaderInsertObj['discAmount'] = this.FinalDiscAmount;
    workorderHeaderInsertObj['netAmount'] = this.FinalNetAmount;
    workorderHeaderInsertObj['isclosed'] = false;
    workorderHeaderInsertObj['remarks'] = this._WorkOrderService.WorkorderFinalForm.get('Remark').value || '';
    workorderHeaderInsertObj['addedBy'] = this.accountService.currentUserValue.user.id,
    workorderHeaderInsertObj['isCancelled'] =false,
    workorderHeaderInsertObj['isCancelledBy'] = 0;
    workorderHeaderInsertObj['woId'] = 0;
  
    let InsertWorkDetailarrayObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let insertWorkDetailaObj = {};
      insertWorkDetailaObj['woId'] = 0;
      insertWorkDetailaObj['itemName'] = element.ItemName;
      insertWorkDetailaObj['qty'] = element.Qty;
      insertWorkDetailaObj['rate'] = element.Rate;
      insertWorkDetailaObj['totalAmount'] = element.TotalAmount;
      insertWorkDetailaObj['discAmount'] = element.DiscAmt;
      insertWorkDetailaObj['discPer'] = element.Disc;
      insertWorkDetailaObj['vatAmount'] = element.VatAmt;
      insertWorkDetailaObj['vatPer'] = element.Vat;;
      insertWorkDetailaObj['netAmount'] = element.NetAmt;
      insertWorkDetailaObj['remark'] = element.Specification;
     
      InsertWorkDetailarrayObj.push(insertWorkDetailaObj);
    });
  
    let submitData = {
      "workorderHeaderInsert": workorderHeaderInsertObj,
      "workorderDetailInsert": InsertWorkDetailarrayObj,
    };
    console.log(submitData);
    this._WorkOrderService.InsertWorkorderSave(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record New WorkOrder Data Saved Successfully.', 'Saved !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.OnReset();
        this._matDialog.closeAll();
        this.Savebtn=true;
      } else {
        this.toastr.error('New WorkOrder Data not Saved !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New WorkOrder Data not Saved !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  } 
  else{
    let workorderHeaderUpdateObj = {};
    workorderHeaderUpdateObj['woId'] = this.registerObj.WorkId;
    workorderHeaderUpdateObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    workorderHeaderUpdateObj['supplierID'] = this._WorkOrderService.myFormGroup.get('SupplierName').value.SupplierId || 0;
    workorderHeaderUpdateObj['totalAmount'] = this.FinalTotalAmount;
    workorderHeaderUpdateObj['vatAmount'] = this.FinalVatAmount;
    workorderHeaderUpdateObj['discAmount'] = this.FinalDiscAmount;
    workorderHeaderUpdateObj['netAmount'] = this.FinalNetAmount;
    workorderHeaderUpdateObj['isclosed'] = false;
    workorderHeaderUpdateObj['remarks'] = this._WorkOrderService.WorkorderFinalForm.get('Remark').value || '';
    workorderHeaderUpdateObj['updatedBy'] = this.accountService.currentUserValue.user.id;
    
    let InsertWorkDetailarrayObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let insertWorkDetailaObj = {};
      insertWorkDetailaObj['woId'] = 0;
      insertWorkDetailaObj['itemName'] = element.ItemName;
      insertWorkDetailaObj['qty'] = element.Qty;
      insertWorkDetailaObj['rate'] = element.Rate;
      insertWorkDetailaObj['totalAmount'] = element.TotalAmount;
      insertWorkDetailaObj['discAmount'] = element.DiscAmt;
      insertWorkDetailaObj['discPer'] = element.Disc;
      insertWorkDetailaObj['vatAmount'] = element.VatAmt;
      insertWorkDetailaObj['vatPer'] = element.Vat;;
      insertWorkDetailaObj['netAmount'] = element.NetAmt;
      insertWorkDetailaObj['remark'] = element.Specification;
     
      InsertWorkDetailarrayObj.push(insertWorkDetailaObj);
    });
  
    let delete_WorkDetailsObj = {};
    delete_WorkDetailsObj['woid'] = 0;
  
    let submitData = {
      "updateWorkOrderHeader": workorderHeaderUpdateObj,
       "delete_WorkDetails": delete_WorkDetailsObj,
      "workorderDetailInsert": InsertWorkDetailarrayObj,
    };
    console.log(submitData);
    this._WorkOrderService.WorkorderUpdate(submitData).subscribe(response => {
      if (response) {
        this.toastr.success('Record New WorkOrder Data Updated Successfully.', 'Updated !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
        this.OnReset();
        this._matDialog.closeAll();
        this.Savebtn=true;
      } else {
        this.toastr.error('New WorkOrder Data not Updated !, Please check error..', 'Error !', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    }, error => {
      this.toastr.error('New WorkOrder Data not Updated !, Please check API error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    });
  }
  }


  
 

  onClose(){
    this._matDialog.closeAll();
    this._WorkOrderService.WorkorderItemForm.reset();
    this.dsItemNameList.data = [];
    this.chargeslist.data = [];
  }
  OnReset() {
    this._WorkOrderService.WorkorderItemForm.reset();
    this.dsItemNameList.data = [];
    this.chargeslist.data = [];
  }
 
  addbtn:boolean=true;
  Savebtn:boolean=false;
  @ViewChild('SupplierId') SupplierId: MatSelect;
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('disc') disc: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('specification') specification: ElementRef;

  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  @ViewChild('Remark1') Remark1: ElementRef;
  
  public onEnterSupplier(event): void {
    if (event.which === 13) {
      this.itemid.nativeElement.focus();
    }
  }
  public onEnterItemName(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
      this.addbtn = true;
    }
  }
  public onEnterQty(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
    }
  }
  public onEnterRate(event): void {
    if (event.which === 13) {
      this.disc.nativeElement.focus();
     // this._WorkOrderService.WorkorderItemForm.get('Disc').setValue('');
    }
  }
  public onEnterDis(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
      this.addbtn=false;
    }
  }
  public onEnterGST(event): void {
    if (event.which === 13) {
      this.specification.nativeElement.focus();
    }
  } 
  public onEnterSpecification(event): void {
    if (event.which === 13) {
      this.add = true;
      this.addbutton.focus();
    }
  }
  public onEnterRemark(event): void {
    if (event.which === 13) {
      //this.FinalDiscAmount1.nativeElement.focus();
    }
  }
  // focusNext(nextElementId: string): void {
  //   const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
  //   if (nextElement) {
  //     nextElement.focus();
  //   }
  // }

}
export class ItemNameList{
  ItemId:any;
  ItemName:string;
  Qty:any;
  Rate:any;
  TotalAmount:any;
  Disc:any;
  DiscAmt:any;
  Vat:number;
  VatAmt:number;
  NetAmt:number;
  Specification:number;
  WorkId:any;
  ConstantId:any;
  WORemark:any;
  WODiscAmount:any;
  WOTotalAmount:any;
  WoNetAmount:any;
  WOVatAmount:any;
  
  constructor(ItemNameList){
    {
      this.ItemName = ItemNameList.ItemName || "";
      this.ItemId = ItemNameList.ItemId || 0;
      this.Qty = ItemNameList.Qty || 0;
      this.Rate = ItemNameList.Rate || 0;
      this.TotalAmount = ItemNameList.TotalAmount || 0;
      this.Disc = ItemNameList.Disc || 0;
      this.DiscAmt = ItemNameList.DiscAmt || 0;
      this.Vat = ItemNameList.Vat || 0;
      this.VatAmt = ItemNameList.VatAmt || 0;
      this.NetAmt = ItemNameList.NetAmt || 0;
      this.Specification =ItemNameList.Specification || "";
      this.WorkId = ItemNameList.WorkId || 0;
      this.ConstantId = ItemNameList.ConstantId || 0;
    }
  }
}
