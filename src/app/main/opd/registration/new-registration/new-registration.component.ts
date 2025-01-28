import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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

    submitted = false;
    isRegSearchDisabled: boolean = true;
    Submitflag: boolean = false;
    
   
    newRegSelected: any = 'registration';
    minDate: Date;
    msg: any = [];
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    matDialogRef: any;
    RegID: number = 0;
   
   
   
    ApiUrl1 = 'Prefix/get-prefixs'
    
    // New Api
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
        public datePipe: DatePipe
    ) {

    }


    ngOnInit(): void {
        this.personalFormGroup = this._registerService.createPesonalForm1();
       
        this.minDate = new Date();
      
        // if((this.data?.Submitflag?? true)==true)
        //     this.registerObj.regId=this.data.data1.regId
        debugger
        // if ((this.data.data1?.regId?? 0) > 0) {
            if ((this.data?.regId?? 0) > 0) {
            setTimeout(() => {
                this._registerService.getRegistraionById(this.data.regId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                   
                   });
            }, 500);
        }
        else {
            this.personalFormGroup.reset();

        }
    }
    Saveflag: boolean = false;
    OnSubmit() {
        console.log(this.personalFormGroup.value)
        
        // if (this.personalFormGroup.valid) {
          
            this._registerService.RegstrationtSaveData(this.personalFormGroup.value).subscribe((response) => {
               this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        // } else {
        //     this.toastr.warning("Form Is Invalid !...");
        // }
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

   

    get f() {
        return this.personalFormGroup.controls;
    }
    onChangePrefix(e) {
        
        this.ddlGender.SetSelection(e.sexId);
    }

    onChangestate(e) {
        this.ddlCountry.SetSelection(e.stateId);
    }

    onChangecity(e) {
        this.ddlState.SetSelection(e.cityId);
        this.ddlCountry.SetSelection(e.stateId);
    }

    
    getValidationMessages() {
        return {
            firstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            middleName: [
                // { name: "required", Message: "Middle Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            lastName: [
                { name: "required", Message: "Last Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
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
                // { name: "required", Message: "phoneNo No is required" },
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