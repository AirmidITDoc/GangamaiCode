import { DatePipe } from '@angular/common';
import { Component,Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator'; 
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { AuthenticationService } from 'app/core/services/authentication.service'; 
import Swal from 'sweetalert2';
import { PurchaseOrderService } from '../purchase-order.service'; 
import { fuseAnimations } from '@fuse/animations'; 
import { ToastrService } from 'ngx-toastr';
import { GRNFinalFormModel, ToastType } from '../../good-receiptnote/new-grn/types';
import { ItemNameList, PurchaseItemList } from '../purchase-order.component';
import { PurchaseFormModel } from './types';
import { element } from 'protractor';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-purchase-requisition',
  templateUrl: './purchase-requisition.component.html',
  styleUrls: ['./purchase-requisition.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class  PurchaseRequisitionComponent implements OnInit {
   displayedColumnspo: string[] = [ 
    'Status',
    'SupplierName',
    'IemName', 
    'Qty',
    "MRP",
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'GST',
    'GSTAmount',
    'CGSTPer',
    'CGSTAmount',
    'SGSTPer',
    'SGSTAmount',
    'IGSTPer',
    'IGSTAmount', 
    'NetAmt',
    'Action'
  ]
    displayedColumnsPRHeader: string[] = [ 
   // 'isVerify', 
    'Date', 
    'prNo',
    'storeName', 
    'addedby', 
    //'isInchargeVerifyDate',
    'comments'
  ]
    displayedColumnsPRDet: string[] = [ 
    'itemName', 
    //'Price',
    'Qty',
    'Store' 
    //'BalQty', 
  ]
    displayedColumnslastthree = [
    'supplierName',
    'receiveQty',
    'freeQty',
    'mrp',
    'rate', 
    'vatPercentage'
  ]
  userFormGroup: FormGroup;
  autocompletestore: string = "Store";
  fromDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
  toDate =  this.datePipe.transform(new Date(), "yyyy-MM-dd");
  StoreId = this.accountService.currentUserValue.user.storeId  
  status = "0"
  chargeslist:any=[];
    autocompletepaymentterm: string = "TermofPayment";
  autocompletepaymentmode: string = "PaymentMode";
    @ViewChild('LastThreeSupplier') LastThreeSupplier!: TemplateRef<any>;  

    dsPRFinalitemlist = new MatTableDataSource<ItemNameList>();
    dsPRHeader = new MatTableDataSource<PurchaseItemList>();
    dsPRdetailslist = new MatTableDataSource<PurchaseItemList>();
    dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>(); 
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatoritem: MatPaginator;
  @ViewChild(MatPaginator) paginatorFinalitem: MatPaginator;
 
  constructor(
    public _PurchaseOrder: PurchaseOrderService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    public _FormBuilder:FormBuilder,
    public dialogRef: MatDialogRef<PurchaseRequisitionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private accountService: AuthenticationService,
    public _FormvalidationserviceService:FormvalidationserviceService
  ) { }

  ngOnInit(): void {
     this.userFormGroup = this.SearchFilterForm(); 
     this.userFormGroup.markAllAsTouched(); 
     this.onChangeFirst(); 
  }
  SearchFilterForm(): FormGroup {
    return this._FormBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      FromStoreId: [this.accountService.currentUserValue.user.storeId],
      ToStoreId: [0],
      status: [0],
       Verify: [{ value: true, disabled: true }],
       HandlingCharges:[0],
       TransportCharges:[0],
      Remark: ['', [Validators.required]],
      PaymentTerm: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      PaymentMode: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    })
  }
  
  toStoreView(value) {
    if (value.value !== 0)
      this.StoreId = value.value
    else
      this.StoreId = "0" 
  }
  onChangeFirst() { 
    debugger
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
    this.StoreId = this.accountService.currentUserValue.user.storeId 
    this.GetPRHeaderlist();
  }
    GetPRHeaderlist(){
        var data =
    {
      "first": 0,
      "rows": 999,
      "sortField": "PRNo",
      "sortOrder": 0,
      "filters": [{ "fieldName": "From_Dt", "fieldValue": String(this.fromDate), "opType": "Equals" },
      { "fieldName": "To_Dt", "fieldValue": String(this.toDate), "opType": "Equals" },
      { "fieldName": "StoreId", "fieldValue": String(this.StoreId), "opType": "Equals" }, 
      { "fieldName": "IsClosed", "fieldValue": String(this.status), "opType": "Equals" }
      ],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }  
    console.log(data);
    this._PurchaseOrder.getPRHeaderList(data).subscribe(res => {
      console.log(res);
      this.dsPRHeader.data = res.data 
       this.dsPRHeader.sort = this.sort
       this.dsPRHeader.paginator = this.paginator
    });
  }
       getPRDetList(contact){
        var data =
    {
      "first": 0,
      "rows": 999,
      "sortField": "PRDetId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "PRId", "fieldValue": String(contact?.prid || 0), "opType": "Equals" } 
      ],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    } 
    console.log(data);
    this._PurchaseOrder.getPRDetList(data).subscribe(res => {
      console.log(res);
      this.dsPRdetailslist.data = res.data; 
       this.dsPRdetailslist.sort = this.sort
       this.dsPRdetailslist.paginator = this.paginatoritem


    if (this.dsPRdetailslist.data.length) { 
      res.data.forEach(item => this.openLastthreeSupplierlist(item , false));
    }  
    });
  } 
  openLastthreeSupplierlist(row, flag): void {
    if (flag) {
      this._matDialog.open(this.LastThreeSupplier, {
        width: '45%',
        height: '50%',
      })
    }
    let Data = {
      "first": 0,
      "rows": 9999,
      "sortField": "ItemId",
      "sortOrder": 0,
      "filters": [{ "fieldName": "ItemId", "fieldValue": String(row?.itemId), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": [{ "data": "string", "name": "string" }]
    }
    this._PurchaseOrder.getLastThreeItemInfo(Data).subscribe(res => {
      this.dsLastThreeItemList.data = res.data as LastThreeItemList[];
      console.log(this.dsLastThreeItemList.data)
      // Get lowest rate
      if (!flag) {
        const lowestRate = Math.min(...this.dsLastThreeItemList.data.map(i => i.rate));
        // Get full object with lowest rate
        const lowestItem = this.dsLastThreeItemList.data.find(i => i.rate === lowestRate);
        if (lowestItem) {
          this.onAddItem(row, lowestItem)
        }
      } 
    });
  }


  onAddItem(row,contact) { 
    debugger
    console.log(contact)

 if(!(row?.itemId && contact?.supplierId)) return; 

    const isDuplicate = this.dsPRFinalitemlist.data.some(item => item.itemId === row?.itemId) 
    if(isDuplicate){
       this.toastr.warning('Selected Item already added in the list', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
     return
    } 

   const qty = +row?.qty || 0;
   const rate = +contact?.rate || 0;
   const TotalAmt = qty * rate;

    this.chargeslist.push({
        SupplierId:contact?.supplierId,
        SupplierName:contact?.supplierName,
        itemId:row.itemId ,
        ItemName:row.itemName ,
        Qty:qty,
        MRP: contact.mrp || 0,
        Price:rate,
        TotalAmt:TotalAmt,
        DiscPer:0,
        DiscAmt:0,
        NetAmt:TotalAmt,
        TotalQty:row.qty,
        FreeQty:0,
        Specification:'',
        CGSTPer:  0,
        CGSTAmount:0,
        CGSTAmt: 0,
        SGSTPer: 0,
        SGSTAmount:0,
        SGSTAmt: 0,
        IGSTPer: 0, 
        IGSTAmount: 0,
        GST: 0,
        GSTAmount: 0  
    })
    this.dsPRFinalitemlist.data = [...this.chargeslist]  
    this.dsPRFinalitemlist.sort = this.sort;
    this.dsPRFinalitemlist.paginator = this.paginatorFinalitem
    console.log(this.dsPRFinalitemlist.data )
  } 
  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsPRFinalitemlist.data = [];
      this.dsPRFinalitemlist.data = this.chargeslist;
    }
    this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  } 

  getLastThreeItemInfo(ItemId) {
    var vdata = { 
      "first": 0,
      "rows": 9999,
      "sortField": "ItemId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ItemId",
          "fieldValue": String(ItemId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    } 
    this._PurchaseOrder.getLastThreeItemInfo(vdata).subscribe(data => {
      this.dsLastThreeItemList.data = data.data as LastThreeItemList[]; 
    });
  }
  vSupplierId: any;
  vsupplierName: any;
  getSelectedSupplierObj(obj) {
    // this.SupplierID = obj.SupplierId;

    console.log(obj)
    // setTimeout(() => {
    //   this._PurchaseOrder.getSupplierById(obj.value).subscribe((response) => {
    //     this.SupplierObj = response;

    //     this.vAddress = this.SupplierObj.address;
    //     this.vMobile = this.SupplierObj.mobile;
    //     this.vContact = this.SupplierObj.contactPerson;
    //     this.vGSTNo = this.SupplierObj.gstNo;
    //     this.vEmail = this.SupplierObj.email; 
    //   });

    // }, 500);


  }

 


  updatePurchaseFinalForm() {
    const form = this.userFormGroup;
    // const itemList = this.dsItemNameList.data;
    // const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    // const updatableFormValues: GRNFinalFormModel = {
    //   TotalAmt: itemList.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(2),
    //   VatAmount: itemList.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0).toFixed(2),
    //   NetPayamt: netAmount.toFixed(2),
    //   RoundingAmt: Math.round(netAmount),
    //   DiscAmount: itemList.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0).toFixed(2)
    // } as GRNFinalFormModel;

    form.patchValue({
   //   ...updatableFormValues
    });
  }


 
 
   OnSave() {
  //   if ((!this.dsItemNameList.data.length)) {
  //     this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  //   // if (this.FinalPurchaseform.invalid) {
  //   //   this.toastr.warning('please check from is invalid', 'Warning !', {
  //   //     toastClass: 'tostr-tost custom-toast-warning',
  //   //   });
  //   //   return;
  //   // }



  //   let InsertpurchaseDetailObj = [];
  //   this.dsItemNameList.data.forEach((element) => {

  //     let purchaseDetailInsertObj = {};
  //     purchaseDetailInsertObj['purchaseId'] = 0;
  //     purchaseDetailInsertObj['itemId'] = element.ItemId;
  //     purchaseDetailInsertObj['uomid'] = element.UOMID;
  //     purchaseDetailInsertObj['qty'] = element.Qty || 0;
  //     purchaseDetailInsertObj['rate'] = element.Rate || 0;
  //     purchaseDetailInsertObj['totalAmount'] = element.TotalAmount;
  //     purchaseDetailInsertObj['discAmount'] = element.DiscAmount;
  //     purchaseDetailInsertObj['discPer'] = element.DiscPer;
  //     purchaseDetailInsertObj['vatAmount'] = element.GSTAmount;
  //     purchaseDetailInsertObj['vatPer'] = element.GST;;
  //     purchaseDetailInsertObj['grandTotalAmount'] = element.NetAmount;
  //     purchaseDetailInsertObj['mrp'] = element.MRP;
  //     purchaseDetailInsertObj['specification'] = element.Specification;
  //     purchaseDetailInsertObj['cgstper'] = element.CGSTPer;
  //     purchaseDetailInsertObj['cgstamt'] = element.CGSTAmt;
  //     purchaseDetailInsertObj['sgstper'] = element.SGSTPer;
  //     purchaseDetailInsertObj['sgstamt'] = element.SGSTAmt;
  //     purchaseDetailInsertObj['igstper'] = element.IGSTPer;
  //     purchaseDetailInsertObj['igstamt'] = element.IGSTAmt;
  //     purchaseDetailInsertObj['defRate'] = element.DefRate;
  //     purchaseDetailInsertObj['vendDiscPer'] = 0;
  //     purchaseDetailInsertObj['vendDiscAm'] = 0;
  //     InsertpurchaseDetailObj.push(purchaseDetailInsertObj);
  //   });

  //   let submitData = {
  //     "purchaseId": 0,
  //     "purchaseNo": "string",
  //     "storeId": 2,
  //     "supplierId": this.userFormGroup.get('SupplierId').value || 0,
  //     "totalAmount": this.FinalTotalAmt,
  //     "discAmount": this.DiscAmount,
  //     "taxAmount": (parseFloat(this.GSTAmount)).toFixed(2),
  //     "freightAmount": this.FinalPurchaseform.get('Freight').value || 0,
  //     "octriAmount": this.FinalPurchaseform.get('OctriAmount').value || 0,
  //     "grandTotal": this.FinalNetAmount,
  //     "isclosed": true,
  //     "isVerified": true,
  //     "remarks": this.FinalPurchaseform.get('Remark').value || '',
  //     "taxId": 0,
  //     "paymentTermId": this.paymentterm,// this.FinalPurchaseform.get('PaymentTerm').value.value || 0,
  //     "modeofPayment": this.paymentmode,// this.FinalPurchaseform.get('PaymentMode').value.value || 0,
  //     "worrenty": this.FinalPurchaseform.get('Worrenty').value || 0,
  //     "roundVal": 0,
  //     "prefix": "string",
  //     "isVerifiedId": 0,
  //     "verifiedDateTime":this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'),
  //     "totCgstamt": (parseFloat(this.vCGSTAmt)).toFixed(2),
  //     "totSgstamt": (parseFloat(this.vSGSTAmt)).toFixed(2),
  //     "totIgstamt": (parseFloat(this.vIGSTAmt)).toFixed(2),
  //     "transportChanges": this.FinalPurchaseform.get('TransportCharges').value || 0,
  //     "handlingCharges": this.FinalPurchaseform.get('HandlingCharges').value || 0,
  //     "freightCharges": this.FinalPurchaseform.get('Freight').value || 0,
  //     "tPurchaseDetails": InsertpurchaseDetailObj
  //   };
  //   console.log(submitData);
  //   this._PurchaseOrder.InsertPurchaseSave(submitData).subscribe(response => {
  //     this.toastr.success(response.message);
  //     if (response) {
  //       this.viewgetPurchaseorderReportPdf(response)
  //       this._matDialog.closeAll();
  //     }

  //   });
   }
  IgstPercentage: any = 0;
  CgstPercentage: any = 0;
  SgstPercentage: any = 0; 
  getCellCalculation(contact) {

    if (contact.DefRate > 0) {
      if (contact.Rate > contact.DefRate) {
        Swal.fire("Please Check defined Supplier Rate for product ...!!!");
      }
    }
    if (contact.SGSTPer == "" || contact.SGSTPer == null || contact.SGSTPer == undefined) {
      contact.SGSTAmt = 0;
      //contact.SGSTPer = this.SgstPercentage 
    }
    if (contact.CGSTPer == "" || contact.CGSTPer == null || contact.CGSTPer == undefined) {
      contact.CGSTAmt = 0;
      //contact.CGSTPer = this.CgstPercentage 
    }
    if (contact.IGSTPer == "" || contact.IGSTPer == null || contact.IGSTPer == undefined) {
      contact.IGSTAmt = 0;
      //contact.IGSTPer = this.IgstPercentage 
    }

    if (contact.Qty > 0 && contact.Rate > 0) {

      this.IgstPercentage = contact.IGSTPer;
      this.CgstPercentage = contact.CGSTPer;
      this.SgstPercentage = contact.SGSTPer;
      if (this.userFormGroup.get('Status3').value.Name == 'GST After Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //disc
        contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
        let TotalAmt: any = 0;
        TotalAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount)).toFixed(2);
        //Gst
        contact.VatPer = (parseFloat(this.CgstPercentage) + parseFloat(this.SgstPercentage) + parseFloat(this.IgstPercentage)).toFixed(2);
        contact.CGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.CgstPercentage)) / 100).toFixed(2);
        contact.SGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.SgstPercentage)) / 100).toFixed(2);
        contact.IGSTAmt = ((parseFloat(TotalAmt) * parseFloat(this.IgstPercentage)) / 100).toFixed(2);
        contact.VatAmount = ((parseFloat(TotalAmt) * parseFloat(contact.VatPer)) / 100).toFixed(2);
        contact.GrandTotalAmount = ((TotalAmt) + (contact.VatAmount)).toFixed(2);
      }
      else if (this.userFormGroup.get('Status3').value.Name == 'GST Before Disc') {
        //total amt
        contact.TotalAmount = (contact.Qty * contact.Rate);
        //Gst
        contact.VatPer = (parseFloat(this.CgstPercentage) + parseFloat(this.SgstPercentage) + parseFloat(this.IgstPercentage)).toFixed(2);
        contact.CGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.CgstPercentage)) / 100).toFixed(2);
        contact.SGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.SgstPercentage)) / 100).toFixed(2);
        contact.IGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(this.IgstPercentage)) / 100).toFixed(2);
        contact.VatAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VatPer)) / 100).toFixed(2);
        let totalAmt: any = 0
        totalAmt = (parseFloat(contact.TotalAmount) + parseFloat(contact.VatAmount)).toFixed(2);
        //disc
        contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPer)) / 100).toFixed(2);
        contact.GrandTotalAmount = (parseFloat(totalAmt) - parseFloat(contact.DiscAmount)).toFixed(2);
      }

    }
    else {
      contact.TotalAmount = 0;
      contact.DiscAmount = 0;
      contact.CGSTAmt = 0;
      contact.SGSTAmt = 0;
      contact.IGSTAmt = 0;
      contact.VatAmount = 0;
      contact.GrandTotalAmount = 0;
    }

  }
  

  calculateTotalAmt() {
    // let Qty = this.userFormGroup.get('Qty').value
    // if (Qty > 0 && this.vRate > 0) {
    //   if (Qty && this.vRate) {
    //     this.vTotalAmount = ((this.vRate) * (this.vQty)).toFixed(2);
    //     this.vNetAmount = this.vTotalAmount;
    //     //Dicount calculation
    //     this.vDiscAmt = ((this.vTotalAmount * this.vDis) / 100).toFixed(2);
    //     let totalamt = this.vTotalAmount - this.userFormGroup.get('DiscAmount').value;
    //     //GST Calculation 
    //   }
    // } else {
    //   this.userFormGroup.get('TotalAmount').setValue(0);
    //   this.userFormGroup.get('DiscAmount').setValue(0);
    //   this.userFormGroup.get('GSTAmount').setValue(0);
    //   this.userFormGroup.get('NetAmount').setValue(0);
    // }
   
  }
  calculateDiscperAmount() {
    let disc = this.userFormGroup.get('Dis').value
    if (disc >= 100) {
      // Swal.fire("Enter Discount less than 100");
      this.toastr.warning('Enter Discount less than 100', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.userFormGroup.get('Dis').setValue(0);
    }
    // if (disc) {
    //   let disc = this.userFormGroup.get('Dis').value
    //   this.vNetAmount = ((this.vTotalAmount) - (this.userFormGroup.get('DiscAmount').value)).toFixed(2);
    //   if (this.userFormGroup.get('Status3').value.Name == "GST After Disc") {

    //     this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
    //     let totalamt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDiscAmt)).toFixed(2);

    //     this.vSGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
    //     this.vCGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
    //     this.vIGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vIGSTPer)) / 100).toFixed(2);


    //     this.vGSTAmt = ((parseFloat(totalamt) * parseFloat(this.vGSTPer)) / 100).toFixed(2);

    //     this.vNetAmount = (parseFloat(totalamt) + parseFloat(this.vGSTAmt)).toFixed(2);

    //   } else {
    //     this.vDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
    //     this.vSGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vSGSTPer)) / 100).toFixed(2);
    //     this.vCGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vCGSTPer)) / 100).toFixed(2);
    //     this.vIGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vIGSTPer)) / 100).toFixed(2);
    //     this.vGSTAmt = ((parseFloat(this.vTotalAmount) * parseFloat(this.vGSTPer)) / 100).toFixed(2);
    //     let totalamt = (parseFloat(this.vTotalAmount) + (parseFloat(this.vGSTAmt))).toFixed(2);

    //     this.vNetAmount = ((parseFloat(totalamt)) - parseFloat(this.vDiscAmt)).toFixed(2);
    //   }
    // }
  }

 

  getTotalNet(element) {
    // let NetAmt;
    // this.FinalNetAmount = element.reduce((sum, { GrandTotalAmount }) => sum += +(GrandTotalAmount), 0);

    // let handlingCharges = this.FinalPurchaseform.get('HandlingCharges').value;
    // this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(handlingCharges)).toFixed(2);

    // let transportChanges = this.FinalPurchaseform.get('TransportCharges').value;
    // this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(transportChanges)).toFixed(2);

    // let Freight = this.FinalPurchaseform.get('Freight').value;
    // this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(Freight)).toFixed(2);

    // let OctriAmt = this.FinalPurchaseform.get('OctriAmount').value;
    // this.FinalNetAmount = (parseFloat(this.FinalNetAmount) + parseFloat(OctriAmt)).toFixed(2);

    // return this.FinalNetAmount;
  }

 

 
 
  OnReset() {
    this.userFormGroup.reset(); 
    this._matDialog.closeAll();
  } 

  onClose() {
    this.dialogRef.close();
  }
 
 
  calculateTotalamt() { 
    const form = this.userFormGroup;
    // Get values with proper type conversion
    const qty = +form.get('Qty').value || 0;
    // const freeqty = +form.get('FreeQty').value || 0;
    const rate = +form.get('Rate').value || 0;
    const conversionFactor = +form.get('ConversionFactor').value || 1;
    debugger
    let totalAmount = 0;
    let netAmount = 0;

    if (qty > 0 && rate > 0) {
      totalAmount = rate * qty;
      netAmount = totalAmount;
      form.patchValue({
        TotalAmount: totalAmount,
        NetAmount: netAmount,
        // FinalTotalQty: totalQty
      });

      // Trigger discount and GST calculations
      // this.calculateDiscperAmount();
    } else {
      // Reset all calculated values
      form.patchValue({
        TotalAmount: 0,
        DiscAmount: 0,
        DiscAmount2: 0,
        CGSTAmount: 0,
        SGSTAmount: 0,
        IGSTAmount: 0,
        GSTAmount: 0,
        NetAmount: 0,
        // FinalTotalQty: totalQty
      });
    }
    this.calculateDiscountAmount(); 
  }
  calculateDiscper2Amt() { }
  // Calculate discount when discount percentage changes
  calculateDiscountAmount() {
    debugger
    const form = this.userFormGroup;
    const values = form.getRawValue() as PurchaseFormModel;

    // Get and validate discount percentage
    const discountPercentage = Number(this.userFormGroup.get("Disc").value) // Number(values.Disc || 0);
    if (discountPercentage >= 100 || discountPercentage < 0) {
      this._PurchaseOrder.showToast('Discount percentage should be between 0 and 100', ToastType.WARNING);
      form.patchValue({ Disc: 0 }); 
      return;
    }

    // Calculate discount amount
    const totalAmount = Number(values.TotalAmount || 0);
    const discountAmount = Number(((totalAmount * discountPercentage) / 100).toFixed(2));

    // Update form with new discount amount
    form.patchValue({
      DiscAmount: discountAmount
    }, { emitEvent: false });

    // // Recalculate GST after discount update 
  }
 
 
 

  resetForm() {
    this.userFormGroup.reset(); 
  } 

       // it allowed only Digit 
       keyPressDigitsOnly(event) {
           var inp = String.fromCharCode(event.keyCode);
           if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
               return true;
           } else {
               event.preventDefault();
               return false;
           }
       }
       // it allowed only Digit & decimal
       keyPressDigitDecimalOnly(event) {
           var inp = String.fromCharCode(event.keyCode);
           if (/^\d*\.?\d*$/.test(inp)) {
               return true;
           } else {
               event.preventDefault();
               return false;
           }
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
  rate:any;

  constructor(LastThreeItemList) {
    {

      this.ItemID = LastThreeItemList.ItemID || 0;
      this.ItemName = LastThreeItemList.ItemName || "";
      this.BatchNo = LastThreeItemList.BatchNo || 0;
      this.BatchExpDate = LastThreeItemList.BatchExpDate || 0;
      this.ReceiveQty = LastThreeItemList.ReceiveQty || 0;
      this.FreeQty = LastThreeItemList.FreeQty || 0;
      this.MRP = LastThreeItemList.MRP || 0;
       this.rate = LastThreeItemList.rate || 0;

    }
  }
}

