import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CashCounterMasterService } from '../cash-counter-master.service';

@Component({
    selector: 'app-new-cash-counter',
    templateUrl: './new-cash-counter.component.html',
    styleUrls: ['./new-cash-counter.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCashCounterComponent implements OnInit {

    cashcounterForm: FormGroup;
    isActive:boolean=true;
    
    constructor(
        public _CashCounterMasterService: CashCounterMasterService,
        public dialogRef: MatDialogRef<NewCashCounterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
 
    ngOnInit(): void {
        this.cashcounterForm = this._CashCounterMasterService.createcashcounterForm();
        this.cashcounterForm.markAllAsTouched();

        if((this.data?.cashCounterId??0) > 0)
        {
            this.isActive=this.data.isActive
            this.cashcounterForm.patchValue(this.data);
        }
    }

    onSubmit() {
        
        if (!this.cashcounterForm.invalid) {
            console.log(this.cashcounterForm.value)
            this._CashCounterMasterService.cashcounterMasterSave(this.cashcounterForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.cashcounterForm.invalid) {
                for (const controlName in this.cashcounterForm.controls) {
                    if (this.cashcounterForm.controls[controlName].invalid) {
                        invalidFields.push(`cashcounter Form: ${controlName}`);
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

    onClear(val: boolean) {
      this.cashcounterForm.reset();
      this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            cashCounterName: [
                { name: "required", Message: "CashCounter Name is required" },
                { name: "maxlength", Message: "CashCounter name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            prefix: [
                { name: "required", Message: "Prefix Name is required" },
                { name: "maxlength", Message: "Prefix name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            billNo: [
                { name: "required", Message: "BillNo No is required" },
                { name: "maxlength", Message: "BillNo no should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed, only digits." }
            ],
        };
    }

    
}
