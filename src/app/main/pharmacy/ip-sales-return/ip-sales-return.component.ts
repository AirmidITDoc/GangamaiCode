import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { IpSalesReturnService } from './ip-sales-return.service';

@Component({
    selector: 'app-ip-sales-return',
    templateUrl: './ip-sales-return.component.html',
    styleUrls: ['./ip-sales-return.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IpSalesReturnComponent implements OnInit {
    displayedColumns = [
        'SalesNo',
        'ItemName',
        'BatchNo',
        'ExpDate',
        'Qty',
        'ReturnQty',
        'MRP',
        'TotalAmt',
        'GST',
        'GSTAmt',
        'Disc',
        'DiscAmt',
        'LandedPrice',
        'NetAmount',
        'StkID',
        'Action'
    ];

    ItemFormGroup: FormGroup;
    IPSalesRetFooterform: FormGroup;
    IpSalesReturnForm: FormGroup;
    sIsLoading: string = '';
    isLoading = true;
    isItemIdSelected: boolean = false;
    ItemfilteredOptions: Observable<string[]>;
    vRegno: any = 0;
    Itemlist: any = [];
    screenFromString = 'admission-form';
    chargeslist: any = [];
    dateTimeObj: any;
    vPatientName: any;
    vOP_IP_Type: any;
    registerObj: any;
    selcteditemObj: any;

    dsIpSaleItemList = new MatTableDataSource<IPSalesItemList>();

    @ViewChild('ItemName') ItemName!: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;

    constructor(
        public _IpSalesRetService: IpSalesReturnService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private accountService: AuthenticationService,
        public toastr: ToastrService,
        public formBuilder: FormBuilder,
        public _FormvalidationserviceService: FormvalidationserviceService
    ) { }


    ngOnInit(): void {
        this.ItemFormGroup = this.CreateItemfromGroup();
        this.IPSalesRetFooterform = this.CreateSalesFooterform();
        this.ItemFormGroup.markAllAsTouched();
        this.IPSalesRetFooterform.markAllAsTouched();

        this.IpSalesReturnForm = this.CreateSalesReturnForm();
    }
    CreateSalesFooterform() {
        return this.formBuilder.group({
            FinalNetAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            FinalTotalAmt: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            FinalGSTAmt: [0],
            FinalDiscAmount: [0],
        });
    }
    CreateItemfromGroup() {
        return this.formBuilder.group({
            Op_ip_id: ['1'],
            PatientName: [''],
            PaymentType: ['CashPay'],
            ItemName: ['', [Validators.required]],
            ReturnQty: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            TotalQty: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
        });
    }
    CreateSalesReturnForm() {
        return this.formBuilder.group({
            //sales return header  
            salesReturn: this.formBuilder.group({
                salesReturnId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                date: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
                time: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                salesId: [this.selcteditemObj?.SalesId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opIpId: [this.selcteditemObj?.OP_IP_ID, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                opIpType: [1],
                totalAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                vatAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                discAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                netAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                paidAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                isSellted: false,
                isPrint: true,
                isFree: false,
                unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this.accountService.currentUserValue.userId],
                storeId: [this.accountService.currentUserValue.user.storeId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                narration: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
                isPurBill: [false]
                // mobileNo: [this.selcteditemObj?.mobileNo || 0],
                // patientName: [''],
                // address: [''],
                // doctorId:[this.selcteditemObj?.docNameID || 0],
                // doctorName:[this.selcteditemObj?.doctorName || ''],
                // returnType: [0]
            }),
            // sales return details in array
            salesReturnDetails: this.formBuilder.array([]),
            // Current stock in array
            currentStock: this.formBuilder.array([]),
            // sales details update in array
            salesDetail: this.formBuilder.array([]),
            //Payment form
            payment: this.formBuilder.group({
                paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                billNo: [this.selcteditemObj?.SalesId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                cashPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequePayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                chequeDate: ['1999-01-01'],
                cardPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardDate: ['1999-01-01'],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                transactionType: [5, [this._FormvalidationserviceService.onlyNumberValidator()]],
                remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                addBy: [this.accountService.currentUserValue.userId],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1999-01-01'],
                opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
                neftpayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftdate: ['1999-01-01'],
                payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                payTmdate: ['1999-01-01'],
                tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId],
                wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            //New Payments
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([]),
        });
    }
    createSalesretDetails(element: any): FormGroup {
        return this.formBuilder.group({
            salesReturnId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [element?.ItemId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            batchNo: [element?.BatchNo, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            batchExpDate: [this.datePipe.transform(element.ExpDate, "yyyy-MM-dd"), [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitMrp: [element?.MRP, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            qty: [element?.ReturnQty, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            totalAmount: [element?.TotalAmt, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            vatPer: [element?.GST || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            vatAmount: [element?.GSTAmt || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discPer: [element?.Disc || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            discAmount: [element?.DiscAmt || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            grossAmount: [Math.round(element?.NetAmount), [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            landedPrice: [element?.LandedPrice || 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            totalLandedAmount: [element?.TotalLandedAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            purRate: [element?.PurRateWf || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            purTot: [element?.PurTotAmt || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            salesId: [element?.SalesId || 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            salesDetId: [element?.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isCashOrCredit: [element?.isCashOrCredit, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cgstper: [((element?.GST) / 2) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cgstamt: [((element?.GSTAmt) / 2) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            sgstper: [((element?.GST) / 2) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            sgstamt: [((element?.GSTAmt) / 2) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            igstper: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            igstamt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            stkId: [element?.StkID, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        })
    }
    createcurrentStock(element: any): FormGroup {
        return this.formBuilder.group({
            itemId: [element?.ItemId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            issueQty: [element?.ReturnQty ?? 0, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            storeId: [this.accountService.currentUserValue.user.storeId],
            istkId: [element?.StkID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    createSalesDetails(element: any): FormGroup {
        return this.formBuilder.group({
            salesDetId: [element?.SalesDetId, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            returnQty: [element?.ReturnQty, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId],
            billNo: [item?.billNo ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [item?.validationDate ?? ''],
            advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            comments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranResponse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            transactionType: [5, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tranMode: ['PHAR', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [this.accountService.currentUserValue.userId],
            transactionLabel: ['SALES_RETURN', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    // Getters 
    get ModeOfPaymentsArray(): FormArray {
        return this.IpSalesReturnForm.get('tPayments') as FormArray;
    }
    // Getters 
    get SaleRetDetailsArray(): FormArray {
        return this.IpSalesReturnForm.get('salesReturnDetails') as FormArray;
    }
    get currentStockArray(): FormArray {
        return this.IpSalesReturnForm.get('currentStock') as FormArray;
    }
    get SalesDetArray(): FormArray {
        return this.IpSalesReturnForm.get('salesDetail') as FormArray;
    }

    getSelectedObjRegIP(obj) {
        debugger
        console.log(obj)
        this.registerObj = obj;
        this.vPatientName = obj?.firstName + ' ' + obj?.middleName + ' ' + obj?.lastName;
        this.vRegno = this.registerObj?.regNo;
        this.getItemNameList();
        this.OnRadioChange();
    }
    OnRadioChange() {
        this.dsIpSaleItemList.data = [];
        this.chargeslist = [];
        this.getUpdateTotalAmt();
        this.getItemNameList();
    }
    getItemNameList() {
        if (this.vRegno == '' || this.vRegno == null || this.vRegno == undefined || this.vRegno == 0) {
            this.toastr.warning('Please select patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        const storeID = this.accountService.currentUserValue.user.storeId
        const ItemName = this.ItemFormGroup.get('ItemName')?.value + '%' || '%'
        const Filters = [
            { "fieldName": "RegNo", "fieldValue": String(this.vRegno), "opType": "Equals" },
            { "fieldName": "StoreId", "fieldValue": String(storeID), "opType": "Equals" },
            { "fieldName": "ItemName", "fieldValue": String(ItemName), "opType": "Equals" },
            { "fieldName": "BatchNo", "fieldValue": String(0), "opType": "Equals" }
        ]

        if (this.ItemFormGroup.get('PaymentType').value == 'CashPay') {
            var param = {
                "searchFields": Filters,
                "mode": "IPSalesReturnCash"
            }
        }
        else {
            var param = {
                "searchFields": Filters,
                "mode": "IPSalesReturnCredit"
            }
        }
        this._IpSalesRetService.getSalesReturnitemlist(param).subscribe(response => {
            console.log('response', response)
            if (response) {
                this.Itemlist = response
                console.log(this.Itemlist)
                this.ItemfilteredOptions = this.ItemFormGroup.get('ItemName')?.valueChanges.pipe(
                    startWith(''),
                    map(value => value ? this._filterItemname(value) : this.Itemlist?.slice()),
                );
            }
        })
    }
    getOptionTextitemname(option) {
        return option && option.ItemName ? option.ItemName : '';
    }
    getSelectedItemObj(obj) {
        debugger
        this.selcteditemObj = obj;
        this.ItemFormGroup.patchValue({
            TotalQty: obj.Qty
        })
        this.IpSalesReturnForm = this.CreateSalesReturnForm();
    }
    private _filterItemname(value: any): string[] {
        if (value) {
            const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
            return this.Itemlist.filter(option => option.ItemName.toLowerCase().includes(filterValue));
        }
    }
    OnAdd() {
        const invalidFields = [];
        if (this.ItemFormGroup.invalid) {
            for (const controlName in this.ItemFormGroup.controls) {
                if (this.ItemFormGroup.controls[controlName].invalid) {
                    invalidFields.push(`${controlName}`);
                }
            }
        }
        if (invalidFields.length > 0) {
            invalidFields.forEach(field => {
                this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                );
            });
            return
        }
        debugger
        const formValues = this.ItemFormGroup.value
        if (!(formValues.PatientName.admissionID > 0)) {
            this.toastr.warning('Please select Patient Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        if (this.dsIpSaleItemList.data.length > 0) {
            const isItemAlreadyAdded = this.dsIpSaleItemList.data.some((element) => element.ItemId === this.selcteditemObj?.ItemId
                && element.BatchNo === this.selcteditemObj?.BatchNo
                && Number(element?.MRP).toFixed(2) === Number(this.selcteditemObj?.UnitMRP).toFixed(2));
            if (isItemAlreadyAdded) {
                this.toastr.warning('Selected Item already added in the list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                this.ItemReset();
                this.ItemName.nativeElement.focus();
                return
            }
        }

        const totalAmt = (parseFloat(this.selcteditemObj.UnitMRP) * parseFloat(formValues.ReturnQty)).toFixed(2);
        const GSTAmt = ((parseFloat(this.selcteditemObj.VatPer) * parseFloat(totalAmt)) / 100).toFixed(2) || 0;
        const DiscAmt = ((parseFloat(this.selcteditemObj.DiscPer) * parseFloat(totalAmt)) / 100).toFixed(2) || '0';
        const netAmt = (parseFloat(totalAmt) - parseFloat(DiscAmt)).toFixed(2);
        const PurTotAmt = (parseFloat(this.selcteditemObj.PurRateWf) * parseFloat(formValues.ReturnQty)).toFixed(2);
        const TotalLandedAmount = (parseFloat(this.selcteditemObj.LandedPrice) * parseFloat(formValues.ReturnQty)).toFixed(2);

        this.chargeslist.push(
            {
                SalesNo: this.selcteditemObj.SalesNo || 0,
                ItemName: this.ItemFormGroup.get('ItemName').value.ItemName || '',
                ItemId: this.selcteditemObj.ItemId || 0,
                BatchNo: this.selcteditemObj.BatchNo || 0,
                ExpDate: this.selcteditemObj.BatchExpDate || 0,
                MRP: this.selcteditemObj.UnitMRP || 0,
                Qty: this.selcteditemObj.Qty || 0,
                ReturnQty: formValues.ReturnQty || 0,
                TotalAmt: totalAmt || 0,
                GST: this.selcteditemObj.VatPer || 0,
                GSTAmt: GSTAmt || 0,
                Disc: parseFloat(this.selcteditemObj.DiscPer).toFixed(2) || 0,
                DiscAmt: DiscAmt || 0,
                LandedPrice: this.selcteditemObj.LandedPrice || 0,
                TotalLandedAmount: TotalLandedAmount || 0,
                PurRateWf: this.selcteditemObj.PurRateWf || 0,
                PurTotAmt: PurTotAmt || 0,
                NetAmount: netAmt || 0,
                SalesDetId: this.selcteditemObj.SalesDetId || 0,
                StkID: this.selcteditemObj.StkID || 0,
                isCashOrCredit: this.selcteditemObj.isCashOrCredit || 0,
                SalesId:this.selcteditemObj?.SalesId || 0
            });
        console.log(this.chargeslist)
        this.dsIpSaleItemList.data = this.chargeslist;
        this.dsIpSaleItemList.sort = this.sort;
        this.dsIpSaleItemList.paginator = this.paginator;
        this.getUpdateTotalAmt();
        this.ItemReset();
        this.ItemName.nativeElement.focus();
    }
    ItemReset() {
        this.ItemFormGroup.get('ItemName').setValue('');
        this.ItemFormGroup.get('ReturnQty').setValue('');
        this.ItemFormGroup.get('TotalQty').setValue('');
        this.ItemFormGroup.markAllAsTouched();
    }
    deleteTableRow(event, element) {
        const index = this.chargeslist.indexOf(element);
        if (index >= 0) {
            this.chargeslist.splice(index, 1);
            this.dsIpSaleItemList.data = [];
            this.dsIpSaleItemList.data = this.chargeslist;
        }
        Swal.fire('Success !', 'ItemList Row Deleted Successfully', 'success');
        this.getUpdateTotalAmt();
    }
    checkQty() {
        const formValues = this.ItemFormGroup.value
        if (!formValues.PatientName) {
            this.toastr.warning('Please select Patient Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        if (formValues.ReturnQty > formValues.TotalQty) {
            this.toastr.warning('Return Qty cannot be greater than BalQty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.ItemFormGroup.get('ReturnQty').setValue('');
            return
        }
    }
    //Table calulation
    getCellCalculation(contact, ReturnQty) {
        if (parseInt(ReturnQty) > parseInt(contact.Qty)) {
            Swal.fire({
                icon: "warning",
                title: "Return Qty cannot be greater than BalQty",
                showConfirmButton: false,
                timer: 2000
            });
            contact.ReturnQty = '';
            contact.TotalAmt = 0;
            contact.GSTAmt = 0;
            contact.DiscAmt = 0;
            contact.NetAmount = 0;
            return
        }
        else if (contact.ReturnQty == '0' || contact.ReturnQty == '' || contact.ReturnQty == null || contact.ReturnQty == undefined) {
            contact.ReturnQty = 0;
            contact.ReturnQty = '';
            contact.TotalAmt = 0;
            contact.GSTAmt = 0;
            contact.DiscAmt = 0;
            contact.NetAmount = 0;
        }
        else {
            contact.TotalAmt = (parseFloat(contact.MRP) * parseFloat(contact.ReturnQty)).toFixed(2);
            contact.GSTAmt = ((parseFloat(contact.GST) * parseFloat(contact.TotalAmt)) / 100).toFixed(2) || 0;
            contact.DiscAmt = ((parseFloat(contact.Disc) * parseFloat(contact.TotalAmt)) / 100).toFixed(2) || 0;
            contact.NetAmount = (parseFloat(contact.TotalAmt) - parseFloat(contact.DiscAmt)).toFixed(2);
            contact.PurTotAmt = (parseFloat(contact.PurRateWf) * parseFloat(contact.ReturnQty)).toFixed(2);
            contact.TotalLandedAmount = (parseFloat(contact.LandedPrice) * parseFloat(contact.ReturnQty)).toFixed(2);
        }
        this.getUpdateTotalAmt();
    }
    getUpdateTotalAmt() {
        const form = this.IPSalesRetFooterform;
        const itemList = this.dsIpSaleItemList.data;
        const netAmount = itemList.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
        const updatableFormValues = {
            FinalTotalAmt: itemList.reduce((sum, { TotalAmt }) => sum += +(TotalAmt || 0), 0).toFixed(2),
            FinalGSTAmt: itemList.reduce((sum, { GSTAmt }) => sum += +(GSTAmt || 0), 0).toFixed(2),
            FinalDiscAmount: itemList.reduce((sum, { DiscAmt }) => sum += +(DiscAmt || 0), 0).toFixed(2),
            FinalNetAmount: netAmount.toFixed(2),
        }
        form.patchValue({
            ...updatableFormValues
        });
    }
    //Save code 
    onSave() {
        const formValues = this.ItemFormGroup.value
        if (!(formValues?.PatientName?.admissionID > 0)) {
            this.toastr.warning('Please select Patient Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        if ((this.vRegno == '' || this.vRegno == null || this.vRegno == undefined || this.vRegno == 0)) {
            this.toastr.warning('Please select patient', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((!this.dsIpSaleItemList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.isValidForm()) {
            Swal.fire({
                icon: "warning",
                title: "Please enter ReturnQty Without ReturnQty Cannot perform save operation.",
                showConfirmButton: false,
                timer: 2000
            });
            return;
        }
        Swal.fire({
            title: 'Do you want to Save the Sales Return',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Save !"
        }).then((result) => {
            if (result.isConfirmed) {
                this.onSavePayment();
            }
        })
    }
    onSavePayment() {
        const formattedTime = this.datePipe.transform(new Date(), 'hh:mm');
        const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime

        this.IpSalesReturnForm.get('salesReturn.date').setValue(formattedDate)
        this.IpSalesReturnForm.get('salesReturn.time').setValue(FormattedDateTime)
        //this.IpSalesReturnForm.get('salesReturn.patientName').setValue(this.vPatientName || '')
        this.IpSalesReturnForm.get('salesReturn.totalAmount')?.setValue(this.IPSalesRetFooterform.get('FinalTotalAmt').value)
        this.IpSalesReturnForm.get('salesReturn.vatAmount')?.setValue(this.IPSalesRetFooterform.get('FinalGSTAmt').value)
        this.IpSalesReturnForm.get('salesReturn.discAmount')?.setValue(this.IPSalesRetFooterform.get('FinalDiscAmount').value)
        this.IpSalesReturnForm.get('salesReturn.netAmount')?.setValue((Math.round(this.IPSalesRetFooterform.get('FinalNetAmount').value)))
        this.IpSalesReturnForm.get('salesReturn.isPurBill').setValue(this.selcteditemObj?.IsPurRate || false);
        if (this.IpSalesReturnForm.valid) {
            this.SaleRetDetailsArray.clear()
            this.currentStockArray.clear()
            this.SalesDetArray.clear()
            this.dsIpSaleItemList.data.forEach((element) => {
                this.SaleRetDetailsArray.push(this.createSalesretDetails(element));
                this.currentStockArray.push(this.createcurrentStock(element));
                this.SalesDetArray.push(this.createSalesDetails(element));
            });
            if (this.ItemFormGroup.get('PaymentType').value == 'CashPay') {
                this.IpSalesReturnForm.get('salesReturn.paidAmount').setValue((Math.round(this.IPSalesRetFooterform.get('FinalNetAmount').value)))
                this.IpSalesReturnForm.get('salesReturn.balanceAmount').setValue(0)
                this.IpSalesReturnForm.get('payment.paymentDate').setValue(formattedDate)
                this.IpSalesReturnForm.get('payment.paymentTime').setValue(FormattedDateTime)
                this.IpSalesReturnForm.get('payment.cashPayAmount').setValue((Math.round(this.IPSalesRetFooterform.get('FinalNetAmount').value)))

                const ModePaymentObj = [];
                ModePaymentObj.push({
                    billNo: this.selcteditemObj?.SalesId,
                    paymentDate: formattedDate,
                    paymentTime: formattedTime,
                    payAmount: (Math.round(this.IPSalesRetFooterform.get('FinalNetAmount')?.value || 0)),
                    validationDate: formattedDate,
                    payMode: "CASH",
                    companyId: this.registerObj?.companyId ?? 0,
                    isSelfOrcompany: this.registerObj?.companyId ? 1 : 0,
                });
                this.ModeOfPaymentsArray.clear();
                ModePaymentObj.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                });

                console.log(this.IpSalesReturnForm.value);
                this._IpSalesRetService.InsertCashSalesReturn(this.IpSalesReturnForm.value).subscribe(response => {
                    this.OnSalesReturnprint(response, this.selcteditemObj?.OP_IP_Type)
                    this.ngOnDestroy();
                });
            }
            else {
                this.IpSalesReturnForm.get('salesReturn.paidAmount').setValue(0)
                this.IpSalesReturnForm.get('salesReturn.balanceAmount').setValue((Math.round(this.IPSalesRetFooterform.get('FinalNetAmount').value)))
                this.IpSalesReturnForm.get('payment.paymentDate').setValue(formattedDate)
                this.IpSalesReturnForm.get('payment.paymentTime').setValue(FormattedDateTime)

                console.log(this.IpSalesReturnForm.value);
                this._IpSalesRetService.InsertCreditSalesReturn(this.IpSalesReturnForm.value).subscribe(response => {
                    this.OnSalesReturnprint(response, this.selcteditemObj.OP_IP_Type)
                    this.ngOnDestroy();
                });
            }
        } else {
            const invalidFields = [];
            if (this.IpSalesReturnForm.invalid) {
                for (const controlName in this.IpSalesReturnForm.controls) {
                    const control = this.IpSalesReturnForm.get(controlName);
                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Sales Return Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`Sales Return From: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
                return
            }
        }
    }
    OnReset() {
        this.ItemFormGroup.reset();
        this.IPSalesRetFooterform.reset();
        this.dsIpSaleItemList.data = [];
        this.chargeslist = [];
        this.vPatientName = '';
        this.registerObj = '';
        this.selcteditemObj = '';
        this.ItemFormGroup.get('ItemName').setValue('');
        this.ItemFormGroup.get('PaymentType').setValue('CashPay');
        this.ItemFormGroup.get('Op_ip_id').setValue('1');
        this.ItemFormGroup.markAllAsTouched();
        this.IPSalesRetFooterform.markAllAsTouched();
    }
    ngOnDestroy() {
        this.OnReset();
    }
    isValidForm(): boolean {
        return this.dsIpSaleItemList.data.every((i) => i.ReturnQty > 0);
    }
    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    focusNext(nextElement: HTMLElement) {
        nextElement.focus();
    }
    //print 
    OnSalesReturnprint(SalesID, OP_IP_Type) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    { "fieldName": "SalesID", "fieldValue": String(SalesID || 0), "opType": "13" },
                    { "fieldName": "OP_IP_Type", "fieldValue": String(OP_IP_Type), "opType": "13" }
                ],
                "mode": "PharamcySalesReturn"
            }
            this._IpSalesRetService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "IP Sales Return" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
    vCheckBox: boolean = false;
    getDischargedList(event) {
        if (event.checked == true) {
            this.vCheckBox = true;
            this.OnReset()
        }
        else
            this.vCheckBox = false;
        this.ItemFormGroup.get('PatientName').setValue('');
    }

}
export class IPSalesItemList {
    SalesNo: number;
    ExpDate: number;
    ItemName: string;
    BatchNo: string;
    MRP: number;
    Qty: any;
    ReturnQty: any;
    TotalAmt: any;
    GST: any;
    Disc: any;
    GSTAmt: any;
    DiscAmt: any;
    NetAmount: any;
    ItemId: any;
    SalesId: any;
    SalesDetId: any;
    LandedPrice: any;
    TotalLandedAmount: any;
    StkID: any;
    CGSTPer: any;
    CGSTAmount: any;
    SGSTPer: any;
    SGSTAmount: any;
    IGSTPer: any;
    IGSTAmount: any;
    PurRateWf: any;
    PurTotAmt: any;


    /**
     * Constructor
     *
     * @param IPSalesItemList
     */
    constructor(IPSalesItemList) {
        {
            this.SalesNo = IPSalesItemList.SalesNo || 0;
            this.ExpDate = IPSalesItemList.ExpDate || 0;
            this.ItemName = IPSalesItemList.ItemName || "";
            this.BatchNo = IPSalesItemList.BatchNo || "";
            this.MRP = IPSalesItemList.MRP || 0;
            this.Qty = IPSalesItemList.Qty || 0;
            this.ReturnQty = IPSalesItemList.ReturnQty || 0;
            this.TotalAmt = IPSalesItemList.TotalAmt || 0;
            this.GST = IPSalesItemList.GST || 0;
            this.Disc = IPSalesItemList.Disc || 0;
            this.GSTAmt = IPSalesItemList.GSTAmt || 0;
            this.DiscAmt = IPSalesItemList.DiscAmt || 0;
            this.NetAmount = IPSalesItemList.NetAmount || 0;

            this.ItemId = IPSalesItemList.ItemId || 0;
            this.SalesId = IPSalesItemList.SalesId || 0;
            this.SalesDetId = IPSalesItemList.SalesDetId || 0;
            this.LandedPrice = IPSalesItemList.LandedPrice || 0;
            this.TotalLandedAmount = IPSalesItemList.TotalLandedAmount || 0;
            this.StkID = IPSalesItemList.StkID || 0;
            this.CGSTPer = IPSalesItemList.CGSTPer || 0;
            this.CGSTAmount = IPSalesItemList.CGSTAmount || 0;
            this.SGSTPer = IPSalesItemList.SGSTPer || 0;
            this.SGSTAmount = IPSalesItemList.SGSTAmount || 0;
            this.IGSTPer = IPSalesItemList.IGSTPer || 0;
            this.IGSTAmount = IPSalesItemList.IGSTAmount || 0;
            this.PurRateWf = IPSalesItemList.PurRateWf || 0;
            this.PurTotAmt = IPSalesItemList.PurTotAmt || 0;
        }
    }
}
