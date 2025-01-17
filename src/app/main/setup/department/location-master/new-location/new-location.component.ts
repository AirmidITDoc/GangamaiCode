import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { LocationMasterService } from '../location-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-location',
    templateUrl: './new-location.component.html',
    styleUrls: ['./new-location.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewLocationComponent implements OnInit {
  locationForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor( public _LocationMasterService: LocationMasterService,
    public dialogRef: MatDialogRef<NewLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

    ngOnInit(): void {
        this.locationForm = this._LocationMasterService.createLocationForm();
        if((this.data?.locationId??0) > 0)
        {
            this.isActive=this.data.isActive
            this.locationForm.patchValue(this.data);
        }
    }

  onSubmit() {
    if(!this.locationForm.invalid) 
    {
        this.saveflag = true;
        
        console.log("location JSON :-",this.locationForm.value);
        
        this._LocationMasterService.locationMasterSave(this.locationForm.value).subscribe((response) => {
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
        this.locationForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            locationName: [
                { name: "required", Message: "Location Name  is required" },
                { name: "maxlength", Message: "Location Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}