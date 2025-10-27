import { Component, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { VechicalMasterService } from '../vechical-master.service';

@Component({
    selector: 'app-new-vechical',
    templateUrl: './new-vechical.component.html',
    styleUrls: ['./new-vechical.component.scss']
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

          if ((this.data?.vechicleId ?? 0) > 0) {
            console.log(this.data);
           
             this.ambulanceform.get("name").setValue(this.data.name)
             this.ambulanceform.get("manuDate").setValue(this.data.manuDate)
             this.ambulanceform.get("vechicalno").setValue(this.data.vechicalno)
                 this.ambulanceform.get("VechicleModel").setValue(this.data.VechicleModel)
             this.ambulanceform.get("vechicaltype").setValue(this.data.vechicaltype)
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
            let invalidFields = [];
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
        var inp = String.fromCharCode(event.keyCode);
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
