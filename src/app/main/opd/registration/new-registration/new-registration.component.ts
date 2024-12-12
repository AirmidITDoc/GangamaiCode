import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegInsert } from '../registration.component';
import { RegistrationService } from '../registration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';

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
    charcount: any = 0;
    submitted = false;
    now = Date.now();
    searchFormGroup: FormGroup;
    isRegSearchDisabled: boolean = true;
    newRegSelected: any = 'registration';

    msg: any = [];
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    registerObj = new RegInsert({});
    Prefix: any;
    isDisabled: boolean = false;
    Submitflag: boolean = false;
    screenFromString = 'registration';
    matDialogRef: any;
    RegID: number = 0;

    // New Api
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    autocompleteModearea: string = "Area";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModemstatus: string = "MaritalStatus";
    autocompleteModereligion: string = "Religion";


    constructor(public _registerService: RegistrationService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewRegistrationComponent>,
        public datePipe: DatePipe
    ) {}


    ngOnInit(): void {
        this.RegID = 0;
        this.personalFormGroup = this._registerService.createPesonalForm();
        if (this.data) {
            this.isDisabled = true
            this.Submitflag = this.data.Submitflag;
            this.RegID = this.data?.regId || 0;
            var m_data = {
                RegId: this.data?.regId,
                RegNo: this.data?.regNo,
                PrefixId: this.data?.prefixId,
                FirstName: this.data?.firstName,
                MiddleName: this.data?.middleName, 
                LastName: this.data?.lastName,
                GenderId: this.data?.genderId,
                Address: this.data?.address,
                DateOfBirth: this.data?.dateofBirth,//this.datePipe.transform(this.data?.dateofBirth,  "yyyy-MM-dd 00:00:00.000"),//new Date(this.data?.dateofBirth),
                AgeYear: this.data?.ageYear.trim(),
                AgeMonth: this.data?.ageMonth.trim(),
                AgeDay:this.data?.ageDay.trim(),
                PhoneNo: this.data?.phoneNo,
                MobileNo: this.data?.mobileNo,
                AadharCardNo: this.data?.aadharCardNo.trim(),
                PanCardNo: this.data?.panCardNo || '',
                MaritalStatusId: this.data?.maritalStatusId,
                ReligionId: this.data?.religionId,
                AreaId: this.data?.areaId,
                CityId: this.data?.cityId,
                StateId: this.data?.stateId,
                CountryId: this.data?.countryId,
                IsCharity: this.data?.isCharity
            };
            this.personalFormGroup.patchValue(m_data);
        }
    }
    get f() {
        return this.personalFormGroup.controls;
    }
    getDate(dateStr:string){
        let dtStr = dateStr.split('-');
        var newDate = dtStr[1] + '/' + dtStr[0] + '/' + dtStr[2];
        return new Date(newDate);
    }
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        console.log('dateTimeObj ==', dateTimeObj);
        this.dateTimeObj = dateTimeObj;
    }
    OnSubmit() {
        if(this.personalFormGroup.invalid){
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
              });
              return;
        } else {
            var m_data = {
                "regID": this.RegID || 0,
                "regDate": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
                "regTime": this.dateTimeObj.time,//this.datePipe.transform(this.dateTimeObj.time, 'hh:mm:ss'),// this.dateTimeObj.time,// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
                "prefixId": this.personalFormGroup.value.PrefixId || 0,
                "firstName": this.personalFormGroup.value.FirstName || "",
                "middleName": this.personalFormGroup.value.MiddleName || "",
                "lastName": this.personalFormGroup.value.LastName || "",
                "address": this.personalFormGroup.value.Address || "",
                "city": this.personalFormGroup.value.CityId || '',
                "pinNo": '0',// this._registerService.mySaveForm.value.PinNo || "0",
                "dateOfBirth": this.datePipe.transform(this.personalFormGroup.value?.DateOfBirth, 'yyyy-MM-dd') || (this.personalFormGroup.value?.DateOfBirth || "2021-03-31"),// this.datePipe.transform(this.personalFormGroup.value?.DateofBirth, 'yyyy-MM-dd'),// this.registerObj.DateofBirth || "2021-03-31",
                "age": (this.personalFormGroup.value?.AgeYear || "0").toString(),
                "genderID": this.personalFormGroup.value.GenderId || 0,
                "phoneNo": this.personalFormGroup.value?.PhoneNo || "0",
                "mobileNo": this.personalFormGroup.value?.MobileNo || "0",
                "addedBy": this.accountService.currentUserValue.userId,
                "updatedBy": this.accountService.currentUserValue.userId,
                "ageYear": (this.personalFormGroup.value?.AgeYear || "0").toString(),// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
                "ageMonth": (this.personalFormGroup.value?.AgeMonth || "").toString(),
                "ageDay": (this.personalFormGroup.value?.AgeDay || "").toString(),
                "countryId": 1,// this.personalFormGroup.get('CountryId').value,
                "stateId": this.personalFormGroup.value.StateId || 0,
                "cityId": this.personalFormGroup.value.CityId || 0,
                "maritalStatusId": this.personalFormGroup.value.MaritalStatusId ? this.personalFormGroup.value.MaritalStatusId : 0,
                "isCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
                "religionId": this.personalFormGroup.value.ReligionId ? this.personalFormGroup.value.ReligionId : 0,
                "areaId": this.personalFormGroup.value.AreaId ? this.personalFormGroup.value.AreaId : 0,
                "isSeniorCitizen": false,
                "aadharcardno": this.personalFormGroup.value?.AadharCardNo ? this.personalFormGroup.value.AadharCardNo : 0,
                "pancardno": "",// this.personalFormGroup.value.PanCardNo.toString()  ? this.personalFormGroup.value.PanCardNo.toString()  : 0,
                "Photo": ''
            }
            if (this.RegID > 0) {
                delete m_data.addedBy;
            }
            this._registerService.RegstrationtSaveData(m_data).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
    onClose() {
        this.dialogRef.close();
    }
    onClear(val: boolean) {
        this.personalFormGroup.reset();
        this.dialogRef.close(val);
    }
    onChangeDateofBirth(DateOfBirth) {
        if (DateOfBirth) {     
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.personalFormGroup.get('AgeYear').setValue(Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25));
            this.personalFormGroup.get('AgeMonth').setValue(Math.abs(todayDate.getMonth() - dob.getMonth()));
            this.personalFormGroup.get('AgeDay').setValue(Math.abs(todayDate.getDate() - dob.getDate()));
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
        }
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

    @ViewChild('fname') fname: ElementRef;
    @ViewChild('mname') mname: ElementRef;
    @ViewChild('lname') lname: ElementRef;
    @ViewChild('bday') bday: ElementRef;
    @ViewChild('agey') agey: ElementRef;
    @ViewChild('agem') agem: ElementRef;
    @ViewChild('aged') aged: ElementRef;
    @ViewChild('AadharCardNo') AadharCardNo: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('mobile') mobile: ElementRef;
    @ViewChild('phone') phone: ElementRef;
    public onEnterfname(event): void {
        if (event.which === 13) {
            this.fname.nativeElement.focus();
        }
    }
    public onEntermname(event): void {
        if (event.which === 13) {
            this.mname.nativeElement.focus();
        }
    }
    public onEnterlname(event): void {
        if (event.which === 13) {
            this.lname.nativeElement.focus();
        }
    }
    public onEnterbday(event): void {
        if (event.which === 13) {
            this.bday.nativeElement.focus();
        }
    }
    public onEnteragey(event): void {
        if (event.which === 13) {
            this.agem.nativeElement.focus();
        }
    }
    public onEnteragem(event): void {
        if (event.which === 13) {
            this.aged.nativeElement.focus();
        }
    }
    public onEnteraged(event): void {
        if (event.which === 13) {
            this.AadharCardNo.nativeElement.focus();
        }
    }
    public onEnterAadharCardNo(event): void {
        if (event.which === 13) {
            this.AadharCardNo.nativeElement.focus();
        }
    }
    public onEnteraddress(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }
    public onEntermobile(event): void {
        if (event.which === 13) {
            this.mobile.nativeElement.focus();
        }
    }
    public onEnterphone(event): void {
        if (event.which === 13) {
            this.phone.nativeElement.focus();
        }
    }
}