import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { ToastType } from '../../good-receiptnote/new-grn/types';
import { ItemNameList, PurchaseItemList } from '../purchase-order.component';
import { PurchaseOrderService } from '../purchase-order.service';
import { PurchaseFormModel } from './types';

@Component({
    selector: 'app-purchase-requisition',
    templateUrl: './purchase-requisition.component.html',
    styleUrls: ['./purchase-requisition.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PurchaseRequisitionComponent implements OnInit {
    displayedColumnspo: string[] = [
        'Status',
        'SupplierName',
        'IemName',
        'UMOName',
        'ConversionFactor',
        'Qty',
        'FreeQty',
        'TotalQty',
        "MRP",
        'Price',
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
        'Specification',
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
    PRTOPoSaveForm: FormGroup
    autocompletestore: string = "Store";
    fromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    StoreId = this.accountService.currentUserValue.user.storeId
    status = "0"
    chargeslist: any = [];
    autocompletepaymentterm: string = "TermofPayment";
    autocompletepaymentmode: string = "PaymentMode";
    dialogRefSupplier!: MatDialogRef<any>;
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
        public _FormBuilder: FormBuilder,
        private dialog: MatDialog,
        public dialogRef: MatDialogRef<PurchaseRequisitionComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        public _FormvalidationserviceService: FormvalidationserviceService
    ) { }

    ngOnInit(): void {
        this.userFormGroup = this.SearchFilterForm();
        this.userFormGroup.markAllAsTouched();
        this.onChangeFirst();

        this.PRTOPoSaveForm = this.CreatePRToPoSaveForm();
    }
    SearchFilterForm(): FormGroup {
        return this._FormBuilder.group({
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            FromStoreId: [this.accountService.currentUserValue.user.storeId],
            ToStoreId: [0],
            status: [0],
            Verify: [{ value: true, disabled: true }],
            HandlingCharges: [0],
            TransportCharges: [0],
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
        this.fromDate = this.datePipe.transform(this.userFormGroup.get('startdate').value, 'yyyy-MM-dd') || '1900-01-01',
            this.toDate = this.datePipe.transform(this.userFormGroup.get('enddate').value, 'yyyy-MM-dd') || '1900-01-01',
            this.StoreId = this.accountService.currentUserValue.user.storeId
        this.GetPRHeaderlist();
    }
    GetPRHeaderlist() {
        const data =
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
    getPRDetList(contact) {
        const data =
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
                res.data.forEach(item => this.openLastthreeSupplierlist(item, false));
            }
        });
    }
    selectedRow: any;
    openLastthreeSupplierlist(row, flag): void {
        this.selectedRow = ''
        if (flag) {
            this.selectedRow = row;
            this.dialogRefSupplier = this._matDialog.open(this.LastThreeSupplier, {
                width: '45%',
                height: '50%',
            })
        }
        const Data = {
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


    onAddItem(row, contact) {
        debugger
        console.log(contact)

        if (!(row?.itemId && contact?.supplierId)) return;

        const isDuplicate = this.dsPRFinalitemlist.data.some(item => item.itemId === row?.itemId)
        if (isDuplicate) {
            this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }

        const qty = +row?.qty || 0;
        const rate = +contact?.rate || 0;
        const gstPer = +contact?.vatPercentage || 0;
        const TotalAmt = qty * rate;
        const GSTAmt = (rate * gstPer / 100) * qty;
        const CGSTPer = gstPer / 2;
        const SGSTPer = gstPer / 2;
        const CGSTAmt = (rate * CGSTPer / 100) * qty;
        const SGSTAmt = (rate * SGSTPer / 100) * qty;


        this.chargeslist.push({
            SupplierId: contact?.supplierId,
            SupplierName: contact?.supplierName,
            itemId: row.itemId,
            ItemName: row.itemName,
            UMOName: contact?.unitofMeasurementName || '',
            UMOId: contact?.uomid || 0,
            Qty: qty,
            FreeQty: 0,
            ConversionFactor: 1,
            MRP: contact.mrp || 0,
            Price: rate,
            TotalAmt: TotalAmt,
            DiscPer: 0,
            DiscAmt: 0,
            NetAmt: TotalAmt,
            TotalQty: qty,
            Specification: '',
            CGSTPer: CGSTPer || 0,
            CGSTAmount: CGSTAmt || 0,
            SGSTPer: SGSTPer || 0,
            SGSTAmount: SGSTAmt || 0,
            IGSTPer: 0,
            IGSTAmount: 0,
            GSTPer: contact?.vatPercentage || 0,
            GSTAmount: GSTAmt || 0,
            PRId: row?.prid || 0
        })
        this.dsPRFinalitemlist.data = [...this.chargeslist]
        this.dsPRFinalitemlist.sort = this.sort;
        this.dsPRFinalitemlist.paginator = this.paginatorFinalitem
        console.log(this.dsPRFinalitemlist.data)
    }
    deleteTableRow(element) {
        const index = this.chargeslist.indexOf(element);
        if (index >= 0) {
            this.chargeslist.splice(index, 1);
            this.dsPRFinalitemlist.data = [];
            this.dsPRFinalitemlist.data = this.chargeslist;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }


    //selected supplier wise calculation
    getselectedSupplierDet(contact) {
        if (!this.selectedRow) return;

        const index = this.chargeslist.findIndex(item => item.itemId === this.selectedRow?.itemId);

        if (index !== -1) {
            const qty = +this.chargeslist[index].Qty || 0;
            const rate = +contact?.rate || 0;
            const mrp = +contact?.mrp || 0;
            const gstPer = +contact?.vatPercentage || 0;

            const totalAmt = qty * rate;
            const CGSTPer = gstPer / 2;
            const SGSTPer = gstPer / 2;
            const CGSTAmt = (rate * CGSTPer / 100) * qty;
            const SGSTAmt = (rate * SGSTPer / 100) * qty;
            const GSTAmt = CGSTAmt + SGSTAmt;
            const netAmt = totalAmt + GSTAmt;

            this.chargeslist[index] = {
                ...this.chargeslist[index],

                SupplierId: contact?.supplierId,
                SupplierName: contact?.supplierName,
                MRP: mrp,
                Price: rate,
                TotalAmt: totalAmt,
                CGSTPer: CGSTPer,
                CGSTAmount: CGSTAmt,
                SGSTPer: SGSTPer,
                SGSTAmount: SGSTAmt,
                GSTPer: gstPer,
                GSTAmount: GSTAmt,
                NetAmt: netAmt,
                UMOId: contact?.uomid || 0,
                UMOName: contact?.unitofMeasurementName || '',
            };
        }
        this.dsPRFinalitemlist.data = [...this.chargeslist];
        this.oncloseSupplierlist();
        this.selectedRow = '';
    }

    oncloseSupplierlist() {
        if (this.dialogRefSupplier) {
            this.dialogRefSupplier.close();
        }
    }

    getCellCalculation(contact) {
        debugger
        if ((contact?.Qty || 0) <= 0 || (contact?.Price || 0) <= 0) {
            this.toastr.warning('Values must be greater than 0', 'Warning !',
                { toastClass: 'tostr-tost custom-toast-warning' });

        }

        const qty = Number(contact?.Qty) || 0;
        const freeQty = Number(contact?.FreeQty) || 0;
        const conversionFactor = Number(contact?.ConversionFactor) || 1;
        const totalQty = ((qty + freeQty) * conversionFactor);
        const rate = Number(contact?.Price) || 0;
        const discPer = Number(contact?.DiscPer) || 0;
        const cgstPer = Number(contact?.CGSTPer) || 0;
        const sgstPer = Number(contact?.SGSTPer) || 0;
        const igstPer = Number(contact?.IGSTPer) || 0;
        const TotalAmt = qty * rate;
        const DisAmount = (TotalAmt * discPer / 100);
        const NetAmount = TotalAmt - DisAmount
        const CGSTAmt = (NetAmount * cgstPer / 100);
        const SGSTAmt = (NetAmount * sgstPer / 100);
        const IGSTAmt = (NetAmount * igstPer / 100);
        const gstPer = cgstPer + sgstPer + igstPer
        const gstAmount = CGSTAmt + SGSTAmt + IGSTAmt;
        const GrossAmt = NetAmount + gstAmount

        contact.TotalQty = totalQty,
            contact.TotalAmt = TotalAmt,
            contact.CGSTAmount = CGSTAmt,
            contact.SGSTAmount = SGSTAmt,
            contact.IGSTAmount = IGSTAmt,
            contact.GSTPer = gstPer,
            contact.GSTAmount = gstAmount,
            contact.NetAmt = GrossAmt

    } 

    CreatePRToHeader(item: any) {
        const formattedTime = this.datePipe.transform(new Date(), 'hh:mm');
        const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const prdate = formattedDate + 'T00:00:00';
        const prtime = formattedDate + 'T' + formattedTime;
        const formValue = this.userFormGroup.value

        return this._FormBuilder.group({
            purchaseId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            purchaseNo: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
            purchaseDate: prdate,
            purchaseTime: prtime,
            isPurchaseRequisitionId:[item?.PRId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isProceedToApproval:[false],
            storeId: [this.accountService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            supplierId: [item?.SupplierId || 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            totalAmount: [item?.TotalAmt.toFixed(2), [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            discAmount: [item?.DiscAmt.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            taxAmount: [parseFloat(item?.GSTAmount).toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            freightAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            octriAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            grandTotal: [item?.NetAmt.toFixed(2), [this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isclosed: [false],
            isVerified: [false],
            remarks: [formValue?.Remark || '', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            taxId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentTermId: [formValue?.PaymentTerm || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            modeofPayment: [formValue?.PaymentMode || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            worrenty: ['', this._FormvalidationserviceService.allowEmptyStringValidatorOnly()],
            roundVal: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            prefix: ['PUR', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            isVerifiedId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            totCgstamt: [(parseFloat(item?.CGSTAmount).toFixed(2)) || 0, this._FormvalidationserviceService.onlyNumberValidator()],
            totSgstamt: [(parseFloat(item?.SGSTAmount).toFixed(2)) || 0, this._FormvalidationserviceService.onlyNumberValidator()],
            totIgstamt: [(parseFloat(item?.IGSTAmount).toFixed(2)) || 0, this._FormvalidationserviceService.onlyNumberValidator()],
            transportChanges: [formValue?.TransportCharges || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            handlingCharges: [formValue?.HandlingCharges || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            freightCharges: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            isCancelled: [false],
            tPurchaseDetails: this._FormBuilder.array([]),
            tpr: this._FormBuilder.array([])
        });
    }
    // Purchase Save Details Form
    createPurchasedetailForm(item: any = {}): FormGroup {
        return this._FormBuilder.group({
            purchaseId: [item.PurchaseID || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [item.itemId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            uomid: [item.UMOId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            qty: [item.Qty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            freeQty: [item.FreeQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            rate: [item.Price || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totalAmount: [item.TotalAmt.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discAmount: [item.DiscAmt.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discPer: [item.DiscPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            vatAmount: [item.GSTAmount.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            vatPer: [item.GSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            grandTotalAmount: [item.NetAmt.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            mrp: [item.MRP || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            specification: [item.Specification || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            cgstper: [item.CGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            cgstamt: [item.CGSTAmount.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            sgstper: [item.SGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            sgstamt: [item.SGSTAmount.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            igstper: [item.IGSTPer || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            igstamt: [item.IGSTAmount.toFixed(2) || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            totalQty: [item.TotalQty || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            defRate: [item.DefRate || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            vendDiscPer: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            vendDiscAm: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
        });
    }
    CreatePRHeader(item:any = {}): FormGroup{
          return this._FormBuilder.group({
             prid: [item?.PRId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
          })
    }

    CreatePRToPoSaveForm() {
        return this._FormBuilder.group({
            tPurchaseHeader: this._FormBuilder.array([]), 
        });
    }
    get purchaseHeaderArray(): FormArray {
        return this.PRTOPoSaveForm.get('tPurchaseHeader') as FormArray;
    }

    onsave1() {
        debugger

        if (!this.isValidForm()) {
            //  Swal.fire('Please enter valid table data.');
            return;
        }

        // if (this.userFormGroup.valid) {
        //   this.purchaseHeaderArray.clear();
        //   this.dsPRFinalitemlist.data.forEach(element => {


        //     const header = this.CreatePRToHeader(element);
        //     const detailsArray = header.get('tPurchaseDetails') as FormArray;
        //     detailsArray.push(this.createPurchasedetailForm(element));
        //     this.purchaseHeaderArray.push(header)
        //   })

        //   console.log(this.PRTOPoSaveForm.value.tPurchaseHeader)
        //   this._PurchaseOrder.InsertPRtoPurchaseSave(this.PRTOPoSaveForm.value.tPurchaseHeader).subscribe(response => {
        //     if (response) {
        //       this._matDialog.closeAll();
        //     }
        //   });
        // } else {
        //   let invalidFields = [];
        //   if (this.userFormGroup.invalid) {
        //     for (const controlName in this.userFormGroup.controls) {
        //       if (this.userFormGroup.controls[controlName].invalid) { invalidFields.push(`Purchase Form: ${controlName}`); }
        //     }
        //   }
        //   if (invalidFields.length > 0) {
        //     invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
        //   }
        // }


        if (this.userFormGroup.valid) {
            this.purchaseHeaderArray.clear();
            const groupedData = {};

            this.dsPRFinalitemlist.data.forEach(item => {
                const supplierId = item.SupplierId || 0;

                if (!groupedData[supplierId]) {
                    groupedData[supplierId] = [];
                }
                groupedData[supplierId].push(item);
            });


            Object.keys(groupedData).forEach(supplierId => {

                const items = groupedData[supplierId];
                const header = this.CreatePRToHeader(items[0]);
                const detailsArray = header.get('tPurchaseDetails') as FormArray;
                 const prHeaderArray = header.get('tpr') as FormArray;
              

                items.forEach(element => {
                    detailsArray.push(this.createPurchasedetailForm(element));
                 
                });  
                 const seen = new Set();
                this.dsPRFinalitemlist.data.forEach(element => { 
                     if (!seen.has(element.PRId)) {
                    seen.add(element.PRId);
                    prHeaderArray.push(this.CreatePRHeader(element));
                     } 
                  }); 
                this.purchaseHeaderArray.push(header);
            });  
            
            console.log(this.PRTOPoSaveForm.value.tPurchaseHeader); 
            this._PurchaseOrder.InsertPRtoPurchaseSave(
                this.PRTOPoSaveForm.value.tPurchaseHeader
            ).subscribe(response => {
                if (response) {
                    this._matDialog.closeAll();
                }
            });  
            
        } else {
            let invalidFields = [];
            if (this.userFormGroup.invalid) {
                for (const controlName in this.userFormGroup.controls) {
                    if (this.userFormGroup.controls[controlName].invalid) { invalidFields.push(`Purchase Form: ${controlName}`); }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }
        }

        // // ✅ Create ONE header
        // const header = this.CreatePRToHeader(this.dsPRFinalitemlist.data[0]);

        // const detailsArray = header.get('tPurchaseDetails') as FormArray;

        // // ✅ Add all items as details
        // this.dsPRFinalitemlist.data.forEach(element => {
        //   detailsArray.push(this.createPurchasedetailForm(element));
        // });

        // // ✅ Push header into array
        // this.purchaseHeaderArray.push(header);

        // // ✅ FINAL OUTPUT (matches your JSON)
        // const finalPayload = this.PRTOPoSaveForm.value.tPurchaseHeader;

        // console.log(finalPayload);

    } 

    isValidForm(): boolean {
        const invalidItem = this.dsPRFinalitemlist.data.find((item, index) => {
            debugger
            if (item.Qty <= 0) {
                this.toastr.warning(
                    `Row ${index + 1}: Quantity must be greater than 0`, 'Warning !',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return true;
            }

            if (item.TotalQty <= 0) {
                this.toastr.warning(
                    `Row ${index + 1}: Total Quantity must be greater than 0`, 'Warning !',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return true;
            }

            if (item.ConversionFactor <= 0 || item.ConversionFactor.toString() == '' || item.ConversionFactor == null) {
                this.toastr.warning(
                    `Row ${index + 1}: Conversion Factor must be greater than 0`, 'Warning !',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return true;
            }
            if (item.Price <= 0) {
                this.toastr.warning(
                    `Row ${index + 1}: Price must be greater than 0`, 'Warning !',
                    { toastClass: 'tostr-tost custom-toast-warning' }
                );
                return true;
            }

            return false;
        });

        return !invalidItem; // valid only if no invalid row
    } 
    OnReset() {
        this.userFormGroup.reset();
        this._matDialog.closeAll();
    } 
    onClose() {
        this.dialogRef.close();
    }   
    // it allowed only Digit 
    keyPressDigitsOnly(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    // it allowed only Digit & decimal
    keyPressDigitDecimalOnly(event) {
        const inp = String.fromCharCode(event.keyCode);
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
    rate: any;

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

