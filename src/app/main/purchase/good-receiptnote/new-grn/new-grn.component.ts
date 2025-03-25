import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { GRNList, GrnItemList, ItemNameList } from '../good-receiptnote.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable } from 'rxjs';
import { GoodReceiptnoteService } from '../good-receiptnote.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { map, startWith } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormsModule, FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ItemFormMasterComponent } from 'app/main/setup/inventory/item-master/item-form-master/item-form-master.component';
import { SupplierFormMasterComponent } from 'app/main/setup/inventory/supplier-master/supplier-form-master/supplier-form-master.component';
import { PODetailList, PurchaseorderComponent } from '../update-grn/purchaseorder/purchaseorder.component';
import { GRNFormModel, GRNItemResponseType, GSTCalculation, GSTType } from './types';
import { NewGRNService } from './new-grn.service';


const moment = _rollupMoment || _moment;
@Component({
    selector: 'app-update-grn',
    templateUrl: './new-grn.component.html',
    styleUrls: ['./new-grn.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewGrnComponent implements OnInit, OnDestroy {
    vsaveflag: boolean = true;

    displayedColumns2 = [
        'Status',
        'SrNo',
        'ItemName',
        'UOMId',
        'BatchNo',
        'ExpDate',
        'Qty',
        'FreeQty',
        'TotalQty',
        'ConversionFactor',
        'MRP',
        'Rate',
        'TotalAmount',
        'Disc',
        'Disc2',
        "GST",
        'CGST',
        'SGST',
        'IGST',
        'NetAmount',
        'poId',
        'purDetID',
        //'isClosed',
        'poBalQty',
        'poQty',
        'landedRate',
        'purUnitRate',
        'purUnitRateWF',
        'UnitMRP',
        'IsVerifiedUserId',
        'IsVerified',
        'IsVerifiedDatetime',
        'stockid',
        'buttons',
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
    FromStoreList: any;
    SupplierList: any;
    screenFromString = 'admission-form';
    isPaymentSelected: boolean = false;
    isSupplierSelected: boolean = false;
    isItemNameSelected: boolean = false;
    registerObj = new ItemNameList({});
    chargeslist: any = [];
    isChecked: boolean = true;
    labelPosition: 'before' | 'after' = 'after';
    isItemIdSelected: boolean = false;
    PaymentType: any;
    StoreList: any = [];
    StoreName: any;
    ItemID: any;
    VatPercentage: any;
    GSTPer: any;
    Specification: any;
    VatAmount: any;
    vFinalNetAmount: any;
    vFinalDisAmount: any;
    vFinalDisAmount2: any;
    vFinalVatAmount: any;
    vNetPayamount: any;
    CGSTFinalAmount: any;
    SGSTFinalAmount: any;
    IGSTFinalAmount: any;
    vTotalFinalAmount: any;
    GSTTypeList: any = [];
    RoundAmt: any = 0;
    newDateTimeObj: any = {};
    vPurchaseId: any;
    dsGRNList = new MatTableDataSource<GRNList>();
    dsGrnItemList = new MatTableDataSource<GrnItemList>();
    dsItemNameList = new MatTableDataSource<ItemNameList>();
    dsItemNameList1 = new MatTableDataSource<ItemNameList>();
    dsTempItemNameList = new MatTableDataSource<ItemNameList>();
    dsLastThreeItemList = new MatTableDataSource<LastThreeItemList>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    filteredOptions: any;
    noOptionFound: boolean;
    ItemName: any;
    vUOM: any = 0;
    vHSNCode: any = 0;
    Dis: any = 0;
    vBatchNo: any;
    vQty: any;
    ExpDate: any;
    vMRP: any;
    vFreeQty: any = 0;
    vRate: any;
    vTotalAmount: any;
    vDisc: any = 0;
    vDisc2: any = 0;
    vDisAmount: any = 0;
    vDisAmount2: any;
    vCGST: any;
    vCGSTAmount: any;
    vSGST: any;
    vSGSTAmount: any;
    vIGST: any = 0;
    vIGSTAmount: any = 0;
    vNetAmount: any;
    filteredoptionsToStore: Observable<string[]>;
    filteredoptionsSupplier: Observable<string[]>;
    filteredoptionsItemName: Observable<string[]>;
    @ViewChild('picker') datePickerElement = MatDatepicker;
    vCahchecked: any = 0;
    vGrntypechecked: any = 1;
    selectedAdvanceObj: PODetailList;
    optionsToStore: any;
    optionsFrom: any;
    optionsMarital: any;
    optionsSupplier: any;
    optionsItemName: any;
    renderer: any;
    vGST: any = 0;
    vGSTAmount: any = 0;
    InvoiceNo: any;
    GateEntryNo: any;
    SupplierId: any;
    Name: any;
    StoreId: any;
    GSTAmt: any;
    DiscAmt: any;
    IGSTAmt: any;
    CGSTAmt: any;
    SGSTAmt: any;
    vConversionFactor: any;
    vMobile: any;
    vContact: any;
    vDiffNetRoundAmt: any;
    ItemId: any;
    vOtherCharges: any;
    vpoBalQty: any;
    FinalTotalQty: any;
    FinalLandedrate: any;
    FinalpurUnitRate: any;
    FinalpurUnitrateWF: any;
    FinalUnitMRP: any;
    vItemName: any;
    vlastDay: string = '';
    lastDay2: string = '';
    vExpDate: string = '';
    dateTimeObj: any;

    // Bind dropdown mode
    dropdownMode = {
        gstCalcType: "GstCalcType",
        supplierMaster: "SupplierMaster"
    }
    constructor(
        public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NewGrnComponent>,
        public _dialogRef: MatDialogRef<PurchaseorderComponent>,
        private accountService: AuthenticationService,
        private snackBarService: SnackBarService,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored,
        private newGRNService: NewGRNService
    ) { }

    ngOnInit(): void {
        // Static data
        // this.dsItemNameList.data.push(
        //     new ItemNameList(staticData),
        // );
        if (this.data.chkNewGRN == 2) {
            this.registerObj = this.data.Obj;
            console.log(this.registerObj)
            // this.InvoiceNo = this.registerObj.InvoiceNo;
            // this.GateEntryNo = this.registerObj.GateEntryNo;
            // this.SupplierId = this.registerObj.SupplierId;
            // this.StoreId = this.registerObj.StoreId;
            // this._GRNList.GRNFinalForm.get('NetPayamt').setValue(this.registerObj.RoundingAmt);
            if (this.registerObj.Cash_CreditType)
                this.vCahchecked = 1;
            if (!this.registerObj.Cash_CreditType)
                this.vCahchecked = 0;
            if (this.registerObj.GRNType)
                this.vGrntypechecked = 1;
            if (!this.registerObj.GRNType)
                this.vGrntypechecked = 0;
        }
        else if (this.data.chkNewGRN == 3) {
            // get full data from excell import.
            let obj = this.data.FullData;
            this.registerObj = obj;
            this.dsItemNameList.data = obj.Items as ItemNameList[];
            this.chargeslist = obj.Items as ItemNameList[];
            this.dsTempItemNameList.data = obj.Items as ItemNameList[];
        }
        this.getGSTtypeList();
    }
    getSelectedItem(item: GRNItemResponseType): void {
        this._GRNList.userFormGroup.patchValue({
            UOM: item.umoId,
            ConversionFactor: item.converFactor,
            Qty: item.balanceQty,
            CGST: item.cgstPer,
            SGST: item.sgstPer,
            IGST: item.igstPer,
            GST: item.cgstPer + item.sgstPer + item.igstPer
        });
        console.log("ITEM", item);
    }
    getValidationMessages() {
        return {
            supplierId: [
                // { name: "required", Message: "SupplierId is required" }
            ],
            itemName: [
                // { name: "required", Message: "Item Name is required" }
            ],
            batchNo: [
                // { name: "required", Message: "Batch No is required" }
            ],
            invoiceNo: [
                // { name: "required", Message: "Invoice No is required" }
            ],
            gateEntryNo: [
                // { name: "required", Message: "Gate Entry No is required" }
            ],
            mrp: [
                // { name: "required", Message: "MRP is required" }
            ],
            rate: [
                // { name: "required", Message: "Rate is required" }
            ],

        };
    }
    selectChangeSupplier(supplier: any): void {
        console.log({ supplier });
    }
    date = new FormControl(new Date());
    minDate = new Date();
    maxDate = new Date(2024, 4, 1);
    calculateLastDay(inputDate: string) {
        // 
        if (inputDate && inputDate.length === 6) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);

            if (month >= 1 && month <= 12) {
                const lastDay = this.getLastDayOfMonth(month, year);
                this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
                // console.log(this.vlastDay)

                this._GRNList.userFormGroup.get('ExpDatess').setValue(this.vlastDay)
            } else {
                this.vlastDay = 'Invalid month';
            }
        } else {
            this.vlastDay = '';
        }

    }

    getLastDayOfMonth(month: number, year: number): number {
        return new Date(year, month, 0).getDate();
    }
    pad(n: number): string {
        return n < 10 ? '0' + n : n.toString();
    }
    lastDay1: any;
    CellcalculateLastDay(contact, inputDate: string) {
        if (inputDate && inputDate.length === 6) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);

            if (month >= 1 && month <= 12) {
                const lastDay1 = this.getLastDayOfMonth(month, year);
                this.lastDay1 = `${lastDay1}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay1}`;
                //console.log(this.lastDay2)
                contact.BatchExpDate = this.lastDay1;
            } else {
                this.vlastDay = 'Invalid month';
            }
        } else {
            this.vlastDay = ' ';
        }
    }

    getGSTtypeList() {
        var vdata = {
            'ConstanyType': 'GST_CALC_TYPE',
        }
        this._GRNList.getGSTtypeList(vdata).subscribe(data => {
            this.GSTTypeList = data;
            this._GRNList.userFormGroup.get('GSTType').setValue(this.GSTTypeList[0]);
        });
        if (this.data) {
            const toSelectGSTType = this.GSTTypeList.find(c => c.Name == this.registerObj.Tranprocessmode);
            this._GRNList.userFormGroup.get('GSTType').setValue(toSelectGSTType);
        }
    }
    
    // onAdd() {

    //     if ((this.vItemName == '' || this.vItemName == null || this.vItemName == undefined)) {
    //         this.toastr.warning('Please enter a ItemName', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vBatchNo == '' || this.vBatchNo == null || this.vBatchNo == undefined)) {
    //         this.toastr.warning('Please enter a Batch No', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vlastDay == '' || this.vlastDay == null || this.vlastDay == undefined)) {
    //         this.toastr.warning('Please enter a Expairy Date', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
    //         this.toastr.warning('Please enter a Qty', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vMRP == '' || this.vMRP == null || this.vMRP == undefined)) {
    //         this.toastr.warning('Please enter a MRP', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vRate == '' || this.vRate == null || this.vRate == undefined)) {
    //         this.toastr.warning('Please enter a Rate', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     const isDuplicate = this.dsItemNameList.data.some(item => item.BatchNo === this._GRNList.userFormGroup.get('BatchNo').value);

    //     if (!isDuplicate) {
    //         this.loading = true;
    //         this.dsItemNameList.data = [];
    //         this.chargeslist = this.dsTempItemNameList.data;
    //         this.chargeslist.push(
    //             {
    //                 ItemId: this._GRNList.userFormGroup.get('ItemName').value.ItemID || 0,
    //                 ItemName: this._GRNList.userFormGroup.get('ItemName').value.ItemName || '',
    //                 ConversionFactor: this.vConversionFactor || 0,
    //                 UOMId: this.vUOM,
    //                 HSNcode: this.vHSNCode,
    //                 BatchNo: this.vBatchNo,
    //                 BatchExpDate: this.vlastDay,// this.datePipe.transform(this.lastDay, "yyyy-MM-dd"),
    //                 ReceiveQty: this.vQty || 0,
    //                 FreeQty: this.vFreeQty || 0,
    //                 TotalQty: this.FinalTotalQty || 0,
    //                 MRP: this.vMRP || 0,
    //                 Rate: this.vRate || 0,
    //                 TotalAmount: this.vTotalAmount || 0,
    //                 DiscPercentage: this.vDisc || 0,
    //                 DiscAmount: this.vDisAmount || 0,
    //                 DiscPer2: this.vDisc2 || 0,
    //                 DiscAmt2: this.vDisAmount2 || 0,
    //                 VatPercentage: this.vGST || 0,
    //                 VatAmount: this.vGSTAmount || 0,
    //                 CGSTPer: this.vCGST || 0,
    //                 CGSTAmt: this.vCGSTAmount || 0,
    //                 SGSTPer: this.vSGST || 0,
    //                 SGSTAmt: this.vSGSTAmount || 0,
    //                 IGSTPer: this.vIGST || 0,
    //                 IGSTAmt: this.vIGSTAmount || 0,
    //                 NetAmount: this.vNetAmount || 0,
    //                 PurchaseId: 0,
    //                 PurDetId: 0,
    //                 POBalQty: 0,
    //                 POQty: 0,
    //                 LandedRate: this.FinalLandedrate || 0,
    //                 PurUnitRate: this.FinalpurUnitRate || 0,
    //                 PurUnitRateWF: this.FinalpurUnitrateWF || 0,
    //                 UnitMRP: this.FinalUnitMRP || 0,
    //                 IsVerifiedUserId: 0,
    //                 IsVerified: false,
    //                 IsVerifiedDatetime: "01/01/1900",
    //                 StkID: 0
    //             });
    //         console.log(this.chargeslist)
    //         setTimeout(() => {
    //             this.dsItemNameList.data = this.chargeslist;
    //             this.loading = false;
    //         }, 3000);
    //     }
    //     else {
    //         this.toastr.warning('Selected Item already added in the list', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         this.loading = false;
    //     }
    //     this.ItemReset();
    //     //this.date.setValue(new Date());
    //     this._GRNList.userFormGroup.get('ItemName').setValue('');
    //     //this.vNetAmount = 0;
    //     this.itemid.nativeElement.focus();
    //     //this.add = false;
    //     //this.vlastDay = '';
    // }

    ItemReset() {
        this.ItemName = " ";
        this.ItemID = 0;
        this.ItemId = 0;
        this.vConversionFactor = "";
        this.vUOM = "";
        this.vHSNCode = "";
        this.vBatchNo = "";
        this.vlastDay = "";
        this.vQty = 0;
        this.vFreeQty = 0;
        this.vMRP = 0;
        this.vRate = 0;
        this.vTotalAmount = 0;
        this.vDisc = 0;
        this.vDisAmount = 0;
        this.vDisc2 = 0;
        this.vDisAmount2 = 0;
        this.vGST = 0;
        this.vGSTAmount = 0;
        this.vCGST = 0;
        this.vCGSTAmount = 0;
        this.vSGST = 0;
        this.vSGSTAmount = 0;
        this.vIGST = 0;
        this.vIGSTAmount = 0;
        this.vNetAmount = 0;
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    calculateTotalamt() {
        const form = this._GRNList.userFormGroup;

        // Get values with proper type conversion
        const qty = +form.get('Qty').value || 0;
        const freeqty = +form.get('FreeQty').value || 0;
        const rate = +form.get('Rate').value || 0;
        const conversionFactor = +form.get('ConversionFactor').value || 1;

        // Calculate total quantity and amount
        const totalQty = (qty + freeqty) * conversionFactor;
        let totalAmount = 0;
        let netAmount = 0;

        if (qty > 0 && rate > 0) {
            totalAmount = rate * qty;
            netAmount = totalAmount;

            // Update form values
            form.patchValue({
                TotalAmount: totalAmount,
                NetAmount: netAmount,
                FinalTotalQty: totalQty
            });

            // Trigger discount and GST calculations
            // this.calculateDiscperAmount();
        } else {
            // Reset all calculated values
            form.patchValue({
                TotalAmount: 0,
                DisAmount: 0,
                DisAmount2: 0,
                CGSTAmount: 0,
                SGSTAmount: 0,
                IGSTAmount: 0,
                GSTAmount: 0,
                NetAmount: 0,
                FinalTotalQty: totalQty
            });
        }
        this.calculateGSTType();
    }
    calculateNetAmount() {
        // Get form values with type assertion and null safety
        const formValues = this._GRNList.userFormGroup.getRawValue() as GRNFormModel;

        // Extract and convert values to numbers with default 0
        const values = {
            TotalAmount: Number(formValues.TotalAmount || 0),
            DisAmount: Number(formValues.DisAmount || 0),
            CGSTAmount: Number(formValues.CGSTAmount || 0),
            SGSTAmount: Number(formValues.SGSTAmount || 0),
            IGSTAmount: Number(formValues.IGSTAmount || 0)
        };

        // Calculate total GST amount
        const totalGSTAmount = values.CGSTAmount + values.SGSTAmount + values.IGSTAmount;

        // Calculate amount after discount
        const amountAfterDiscount = values.TotalAmount - values.DisAmount;

        // Calculate final net amount
        const netAmount = Number((amountAfterDiscount + totalGSTAmount).toFixed(2));

        // Update form with new value
        this._GRNList.userFormGroup.patchValue({
            NetAmount: netAmount,
            GSTAmount: totalGSTAmount.toFixed(2)
        }, { emitEvent: false }); // Prevent unnecessary form value emissions

        return netAmount; // Return value for potential use elsewhere
    }
    // Calculate discount when discount percentage changes
    calculateDiscountAmount() {
        const form = this._GRNList.userFormGroup;
        const values = form.getRawValue() as GRNFormModel;

        // Get and validate discount percentage
        const discountPercentage = Number(values.Disc || 0);
        if (discountPercentage >= 100 || discountPercentage < 0) {
            this.toastr.warning('Discount percentage should be between 0 and 100');
            form.patchValue({ Disc: 0 });
            this.calculateNetAmount();
            return;
        }

        // Calculate discount amount
        const totalAmount = Number(values.TotalAmount || 0);
        const discountAmount = Number(((totalAmount * discountPercentage) / 100).toFixed(2));

        // Update form with new discount amount
        form.patchValue({
            DisAmount: discountAmount
        }, { emitEvent: false });

        // // Recalculate GST after discount update
        // this.calculateGSTBasedOnType(values.GSTType);
        this.calculateNetAmount();
    }
    calculateGSTType(type: GSTType = GSTType.GST_BEFORE_DISC) {
        const form = this._GRNList.userFormGroup;
        const formValues = form.getRawValue() as GRNFormModel;

        // Get all required values with proper type conversion
        const values = {
            totalAmount: Number(formValues.TotalAmount || 0),
            discAmount: Number(formValues.DisAmount || 0),
            cgst: Number(formValues.CGST || 0),
            sgst: Number(formValues.SGST || 0),
            igst: Number(formValues.IGST || 0),
            gst: Number(formValues.GST || 0),
            finalTotalQty: Number(formValues.FinalTotalQty || 0),
            conversionFactor: Number(formValues.ConversionFactor || 1),
            mrp: Number(formValues.MRP || 0),
            rate: Number(formValues.Rate || 0)
        };

        let calculation: GSTCalculation;

        switch (type) {
            case GSTType.GST_AFTER_DISC: {
                calculation = this.newGRNService.calculateGSTAfterDisc(values);
                break;
            }
            case GSTType.GST_BEFORE_DISC: {
                calculation = this.newGRNService.calculateGSTBeforeDisc(values);
                break;
            }
            case GSTType.GST_ON_MRP_PLUS_FREE_QTY: {
                calculation = this.newGRNService.calculateGSTOnMRPPlusFreeQty(values);
                break;
            }
            case GSTType.GST_ON_PUR_PLUS_FREE_QTY: {
                calculation = this.newGRNService.calculateGSTOnPurPlusFreeQty(values);
                break;
            }
            default: {
                // Default fallback to GST Before Disc
                calculation = this.newGRNService.calculateGSTBeforeDisc(values);
                return;
            }
        }

        // Update form with calculated values
        form.patchValue({
            IGST: type === GSTType.GST_AFTER_DISC ? 0 : values.igst,
            CGSTAmount: calculation.cgstAmount.toFixed(2),
            SGSTAmount: calculation.sgstAmount.toFixed(2),
            IGSTAmount: calculation.igstAmount.toFixed(2),
            GSTAmount: calculation.totalGSTAmount.toFixed(2),
            NetAmount: calculation.netAmount.toFixed(2)
        }, { emitEvent: false });

        this.calculateNetAmount();
    }
    onAddGRNItem() {
        console.log("FORM VALUES", this._GRNList.userFormGroup.getRawValue());
        const formValues = this._GRNList.userFormGroup.getRawValue() as GRNFormModel;
        if (formValues.ItemName) {
            const newItem = new ItemNameList({
                ...formValues,
                ItemName: formValues.ItemName.itemName,
                TotalQty: formValues.Qty + Number(formValues.FreeQty)
            });
            this.dsItemNameList.data = [...this.dsItemNameList.data, newItem];
        }
        console.log("TABLE DATA", this.dsItemNameList.data);
    }
    deleteTableRow(row: ItemNameList) {
        this.dsItemNameList.data = this.dsItemNameList.data.filter(item => item !== row);
    }
    onGSTTypeChange(event: any) {
        this.calculateGSTType(event.name);
    }   
    getCGSTAmt(element) {
        let CGSTAmt;
        CGSTAmt = element.reduce((sum, { CGSTAmt }) => sum += +(CGSTAmt || 0), 0); this.vCGSTAmount
        this.CGSTFinalAmount = CGSTAmt;
        return CGSTAmt;
    }
    getSGSTAmt(element) {
        let SGSTAmt;
        SGSTAmt = element.reduce((sum, { SGSTAmt }) => sum += +(SGSTAmt || 0), 0);
        this.SGSTFinalAmount = SGSTAmt;
        return SGSTAmt;
    }
    getIGSTAmt(element) {
        let IGSTAmt;
        IGSTAmt = element.reduce((sum, { IGSTAmt }) => sum += +(IGSTAmt || 0), 0);
        this.IGSTFinalAmount = IGSTAmt;
        return IGSTAmt;
    }
    NetAmount: any;
    getTotalAmt(element) {
        let FinalRoundAmt = (element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0)).toFixed(2);
        this.NetAmount = FinalRoundAmt;

        this.vTotalFinalAmount = (element.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0)).toFixed(2);
        this.vFinalDisAmount = (element.reduce((sum, { DiscAmount }) => sum += +(DiscAmount || 0), 0)).toFixed(2);
        this.vFinalDisAmount2 = (element.reduce((sum, { DiscAmt2 }) => sum += +(DiscAmt2 || 0), 0)).toFixed(2);
        this.vFinalVatAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);

        let Othercharge = this._GRNList.GRNFinalForm.get("OtherCharge").value || 0;
        FinalRoundAmt = (parseFloat(FinalRoundAmt) + parseFloat(Othercharge));

        let DebitAmount = this._GRNList.GRNFinalForm.get("DebitAmount").value || 0;
        FinalRoundAmt = (parseFloat(FinalRoundAmt) + parseFloat(DebitAmount));

        let CreditAmount = this._GRNList.GRNFinalForm.get("CreditAmount").value || 0;
        FinalRoundAmt = (parseFloat(FinalRoundAmt) - parseFloat(CreditAmount));
        let FinalnetAmt = FinalRoundAmt;
        this.vFinalNetAmount = Math.round(FinalnetAmt).toFixed(2); //(element.reduce((sum, { RoundNetAmt }) => sum += +(RoundNetAmt || 0), 0)).toFixed(2) || Math.round(this.FinalNetAmount);
        this.vDiffNetRoundAmt = (parseFloat(this.vFinalNetAmount) - (FinalnetAmt)).toFixed(2);

        return this.vTotalFinalAmount;
    }
    purchaseOrderList(): void {

    }
    resetForm() {
        this._GRNList.userFormGroup.reset();
    }
    ngOnDestroy(): void {
        this.resetForm();
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


