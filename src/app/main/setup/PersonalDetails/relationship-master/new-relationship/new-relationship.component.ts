import { Component, Inject, OnInit } from '@angular/core';
import { RelationshipMasterService } from '../relationship-master.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-relationship',
  templateUrl: './new-relationship.component.html',
  styleUrls: ['./new-relationship.component.scss']
})
export class NewRelationshipComponent implements OnInit {
  relationshipForm: FormGroup;
  constructor(
      public _RelationshipMasterService: RelationshipMasterService,
      public dialogRef: MatDialogRef<NewRelationshipComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.relationshipForm = this._RelationshipMasterService.createRelationshipForm();
      var m_data = {
        relationshipId: this.data?.relationshipId || 0,
        relationshipName: this.data?.relationshipName.trim(),
        isDeleted: JSON.stringify(this.data?.isActive),
        addBy:10,
        updatedBy:1
      };
      this.relationshipForm.patchValue(m_data);
  }
  onSubmit() {
    debugger
      if (this.relationshipForm.valid) {
          this._RelationshipMasterService.relationshipMasterSave(this.relationshipForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.relationshipForm.reset();
      this.dialogRef.close(val);
  }

}