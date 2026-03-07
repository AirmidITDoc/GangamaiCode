import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { PurchaseOrderService } from '../../purchase-order.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Overlay, ToastrService } from 'ngx-toastr';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { DatePipe } from '@angular/common';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ItemNameList, PurchaseItemList } from '../../purchase-order.component';
import { ToastType } from '../types';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { element } from 'protractor';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-purchase-requisitionlist',
  templateUrl: './purchase-requisitionlist.component.html',
  styleUrls: ['./purchase-requisitionlist.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PurchaseRequisitionlistComponent implements OnInit {
  displayedColumnspo: string[] = [ 
    'IemName', 
    //'Price',
    'Qty',
    'Action'
  ]
    displayedColumnsPOReqHeader: string[] = [ 
    'isVerify', 
    'Date', 
    'purchaseRequisitionNo',
    'Store',  
    'isVerifyDet',
    'addedby',
    'comments'
  ]
    displayedColumnsPoReqDet: string[] = [ 
    'itemName', 
    //'Price',
    'Qty'
  
    //'BalQty', 
  ]
  userFormGroup: FormGroup;
  POReqSaveform: FormGroup;
  autocompletestore: string = "Store";
  fromDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
  toDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
  fromStore = "0"
  toStore = "0"
  status = this.accountService.currentUserValue.user.storeId 
  Verify = "1"
  chargeslist:any=[];


    dsPoReqitemlist = new MatTableDataSource<ItemNameList>();
    dsPORequisitionHeader = new MatTableDataSource<PurchaseItemList>();
    dsPORequisitiondet = new MatTableDataSource<PurchaseItemList>();


  constructor(
    public _PurchaseOrderService: PurchaseOrderService, 
    public _matDialog: MatDialog,
    public toastr: ToastrService, 
    private commonService: PrintserviceService, 
    private accountService: AuthenticationService,
    public datePipe: DatePipe, 
    public _whatsppService: WhatsAppEmailService,
    public permissionService: PagePermissionService,
    private overlay: Overlay,
    public _FormBuilder:FormBuilder,
    public _FormvalidationserviceService:FormvalidationserviceService,
    public dialogRef: MatDialogRef<PurchaseRequisitionlistComponent>,
  ) { }

  ngOnInit(): void {
    this.userFormGroup = this.SearchFilterForm();
    this.POReqSaveform = this.CreatePRReqForm();
    console.log(this.accountService.currentUserValue.user) 
    this.onChangeFirst();
  }
  SearchFilterForm(): FormGroup {
    return this._FormBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      FromStoreId: [],
      ToStoreId: [this.accountService.currentUserValue.user.storeId],
      status: [0],
       Verify: [{ value: true 
        //, disabled: true
         }],
         Remark:['']
    })
  }
 
  toStoreView(value) {
    if (value.value !== 0)
      this.toStore = value.value
    else
      this.toStore = "0" 
  }
    FromStoreView(value) {
    if (value.value !== 0)
      this.fromStore = value.value
    else
      this.fromStore = "0" 
  }
  onChangeFirst() { 
    if (this.userFormGroup.get('status').value == true) {
      this.status = "1"
    } else {
      this.status = "0"
    }
    // if (this.userFormGroup.get('Verify').value == true) {
    //   this.Verify = "1"
    // } else {
    //   this.Verify = "0"
    // }
    this.fromDate = this.datePipe.transform(this.userFormGroup.get('startdate').value,'yyyy-MM-dd') || '1900-01-01',
    this.toDate =  this.datePipe.transform(this.userFormGroup.get('enddate').value,'yyyy-MM-dd') || '1900-01-01',
    this.toStore = this.accountService.currentUserValue.user.storeId 
    this.GetReqisitionlist();
  }
  GetReqisitionlist(){
        var data =
    {
      "first": 0,
      "rows": 999,
      "sortField": "RegNo",
      "sortOrder": 0,
      "filters": [{ "fieldName": "From_Dt", "fieldValue": String(this.fromDate), "opType": "Equals" },
      { "fieldName": "To_Dt", "fieldValue": String(this.toDate), "opType": "Equals" },
      { "fieldName": "FromStoreId", "fieldValue": String(this.fromStore), "opType": "Equals" },
      { "fieldName": "ToStoreId", "fieldValue": String(this.toStore), "opType": "Equals" },
      { "fieldName": "IsVerify", "fieldValue": String(this.Verify), "opType": "Equals" },
      { "fieldName": "IsClosed", "fieldValue": String(this.status), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    } 
 
    console.log(data);
    this._PurchaseOrderService.getPORequisitionHeaderList(data).subscribe(res => {
      console.log(data);
      this.dsPORequisitionHeader.data = res.data
     
    });
  }


  AddPOItem(contact){   
    const iscekDuplicate = this.dsPoReqitemlist.data.some(item => item.itemName == contact.itemName) 
    if (!iscekDuplicate) {
      this.dsPoReqitemlist.data = [];
      debugger
      this.chargeslist.push(
        {
       //   ItemID: this.IndentForm.get("ItemName").value.itemId || 0,
          itemName:contact.itemName || '',
          qty: contact.qty 
        });
      this.dsPoReqitemlist.data = this.chargeslist 
    } else {
      this.toastr.warning('Selected Item already added in the list ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } 
  } 

CreatePRReqForm(){
  return this._FormBuilder.group({
      prid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      prdate: new Date(),
      prtime: new Date(),
      unitId: [this.accountService.currentUserValue.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      priority: [false],
      storeId: [this.accountService.currentUserValue.storeId, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      comments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isclosed: [false],   
      isverify: [false],  
      isVerifyById:[0, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      isVerifyDateTime:['1900-01-01'],
      isCancelled: [false], 
      isCancelledBy:[0, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      isCancelledDateTime:['1900-01-01'],
      tPrdetails:[],
      tPr:[] 
  }) 
}
CreatePoReqDet(item:any){
  return this._FormBuilder.group({
    prdetId: [item?.sadaa , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    fromStoreId: [item?.sadaa , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    toStoreId: [item?.sadaa , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    itemId: [item?.sadaa , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    qty: [item?.sadaa , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    prrequestHeaderId: [item?.sadaa , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    prrequestDetId: [item?.sadaa , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  })
}
CreatePoReqHeader(item:any){
  return this._FormBuilder.group({
    prrequestHeaderId: [item?.asassa, [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]] 
  })
} 
  get poReqDetArray(): FormArray {
    return this.POReqSaveform.get('tPrdetails') as FormArray;
  }
  get poReqHeaderArray(): FormArray {
    return this.POReqSaveform.get('tPr') as FormArray;
  }
  OnSave(){
    const formattedTime = this.datePipe.transform(new Date(), 'hh:mm');
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    const FormattedDateTime = formattedDate + ' ' + formattedTime 

      if(!this.dsPoReqitemlist.data.length){
        this.toastr.warning('PO list is empty please check', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
      }
      if(this.POReqSaveform.valid){ 
        this.POReqSaveform.get('prdate').setValue(formattedDate)
        this.POReqSaveform.get('prtime').setValue(FormattedDateTime)
        this.POReqSaveform.get('comments').setValue(this.userFormGroup.get('Remark').value || '') 

        this.poReqDetArray.clear();
        this.poReqHeaderArray.clear();
        this.dsPoReqitemlist.data.forEach(element=>{
        this.poReqDetArray.push(this.CreatePoReqDet(element)) 
        this.poReqDetArray.push(this.CreatePoReqHeader(element)) 
        }) 

        this._PurchaseOrderService.SavePR(this.POReqSaveform.value).subscribe(res=>{
          this.onClose();
        })
      }

  }
  onClose(){
    this.dsPORequisitionHeader.data = [];
    this.dsPORequisitiondet.data = [];
    this.dsPoReqitemlist.data = [];
    this.userFormGroup.reset();
    this.POReqSaveform.reset(); 
    this.fromDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.toDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.status = "0" 
    this.Verify = "0"  
    this.fromStore = this.accountService.currentUserValue.user.storeId; 
    this.dialogRef.close();
  }

     getPOReqDetList(contact){
        var data =
    {
      "first": 0,
      "rows": 999,
      "sortField": "PurchaseRequisitionId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "PurchaseRequisitionId", "fieldValue": String(contact.purchaseRequisitionId), "opType": "Equals" } 
      ],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    } 
    console.log(data);
    this._PurchaseOrderService.getPORequisitionDetList(data).subscribe(res => {
      console.log(data);
      this.dsPORequisitiondet.data = res.data; 
    });
  }
      deleteTableRow(row: ItemNameList) {
          const index = this.SelectedList.indexOf(row);
            if (index > -1) {
              this.SelectedList.splice(index, 1);
            } 
      this.dsPoReqitemlist.data = this.SelectedList
      this._PurchaseOrderService.showToast('Record Deleted Successfully.', ToastType.SUCCESS);
    }  
tableElementChecked(event: any, row: any) {
  debugger; 
  this.getPOReqDetList(row); 
  if (this.dsPORequisitiondet.data.length) { 
    this.dsPORequisitiondet.data.forEach(item => { 
      if (event.checked) { 
        const exists = this.SelectedList.find(x =>  x.itemName == item.itemName); 
        if (!exists) {
          this.SelectedList.push(item);
        } else {
          this.toastr.warning(  'Selected item already added in the list',  'Warning!',
            { toastClass: 'tostr-tost custom-toast-warning' }
          );
        } 
      } else { 
        const index = this.SelectedList.findIndex(x => x.itemName === item.itemName);
        if (index > -1) {
          this.SelectedList.splice(index, 1);
        } 
      } 
    }); 
  } 
  this.dsPoReqitemlist.data = this.SelectedList;
}
  SelectedList: any = [];
 selection = new SelectionModel<ItemNameList>(true, []);  
  masterToggle() {
    const selectableRows = this.dsPORequisitiondet.data;
  
    if (this.isAllSelected()) {
      this.selection.clear();
      this.SelectedList = [];  
    } else {
      this.selection.clear();
      this.SelectedList = [];    
  
      selectableRows.forEach(row => {
        // this.selection.select(row);
        this.SelectedList.push(row);   
      });
    } 
  }
  
    isAllSelected() { 
      const selectableRows = this.dsPORequisitiondet.data 
      const numSelected = this.selection.selected.length;
      const numRows = selectableRows.length; 
      return numRows > 0 && numSelected === numRows;
    } 
    isSomeSelected() { 
         const selectableRows = this.dsPORequisitiondet.data 
        return this.selection.selected.length > 0 &&
        this.selection.selected.length < selectableRows.length;
    }
 
}
