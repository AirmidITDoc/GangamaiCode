import { Component, Inject, OnInit } from '@angular/core';
import { WardMasterService } from '../ward-master.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-ward',
  templateUrl: './new-ward.component.html',
  styleUrls: ['./new-ward.component.scss']
})
export class NewWardComponent implements OnInit {
    roomForm: FormGroup;
    constructor( public _WardMasterService: WardMasterService,
    public dialogRef: MatDialogRef<NewWardComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

    autocompleteModelocation: string = "City";
    autocompleteModeclass: string = "Class";
    autocompleteModeroomId: string = "Room"; 

    locationId =0;
    classId = 0;
    roomType = 0;

    
  ngOnInit(): void {
    this.roomForm = this._WardMasterService.createWardForm();
    var m_data = {
      roomId: this.data?.roomId || 0,
      roomName: this.data?.roomName.trim(),
      roomType: this.data?.roomType || this.roomType,
      locationId: this.data?.locationId || this.locationId,
      isAvailable: JSON.stringify(this.data?.isAvailable),
      classId: this.data?.classId || this.classId
      //  isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.roomForm.patchValue(m_data);
  }

  onSubmit() {
    debugger
    // if(!this.roomForm.get("roomId").value){
        debugger
        // {
        //     "roomId": 0,
        //     "roomName": "kiran",
        //     "roomType": 0,
        //     "locationId": 0,
        //     "isAvailible": true,
        //     "classId": 0
        //   }
        var mdata =
        {
            "roomId": 0,
            "roomName": this.roomForm.get("roomName").value,
            "roomType": this.roomForm.get("roomType").value,
            "locationId": 0,
            "isAvailible": true,
            "classId": 0
        }
        console.log("WardMaster Insert:",mdata)

        this._WardMasterService.roomMasterSave(mdata).subscribe((response) => {
        this.toastr.success(response.message);
       this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    // } 
    // else
    // {
    //     // update
    // }
    // if (this.roomForm.valid) {
    // //   debugger
    //     this._WardMasterService.roomMasterSave(this.roomForm.value).subscribe((response) => {
    //       this.toastr.success(response.message);
    //         this.onClear(true);
    //     }, (error) => {
    //         this.toastr.error(error.message);
    //     });
    // }
}

getValidationlocationMessages() {
  return {
    locationId: [
          { name: "required", Message: "Location Name is required" }
      ]
  };
}


getValidationclassMessages() {
  return {
    classId: [
          { name: "required", Message: "Class Name is required" }
      ]
  };
}


getValidationroomMessages() {
  return {
    roomId: [
          { name: "required", Message: "Room Name is required" }
      ]
  };
}


selectChangelocation(obj: any){
    console.log(obj);
    this.locationId=obj.value
  }

  selectChangeclass(obj: any){
    console.log(obj);
    this.classId=obj.value
  }

  selectChangeroomType(obj: any){
    console.log(obj);
    this.roomType=obj.value
  }

onClear(val: boolean) {
    this.roomForm.reset();
    this.dialogRef.close(val);
}
}