import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { RegInsert } from '../registration.component';
import { RegistrationService } from '../registration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchPageComponent } from '../../op-search-list/search-page/search-page.component';
import { ToastrService } from 'ngx-toastr';
import { AirmidAutocompleteComponent } from 'app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component';

@Component({
    selector: 'app-edit-registration',
    templateUrl: './edit-registration.component.html',
    styleUrls: ['./edit-registration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditRegistrationComponent implements OnInit {


    personalFormGroup: FormGroup;
    registerObj = new RegInsert({});
    isActive: boolean = true;

    submitted = false;
    now = Date.now();
    searchFormGroup: FormGroup;
    isRegSearchDisabled: boolean = true;
    newRegSelected: any = 'registration';
    minDate: Date;
    msg: any = [];
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;

    Submitflag: boolean = false;
    screenFromString = 'registration';
    matDialogRef: any;
    RegID: number = 0;
    prefixId=0;
    prefixName='';
    // New Api
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    autocompleteModearea: string = "Area";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModemstatus: string = "MaritalStatus";
    autocompleteModereligion: string = "Religion";
    @ViewChild('ddlGender') ddlGender: AirmidAutocompleteComponent;
    @ViewChild('ddlState') ddlState: AirmidAutocompleteComponent;
    @ViewChild('ddlCountry') ddlCountry:AirmidAutocompleteComponent;


    constructor(public _registerService: RegistrationService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<EditRegistrationComponent>,
        public datePipe: DatePipe
    ) {
        this.personalFormGroup = this._registerService.createPesonalForm();
    }


    ngOnInit(): void {


        console.log(this.data)
       
        // this.personalFormGroup = this._registerService.createPesonalForm();
        if (this.data) {
            this._registerService.getRegistraionById(this.data.regId).subscribe((response) => {
                this.registerObj = response;
            });
        }
        else {
            this.personalFormGroup.reset();

        }
        this.minDate = new Date();
    }
    toggleSelectAll() {

    }
    OnSubmit() {

        console.log(this.personalFormGroup.value)

        this._registerService.RegstrationtSaveData(this.personalFormGroup.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    // }

    onChangePrefix(e) {
        
        this.ddlGender.SetSelection(e.sexId);
    }
    onChangestate(e) {
        this.ddlCountry.SetSelection(e.stateId);
    }

    onChangecity(e){
        this.ddlState.SetSelection(e.cityId);
        this.ddlCountry.SetSelection(e.stateId);
    }

// getcity(){
//     this._registerService.getcitylist(1).subscribe((response) => {
//         this.registerObj = response;
//     });
// }
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
                { name: "required", Message: "Mobile No is required" },
                // { name: "minLength", Message: "10 digit required." },
                // { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],
            aadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "AadharCard No is required" },
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

}