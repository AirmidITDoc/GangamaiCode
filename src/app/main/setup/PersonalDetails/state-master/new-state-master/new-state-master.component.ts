import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StateMasterService } from '../state-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-state-master',
  templateUrl: './new-state-master.component.html',
  styleUrls: ['./new-state-master.component.scss']
})
export class NewStateMasterComponent implements OnInit {

  stateForm: FormGroup;
  constructor(
      public _StateMasterService: StateMasterService,
      public dialogRef: MatDialogRef<NewStateMasterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.stateForm = this._StateMasterService.createStateForm();
      var m_data = {
        stateId: this.data?.stateId,
        stateName: this.data?.stateName.trim(),
        countryId: this.data?.countryId,
          isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.stateForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.stateForm.valid) {
          this._StateMasterService.stateMasterSave(this.stateForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.stateForm.reset();
      this.dialogRef.close(val);
  }
}