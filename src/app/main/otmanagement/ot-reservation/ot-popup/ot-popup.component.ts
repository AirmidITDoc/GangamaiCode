import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { OtReservationService } from '../ot-reservation.service';

@Component({
    selector: 'app-ot-popup',
    templateUrl: './ot-popup.component.html',
    styleUrls: ['./ot-popup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OtPopupComponent {
    reservationDateForm: FormGroup;
    registeredObj: any;
    vPatientName: any;
    vHeadingName: any = ''
    screenFromString = 'Common-form';

    constructor(
        public _OtReservationService: OtReservationService,
        private formBuilder: FormBuilder,
        private _loggedService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<OtPopupComponent>,
        public datePipe: DatePipe,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.reservationDateForm = this._OtReservationService.CreateForm()
        if (this.data) {
            this.registeredObj = this.data;
            this.vPatientName = this.registeredObj.patientName + "-" + this.registeredObj.regNo
            console.log(this.registeredObj)
        }
    }

    onSubmit() {
        const surgeryDate = this.reservationDateForm.get('surgeryDate')?.value;
        const formattedDate = this.datePipe.transform(surgeryDate, 'yyyy-MM-dd');

        Swal.fire({
            title: 'Do you want to Change the Reservation Date?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                debugger
                this.reservationDateForm.get('opipid').setValue(this.registeredObj.opIpId);
                this.reservationDateForm.get('otreservationId')?.setValue(this.registeredObj.otReservationId);
                this.reservationDateForm.get('surgeryDate')?.setValue(formattedDate);
                if (!this.reservationDateForm.invalid) {
                    this.reservationDateForm.removeControl('PatientName');
                    console.log(this.reservationDateForm.value);

                    this._OtReservationService.getBookingDatePostpone(this.reservationDateForm.value).subscribe(
                        (response) => {
                            if (response) {
                                this.onClose();
                            }
                        }
                    );
                }
                else {
                    const invalidFields = this.collectErrors(this.reservationDateForm);

                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => {
                            this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                        });
                        return;
                    }
                }

            }
        });
    }

    collectErrors(formGroup: FormGroup | FormArray, parentKey: string = ''): string[] {
        let errors: string[] = [];

        Object.keys(formGroup.controls).forEach(key => {
            const control = formGroup.get(key);
            const newKey = parentKey ? `${parentKey}.${key}` : key;

            if (control instanceof FormGroup || control instanceof FormArray) {
                // go deeper
                errors = errors.concat(this.collectErrors(control, newKey));
            } else {
                if (control?.invalid) {
                    errors.push(newKey);
                }
            }
        });

        return errors;
    }

    onClose() {
        this.reservationDateForm.reset();
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        console.log('dateTimeObj ==', dateTimeObj);
        this.dateTimeObj = dateTimeObj;
    }
}
