import { Component, Inject, OnInit } from '@angular/core';
import { LocationMasterService } from '../location-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-location',
  templateUrl: './new-location.component.html',
  styleUrls: ['./new-location.component.scss']
})
export class NewLocationComponent implements OnInit {
  locationForm: FormGroup;
  isActive:boolean=true

  constructor( public _LocationMasterService: LocationMasterService,
    public dialogRef: MatDialogRef<NewLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.locationForm = this._LocationMasterService.createLocationForm();
     if(this.data){
     this.isActive=this.data.isActive
      this.locationForm.patchValue(this.data);}
   
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
    
   
    if (this.locationForm.valid) {
        this._LocationMasterService.locationMasterSave(this.locationForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
  }
  getValidationMessages() {
    return {
        locationName: [
            { name: "required", Message: "LocationName  is required" },
            { name: "maxlength", Message: "LocationName should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
}

onClear(val: boolean) {
    this.locationForm.reset();
    this.dialogRef.close(val);
}
}