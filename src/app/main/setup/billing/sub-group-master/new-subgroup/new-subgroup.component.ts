import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { SubGroupMasterService } from '../sub-group-master.service';
import { UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-subgroup',
    templateUrl: './new-subgroup.component.html',
    styleUrls: ['./new-subgroup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewSubgroupComponent implements OnInit {

  autocompleteModegroupName:string="GroupName";

  subgroupForm: UntypedFormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor(
      public _SubGroupMasterService: SubGroupMasterService,
      public dialogRef: MatDialogRef<NewSubgroupComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
 
    ngOnInit(): void {
        this.subgroupForm = this._SubGroupMasterService.createSubgroupForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.subgroupForm.patchValue(this.data);
        }
    }


    onSubmit() {    
      debugger
        if(!this.subgroupForm.invalid)
        {
        //   var mdata={
        //       "subGroupId": 0,
        //       "groupId": this.subgroupForm.get("groupId").value || 0,
        //       "subGroupName": this.subgroupForm.get("subGroupName").value || "",
        //   }
            console.log("sub group:", this.subgroupForm.value);
  
            this._SubGroupMasterService.SubGroupMasterSave(this.subgroupForm.value).subscribe((response)=>{
            this.toastr.success(response.message);
            this.onClear(true);
          }, (error)=>{
            this.toastr.error(error.message);
          })
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
      this.subgroupForm.reset();
      this.dialogRef.close(val);
  }

  //new api

  groupId=0;

  selectChangegroupName(obj:any){
    this.groupId=obj.value;
  }

    getValidationMessages() {
        return {
            subGroupName: [
                { name: "required", Message: "SubGroup Name is required" },
                { name: "maxlength", Message: "SubGroup name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            groupId: [
                { name: "required", Message: "Group Name is required" }
            ]
        };
    }

}
