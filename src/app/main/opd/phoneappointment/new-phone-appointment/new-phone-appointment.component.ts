import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../../registration/registration.component';
import { PhoneAppointListService } from '../phone-appoint-list.service';

@Component({
    selector: 'app-new-phone-appointment',
    templateUrl: './new-phone-appointment.component.html',
    styleUrls: ['./new-phone-appointment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewPhoneAppointmentComponent implements OnInit {
    phoneappForm: FormGroup
    searchFormGroup: FormGroup
    hasSelectedContacts: boolean;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    @ViewChild('myButton', { static: true }) myButton: HTMLButtonElement;
    screenFromString = 'appointment-form';
    RegId = 0;
    phoneAppId: any = 0;
    timeflag = 0
    submitted = false;
    isChecked = true;
    isTimeChanged: boolean = false;
    isDatePckrDisabled: boolean = false;
    minDate: Date;
    registerObj = new RegInsert({});
    dateTimeString: any;
    phdatetime: any;
    autocompletedepartment: string = "Department";
    autocompleteModedoctor: string = "ConDoctor";
    @Output() dateTimeEventEmitter = new EventEmitter<{}>();
    dateTimeControl = new FormControl('');
    selectedTime: string | null = null;
    fromDate: Date;
    toDate: Date;
    deptNames:string;
    doctorName:string;
    depId:any;
    docId:any;
isEditMode: boolean = false;

    public now: Date = new Date();
    constructor(private _fuseSidebarService: FuseSidebarService,
        public _phoneAppointListService: PhoneAppointListService,
        public formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any, private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<NewPhoneAppointmentComponent>,
        public datePipe: DatePipe) {

        // setInterval(() => {
        //     this.now = new Date();
        //     this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');

        //     if (!this.isTimeChanged) {
        //         if (this.phoneappForm.get('phAppTime'))
        //             this.phoneappForm.get('phAppTime').setValue(this.now);
        //         this.phoneappForm.get('phAppDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
        //     }
        // }, 1);
    }

    ngOnInit(): void {

        this.minDate = new Date();

        this.phoneappForm = this._phoneAppointListService.createphoneForm();
        this.phoneappForm.markAllAsTouched();
        this.searchFormGroup = this.createSearchForm();
        if (this.data) {
            this.isEditMode = true;
            console.log(this.data)
            this.phoneappForm.get('phAppDate').setValue(this.datePipe.transform(this.data.fromDate, 'yyyy-MM-dd'));
            this.phoneappForm.get('phAppTime').setValue(this.data.fromDate);
            this.phoneappForm.get('startTime').setValue(this.data.fromDate);
            this.phoneappForm.get('endTime').setValue(this.data.toDate);
            this.phoneappForm.get('doctorId').setValue(this.data.doctorId);
            this.phoneappForm.get('departmentId').setValue(this.data.departmentId);
            this.fromDate = this.data.fromDate;
            this.toDate = this.data.toDate;
            this.deptNames = this.data.deptNames;
            this.doctorName = this.data.doctorName;
        } else {
            this.isEditMode = false;
            const currentDateTime = new Date();
            this.phoneappForm.get('phAppTime')?.setValue(currentDateTime);
            this.phoneappForm.get('endTime')?.setValue(currentDateTime);
            this.phoneappForm.get('startTime').setValue(currentDateTime);
        }
    }

    createSearchForm(): FormGroup {
        return this.formBuilder.group({
            RegId: [0]  // Initial value is 0
        });
    }

    getSelectedObj(obj) {
        this.RegId = obj.value;
        if ((this.RegId ?? 0) > 0) {
            setTimeout(() => {
                this._phoneAppointListService.getRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(response)
                    this.phoneappForm.get('regNo')?.setValue(response.regId.toString());
                });
            }, 500);
        }
    }

    onChangeDate(value: any) {
        if (value) {
            const dateOfReg = new Date(value);

            const [datePart, timePart] = dateOfReg
            .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            .split(',')
            .map(part => part.trim());

            this.eventEmitForParent(datePart, timePart);

            this.phoneappForm.get('phAppDate').setValue(this.datePipe.transform(dateOfReg, 'yyyy-MM-dd'));
        }
    }

    onChangeTime(event: any) {
        this.timeflag = 1;

        if (event) {
            const selectedTime = new Date(event);

            const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
            const [datePart, timePart] = localeString.split(',').map(part => part.trim());

            this.isTimeChanged = true;
            this.phdatetime = timePart;
            console.log(this.phdatetime);

            this.phoneappForm.get('phAppTime').setValue(selectedTime);
            this.phoneappForm.get('startTime').setValue(selectedTime);

            this.eventEmitForParent(datePart, timePart);
        }
        }

        onChangeTime1(event: any) {
            this.timeflag = 1;

            if (event) {
                const selectedTime = new Date(event);

                const localeString = selectedTime.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
                const [datePart, timePart] = localeString.split(',').map(part => part.trim());

                this.isTimeChanged = true;
                this.phdatetime = timePart;
                console.log(this.phdatetime);
                this.phoneappForm.get('endTime').setValue(selectedTime);
                this.eventEmitForParent(datePart, timePart);
            }
            }

    eventEmitForParent(actualDate, actualTime) {
        let localaDateValues = actualDate.split('/');
        let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
        this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
    }


    OnSubmit() {
        debugger
        this.phoneappForm.get('appDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
        this.phoneappForm.get('appTime').setValue(this.datePipe.transform(this.now, 'HH:mm'));
        console.log(this.phoneappForm.value);

        if (!this.phoneappForm.invalid) {
            this._phoneAppointListService.phoneMasterSave(this.phoneappForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } else {
            let invalidFields = [];
            if (this.phoneappForm.invalid) {
                for (const controlName in this.phoneappForm.controls) {
                    if (this.phoneappForm.controls[controlName].invalid) {
                        invalidFields.push(`phoneapp Form: ${controlName}`);
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

    Phappcancle(data) {
        this._phoneAppointListService.phoneMasterCancle(data.phoneAppId).subscribe((response: any) => {
        });
    }


    onClear(val: boolean) {
        this.phoneappForm.reset();
        this.dialogRef.close(val);
    }

    onClose() { this.dialogRef.close(); }

    selectChangedepartment(obj: any) {
        this.depId = obj.value
        this._phoneAppointListService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
            this.ddlDoctor.options = data;
            this.docId=data.value
            this.ddlDoctor.bindGridAutoComplete();
        });
    }

    getValidationMessages() {

        return {
            firstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            middleName: [

                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            lastName: [
                { name: "required", Message: "Last Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            address: [
                { name: "required", Message: "Address is required" },

            ],
            departmentId: [
                { name: "required", Message: "Department Name is required" }
            ],
            doctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            mobileNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Mobile No is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ]
        };
    }

    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

}
