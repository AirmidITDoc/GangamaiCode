import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { BedMasterService } from '../bed-master.service';
import { ToastrService } from 'ngx-toastr';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-bed',
    templateUrl: './new-bed.component.html',
    styleUrls: ['./new-bed.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewBedComponent implements OnInit {

  bedForm: UntypedFormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;
  
  constructor(
      public _BedMasterService: BedMasterService,
      public dialogRef: MatDialogRef<NewBedComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

  autocompleteModeroomId: string = "Room"; 

  roomId = 0;

  ngOnInit(): void {
    this.bedForm = this._BedMasterService.createBedForm();
    if(this.data)
    {
        this.isActive=this.data.isActive
        this.bedForm.patchValue(this.data);
    }
  }

  getValidationMessages() {
    return {
      roomId: [
            { name: "required", Message: "Room Name is required" }
        ],
        bedName: [
          { name: "required", Message: "Bed Name is required" },
          { name: "pattern", Message: "Special char not allowed." }
        ]
    };
  }

  
  onSubmit() {
    if(!this.bedForm.invalid) {
        this.saveflag = true;
    //     this.toastr.warning('please check from is invalid', 'Warning !', {
    //       toastClass:'tostr-tost custom-toast-warning',
    //   })
    //   return;
    // }else{
    // if(!this.bedForm.get("bedId").value){
    //     debugger
    //     var m_data =
    //     {
    //         "bedId": 0,
    //         "bedName": this.bedForm.get("bedName").value,
    //         "roomId": parseInt(this.bedForm.get("roomId").value),
    //         "isAvailible": true
    //     }

        console.log("BedMaster Insert:",this.bedForm.value)

        this._BedMasterService.bedMasterSave(this.bedForm.value).subscribe((response) => {
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

  selectChangeroomId(obj: any){
    console.log(obj);
    this.roomId=obj.value
  }

  onClear(val: boolean) {
      this.bedForm.reset();
      this.dialogRef.close(val);
  }
}
