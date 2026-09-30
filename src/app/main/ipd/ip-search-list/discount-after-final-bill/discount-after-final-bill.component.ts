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
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
    selector: 'app-discount-after-final-bill',
    templateUrl: './discount-after-final-bill.component.html',
    styleUrls: ['./discount-after-final-bill.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DiscountAfterFinalBillComponent implements OnInit {
    displayedColumns: string[] = [
        'pBillNo',
        'discountAmt',
        'compDiscountAmt',
        'concessionReason',
        'userName'
    ]
//     [
//     {
//         "billNo": 633027,
//         "pBillNo": "3985",
//         "discountAmt": 88,
//         "compDiscountAmt": 48,
//         "concessionReason": "order by dr nikhil navale sir",
//         "userName": "Rachana29"
//     }
// ]
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
    vpaidAmt:any=0;
    vbalAmt:any=0;
    vCompanyDiscAmt: any;
    vCompanyDiscper: any;
    ConcessionReasonList: any = [];
    vFinalCompanyDiscAmt: any;
    CompanyName: any = '';
    PatientObj: any;
    vCompanyDiscAmt2: any = 0;
    PatientName:any='';
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    currency: any = '';
    autocompleteModeConcession: string = "Concession";
    dsdiscounttracsactionlist = new MatTableDataSource<any>();

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
         this.MyFrom = this.CreateMyForm();
         this.saveform = this.CreatesaveMyForm();
        if (this.data) {
            this.selectedAdvanceObj = this.data.Obj
            this.PatientObj = this.data.PatientObj 
            this.PatientName = this.PatientObj?.firstName + ' ' + this.PatientObj?.middleName + ' ' + this.PatientObj?.lastName || ''
            this.vDiscAmount = Math.round(this.selectedAdvanceObj.concessionAmt);
            this.vCompanyDiscAmt2 = Math.round(this.selectedAdvanceObj.compDiscAmt);
            this.CompanyName = this.selectedAdvanceObj.companyName || '';
            this.vTotalAmount = Math.round(this.selectedAdvanceObj.totalAmt);
            this.vFinalNetAmt = Math.round(this.selectedAdvanceObj.netPayableAmt)
            this.vNetamount = Math.round(this.selectedAdvanceObj.netPayableAmt)
            this.vFinalDiscAmt = Math.round(this.selectedAdvanceObj.concessionAmt);
            this.vFinalCompanyDiscAmt = Math.round(this.selectedAdvanceObj.compDiscAmt);
            this.CompanyName = this.selectedAdvanceObj.companyName || '';
            this.vbalAmt  =  Math.round(this.selectedAdvanceObj?.balanceAmt).toFixed(2) || 0 ;
            this.vpaidAmt = Math.round(this.selectedAdvanceObj?.paidAmount).toFixed(2) || 0 ;
            this.MyFrom.get('PaidAmount').setValue(this.vpaidAmt);
            this.MyFrom.get('BalAmount').setValue(this.vbalAmt);
            this.getDiscounttransactionlist(this.selectedAdvanceObj?.billNo)
        }
       
        

             const discountData = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'IsDiscount');  
            if (discountData?.AccessValue) {
                this.UserDicPerLimit = discountData?.AccessInputValue || 0
            }


         const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue
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
            BalAmount:[0],
            PaidAmount:[0]
        });
    }
    CreatesaveMyForm(): FormGroup {
        return this.formBuilder.group({
            billNo: [0, [this._formvalidationservice.notEmptyOrZeroValidator()]],
            netPayableAmt: [0, [this._formvalidationservice.AllowDecimalNumberValidator()]],
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
            this.MyFrom.get('DiscountPer2').setValue('');
            this.vDiscountPer2 = '';
            return ;
        }
        else {
            this.vDiscAmount2 = ((parseFloat(this.vbalAmt) * parseFloat(DiscPer2)) / 100).toFixed(2) || 0;
            DiscAmt2 = this.vDiscAmount2;
           this.MyFrom.get('DiscAmount2').setValue(DiscAmt2)
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
            this.MyFrom.get('CompanyDiscper').setValue('');
            return this.vCompanyDiscper = '';
        }
        else {
            this.vCompanyDiscAmt = ((parseFloat(this.vbalAmt) * parseFloat(CompanyDiscPer)) / 100).toFixed(2) || 0;
            CompanyDiscAmt = this.vCompanyDiscAmt;
               this.MyFrom.get('CompanyDiscAmt').setValue(CompanyDiscAmt)
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

    const remainingBalance = parseFloat(this.vbalAmt) - parseFloat(DiscAmt2 || 0) - parseFloat(CompanyDiscAmt || 0);
    this.vNetamount = (parseFloat(this.vpaidAmt || 0) + remainingBalance).toFixed(2);
    this.MyFrom.get('NetAmount').setValue(this.vNetamount);
    this.MyFrom.get('BalAmount').setValue(remainingBalance.toFixed(2));
}

CalcDiscAmt() {
        debugger
        const DiscAmt2 = this.MyFrom.get('DiscAmount2').value || 0;
        const CompanyDiscAmt = this.MyFrom.get('CompanyDiscAmt').value || 0;
        let DiscPer2;
        let CompanyDiscPer;

        if (DiscAmt2) {
            if (+DiscAmt2 > +this.vbalAmt) {
                this.toastr.warning('Please enter discount amount less than net Amount and greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                this.MyFrom.get('DiscAmount2').setValue('');
                return this.vDiscAmount2 = '';
            }
            else {
                this.vDiscountPer2 = ((parseFloat(DiscAmt2) / parseFloat(this.vbalAmt)) * 100).toFixed(2) || 0;
                DiscPer2 = this.vDiscountPer2; 
                this.MyFrom.get("DiscountPer2").setValue(DiscPer2);

                  const DiscountPer = +DiscPer2 || 0;
                if (this.UserDicPerLimit > 0) {
                    if (DiscountPer > this.UserDicPerLimit) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Discount Limit Exceeded',
                            text: `You are allowed to apply a maximum discount of ${this.UserDicPerLimit}%. Please contact the administrator if you require a higher discount.`,
                            confirmButtonColor: '#d33'
                        }).then(() => {
                            this.MyFrom.get("DiscountPer2").setValue(this.UserDicPerLimit);
                            this.MyFrom.get('DiscAmount2').setValue('');
                            this.vDiscAmount2 = '';
                            this.CalcDiscPer();
                            return;
                        })
                    }
                } 
            }
        } else {
            if (DiscAmt2 == 0 || DiscAmt2 == '' || DiscAmt2 == null || DiscAmt2 == undefined) {
                this.vDiscountPer2 = '';
                DiscPer2 = 0;
            }
        }

        if (CompanyDiscAmt) {
            if (+CompanyDiscAmt > +this.vbalAmt) {
                this.toastr.warning('Please enter company discount amt less than Balance Amt and greater than 0', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                this.MyFrom.get('CompanyDiscAmt').setValue('');
                return this.vCompanyDiscAmt = '';
            }
            else {
                this.vCompanyDiscper = ((parseFloat(CompanyDiscAmt) / parseFloat(this.vbalAmt)) * 100).toFixed(2) || 0;
                CompanyDiscPer = this.vCompanyDiscper;
                 this.MyFrom.get("CompanyDiscper").setValue(CompanyDiscPer);

            const DiscountPer = +CompanyDiscPer || 0;
                if (this.UserDicPerLimit > 0) {
                    if (DiscountPer > this.UserDicPerLimit) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Discount Limit Exceeded',
                            text: `You are allowed to apply a maximum discount of ${this.UserDicPerLimit}%. Please contact the administrator if you require a higher discount.`,
                            confirmButtonColor: '#d33'
                        }).then(() => {
                            this.MyFrom.get("CompanyDiscper").setValue(this.UserDicPerLimit);
                            this.MyFrom.get('CompanyDiscAmt').setValue('');
                            this.vCompanyDiscAmt = '';
                            this.CalcDiscPer();
                            return;
                        })
                    }
                }
                 
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

        const remainingBalance = parseFloat(this.vbalAmt) - parseFloat(DiscAmt2 || 0) - parseFloat(CompanyDiscAmt || 0);
        this.vNetamount = (parseFloat(this.vpaidAmt || 0) + remainingBalance).toFixed(2);
        this.MyFrom.get('NetAmount').setValue(this.vNetamount);
        this.MyFrom.get('BalAmount').setValue(remainingBalance.toFixed(2));
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
        if(this.selectedAdvanceObj?.opdipdType != 1){
        if (formvalues.NetAmount == 0 || formvalues.NetAmount == '' || formvalues.NetAmount == undefined || formvalues.NetAmount == null) {
            this.toastr.warning('Please check final netamount is zero', 'warning !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
            return
        }}

        // let BalAmt = this.selectedAdvanceObj?.balanceAmt
        // const  paidamt = this.selectedAdvanceObj?.paidAmount
        // if (formvalues?.DiscAmount2 > 0 || formvalues?.CompanyDiscAmt > 0) { 
        //     if(paidamt) {
        //         BalAmt = formvalues?.NetAmount - paidamt
        //     }else{
        //         BalAmt = formvalues?.NetAmount
        //     } 
        // }

        this.saveform.get('billNo').setValue(this.selectedAdvanceObj?.billNo)
        this.saveform.get('balanceAmt').setValue(formvalues?.BalAmount || 0)
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
     getDiscounttransactionlist(BillNo) {
    
            const m_data2 = {
                "first": 0,
                "rows": 999,
                "sortField": "BillNo",
                "sortOrder": 0,
                "filters": [ { "fieldName": "BillNo", "fieldValue": String(BillNo), "opType": "Equals" } ],
                "exportType": "JSON",
                "columns": [ { "data": "string", "name": "string" } ]
            }
    
            this._IpSearchListService.getDiscounttransactionlist(m_data2).subscribe((data) => {
    
            this.dsdiscounttracsactionlist.data = data?.data || [];
            this.dsdiscounttracsactionlist.sort = this.sort
            this.dsdiscounttracsactionlist.paginator = this.paginator
            });
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
             PaidAmount: [{ name: "pattern", Message: "only Number allowed." }],
            BalAmount: [{ name: "pattern", Message: "only Number allowed." }],
            ConcessionId: [],
        }
    }
}
