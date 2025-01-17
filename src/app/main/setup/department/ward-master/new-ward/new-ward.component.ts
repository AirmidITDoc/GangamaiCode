import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { WardMasterService } from '../ward-master.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-ward',
    templateUrl: './new-ward.component.html',
    styleUrls: ['./new-ward.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewWardComponent implements OnInit {
    roomForm: FormGroup;
    isActive:boolean=true;
    saveflag : boolean = false;

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
        if((this.data?.roomId??0) > 0)
            {
            this.isActive=this.data.isActive
            this.roomForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if(!this.roomForm.invalid) 
        {
            this.saveflag = true;
        
            console.log("WardMaster Insert:",this.roomForm.value)

            this._WardMasterService.roomMasterSave(this.roomForm.value).subscribe((response) => {
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

    selectChangelocation(obj: any)
    {
        console.log(obj);
        this.locationId=obj.value
    }

    selectChangeclass(obj: any)
    {
        console.log(obj);
        this.classId=obj.value
    }

    selectChangeroomType(obj: any)
    {
        console.log(obj);
        this.roomType=obj.value
    }

    onClear(val: boolean) 
    {
        this.roomForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() 
    {
        return {
            roomName: [
                { name: "required", Message: "RoomName  is required" },
                { name: "maxlength", Message: "Room Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
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

}