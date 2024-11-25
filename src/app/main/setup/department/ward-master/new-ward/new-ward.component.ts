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

    autocompleteModelocation: string = "locationName";
    autocompleteModeclass: string = "className";
    autocompleteModeroomType: string = "roomType"

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
    
    if (this.roomForm.valid) {
      debugger
        this._WardMasterService.roomMasterSave(this.roomForm.value).subscribe((response) => {
          this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
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