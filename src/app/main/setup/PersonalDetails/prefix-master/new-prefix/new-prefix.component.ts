import { Component, Inject, OnInit } from '@angular/core';
import { PrefixMasterService } from '../prefix-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel } from 'app/core/models/gridRequest';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-new-prefix',
  templateUrl: './new-prefix.component.html',
  styleUrls: ['./new-prefix.component.scss']
})
export class NewPrefixComponent implements OnInit {
  msg: any;
  prefixForm: FormGroup;
 
  constructor(
      public _PrefixMasterService: PrefixMasterService,
      public dialogRef: MatDialogRef<NewPrefixComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService, public _matDialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.prefixForm = this._PrefixMasterService.createPrefixForm();
    var m_data = {
        prefixId: this.data?.prefixId,
        prefixName: this.data?.prefixName.trim(),
        isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.prefixForm.patchValue(m_data);
  }




  onSubmit() {
    if (this.prefixForm.valid) {
        this._PrefixMasterService.prefixMasterSave(this.prefixForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
}

onClear(val: boolean) {
    this.prefixForm.reset();
    this.dialogRef.close(val);
}
}

