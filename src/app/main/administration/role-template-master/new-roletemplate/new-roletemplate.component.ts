import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { RoleTemplateService } from '../role-template.service';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-new-roletemplate',
    templateUrl: './new-roletemplate.component.html',
    styleUrls: ['./new-roletemplate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewRoletemplateComponent implements OnInit {

    myform: FormGroup;
    isActive:boolean=true;
    vRoleId:any;

    constructor(
        public _RoleTemplateService: RoleTemplateService,
        public dialogRef: MatDialogRef<NewRoletemplateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
 
    ngOnInit(): void {
        this.myform = this._RoleTemplateService.createRoleForm();
        if((this.data?.roleId??0) > 0)
        {
            console.log(this.data)
            this.vRoleId=this.data.roleId;
            this.isActive=this.data.isActive
            this.myform.patchValue(this.data);
        }
    }
    onSubmit() {
        
   
        if (this.myform.valid) {

            console.log("JSON :-",this.myform.value)

            this._RoleTemplateService.roleMasterSave(this.myform.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
            }, (error) => {
              this.toastr.error(error.message);
            });
        }
        else
        {
            this.toastr.warning('Please Enter Valid data.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
            });
        }
    }     
  
    onClear(val: boolean) {
        this.myform.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            roleName: [
                { name: "required", Message: "Class Name is required" },
                { name: "maxlength", Message: "Class name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
