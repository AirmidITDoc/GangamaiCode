import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CashCounterMasterService } from '../cash-counter-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

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
    saveflag : boolean = false;
    
    constructor(
        public _CashCounterMasterService: CashCounterMasterService,
        public dialogRef: MatDialogRef<NewCashCounterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
 
    ngOnInit(): void {
        this.cashcounterForm = this._CashCounterMasterService.createcashcounterForm();
        if((this.data?.cashCounterId??0) > 0)
        {
            this.isActive=this.data.isActive
            this.cashcounterForm.patchValue(this.data);
        }
    }

    onSubmit() {
        
        if (!this.cashcounterForm.invalid) 
        {
            this.saveflag = true;
            
            console.log("cashcounter JSON :-",this.cashcounterForm.value);

            this._CashCounterMasterService.cashcounterMasterSave(this.cashcounterForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else
        {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
                });
            return;
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
                { name: "required", Message: "BillNo Name is required" },
                { name: "maxlength", Message: "BillNo name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed, only digits." }
            ],
        };
    }

    
}
