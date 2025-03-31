import {  Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule, FormControl, FormGroup } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ItemFormMasterComponent } from 'app/main/setup/inventory/item-master/item-form-master/item-form-master.component';
import { SupplierFormMasterComponent } from 'app/main/setup/inventory/supplier-master/supplier-form-master/supplier-form-master.component';
import { PODetailList, PurchaseorderComponent } from '../update-grn/purchaseorder/purchaseorder.component';
import { GRNFinalFormModel, GRNFormModel, GRNItemResponseType, GSTCalculation, GSTType, ToastType } from './types';
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
    // Make it true when you want to use mock data.
    mock = false;

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
        if (this.mock) {
            this.setMockData();
            
        }
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
        if (this.mock) {
            return;
        }
        this._GRNList.userFormGroup.patchValue({
            UOMId: item.umoId,
            ConversionFactor: isNaN(+item.converFactor) ? 1 : +item.converFactor,
            Qty: item.balanceQty,
            CGST: item.cgstPer,
            SGST: item.sgstPer,
            IGST: item.igstPer,
            GST: item.cgstPer + item.sgstPer + item.igstPer
        });
        this.calculateTotalamt();
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

    resetFormItem() {
        const form = this._GRNList.userFormGroup;

        form.patchValue({
            ItemName: "",
            ConversionFactor: 1,
            Qty: 0,
            UOMId: 0,
            HSNCode: "",
            BatchNo: "",
            ExpDate: "",
            FreeQty: 0,
            Rate: 0,
            MRP: 0,
            Disc: 0,
            Disc2: 0,
            DisAmount: 0,
            DisAmount2: 0,
            CGST: 0,
            CGSTAmount: 0,
            SGST: 0,
            SGSTAmount: 0,
            IGST: 0,
            GST: 0,
            GSTAmount: 0,
            TotalAmount: 0,
            NetAmount: 0,
            FinalTotalQty: 0,
        });
        this._GRNList.userFormGroup.markAsUntouched();
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    calculateTotalamt() {
        this.validateFormValues();
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
                DiscAmount: 0,
                DiscAmount2: 0,
                CGSTAmount: 0,
                SGSTAmount: 0,
                IGSTAmount: 0,
                GSTAmount: 0,
                NetAmount: 0,
                FinalTotalQty: totalQty
            });
        }
        this.calculateDiscountAmount();
        this.calculateGSTType();
    }
    // Calculate discount when discount percentage changes
    calculateDiscountAmount() {
        const form = this._GRNList.userFormGroup;
        const values = form.getRawValue() as GRNFormModel;

        // Get and validate discount percentage
        const discountPercentage = Number(values.Disc || 0);
        if (discountPercentage >= 100 || discountPercentage < 0) {
            this.newGRNService.showToast('Discount percentage should be between 0 and 100', ToastType.WARNING);
            form.patchValue({ Disc: 0 });
            this.calculateGSTType();
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
        this.calculateGSTType();
    }
    calculateGSTType(type: GSTType = GSTType.GST_BEFORE_DISC) {
        const form = this._GRNList.userFormGroup;
        const formValues = form.getRawValue() as GRNFormModel;

        // Get all required values with proper type conversion
        const values = this.newGRNService.normalizeValues(formValues);

        // Get GST Calculation
        const calculation = this.newGRNService.getGSTCalculation(formValues.GSTType || type, values);

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
    calculateCellGSTType(item: ItemNameList): ItemNameList {
        // Validate input
        if (!item) return item;

        try {
            // Get all required values with proper type conversion
            const values = this.newGRNService.normalizeValues(item);

            // Get GST Calculation
            const calculation = this.newGRNService.getGSTCalculation(item.GSTType, values);

            // Create updated item with new values
            return {
                ...item,
                IGST: item.GSTType === GSTType.GST_AFTER_DISC ? 0 : values.igst,
                CGSTAmount: Number(calculation.cgstAmount.toFixed(2)),
                SGSTAmount: Number(calculation.sgstAmount.toFixed(2)),
                IGSTAmount: Number(calculation.igstAmount.toFixed(2)),
                VatAmount: Number(calculation.totalGSTAmount.toFixed(2)),
                NetAmount: Number(calculation.netAmount.toFixed(2)),
                // Add any additional calculated fields
                LandedRate: calculation.netAmount / (item.TotalQty || 1),
                PurUnitRate: item.TotalAmount / (item.Qty * item.ConversionFactor),
                PurUnitRateWF: item.TotalAmount / (item.TotalQty || 1),
                UnitMRP: item.MRP / item.ConversionFactor
            };
        } catch (error) {
            console.error('Error calculating GST:', error);
            return item;
        }
    }
    onAddGRNItem() {
        if (!this.newGRNService.validateGRNForm(this._GRNList.userFormGroup)) {
            return;
        }
        // Check if the item is already in the list
        console.log("Form values : ", this._GRNList.userFormGroup.value);
        const isDuplicate = this.dsItemNameList.data.some(item => item.BatchNo === this._GRNList.userFormGroup.get('BatchNo').value);
        if (isDuplicate) {
            this.newGRNService.showToast('Item already added in the list', ToastType.WARNING);
            return;
        }
        const formValues = this._GRNList.userFormGroup.getRawValue() as GRNFormModel;
        const totalQty = (Number(formValues.Qty) + Number(formValues.FreeQty)) * (Number(formValues.ConversionFactor) || 1);
        if (formValues.ItemName) {
            const newItem = new ItemNameList({
                ...formValues,
                ItemName: formValues.ItemName.itemName,
                TotalQty: totalQty,
                // Add any additional calculated fields
                LandedRate: formValues.NetAmount / (totalQty || 1),
                PurUnitRate: formValues.TotalAmount / (formValues.Qty * formValues.ConversionFactor),
                PurUnitRateWF: formValues.TotalAmount / (totalQty || 1),
                UnitMRP: formValues.MRP / formValues.ConversionFactor,
                ExpDate: this.datePipe.transform(formValues.ExpDate, "MM/yyyy")
            });
            this.dsItemNameList.data = [...this.dsItemNameList.data, newItem];
            this.updateGRNFinalForm();
        }
        this.resetFormItem();
    }
    deleteTableRow(row: ItemNameList) {
        if (row.IsVerifiedUserId == 1) {
            this.newGRNService.showToast('Verified Record should not be Deleted .', ToastType.SUCCESS);
        } else {
            this.dsItemNameList.data = this.dsItemNameList.data.filter(item => item !== row);
            this.newGRNService.showToast('Record Deleted Successfully.', ToastType.SUCCESS);
            this.updateGRNFinalForm();
        }
    }
    onGSTTypeChange(event: { value: number, text: string }) {
        this.calculateGSTType(event.text as GSTType);
    }
    getCGSTAmt() {
        return this.dsItemNameList.data.reduce((sum, { CGSTAmount }) => sum += +(CGSTAmount || 0), 0);
    }
    getSGSTAmt() {
        return this.dsItemNameList.data.reduce((sum, { SGSTAmount }) => sum += +(SGSTAmount || 0), 0);
    }
    getIGSTAmt() {
        return this.dsItemNameList.data.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
    }
    getTotalAmount() {
        return this.dsItemNameList.data.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0);
    }
    getCellCalculation(item: ItemNameList) {
        // Validate PO Quantity
        // if (!this.newGRNService.validatePOQuantity(contact)) {
        //     Swal.fire("Qty Should Be less than PO Qty");
        //     return;
        // }
        this.newGRNService.validateCellData(item);

        // Calculate basic values
        this.newGRNService.calculateBasicValues(item);
        // Validate GST Rates
        this.newGRNService.validateGSTRates(item);

        const updatedItem = this.calculateCellGSTType(item);
        Object.assign(item, updatedItem);

        this.updateGRNFinalForm();
    }
    updateGRNFinalForm() {
        const form = this._GRNList.GRNFinalForm;
        const itemList = this.dsItemNameList.data;
        const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
        const updatableFormValues: GRNFinalFormModel = {
            TotalAmt: itemList.reduce((sum, { TotalAmount }) => sum += +(TotalAmount || 0), 0).toFixed(2),
            VatAmount: itemList.reduce((sum, { GSTAmount }) => sum += +(GSTAmount || 0), 0).toFixed(2),
            NetPayamt: netAmount.toFixed(2),
            RoundingAmt: Math.round(netAmount),
            DiscAmount: itemList.reduce((sum, { DisAmount }) => sum += +(DisAmount || 0), 0).toFixed(2),
            DiscAmount2: itemList.reduce((sum, { DisAmount2 }) => sum += +(DisAmount2 || 0), 0),
            OtherCharge: itemList.reduce((sum, { OtherCharge }) => sum += +(OtherCharge || 0), 0),
        } as GRNFinalFormModel;

        form.patchValue({
            ...updatableFormValues
        });
    }
    OnAddItem() {
        const dialogRef = this._matDialog.open(ItemFormMasterComponent, {
            maxWidth: "100%",
            height: '95%',
            width: '95%',
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
        });
    }
    OnAddSupplier() {
        const dialogRef = this._matDialog.open(SupplierFormMasterComponent, {
            maxWidth: "100%",
            height: '95%',
            width: '95%',
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
        });
    }
    OnReset() {
        this.resetForm();
    }
    private resetCalculations(contact: any): void {
        const resetValues = {
            TotalAmount: 0,
            DiscAmount: 0,
            DiscAmt2: 0,
            CGSTAmt: 0,
            SGSTAmt: 0,
            IGSTAmt: 0,
            VatAmount: 0,
            NetAmount: 0
        };
        Object.assign(contact, resetValues);
    }
    purchaseOrderList(): void {
        // Get purchase order list
    }
    resetForm() {
        this._GRNList.userFormGroup.reset();
        this.dsItemNameList.data = [];
        this.updateGRNFinalForm();
    }
    setFocus(elementId: string) {
        // Set focus to the element with the given id
    }
    setMockData() {
        this._GRNList.userFormGroup.patchValue({
            UOMId: 1234,
            ConversionFactor: 5,
            Qty: 10,
            CGST: 6,
            SGST: 6,
            IGST: 0,
            GST: 12,
            Rate: 100,
            MRP: 200,
            FreeQty: 5,
            Disc: 10,
            BatchNo: "123",
            ItemName: {
                itemName: "Test Item"
            }
        });
        console.log("Form values : ", this._GRNList.userFormGroup.value);
        this.calculateTotalamt();
    }
    keyPressCharater(event: any) {

    }
    onSave() {
        const formValues = this._GRNList.userFormGroup.getRawValue() as GRNFormModel;
        const itemList = this.dsItemNameList.data;
        console.log("SAVE", { formValues, itemList });
        // Apply save flow here
    }

    // Handlers
    validateFormValues() {
        const form = this._GRNList.userFormGroup;
        const values = form.getRawValue() as GRNFormModel;
        if (+values.Qty < 0) {
            this.newGRNService.showToast('Quantity should be greater than 0', ToastType.WARNING);
            form.patchValue({
                Qty: 0,
            });
        }
        if (+values.FreeQty < 0) {
            this.newGRNService.showToast('Free Quantity should be greater than 0', ToastType.WARNING);
            form.patchValue({
                FreeQty: 0,
            });
        }
        if (+values.MRP < 0) {
            this.newGRNService.showToast('MRP should be greater than 0', ToastType.WARNING);
            form.patchValue({
                MRP: 0,
            });
        }
        if (+values.Rate < 0) {
            this.newGRNService.showToast('Rate should be greater than 0', ToastType.WARNING);
            form.patchValue({
                Rate: 0,
            });
        }
        if (+values.Rate > +values.MRP) {
            this.newGRNService.showToast('Rate should be less than MRP', ToastType.WARNING);
            form.patchValue({
                Rate: 0,
            });
        }
        if (+values.ConversionFactor < 0) {
            this.newGRNService.showToast('Conversion Factor should be greater than 0', ToastType.WARNING);
            form.patchValue({
                ConversionFactor: 1,
            });
        }
    }
    onExpiryChange() {
        const form = this._GRNList.userFormGroup;
        const values = form.getRawValue() as GRNFormModel;
        if (+values.ExpDate < 0) {
            this.newGRNService.showToast('Expiry should be greater than 0', ToastType.WARNING);
        }
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


