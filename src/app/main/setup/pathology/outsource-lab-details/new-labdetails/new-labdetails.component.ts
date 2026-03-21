import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { ParametermasterService } from '../../parametermaster/parametermaster.service';

@Component({
    selector: 'app-new-labdetails',
    templateUrl: './new-labdetails.component.html',
    styleUrls: ['./new-labdetails.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewLabdetailsComponent {

    LabFormGroup: FormGroup;
    dateTimeObj: any;
    screenFromString = 'advance';
    outSourceId = 0;
    outSourceLabName: any;

    contactPersonName: any;
    mobileNo: any;
    address: any;

    constructor(
        public _ParameterService: ParametermasterService,
        private formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public datePipe: DatePipe,
        private commonService: PrintserviceService,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored,
        public dialogRef: MatDialogRef<NewLabdetailsComponent>,
        private router: Router
    ) {

    }

    ngOnInit(): void {
        console.log(this.data);
        this.LabFormGroup = this.createmlcForm();
        this.LabFormGroup.markAllAsTouched();

        if (this.data) {
            this.outSourceId = this.data.outSourceId;
            this.outSourceLabName = this.data.outSourceLabName;
            this.contactPersonName = this.data.contactPersonName;
            this.mobileNo = this.data.mobileNo;
            this.address = this.data.address;
            this.LabFormGroup.patchValue(this.data)

        }

    }

    createmlcForm() {
        return this.formBuilder.group({

            outSourceId: [this.outSourceId],
            outSourceLabName: ['', Validators.required],
            contactPersonName: ['', Validators.required],
            mobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            address: ['', [Validators.required]],

        });
    }

    onSubmit() {
        debugger
        console.log(this.LabFormGroup.value)
        if (!this.LabFormGroup.invalid) {

            this._ParameterService.insertlaboursouceMaster(this.LabFormGroup.value).subscribe((response) => {
                this._matDialog.closeAll()
            });
        } else {
            const invalidFields = [];

            if (this.LabFormGroup.invalid) {
                for (const controlName in this.LabFormGroup.controls) {
                    if (this.LabFormGroup.controls[controlName].invalid) {
                        invalidFields.push(`Lab Form: ${controlName}`);
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

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }


    pad(n: number) {
        return n < 10 ? '0' + n : n;
    }

    getValidationMessages() {
        return {
            mlcno: [
                { name: "required", Message: "mlcno is required" }
            ],
            authorityName: [
                { name: "required", Message: "authorityName is required" }
            ],
            buckleNo: [
                { name: "required", Message: "buckleNo is required" }
            ],
            policeStation: [
                { name: "required", Message: "policeStation is required" }
            ]
        };
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    onClose() {
        this.dialogRef.close();
    }

}

