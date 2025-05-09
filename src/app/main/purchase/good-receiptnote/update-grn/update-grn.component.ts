import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { PODetailList, PurchaseorderComponent } from './purchaseorder/purchaseorder.component';
import { MatSelect } from '@angular/material/select';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ItemFormMasterComponent } from 'app/main/setup/inventory/item-master/item-form-master/item-form-master.component';
import { SupplierFormMasterComponent } from 'app/main/setup/inventory/supplier-master/supplier-form-master/supplier-form-master.component';
import { CreditNoteComponent } from '../credit-note/credit-note.component';
import { element } from 'protractor';

const moment = _rollupMoment || _moment;
@Component({
    selector: 'app-update-grn',
    templateUrl: './update-grn.component.html',
    styleUrls: ['./update-grn.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UpdateGRNComponent implements OnInit {
    vsaveflag: boolean = true;

    displayedColumns2 = [
        'Status',
        'SrNo',
        'ItemName',
        'UOMId',
        'HSNCode',
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
        'DisAmount',
        'Disc2',
        'DisAmount2',
        "GST",
        'GSTAmount',
        'CGST',
        'CGSTAmount',
        'SGST',
        'SGSTAmount',
        'IGST',
        'IGSTAmount',
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

    constructor(
        public _GRNList: GoodReceiptnoteService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<UpdateGRNComponent>,
        public _dialogRef: MatDialogRef<PurchaseorderComponent>,
        private accountService: AuthenticationService,
        private snackBarService: SnackBarService,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored,
    ) { }

    ngOnInit(): void {
        if (this.data.chkNewGRN == 2) {
            this.registerObj = this.data.Obj;
            console.log(this.registerObj)
            // this.InvoiceNo = this.registerObj.InvoiceNo;
            // this.GateEntryNo = this.registerObj.GateEntryNo;
            // this.SupplierId = this.registerObj.SupplierId;
            // this.StoreId = this.registerObj.StoreId;
            // this._GRNList.GRNFinalForm.get('NetPayamt').setValue(this.registerObj.RoundingAmt);
            this.getSupplierSearchCombo();
            if (this.registerObj.Cash_CreditType)
                this.vCahchecked = 1;
            if (!this.registerObj.Cash_CreditType)
                this.vCahchecked = 0;
            if (this.registerObj.GRNType)
                this.vGrntypechecked = 1;
            if (!this.registerObj.GRNType)
                this.vGrntypechecked = 0;
            this.getGRNItemDetailList(this.registerObj);
            this.getGSTChkList();
        }
        else if (this.data.chkNewGRN == 3) {
            // get full data from excell import.
            let obj = this.data.FullData;
            this.registerObj=obj;
            this.dsItemNameList.data = obj.Items as ItemNameList[];
            this.chargeslist = obj.Items as ItemNameList[];
            this.dsTempItemNameList.data = obj.Items as ItemNameList[];
        }
        this.gePharStoreList();
        this.getGSTtypeList();
        this.getGSTChkList();
    }

    date = new FormControl(moment());
    minDate = new Date();
    maxDate = new Date(2024, 4, 1);
    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        const currentDate = new Date();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        if (ctrlValue && ctrlValue > currentDate) {
            this.date.setValue(this.date.value);
        }
        //console.log(this.datePipe.transform(this.date.value, "yyyy-MM"));

        datepicker.close();
    }
    followUpDate: string;
    NxtMonths:any=3;
    calculateLastDay(inputDate: string) {
         debugger
        // if (inputDate && inputDate.length === 6) {
        //     const month = +inputDate.substring(0, 2);
        //     const year = +inputDate.substring(2, 6);

        //     if (month >= 1 && month <= 12) {
        //         const lastDay = this.getLastDayOfMonth(month, year);
        //         this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
        //         this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
        //         // console.log(this.vlastDay)

        //         this._GRNList.userFormGroup.get('ExpDatess').setValue(this.vlastDay)
        //         this.setFocus('Qty');
        //     } else {
        //         this.vlastDay = 'Invalid month';
        //     }
        // } else {
        //     this.vlastDay = '';
        // } 


        const Months = 3
        const CurrentDate = new Date(); 
        const Currentmonths = new Date(); 
        const currentMonth = Currentmonths.getMonth(); 
        const currentYear = CurrentDate.getFullYear(); 
       let  NxtMonths = ((currentMonth) + (Months));

       const numericPattern = /^[0-9]+$/; 
       const NextExpiryDate = new Date();
       NextExpiryDate.setMonth((CurrentDate.getMonth()) + parseInt(this.NxtMonths));
        const newNextDate  = this.datePipe.transform(NextExpiryDate , 'dd/MM/YYYY') 
 

        if ((inputDate && inputDate.length === 6) && numericPattern.test(inputDate)) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);  
        
            if (year <= currentYear) {
                if (month <= currentMonth) {
                    Swal.fire({
                        icon: "warning",
                        title: "This item is already expired",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.vlastDay = '';
                    return
                }
                if (month > 12 && month <= 0) {
                    this.vlastDay = '';
                    this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                const lastDay = this.getLastDayOfMonth(month, year);
                this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
                const newuserDate = this.datePipe.transform(this.lastDay2, 'dd/MM/YYYY')
                this._GRNList.userFormGroup.get('ExpDatess').setValue(this.vlastDay) 
                this.setFocus('Qty'); 

            } else {
                if (month > 12 && month <= 0) {
                    this.vlastDay = '';
                    this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                const lastDay = this.getLastDayOfMonth(month, year);
                this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
                this._GRNList.userFormGroup.get('ExpDatess').setValue(this.vlastDay)
                this.setFocus('Qty'); 
                 
            } 
        } else {  
            this.vlastDay = '';
            this.toastr.warning('Please enter only numbers in MMYYYY format', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
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
        const numericPattern = /^[0-9]+$/; 
        if ((inputDate && inputDate.length === 6) && numericPattern.test(inputDate)) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);

            if (month >= 1 && month <= 12) {
                const lastDay1 = this.getLastDayOfMonth(month, year);
                this.lastDay1 = `${lastDay1}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay1}`;
                //console.log(this.lastDay2)
                contact.BatchExpDate = this.lastDay1;
            } else {
                this.vlastDay = '';
                this.toastr.warning('Please enter date in MMYYYY format', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return; 
            }
        } else {
            this.vlastDay = ' ';
            this.toastr.warning('Please enter date in MMYYYY format', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return; 
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


    filteredOptionssupplier: any;
    noOptionFoundsupplier: any;
    vSupplierId: any;
    vsupplierName: any;
    POsupplierName: any;
    newSupplier: any;
    PoID: any;
    vcheckSupplierId: any;
    getSupplierSearchCombo() {
        if (this.vPurchaseId > 0) {
            this.vsupplierName = this.vPurchaseOrderSupplierId;
        }
        else if (this.data.chkNewGRN == 2) {
            let EditSupplier = this._GRNList.userFormGroup.get('SupplierId').value;
            if (EditSupplier) {
                this.vsupplierName = this._GRNList.userFormGroup.get('SupplierId').value;
            } else {
                this.vsupplierName = this.registerObj.SupplierName;
            }
        }
        else {
            this.vsupplierName = this._GRNList.userFormGroup.get('SupplierId').value;
        }

        var m_data = {
            'SupplierName': `${this.vsupplierName}%`
        }
        this._GRNList.getSupplierSearchList(m_data).subscribe(data => {
            this.filteredOptionssupplier = data;
            if (this.filteredOptionssupplier.length == 0) {
                this.noOptionFoundsupplier = true;
            } else {
                this.noOptionFoundsupplier = false;
            }

            //for grn update wiil get the supplier id
            if (this.data.chkNewGRN == 2) {
                const toSelectSUpplierId = this.filteredOptionssupplier.find(c => c.SupplierId == this.registerObj.SupplierId);
                this._GRNList.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
                this.vMobile = toSelectSUpplierId.Mobile;
                this.vContact = toSelectSUpplierId.ContactPerson;
                this.vSupplierId = toSelectSUpplierId.SupplierName;
                this._GRNList.userFormGroup.get('SupplierId').setValue(this.filteredOptionssupplier[0]);
            }
            //for grn againt po wiil get the supplier id
            else if (this.vPurchaseOrderSupplierId) {
                const toSelectSUpplierId = this.filteredOptionssupplier.find(c => c.SupplierName == this.vPurchaseOrderSupplierId);
                this._GRNList.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
                this.vMobile = toSelectSUpplierId.Mobile;
                this.vContact = toSelectSUpplierId.ContactPerson;
                this.vSupplierId = toSelectSUpplierId.SupplierName;
                this._GRNList.userFormGroup.get('SupplierId').setValue(this.filteredOptionssupplier[0]);
            }
        });
    }
    getSelectedSupplierObj(obj) {
        this.vMobile = obj.Mobile;
        this.vContact = obj.ContactPerson;
        this.SupplierId = obj.SupplierId;
        this.vcheckSupplierId = obj.SupplierId;
    }
    getOptionTextSupplier(option) {
        return option && option.SupplierName ? option.SupplierName : '';
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    getGRNItemDetailList(el) {
        this.sIsLoading = 'loading-data';
        var Param = {
            "GRNID": el.GRNID
        }
        console.log(Param);
        this._GRNList.getGrnItemDetailList(Param).subscribe(data => {
            this.dsItemNameList.data = data as ItemNameList[];
            this.chargeslist = data as ItemNameList[];
            this.dsTempItemNameList.data = data as ItemNameList[];
            this.sIsLoading = '';
            this.PoID = this.dsItemNameList.data[0].PurchaseId
            console.log(this.dsItemNameList);

            console.log(this.PoID);
        },
            error => {
                this.sIsLoading = '';
            });
    }

    getPOItemDetailList(el) {
        var Param = {
            "PurchaseId": el.PurchaseID
        }
        this._GRNList.getGrnItemDetailList(Param).subscribe(data => {
            this.dsItemNameList.data = data as ItemNameList[];
            this.chargeslist = data as ItemNameList[];
            this.dsTempItemNameList.data = data as ItemNameList[];
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
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
    isLoading123: boolean = false;
    loading: boolean = false;
    onAdd() {
        debugger
        if ((this.vItemName == '' || this.vItemName == null || this.vItemName == undefined)) {
            this.toastr.warning('Please enter a ItemName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vConversionFactor == '' || this.vConversionFactor == null || this.vConversionFactor == 0)) {
            this.toastr.warning('Please check packing is zero', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vBatchNo == '' || this.vBatchNo == null || this.vBatchNo == undefined)) {
            this.toastr.warning('Please enter a Batch No', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vlastDay == '' || this.vlastDay == null || this.vlastDay == undefined)) {
            this.toastr.warning('Please enter a Expairy Date', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const expDatePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!expDatePattern.test(this._GRNList.userFormGroup.get('ExpDatess').value)) {
            this.toastr.warning('Invalid Expiry Date format. Expected MMYYYY', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return; 
        }  

        if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
            this.toastr.warning('Please enter a Qty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vMRP == '' || this.vMRP == null || this.vMRP == undefined)) {
            this.toastr.warning('Please enter a MRP', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vRate == '' || this.vRate == null || this.vRate == undefined)) {
            this.toastr.warning('Please enter a Rate', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const isDuplicate = this.dsItemNameList.data.some(item => item.BatchNo === this._GRNList.userFormGroup.get('BatchNo').value);

        if (!isDuplicate) {
            this.loading = true;
            this.dsItemNameList.data = [];
            this.chargeslist = this.dsTempItemNameList.data;
            this.chargeslist.push(
                {
                    ItemId: this._GRNList.userFormGroup.get('ItemName').value.ItemID || 0,
                    ItemName: this._GRNList.userFormGroup.get('ItemName').value.ItemName || '',
                    ConversionFactor: this.vConversionFactor || 0,
                    UOMId: this.vUOM,
                    HSNcode: this.vHSNCode,
                    BatchNo: this.vBatchNo,
                    BatchExpDate: this.vlastDay,// this.datePipe.transform(this.lastDay, "yyyy-MM-dd"),
                    ReceiveQty: this.vQty || 0,
                    FreeQty: this.vFreeQty || 0,
                    TotalQty: this.FinalTotalQty || 0,
                    MRP: this.vMRP || 0,
                    Rate: this.vRate || 0,
                    TotalAmount: this.vTotalAmount || 0,
                    DiscPercentage: this.vDisc || 0,
                    DiscAmount: this.vDisAmount || 0,
                    DiscPer2: this.vDisc2 || 0,
                    DiscAmt2: this.vDisAmount2 || 0,
                    VatPercentage: this.vGST || 0,
                    VatAmount: this.vGSTAmount || 0,
                    CGSTPer: this.vCGST || 0,
                    CGSTAmt: this.vCGSTAmount || 0,
                    SGSTPer: this.vSGST || 0,
                    SGSTAmt: this.vSGSTAmount || 0,
                    IGSTPer: this.vIGST || 0,
                    IGSTAmt: this.vIGSTAmount || 0,
                    NetAmount: this.vNetAmount || 0,
                    PurchaseId: 0,
                    PurDetId: 0,
                    POBalQty: 0,
                    POQty: 0,
                    LandedRate: this.FinalLandedrate || 0,
                    PurUnitRate: this.FinalpurUnitRate || 0,
                    PurUnitRateWF: this.FinalpurUnitrateWF || 0,
                    UnitMRP: this.FinalUnitMRP || 0,
                    IsVerifiedUserId: 0,
                    IsVerified: false,
                    IsVerifiedDatetime: "01/01/1900",
                    StkID: 0
                });
            console.log(this.chargeslist)
            setTimeout(() => {
                this.dsItemNameList.data = this.chargeslist;
                this.loading = false;
            }, 3000);
        }
        else {
            this.toastr.warning('Selected Batch Item already added in the list', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.loading = false;
        }
        this.ItemReset();
        //this.date.setValue(new Date());
        this._GRNList.userFormGroup.get('ItemName').setValue('');
        //this.vNetAmount = 0;
        this.itemid.nativeElement.focus();
        //this.add = false;
        //this.vlastDay = '';
    }

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
    getOptionTextPayment(option) {
        return option && option.StoreName ? option.StoreName : '';
    }
    // getSelectedObjSupp(obj) {
    //   this.SupplierId = obj.SupplierId;
    // }

    getOptionText(option) {
        if (!option)
            return '';
        return option.ItemName;  // + ' ' + option.Price ; //+ ' (' + option.TariffId + ')';
    }
 
getGSTChkList(){ 
    let Query = "select GSTPer from ss_gstper_config"
    this._GRNList.checkGSTPer(Query).subscribe(data => {
        this.ChekGSTPer = data;
        console.log(this.ChekGSTPer)
    }) 
}
 
chckgst0:any = 0;
chckgst2:any = 2.5;
chckgst6:any = 6;
chckgst9:any = 9;
chckgst14:any = 14;
ChekGSTPer:any=[];
chkgsts:any=[];
    getCellCalculation(contact, ReceiveQty) {
        if (contact.PurchaseId > 0) {
            if (contact.ReceiveQty > contact.POQty) {
                Swal.fire("Qty Should Be less than PO Qty")
            } else {
                contact.POBalQty = ((contact.POQty) - (contact.ReceiveQty))
            }
        }  
debugger
        if (contact.VatPercentage > 0) {
            console.log(this.ChekGSTPer)
            if (parseFloat(contact.CGSTPer) >= 2.5 ) {
                const dvalue = this.ChekGSTPer.find(item => item.GSTPer == parseFloat(contact.CGSTPer))
                console.log(dvalue)
                if (!dvalue) {
                    this.toastr.warning('Please enter CGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    contact.CGSTPer = '';
                    return
                }
            }
            if (parseFloat(contact.SGSTPer) >= 2.5) {
                const dvalue1 = this.ChekGSTPer.find(item => item.GSTPer == parseFloat(contact.SGSTPer))
                console.log(dvalue1)
                if (!dvalue1) {
                    this.toastr.warning('Please enter SGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    contact.SGSTPer = '';
                    return
                }
            }
            if (parseFloat(contact.IGSTPer) >= 2.5) {
                const dvalue3 = this.ChekGSTPer.find(item => item.GSTPer == parseFloat(contact.IGSTPer))
                console.log(dvalue3)
                if (!dvalue3) {
                    this.toastr.warning('Please enter IGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    contact.IGSTPer = 0;
                    return
                }
            }
        }  
 


        // if(contact.CGSTPer > 0){
        //     if(!(parseFloat(contact.CGSTPer) == parseFloat(this.chckgst2) || contact.CGSTPer == this.chckgst6 || contact.CGSTPer == this.chckgst9 || contact.CGSTPer == this.chckgst14)){
        //         this.toastr.warning('Please enter CGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
        //             toastClass: 'tostr-tost custom-toast-warning',
        //         });
        //         contact.CGSTPer = '';
        //         return
        //     }
        // }
        // if(contact.SGSTPer > 0){
        //     if(!((contact.SGSTPer).toString() == parseFloat(this.chckgst2) || contact.SGSTPer == this.chckgst6 || contact.SGSTPer == this.chckgst9 || contact.SGSTPer == this.chckgst14)){
        //         this.toastr.warning('Please enter CGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
        //             toastClass: 'tostr-tost custom-toast-warning',
        //         });
        //         contact.SGSTPer = '';
        //         return
        //     }
        // }
        // if(contact.IGSTPer > 0){
        //     if(!(parseFloat(contact.IGSTPer) == parseFloat(this.chckgst2) || contact.IGSTPer == this.chckgst6 || contact.IGSTPer == this.chckgst9 || contact.IGSTPer == this.chckgst14)){
        //         this.toastr.warning('Please enter CGST percentage as 2.5%, 6%, 9% or 14%', 'Warning !', {
        //             toastClass: 'tostr-tost custom-toast-warning',
        //         });
        //         contact.IGSTPer = '';
        //         return
        //     }
        // }

        let freeqty = contact.FreeQty || 0;
        let R_qty = contact.ReceiveQty || 0
        if (contact.ConversionFactor > 0) {
            contact.TotalQty = ((parseInt(R_qty) + parseInt(freeqty)) * parseInt(contact.ConversionFactor));
        } else {
            contact.ConversionFactor = 1
            this.toastr.warning('Packing cannot be 0', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            contact.TotalQty = ((parseInt(R_qty) + parseInt(freeqty)) * parseInt(contact.ConversionFactor));
        }

        if (contact.ReceiveQty > 0 && contact.Rate > 0) {
            let IGSTPer = contact.IGSTPer || 0;
            contact.IGSTPer = IGSTPer;

            if (this._GRNList.userFormGroup.get('GSTType').value.Name == 'GST After Disc') {
                //total amt
                contact.TotalAmount = (contact.ReceiveQty * contact.Rate);
                //disc
                contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPercentage)) / 100).toFixed(2);
                let TotalAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount));
                //Gst
                contact.VatPercentage = (parseFloat(contact.CGSTPer) + parseFloat(contact.SGSTPer) + parseFloat(contact.IGSTPer)).toFixed(2)
                contact.CGSTAmt = (((TotalAmt) * parseFloat(contact.CGSTPer)) / 100);
                contact.SGSTAmt = (((TotalAmt) * parseFloat(contact.SGSTPer)) / 100);
                contact.IGSTAmt = (((TotalAmt) * parseFloat(contact.IGSTPer)) / 100);
                //contact.VatAmount = ((contact.CGSTAmt) + (contact.SGSTAmt) + (contact.IGSTAmt));
                contact.VatAmount = (((TotalAmt) * parseFloat(contact.VatPercentage)) / 100).toFixed(2);
                contact.NetAmount = ((TotalAmt) + parseFloat(contact.VatAmount));

            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == 'GST Before Disc') {


                //total amt
                contact.TotalAmount = parseFloat(contact.ReceiveQty) * parseFloat(contact.Rate);
                //Gst
                contact.VatPercentage = (parseFloat(contact.CGSTPer) + parseFloat(contact.SGSTPer) + parseFloat(contact.IGSTPer));

                contact.CGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(contact.CGSTPer)) / 100);
                contact.SGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(contact.SGSTPer)) / 100);
                contact.IGSTAmt = ((parseFloat(contact.TotalAmount) * parseFloat(contact.IGSTPer)) / 100);
                contact.VatAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.VatPercentage)) / 100);
                let totalAmt = (parseFloat(contact.TotalAmount) + parseFloat(contact.VatAmount));
                //disc
                contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPercentage)) / 100);
                contact.NetAmount = ((totalAmt) - parseFloat(contact.DiscAmount));


            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST After TwoTime Disc") {

                //total amt
                contact.TotalAmount = parseFloat(contact.ReceiveQty) * parseFloat(contact.Rate);
                //disc 1
                contact.DiscAmount = ((parseFloat(contact.TotalAmount) * parseFloat(contact.DiscPercentage)) / 100)
                let totalamt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount));
                //disc 2
                contact.DiscAmt2 = (((totalamt) * parseFloat(contact.DiscPer2)) / 100);
                let totalamt2 = ((totalamt) - parseFloat(contact.DiscAmt2));
                //GST cal
                contact.VatPercentage = (parseFloat(contact.CGSTPer) + parseFloat(contact.SGSTPer) + parseFloat(contact.IGSTPer))
                contact.CGSTAmt = (((totalamt2) * parseFloat(contact.CGSTPer)) / 100);
                contact.SGSTAmt = (((totalamt2) * parseFloat(contact.SGSTPer)) / 100);
                contact.IGSTAmt = (((totalamt2) * parseFloat(contact.IGSTPer)) / 100);
                // contact.VatAmount = ((contact.CGSTAmt) + (contact.SGSTAmt) + (contact.IGSTAmt));
                contact.VatAmount = (((totalamt2) * parseFloat(contact.VatPercentage)) / 100);
                contact.NetAmount = ((totalamt2) + parseFloat(contact.VatAmount)).toFixed(2);

            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST on MRP Plus FreeQty") {
                let mrpTotal = (parseFloat(contact.TotalQty) * parseFloat(contact.ConversionFactor) * parseFloat(contact.MRP));
                let Totalmrp = ((mrpTotal * 100) / (100 + contact.VatPercentage));
                //GST cal
                contact.VatPercentage = (parseFloat(contact.CGSTPer) + parseFloat(contact.SGSTPer) + parseFloat(contact.IGSTPer))
                contact.CGSTAmt = (((Totalmrp) * parseFloat(contact.CGSTPer)) / 100);
                contact.SGSTAmt = (((Totalmrp) * parseFloat(contact.SGSTPer)) / 100);
                contact.IGSTAmt = (((Totalmrp) * parseFloat(contact.IGSTPer)) / 100);
                // this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
                contact.VatAmount = ((Totalmrp * parseFloat(contact.VatPercentage)) / 100);
                let GrossAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount));
                contact.NetAmount = ((GrossAmt) + parseFloat(contact.VatAmount));
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST on Pur Plus FreeQty") {
                let TotalPurWf = (parseFloat(contact.TotalQty) * parseFloat(contact.Rate));
                //GST cal
                contact.VatPercentage = (parseFloat(contact.CGSTPer) + parseFloat(contact.SGSTPer) + parseFloat(contact.IGSTPer))
                contact.CGSTAmt = (((TotalPurWf) * parseFloat(contact.CGSTPer)) / 100);
                contact.SGSTAmt = (((TotalPurWf) * parseFloat(contact.SGSTPer)) / 100);
                contact.IGSTAmt = (((TotalPurWf) * parseFloat(contact.IGSTPer)) / 100);
                contact.VatAmount = ((TotalPurWf * parseFloat(contact.VatPercentage)) / 100);
                let GrossAmt = (parseFloat(contact.TotalAmount) + parseFloat(contact.VatPercentage));
                contact.NetAmount = ((GrossAmt) - parseFloat(contact.DiscAmount));
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST On MRP") {
                let mrpTotal = (parseFloat(contact.ReceiveQty) * parseFloat(contact.ConversionFactor) * parseFloat(contact.MRP));
                let Totalmrp = ((mrpTotal * 100) / (100 + contact.VatPercentage));
                //GST cal
                contact.VatPercentage = (parseFloat(contact.CGSTPer) + parseFloat(contact.SGSTPer) + parseFloat(contact.IGSTPer))
                contact.CGSTAmt = (((Totalmrp) * parseFloat(contact.CGSTPer)) / 100);
                contact.SGSTAmt = (((Totalmrp) * parseFloat(contact.SGSTPer)) / 100);
                contact.IGSTAmt = (((Totalmrp) * parseFloat(contact.IGSTPer)) / 100);

                contact.VatAmount = ((Totalmrp * parseFloat(contact.VatPercentage)) / 100);
                let GrossAmt = (parseFloat(contact.TotalAmount) - parseFloat(contact.DiscAmount));
                contact.NetAmount = ((GrossAmt) + parseFloat(contact.VatAmount));
            }

            //LandedRate As New Double
            contact.LandedRate = parseFloat(contact.NetAmount) / parseFloat(contact.TotalQty);
            ///PurUnitRate
            contact.PurUnitRate = (parseFloat(contact.TotalAmount) / (parseInt(contact.ReceiveQty) * parseInt(contact.ConversionFactor)));
            //PurUnitRateWF
            contact.PurUnitRateWF = ((parseFloat(contact.TotalAmount) / parseFloat(contact.TotalQty)));
            contact.UnitMRP = (parseFloat(contact.MRP) / parseFloat(contact.ConversionFactor));

        }
        else {
            contact.TotalAmount = 0;
            contact.DiscAmount = 0;
            contact.DiscAmt2 = 0;
            contact.CGSTAmt = 0;
            contact.SGSTAmt = 0;
            contact.IGSTAmt = 0;
            contact.VatAmount = 0;
            contact.NetAmount = 0;
        }
        
    }
    calculateTotalamt() {
        let Qty = this._GRNList.userFormGroup.get('Qty').value;
        let freeqty = this._GRNList.userFormGroup.get('FreeQty').value || 0;
        this.FinalTotalQty = ((parseInt(Qty) + parseInt(freeqty)) * parseInt(this.vConversionFactor));

        if (Qty > 0 && this.vRate > 0) {
            if (Qty && this.vRate) {
                this.vTotalAmount = (parseFloat(this.vRate) * parseInt(Qty)).toFixed(2);
                this.vNetAmount = parseFloat(this.vTotalAmount);
                this._GRNList.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
            }
        } else {
            this._GRNList.userFormGroup.get('TotalAmount').setValue(0);
            this._GRNList.userFormGroup.get('DisAmount').setValue(0);
            this._GRNList.userFormGroup.get('DisAmount2').setValue(0);
            this._GRNList.userFormGroup.get('CGSTAmount').setValue(0);
            this._GRNList.userFormGroup.get('SGSTAmount').setValue(0);
            this._GRNList.userFormGroup.get('GSTAmount').setValue(0);
            this._GRNList.userFormGroup.get('NetAmount').setValue(0);
        }
        this.calculateDiscperAmount();
    }
    calculateDiscperAmount() {
        let IGSTPer = 0;
        this.vIGST = IGSTPer
        let disc = this._GRNList.userFormGroup.get('Disc').value || 0;
        if (disc >= 100) {
            //Swal.fire("Enter Discount less than 100");
            this.toastr.warning('Enter Discount less than 100', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this._GRNList.userFormGroup.get('Disc').setValue('');
        }
        if (disc >= 0) {
            let disc = this._GRNList.userFormGroup.get('Disc').value || 0;
            let TotalAmt = 0, TotalAmt2 = "0";
            this.vGST = parseFloat(this.vCGST) + parseFloat(this.vSGST) + parseFloat(this.vIGST);
            if (this._GRNList.userFormGroup.get('GSTType').value.Name == 'GST After Disc') {
                //disc
                this.vDisAmount = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
                TotalAmt = parseFloat(this.vTotalAmount) - parseFloat(this.vDisAmount);
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == 'GST Before Disc') {
                TotalAmt = parseFloat(this.vTotalAmount);
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST After TwoTime Disc") {
                this.isDisc2Selected = true;
                let dics2 = this.vDisc2 || 0;
                this.vDisAmount = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
                TotalAmt2 = (parseFloat(this.vTotalAmount) - parseFloat(this.vDisAmount)).toFixed(2);
                this.vDisAmount2 = ((parseFloat(TotalAmt2) * parseFloat(dics2)) / 100).toFixed(2);
                TotalAmt = parseFloat(TotalAmt2) - parseFloat(this.vDisAmount2);
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST on MRP Plus FreeQty") {
                let mrpTotal = ((this.FinalTotalQty) * (this.vConversionFactor) * (this.vMRP));
                TotalAmt = (mrpTotal * 100) / (100 + this.vGST);
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST on Pur Plus FreeQty") {
                let TotalAmt = ((this.FinalTotalQty) * (this.vRate)).toFixed(2);
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST On MRP") {
                let mrpTotal = ((this.vQty) * (this.vConversionFactor) * (this.vMRP));
                TotalAmt = (mrpTotal * 100) / (100 + this.vGST);
            }
            //Gst
            this.vCGSTAmount = (TotalAmt * parseFloat(this.vCGST) / 100).toFixed(2);
            this.vSGSTAmount = (TotalAmt * parseFloat(this.vSGST) / 100).toFixed(2);
            this.vIGSTAmount = (TotalAmt * parseFloat(this.vIGST) / 100).toFixed(2);
            this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
            this.vNetAmount = (TotalAmt + parseFloat(this.vGSTAmount)).toFixed(2);

            if (this._GRNList.userFormGroup.get('GSTType').value.Name == 'GST Before Disc') {
                TotalAmt = parseFloat(this.vTotalAmount) + parseFloat(this.vGSTAmount);
                this.vDisAmount = ((parseFloat(this.vTotalAmount) * parseFloat(disc)) / 100).toFixed(2);
                this.vNetAmount = (TotalAmt - parseFloat(this.vDisAmount)).toFixed(2);
            }
            else if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST on MRP Plus FreeQty" ||
                this._GRNList.userFormGroup.get('GSTType').value.Name == "GST on Pur Plus FreeQty" ||
                this._GRNList.userFormGroup.get('GSTType').value.Name == "GST On MRP") {
                this.vGSTAmount = ((TotalAmt * parseFloat(this.vGST)) / 100).toFixed(2);
                let GrossAmt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDisAmount)).toFixed(2);
                this.vNetAmount = (parseFloat(GrossAmt) + parseFloat(this.vGSTAmount)).toFixed(2);
            }
        }
        this.FinalLandedrate = (parseInt(this.vNetAmount) / parseInt(this.FinalTotalQty)) || 0,
            this.FinalpurUnitRate = (parseInt(this.vTotalAmount) / (parseInt(this.vQty) * parseInt(this.vConversionFactor))) || 0
        this.FinalpurUnitrateWF = (parseInt(this.vTotalAmount) / parseInt(this.FinalTotalQty)) || 0
        this.FinalUnitMRP = (this.vMRP / this.vConversionFactor) || 0
        // this.add = true
        // this.addbutton.nativeElement.focus();
    }
    calculateDiscAmount() {
        let IGSTPer = 0;
        this.vIGST = IGSTPer
        let discAmount1 = this._GRNList.userFormGroup.get('DisAmount').value;
        if (discAmount1 >= 100) {
            //Swal.fire("Enter Discount less than 100");
            this.toastr.warning('Enter Discount less than 100', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this._GRNList.userFormGroup.get('Disc').setValue('');
        }
        if (discAmount1 >= 0) {
            let discAmount1 = this._GRNList.userFormGroup.get('DisAmount').value;
            if (this._GRNList.userFormGroup.get('GSTType').value.Name == 'GST After Disc') {
                //disc
                this.vDisc = ((parseFloat(discAmount1) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
                let TotalAmt = (parseFloat(this.vTotalAmount) - parseFloat(discAmount1)).toFixed(2);
                //Gst
                this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
                this.vCGSTAmount = ((parseFloat(TotalAmt) * parseFloat(this.vCGST)) / 100).toFixed(2);
                this.vSGSTAmount = ((parseFloat(TotalAmt) * parseFloat(this.vSGST)) / 100).toFixed(2);
                this.vIGSTAmount = ((parseFloat(TotalAmt) * parseFloat(this.vIGST)) / 100).toFixed(2);
                this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
                this.vNetAmount = ((parseFloat(TotalAmt) + parseFloat(this.vGSTAmount))).toFixed(2);
            } else {
                //Gst
                this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
                this.vCGSTAmount = ((parseFloat(this.vTotalAmount) * parseFloat(this.vCGST)) / 100).toFixed(2);
                this.vSGSTAmount = ((parseFloat(this.vTotalAmount) * parseFloat(this.vSGST)) / 100).toFixed(2);
                this.vIGSTAmount = ((parseFloat(this.vTotalAmount) * parseFloat(this.vIGST)) / 100).toFixed(2);
                this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
                let TotalAmt = (parseFloat(this.vTotalAmount) + parseFloat(this.vGSTAmount)).toFixed(2);
                this.vDisc = ((parseFloat(discAmount1) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
                this.vNetAmount = (parseFloat(TotalAmt) - parseFloat(discAmount1)).toFixed(2);
            }
        }
        this.FinalLandedrate = (parseInt(this.vNetAmount) / parseInt(this.FinalTotalQty)) || 0,
            this.FinalpurUnitRate = (parseInt(this.vTotalAmount) / (parseInt(this.vQty) * parseInt(this.vConversionFactor))) || 0
        this.FinalpurUnitrateWF = (parseInt(this.vTotalAmount) / parseInt(this.FinalTotalQty) * parseInt(this.vConversionFactor)) || 0
    }

    calculateDiscAmt() {
        let discamt1 = ((parseFloat(this.vDisAmount) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
        this.vDisc = discamt1;
        let discamt2 = ((parseFloat(this.vDisAmount2) / parseFloat(this.vTotalAmount)) * 100).toFixed(2);
        this.vDisc2 = discamt2;
    }

    finalCalculation() {
        this.calculateTotalamt();
        this.calculateDiscperAmount();
        this.calculateDiscperAmount();
        if (this.dsItemNameList.data.length > 0) {
            for (let i = 0; i < this.dsItemNameList.data.length; i++) {
                this.getCellCalculation(this.dsItemNameList.data[i], null);
            }
        }
        this.calculateDiscAmount();
    }
    OnchekPurchaserateValidation() {


        if (this.vRate) {
            if (parseFloat(this.vRate) <= parseFloat(this.vMRP)) {
                this.calculateTotalamt();
            } else {
                this.toastr.warning('Enter Purchase Rate less than MRP', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                this._GRNList.userFormGroup.get('Rate').setValue(0);
                this._GRNList.userFormGroup.get('TotalAmount').setValue(0);
                this._GRNList.userFormGroup.get('DisAmount').setValue(0);
                this._GRNList.userFormGroup.get('DisAmount2').setValue(0);
                this._GRNList.userFormGroup.get('CGSTAmount').setValue(0);
                this._GRNList.userFormGroup.get('SGSTAmount').setValue(0);
                this._GRNList.userFormGroup.get('GSTAmount').setValue(0);
                this._GRNList.userFormGroup.get('NetAmount').setValue(0);
                this.rate.nativeElement.focus();
            }
        }
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
        if(CreditAmount > 0 && this.dsItemNameList.data.length > 0){
            if(CreditAmount > FinalRoundAmt && !this.dsItemNameList.data.length){
                this.toastr.warning('check credit amount should not be greater than net amount', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                }); 
            }else{
                FinalRoundAmt = (parseFloat(FinalRoundAmt) - parseFloat(CreditAmount));
            } 
        }
      
        let FinalnetAmt = FinalRoundAmt;
        this.vFinalNetAmount = Math.round(FinalnetAmt).toFixed(2); //(element.reduce((sum, { RoundNetAmt }) => sum += +(RoundNetAmt || 0), 0)).toFixed(2) || Math.round(this.FinalNetAmount);
        this.vDiffNetRoundAmt = (parseFloat(this.vFinalNetAmount) - (FinalnetAmt)).toFixed(2);

        return this.vTotalFinalAmount;
    }

    AutoRoundingAmt() {
        let roundingamt = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
        if (roundingamt > 0) {
            let FinalnetAmt = (parseFloat(this.NetAmount) + parseFloat(roundingamt)).toFixed(2);
            this._GRNList.GRNFinalForm.get('NetPayamt').setValue(FinalnetAmt);

        } else {
            let FinalnetAmt = (parseFloat(this.NetAmount) + parseFloat(roundingamt)).toFixed(2);
            this._GRNList.GRNFinalForm.get('NetPayamt').setValue(FinalnetAmt);
        }

    }
    isDisc2Selected: boolean = false;
    onChangeDisc2(event) {
        // debugger
        if (event.value.Name == "GST After TwoTime Disc") {

            this.isDisc2Selected = true;
        } else {
            // this.isDisc2Selected = false;
            // this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
            // this.VisitFormGroup.get('CompanyId').clearValidators();
            // this.VisitFormGroup.get('SubCompanyId').clearValidators();
            // this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
            // this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
        }
    }
    calculateDiscper2Amt() {

        //disc 1
        let disc2 = this.vDisc2 || 0;
        let totalamt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDisAmount)).toFixed(2);
        console.log(totalamt)
        //disc 2
        this.vDisAmount2 = ((parseFloat(totalamt) * parseFloat(disc2)) / 100).toFixed(2);
        let totalamt2 = (parseFloat(totalamt) - parseFloat(this.vDisAmount2)).toFixed(2);
        console.log(this.vDisAmount2)
        //let discamt = this.vDisAmount + this.vDisAmount2 
        //GST cal
        this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
        this.vCGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vCGST)) / 100).toFixed(2);
        this.vSGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vSGST)) / 100).toFixed(2);
        this.vIGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vIGST)) / 100).toFixed(2);
        this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);

        this.vGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vGST)) / 100).toFixed(2);
        this.vNetAmount = (parseFloat(totalamt2) + parseFloat(this.vGSTAmount)).toFixed(2);
    }
    calculateGSTType(event) {
        if (event.value.Name == "GST After Disc") {

            // this._GRNList.userFormGroup.get('').disabled();
            this.vIGST = 0;
            let totalamt = this.vTotalAmount - this._GRNList.userFormGroup.get('DisAmount').value
            this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));

            this.vCGSTAmount = ((totalamt * parseFloat(this.vCGST)) / 100).toFixed(2);
            this.vSGSTAmount = ((totalamt * parseFloat(this.vSGST)) / 100).toFixed(2);
            this.vIGSTAmount = ((totalamt * parseFloat(this.vIGST)) / 100).toFixed(2);
            this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);

            this.vNetAmount = (totalamt + parseFloat(this.vGSTAmount)).toFixed(2);
            this._GRNList.userFormGroup.get('NetAmount').setValue(this.vNetAmount);

        }
        else if (event.value.Name == "GST Before Disc") {
            this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
            this.vCGSTAmount = ((this.vTotalAmount * parseFloat(this.vCGST)) / 100).toFixed(2);
            this.vSGSTAmount = ((this.vTotalAmount * parseFloat(this.vSGST)) / 100).toFixed(2);
            this.vIGSTAmount = ((this.vTotalAmount * parseFloat(this.vIGST)) / 100).toFixed(2);
            this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);

            this.GSTAmt = ((this.vTotalAmount * parseFloat(this.GSTPer)) / 100).toFixed(2);
            this.vNetAmount = (parseFloat(this.vTotalAmount) - parseFloat(this._GRNList.userFormGroup.get('DisAmount').value) + parseFloat(this.vGSTAmount)).toFixed(2);
            this._GRNList.userFormGroup.get('NetAmount').setValue(this.vNetAmount);
        }
        else if (event.value.Name == "GST on MRP Plus FreeQty") {
            let mrpTotal = ((this.FinalTotalQty) * (this.vConversionFactor) * (this.vMRP));
            let Totalmrp = ((mrpTotal * 100) / (100 + this.vGST));
            //GST cal
            this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
            this.vCGSTAmount = ((Totalmrp * parseFloat(this.vCGST)) / 100).toFixed(2);
            this.vSGSTAmount = ((Totalmrp * parseFloat(this.vSGST)) / 100).toFixed(2);
            this.vIGSTAmount = ((Totalmrp * parseFloat(this.vIGST)) / 100).toFixed(2);
            this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
            //
            this.vGSTAmount = ((Totalmrp * parseFloat(this.vGST)) / 100).toFixed(2);
            let GrossAmt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDisAmount)).toFixed(2);
            this.vNetAmount = (parseFloat(GrossAmt) + parseFloat(this.vGSTAmount)).toFixed(2);
        }
        else if (event.value.Name == "GST on Pur Plus FreeQty") {
            let TotalPurWf = ((this.FinalTotalQty) * (this.vRate));
            //GST cal
            this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
            this.vCGSTAmount = ((TotalPurWf * parseFloat(this.vCGST)) / 100).toFixed(2);
            this.vSGSTAmount = ((TotalPurWf * parseFloat(this.vSGST)) / 100).toFixed(2);
            this.vIGSTAmount = ((TotalPurWf * parseFloat(this.vIGST)) / 100).toFixed(2);
            this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);
            //
            this.vGSTAmount = ((TotalPurWf * parseFloat(this.vGST)) / 100).toFixed(2);
            let GrossAmt = (parseFloat(this.vTotalAmount) + parseFloat(this.vGSTAmount)).toFixed(2);
            this.vNetAmount = (parseFloat(GrossAmt) - parseFloat(this.vDisAmount)).toFixed(2);
        }
        else if (event.value.Name == "GST On MRP") {
            let mrpTotal = ((this.vQty) * (this.vConversionFactor) * (this.vMRP));
            let Totalmrp = ((mrpTotal * 100) / (100 + this.vGST));
            //GST cal
            this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
            this.vCGSTAmount = ((Totalmrp * parseFloat(this.vCGST)) / 100).toFixed(2);
            this.vSGSTAmount = ((Totalmrp * parseFloat(this.vSGST)) / 100).toFixed(2);
            this.vIGSTAmount = ((Totalmrp * parseFloat(this.vIGST)) / 100).toFixed(2);
            this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);

            this.vGSTAmount = ((Totalmrp * parseFloat(this.vGST)) / 100).toFixed(2);
            let GrossAmt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDisAmount)).toFixed(2);
            this.vNetAmount = (parseFloat(GrossAmt) + parseFloat(this.vGSTAmount)).toFixed(2);
        }
        else if (event.value.Name == "GST After TwoTime Disc") {
            this.isDisc2Selected = true;
            //disc 1
            this.vDisAmount = (((this.vTotalAmount) * (this.vDisc)) / 100);
            let totalamt = (parseFloat(this.vTotalAmount) - parseFloat(this.vDisAmount)).toFixed(2);
            //disc 2
            let disc2: any = 0;
            disc2 = this.vDisc2;
            this.vDisAmount2 = ((parseFloat(totalamt) * parseFloat(disc2)) / 100).toFixed(2);
            let totalamt2 = (parseFloat(totalamt) - parseFloat(this.vDisAmount2)).toFixed(2);

            //GST cal
            this.vGST = ((parseFloat(this.vCGST)) + (parseFloat(this.vSGST)) + (parseFloat(this.vIGST)));
            this.vCGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vCGST)) / 100).toFixed(2);
            this.vSGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vSGST)) / 100).toFixed(2);
            this.vIGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vIGST)) / 100).toFixed(2);
            this.vGSTAmount = ((parseFloat(this.vCGSTAmount)) + (parseFloat(this.vSGSTAmount)) + (parseFloat(this.vIGSTAmount))).toFixed(2);

            this.vGSTAmount = ((parseFloat(totalamt2) * parseFloat(this.vGST)) / 100).toFixed(2);
            this.vNetAmount = (parseFloat(totalamt2) + parseFloat(this.vGSTAmount)).toFixed(2);
        }
        else {
            this.isDisc2Selected = false;
        }
        // this.getCellCalculation();

    }
    gePharStoreList() {
        var vdata = {
            Id: this.accountService.currentUserValue.user.storeId
        }
        this._GRNList.getLoggedStoreList(vdata).subscribe(data => {
            this.StoreList = data;
            this._GRNList.GRNStoreForm.get('StoreId').setValue(this.StoreList[0]);
        });
    }
    getSelectedObj(obj) {
        this.ItemID = obj.ItemId;
        this.ItemName = obj.ItemName;
        this.vConversionFactor = obj.ConversionFactor;
        this.vQty = '',
            this.vUOM = obj.UnitofMeasurementId;
        this.vHSNCode = obj.HSNcode;
        this.vRate = '',
            this.vTotalAmount = (parseInt(this.vQty) * parseFloat(this.vRate)).toFixed(2);
        this.vDisc = '';
        this.vDisc2 = '';
        this.vDisAmount = 0;
        this.vDisAmount2 = 0;
        this.vNetAmount = this.vTotalAmount;
        this.VatPercentage = obj.VatPercentage;
        this.vSGST = obj.SGSTPer || 0;
        this.vCGST = obj.CGSTPer || 0;
        this.vIGST = obj.IGSTPer || 0;
        this.GSTPer = obj.GSTPer || 0;
        this.vGSTAmount = 0;
        this.vMRP = obj.UnitMRP;
        this.Specification = obj.Specification;
        this.batchno.nativeElement.focus();
        this.getLastThreeItemInfo();
    }
    private _filterStore(value: any): string[] {
        if (value) {
            const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
            return this.optionsToStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
        }
    }
    private _filterItemName(value: any): string[] {
        if (value) {
            const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
            return this.optionsItemName.filter(option => option.ItemName.toLowerCase().includes(filterValue));
        }
    }
    getGRNItemList() {
        var m_data = {
            "ItemName": `${this._GRNList.userFormGroup.get('ItemName').value}%`,
            "StoreId": this._GRNList.GRNStoreForm.get('StoreId').value.storeid
        }
        this._GRNList.getItemNameList(m_data).subscribe(data => {
            this.filteredOptions = data;
            if (this.filteredOptions.length == 0) {
                this.noOptionFound = true;
            } else {
                this.noOptionFound = false;
            }
        });
    }
    getSupplierSearchList1() {
        var vdata = {
            'SupplierName': `${this._GRNList.userFormGroup.get('SupplierId').value}%`,
        }
        this._GRNList.getSupplierSearchList(vdata).subscribe(data => {
            this.SupplierList = data;
        });
    }
    focusNextService() {
        this.renderer.selectRootElement('#myInput').focus();
    }
    OnReset() {
        this._GRNList.userFormGroup.reset();
        this._GRNList.GRNFinalForm.reset();
        this.dsLastThreeItemList.data = [];
        this.dsItemNameList.data = [];
    }
    delete(elm) {
        this.dsItemNameList.data = this.dsItemNameList.data
            .filter(i => i !== elm)
            .map((i, idx) => (i.position = (idx + 1), i));
    }
    deleteTableRow(element) {
        if (element.IsVerifiedUserId == 1) {
            this.toastr.warning('Verified Record should not be Deleted .', 'Deleted !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        } else {
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
    keyPressCharater(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    vTotalQty: any = 0
    OnSave() {
        debugger
        if ((this._GRNList.userFormGroup.get('InvoiceNo').value == "" || this._GRNList.userFormGroup.get('InvoiceNo').value == null)) {
            this.toastr.warning('Please enter a InvoiceNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        } 
        if ((!this.dsItemNameList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
      
        if ((this._GRNList.GRNFinalForm.get('ReceivedBy').value == "" || this._GRNList.GRNFinalForm.get('ReceivedBy').value == null ||
            this._GRNList.GRNFinalForm.get('ReceivedBy').value == undefined)) {
            this.toastr.warning('Please enter a Received By', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this._GRNList.GRNFinalForm.invalid) {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        } 
        const expDatePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        this.dsItemNameList.data.forEach(element=>{
            if (!expDatePattern.test(element.BatchExpDate)) {
                this.toastr.warning('Invalid Expiry Date format. Expected MMYYYY', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return; 
            }  
        })

       
        const checkTotalQty = this.dsItemNameList.data.some(item => item.TotalQty === this.vTotalQty && item.TotalQty == null);
        //this.isLoading123 = true;
        if (!checkTotalQty) {
            Swal.fire({
                title: 'Do you want to Save the GRN ',
                text: "You able to edit after save this !",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, Save!"

            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    if (!this.vPurchaseId) {
                        if (this.data.chkNewGRN == 1) {
                            this.OnSavenew();
                        } else if (this.data.chkNewGRN == 2) {
                            if (this.PoID > 0) {
                                this.OnEditPO();
                            }
                            else {
                                this.OnSaveEdit();
                                this.viewGRNREPORTPdf(this.registerObj.GRNID)
                            }
                        }
                    } else {
                        this.OnSavePO();
                    }
                }
            })
        } else {
            this.toastr.warning('We found TotalQty column value is 0 please check', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }  
    }
    Savebtn: boolean = false;
    OnSavePO() {
        if ((!this.dsItemNameList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this._GRNList.GRNFinalForm.invalid) {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        let nowDate = new Date();
        let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
        this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
        //
       // this.Savebtn = true;
        let grnSaveObj = {};
        grnSaveObj['grnDate'] = this.dateTimeObj.date;
        grnSaveObj['grnTime'] = this.dateTimeObj.time;
        grnSaveObj['storeId'] = this.accountService.currentUserValue.user.storeId;
        grnSaveObj['supplierID'] = this._GRNList.userFormGroup.get('SupplierId').value.SupplierId || this.SupplierId;
        grnSaveObj['invoiceNo'] = this._GRNList.userFormGroup.get('InvoiceNo').value || 0;
        grnSaveObj['deliveryNo'] = 0;
        grnSaveObj['gateEntryNo'] = this._GRNList.userFormGroup.get('GateEntryNo').value || 0;
        grnSaveObj['cash_CreditType'] = this._GRNList.userFormGroup.get('PaymentType').value;
        grnSaveObj['grnType'] = this._GRNList.userFormGroup.get('GRNType').value;
        grnSaveObj['totalAmount'] = this._GRNList.GRNFinalForm.get('TotalAmt').value || 0;
        grnSaveObj['totalDiscAmount'] = this._GRNList.GRNFinalForm.get('DiscAmount').value || 0;
        grnSaveObj['totalVATAmount'] = this._GRNList.GRNFinalForm.get('VatAmount').value || 0;
        grnSaveObj['netAmount'] = this._GRNList.GRNFinalForm.get('NetPayamt').value || 0;
        grnSaveObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
        grnSaveObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
        grnSaveObj['isVerified'] = false;
        grnSaveObj['isClosed'] = false;
        grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id || 0;
        grnSaveObj['invDate'] = this._GRNList.userFormGroup.get('DateOfInvoice').value.DateOfInvoice || '01/01/1900';
        grnSaveObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
        grnSaveObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
        grnSaveObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharge').value || 0;
        grnSaveObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
        grnSaveObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('CGSTAmount').value || 0;
        grnSaveObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('SGSTAmount').value || 0;
        grnSaveObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('IGSTAmount').value || 0;
        grnSaveObj['tranProcessId'] = this._GRNList.userFormGroup.get('GSTType').value.ConstantId || 0;
        grnSaveObj['tranProcessMode'] = this._GRNList.userFormGroup.get('GSTType').value.Name || '';
        grnSaveObj['ewayBillNo'] = this._GRNList.GRNFinalForm.get('EwayBillNo').value || 0;
        grnSaveObj['ewayBillDate'] = this.datePipe.transform(this._GRNList.GRNFinalForm.get('EwalBillDate').value, "yyyy-MM-dd") || '01/01/1099';
        grnSaveObj['BillDiscAmt'] = this.vFinalDisAmount2 || 0;
        grnSaveObj['grnid'] = 0;

        let SavegrnDetailObj = [];
        this.dsItemNameList.data.forEach((element) => {

            if (element.BatchExpDate && element.BatchExpDate.length === 10) {
                const day = +element.BatchExpDate.substring(0, 2);
                const month = +element.BatchExpDate.substring(3, 5);
                const year = +element.BatchExpDate.substring(6, 10);

                this.vExpDate = `${year}/${this.pad(month)}/${day}`;
            }

            let grnDetailSaveObj = {};
            grnDetailSaveObj['grnId'] = 0;
            grnDetailSaveObj['itemId'] = element.ItemId || 0;
            grnDetailSaveObj['uomId'] = element.UOMId || 0;
            grnDetailSaveObj['receiveQty'] = element.ReceiveQty || 0;
            grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
            grnDetailSaveObj['mrp'] = element.UnitMRP || 0;
            grnDetailSaveObj['rate'] = element.Rate || 0;
            grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
            grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
            grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
            grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
            grnDetailSaveObj['discPercentage'] = element.DiscPercentage || 0;
            grnDetailSaveObj['discAmount'] = element.DiscAmount || 0;
            grnDetailSaveObj['discPerc2'] = element.DiscPer2 || 0;
            grnDetailSaveObj['discAmt2'] = element.DiscAmt2 || 0;
            grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
            grnDetailSaveObj['landedRate'] = element.LandedRate || 0;
            grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
            grnDetailSaveObj['poNo'] = element.PurchaseId || 0;
            grnDetailSaveObj['batchNo'] = element.BatchNo || "";
            grnDetailSaveObj['batchExpDate'] = this.vExpDate;//this.datePipe.transform(this.lastDay1, "mm/dd/yyyy");
            grnDetailSaveObj['purUnitRate'] = element.PurUnitRate || 0;
            grnDetailSaveObj['purUnitRateWF'] = element.PurUnitRateWF || 0;
            grnDetailSaveObj['cgstPer'] = element.CGSTPer || 0;
            grnDetailSaveObj['cgstAmt'] = element.CGSTAmt || 0;
            grnDetailSaveObj['sgstPer'] = element.SGSTPer || 0;
            grnDetailSaveObj['sgstAmt'] = element.SGSTAmt || 0;
            grnDetailSaveObj['igstPer'] = element.IGSTPer || 0;
            grnDetailSaveObj['igstAmt'] = element.IGSTAmt || 0;
            grnDetailSaveObj['mrP_Strip'] = element.MRP || 0;
            grnDetailSaveObj['isVerified'] = element.IsVerified;
            grnDetailSaveObj['igstPer'] = element.IGST || 0;
            grnDetailSaveObj['isVerifiedDatetime'] = element.IsVerifiedDatetime || 0;
            grnDetailSaveObj['isVerifiedUserId'] = element.IsVerifiedUserId || 0;
            grnDetailSaveObj['StkID'] = element.StkID || 0;

            SavegrnDetailObj.push(grnDetailSaveObj);

        });

        let updateItemMasterGSTPerObjarray = [];
        this.dsItemNameList.data.forEach((element) => {
            let updateItemMasterGSTPerObj = {};
            updateItemMasterGSTPerObj['itemId'] = element.ItemId || 0;
            updateItemMasterGSTPerObj['cgst'] = element.CGSTPer || 0;
            updateItemMasterGSTPerObj['sgst'] = element.SGSTPer || 0;
            updateItemMasterGSTPerObj['igst'] = element.IGSTPer || 0;
            updateItemMasterGSTPerObj['hsNcode'] = element.HSNcode || "";
            updateItemMasterGSTPerObjarray.push(updateItemMasterGSTPerObj);
        });

        let update_PO_STATUS_AganistGRN = [];
        this.dsItemNameList.data.forEach((element) => {
            let update_PO_STATUS_AganistGRNObj = {};
            update_PO_STATUS_AganistGRNObj['poId'] = element.PurchaseId || 0;
            update_PO_STATUS_AganistGRNObj['purDetID'] = element.PurDetId || 0;
            update_PO_STATUS_AganistGRNObj['isClosed'] = true;
            update_PO_STATUS_AganistGRNObj['poBalQty'] = element.POBalQty || 0;
            update_PO_STATUS_AganistGRN.push(update_PO_STATUS_AganistGRNObj);
        });

        let update_POHeader_Status_AganistGRN = [];
        this.dsItemNameList.data.forEach((element) => {
            let update_POHeader_Status_AganistGRNObj = {};
            update_POHeader_Status_AganistGRNObj['poId'] = element.PurchaseId || 0;
            update_POHeader_Status_AganistGRNObj['isClosed'] = true;
            update_POHeader_Status_AganistGRN.push(update_POHeader_Status_AganistGRNObj);
        });

        let submitData = {
            "grnSave": grnSaveObj,
            "grnDetailSave": SavegrnDetailObj,
            "updateItemMasterGSTPer": updateItemMasterGSTPerObjarray,
            "update_PO_STATUS_AganistGRN": update_PO_STATUS_AganistGRN,
            "update_POHeader_Status_AganistGRN": update_POHeader_Status_AganistGRN
        };
        console.log(submitData);
        this._GRNList.POtoGRNSave(submitData).subscribe(response => {
            if (response) {
                this.toastr.success('Record PO TO GRN Saved Successfully.', 'Saved !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
               // this.Savebtn = false;
                this._matDialog.closeAll();
                this.OnReset();
                this.viewGRNREPORTPdf(response)

            } else {
                this.toastr.error('PO TO GRN Data not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
            //this.isLoading123=false;
            //this.sIsLoading = '';
        }, error => {
            this.toastr.error('PO TO GRN Data not saved !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
        });
    }

    OnEditPO() {
        if ((!this.dsItemNameList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this._GRNList.GRNFinalForm.invalid) {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        let nowDate = new Date();
        let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
        this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
        //
       // this.Savebtn = true;
        let grnSaveObj = {};
        grnSaveObj['grnDate'] = this.dateTimeObj.date;
        grnSaveObj['grnTime'] = this.dateTimeObj.time;
        grnSaveObj['storeId'] = this.accountService.currentUserValue.user.storeId;
        grnSaveObj['supplierID'] = this._GRNList.userFormGroup.get('SupplierId').value.SupplierId || 0;
        grnSaveObj['invoiceNo'] = this._GRNList.userFormGroup.get('InvoiceNo').value || 0;
        grnSaveObj['deliveryNo'] = 0;
        grnSaveObj['gateEntryNo'] = this._GRNList.userFormGroup.get('GateEntryNo').value || 0;
        grnSaveObj['cash_CreditType'] = this._GRNList.userFormGroup.get('PaymentType').value;
        grnSaveObj['grnType'] = this._GRNList.userFormGroup.get('GRNType').value;
        grnSaveObj['totalAmount'] = this._GRNList.GRNFinalForm.get('TotalAmt').value || 0;
        grnSaveObj['totalDiscAmount'] = this._GRNList.GRNFinalForm.get('DiscAmount').value || 0;
        grnSaveObj['totalVATAmount'] = this._GRNList.GRNFinalForm.get('VatAmount').value || 0;
        grnSaveObj['netAmount'] = this._GRNList.GRNFinalForm.get('NetPayamt').value || 0;
        grnSaveObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
        grnSaveObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
        grnSaveObj['isVerified'] = false;
        grnSaveObj['isClosed'] = false;
        grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id || 0;
        grnSaveObj['invDate'] = this._GRNList.userFormGroup.get('DateOfInvoice').value.DateOfInvoice || '01/01/1900';
        grnSaveObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
        grnSaveObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
        grnSaveObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharge').value || 0;
        grnSaveObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
        grnSaveObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('CGSTAmount').value || 0;
        grnSaveObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('SGSTAmount').value || 0;
        grnSaveObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('IGSTAmount').value || 0;
        grnSaveObj['tranProcessId'] = this._GRNList.userFormGroup.get('GSTType').value.ConstantId || 0;
        grnSaveObj['tranProcessMode'] = this._GRNList.userFormGroup.get('GSTType').value.Name || '';
        grnSaveObj['ewayBillNo'] = this._GRNList.GRNFinalForm.get('EwayBillNo').value || 0;
        grnSaveObj['ewayBillDate'] = this.datePipe.transform(this._GRNList.GRNFinalForm.get('EwalBillDate').value, "yyyy-MM-dd") || '01/01/1099';
        grnSaveObj['BillDiscAmt'] = this.vFinalDisAmount2 || 0;
        grnSaveObj['grnid'] = this.registerObj.GRNID;

        let SavegrnDetailObj = [];
        this.dsItemNameList.data.forEach((element) => {

            if (element.BatchExpDate && element.BatchExpDate.length === 10) {
                const day = +element.BatchExpDate.substring(0, 2);
                const month = +element.BatchExpDate.substring(3, 5);
                const year = +element.BatchExpDate.substring(6, 10);

                this.vExpDate = `${year}/${this.pad(month)}/${day}`;
            }

            let grnDetailSaveObj = {};
            grnDetailSaveObj['grnDetID'] = 0;
            grnDetailSaveObj['grnId'] = this.registerObj.GRNID;
            grnDetailSaveObj['itemId'] = element.ItemId || 0;
            grnDetailSaveObj['uomId'] = element.UOMId || 0;
            grnDetailSaveObj['receiveQty'] = element.ReceiveQty || 0;
            grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
            grnDetailSaveObj['mrp'] = element.UnitMRP || 0;
            grnDetailSaveObj['rate'] = element.Rate || 0;
            grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
            grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
            grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
            grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
            grnDetailSaveObj['discPercentage'] = element.DiscPercentage || 0;
            grnDetailSaveObj['discAmount'] = element.DiscAmount || 0;
            grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
            grnDetailSaveObj['landedRate'] = element.LandedRate || 0;
            grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
            grnDetailSaveObj['poNo'] = element.PurchaseId || 0;
            grnDetailSaveObj['batchNo'] = element.BatchNo || "";
            grnDetailSaveObj['batchExpDate'] = this.vExpDate;//this.datePipe.transform(this.lastDay1, "mm/dd/yyyy");
            grnDetailSaveObj['purUnitRate'] = element.PurUnitRate || 0;
            grnDetailSaveObj['purUnitRateWF'] = element.PurUnitRateWF || 0;
            grnDetailSaveObj['cgstPer'] = element.CGSTPer || 0;
            grnDetailSaveObj['cgstAmt'] = element.CGSTAmt || 0;
            grnDetailSaveObj['sgstPer'] = element.SGSTPer || 0;
            grnDetailSaveObj['sgstAmt'] = element.SGSTAmt || 0;
            grnDetailSaveObj['igstPer'] = element.IGSTPer || 0;
            grnDetailSaveObj['igstAmt'] = element.IGSTAmt || 0;
            grnDetailSaveObj['mrP_Strip'] = element.MRP || 0;
            grnDetailSaveObj['isVerified'] = element.IsVerified;
            grnDetailSaveObj['igstPer'] = element.IGST || 0;
            grnDetailSaveObj['isVerifiedDatetime'] = element.IsVerifiedDatetime || 0;
            grnDetailSaveObj['isVerifiedUserId'] = element.IsVerifiedUserId || 0;
            grnDetailSaveObj['stkId'] = element.StkID || 0;
            grnDetailSaveObj['discPerc2'] = element.DiscPer2 || 0;
            grnDetailSaveObj['discAmt2'] = element.DiscAmt2 || 0;

            SavegrnDetailObj.push(grnDetailSaveObj);

        });

        let updateItemMasterGSTPerObjarray = [];
        this.dsItemNameList.data.forEach((element) => {
            let updateItemMasterGSTPerObj = {};
            updateItemMasterGSTPerObj['itemId'] = element.ItemId || 0;
            updateItemMasterGSTPerObj['cgst'] = element.CGSTPer || 0;
            updateItemMasterGSTPerObj['sgst'] = element.SGSTPer || 0;
            updateItemMasterGSTPerObj['igst'] = element.IGSTPer || 0;
            updateItemMasterGSTPerObj['hsNcode'] = element.HSNcode || "";
            updateItemMasterGSTPerObjarray.push(updateItemMasterGSTPerObj);
        });

        let update_PO_STATUS_AganistGRN = [];
        this.dsItemNameList.data.forEach((element) => {
            let update_PO_STATUS_AganistGRNObj = {};
            update_PO_STATUS_AganistGRNObj['poId'] = element.PurchaseId || 0;
            update_PO_STATUS_AganistGRNObj['purDetID'] = element.PurDetId || 0;
            update_PO_STATUS_AganistGRNObj['isClosed'] = true;
            update_PO_STATUS_AganistGRNObj['poBalQty'] = element.POBalQty || 0;
            update_PO_STATUS_AganistGRN.push(update_PO_STATUS_AganistGRNObj);
        });

        let update_POHeader_Status_AganistGRN = [];
        this.dsItemNameList.data.forEach((element) => {
            let update_POHeader_Status_AganistGRNObj = {};
            update_POHeader_Status_AganistGRNObj['poId'] = element.PurchaseId || 0;
            update_POHeader_Status_AganistGRNObj['isClosed'] = true;
            update_POHeader_Status_AganistGRN.push(update_POHeader_Status_AganistGRNObj);
        });

        let delete_GRNDetailsobj = {}
        delete_GRNDetailsobj["GRNId"] = this.registerObj.GRNID;

        let submitData = {
            "updateGRNHeader": grnSaveObj,
            "delete_GRNDetails": delete_GRNDetailsobj,
            "grnDetailSave": SavegrnDetailObj,
            "updateItemMasterGSTPer": updateItemMasterGSTPerObjarray,
            "update_PO_STATUS_AganistGRN": update_PO_STATUS_AganistGRN,
            "update_POHeader_Status_AganistGRN": update_POHeader_Status_AganistGRN,
        };
        console.log(submitData);
        this._GRNList.POtoGRNUpated(submitData).subscribe((data) => {
            console.log(data)
            if (data) {
                this.toastr.success('Record PO TO GRN Updated Successfully.', 'Updated !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
                //this.Savebtn = false;
                this._matDialog.closeAll();
                this.OnReset();
                this.viewGRNREPORTPdf(data)
                //this.isLoading123=false;
                //this.sIsLoading = '';
            } else {
                this.toastr.error('PO TO GRN Data not Updated !, Please check error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        }, error => {
            this.toastr.error('PO TO GRN Data not Updated !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
        });
    }




    OnSavenew() { 
     
        let nowDate = new Date();
        let nowDate1 = nowDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
        this.newDateTimeObj = { date: nowDate1[0], time: nowDate1[1] };
       // this.Savebtn = true;
        let grnSaveObj = {};
        grnSaveObj['grnDate'] = this.dateTimeObj.date;
        grnSaveObj['grnTime'] = this.dateTimeObj.time;
        grnSaveObj['storeId'] = this.accountService.currentUserValue.user.storeId;
        grnSaveObj['supplierID'] = this._GRNList.userFormGroup.get('SupplierId').value.SupplierId || this.SupplierId;
        grnSaveObj['invoiceNo'] = this._GRNList.userFormGroup.get('InvoiceNo').value || 0;
        grnSaveObj['deliveryNo'] = 0;
        grnSaveObj['gateEntryNo'] = this._GRNList.userFormGroup.get('GateEntryNo').value || 0;
        grnSaveObj['cash_CreditType'] = this._GRNList.userFormGroup.get('PaymentType').value;
        grnSaveObj['grnType'] = this._GRNList.userFormGroup.get('GRNType').value;
        grnSaveObj['totalAmount'] = this._GRNList.GRNFinalForm.get('TotalAmt').value || 0;
        grnSaveObj['totalDiscAmount'] = this._GRNList.GRNFinalForm.get('DiscAmount').value || 0;
        grnSaveObj['totalVATAmount'] = this._GRNList.GRNFinalForm.get('VatAmount').value || 0;
        grnSaveObj['netAmount'] = this._GRNList.GRNFinalForm.get('NetPayamt').value || 0;
        grnSaveObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
        grnSaveObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
        grnSaveObj['isVerified'] = false;
        grnSaveObj['isClosed'] = false;
        grnSaveObj['addedBy'] = this.accountService.currentUserValue.user.id || 0;
        grnSaveObj['invDate'] = this.datePipe.transform(this._GRNList.userFormGroup.get('DateOfInvoice').value, "yyyy-MM-dd");
        grnSaveObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
        grnSaveObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
        grnSaveObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharge').value || 0;
        grnSaveObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
        grnSaveObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('CGSTAmount').value || 0;
        grnSaveObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('SGSTAmount').value || 0;
        grnSaveObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;//this._GRNList.userFormGroup.get('IGSTAmount').value || 0;
        grnSaveObj['tranProcessId'] = this._GRNList.userFormGroup.get('GSTType').value.ConstantId || 0;
        grnSaveObj['tranProcessMode'] = this._GRNList.userFormGroup.get('GSTType').value.Name || '';
        grnSaveObj['ewayBillNo'] = this._GRNList.GRNFinalForm.get('EwayBillNo').value || 0;
        grnSaveObj['ewayBillDate'] = this.datePipe.transform(this._GRNList.GRNFinalForm.get('EwalBillDate').value, "yyyy-MM-dd") || '01/01/1099';
        grnSaveObj['BillDiscAmt'] = this.vFinalDisAmount2 || 0;
        grnSaveObj['grnid'] = 0;

        let SavegrnDetailObj = [];
        this.dsItemNameList.data.forEach((element) => {
            // console.log(element);

            let grnDetailSaveObj = {};
            grnDetailSaveObj['grnId'] = 0;
            grnDetailSaveObj['itemId'] = element.ItemId || 0;
            grnDetailSaveObj['uomId'] = element.UOMId || 0;
            grnDetailSaveObj['receiveQty'] = element.ReceiveQty || 0;
            grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
            grnDetailSaveObj['mrp'] = element.UnitMRP || 0;
            grnDetailSaveObj['rate'] = element.Rate || 0;
            grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
            grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
            grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
            grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
            grnDetailSaveObj['discPercentage'] = element.DiscPercentage || 0;
            grnDetailSaveObj['discAmount'] = element.DiscAmount || 0;
            grnDetailSaveObj['discPerc2'] = element.DiscPer2 || 0;
            grnDetailSaveObj['discAmt2'] = element.DiscAmt2 || 0;
            grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
            grnDetailSaveObj['landedRate'] = element.LandedRate || 0;
            grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
            grnDetailSaveObj['poNo'] = 0; //this.IgstAmt;
            grnDetailSaveObj['batchNo'] = element.BatchNo || "";

            if (element.BatchExpDate && element.BatchExpDate.length === 10) {
                const day = +element.BatchExpDate.substring(0, 2);
                const month = +element.BatchExpDate.substring(3, 5);
                const year = +element.BatchExpDate.substring(6, 10);

                this.vExpDate = `${year}/${this.pad(month)}/${day}`;
                // console.log(this.vExpDate)
            }

            grnDetailSaveObj['batchExpDate'] = this.vExpDate;
            grnDetailSaveObj['purUnitRate'] = element.PurUnitRate || 0;
            grnDetailSaveObj['purUnitRateWF'] = element.PurUnitRateWF || 0;
            grnDetailSaveObj['cgstPer'] = element.CGSTPer || 0;
            grnDetailSaveObj['cgstAmt'] = element.CGSTAmt || 0;
            grnDetailSaveObj['sgstPer'] = element.SGSTPer || 0;
            grnDetailSaveObj['sgstAmt'] = element.SGSTAmt || 0;
            grnDetailSaveObj['igstPer'] = element.IGSTPer || 0;
            grnDetailSaveObj['igstAmt'] = element.IGSTAmt || 0;
            grnDetailSaveObj['mrP_Strip'] = element.MRP || 0;
            grnDetailSaveObj['isVerified'] = element.IsVerified;
            grnDetailSaveObj['igstPer'] = element.IGST || 0;
            grnDetailSaveObj['isVerifiedDatetime'] = element.IsVerifiedDatetime || 0;
            grnDetailSaveObj['isVerifiedUserId'] = element.IsVerifiedUserId || 0;
            grnDetailSaveObj['StkID'] = element.StkID || 0;


            SavegrnDetailObj.push(grnDetailSaveObj);

        });

        let updateItemMasterGSTPerObjarray = [];
        this.dsItemNameList.data.forEach((element) => {
            let updateItemMasterGSTPerObj = {};
            updateItemMasterGSTPerObj['itemId'] = element.ItemId || 0;
            updateItemMasterGSTPerObj['cgst'] = element.CGSTPer || 0;
            updateItemMasterGSTPerObj['sgst'] = element.SGSTPer || 0;
            updateItemMasterGSTPerObj['igst'] = element.IGSTPer || 0;
            updateItemMasterGSTPerObj['hsNcode'] = element.HSNcode || "";
            updateItemMasterGSTPerObjarray.push(updateItemMasterGSTPerObj);
        });
 
          let GRNCreditObj = []
          this.selectedCreditNotelist.forEach(element=>{
            let insertTGRNRetDet = {};
            insertTGRNRetDet['grnReturnId'] = element.GRNReturnId || 0;
            insertTGRNRetDet['grnId'] = element.GRNID || 0;
            insertTGRNRetDet['storeId'] = element.StoreId || 0; 
            GRNCreditObj.push(insertTGRNRetDet);
          })


        let submitData = {
            "grnSave": grnSaveObj,
            "grnDetailSave": SavegrnDetailObj,
            "updateItemMasterGSTPer": updateItemMasterGSTPerObjarray,
            "insertTGRNRetDet":GRNCreditObj
        };
        console.log(submitData);
        this._GRNList.GRNSave(submitData).subscribe(response => {
            if (response) {
                this.toastr.success('Record Saved Successfully.', 'Saved !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
               // this.Savebtn = false;
                this._matDialog.closeAll();
                this.OnReset();
                this.viewGRNREPORTPdf(response)
                //this.isLoading123=false;
                //this.sIsLoading = '';
            } else {
                this.toastr.error('New GRN Data not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                }); 
            }
        }, error => {
            this.toastr.error('New GRN Data not saved !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            }); 
        });
    }
    OnSaveEdit() {
     
       // this.Savebtn = true;
        let updateGRNHeaderObj = {};
        updateGRNHeaderObj['grnid'] = this.registerObj.GRNID;
        updateGRNHeaderObj['grnDate'] = this.dateTimeObj.date;
        updateGRNHeaderObj['grnTime'] = this.dateTimeObj.time;
        updateGRNHeaderObj['storeId'] = this.accountService.currentUserValue.user.storeId || 0;
        updateGRNHeaderObj['supplierID'] = this._GRNList.userFormGroup.get('SupplierId').value.SupplierId || 0;
        updateGRNHeaderObj['invoiceNo'] = this._GRNList.userFormGroup.get('InvoiceNo').value || 0;
        updateGRNHeaderObj['deliveryNo'] = 0;
        updateGRNHeaderObj['gateEntryNo'] = this._GRNList.userFormGroup.get('GateEntryNo').value || 0;
        updateGRNHeaderObj['cash_CreditType'] = this._GRNList.userFormGroup.get('PaymentType').value;
        updateGRNHeaderObj['grnType'] = this._GRNList.userFormGroup.get('GRNType').value;
        updateGRNHeaderObj['totalAmount'] = this._GRNList.GRNFinalForm.get('TotalAmt').value || 0;
        updateGRNHeaderObj['totalDiscAmount'] = this._GRNList.GRNFinalForm.get('DiscAmount').value || 0;
        updateGRNHeaderObj['totalVATAmount'] = this._GRNList.GRNFinalForm.get('VatAmount').value || 0;
        updateGRNHeaderObj['netAmount'] = this._GRNList.GRNFinalForm.get('NetPayamt').value || 0;
        updateGRNHeaderObj['remark'] = this._GRNList.GRNFinalForm.get('Remark').value || '';
        updateGRNHeaderObj['receivedBy'] = this._GRNList.GRNFinalForm.get('ReceivedBy').value || '';
        updateGRNHeaderObj['updatedBy'] = this.accountService.currentUserValue.user.id,
            updateGRNHeaderObj['invDate'] = this.datePipe.transform(this._GRNList.userFormGroup.get('DateOfInvoice').value, "yyyy-MM-dd");
        updateGRNHeaderObj['debitNote'] = this._GRNList.GRNFinalForm.get('DebitAmount').value || 0;
        updateGRNHeaderObj['creditNote'] = this._GRNList.GRNFinalForm.get('CreditAmount').value || 0;
        updateGRNHeaderObj['otherCharge'] = this._GRNList.GRNFinalForm.get('OtherCharge').value || 0;
        updateGRNHeaderObj['roundingAmt'] = this._GRNList.GRNFinalForm.get('RoundingAmt').value || 0;
        updateGRNHeaderObj['totCGSTAmt'] = this.CGSTFinalAmount || 0;
        updateGRNHeaderObj['totSGSTAmt'] = this.SGSTFinalAmount || 0;
        updateGRNHeaderObj['totIGSTAmt'] = this.IGSTFinalAmount || 0;
        updateGRNHeaderObj['tranProcessId'] = this._GRNList.userFormGroup.get('GSTType').value.ConstantId || 0;
        updateGRNHeaderObj['tranProcessMode'] = this._GRNList.userFormGroup.get('GSTType').value.Name || '';
        updateGRNHeaderObj['billDiscAmt'] = this.vFinalDisAmount2 || 0;

        let SavegrnDetailObj = [];
        this.dsItemNameList.data.forEach((element) => {

            if (element.BatchExpDate && element.BatchExpDate.length === 10) {
                const day = +element.BatchExpDate.substring(0, 2);
                const month = +element.BatchExpDate.substring(3, 5);
                const year = +element.BatchExpDate.substring(6, 10);

                this.vExpDate = `${year}/${this.pad(month)}/${day}`;
            }

            let grnDetailSaveObj = {};
            grnDetailSaveObj['grnDetID'] = 0;
            grnDetailSaveObj['grnId'] = this.registerObj.GRNID;
            grnDetailSaveObj['itemId'] = element.ItemId || 0;
            grnDetailSaveObj['uomId'] = element.UOMId || 0;
            grnDetailSaveObj['receiveQty'] = element.ReceiveQty || 0;
            grnDetailSaveObj['freeQty'] = element.FreeQty || 0;
            grnDetailSaveObj['mrp'] = element.UnitMRP || 0;
            grnDetailSaveObj['rate'] = element.Rate || 0;
            grnDetailSaveObj['totalAmount'] = element.TotalAmount || 0;
            grnDetailSaveObj['conversionFactor'] = element.ConversionFactor || 0;
            grnDetailSaveObj['vatPercentage'] = element.VatPercentage || 0;
            grnDetailSaveObj['vatAmount'] = element.VatAmount || 0;
            grnDetailSaveObj['discPercentage'] = element.DiscPercentage || 0;
            grnDetailSaveObj['discAmount'] = element.DiscAmount || 0;
            grnDetailSaveObj['discPerc2'] = element.DiscPer2 || 0;
            grnDetailSaveObj['discAmt2'] = element.DiscAmt2 || 0;
            grnDetailSaveObj['otherTax'] = 0; // this.CgstPer;
            grnDetailSaveObj['landedRate'] = element.LandedRate || 0;
            grnDetailSaveObj['netAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['grossAmount'] = element.NetAmount || 0;
            grnDetailSaveObj['totalQty'] = element.TotalQty || 0;
            grnDetailSaveObj['poNo'] = element.PurchaseId || 0;
            grnDetailSaveObj['batchNo'] = element.BatchNo || "";
            grnDetailSaveObj['batchExpDate'] = this.vExpDate;//this.datePipe.transform(element.BatchExpDate, "yyyy-MM") || this.date.value;
            grnDetailSaveObj['purUnitRate'] = element.PurUnitRate || 0;
            grnDetailSaveObj['purUnitRateWF'] = element.PurUnitRateWF || 0;
            grnDetailSaveObj['cgstPer'] = element.CGSTPer || 0;
            grnDetailSaveObj['cgstAmt'] = element.CGSTAmt || 0;
            grnDetailSaveObj['sgstPer'] = element.SGSTPer || 0;
            grnDetailSaveObj['sgstAmt'] = element.SGSTAmt || 0;
            grnDetailSaveObj['igstPer'] = element.IGSTPer || 0;
            grnDetailSaveObj['igstAmt'] = element.IGSTAmt || 0;
            grnDetailSaveObj['mrP_Strip'] = element.MRP || 0;
            grnDetailSaveObj['isVerified'] = element.IsVerified;
            grnDetailSaveObj['igstPer'] = element.IGST || 0;
            grnDetailSaveObj['isVerifiedDatetime'] = element.IsVerifiedDatetime || 0;
            grnDetailSaveObj['isVerifiedUserId'] = element.IsVerifiedUserId || 0;
            grnDetailSaveObj['StkID'] = element.StkID || 0;
            // grnDetailSaveObj['poId'] = element.PurchaseId || 0;
            // grnDetailSaveObj['purDetID'] = element.PurDetId || 0;
            // grnDetailSaveObj['isClosed'] = true;
            // grnDetailSaveObj['poBalQty'] = element.POBalQty || 0;

            SavegrnDetailObj.push(grnDetailSaveObj);
        });
        let delete_GRNDetailsobj = {}
        delete_GRNDetailsobj["GRNId"] = this.registerObj.GRNID;

        let update_PO_STATUS_AganistGRN = [];
        this.dsItemNameList.data.forEach((element) => {
            let update_PO_STATUS_AganistGRNObj = {};
            update_PO_STATUS_AganistGRNObj['poId'] = element.PurchaseId || 0;
            update_PO_STATUS_AganistGRNObj['purDetID'] = element.PurDetId || 0;
            update_PO_STATUS_AganistGRNObj['isClosed'] = true;
            update_PO_STATUS_AganistGRNObj['poBalQty'] = element.POBalQty || 0;
            update_PO_STATUS_AganistGRN.push(update_PO_STATUS_AganistGRNObj);
        });

        let update_POHeader_Status_AganistGRN = [];
        this.dsItemNameList.data.forEach((element) => {
            let update_POHeader_Status_AganistGRNObj = {};
            update_POHeader_Status_AganistGRNObj['poId'] = element.PurchaseId || 0;
            update_POHeader_Status_AganistGRNObj['isClosed'] = true;
            update_POHeader_Status_AganistGRN.push(update_POHeader_Status_AganistGRNObj);
        });

         
          let deleteRetDetObj = {}
          deleteRetDetObj['det_Id'] = this.CreditDetID || 0;

        let GRNCreditObj = []
        this.selectedCreditNotelist.forEach(element=>{
          let insertTGRNRetDet = {};
          insertTGRNRetDet['grnReturnId'] = element.GRNReturnId || 0;
          insertTGRNRetDet['grnId'] = element.GRNID || 0;
          insertTGRNRetDet['storeId'] = element.StoreId || 0; 
          GRNCreditObj.push(insertTGRNRetDet);
        })


        let submitData = {
            "updateGRNHeader": updateGRNHeaderObj,
            "delete_GRNDetails": delete_GRNDetailsobj,
            "grnDetailSave": SavegrnDetailObj,
            "deleteRetDet":deleteRetDetObj,
            "insertTGRNRetDet":GRNCreditObj
        };
        console.log(submitData);
        this._GRNList.GRNEdit(submitData).subscribe(response => {
            if (response) {
                this.toastr.success('Record Updated Successfully.', 'Updated !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
              //  this.Savebtn = false;
                this._matDialog.closeAll();
                this.OnReset()
                //this.isLoading123=false;
                //this.sIsLoading = '';
            }
        }, error => {
            this.toastr.error('New GRN Data not Updated !, Please check API error..', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
        });
    }

    // PaymentTypeChk() {
    //   if (this._GRNList.userFormGroup.get('PaymentType').value == 'Credit') {
    //     this.PaymentType = false;
    //   }
    //   else if (this._GRNList.userFormGroup.get('PaymentType').value == 'Cash') {
    //     this.PaymentType = true;
    //   }
    // }
    // @ViewChild('SupplierId') SupplierId: MatSelect;
    @ViewChild('InvoiceNo1') InvoiceNo1: ElementRef;
    @ViewChild('DateOfInvoice') DateOfInvoice: ElementRef;
    @ViewChild('GateEntryNo1') GateEntryNo1: ElementRef;
    @ViewChild('GSTType') GSTType: MatSelect;
    @ViewChild('paymentdate') paymentdate: ElementRef;
    @ViewChild('itemid') itemid: ElementRef;
    @ViewChild('Uom') Uom: ElementRef;
    @ViewChild('hsncode') hsncode: ElementRef;
    @ViewChild('batchno') batchno: ElementRef;
    @ViewChild('expdate') expdate: ElementRef;
    @ViewChild('conversionfactor') conversionfactor: ElementRef;
    @ViewChild('qty') qty: ElementRef;
    @ViewChild('freeqty') freeqty: ElementRef;
    @ViewChild('mrp') mrp: ElementRef;
    @ViewChild('rate') rate: ElementRef;
    @ViewChild('disc') disc: ElementRef;
    @ViewChild('disc2') disc2: ElementRef;
    @ViewChild('gst') gst: ElementRef;
    @ViewChild('cgst') cgst: ElementRef;
    @ViewChild('sgst') sgst: ElementRef;
    @ViewChild('igst') igst: ElementRef;
    // @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
    @ViewChild('addbutton') addbutton: ElementRef;
    add: boolean = false;
    @ViewChild('Remark') Remark: ElementRef;
    @ViewChild('ReceivedBy') ReceivedBy: ElementRef;
    @ViewChild('DebitAmount') DebitAmount: ElementRef;
    @ViewChild('CreditAmount') CreditAmount: ElementRef;
    @ViewChild('DiscAmount') DiscAmount: ElementRef;
    @ViewChild('NetPayamt') NetPayamt: ElementRef;
    @ViewChild('OtherCharge') OtherCharge: ElementRef;
    @ViewChild('RoundingAmt') RoundingAmt: ElementRef;
    @ViewChild('EwayBillNo') EwayBillNo: ElementRef;

    public onEnterSupplier(event): void {
        if (event.which === 13) {
            this.DateOfInvoice.nativeElement.focus()
        }
    }

    public onEnterDateOfInvoice(event): void {
        if (event.which === 13) {
            this.InvoiceNo1.nativeElement.focus()
        }
    }

    public onEnterInvoiceNo(event): void {
        if (event.which === 13) {
            this.GateEntryNo1.nativeElement.focus()
            this.checkInvoice();
        }
        // this.getGSTtypeList()
    }
    @ViewChild('GSTauto') matAutocomplete: ElementRef;
    public onEnterGateEntryNo(event): void {
        if (event.which === 13) {
            // if (this.GSTType) this.GSTType.focus();
            this.paymentdate.nativeElement.focus();
        }
    }
    public onEnterGSTType(event): void {
        if (event.which === 13) {
            this.paymentdate.nativeElement.focus();
        }
    }
    public onEnterPaymentDueDate(event): void {
        if (event.which === 13) {
            this.itemid.nativeElement.focus();
        }
    }

    public onEnteritemid(event): void {
        if (event.which === 13) {
            this.conversionfactor.nativeElement.focus();
        }
    }
    public onEnterUOM(event): void {
        if (event.which === 13) {
            this.hsncode.nativeElement.focus();
        }
    }
    public onEnterHSNCode(event): void {
        if (event.which === 13) {
            this.batchno.nativeElement.focus();
        }
    }
    public setFocus(nextElementId): void {
        document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
    }
    // public onEnterConversionFactor(event, t): void {
    //   if (event.which === 13) {
    //     this.batchno.nativeElement.focus();
    //   }
    // }

    // public onEnterBatchNo(event): void {
    //   if (event.which === 13) {
    //     this.expdate.nativeElement.focus();
    //     let batchno = this.vBatchNo.toUpperCase();
    //     this.vBatchNo = batchno;
    //     this.vlastDay = '';
    //   }
    // }
    // public onEnterExpDate(event): void {
    //   if (event.which === 13) {
    //     this.qty.nativeElement.focus();
    //   }
    // }
    // public onEnterQty(event): void {
    //   if (event.which === 13) {
    //     this.freeqty.nativeElement.focus();
    //   }
    // }
    // public onEnterFreeQty(event): void {
    //   if (event.which === 13) {
    //     this.mrp.nativeElement.focus();
    //     this.vRate = '';
    //   }
    // }
    // public onEnterMRP(event): void {
    //   if (event.which === 13) {
    //     this.rate.nativeElement.focus();
    //     //  this._GRNList.userFormGroup.get('Rate').setValue('');
    //   }
    // }

    // public onEnterRate(event): void {
    //   if (event.which === 13) {
    //     this.disc.nativeElement.focus();
    //     this.vDisc = '';

    //   }
    // }

    public onEnterDisc(event): void {
        if (event.which === 13) {
            if (this._GRNList.userFormGroup.get('GSTType').value.Name == "GST After TwoTime Disc") {
                this.isDisc2Selected = true;
                this.disc2.nativeElement.focus();
                return
            }
            //this.add = true
            this.addbutton.nativeElement.focus();
        }
    }
    public onEnterDisc2(event): void {
        if (event.which === 13) {
            this.cgst.nativeElement.focus();
            //this.add = true
            this.addbutton.nativeElement.focus();
        }
    }

    public onEnterCGST(event): void {
        if (event.which === 13) {
            this.sgst.nativeElement.focus();
        }
    }

    public onEnterSGST(event): void {
        if (event.which === 13) {
            this.igst.nativeElement.focus();
        }
    }

    public onEnterIGST(event): void {
        if (event.which === 13) {
            this.gst.nativeElement.focus();

        }
    }
    public onEnterGST(event): void {
        if (event.which === 13) {
            this.add = true;
            this.itemid.nativeElement.focus();
        }
    }
    public onEnterRemark(event): void {
        if (event.which === 13) {
            this.ReceivedBy.nativeElement.focus();
        }
    }
    public onEnterReceivedBy(event): void {
        if (event.which === 13) {
            this.DebitAmount.nativeElement.focus();

            if (this.dsItemNameList.data.length > 0) {
                this.vsaveflag = false;
            }
        }
    }

    Setsave() {

        if (this.dsItemNameList.data.length > 0) {
            this.vsaveflag = false;
        }
    }
    public onEnterDebitAmount(event): void {
        if (event.which === 13) {
            this.CreditAmount.nativeElement.focus();
        }
    }
    public onEnterCreditAmount(event): void {
        if (event.which === 13) {
            this.OtherCharge.nativeElement.focus();
        }
    }
    public onEnterOtherCharges(event): void {
        if (event.which === 13) {
            this.EwayBillNo.nativeElement.focus();
        }
    }
    public onEnterEwayBillNo(event): void {
        if (event.which === 13) {
        }
    }
    public onEnterNetPayamt(event): void {
        if (event.which === 13) {
            this.OtherCharge.nativeElement.focus();
        }
    }
    public onEnterDiscAmount(event): void {
        if (event.which === 13) {
            this.vGSTAmount.nativeElement.focus();
        }
    }
    public onEnterVatAmount(event): void {
        if (event.which === 13) {
            this.NetPayamt.nativeElement.focus();
        }
    }
    getLastThreeItemInfo() {
        var vdata = {
            'ItemId': this._GRNList.userFormGroup.get('ItemName').value.ItemID || 0,
        }
        this._GRNList.getLastThreeItemInfo(vdata).subscribe(data => {
            this.dsLastThreeItemList.data = data as LastThreeItemList[]; this.sIsLoading = '';
        });
    }

    onEdit(contact) {
        const dialogRef = this._matDialog.open(UpdateGRNComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
                data: {
                    Obj: contact,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed - Insert Action', result);
        });
    }
    onClose() {
        this.dialogRef.close();
    }
    selectedCreditNotelist:any=[];
    CreditDetID:any=0; 
    getDebitnotelist() {
        let SupplierId = this._GRNList.userFormGroup.get('SupplierId').value
        if(SupplierId == '' || SupplierId == 0 || SupplierId == null || SupplierId == undefined){ 
            this.toastr.warning('select supplier Name.', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        if(!this.dsItemNameList.data.length){ 
            this.toastr.warning('add item in list', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        this._GRNList.GRNFinalForm.get('NetPayamt').setValue(this.NetAmount)
        const dialogRef = this._matDialog.open(CreditNoteComponent,
            {
                maxWidth: "100%",
                height: '50%',
                width: '70%',
                data: {
                    Obj: this.vSupplierId ,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.selectedCreditNotelist = result.SelectedList;
            this.CreditDetID =  result.Det_Id; 
            this._GRNList.GRNFinalForm.get('CreditAmount').setValue(result.FinalNetAmt) 
        //   let CreditAmount = this._GRNList.GRNFinalForm.get("CreditAmount").value || 0; 
        // if(CreditAmount > 0){
        //     if(CreditAmount > 0 && this.dsItemNameList.data.length > 0){
        //         this.toastr.warning('check credit amount should not be greater than net amount', 'warning !', {
        //             toastClass: 'tostr-tost custom-toast-warning',
        //         }); 
        //     }else{
        //         FinalRoundAmt = (parseFloat(FinalRoundAmt) - parseFloat(CreditAmount));
        //     } 
        // }
        });
    }

    FinalTotalQty1: any = 0;
    FinalLandedrate1: any = 0;
    FinalpurUnitRate1: any = 0;
    FinalpurUnitrateWF1: any = 0;
    FinalUnitMRP1: any = 0;
    vPurchaseOrderSupplierId: any;
    PurchaseOrderList() {
        const _dialogRef = this._matDialog.open(PurchaseorderComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
            });

        _dialogRef.afterClosed().subscribe(result => {

            console.log(result)
            this.vPurchaseId = result[0].PurchaseID;
            this.vpoBalQty = result[0].ReceiveQty;
            this.vPurchaseOrderSupplierId = result[0].SupplierName
            let other = result[0].FreightCharges + result[0].HandlingCharges + result[0].TransportChanges + result[0].OctriAmount
            this._GRNList.GRNFinalForm.get('OtherCharge').setValue(other);
            this._GRNList.GRNFinalForm.get('Remark').setValue(result[0].Remarks);

            this.getSupplierSearchCombo();

            //   debugger
            // //  const toSelectSUpplierId = this.SupplierList.find(c => c.SupplierId == result[0].SupplierID);
            //   const toSelectSUpplierId = this.SupplierList.data.find(item => item.SupplierId === result[0].SupplierID);
            //   console.log(toSelectSUpplierId)
            //   this._GRNList.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
            //   this.vMobile = toSelectSUpplierId.Mobile;
            //   this.vContact = toSelectSUpplierId.ContactPerson;
            //   this._GRNList.userFormGroup.get('SupplierId').setValue(this.SupplierList[0]);


            //  const toSelectSUpplierId = this.filteredOptionssupplier.find(c => c.SupplierId == result[0].SupplierID);
            //  this._GRNList.userFormGroup.get('SupplierId').setValue(toSelectSUpplierId);
            //   this.vMobile = toSelectSUpplierId.Mobile;
            //   this.vContact = toSelectSUpplierId.ContactPerson;
            //   this.vSupplierId =toSelectSUpplierId.SupplierName;
            //   this._GRNList.userFormGroup.get('SupplierId').setValue(this.filteredOptionssupplier[0]);



            this.dsItemNameList1.data = result;
            this.dsItemNameList1.data.forEach((element) => {
                let Qty = element.Qty;
                let freeqty = element.FreeQty || 0;
                this.FinalTotalQty1 = (((element.Qty) + (freeqty)) * (element.ConversionFactor));
                this.FinalLandedrate1 = (element.NetAmount) / (this.FinalTotalQty1);
                this.FinalpurUnitRate1 = (((element.ItemTotalAmount) / (element.Qty)) * (element.ConversionFactor))
                this.FinalpurUnitrateWF1 = (((element.ItemTotalAmount) / (this.FinalTotalQty1)) * (element.ConversionFactor))
                this.FinalUnitMRP1 = (element.MRP) / (element.ConversionFactor)

                this.chargeslist.push(
                    {
                        ItemId: element.ItemId || 0,
                        ItemName: element.ItemName || '',
                        ConversionFactor: element.ConversionFactor || 0,
                        UOMId: element.UOMID,
                        HSNcode: element.HSNcode,
                        BatchNo: element.BatchNo,
                        BatchExpDate: element.BatchExpDate,
                        ReceiveQty: element.Qty || 0,
                        FreeQty: element.FreeQty || 0,
                        TotalQty: this.FinalTotalQty1 || 0,
                        MRP: element.MRP || 0,
                        Rate: element.Rate || 0,
                        TotalAmount: element.ItemTotalAmount || 0,
                        DiscPercentage: element.DiscPer || 0,
                        DiscAmount: element.ItemDiscAmount || 0,
                        DiscPer2: element.DiscPer2 || 0,
                        DiscAmt2: element.DiscAmt2 || 0,
                        VatPercentage: element.VatPer || 0,
                        VatAmount: element.VatAmount || 0,
                        CGSTPer: element.CGSTPer || 0,
                        CGSTAmt: element.CGSTAmt || 0,
                        SGSTPer: element.SGSTPer || 0,
                        SGSTAmt: element.SGSTAmt || 0,
                        IGSTPer: element.IGSTPer || 0,
                        IGSTAmt: element.IGSTAmt || 0,
                        NetAmount: element.GrandTotalAmount || 0,
                        PurchaseId: element.PurchaseNo || 0,
                        PurDetId: element.PurDetId || 0,
                        POBalQty: element.POBalQty || 0,
                        POQty: element.POQty || 0,
                        // IsClosed: element.IsClosed,
                        LandedRate: element.LandedRate || 0,
                        PurUnitRate: this.FinalpurUnitRate1 || 0,
                        PurUnitRateWF: this.FinalpurUnitrateWF1 || 0,
                        IsVerifiedUserId: 0,//element.IsVerifiedId || 0,
                        IsVerified: false,//true,
                        IsVerifiedDatetime: "01/01/1900",// element.VerifiedDateTime || 0,
                        StkID: 0,
                        UnitMRP: this.FinalUnitMRP1
                    });
                this.dsItemNameList.data = this.chargeslist
            });
        });
    }

    chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
        const ctrlValue = this.date.value;
        ctrlValue.month(normalizedMonth.month());
        this.date.setValue(ctrlValue);
        datepicker.close();
        this.calculateDiff(this.date.value);
    }

    calculateDiff(sentDate) {
        var date1: any = new Date(sentDate);
        var date2: any = new Date();
        var diffDays: any = Math.floor((date1 - date2) / (1000 * 60 * 60 * 24));

        if (diffDays <= 120 && diffDays > 1) {
            Swal.fire("Item Expiry date in 3 months !");
        }
    }

    AdList: boolean = false;
    viewGRNREPORTPdf(el) {
        this.sIsLoading = 'loading-data';
        setTimeout(() => {
            // this.SpinLoading =true;
            this.AdList = true;
            this._GRNList.getPdfGRN(el).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "GRN REPORT viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.AdList = false;
                    this.sIsLoading = '';
                });
            });

        }, 100);
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
    msg: any;
    checkInvoice() {
        let Query = "select InvoiceNo from T_GRNHeader Where SupplierId=" + this.vcheckSupplierId + "and StoreId=" + this.accountService.currentUserValue.user.storeId;
        console.log(Query)
        this._GRNList.getCheckInvoiceNo(Query).subscribe(data => {
            this.msg = data
            console.log(data)
            //console.log(this.msg.InvoiceNo)
            const checkInvoice = this.msg.some(item => item.InvoiceNo == this._GRNList.userFormGroup.get('InvoiceNo').value);

            if (checkInvoice) {
                this.toastr.warning('Invoice Number already there exists', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                this._GRNList.userFormGroup.get('InvoiceNo').setValue('');
                this.InvoiceNo1.nativeElement.focus()
            }
        })
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


