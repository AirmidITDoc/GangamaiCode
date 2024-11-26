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

  autocompleteModegroupName:string="GroupName";

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
      // if (this.subgroupForm.valid) {
      //   debugger
      //     this._SubGroupMasterService.SubGroupMasterSave(this.subgroupForm.value).subscribe((response) => {
      //         this.toastr.success(response.message);
      //         this.onClear(true);
      //     }, (error) => {
      //         this.toastr.error(error.message);
      //     });
      // }
      debugger
      if(!this.subgroupForm.get("subGroupId").value){
        var mdata={
            "subGroupId": 0,
            "groupId": this.groupId || 0,
            "subGroupName": this.subgroupForm.get("subGroupName").value || "",
        }
        console.log("sub group:", mdata);

        this._SubGroupMasterService.SubGroupMasterSave(mdata).subscribe((response)=>{
          this.toastr.success(response.message);
          this.onClear(true);
        }, (error)=>{
          this.toastr.error(error.message);
        })
      } else{
        // update
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

}
