import { Component, Inject, OnInit } from '@angular/core';
import { SubGroupMasterService } from '../sub-group-master.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-subgroup',
  templateUrl: './new-subgroup.component.html',
  styleUrls: ['./new-subgroup.component.scss']
})
export class NewSubgroupComponent implements OnInit {

  subgroupForm: FormGroup;
  constructor(
      public _SubGroupMasterService: SubGroupMasterService,
      public dialogRef: MatDialogRef<NewSubgroupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
 
  ngOnInit(): void {
      this.subgroupForm = this._SubGroupMasterService.createSubgroupForm();
      var m_data = {
        subGroupId: this.data?.subGroupId,
        subGroupName: this.data?.subGroupName.trim(),
        groupId: this.data?.groupId,
        isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.subgroupForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.subgroupForm.valid) {
        debugger
          this._SubGroupMasterService.SubGroupMasterSave(this.subgroupForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.subgroupForm.reset();
      this.dialogRef.close(val);
  }
}
