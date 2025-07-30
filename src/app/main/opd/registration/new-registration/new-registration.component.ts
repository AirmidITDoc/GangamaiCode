import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { RegInsert } from '../registration.component';
import { RegistrationService } from '../registration.service';
import { ImageViewComponent } from '../../appointment-list/image-view/image-view.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { map, Observable, startWith } from 'rxjs';

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
    isSaving: boolean = false;
    isEditMode: boolean = false;
    newRegSelected: any = 'registration';
    imagePreview!: string;
    msg: any = [];
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    matDialogRef: any;
    RegID: number = 0;
    regNo: any;
    ageYear = 0;
    ageMonth = 0;
    ageDay = 0;
    CityName = ""

    autocompleteModegender: string = "Gender";
    autocompleteModearea: string = "Area";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModemstatus: string = "MaritalStatus";
    autocompleteModereligion: string = "Religion";
    autocompleteModerelationship: string = "Relationship";


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
        private commonService: PrintserviceService,
        private readonly changeDetectorRef: ChangeDetectorRef
    ) { }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }
 options: string[]
     filteredOptions: Observable<string[]>;
    ngOnInit(): void {
        this.personalFormGroup = this._registerService.createPesonalForm1();
        this.personalFormGroup.markAllAsTouched();
        this.minDate = new Date();

        if ((this.data?.regId ?? 0) > 0) {
            setTimeout(() => {
                this._registerService.getRegistraionById(this.data.regId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                    this.isEditMode = true;
                    this.regNo = this.registerObj.regNo
                    this.personalFormGroup.get("RegId").setValue(this.registerObj.regId)
                });
            }, 500);
        }
// this.getarealist()

    this.filteredOptions = this.personalFormGroup.get('AreaId').valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),

    );
    }


// private _filter(value: string): string[] {
//     const filterValue = value.toLowerCase();
//     return this.areaList.filter(option => option.toLowerCase().includes(filterValue));
//   }
  AreaList: any = [];
   private _filter(value: any): string[] {
    if (value) {
      const filterValue = value && value.AreaName ? value.areaName.toLowerCase() : value.toLowerCase();
      return this.AreaList.filter(option => option.areaName.toLowerCase().includes(filterValue));
    }
  }



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
        this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
        this.personalFormGroup.get('RegTime').setValue(this.dateTimeObj.time);
        this.personalFormGroup.get('medTourismVisaIssueDate').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismVisaIssueDate").value, "yyyy-MM-dd") || this.registerObj.medTourismVisaIssueDate || '1900-01-01');
        this.personalFormGroup.get('medTourismVisaValidityDate').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismVisaValidityDate").value, "yyyy-MM-dd") || this.registerObj.medTourismVisaValidityDate || '1900-01-01');
        this.personalFormGroup.get('medTourismDateOfEntry').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismDateOfEntry").value, "yyyy-MM-dd") || this.registerObj.medTourismPortOfEntry || '1900-01-01');

        if (
            (!this.ageYear || this.ageYear == 0) &&
            (!this.ageMonth || this.ageMonth == 0) &&
            (!this.ageDay || this.ageDay == 0)
        ) {
            this.toastr.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        console.log(this.personalFormGroup.value)
        if (this.personalFormGroup.valid) {

            this._registerService.RegstrationtSaveData(this.personalFormGroup.value).subscribe((response) => {
                this.onClear(true);
                this.OnPrint(response);
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
    }
    chkChange() {
        if (this.registerObj.dateOfBirth > this.minDate) {
            this.toastr.warning('Enter Proper Birth Date', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }
    }
    openCamera(type: string, place: string) {
        const dialogRef = this._matDialog.open(ImageViewComponent,
            {
                width: '750px',
                height: '550px',

                data: {
                    docData: type == 'camera' ? 'camera' : '',
                    type: type == 'camera' ? 'camera' : '',
                    place: place
                }
            }
        );
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (place == "photo") {
                    this.imagePreview = result.url;
                }
                else {
                    // this.imgArr.push(result.name);
                    // this.images.push(result);
                    // this.imgDataSource.data = this.images;
                }
            }
        });
    }

    onChangedate(event){
        debugger
    const selectedDate = new Date(event);
    const vday = this.personalFormGroup.get("medTourismVisaIssueDate").value

    // selectedDate.setHours(0, 0, 0, 0);
    // vday.setHours(0, 0, 0, 0);
    if(selectedDate < vday )
        Swal.fire("VisaValidity Date Shoud Be Greater than IssueDate !........")
    return;
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
    OnPrint(Param) {
        this.commonService.Onprint("RegId", Param.regId, "RegistrationForm");
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


    onChangestate(e) {
    }

    onChangecity(e) {
        this.CityName = e.cityName
        this.registerObj.stateId = e.stateId
        this._registerService.getstateId(e.stateId).subscribe((Response) => {
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
            emgDrivingLicenceNo: [
                { name: "pattern", Message: "e.g., MH14-20210001234" },
                { name: "minLength", Message: "16 digit required." },
                { name: "maxLength", Message: "More than 16 digits not allowed." }
            ],
            medTourismPassportNo: [
                { name: "pattern", Message: "e.g., A1234567" },
                { name: "minLength", Message: "8 digit required." },
                { name: "maxLength", Message: "More than 8 digits not allowed." }
            ],
            medTourismNationalityId: [
                { name: "pattern", Message: "Only alphanumeric, 10 to 15 characters" },
                { name: "minLength", Message: "Minimum 10 characters required." },
                { name: "maxLength", Message: "Maximum 15 characters allowed." }
            ],
            emgContactPersonName: [
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }]
        };
    }

    value=new Date()
       onChangeDateofBirth(DateOfBirth: Date) {
        if (DateOfBirth > this.minDate) {
            this.toastr.warning('Enter Proper Birth Date..', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
            return;
        }
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
          
            this.ageYear = todayDate.getFullYear() - dob.getFullYear();
            this.ageMonth = (todayDate.getMonth() - dob.getMonth());
            this.ageDay = (todayDate.getDate() - dob.getDate());

            if (this.ageDay < 0) {
                this.ageMonth--;
                const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                this.ageDay += previousMonth.getDate(); // Days in previous month
                // this.ageDay =this.ageDay +1;
            }

            if (this.ageMonth < 0) {
                this.ageYear--;
                this.ageMonth += 12;
            }
            this.value = DateOfBirth;
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
            if (this.ageYear > 110)
                this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }
    }

  areaList: any[] = [];
  
    // getarealist(){
    //     debugger
    // this._registerService.getareaList1().subscribe(response => {
    //     console.log(response)
    // this.AreaList = response;
    // });
    // }



//   getAreaList() {
//     this._registerService.getAreaCombo().subscribe(data => {
//       this.AreaList = data;
//       if (this.data) {
//         const ddValue = this.AreaList.filter(c => c.AreaId == this.registerObj.AreaId);
//         this.personalFormGroup.get('AreaId').setValue(ddValue[0]);
//         this.personalFormGroup.updateValueAndValidity();
//         return;
//       }
//     });
//   }
    getDate(dateStr: string) {
        let dtStr = dateStr.split('-');
        var newDate = dtStr[1] + '/' + dtStr[0] + '/' + dtStr[2];
        return new Date(newDate);
    }
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
}