import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { ExpensesCategoryMasterComponent } from '../expenses-category-master/expenses-category-master.component';
import { ExpensesHeadMasterComponent } from '../expenses-head-master/expenses-head-master.component';
import { ExpensesService } from '../expenses.service';

@Component({
    selector: 'app-new-expenses',
    templateUrl: './new-expenses.component.html',
    styleUrls: ['./new-expenses.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewExpensesComponent {

    myForm: FormGroup
    screenFromString = 'Common-form';
    dateTimeObj: any;
    vExpType: any = "0";
    vReason: any;
    autocompleteExpensen: string = "ExpHeadMaster"
    autocompleteExpensenCategory: string = "MExpensesCategory"

    constructor(public _ExpensesService: ExpensesService,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<NewExpensesComponent>,
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        private commonService: PrintserviceService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.myForm = this._ExpensesService.CreateMyForm();
        this.myForm.markAllAsTouched();
        if ((this.data?.expID ?? 0) > 0) {
            this.vExpType = this.data.expType
            this.vReason = this.data.narration
            this.myForm.patchValue(this.data);
            console.log(this.data)
        }
    }

    getDateTime(dateTimeObj) {
        console.log(dateTimeObj)
        this.dateTimeObj = dateTimeObj;
    }

    onExpTypeChange() {
        const expType = this.myForm.get('expType')?.value;
        const utrControl = this.myForm.get('utrno');

        if (expType === '0') {
            utrControl?.clearValidators();
            utrControl?.reset();
        } else {
            utrControl?.setValidators([Validators.required]);
        }
        utrControl?.updateValueAndValidity();
    }

    onUtrInput(event: any) {
        const input = event.target.value;
        event.target.value = input.replace(/[^0-9]/g, '').slice(0, 10);
        this.myForm.get('utrno').setValue(event.target.value, { emitEvent: false });
    }

    onNewSave() {
        const formattedDate = this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd");
        const formattedTime = this.dateTimeObj.time;
        this.myForm.get('expDate').setValue(formattedDate);
        this.myForm.get('expTime').setValue(formattedDate + ' ' + formattedTime);

        if (!this.myForm.invalid) {
            console.log(this.myForm.value)
            this._ExpensesService.ExpensesSave(this.myForm.value).subscribe((response) => {
                this.OnPrint(response)
                this.onClose();
            });
        } {
            const invalidFields = [];
            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                    if (this.myForm.controls[controlName].invalid) {
                        invalidFields.push(`Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }
    }

    OnPrint(element) {
        this.commonService.Onprint("ExpId", element, "ExpenseVoucharPrint");
    }

    ListView1(value) {
        console.log(value)
    }

    onClose() {
        this.myForm.reset();
        this.dialogRef.close();
    }

    addNewheadExpenses() {
        const dialogRef = this._matDialog.open(ExpensesHeadMasterComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90vh',
                // height: '90%',
                width: '60%',
            });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    addNewCategoryExpenses() {
        const dialogRef = this._matDialog.open(ExpensesCategoryMasterComponent,
            {
                maxWidth: "95vw",
                maxHeight: '90vh',
                // height: '90%',
                width: '60%',
            });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
