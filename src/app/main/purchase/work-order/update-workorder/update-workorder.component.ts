import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { WorkOrderService } from '../work-order.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { GRNItemResponseType, GSTType } from '../../good-receiptnote/new-grn/types';
import { PurchaseFormModel } from '../../purchase-order/update-purchaseorder/types';

@Component({
  selector: 'app-update-workorder',
  templateUrl: './update-workorder.component.html',
  styleUrls: ['./update-workorder.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateWorkorderComponent implements OnInit {
  WorkOrderStoreForm:FormGroup;
  WorkorderItemForm:FormGroup;
  WorkorderFinalForm:FormGroup;


  displayedColumnsnew:string[] = [
    'ItemName',
    'Qty',
    'Rate',
    'TotalAmount',
    'DiscPer',
    'DiscAmt',
    'Vat',
    'VatAmt',
    'NetAmt',
    //'Specification' ,
    'action'
  ];

  ItemID: any = 0;
  ItemName: any;
  screenFromString = 'Common-form';
  
  chargeslist: any = [];
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
 vItemName:any;

 autocompletestore: string = "Store";
 autocompleteSupplier: string = "SupplierMaster"
 autocompleteModeGSTType: string = "GstCalcType";

  dsItemNameList = new MatTableDataSource<ItemNameList>(); 
  dsTempItemNameList = new MatTableDataSource<ItemNameList>();

  constructor(  public _WorkOrderService:WorkOrderService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<UpdateWorkorderComponent>,
    private accountService: AuthenticationService,
    private snackBarService: SnackBarService,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
   this.WorkOrderStoreForm=this._WorkOrderService.createStoreFrom();
   this.WorkorderItemForm=this._WorkOrderService.getWorOrderItemForm();
   this.WorkorderFinalForm=this.getWorkOrderFinalForm();
    
    
    if (this.data.Obj) {
      this.registerObj=this.data.Obj;
      console.log(this.registerObj)
      this.vWorkId = this.registerObj.WOId
      this.FinalDiscAmount=this.registerObj.WODiscAmount;
      this.FinalTotalAmount=this.registerObj.WOTotalAmount;
      this.FinalNetAmount=this.registerObj.WoNetAmount;
      this.FinalVatAmount=this.registerObj.WOVatAmount;
      
      console.log(this.FinalNetAmount, this.FinalTotalAmount);
      this.getWorkOrderItemDetailList(this.registerObj);
    }
  }


    getWorkOrderFinalForm() {
    return this._formBuilder.group({
      // FinalNetAmount:[0, [Validators.required]],
      // VatAmount:[0],// [Validators.required]],
      // FinalTotalAmount:[0, [Validators.required]],
      // GSTAmount:[''],
      // FinalDiscAmount:[0, [Validators.required]],
      // Remark:[''],


    woId: 0,
    date: "Unknown Type: DateTime",
    time: "string",
    storeId: 0,
    supplierID: 0,
    FinalTotalAmount: 0,
    VatAmount: 0,
    FinalDiscAmount: 0,
    GSTAmount:0,
    FinalNetAmount: 0,
    isclosed: true,
    Remark: "string",
    addedBy: 0,
    isCancelled: true,
    isCancelledBy: 0,
    workOrderDetails:''
    });

  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getWorkOrderItemDetailList(el) {
    // var Param = {
    //   "WOId": el.WOId,
    // }
    // this._WorkOrderService.getItemListUpdates(Param).subscribe(data => {
    //   this.dsItemNameList.data = data as ItemNameList[];
    //   this.chargeslist = data as ItemNameList[];
    //   this.dsTempItemNameList.data = data as ItemNameList[];
    //   this.sIsLoading = '';
    //   console.log(this.dsItemNameList);
    // },
    //   error => {
    //     this.sIsLoading = '';
    //   });
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

  vstoreId: any = "2";
  selectChangeStore(obj: any) {
    console.log("Store:", obj);
    this.vstoreId = obj.value
  }

  
  getSelectedSupplierObj(obj) {
    // setTimeout(() => {
    //   this._PurchaseOrder.getSupplierById(obj.value).subscribe((response) => {
    //     this.SupplierObj = response;
    //     console.log(response)
    //     this.vSupplierId = this.SupplierObj.supplierId
    //     debugger
    //     this.vAddress = this.SupplierObj.address;
    //     this.vMobile = this.SupplierObj.mobile;
    //     this.vContact = this.SupplierObj.contactPerson;
    //     this.vGSTNo = this.SupplierObj.gstNo;
    //     this.vEmail = this.SupplierObj.email;
    //     this.getSupplierRate();

    //   });

    // }, 100);
  }
  onAdd() {
    //
   
    if ((this.WorkorderItemForm.get('GSTType').value == '' ||
     this.WorkorderItemForm.get('GSTType').value == null ||
      this.WorkorderItemForm.get('GSTType').value == undefined)) {
      this.toastr.warning('Please select GST type', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const isDuplicate = this.dsItemNameList.data.some(item => item.ItemId ===  this.WorkorderItemForm.get('ItemName').value.itemId);
    if (!isDuplicate) { 
    this.dsItemNameList.data = [];
    this.chargeslist = this.dsTempItemNameList.data;
    debugger
    this.chargeslist.push(
      {
        ItemID: this.WorkorderItemForm.get('ItemName').value,
        ItemName: this.WorkorderItemForm.get('ItemName').value.formattedText,
        Qty: this.WorkorderItemForm.get('Qty').value,
        Rate:this.WorkorderItemForm.get('UnitRate').value,
        TotalAmount: this.vTotalAmount || 0,
        DiscPer: this.WorkorderItemForm.get('Disc').value,
        DiscAmount: this.vDiscAmt || 0,
        VATPer: this.vGST || 0,
        VATAmount: this.vGSTAmt || 0,
        NetAmount: this.vNetAmount || 0,
       //Remark: this.vSpecification || " "
      });
      this.dsItemNameList.data = this.chargeslist;

    } else {
      this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }
    this.ResetItem();
    // this.itemid.nativeElement.focus();
   
  }

    getSelectedItem(item: GRNItemResponseType): void {
        console.log(item)
        // if (this.mock) {
        //     return;
        // }
        this.WorkorderItemForm.patchValue({
          UOMId: item.umoId,
          ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
          Qty: item.balanceQty,
          CGSTPer: item.cgstPer,
          SGSTPer: item.sgstPer,
          IGSTPer: item.igstPer,
          GST: item.cgstPer + item.sgstPer + item.igstPer,
          HSNcode: item.hsNcode
    
        });
        // this.calculateTotalamt();
      }
  

  ResetItem(){
    this.ItemID = 0;
    this.ItemName = '';
    this.WorkorderItemForm.get('ItemName').setValue('');
    this.vQty = '';
    this.vRate = '';
    this.vDis = '';
    this.vTotalAmount =0;
    this.vDiscAmt = 0;
    this.vGST ='';
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
    if (this.WorkorderItemForm.get("Qty").value > 0 && this.WorkorderItemForm.get("UnitRate").value > 0) {
      // if (this.vQty  && this.vRate) {
      this.vTotalAmount = (parseFloat(this.WorkorderItemForm.get("Qty").value) * parseInt(this.WorkorderItemForm.get("UnitRate").value)).toFixed(2);
      this.vNetAmount = parseFloat(this.vTotalAmount);
    }else{
      this.WorkorderItemForm.get('TotalAmount').setValue(0);
      this.WorkorderItemForm.get('DiscAmt').setValue(0);
      this.WorkorderItemForm.get('GSTAmount').setValue(0);
      this.WorkorderItemForm.get('NetAmount').setValue(0);
    }
    this.calculateDiscperAmount();
  // }
}
calculateDiscperAmount(){   
  let disc=this.WorkorderItemForm.get('Disc').value || 0;
    if (disc >= 100) {
      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.WorkorderItemForm.get('Disc').setValue(0);
    }
    if (disc) {
    this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) /100).toFixed(2) || 0;
    this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(2); 

    if (this.WorkorderItemForm.get('GSTType').value.Name == "GST After Disc") {

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
  // this.calculateDiscperAmount();
  this.calculateDiscperAmount();
  if (this.dsItemNameList.data.length > 0) {
    for (let i = 0; i < this.dsItemNameList.data.length; i++) {
      this.getCellCalculation(this.dsItemNameList.data[i], null);
    }
  }
 // this.calculateDiscAmount();
}

GSTTypeName=""
 IsDiscPer2: boolean = false;
  onGSTTypeChange(event: { value: number, text: string }) {
    console.log(event)
    this.GSTTypeName=event.text
    this.calculateGSTType(event.text as GSTType);
    if (event.text == "GST After TwoTime Disc") {
      this.IsDiscPer2 = true
    } else {
      this.IsDiscPer2 = false
    }
  }

  calculateGSTType(type: GSTType = GSTType.GST_BEFORE_DISC) {
  
      const form = this.WorkorderItemForm;
      const formValues = form.getRawValue() as PurchaseFormModel;
      const values = this._WorkOrderService.normalizeValues(formValues);
      const calculation = this._WorkOrderService.getGSTCalculation(formValues.GSTType || type, values);
  
      // Update form with calculated values
      form.patchValue({
        IGST: type === GSTType.GST_AFTER_DISC ? 0 : values.igst,
        CGSTAmount: calculation.cgstAmount.toFixed(2),
        SGSTAmount: calculation.sgstAmount.toFixed(2),
        IGSTAmount: calculation.igstAmount.toFixed(2),
        GSTAmount: calculation.totalGSTAmount.toFixed(2),
        NetAmount: calculation.netAmount.toFixed(2)
      }, { emitEvent: false });
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
keyPressCharater(event){
  var inp = String.fromCharCode(event.keyCode);
  if (/^\d*\.?\d*$/.test(inp)) {
    return true;
  } else {
    event.preventDefault();
    return false;
  }
}
getCellCalculation(contact, ReceiveQty) {
debugger


  if (contact.Qty > 0 && contact.Rate > 0) {
    if (this.GSTTypeName == 'GST After Disc') {

      //total amt
      contact.TotalAmount = (parseFloat(contact.Qty) * parseFloat(contact.Rate)).toFixed(2);;
      //disc
      contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);;
      let TotalAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount));
      //Gst
      contact.VATAmount = (((TotalAmt) * parseFloat(contact.VATPer)) / 100).toFixed(2);;
      contact.NetAmount = ((TotalAmt) + parseFloat(contact.VATAmount)).toFixed(2);;

    }
    else if (this.GSTTypeName == 'GST Before Disc') {
      //total amt
      contact.TotalAmount = (parseFloat(contact.Qty) * parseFloat(contact.Rate)).toFixed(2);;
      //Gst
      contact.VATAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VATPer)) / 100).toFixed(2);;
      let totalAmt = (parseFloat(contact.TotalAmount) + parseFloat(contact.VATAmount));
      //disc
      contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);;
      contact.NetAmount = ((totalAmt) - parseFloat(contact.DiscAmount)).toFixed(2);;
    }
  }
  else {
    contact.TotalAmount = 0;
    contact.DiscAmount = 0;
    contact.VATAmount = 0;
    contact.NetAmount = 0;
  }
}
getTotalNet(element) { 
  this.FinalNetAmount = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0).toFixed(2);
  return this.FinalNetAmount;
}
getTotalVAT(element) {
  this.FinalVatAmount = (element.reduce((sum, { VATAmount }) => sum += +(VATAmount || 0), 0)).toFixed(2);
  return this.FinalVatAmount;
}
getTotalDisc(element) {
  this.FinalDiscAmount = element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0).toFixed(2);
  return this.FinalDiscAmount;
}
getTotalAmt(element) {
  this.FinalTotalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
  return this.FinalTotalAmount;
}
  OnSave() {
    //
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
    if(!this.vWorkId) {
      
    // let workorderHeaderInsertObj = {};
    // workorderHeaderInsertObj['date'] = this.dateTimeObj.date;
    // workorderHeaderInsertObj['time'] = this.dateTimeObj.time;
    // workorderHeaderInsertObj['storeId'] = this.accountService.currentUserValue.storeId;
    // workorderHeaderInsertObj['supplierID'] = this.WorkorderItemForm.get('SupplierName').value.SupplierId || 0;
    // workorderHeaderInsertObj['totalAmount'] = this.FinalTotalAmount;
    // workorderHeaderInsertObj['vatAmount'] = this.FinalVatAmount;
    // workorderHeaderInsertObj['discAmount'] = this.FinalDiscAmount;
    // workorderHeaderInsertObj['netAmount'] = this.FinalNetAmount;
    // workorderHeaderInsertObj['isclosed'] = false;
    // workorderHeaderInsertObj['remarks'] = this._WorkOrderService.WorkorderFinalForm.get('Remark').value || '';
    // workorderHeaderInsertObj['addedBy'] = this.accountService.currentUserValue.userId,
    // workorderHeaderInsertObj['isCancelled'] =false,
    // workorderHeaderInsertObj['isCancelledBy'] = 0;
    // workorderHeaderInsertObj['woId'] = 0;
  
    console.log(this.WorkorderFinalForm.value)
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
      insertWorkDetailaObj['vatAmount'] = element.VATAmount;
      insertWorkDetailaObj['vatPer'] = element.VATPer;;
      insertWorkDetailaObj['netAmount'] = element.NetAmount;
      insertWorkDetailaObj['remark'] =0;
     
      InsertWorkDetailarrayObj.push(insertWorkDetailaObj);
    });
  
    this.WorkorderFinalForm.get("workOrderDetails").setValue(InsertWorkDetailarrayObj)
    // let submitData = {
    //   "workorderHeaderInsert": workorderHeaderInsertObj,
    //   "workorderDetailInsert": InsertWorkDetailarrayObj,
    // };
    console.log(this.WorkorderFinalForm.value);
    this._WorkOrderService.InsertWorkorderSave(this.WorkorderFinalForm.value).subscribe(response => {
      this.toastr.success(response.message);
      if (response) {
        this.viewgetWorkorderReportPdf(response)
        this._matDialog.closeAll();
      }
    });
  } 
  else{
    let workorderHeaderUpdateObj = {};
    workorderHeaderUpdateObj['woId'] = this.registerObj.WOId;
    workorderHeaderUpdateObj['storeId'] = this.accountService.currentUserValue.storeId;
    workorderHeaderUpdateObj['supplierID'] = this.WorkorderItemForm.get('SupplierName').value.SupplierId || 0;
    workorderHeaderUpdateObj['totalAmount'] = this.FinalTotalAmount;
    workorderHeaderUpdateObj['vatAmount'] = this.FinalVatAmount;
    workorderHeaderUpdateObj['discAmount'] = this.FinalDiscAmount;
    workorderHeaderUpdateObj['netAmount'] = this.FinalNetAmount;
    workorderHeaderUpdateObj['isclosed'] = false;
    workorderHeaderUpdateObj['remarks'] = this._WorkOrderService.WorkorderFinalForm.get('Remark').value || '';
    workorderHeaderUpdateObj['updatedBy'] = this.accountService.currentUserValue.userId;
    
    let InsertWorkDetailarrayObj = [];
    this.dsItemNameList.data.forEach((element) => {
      let insertWorkDetailaObj = {};
      insertWorkDetailaObj['woId'] = this.registerObj.WOId;
      insertWorkDetailaObj['itemName'] = element.ItemName;
      insertWorkDetailaObj['qty'] = element.Qty;
      insertWorkDetailaObj['rate'] = element.Rate;
      insertWorkDetailaObj['totalAmount'] = element.TotalAmount;
      insertWorkDetailaObj['discAmount'] = element.DiscAmount;
      insertWorkDetailaObj['discPer'] = element.DiscPer;
      insertWorkDetailaObj['vatAmount'] = element.VATAmount;
      insertWorkDetailaObj['vatPer'] = element.VATPer;
      insertWorkDetailaObj['netAmount'] = element.NetAmount;
      insertWorkDetailaObj['remark'] =  0;
     
      InsertWorkDetailarrayObj.push(insertWorkDetailaObj);
    });
  
    let delete_WorkDetailsObj = {};
    delete_WorkDetailsObj['woid'] =this.registerObj.WOId;
  
    let submitData = {
      "updateWorkOrderHeader": workorderHeaderUpdateObj,
       "delete_WorkDetails": delete_WorkDetailsObj,
      "workorderDetailInsert": InsertWorkDetailarrayObj,
    };
    console.log(submitData);
    this._WorkOrderService.WorkorderUpdate(submitData).subscribe(response => {
      this.toastr.success(response.message);
      if (response) {
        this.viewgetWorkorderReportPdf(response)
        this._matDialog.closeAll();
      }
    });
  }
  }


  
  
  viewgetWorkorderReportPdf(WOId) {
   
  }

  ItemFromReset(){
    this.WorkorderItemForm.reset({
      SupplierName:'',
      GSTType:'',
      WorkId:'',
      ItemName:'',
      ItemID:0,
      Qty:1,
      UnitRate:0,
      TotalAmount:0,
      Disc:0,
      DiscAmt:0,
      GST:0,
      GSTAmount:0,
      VatAmt:0,
      NetAmount:0,
      Specification:'',
    });
  }


  onClose(){
    this._matDialog.closeAll();
    this.WorkorderItemForm.reset();
    this.dsItemNameList.data = [];
    this.chargeslist.data = [];
  }
  OnReset() {
    this.WorkorderItemForm.reset();
    this.dsItemNameList.data = [];
    this.chargeslist.data = [];
    this.dsTempItemNameList.data =[];
  }
 
  
  selectedRowIndex: any;
  arrowUpEvent() {
    this.selectedRowIndex--;
  }

  arrowDownEvent() {
    this.selectedRowIndex++;
  }
  highlight(contact: any) {
    this.selectedRowIndex = contact;
  }
 

}
export class ItemNameList{
  ItemId:any;
  ItemName:string;
  Qty:any;
  Rate:any;
  TotalAmount:any;
  DiscAmount:any;
  DiscPer:any;
  VATPer:number;
  VATAmount:number;
  NetAmount:number;
  Remark:string;
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
      this.DiscPer = ItemNameList.DiscPer || 0;
      this.DiscAmount = ItemNameList.DiscAmount || 0;
      this.VATPer = ItemNameList.VATPer || 0;
      this.VATAmount = ItemNameList.VATAmount || 0;
      this.NetAmount = ItemNameList.NetAmount || 0;
      this.Remark =ItemNameList.Remark || "";
      this.WorkId = ItemNameList.WorkId || 0;
      this.ConstantId = ItemNameList.ConstantId || 0;
    }
  }
}
