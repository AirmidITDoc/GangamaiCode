import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

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
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatPaginator) paginatoritem: MatPaginator;


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
        const data =
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
      this.dsPORequisitionHeader.sort = this.sort
       this.dsPORequisitionHeader.paginator = this.paginator
    });
  } 
CreatePRReqForm(){
  return this._FormBuilder.group({
      prid: [0, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      prdate: new Date(),
      prtime: new Date(),
      unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      priority: [false],
      storeId: [this.accountService.currentUserValue.user.storeId, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      comments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isclosed: [false],   
      isverify: [false],  
      isVerifyById:[0, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      isVerifyDateTime:['1900-01-01'],
      isCancelled: [false], 
      isCancelledBy:[0, [this._FormvalidationserviceService.onlyNumberValidator()]], 
      isCancelledDateTime:['1900-01-01'],
      tPrdetails: this._FormBuilder.array([]),
      tPr: this._FormBuilder.array([])
  }) 
}
CreatePoReqDet(item:any){
  return this._FormBuilder.group({
    prdetId: [0 , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    fromStoreId: [item?.fromStoreId , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    toStoreId: [item?.toStoreId , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    itemId: [item?.itemId , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    qty: [item?.qty , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    prrequestHeaderId: [item?.prrequestHeaderId , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    prrequestDetId: [item?.prrequestDetId , [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
  })
}
CreatePoReqHeader(item:any){
  return this._FormBuilder.group({
    prrequestHeaderId: [item?.prrequestHeaderId, [this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]] 
  })
} 
  get poReqDetArray(): FormArray {
    return this.POReqSaveform.get('tPrdetails') as FormArray;
  }
  get poReqHeaderArray(): FormArray {
    return this.POReqSaveform.get('tPr') as FormArray;
  }
  OnSave(){
    debugger
    const formattedTime = this.datePipe.transform(new Date(), 'hh:mm');
    const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd'); 

    const prdate = formattedDate + 'T00:00:00';
    const prtime = formattedDate + 'T' + formattedTime;
   

      if(!this.dsPoReqitemlist.data.length){
        this.toastr.warning('PO list is empty please check', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return
      }
      if(this.POReqSaveform.valid){ 
        this.POReqSaveform.get('prdate').setValue(prdate)
        this.POReqSaveform.get('prtime').setValue(prtime)
        this.POReqSaveform.get('comments').setValue(this.userFormGroup.get('Remark').value || '') 

        this.poReqDetArray.clear();
        this.poReqHeaderArray.clear();
        this.dsPoReqitemlist.data.forEach(element=>{
        this.poReqDetArray.push(this.CreatePoReqDet(element)) 
        this.poReqHeaderArray.push(this.CreatePoReqHeader(element)) 
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
 
      deleteTableRow(row: ItemNameList) {
        debugger
          const index = this.SelectedList.indexOf(row);
            if (index > -1) {
              this.SelectedList.splice(index, 1);
            } 
      this.dsPoReqitemlist.data = this.SelectedList
      this._PurchaseOrderService.showToast('Record Deleted Successfully.', ToastType.SUCCESS);
    }  
// tableElementChecked(event: any, row: any) {
//   debugger;  
//      this.getPOReqDetList(row);  
//    setTimeout(() => {
//   if (this.dsPORequisitiondet.data.length) { 
//     this.dsPORequisitiondet.data.forEach(item => { 
//       if (event.checked) { 
//         const exists = this.SelectedList.find(x =>  x.itemId == item.itemId); 
//         if (!exists) {
//         //  this.SelectedList.push(item);
//            this.SelectedList.push({
//                 fromStoreId:row?.fromStoreId || 1,
//                 toStoreId:row?.fromStoreId || 2,
//                 itemName:item?.itemName || '',
//                 itemId: item?.itemId,
//                 qty: item?.qty || 1,
//                 prrequestHeaderId:item?.purchaseRequisitionId || 0,
//                 prrequestDetId :item?.purchaseRequisitionDetId || 0
//               }) 
//         } else {
//           this.toastr.warning(  'Selected item already added in the list',  'Warning!',
//             { toastClass: 'tostr-tost custom-toast-warning' }
//           );
//         } 
//       } else { 
//         const index = this.SelectedList.findIndex(x => x.itemId === item.itemId);
//         if (index > -1) {
//           this.SelectedList.splice(index, 1);
//         } 
//       } 
//     }); 
//   } 
//   this.dsPoReqitemlist.data = this.SelectedList;
//     }, 1000);
// }
     getPOReqDetList(contact,addItem=false){
        const data =
    {
      "first": 0,
      "rows": 999,
      "sortField": "PurchaseRequisitionId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "PurchaseRequisitionId", "fieldValue": String(contact?.purchaseRequisitionId || 0), "opType": "Equals" } 
      ],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    } 
    console.log(data);
    this._PurchaseOrderService.getPORequisitionDetList(data).subscribe(res => {
      console.log(data);
      this.dsPORequisitiondet.data = res.data; 
      this.dsPORequisitiondet.sort = this.sort
      this.dsPORequisitiondet.paginator = this.paginatoritem
debugger
  if (addItem) {
      res.data.forEach(item => this.getaddItem(true, contact, item));
    } else {
      res.data.forEach(item => this.getaddItem(false, contact, item));
    }
    });
  }
getaddItem(Additem,row,item){
  debugger 
  if (!this.dsPORequisitiondet.data.length) return;

  if (Additem) { 
      const exists = this.SelectedList.find(x => x.itemId == item.itemId && x.prrequestHeaderId === row.purchaseRequisitionId);
      if (!exists) {
        //  this.SelectedList.push(item);
        this.SelectedList.push({
          fromStoreId: row?.fromStoreId || 1,
          toStoreId: row?.fromStoreId || 2,
          itemName: item?.itemName || '',
          itemId: item?.itemId,
          qty: item?.qty || 1,
          prrequestHeaderId: item?.purchaseRequisitionId || 0,
          prrequestDetId: item?.purchaseRequisitionDetId || 0
        })
      } else {
        this.toastr.warning('Selected item already added in the list', 'Warning!',
          { toastClass: 'tostr-tost custom-toast-warning' }
        );
      } 
  } else { 
        const index = this.SelectedList.findIndex(x =>  x.itemId === item.itemId &&   x.prrequestHeaderId === row.purchaseRequisitionId);
      if (index > -1) {
        this.SelectedList.splice(index, 1);
      } 
  }
  this.dsPoReqitemlist.data = [...this.SelectedList];
}
tableElementChecked(event, element) {  
  debugger
  if (event.checked) {
    this.selection.select(element); 
    this.getPOReqDetList(element,true) 
  } else {
    this.selection.deselect(element);  
     this.getPOReqDetList(element,false) 
  }  
}
 
 SelectedList: any = [];
 selection = new SelectionModel<PurchaseItemList>(true, []);  
  masterToggle() {
    debugger
    const selectableRows = this.dsPORequisitionHeader.data;
  
    if (this.isAllSelected()) {
      this.selection.clear();
      this.SelectedList = [];  
      this.dsPoReqitemlist.data = [];
    } else { 
      selectableRows.forEach(row => {
        this.selection.select(row);
        this.getPOReqDetList(row,true);  
      });
    }    
  }
  
 
 isAllSelected() { 
  debugger
  const numSelected = this.selection.selected.length;
  const numRows = this.dsPORequisitionHeader.data.length; 
  return numSelected === numRows && numRows > 0;

}
 isSomeSelected() { 
  debugger
  const numSelected = this.selection.selected.length;
  const numRows = this.dsPORequisitionHeader.data.length; 
  return numSelected > 0 && numSelected < numRows;

}
}
