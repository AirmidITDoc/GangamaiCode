import { Component, Inject, OnInit } from '@angular/core';
import { BedMasterService } from '../bed-master.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-bed',
  templateUrl: './new-bed.component.html',
  styleUrls: ['./new-bed.component.scss']
})
export class NewBedComponent implements OnInit {

  bedForm: FormGroup;
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
      var m_data = {
        bedId: this.data?.bedId,
        bedName: this.data?.bedName.trim(),
        roomId: this.data?.roomId || this.roomId,
        isAvailible: JSON.stringify(this.data?.isAvailible),
         // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.bedForm.patchValue(m_data);
  }


  getValidationroomeMessages() {
    return {
      roomId: [
            { name: "required", Message: "Room Name is required" }
        ]
    };
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
    
    if (this.bedForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
    if(!this.bedForm.get("bedId").value){
        debugger
        var m_data =
        {
            "bedId": 0,
            "bedName": this.bedForm.get("bedName").value,
            "roomId": parseInt(this.bedForm.get("roomId").value),
            "isAvailible": true
        }

          console.log("BedMaster Insert:",m_data)

        this._BedMasterService.bedMasterSave(m_data).subscribe((response) => {
        this.toastr.success(response.message);
       this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    } else{
        // update
    }
    //   if (this.bedForm.valid) {
    //       this._BedMasterService.bedMasterSave(this.bedForm.value).subscribe((response) => {
    //           this.toastr.success(response.message);
    //           this.onClear(true);
    //       }, (error) => {
    //           this.toastr.error(error.message);
    //       });
    //   }
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
