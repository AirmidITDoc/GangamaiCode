import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GroupMasterService } from '../group-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html',
  styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {
  groupForm: FormGroup;
  constructor(
      public _GroupMasterService: GroupMasterService,
      public dialogRef: MatDialogRef<NewGroupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.groupForm = this._GroupMasterService.createGroupForm();
      var m_data = {
        groupId: this.data?.groupId,
        groupName: this.data?.groupName.trim(),
      //   printSeqNo: this.data?.printSeqNo,
      //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
      //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
      // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.groupForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.groupForm.valid) {
        debugger
          this._GroupMasterService.GroupMasterSave(this.groupForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.groupForm.reset();
      this.dialogRef.close(val);
  }
}