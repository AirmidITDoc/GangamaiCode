import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UnitmasterService } from '../unitmaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.scss']
})
export class NewUnitComponent implements OnInit {
  unitForm: FormGroup;
  constructor(
      public _UnitmasterService: UnitmasterService,
      public dialogRef: MatDialogRef<NewUnitComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.unitForm = this._UnitmasterService.createUnitmasterForm();
      var m_data = {
        unitId: this.data?.unitId,
        unitName: this.data?.unitName.trim(),
      //   printSeqNo: this.data?.printSeqNo,
      //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
      //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
      // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.unitForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.unitForm.valid) {
        debugger
          this._UnitmasterService.unitMasterSave(this.unitForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.unitForm.reset();
      this.dialogRef.close(val);
  }
}
