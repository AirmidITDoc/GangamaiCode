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
import { values } from 'lodash';
import Swal from 'sweetalert2';


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
    vGrntypechecked: any;
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
    autocompleteModeGSTType: string = "GstCalcType";
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
            if (this.registerObj.Cash_CreditType)
                this.vCahchecked = true;
            if (!this.registerObj.Cash_CreditType)
                this.vCahchecked = false;
            if (this.registerObj.GRNType)
                this.vGrntypechecked = true;
            if (!this.registerObj.GRNType)
                this.vGrntypechecked = false;
        }
        else if (this.data.chkNewGRN == 3) {
            // get full data from excell import.
            let obj = this.data.FullData;
            this.registerObj = obj;
            this.dsItemNameList.data = obj.Items as ItemNameList[];
            this.chargeslist = obj.Items as ItemNameList[];
            this.dsTempItemNameList.data = obj.Items as ItemNameList[];
        } 
        this.getGRNrtrvItemlist();
    }
    //Item selectedObj
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
  //supplier det
    selectChangeSupplier(supplier: any): void {
        console.log({ supplier });
        this._GRNList.getSupplierdetails(supplier.value).subscribe(response=>{
            // console.log({response})
            if(response){
                this._GRNList.userFormGroup.patchValue({
                    Contact: response.contactPerson,
                    Mobile:response.mobile
                })
            }
        })
    }
    date = new FormControl(new Date());
    minDate = new Date();
    maxDate = new Date(2024, 4, 1);
    calculateLastDay() {
        const inputDate = this._GRNList.userFormGroup.get("ExpDate").value;
        if (inputDate && inputDate.length === 6) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);

            if (month >= 1 && month <= 12) {
                const lastDay = this.getLastDayOfMonth(month, year);
                this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
                this._GRNList.userFormGroup.get('ExpDate').setValue(this.vlastDay)
            } else {
                this.vlastDay = '';
                this.newGRNService.showToast('Invalid month in Expiry Date. Use format MMYYYY', ToastType.WARNING);
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
    //Table Exp Date change
    lastDay1: any;
    CellcalculateLastDay(contact: ItemNameList, inputDate: string) {
        if (inputDate && inputDate.length === 6) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);

            if (month >= 1 && month <= 12) {
                const lastDay1 = this.getLastDayOfMonth(month, year);
                this.lastDay1 = `${lastDay1}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay1}`;
                //console.log(this.lastDay2)
                contact.ExpDate = this.lastDay1;
            } else {
                this.vlastDay = '';
                this.newGRNService.showToast('Invalid month in Expiry Date. Use format MMYYYY', ToastType.WARNING);
            }
        } else {
            this.vlastDay = '';
        }
    } 
 //Add item list
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
                ItemId:formValues.ItemName.itemId
            });
            this.dsItemNameList.data = [...this.dsItemNameList.data, newItem];
            this.updateGRNFinalForm();
        }
        this.resetFormItem();
        const itemNameElement = document.querySelector(`[name='ItemName']`) as HTMLElement;
        if (itemNameElement) {
            itemNameElement.focus();
        }
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
    resetFormItem() {
        const form = this._GRNList.userFormGroup;

        form.patchValue({
            ItemName: "a",
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
    calculateDiscper2Amt(){}
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

    IsDiscPer2:boolean=false;
    onGSTTypeChange(event: { value: number, text: string }) {
        console.log(event)
        this.calculateGSTType(event.text as GSTType);
        if(event.text == "GST After TwoTime Disc"){
            this.IsDiscPer2 = true
        }else{
            this.IsDiscPer2 = false
        }
    } 
    getCGSTAmt() {
        this.CGSTFinalAmount = this.dsItemNameList.data.reduce((sum, { CGSTAmount }) => sum += +(CGSTAmount || 0), 0);
        return this.CGSTFinalAmount
    }
    getSGSTAmt() {
        this.SGSTFinalAmount = this.dsItemNameList.data.reduce((sum, { SGSTAmount }) => sum += +(SGSTAmount || 0), 0);
        return  this.SGSTFinalAmount
    }
    getIGSTAmt() {
        this.IGSTFinalAmount = this.dsItemNameList.data.reduce((sum, { IGSTAmount }) => sum += +(IGSTAmount || 0), 0);
        return  this.IGSTFinalAmount
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
        // Apply save flow here 
        if ((formValues.SupplierId == '' || formValues.SupplierId == null || formValues.SupplierId == '0')) {
            this.toastr.warning('Please select a supplier name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((formValues.InvoiceNo == '' || formValues.InvoiceNo == null)) {
            this.toastr.warning('Please enter a InvoiceNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if ((this._GRNList.GRNFinalForm.get('ReceivedBy').value == '' || this._GRNList.GRNFinalForm.get('ReceivedBy').value == null)) {
            this.toastr.warning('Please enter a ReceivedBy Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        } 
       Swal.fire({
            title: 'Do you want to Save the New GRN ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Save!"
    
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              this.OnSavenew();
            }
          })
    }
    OnSavenew() {  
        let grnSaveObj = {};
        grnSaveObj['grnid'] = 0;
        grnSaveObj['grnNumber'] = '0';
        grnSaveObj['grndate'] =this.datePipe.transform(this.dateTimeObj.date ,"yyyy-MM-dd") || '1900-01-01';
        grnSaveObj['grntime'] = this.dateTimeObj.time;
        grnSaveObj['storeId'] = this.accountService.currentUserValue.storeId;
        grnSaveObj['supplierId'] = this._GRNList.userFormGroup.get('SupplierId').value || 0;
        grnSaveObj['invoiceNo'] = this._GRNList.userFormGroup.get('InvoiceNo').value || '';
        grnSaveObj['deliveryNo'] = '';
        grnSaveObj['gateEntryNo'] = this._GRNList.userFormGroup.get('GateEntryNo').value || ''; 
        grnSaveObj['cashCreditType'] = this._GRNList.userFormGroup.get('PaymentType').value;
        grnSaveObj['grntype'] = this._GRNList.userFormGroup.get('GRNType').value;
        grnSaveObj['totalAmount'] = this._GRNList.GRNFinalForm.get('TotalAmt').value || 0;
        grnSaveObj['totalDiscAmount'] = this._GRNList.GRNFinalForm.get('DiscAmount').value || 0;
        grnSaveObj['totalVatamount'] = this._GRNList.GRNFinalForm.get('VatAmount').value || 0;
        grnSaveObj['netAmount'] = this._GRNList.GRNFinalForm.get('NetPayamt').value || 0;
        grnSaveObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
        grnSaveObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
        grnSaveObj['isVerified'] = false;
        grnSaveObj['isClosed'] = false;  
        grnSaveObj['invDate'] = this.datePipe.transform(this._GRNList.userFormGroup.get('DateOfInvoice').value, "yyyy-MM-dd") || '1900-01-01';
        grnSaveObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
        grnSaveObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
        grnSaveObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharge').value || 0;
        grnSaveObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
        grnSaveObj['totCgstamt'] = this.CGSTFinalAmount || 0; 
        grnSaveObj['totSgstamt'] = this.SGSTFinalAmount || 0; 
        grnSaveObj['totIgstamt'] = this.IGSTFinalAmount || 0; 
        grnSaveObj['tranProcessId'] = this._GRNList.userFormGroup.get('GSTType').value || 0;
        grnSaveObj['tranProcessMode'] = this._GRNList.userFormGroup.get('GSTType').value || '';
        grnSaveObj['ewayBillNo'] = this._GRNList.GRNFinalForm.get('EwayBillNo').value || 0;
        grnSaveObj['ewayBillDate'] = this.datePipe.transform(this._GRNList.GRNFinalForm.get('EwalBillDate').value, "yyyy-MM-dd") || '01/01/1099';
        grnSaveObj['billDiscAmt'] =   this._GRNList.GRNFinalForm.get('DiscAmount2').value || 0; 
        
   
        let SavegrnDetailObj = [];
        this.dsItemNameList.data.forEach((element) => {
            console.log(element); 
            let grnDetailSaveObj = {};
            grnDetailSaveObj['grndetId'] = 0;
            grnDetailSaveObj['grnId'] = 0; 
            grnDetailSaveObj['itemId'] = element.ItemId || 0;
            grnDetailSaveObj['uomId'] = element.UOMId || 0;
            grnDetailSaveObj['receiveQty'] = element.Qty || 0;
            grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
            grnDetailSaveObj['mrp'] = element.UnitMRP || 0;
            grnDetailSaveObj['rate'] = element.Rate || 0;
            grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
            grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
            grnDetailSaveObj['vatPercentage'] = element.GST || 0;
            grnDetailSaveObj['vatAmount'] = element.GSTAmount || 0;
            grnDetailSaveObj['discPercentage'] = element.Disc || 0;
            grnDetailSaveObj['discAmount'] = element.DisAmount || 0;
            grnDetailSaveObj['discPerc2'] = element.DiscPer2 || 0;
            grnDetailSaveObj['discAmt2'] = element.DiscAmt2 || 0;
            grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
            grnDetailSaveObj['landedRate'] = element.LandedRate || 0;
            grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
            grnDetailSaveObj['pono'] = 0; //this.IgstAmt;
            grnDetailSaveObj['batchNo'] = element.BatchNo || "";

            if (element.ExpDate && element.ExpDate.length === 10) {
                const day = +element.ExpDate.substring(0, 2);
                const month = +element.ExpDate.substring(3, 5);
                const year = +element.ExpDate.substring(6, 10);

                this.vExpDate = `${year}-${this.pad(month)}-${day}`;
                // console.log(this.vExpDate)
            } 
            grnDetailSaveObj['batchExpDate'] = this.vExpDate;
            grnDetailSaveObj['purUnitRate'] = element.PurUnitRate || 0;
            grnDetailSaveObj['purUnitRateWF'] = element.PurUnitRateWF || 0;
            grnDetailSaveObj['cgstper'] = element.CGST || 0;
            grnDetailSaveObj['cgstamt'] = element.CGSTAmount || 0;
            grnDetailSaveObj['sgstper'] = element.SGST || 0;
            grnDetailSaveObj['sgstamt'] = element.SGSTAmount || 0;
            grnDetailSaveObj['igstper'] = element.IGST || 0;
            grnDetailSaveObj['igstamt'] = element.IGSTAmount || 0;
            grnDetailSaveObj['mrpStrip'] = element.MRP || 0;
            grnDetailSaveObj['isVerified'] = element.IsVerified; 
            grnDetailSaveObj['isVerifiedDatetime'] = element.IsVerifiedDatetime || 0;
            grnDetailSaveObj['isVerifiedUserId'] = element.IsVerifiedUserId || 0;
            grnDetailSaveObj['stkId'] = element.StkID || 0; 
            SavegrnDetailObj.push(grnDetailSaveObj); 
        }); 
        grnSaveObj['tGrndetails'] = SavegrnDetailObj

        let updateItemMasterGSTPerObjarray = [];
        this.dsItemNameList.data.forEach((element) => {
            let updateItemMasterGSTPerObj = {};
            updateItemMasterGSTPerObj['itemId'] = element.ItemId || 0;
            updateItemMasterGSTPerObj['cgst'] = element.CGST || 0;
            updateItemMasterGSTPerObj['sgst'] = element.SGST || 0;
            updateItemMasterGSTPerObj['igst'] = element.IGST || 0;
            updateItemMasterGSTPerObj['hsNcode'] = element.HSNCode || "";
            updateItemMasterGSTPerObjarray.push(updateItemMasterGSTPerObj);
        }); 
        let submitData = {
            "grnSave": grnSaveObj,
           //"grnDetailSave": SavegrnDetailObj,
            "grnItems": updateItemMasterGSTPerObjarray
        };
        console.log(submitData); 
        this._GRNList.GRNSave(submitData).subscribe(response => { 
            console.log(response)
            this.toastr.success(response.message);  
            this._matDialog.closeAll();
            this.OnReset();
          }, (error) => {
            this.toastr.error(error.message);
          });
    }

    OnReset() {
        this.resetForm();
    }
    getGRNrtrvItemlist() { 
        var vdata = {  
            "first": 0,
            "rows": 10,
            "sortField": "GRNDetID",
            "sortOrder": 0,
            "filters": [
              {
                "fieldName": "GRNID",
                "fieldValue": String(this.registerObj.GRNId),
                "opType": "Equals"
              }
            ],
            "exportType": "JSON"
          } 
         console.log(vdata);
        this._GRNList.getGRNrtrvItemlist(vdata).subscribe(response => {
          this.chargeslist = response
          console.log(response)
          this.dsItemNameList.data = this.chargeslist;
          console.log(this.dsItemNameList.data)  
        });  
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
    ngOnDestroy(): void {
        this.resetForm();
    }
    getValidationMessages() {
        return {
            supplierId: [
                // { name: "required", Message: "SupplierId is required" }
            ],
            GSTType: [
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
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
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


