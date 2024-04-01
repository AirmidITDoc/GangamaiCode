import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ItemNameList } from '../../purchase-order/purchase-order.component';
import { MatTableDataSource } from '@angular/material/table';
import { WorkOrderService } from '../work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatSelect } from '@angular/material/select';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-workorder',
  templateUrl: './update-workorder.component.html',
  styleUrls: ['./update-workorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateWorkorderComponent implements OnInit {
  [x: string]: any;
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
  Qty: any;
  UMO: any;
  NetAmount: any;
  Rate: any;
  TotalAmount: any;
  Specification: any;
  VatPercentage: any;
  GSTAmount: any;
  screenFromString = 'admission-form';
  UOM: any;
  isItemIdSelected: boolean = false;
  chargeslist: any = [];

  Dis: any;
 DiscAmt: any;
 VatAmount: any;
 CgstPer: any;
 CGSTAmt: any;
 SgstPer: any;
 SGSTAmt: any;
 IgstPer: any;
 IGSTAmt: any;
 GSTPer: any;
 GSTAmt: any;
 MRP: any;
 VatAmt: any;
 GST: any;
 Disc: any;
 DisAmount: any;
 registerObj = new ItemNameList({});
 filteredOptions: any;
 noOptionFound: boolean = false;
 

 sIsLoading: string = '';
 isLoading = true;
 StoreList:any=[];
 SupplierList:any=[];

 FinalNetAmount: any;
 FinalTotalAmount: any;
 FinalDiscAmount: any;
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
   //debugger
    if (this.data.chkNewWorkorder==2) {
      
      this.registerObj=this.data.Obj;
      // this.getOldPurchaseOrder( this.registerObj.PurchaseID);    
      //    this.setDropdownObjs1();

      this.FinalDiscAmount=this.registerObj.WODiscAmount;
      this.FinalTotalAmount=this.registerObj.WOTotalAmount;
      this.FinalNetAmount=this.registerObj.WoNetAmount;
      this.VatAmount=this.registerObj.WOVatAmount;

      console.log(this.FinalNetAmount, this.FinalTotalAmount);
    }
    
    this.gePharStoreList();
    this.getSuppliernameList();
  }


  gePharStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    console.log(vdata);
    this._WorkOrderService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
    
      this._WorkOrderService.WorkOrderStoreForm.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getSuppliernameList() {
    this._WorkOrderService.getSupplierList().subscribe(data => {
      this.SupplierList = data;
      console.log(this.SupplierList);
      
      this._WorkOrderService.NewWorkForm.get('SupplierName').setValue(this.SupplierList[0]);
    });
  }
  focusNext(nextElementId: string): void {
    const nextElement = this.elementRef.nativeElement.querySelector(`#${nextElementId}`);
    if (nextElement) {
      nextElement.focus();
    }
  }
  onClose(){
this._matDialog.closeAll();

  }
  
  OnSave() {
    //debugger
    if(this.data.chkNewWorkorder==1) {
    let workorderHeaderInsertObj = {};
    workorderHeaderInsertObj['purchaseDate'] = this.dateTimeObj.date;
    workorderHeaderInsertObj['purchaseTime'] = this.dateTimeObj.time;
    workorderHeaderInsertObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    workorderHeaderInsertObj['supplierID'] = this._WorkOrderService.myFormGroup.get('SupplierName').value.SupplierId || 0;
    workorderHeaderInsertObj['totalAmount'] = this.FinalTotalAmount;
    workorderHeaderInsertObj['discAmount'] = this.FinalDiscAmount;
    workorderHeaderInsertObj['vatAmount'] = 0;
    workorderHeaderInsertObj['netAmount'] = this.FinalNetAmount;
    workorderHeaderInsertObj['iscloseisclosedd'] = false;
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
      insertWorkDetailaObj['discAmount'] = element.DiscAmount;
      insertWorkDetailaObj['discPer'] = element.DiscPer;
      insertWorkDetailaObj['vatAmount'] = element.vatAmount;
      insertWorkDetailaObj['vatPer'] = element.vatPer;;
      insertWorkDetailaObj['netAmount'] = element.NetAmount;
      insertWorkDetailaObj['remark'] = element.Remark;
     
      InsertWorkDetailarrayObj.push(insertWorkDetailaObj);
    });
  
    let submitData = {
      "workorderHeaderInsert": workorderHeaderInsertObj,
      "workorderDetailInsert": InsertWorkDetailarrayObj,
    };
    console.log(submitData);
    this._WorkOrderService.InsertWorkorderSave(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Save Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            // this._matDialog.closeAll();
            this.OnReset();
  
          }
        });
      } else {
        Swal.fire('Error !', 'Purchase not saved', 'error');
      }
      // this.isLoading = '';
    });
  }
  else{
  
    let workorderHeaderUpdateObj = {};
   
    workorderHeaderUpdateObj['storeId'] = this.accountService.currentUserValue.user.storeId;
    workorderHeaderUpdateObj['supplierID'] = this._WorkOrderService.myFormGroup.get('SupplierName').value.SupplierId || 0;
    workorderHeaderUpdateObj['totalAmount'] = this.FinalTotalAmount;
    workorderHeaderUpdateObj['discAmount'] = this.FinalDiscAmount;
    workorderHeaderUpdateObj['vatAmount'] = 0;
    workorderHeaderUpdateObj['netAmount'] = this.FinalNetAmount;
    workorderHeaderUpdateObj['iscloseisclosedd'] = false;
    workorderHeaderUpdateObj['remarks'] = this._WorkOrderService.WorkorderFinalForm.get('Remark').value || '';
    workorderHeaderUpdateObj['addedBy'] = this.accountService.currentUserValue.user.id,
    workorderHeaderUpdateObj['isCancelled'] =false,
    workorderHeaderUpdateObj['isCancelledBy'] = 0;
    workorderHeaderUpdateObj['woId'] = this.registerObj.WorkId;
  
    
    let delete_WorkDetailsObj = {};
    delete_WorkDetailsObj['woid'] = 0;
  
    let InsertWorkDetailarrayObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let insertWorkDetailaObj = {};
      insertWorkDetailaObj['woId'] = 0;
      insertWorkDetailaObj['itemName'] = element.ItemName;
      insertWorkDetailaObj['qty'] = element.Qty;
      insertWorkDetailaObj['rate'] = element.Rate;
      insertWorkDetailaObj['totalAmount'] = element.TotalAmount;
      insertWorkDetailaObj['discAmount'] = element.DiscAmount;
      insertWorkDetailaObj['discPer'] = element.DiscPer;
      insertWorkDetailaObj['vatAmount'] = element.vatAmount;
      insertWorkDetailaObj['vatPer'] = element.vatPer;;
      insertWorkDetailaObj['netAmount'] = element.NetAmount;
      insertWorkDetailaObj['remark'] = element.Remark;
     
      InsertWorkDetailarrayObj.push(insertWorkDetailaObj);
    });
  
    let submitData = {
      "updateWorkOrderHeader": workorderHeaderUpdateObj,
       "delete_WorkDetails": delete_WorkDetailsObj,
      "workorderDetailInsert": InsertWorkDetailarrayObj,
    };
    console.log(submitData);
    this._WorkOrderService.WorkorderUpdate(submitData).subscribe(response => {
      if (response) {
        Swal.fire('Update Purchase Order!', 'Record Generated Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            let m = response;
            this._matDialog.closeAll();
            this.OnReset()
          }
        });
      } else {
        Swal.fire('Error !', 'Purchase not Updated', 'error');
      }
      // this.isLoading = '';
    });
  }
  }



  getSelectedObj(obj) {
    
    this.ItemID = obj.ItemId;
    this.ItemName = obj.ItemName;
    this.Qty = 1; //obj.BalanceQty;
  
    if (this.Qty > 0) {
      this.UOM = obj.UOM;
      this.Rate = obj.PurchaseRate;
      this.TotalAmount = (parseInt(this.Qty) * parseFloat(this.Rate)).toFixed(4);
      this.NetAmount = this.TotalAmount;
      this.VatPercentage = obj.VatPercentage;
      this.GSTPer = obj.GSTPer;
      this.GSTAmount = 0;
      this.Specification = obj.Specification;
    }
    this.qty.nativeElement.focus();
  }
  getOptionText(option) {
  
    if (!option)
      return '';
    return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
  
  }
  
         
  getPharItemList() {
    var m_data = {
      "ItemName": `${this._WorkOrderService.WorkorderItemForm.get('ItemName').value}%`,
      "StoreId": this._WorkOrderService.NewWorkForm.get('StoreId').value.storeid || 0
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
  

  getTotalNet(element) {
    
    this.FinalNetAmount = element.reduce((sum, { NetAmt }) => sum += +(NetAmt || 0), 0);
    return this.FinalNetAmount;
  }

  getTotalVAT(element) {

    this.VatAmount = (element.reduce((sum, { VatAmt }) => sum += +(VatAmt || 0), 0)).toFixed(2);
    return this.VatAmount;

  }

  getTotalDisc(element) {

    this.FinalDiscAmount = element.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0);
    return this.FinalDiscAmount;
  }

  getTotalAmt(element) {

    this.FinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
    return this.FinalTotalAmount;
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
      this.toastr.warning('Please enter a MRP', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = this.dsItemNameList.data.some(item => item.ItemId ===  this._WorkOrderService.WorkorderItemForm.get('ItemName').value.ItemID);
    if (!isDuplicate) { 
    this.dsItemNameList.data = [];
    this.chargeslist.push(
      {
        ItemID: this.ItemID,
        ItemName: this._WorkOrderService.WorkorderItemForm.get('ItemName').value.ItemName || '',
        Qty: this.Qty || 0,
        Rate: this.Rate || 0,
        TotalAmount: this.TotalAmount,
        Dis: this.Dis || 0,
        DiscAmt: this.DiscAmt,
        Vat: this.VatPercentage,
        VatAmt: this.VatAmt,
        NetAmt: this.NetAmount,
        Specification: this.Specification || '',
  
      });
      this.dsItemNameList.data = this.chargeslist;

    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ResetItem();
    this._WorkOrderService.WorkorderItemForm.reset();
    this.itemid.nativeElement.focus();
    this.add = false;
  }
  ResetItem(){
    this.ItemID = 0;
    this.ItemName = '';
    this.vQty = 0;
    this.vRate = 0;
    this.vDis = 0;
    this.vTotalAmount =0;
    this.vDiscAmt = 0;
    this.vGST =0;
    this.vGSTAmt = 0;
    this.vNetAmount =0;
    this.vSpecification = 0;
  }
  calculateGSTperAmount() {
  
    if (this.GST) {
    
      this.GSTAmt = ((parseFloat (this.TotalAmount) * parseFloat(this.GST)) / 100).toFixed(2);
      this.NetAmount =(parseFloat(this.TotalAmount) + parseFloat(this.GSTAmt)).toFixed(2);
      this._WorkOrderService.WorkorderItemForm.get('NetAmount').setValue(this.NetAmount);
   
    }
  }
  
  calculateGSTAmount() 
  {
    
    if (this.GSTAmt > 0) {
     
     this.NetAmount= (parseFloat(this.NetAmount) + parseFloat(this.GSTAmt)).toFixed(2);
     this._WorkOrderService.WorkorderItemForm.get('NetAmount').setValue(this.NetAmount);
    }else if(this.GST==0){
      this.GSTAmt=0;
    }
  }
  
  calculateDiscAmount() {
    if (this.Dis) {
      this.NetAmount =  (parseFloat(this.NetAmount) - parseFloat(this.DisAmount)).toFixed(2);
    }
  }
  
  calculateDiscperAmount(){
    
    if (this.Dis) {
      let dis=this._WorkOrderService.WorkorderItemForm.get('Disc').value
      this.DiscAmt = (parseFloat(dis) * parseFloat(this.NetAmount) /100).toFixed(2);
      // this.DiscAmount =  DiscAmt
      this.NetAmount = this.NetAmount - this.DiscAmt;
  
    }
  }

  calculateVatAmount(){
    if (this.VatAmt) {
    
      this.VatAmt = ((parseFloat (this.NetAmount) * parseFloat(this.VatAmt)) / 100).toFixed(2);
      this.NetAmount =(parseFloat(this.NetAmount) + parseFloat(this.VatAmt)).toFixed(2);
      this._WorkOrderService.WorkorderItemForm.get('NetAmount').setValue(this.NetAmount);
   
    }
  }


  
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  
  // calculatePersc(){
  //   if (this.Disc)
  //   {
  //     this.Disc =Math.round(this.TotalAmount * parseInt(this.DisAmount)) / 100;
  //     this.NetAmount= this.TotalAmount - this.Disc;
  //     this._GRNService.userFormGroup.get('calculateDiscAmount').disable();    
  //   }
  // }
  
  
  
  @ViewChild('SupplierId') SupplierId: MatSelect;
  
  @ViewChild('itemid') itemid: ElementRef;
  @ViewChild('qty') qty: ElementRef;
  @ViewChild('rate') rate: ElementRef;
  @ViewChild('dis') dis: ElementRef;
  @ViewChild('gst') gst: ElementRef;
  @ViewChild('Vat') Vat: ElementRef;
  @ViewChild('specification') specification: ElementRef;
  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  
  @ViewChild('Remark1') Remark1: ElementRef;
  @ViewChild('FinalDiscAmount1') FinalDiscAmount1: ElementRef;
  
  @ViewChild('GSTAmount1') GSTAmount1: ElementRef;
  @ViewChild('FinalTotalAmount1') FinalTotalAmount1: ElementRef;
  @ViewChild('VatAmount1') VatAmount1 :ElementRef;
  @ViewChild('FinalNetAmount1') FinalNetAmount1 :ElementRef;
  
  
  public onEnterSupplier(event): void {
    if (event.which === 13) {
  
      // if (this.Freight) this.Freight.focus();
      this.itemid.nativeElement.focus();
    }
  }
  public onEnterItemName(event): void {
    if (event.which === 13) {
      this.qty.nativeElement.focus();
    }
  }
  public onEnterQty(event): void {
    if (event.which === 13) {
      this.rate.nativeElement.focus();
    }
  }
  public onEnterRate(event): void {
    if (event.which === 13) {
      this.dis.nativeElement.focus();
    }
  }
  public onEnterDis(event): void {
    if (event.which === 13) {
      this.gst.nativeElement.focus();
    }
  }
  public onEnterGST(event): void {
    if (event.which === 13) {
      this.Vat.nativeElement.focus();
    }
  }
  
  public onEnterVat(event): void {
 
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
      this.FinalDiscAmount1.nativeElement.focus();
    }
  }
  
  public onEnterDiscAmount(event): void {
    if (event.which === 13) {
      this.GSTAmount1.nativeElement.focus();
    }
  }
  
  
  public onEnterGSTAmount(event): void {
    if (event.which === 13) {
      this.FinalTotalAmount1.nativeElement.focus();
    }
  }
  
  public onEnterTotalAmount(event): void {
    if (event.which === 13) {
      this.VatAmount1.nativeElement.focus();
    }
  }
  
  public onEnterVatAmount(event): void {
    if (event.which === 13) {
      this.Specification.nativeElement.focus();
    }
  }
  

  
  calculateTotalAmount() {
    //debugger
    if (this.Rate && this.Qty) {
      this.TotalAmount = (parseFloat(this.Rate) * parseInt(this.Qty)).toFixed(4);
      this.NetAmount = this.TotalAmount;
      // this.calculatePersc();
    }
  }
  
  
  OnReset() {
    this._WorkOrderService.NewWorkForm.reset();
    this._WorkOrderService.WorkorderItemForm.reset();
    // this._WorkOrderService.PurchaseStoreform.reset();
    // this._WorkOrderService.FinalPurchaseform.reset();
    this.dsItemNameList.data = [];
  }


}
