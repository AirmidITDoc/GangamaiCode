import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemGenericMasterService } from '../item-generic-master.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-generic',
  templateUrl: './new-generic.component.html',
  styleUrls: ['./new-generic.component.scss']
})
export class NewGenericComponent implements OnInit {
  genericForm: FormGroup;
  constructor(
      public _ItemGenericMasterService: ItemGenericMasterService,
      public dialogRef: MatDialogRef<NewGenericComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.genericForm = this._ItemGenericMasterService.createItemgenericForm();
      var m_data = {
        itemGenericNameId: this.data?.itemGenericNameId,
        itemGenericName: this.data?.itemGenericName.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.genericForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.genericForm.valid) {
          this._ItemGenericMasterService.genericMasterSave(this.genericForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.genericForm.reset();
      this.dialogRef.close(val);
  }
}

