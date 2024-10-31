import { Component, Inject, OnInit } from '@angular/core';
import { CityMasterService } from '../city-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-new-city',
  templateUrl: './new-city.component.html',
  styleUrls: ['./new-city.component.scss']
})
export class NewCityComponent implements OnInit {
 
    cityForm: FormGroup;
    constructor(
        public _CityMasterService: CityMasterService,
        public dialogRef: MatDialogRef<NewCityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
  
  
    ngOnInit(): void {
        this.cityForm = this._CityMasterService.createCityForm();
        var m_data = {
            cityId: this.data?.cityId,
            cityName: this.data?.cityName.trim(),
            stateId: this.data?.stateId,
            isDeleted: JSON.stringify(this.data?.isActive),
        };
        this.cityForm.patchValue(m_data);
    }
    onSubmit() {
        if (this.cityForm.valid) {
            
            this._CityMasterService.cityMasterSave(this.cityForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
  
    onClear(val: boolean) {
        this.cityForm.reset();
        this.dialogRef.close(val);
    }
  }