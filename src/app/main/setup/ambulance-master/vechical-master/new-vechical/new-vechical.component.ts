import { Component, Inject, ViewEncapsulation } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VechicalMasterService } from '../vechical-master.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-vechical',
    templateUrl: './new-vechical.component.html',
    styleUrls: ['./new-vechical.component.scss'],
          encapsulation: ViewEncapsulation.None,
          animations: fuseAnimations,
})
export class NewVechicalComponent {

    ambulanceform: FormGroup
    constructor(
        public _AmbulancemasterService: VechicalMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NewVechicalComponent>,

    ) { }

    ngOnInit(): void {

        this.ambulanceform = this._AmbulancemasterService.createAmbulanceForm();
        this.ambulanceform.markAllAsTouched();
   console.log(this.data);
           
          if ((this.data?.vehicleId ?? 0) > 0) {
           this.ambulanceform.get("vehicleId").setValue(this.data.vehicleId)
           
             this.ambulanceform.get("vehicleName").setValue(this.data.vehicleName)
             this.ambulanceform.get("manuDate").setValue(this.data.manuDate)
             this.ambulanceform.get("vehicleNo").setValue(this.data.vehicleNo)
                 this.ambulanceform.get("vehicleModel").setValue(this.data.vehicleModel)
             this.ambulanceform.get("vehicleType").setValue(this.data.vehicleType)
             this.ambulanceform.get("note").setValue(this.data.note)
        }
    }



    onSubmit() {

        console.log(this.ambulanceform.value)
        debugger


        if (!this.ambulanceform.invalid) {
            this._AmbulancemasterService.AmbulanceInsert(this.ambulanceform.value).subscribe((response) => {
                this.dialogRef.close()
            });
        }
        else {
            const invalidFields = [];
            if (this.ambulanceform.invalid) {
                for (const controlName in this.ambulanceform.controls) {
                    if (this.ambulanceform.controls[controlName].invalid) {
                        invalidFields.push(`Vehicle Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }

        }
    }


    onClear(val: boolean) {
        this.ambulanceform.reset();
        this.dialogRef.close(val);
    }
    keyPressCharater(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }


    onClose() {
        this.ambulanceform.reset();
        this.dialogRef.close();
    }

    getValidationMessages() {
        return {
            name: [
                { name: "required", Message: " Name is required" },
                { name: "maxlength", Message: " Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
             vechicalno: [
                { name: "required", Message: "vechicalno is required" },
                { name: "maxlength", Message: "vechicalno should not be greater than 20 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            VechicleModel: [
                { name: "required", Message: "VechicleModel is required" },
            ],
            vechicaltype:[]
        }
    }

}
