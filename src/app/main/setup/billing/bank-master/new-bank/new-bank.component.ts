import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { BankMasterService } from '../bank-master.service';

@Component({
  selector: 'app-new-bank',
  templateUrl: './new-bank.component.html',
  styleUrls: ['./new-bank.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewBankComponent implements OnInit {

  bankForm: FormGroup;
  isActive: boolean = true;
  bankName: any;

  constructor(
    public _BankMasterService: BankMasterService,
    public dialogRef: MatDialogRef<NewBankComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }


  ngOnInit(): void {

    this.bankForm = this._BankMasterService.createBankForm();
    this.bankForm.markAllAsTouched();

    if ((this.data?.bankId ?? 0) > 0) {

      this.isActive = this.data.isActive
      this.data.bankName = this.data.bankName.trim()
      this.bankForm.patchValue(this.data);
      console.log(this.data)
    }
  }

  onSubmit() {
    if (!this.bankForm.invalid) {
      console.log(this.bankForm.value)
      this._BankMasterService.bankMasterSave(this.bankForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.bankForm.invalid) {
        for (const controlName in this.bankForm.controls) {
          if (this.bankForm.controls[controlName].invalid) {
            invalidFields.push(`bank Form: ${controlName}`);
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
    this.bankForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      bankName: [
        { name: "required", Message: "Bank Name is required" },
        // { name: "maxlength", Message: "Bank Name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    }
  }


}