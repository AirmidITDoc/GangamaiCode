import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { RelationshipMasterService } from '../relationship-master.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-relationship',
    templateUrl: './new-relationship.component.html',
    styleUrls: ['./new-relationship.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewRelationshipComponent implements OnInit {
    
    relationshipForm: FormGroup;
    isActive:boolean=true;
    saveflag : boolean = false;

    constructor(
      public _RelationshipMasterService: RelationshipMasterService,
      public dialogRef: MatDialogRef<NewRelationshipComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }

    ngOnInit(): void {
      this.relationshipForm = this._RelationshipMasterService.createRelationshipForm();
        if(this.data)
        {
            this.isActive=this.data.isActive
            this.relationshipForm.patchValue(this.data);
        }
    }

    onSubmit() {
        debugger
        if(!this.relationshipForm.invalid) 
        {
            this.saveflag = true;
            console.log("json :-",this.relationshipForm.value);
            this._RelationshipMasterService.relationshipMasterSave(this.relationshipForm.value).subscribe((response) => {
                this.toastr.success(response.message);
              this.onClear(true);
            }, (error) => {
              this.toastr.error(error.message);
            });
      }
      else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
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