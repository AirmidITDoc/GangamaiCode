import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { SubtpaCompanyMasterService } from '../../billing/subtpa-company-master/subtpa-company-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { AmbulancemasterService } from '../ambulancemaster.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-ambulance',
  templateUrl: './new-ambulance.component.html',
  styleUrls: ['./new-ambulance.component.scss'],
   encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewAmbulanceComponent {
ambulanceform:FormGroup
constructor(
        public _AmbulancemasterService: AmbulancemasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<NewAmbulanceComponent>,

    ) { }

    ngOnInit(): void {

        this.ambulanceform = this._AmbulancemasterService.createAmbulanceForm();
        this.ambulanceform.markAllAsTouched();

        // if ((this.data?.subCompanyId ?? 0) > 0) {
        //     console.log(this.data);
        //     this.isActive = this.data.isActive;
        //     this.regobj = this.data
        //     this.regobj.phoneNo=this.data.phoneNo.trim()
        //      this.regobj.faxNo=this.data.faxNo.trim()
        //      this.ambulanceform.get("cityId").setValue(this.regobj.cityId)
        //      this.ambulanceform.get("stateId").setValue(this.regobj.stateId)
        //      this.ambulanceform.get("countryId").setValue(this.regobj.countryId)
        // }
    }


  
    onSubmit() {

console.log(this.ambulanceform.value)
debugger
        // if (!this.ambulanceform.invalid) {
        //     this._AmbulancemasterService.AmbulanceInsert(this.ambulanceform.value).subscribe((response) => {
        //         this.dialogRef.close()
        //     });
        // }
        // else {
        //     let invalidFields = [];
        //     if (this.ambulanceform.invalid) {
        //         for (const controlName in this.ambulanceform.controls) {
        //             if (this.ambulanceform.controls[controlName].invalid) {
        //                 invalidFields.push(`SubTpa Form: ${controlName}`);
        //             }
        //         }
        //     }
        //     if (invalidFields.length > 0) {
        //         invalidFields.forEach(field => {
        //             this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
        //             );
        //         });
        //     }

        // }
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