import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegInsert } from '../registration.component';
import { RegistrationService } from '../registration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-new-registration',
    templateUrl: './new-registration.component.html',
    styleUrls: ['./new-registration.component.scss'],
    // directives: [appCharmaxLength],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewRegistrationComponent implements OnInit {
    personalFormGroup: FormGroup;
    searchFormGroup: FormGroup;

    screenFromString = 'registration';
    registerObj = new RegInsert({});
    now = Date.now();
    minDate = new Date();
    submitted = false;
    isRegSearchDisabled: boolean = true;
    Submitflag: boolean = false;
    newRegSelected: any = 'registration';
    
    msg: any = [];
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    matDialogRef: any;
    RegID: number = 0;
    isSaving: boolean = false;

    autocompleteModegender: string = "Gender";
    autocompleteModearea: string = "Area";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModemstatus: string = "MaritalStatus";
    autocompleteModereligion: string = "Religion";
    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;

    constructor(public _registerService: RegistrationService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewRegistrationComponent>,
        public datePipe: DatePipe,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) { }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }
    ngOnInit(): void {
        this.personalFormGroup = this._registerService.createPesonalForm1();
        this.personalFormGroup.markAllAsTouched();
        this.minDate = new Date();

        if ((this.data?.regId ?? 0) > 0) {
            setTimeout(() => {
                this._registerService.getRegistraionById(this.data.regId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                    this.personalFormGroup.get("RegId").setValue(this.registerObj.regId)
                });
            }, 500);
        }

    }
    ageYear = 0;
    ageMonth = 0;
    ageDay = 0;
    OnSubmit() {

        let DateOfBirth1 = this.personalFormGroup.get("DateOfBirth").value
        if (DateOfBirth1) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth1);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.ageYear = (todayDate.getFullYear() - dob.getFullYear());
            this.ageMonth = (todayDate.getMonth() - dob.getMonth());
            this.ageDay = (todayDate.getDate() - dob.getDate());

            if (this.ageDay < 0) {
                (this.ageMonth)--;
                const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                this.ageDay += previousMonth.getDate(); // Days in previous month
                
            }

            if (this.ageMonth < 0) {
                this.ageYear--;
                this.ageMonth += 12;
            }
        }
        
        let Bdate = this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value, "yyyy-MM-dd")
        this.personalFormGroup.get("DateOfBirth").setValue(this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value, "yyyy-MM-dd"))
        this.personalFormGroup.get('City').setValue(this.CityName)
      
        this.personalFormGroup.get('Age').setValue(String(this.ageYear))
        this.personalFormGroup.get('AgeYear').setValue(String(this.ageYear))
        this.personalFormGroup.get('AgeMonth').setValue(String(this.ageMonth))
        this.personalFormGroup.get('AgeDay').setValue(String(this.ageDay))

        console.log(this.personalFormGroup.value)
        this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.personalFormGroup.get('RegDate').value, 'yyyy-MM-dd'))
        if (this.ageYear != 0 || this.ageMonth != 0 || this.ageDay != 0) {

            if (this.personalFormGroup.valid) {
                this.isSaving = true;
                this._registerService.RegstrationtSaveData(this.personalFormGroup.value).subscribe((response) => {
                    this.onClear(true);
                    this.isSaving = false;
                });
            } else {
                let invalidFields = [];

                if (this.personalFormGroup.invalid) {
                    for (const controlName in this.personalFormGroup.controls) {
                        if (this.personalFormGroup.controls[controlName].invalid) {
                            invalidFields.push(`Registartion Form: ${controlName}`);
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
        } else {
            this.toastr.warning("Please Select Birthdate...");
        }
    }
chkChange(){
    if (this.registerObj.dateOfBirth > this.minDate) {
           Swal.fire("Enter Proper Birth Date ")
        }
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
    onClose() {
        this.dialogRef.close();
    }
    onClear(val: boolean) {
        this.personalFormGroup.reset();
        this.dialogRef.close(val);
    }

    // Change Registered or New Registration
    onChangeReg(event) {
        if (event.value == 'registration') {
            this.registerObj = new RegInsert({});
            this.personalFormGroup.reset();
            this.searchFormGroup.get('RegId').reset();
            this.searchFormGroup.get('RegId').disable();
            this.isRegSearchDisabled = true;
        } else {
            this.searchFormGroup.get('RegId').enable();
            this.isRegSearchDisabled = false;
            // this.personalFormGroup.reset();
        }

    }

    CityName=""
    onChangestate(e) {
    }

      onChangecity(e) {
        console.log(e)
        this.CityName=e.cityName
        this.registerObj.stateId = e.stateId
        this._registerService.getstateId(e.stateId).subscribe((Response) => {
            console.log(Response)
            this.ddlCountry.SetSelection(Response.countryId);
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

                { name: "pattern", Message: "only char allowed." }
            ],
            lastName: [
                { name: "required", Message: "Last Name is required" },
                { name: "pattern", Message: "only char allowed." }
            ],
            address: [
                { name: "required", Message: "Address is required" },

            ],
            prefixId: [
                { name: "required", Message: "Prefix Name is required" }
            ],
            genderId: [
                { name: "required", Message: "Gender is required" }
            ],
            areaId: [
                { name: "required", Message: "Area Name is required" }
            ],
            cityId: [
                { name: "required", Message: "City Name is required" }
            ],
            religionId: [
                { name: "required", Message: "Religion Name is required" }
            ],
            countryId: [
                { name: "required", Message: "Country Name is required" }
            ],
            maritalStatusId: [
                { name: "required", Message: "Mstatus Name is required" }
            ],
            stateId: [
                { name: "required", Message: "State Name is required" }
            ],
            mobileNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Mobile No is required" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],
            phoneNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],
            aadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "AAdharcard No is required" },
                { name: "minLength", Message: "12 digit required." },
                { name: "maxLength", Message: "More than 12 digits not allowed." }

            ],
        };
    }

    getDate(dateStr: string) {
        let dtStr = dateStr.split('-');
        var newDate = dtStr[1] + '/' + dtStr[0] + '/' + dtStr[2];
        return new Date(newDate);
    }
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        console.log('dateTimeObj ==', dateTimeObj);
        this.dateTimeObj = dateTimeObj;
    }
}