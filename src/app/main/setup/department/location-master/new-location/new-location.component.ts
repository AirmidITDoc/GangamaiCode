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
  constructor( public _LocationMasterService: LocationMasterService,
    public dialogRef: MatDialogRef<NewLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.locationForm = this._LocationMasterService.createLocationForm();
    var m_data = {
      locationId: this.data?.locationId,
      locationName: this.data?.locationName.trim(),
      isDeleted: JSON.stringify(this.data?.isActive),
    };
    this.locationForm.patchValue(m_data);
  }

  onSubmit() {
    if (this.locationForm.valid) {
        this._LocationMasterService.locationMasterSave(this.locationForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
}

onClear(val: boolean) {
    this.locationForm.reset();
    this.dialogRef.close(val);
}
}