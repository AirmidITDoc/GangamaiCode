import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { CityMasterService } from '../city-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-city',
    templateUrl: './new-city.component.html',
    styleUrls: ['./new-city.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCityComponent implements OnInit {

    cityForm: FormGroup;
    stateId = 0;
    cityId = 0;
    cityName = '';
    isActive: boolean = false;

    constructor(
        public _CityMasterService: CityMasterService,
        public dialogRef: MatDialogRef<NewCityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    autocompleteModestatus: string = "State";

    ngOnInit(): void {
        
        this.cityForm = this._CityMasterService.createCityForm();
        console.log(this.data)
        if (this.data.cityId > 0) {
            this.cityForm.patchValue(this.data);
        }
        else {
            this.cityForm.reset();
            this.cityForm.get('isActive').setValue(1);

        }
    }

    saveflag: boolean = false;
    onSubmit() {
        this.saveflag = true;
        console.log(this.cityForm.value)
        this._CityMasterService.cityMasterSave(this.cityForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });

    }
    getValidationMessages() {
        return {
            stateId: [
                { name: "required", Message: "State Name is required" }
            ],
            cityName: [
                { name: "required", Message: "City Name is required" },
                { name: "pattern", Message: "Only char allowed." }
            ],
                }
            }
  
    onClear(val: boolean) {
                    this.cityForm.reset();
                    this.dialogRef.close(val);
                }

    selectChangestate(obj: any){
                    console.log(obj);
                    this.stateId = obj
                }
}