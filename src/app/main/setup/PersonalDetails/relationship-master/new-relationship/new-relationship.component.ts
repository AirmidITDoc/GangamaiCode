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
  isActive:boolean=true
  constructor(
      public _RelationshipMasterService: RelationshipMasterService,
      public dialogRef: MatDialogRef<NewRelationshipComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.relationshipForm = this._RelationshipMasterService.createRelationshipForm();
      if(this.data)
        this.isActive=this.data.isActive
      this.relationshipForm.patchValue(this.data);
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
  
      if (this.relationshipForm.valid) {
          this._RelationshipMasterService.relationshipMasterSave(this.relationshipForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
    }
  
    getValidationMessages() {
      return {
          relationshipName: [
              { name: "required", Message: "Relationship Name is required" },
              { name: "maxlength", Message: "Relationship name should not be greater than 50 char." },
              { name: "pattern", Message: "Special char not allowed." }
          ]
      };
  }
  onClear(val: boolean) {
      this.relationshipForm.reset();
      this.dialogRef.close(val);
  }

}