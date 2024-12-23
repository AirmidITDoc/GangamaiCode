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
    isActive:boolean=true

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
    if(this.data){
     this.isActive=this.data.isActive
      this.roomForm.patchValue(this.data);}
   
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
    
    if (this.roomForm.invalid) {
      
        console.log("WardMaster Insert:",this.roomForm.value)

        this._WardMasterService.roomMasterSave(this.roomForm.value).subscribe((response) => {
        this.toastr.success(response.message);
       this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    
    }
}

getValidationMessages() {
  return {
    locationId: [
          { name: "required", Message: "Location Name is required" }
      ],
      classId: [
        { name: "required", Message: "Class Name is required" }
    ],
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