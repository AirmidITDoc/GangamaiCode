import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ItemTypeMasterService } from '../item-type-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-itemtype',
  templateUrl: './new-itemtype.component.html',
  styleUrls: ['./new-itemtype.component.scss']
})
export class NewItemtypeComponent implements OnInit {

  itemtypeForm: FormGroup;
  constructor(
      public _ItemTypeMasterService: ItemTypeMasterService,
      public dialogRef: MatDialogRef<NewItemtypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.itemtypeForm = this._ItemTypeMasterService.createItemtypeForm();
      var m_data = {
        itemTypeId: this.data?.itemTypeId,
        itemTypeName: this.data?.itemTypeName.trim(),
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.itemtypeForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.itemtypeForm.valid) {
          this._ItemTypeMasterService.itemtypeMasterSave(this.itemtypeForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.itemtypeForm.reset();
      this.dialogRef.close(val);
  }
}
