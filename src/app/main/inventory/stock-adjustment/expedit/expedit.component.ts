import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { StockAdjustmentService } from '../stock-adjustment.service';

@Component({
    selector: 'app-expedit',
    templateUrl: './expedit.component.html',
    styleUrls: ['./expedit.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ExpeditComponent {
    itemname: any;
    oldExpdate: any;
    newExpdate: any;
    Expform: FormGroup;
    Expform1: FormGroup;
    registerObj: any;
    vBatchNo: any;
    vlastDay: string = '';
    lastDay1: string = '';
    lastDay2: string = '';
    vExpDate: string = '';
    ExpDate: string = '';
    expflag = 0

    constructor(
        public _StockAdjustment: StockAdjustmentService,
        private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: UntypedFormBuilder,
        public datePipe: DatePipe,
        public dialogRef: MatDialogRef<ExpeditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private elementRef: ElementRef,
    ) { }

    ngOnInit(): void {
        if (this.data.Obj) {
            this.registerObj = this.data.Obj;
            console.log(this.registerObj)
            debugger
            this.oldExpdate = this.registerObj.batchExpDate;
            // this.vBatchNo= this.registerObj.batchNo
            this.itemname = this.registerObj.itemName;
            // this.vBatchNo= this.registerObj.batchNo
            // this.itemname = this.registerObj.itemName;
            this.Expform = this._StockAdjustment.createExpForm()
            this.Expform1 = this.createExpForm()

        }

    }


    createExpForm() {
        return this._formBuilder.group({
            batchAdjId: 0,
            storeId: [this.accountService.currentUserValue.user.storeId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            stkId: [this.registerObj.stockId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [this.registerObj.itemId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            oldBatchNo: [this.registerObj.batchNo || ''],
            oldExpDate: [this.datePipe.transform(this.Expform.get('OldexpDate').value, 'yyyy-MM-dd')],
            newBatchNo: [this.registerObj.batchNo || ''],
            newExpDate: [this.Expform.get('NewexpDate').value],
            addedBy: [this.accountService.currentUserValue.userId | 0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }

    onSubmit() {

        if (this.expflag) {
            this.Expform1.get('oldExpDate').setValue(this.datePipe.transform(this.Expform.get('OldexpDate').value, 'yyyy-MM-dd'))

            this.Expform1.get('newExpDate').setValue(this.Expform.get('NewexpDate').value)
            console.log(this.Expform1.value);
            this._StockAdjustment.BatchAdjSave(this.Expform1.value).subscribe(response => {
                this._matDialog.closeAll();

            });
        } else Swal.fire("Enter Exp Date:")
    }



    calculateLastDay() {
        this.expflag = 1
        const inputDate = this.Expform.get("NewexpDate").value;
        const numericPattern = /^[0-9]+$/;
        const CurrentDate = new Date();
        const Currentmonths = new Date();
        const currentMonth = Currentmonths.getMonth();
        console.log(currentMonth)
        const currentYear = CurrentDate.getFullYear();
        console.log(currentYear)
        debugger
        if ((inputDate && inputDate.length === 6) && numericPattern.test(inputDate)) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);

            if (year >= currentYear) {
                if (month <= currentMonth && year == currentYear) {
                    Swal.fire({
                        icon: "warning",
                        title: "This item is already expired",
                        showConfirmButton: false,
                        timer: 1500
                    });
                    this.vlastDay = '';
                    this.Expform.get('NewexpDate').setValue(this.vlastDay)
                    return
                }
                if (month > 12 && month <= 0) {
                    this.vlastDay = '';
                    this.Expform.get('NewexpDate').setValue(this.vlastDay)
                    this.toastr.warning('Invalid month. Month should be between 01 and 12', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                const lastDay = this.getLastDayOfMonth(month, year);
                this.vlastDay = `${lastDay}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay}`;
                const newuserDate = this.datePipe.transform(this.lastDay2, 'yyyy-MM-dd')
                this.Expform.get('NewexpDate').setValue(newuserDate)

            }
        } else {
            this.vlastDay = '';
            this.Expform.get('NewexpDate').setValue(this.vlastDay)
            this.toastr.warning('Please enter only numbers in MMYYYY format', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

    }
    private pad(num: number): string {
        return num.toString().padStart(2, '0');
    }
    private getLastDayOfMonth(month: number, year: number): number {
        return new Date(year, month, 0).getDate();
    }
    OnReset() {
        this.Expform.reset();
        this._matDialog.closeAll();
    }
    onClose() {
        this._matDialog.closeAll();
    }
}
