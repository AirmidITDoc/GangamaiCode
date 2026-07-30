import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { UserDetail } from 'app/main/administration/create-user/nuser/nuser.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { IPSearchListService } from '../ip-search-list.service';
import { ConfigService } from 'app/core/services/config.service';

@Component({
    selector: 'app-discount-after-final-bill',
    templateUrl: './discount-after-final-bill.component.html',
    styleUrls: ['./discount-after-final-bill.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DiscountAfterFinalBillComponent implements OnInit {

    MyFrom: FormGroup;
    saveform: FormGroup;
    selectedAdvanceObj: any
    vNetamount: any;
    vTotalAmount: any;
    vDiscAmount: any;
    vDiscountPer2: any;
    vDiscAmount2: any;
    vFinalDiscAmt: any;
    vFinalNetAmt: any;
    vCompanyDiscAmt: any;
    vCompanyDiscper: any;
    ConcessionReasonList: any = [];
    vFinalCompanyDiscAmt: any;
    CompanyName: any = '';
    PatientObj: any;
    vCompanyDiscAmt2: any = 0;

    autocompleteModeConcession: string = "Concession";

    constructor(
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<DiscountAfterFinalBillComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
        private formBuilder: FormBuilder,
        public _IpSearchListService: IPSearchListService,
        public _formvalidationservice: FormvalidationserviceService,
        public _ConfigService:ConfigService
    ) { }

    ngOnInit(): void {
        if (this.data) {
            this.selectedAdvanceObj = this.data.Obj
            this.PatientObj = this.data.PatientObj
            console.log(this.selectedAdvanceObj)
            this.vDiscAmount = Math.round(this.selectedAdvanceObj.concessionAmt);
            this.vCompanyDiscAmt2 = Math.round(this.selectedAdvanceObj.compDiscAmt);
            this.CompanyName = this.selectedAdvanceObj.companyName || '';
            this.vTotalAmount = Math.round(this.selectedAdvanceObj.totalAmt);
            this.vFinalNetAmt = Math.round(this.selectedAdvanceObj.netPayableAmt)
            this.vNetamount = Math.round(this.selectedAdvanceObj.netPayableAmt)
            this.vFinalDiscAmt = Math.round(this.selectedAdvanceObj.concessionAmt);
            this.vFinalCompanyDiscAmt = Math.round(this.selectedAdvanceObj.compDiscAmt);
            this.CompanyName = this.selectedAdvanceObj.companyName || '';
        }
        this.MyFrom = this.CreateMyForm();
        this.saveform = this.CreatesaveMyForm(); 

             const discountData = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'IsDiscount');  
            if (discountData?.AccessValue) {
                this.UserDicPerLimit = discountData?.AccessInputValue || 0
            }
    }
    CreateMyForm(): FormGroup {
        return this.formBuilder.group({
            NetAmount: [''],
            TotalAmount: [''],
            DiscAmount: [''],
            DiscountPer2: [''],
            DiscAmount2: [''],
            FinalDiscAmt: [''],
            FinalNetAmt: [''],
            CompanyDiscper: [''],
            CompanyDiscAmt: [''],
            ConcessionId: [''],
            FinalCompanyDiscAmt: [''],
        });
    }
    CreatesaveMyForm(): FormGroup {
        return this.formBuilder.group({
            billNo: [0, [this._formvalidationservice.notEmptyOrZeroValidator()]],
            netPayableAmt: [0, [this._formvalidationservice.AllowDecimalNumberValidator(), this._formvalidationservice.notEmptyOrZeroValidator()]],
            concessionAmt: [0, [this._formvalidationservice.AllowDecimalNumberValidator()]],
            compDiscAmt: [0, [this._formvalidationservice.AllowDecimalNumberValidator()]],
            balanceAmt: [0, [this._formvalidationservice.AllowDecimalNumberValidator()]],
            concessionReasonId: [0, [this._formvalidationservice.notEmptyOrZeroValidator()]],
            createdBy: [this.accountService.currentUserValue.userId]
        });
    }

    CalcDiscPer() {
        debugger
        let DiscAmt2;
        let CompanyDiscAmt;
        let DiscPer2 = this.MyFrom.get('DiscountPer2').value || 0;
        let CompanyDiscPer = this.MyFrom.get('CompanyDiscper').value || 0;

        if (DiscPer2) {
            if (this.UserDicPerLimit > 0) {
                if (+DiscPer2 > +this.UserDicPerLimit) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Discount Limit Exceeded',
                        text: `Maximum allowed discount is ${this.UserDicPerLimit}%`,
                        confirmButtonColor: '#d33'
                    });
                    this.MyFrom.get("DiscountPer2").setValue(this.UserDicPerLimit);
                    DiscPer2 = this.MyFrom.get('DiscountPer2').value || 0;
                }
            }
            if (DiscPer2 > 100) {
                this.toastr.warning('Please enter discount % less than 100 and greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                return this.vDiscountPer2 = '';
            }
            else {
                this.vDiscAmount2 = ((parseFloat(this.vTotalAmount) * parseFloat(DiscPer2)) / 100).toFixed(2) || 0;
                DiscAmt2 = this.vDiscAmount2;
            }
        } else {
            if (DiscPer2 == 0 || DiscPer2 == '' || DiscPer2 == null || DiscPer2 == undefined) {
                this.vDiscAmount2 = '';
                DiscAmt2 = 0;
            }
        }

        if (CompanyDiscPer) {

            if (this.UserDicPerLimit > 0) {
                if (+CompanyDiscPer > +this.UserDicPerLimit) {
                    Swal.fire({
                        icon: 'warning',
                        title: 'Discount Limit Exceeded',
                        text: `Maximum allowed discount is ${this.UserDicPerLimit}%`,
                        confirmButtonColor: '#d33'
                    });
                    this.MyFrom.get("CompanyDiscper").setValue(this.UserDicPerLimit);
                    CompanyDiscPer = this.MyFrom.get('CompanyDiscper').value || 0;
                }
            }

            if (CompanyDiscPer > 100) {
                this.toastr.warning('Please enter discount % less than 100 and greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                return this.vCompanyDiscper = '';
            }
            else {
                this.vCompanyDiscAmt = ((parseFloat(this.vTotalAmount) * parseFloat(CompanyDiscPer)) / 100).toFixed(2) || 0;
                CompanyDiscAmt = this.vCompanyDiscAmt;
            }
        }
        else {
            if (CompanyDiscPer == 0 || CompanyDiscPer == '' || CompanyDiscPer == null || CompanyDiscPer == undefined) {
                this.vCompanyDiscAmt = '';
                CompanyDiscAmt = 0;
            }
        }

        this.vFinalCompanyDiscAmt = Math.round(parseFloat(CompanyDiscAmt) + parseFloat(this.vCompanyDiscAmt2));
        this.vFinalDiscAmt = Math.round(parseFloat(DiscAmt2) + parseFloat(this.vDiscAmount));
        this.vNetamount = Math.round((parseFloat(this.vTotalAmount) - parseFloat(this.vFinalDiscAmt)) - parseFloat(this.vFinalCompanyDiscAmt)).toFixed(2);
    }
    CalcDiscAmt() {
        debugger
        const DiscAmt2 = this.MyFrom.get('DiscAmount2').value || 0;
        const CompanyDiscAmt = this.MyFrom.get('CompanyDiscAmt').value || 0;
        let DiscPer2;
        let CompanyDiscPer;

        if (DiscAmt2) {
            if (DiscAmt2 > this.vTotalAmount) {
                this.toastr.warning('Please enter discount amount less than net Amount and greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                return this.vDiscAmount2 = '';
            }
            else {
                this.vDiscountPer2 = ((parseFloat(DiscAmt2) / parseFloat(this.vTotalAmount)) * 100).toFixed(2) || 0;
                DiscPer2 = this.vDiscountPer2;
            }
        } else {
            if (DiscAmt2 == 0 || DiscAmt2 == '' || DiscAmt2 == null || DiscAmt2 == undefined) {
                this.vDiscountPer2 = '';
                DiscPer2 = 0;
            }
        }

        if (CompanyDiscAmt) {
            if (CompanyDiscAmt > this.vTotalAmount) {
                this.toastr.warning('Please enter company discount amt less than netamount and greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                return this.vCompanyDiscAmt = '';
            }
            else {
                this.vCompanyDiscper = ((parseFloat(CompanyDiscAmt) / parseFloat(this.vTotalAmount)) * 100).toFixed(2) || 0;
                CompanyDiscPer = this.vCompanyDiscper;
            }
        }
        else {
            if (CompanyDiscAmt == 0 || CompanyDiscAmt == '' || CompanyDiscAmt == null || CompanyDiscAmt == undefined) {
                this.vCompanyDiscper = '';
                CompanyDiscPer = 0;
            }
        }
        this.vFinalCompanyDiscAmt = Math.round(parseFloat(CompanyDiscAmt) + parseFloat(this.vCompanyDiscAmt2));
        this.vFinalDiscAmt = Math.round(parseFloat(DiscAmt2) + parseFloat(this.vDiscAmount));
        this.vNetamount = Math.round((parseFloat(this.vTotalAmount) - parseFloat(this.vFinalDiscAmt)) - parseFloat(this.vFinalCompanyDiscAmt)).toFixed(2);
    }
    OnSave() {
        const formvalues = this.MyFrom.value
        if (formvalues.DiscAmount2 > 0 || formvalues.CompanyDiscAmt > 0) {
            if (!this.MyFrom.get('ConcessionId').value) {
                this.toastr.warning('Please select Concession Reason ', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                return
            }
        }
        if (formvalues.NetAmount == 0 || formvalues.NetAmount == '' || formvalues.NetAmount == undefined || formvalues.NetAmount == null) {
            this.toastr.warning('Please check final netamount is zero', 'warning !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
            return
        }

        let BalAmt = this.selectedAdvanceObj?.balanceAmt
        if (formvalues?.DiscAmount2 > 0 || formvalues?.CompanyDiscAmt > 0) {
            BalAmt = formvalues?.NetAmount
        }

        this.saveform.get('billNo').setValue(this.selectedAdvanceObj?.billNo)
        this.saveform.get('balanceAmt').setValue(BalAmt)
        this.saveform.get('netPayableAmt').setValue(formvalues?.NetAmount)
        this.saveform.get('concessionAmt').setValue(formvalues?.DiscAmount2 || 0)
        this.saveform.get('compDiscAmt').setValue(formvalues?.CompanyDiscAmt || 0)
        this.saveform.get('concessionReasonId').setValue(formvalues?.ConcessionId)

        if (this.saveform.valid) {
            console.log(this.saveform.value)
            this._IpSearchListService.BillDiscountAfter(this.saveform.value).subscribe(response => {
                if (response) {
                    this._matDialog.closeAll();
                    this.onClose();
                }
            },);
        } else {
            const invalidFields = [];
            if (this.saveform.invalid) {
                for (const controlName in this.saveform.controls) {
                    if (this.saveform.controls[controlName].invalid) {
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
        }
    }
    onClose() {
        this.dialogRef.close();
        this.MyFrom.reset();
    }
    UserDicPerLimit: any = 0;
    getAccessDetail() {
        // debugger
        // const SelectQuery = {
        //     "first": 0,
        //     "rows": 999,
        //     "sortField": "AccessValueId",
        //     "sortOrder": 0,
        //     "filters": [
        //         {
        //             "fieldName": "LoginId",
        //             "fieldValue": String(this.accountService.currentUserValue.userId), //"30091",
        //             "opType": "Equals"
        //         }
        //     ],
        //     "exportType": "JSON",
        //     "columns": []
        // }
        // this._IpSearchListService.getAccessDetailList(SelectQuery).subscribe(response => {
        //     const getUserAccesDetList = response.data as UserDetail[];
        //     console.log("get Access data:", getUserAccesDetList)

        //     const discountData = response.data.find(x => x.accessValueName === 'IsDiscount');
        //     console.log(discountData)
        //     if (discountData?.accessValue) {
        //         this.UserDicPerLimit = discountData?.accessInputValue || 0
        //     }
        // });
    }
    keyPressCharater(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    @ViewChild('save') save: ElementRef;
    @ViewChild('FinalDiscPer') FinalDiscPer: ElementRef;
    @ViewChild('FinalDiscAmt') FinalDiscAmt: ElementRef;

    public onEnterFinalDisc(event): void {
        if (event.which === 13) {
            this.FinalDiscAmt.nativeElement.focus();
        }
    }
    public onEnterFinalDiscAmt(event): void {
        if (event.which === 13) {
            this.save.nativeElement.focus();
        }
    }


    getValidationMessages() {
        return {
            TotalAmount: [
                {
                    name: "pattern", Message: "only Number allowed."
                }
            ],
            FinalDiscAmt: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            FinalCompanyDiscAmt: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            NetAmount: [
                {
                    name: "pattern", Message: "only Number allowed."
                }
            ],
            DiscAmount: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            DiscountPer2: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            DiscAmount2: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            CompanyDiscper: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            CompanyDiscAmt: [{ name: "pattern", Message: "only Number allowed." }],
            ConcessionId: [],
        }
    }
}
