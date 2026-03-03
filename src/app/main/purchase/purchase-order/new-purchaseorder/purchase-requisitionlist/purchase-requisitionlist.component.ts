import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    'fromStore',
    'toStore', 
    'addedby', 
    'isInchargeVerifyDate',
    'comments'
  ]
    displayedColumnsPoReqDet: string[] = [ 
    'itemName', 
    //'Price',
    'Qty'
  
    //'BalQty', 
  ]
  userFormGroup: FormGroup;
  autocompletestore: string = "Store";
  fromDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
  toDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
  fromStore = this.accountService.currentUserValue.user.storeId 
  toStore = "0"
  status = "0"
   Verify = "0"
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
    public dialogRef: MatDialogRef<PurchaseRequisitionlistComponent>,
  ) { }

  ngOnInit(): void {
    this.userFormGroup = this.SearchFilterForm();
    console.log(this.accountService.currentUserValue.user) 
    this.onChangeFirst();
  }
  SearchFilterForm(): FormGroup {
    return this._FormBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      FromStoreId: [this.accountService.currentUserValue.user.storeId],
      ToStoreId: [0],
      status: [0],
       Verify: [{ value: true 
        //, disabled: true
         }]
    })
  }

    fromStoreView(value) {
    if (value.value !== 0)
      this.fromStore = value.value
    else
      this.fromStore = "0"
    // this.onChangeFirst();
  }

  toStoreView(value) {
    if (value.value !== 0)
      this.toStore = value.value
    else
      this.toStore = "0" 
  }
  onChangeFirst() { 
    if (this.userFormGroup.get('status').value == true) {
      this.status = "1"
    } else {
      this.status = "0"
    }
    if (this.userFormGroup.get('Verify').value == true) {
      this.Verify = "1"
    } else {
      this.Verify = "0"
    }
    this.fromDate = this.datePipe.transform(this.userFormGroup.get('startdate').value,'yyyy-MM-dd') || '1900-01-01',
    this.toDate =  this.datePipe.transform(this.userFormGroup.get('enddate').value,'yyyy-MM-dd') || '1900-01-01',
    this.fromStore = this.accountService.currentUserValue.user.storeId 
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

    deleteTableRow(row: ItemNameList) {
      this.dsPoReqitemlist.data = this.dsPoReqitemlist.data.filter(item => item !== row);
      this.chargeslist = this.dsPoReqitemlist.data
      this._PurchaseOrderService.showToast('Record Deleted Successfully.', ToastType.SUCCESS);
    }
     
  Save(){

  }
  onClose(){
    this.dialogRef.close();
  }
}
