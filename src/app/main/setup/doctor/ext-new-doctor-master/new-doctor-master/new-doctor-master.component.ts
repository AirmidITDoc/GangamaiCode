import { DatePipe } from "@angular/common";
import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { fuseAnimations } from "@fuse/animations";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { ConfigService } from "app/core/services/config.service";
import { AirmidDropDownComponent } from "app/main/shared/componets/airmid-dropdown/airmid-dropdown.component";
import { AirmidFileModel } from "app/main/shared/componets/airmid-fileupload/airmid-fileupload.component";
import { AirmidSignatureComponent } from "app/main/shared/componets/airmid-signature/airmid-signature.component";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { ToastrService } from "ngx-toastr";
import { ExtDoctorMasterService } from "../ext-doctor-master.service";
import { DoctorMaster } from "../ext-new-doctor-master.component";


@Component({
    selector: 'app-new-doctor-master',
    templateUrl: './new-doctor-master.component.html',
    styleUrls: ['./new-doctor-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewDoctorMasterComponent {
    selectedTabIndex = 0;
    myForm: FormGroup
    vextDoctorId = 0
    vdoctorName: any = ''
    registerObj = new DoctorMaster({});

    onCloseDialog = new EventEmitter<any>();

    constructor(
        public _doctorService: ExtDoctorMasterService, private formBuilder: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any, private _FormvalidationserviceService: FormvalidationserviceService,
        public matDialog: MatDialog, private accountService: AuthenticationService,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewDoctorMasterComponent>,
        private readonly changeDetectorRef: ChangeDetectorRef,
        public datePipe: DatePipe,
        private _formBuilder: UntypedFormBuilder,
        private _service: ApiCaller,
        public _configue: ConfigService,
    ) { }
    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }


    ngOnInit(): void {
        this.myForm = this.createdDoctormasterForm();
        this.myForm.markAllAsTouched();
        debugger

        if ((this.data?.extDoctorId ?? 0) > 0) {
            this.vextDoctorId = this.data?.extDoctorId
            this.myForm.patchValue(this.data);
        }
        else {
            this.myForm.reset();

        }


    }
    createdDoctormasterForm(): FormGroup {

        return this._formBuilder.group({
            extDoctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            firstName: ['', [
                Validators.required,
                Validators.maxLength(50),
                // Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.noWhitespaceValidator()
            ]],
            lastName: ['', [
                // Validators.required,
                Validators.maxLength(50),
                // Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.allowEmptyStringValidatorOnly()
            ]],
            doctorName: ['', [
                Validators.required,
                Validators.maxLength(150),
                // Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.noWhitespaceValidator()
            ]]
        });
    }


    onSubmit() {


        this.myForm.get("doctorName").setValue(this.vdoctorName)
        debugger
        if (!this.myForm.invalid) {
            console.log(this.myForm.value)

            this._doctorService.ExtdoctortMasterInsert(this.myForm.value).subscribe((response) => {
                this.onClose();
            });
        } else {
            const invalidFields = [];

            if (this.myForm.invalid) {
                for (const controlName in this.myForm.controls) {
                    if (this.myForm.controls[controlName].invalid) {
                        invalidFields.push(`DoctorForm : ${controlName}`);
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

    changeName() {
        this.vdoctorName = "Dr." + ' ' +  this.myForm.get("firstName").value + ' ' + this.myForm.get("lastName").value
    }


    onClear(val: boolean) {
        this.myForm.reset();
    }
    onClose() {
        this.myForm.reset();
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getValidationMessages() {
        return {
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                { name: "required", Message: "Middle Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            DoctorName: [
                { name: "required", Message: "Last Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],

        };
    }

    ///Schdule code
    startTime: string = '09:00'; // default 9:00 AM
    endTime: string = '00:00';  // default 12:00 AM
    timeSlots: string[] = [];
    screenFromString = 'Common-form';
    updateTimeSlots(): void {
        this.timeSlots = []; // Clear previous

        const [startH, startM] = this.startTime.split(':').map(Number);
        const [endH, endM] = this.endTime.split(':').map(Number);

        const start = new Date();
        start.setHours(startH, startM, 0, 0);

        const end = new Date();
        end.setHours(endH, endM, 0, 0);

        // If end time is midnight (00:00), move to next day
        if (endH === 0 && endM === 0) {
            end.setDate(end.getDate() + 1);
        }

        while (start < end) {
            const hours = start.getHours();
            const minutes = start.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const hr12 = hours % 12 === 0 ? 12 : hours % 12;
            const minStr = minutes.toString().padStart(2, '0');
            const timeStr = `${hr12}:${minStr} ${ampm}`;
            this.timeSlots.push(timeStr);
            start.setMinutes(start.getMinutes() + 15);
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

    keyPressAlpha(event) {
        const charCode = event.which ? event.which : event.keyCode;
        return (charCode >= 65 && charCode <= 90) ||  // A-Z
            (charCode >= 97 && charCode <= 122) || (charCode == 32) || (charCode == 40) || (charCode == 41);   // a-z
    }
}

