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


        constructor(
        public _CityMasterService: CityMasterService,
        public dialogRef: MatDialogRef<NewCityComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
  
    autocompleteModestate: string = "State";

    ngOnInit(): void {
        this.cityForm = this._CityMasterService.createCityForm();
      if(this.data){
            this.cityId= this.data?.cityId,
            this.cityName= this.data?.cityName.trim(),
            this.stateId= this.data?.stateId
            // this.isActive= JSON.stringify(this.data?.isActive)
        }
        var mdata={
            cityId: this.data?.cityId,
            cityName: this.data?.cityName.trim(),
            stateId: this.data?.stateId || this.stateId,
            isActive: JSON.stringify(this.data?.isActive)}
            this.cityForm.patchValue(mdata);
    }
    onSubmit() {
        if (this.cityForm.valid) {
            var mdata={
                "cityId": this.cityId,
                "cityName": this.cityForm.get("cityName").value,
                "stateId": this.stateId
            }
            debugger
            this._CityMasterService.cityMasterSave(mdata).subscribe((response) => {
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

    selectChangestate(obj: any){
        console.log(obj);
        this.stateId=obj
        debugger
      }
  }