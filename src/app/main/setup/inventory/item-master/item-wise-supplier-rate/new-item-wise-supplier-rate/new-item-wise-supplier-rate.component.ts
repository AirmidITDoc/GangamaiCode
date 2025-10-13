import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ItemMasterService } from '../../item-master.service';

@Component({
  selector: 'app-new-item-wise-supplier-rate',
  templateUrl: './new-item-wise-supplier-rate.component.html',
  styleUrls: ['./new-item-wise-supplier-rate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewItemWiseSupplierRateComponent {
  ItemWiseSuppRateForm: FormGroup;
  autocompleteModeSupplierType: string = "SupplierMaster"
  autocompleteModeItemName: string = "Item";

  constructor(
    public _ItemMasterService: ItemMasterService,
    public dialogRef: MatDialogRef<NewItemWiseSupplierRateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.ItemWiseSuppRateForm = this._ItemMasterService.createItemwiseSuppRateForm();
    if ((this.data?.itemId ?? 0) > 0) {
      this.ItemWiseSuppRateForm.patchValue(this.data);
    }
  }

  selectChangeSupplierType(obj:any){
    console.log(obj)
  }

  onSubmit() {
    if (this.ItemWiseSuppRateForm.valid) {
      console.log(this.ItemWiseSuppRateForm.value);
      // this._ItemMasterService.genericMasterSave(this.ItemWiseSuppRateForm.value).subscribe((response) => {
      //   this.onClear(true);
      // });
    }
    else {
      const invalidFields: string[] = [];

      Object.keys(this.ItemWiseSuppRateForm.controls).forEach((controlName) => {
        const control = this.ItemWiseSuppRateForm.controls[controlName];
        if (control.invalid) {
          invalidFields.push(controlName);
        }
      });

      if (invalidFields.length > 0) {
        invalidFields.forEach((field) => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
        });
      }
    }
  }

  onClear(val: boolean) {
    this.ItemWiseSuppRateForm.reset();
    this.dialogRef.close(val);
  }
}
