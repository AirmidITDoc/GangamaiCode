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
    isActive:boolean=true;
    saveflag : boolean = false;

    constructor(
        public _GroupMasterService: GroupMasterService,
        public dialogRef: MatDialogRef<NewGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
 
    ngOnInit(): void {
        this.groupForm = this._GroupMasterService.createGroupForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.groupForm.patchValue(this.data);
        }
    }

    onSubmit() {
        debugger
        if(!this.groupForm.invalid)
        {  
            this.saveflag = true;

            console.log("bank json:", this.groupForm.value);

            this._GroupMasterService.GroupMasterSave(this.groupForm.value).subscribe((response) => {
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

    onClear(val: boolean) {
        this.groupForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            groupName: [
                { name: "required", Message: "Group Name is required" },
                { name: "maxlength", Message: "Group name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
