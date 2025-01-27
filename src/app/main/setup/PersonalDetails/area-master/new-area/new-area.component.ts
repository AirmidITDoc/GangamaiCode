import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AreaMasterService } from '../area-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-area',
  templateUrl: './new-area.component.html',
  styleUrls: ['./new-area.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewAreaComponent implements OnInit {

  areaForm: FormGroup;
  isActive:boolean=true
 
  constructor(
      public _AreaMasterService: AreaMasterService,
      public dialogRef: MatDialogRef<NewAreaComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

    autocompleteModecity: string = "City";

    cityId = 0;

    ngOnInit(): void {
      this.areaForm = this._AreaMasterService.createAreaForm();
      if((this.data?.areaId??0) > 0) 
        {
          this.areaForm.patchValue(this.data);
        }
    }

  
    onSubmit() {
        if (this.areaForm.valid) {

            console.log("area json :- ",this.areaForm.value);

            this._AreaMasterService.AreaMasterSave(this.areaForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else {
            this.toastr.warning('Please Enter Valid Data.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }
    }

    getValidationMessages() {
        return {
            areaName: [
                { name: "required", Message: "Area Name is required" },
                { name: "maxlength", Message: "Area name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            cityId: [
                { name: "required", Message: "City Name is required" },
            ]
        };
    }
  
    onClear(val: boolean) {
        this.areaForm.reset();
        this.dialogRef.close(val);
    }

    selectChangecity(obj: any){
        console.log(obj);
        this.cityId=obj
    }
}
