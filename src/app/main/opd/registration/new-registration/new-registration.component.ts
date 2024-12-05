import { Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegInsert } from '../registration.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { RegistrationService } from '../registration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { SearchPageComponent } from '../../op-search-list/search-page/search-page.component';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { DataRowOutlet } from '@angular/cdk/table';

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
    capturedImage: any;
    isLinear = true;
    isLoading: string = '';
    Prefix: any;
    RegId: any = 0;
    snackmessage: any;
    RegID: any = 0;
    AdmissionID: any = 0;

    currentDate = new Date();

    isDisabled: boolean = false;
    IsSave: any;

    Submitflag: boolean = false;


    options = [];
    screenFromString = 'registration';
    matDialogRef: any;
    sIsLoading: string = '';

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
        private formBuilder: FormBuilder,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewRegistrationComponent>,
        private _snackBar: MatSnackBar,
        public datePipe: DatePipe,
        private router: Router,

    ) {

    }


    ngOnInit(): void {
        this.RegId = 0;
        this.personalFormGroup = this.createPesonalForm();
        this.searchFormGroup = this.createSearchForm();
        //this.PrefixId=6;
        if (this.data) {
            this.personalFormGroup.patchValue({
                PrefixId: this.data.prefixId
            });
            console.log(this.data)
            this.registerObj = this.data;
            this.RegID = this.data.regId

            this.cityId = this.data.cityId;
            this.isDisabled = true
            this.Submitflag = this.data.Submitflag;
            // this.registerObj.ReligionId=this.registerObj.ReligionId1;

            if (this.registerObj.AgeYear)
                this.registerObj.Age = this.registerObj.ageYear.trim();
            if (this.registerObj.AgeMonth)
                this.registerObj.AgeMonth = this.registerObj.ageMonth.trim();
            if (this.registerObj.AgeDay)
                this.registerObj.AgeDay = this.registerObj.ageDay.trim();

            if (this.registerObj.AadharCardNo)
                this.registerObj.AadharCardNo = this.registerObj.aadharCardNo.trim();

            this.setDropdownObjs();

        }

    }



    get f() {
        return this.personalFormGroup.controls;
    }

    closeDialog() {
        console.log("closed")

    }
    getValidationMessages() {
        return {
            PrefixId: [
                { name: "required", Message: "Prefix Name is required" }
            ]
        };
    }
    getValidationAreaMessages() {
        return {
            AreaId: [
                { name: "required", Message: "Area Name is required" }
            ]
        };
    }
    getValidationCityMessages() {
        return {
            CityId: [
                { name: "required", Message: "City Name is required" }
            ]
        };
    }
    getValidationStateMessages() {
        return {
            StateId: [
                { name: "required", Message: "State Name is required" }
            ]
        };
    }
    // getValidationMessages() {
    //   return {
    //       PrefixId: [
    //           { name: "required", Message: "cashCounter Name is required" }
    //       ]
    //   };
    // }
    getValidationReligionMessages() {
        return {
            ReligionId: [
                { name: "required", Message: "Religion Name is required" }
            ]
        };
    }
    getValidationCountryMessages() {
        return {
            CountryId: [
                { name: "required", Message: "Country Name is required" }
            ]
        };
    }
    getValidationMstatusMessages() {
        return {
            MaritalStatusId: [
                { name: "required", Message: "Mstatus Name is required" }
            ]
        };
    }



    createPesonalForm() {
        return this.formBuilder.group({
            RegId: '',
            RegNo: '',
            PrefixId: ['', [Validators.required]],
            FirstName: ['', [
                Validators.required,
                Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
            ]],
            MiddleName: ['', [
                Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
            ]],

            LastName: ['', [
                Validators.required,
                Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
            ]],
            //GenderId: '',
            GenderId: new FormControl('', [Validators.required]),
            Address: '',
            DateOfBirth: [{ value: this.registerObj.DateofBirth }],
            AgeYear: ['', [
                Validators.required,
                Validators.maxLength(3),
                Validators.pattern("^[0-9]*$")]],
            AgeMonth: ['', [
                Validators.pattern("^[0-9]*$")]],
            AgeDay: ['', [
                Validators.pattern("^[0-9]*$")]],
            PhoneNo: ['', [Validators.minLength(10),
            Validators.maxLength(15),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            MobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            AadharCardNo: ['', Validators.compose([Validators.minLength(12),
            Validators.maxLength(12)
                // Validators.required,
                // Validators.pattern("^[0-9]+$"),

            ])],
            PanCardNo: '',
            MaritalStatusId: '',
            ReligionId: '',
            AreaId: '',
            CityId: '',
            StateId: '',
            CountryId: '',
            IsCharity: '',
        });
    }



    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        console.log('dateTimeObj ==', dateTimeObj);
        this.dateTimeObj = dateTimeObj;
    }


    searchRegList() {
        var m_data = {
            "RegAppoint": 1
        }
        const dialogRef = this._matDialog.open(SearchPageComponent,
            {
                maxWidth: "90vw",
                maxHeight: "85vh", width: '100%', height: "100%",
                data: {
                    registerObj: m_data,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            // console.log('The dialog was closed - Insert Action', result);
            console.log(result);
            if (result) {
                this.registerObj = result as RegInsert;
                this.setDropdownObjs();

            }
        });
    }


    setDropdownObjs() {
        autocompleteModecity: "City";
        debugger
        this._registerService.getcityMaster(this.cityId, 1).subscribe(data => {
            console.log(data)
            this.cityId = data.value
            console.log(this.cityId)
        });

        // const toSelect = this.PrefixList.find(c => c.value == this.registerObj.prefixId);
        // this.personalFormGroup.get('PrefixId').setValue(toSelect);

        // const toSelectMarital = this.MaritalStatusList.find(c => c.value == this.registerObj.maritalStatusId);
        // this.personalFormGroup.get('MaritalStatusId').setValue(toSelectMarital);

        // const toSelectReligion = this.ReligionList.find(c => c.value == this.registerObj.religionId);
        // this.personalFormGroup.get('ReligionId').setValue(toSelectReligion);

        // const toSelectArea = this.AreaList.find(c => c.value == this.registerObj.areaId);
        // this.personalFormGroup.get('AreaId').setValue(toSelectArea);

        // const toSelectCity = this.cityList.find(c => c.value == this.registerObj.cityId);
        // this.personalFormGroup.get('CityId').setValue(toSelectCity);

        this.personalFormGroup.updateValueAndValidity();


        if (this.registerObj.ageMonth)
            this.registerObj.ageMonth = this.registerObj.ageMonth.trim();
        if (this.registerObj.AgeDay)
            this.registerObj.ageDay = this.registerObj.ageDay.trim();

    }

    OnSubmit() {
        debugger
        if (this.personalFormGroup.valid) {

            console.log(this.personalFormGroup.get('PrefixId').value)
            // if(this.personalFormGroup.invalid){
            //     this.toastr.warning('please check from is invalid', 'Warning !', {
            //         toastClass: 'tostr-tost custom-toast-warning',
            //       });
            //       return;
            // } else {
            // if(!isNaN(this.vDepartmentid.Departmentid) && !isNaN(this.vDoctorId.DoctorId)){
            if (this.RegID == 0) {
                debugger
                var m_data = {
                    "regID": 0,
                    "regDate": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
                    "regTime": this.dateTimeObj.time,//this.datePipe.transform(this.dateTimeObj.time, 'hh:mm:ss'),// this.dateTimeObj.time,// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
                    "prefixId": this.personalFormGroup.get('PrefixId').value,
                    "firstName": this.personalFormGroup.get("FirstName").value || "",
                    "middleName": this.personalFormGroup.get("MiddleName").value || "",
                    "lastName": this.personalFormGroup.get("LastName").value || "",
                    "address": this.personalFormGroup.get("Address").value || "",
                    "city": this.cityName,// this.personalFormGroup.get('CityId').value.text || '',
                    "pinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
                    "dateOfBirth": "2021-03-31T12:27:24.771Z",// this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
                    "age": (this.personalFormGroup.get("AgeYear")?.value || "0").toString(),
                    "genderID": this.personalFormGroup.get('GenderId').value || 0,
                    "phoneNo": this.personalFormGroup.get("PhoneNo").value || "0",
                    "mobileNo": this.personalFormGroup.get("MobileNo").value || "0",
                    "addedBy": 1,// this.accountService.currentUserValue.userId,
                    "updatedBy": 1,//this.accountService.currentUserValue.userId,
                    "ageYear": (this.personalFormGroup.get("AgeYear")?.value || "0").toString(),// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
                    "ageMonth": (this.personalFormGroup.get("AgeMonth").value || "").toString(),
                    "ageDay": (this.personalFormGroup.get("AgeDay").value || "").toString(),
                    "countryId": 1,// this.personalFormGroup.get('CountryId').value,
                    "stateId": this.personalFormGroup.get('StateId').value,
                    "cityId": this.personalFormGroup.get('CityId').value,
                    "maritalStatusId": this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value : 0,
                    "isCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
                    "religionId": this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value : 0,
                    "areaId": this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value : 0,
                    "isSeniorCitizen": false,
                    "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
                    "pancardno": "",// this.personalFormGroup.get('PanCardNo').value.toString()  ? this.personalFormGroup.get('PanCardNo').value.toString()  : 0,
                    "Photo": ''
                }
                debugger
                console.log(m_data);

                this._registerService.RegstrationtSave(m_data).subscribe((response) => {
                    this.toastr.success(response.message);
                    this.onClear(true);
                }, (error) => {
                    this.toastr.error(error.message);
                });
            } else {
                var m_data1 = {
                    "regID": this.RegID,
                    "regDate": this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || this.dateTimeObj.date,
                    "regTime": this.dateTimeObj.time,//this.datePipe.transform(this.dateTimeObj.time, 'hh:mm:ss'),// this.dateTimeObj.time,// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
                    "prefixId": this.PrefixId,// this.personalFormGroup.get('PrefixId').value.value,
                    "firstName": this.personalFormGroup.get("FirstName").value || "",
                    "middleName": this.personalFormGroup.get("MiddleName").value || "",
                    "lastName": this.personalFormGroup.get("LastName").value || "",
                    "address": this.personalFormGroup.get("Address").value || "",
                    "city": this.cityName,// this.personalFormGroup.get('CityId').value.text || '',
                    "pinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
                    "dateOfBirth": "2021-03-31T12:27:24.771Z",// this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
                    "age": this.personalFormGroup.get("AgeYear").value.toString() || "0",
                    "genderID": this.genderId,// this.personalFormGroup.get('GenderId').value.value || 0,
                    "phoneNo": this.personalFormGroup.get("PhoneNo").value || "0",
                    "mobileNo": this.personalFormGroup.get("MobileNo").value || "0",
                    "addedBy": 1,// this.accountService.currentUserValue.userId,
                    //  "updatedBy": 1,//this.accountService.currentUserValue.userId,
                    "ageYear": this.personalFormGroup.get("AgeYear").value.toString() || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
                    "ageMonth": this.personalFormGroup.get("AgeMonth").value.toString() || "",
                    "ageDay": this.personalFormGroup.get("AgeDay").value.toString() || "",
                    "countryId": this.PrefixId,// this.personalFormGroup.get('CountryId').value.value,
                    "stateId": this.stateId,// this.personalFormGroup.get('StateId').value.value,
                    "cityId": this.cityId,//this.personalFormGroup.get('CityId').value.value,
                    "maritalStatusId": this.mstausId,// this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.value : 0,
                    "isCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
                    "religionId": this.regilionId,//this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.value : 0,
                    "areaId": this.areaId,//// this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0,
                    "isSeniorCitizen": false,
                    "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
                    "pancardno": "",// this.personalFormGroup.get('PanCardNo').value.toString()  ? this.personalFormGroup.get('PanCardNo').value.toString()  : 0,
                    "Photo": ''

                }
                console.log(m_data);

                this._registerService.Regstrationtupdate(m_data1).subscribe((response) => {
                    this.toastr.success(response.message);
                    this.onClear(true);
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        }
        // }
    }



    @ViewChild('fname') fname: ElementRef;
    @ViewChild('mname') mname: ElementRef;
    @ViewChild('lname') lname: ElementRef;
    @ViewChild('agey') agey: ElementRef;
    @ViewChild('aged') aged: ElementRef;
    @ViewChild('agem') agem: ElementRef;
    @ViewChild('phone') phone: ElementRef;
    @ViewChild('mobile') mobile: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('pan') pan: ElementRef;
    @ViewChild('area') area: ElementRef;
    @ViewChild('AadharCardNo') AadharCardNo: ElementRef;

    @ViewChild('bday') bday: ElementRef;
    @ViewChild('gender') gender: MatSelect;
    @ViewChild('mstatus') mstatus: ElementRef;
    @ViewChild('religion') religion: ElementRef;
    @ViewChild('city') city: ElementRef;




    public onEnterprefix(event): void {
        if (event.which === 13) {
            this.fname.nativeElement.focus();
        }
    }
    public onEnterfname(event): void {
        if (event.which === 13) {
            this.mname.nativeElement.focus();
        }
    }
    public onEntermname(event): void {
        if (event.which === 13) {
            this.lname.nativeElement.focus();
        }
    }
    public onEnterlname(event): void {
        if (event.which === 13) {
            this.agey.nativeElement.focus();
            // if(this.mstatus) this.mstatus.focus();
        }
    }

    // public onEntergendere(event): void {
    //   if (event.which === 13) {
    //   // this.gender.nativeElement.focus();
    //   if(this.mstatus) this.mstatus.focus();
    //   }
    // }


    public onEntermstatus(event): void {
        if (event.which === 13) {

            this.mobile.nativeElement.focus();

        }
    }

    public onEnterreligion(event): void {
        if (event.which === 13) {

            // this.ptype.nativeElement.focus();
        }
    }
    public onEnterbday(event): void {
        if (event.which === 13) {
            this.agey.nativeElement.focus();

        }
    }


    public onEnteragey(event): void {
        if (event.which === 13) {
            this.agem.nativeElement.focus();
            // this.addbutton.focus();
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
    // public onEnterpan(event): void {
    //   if (event.which === 13) {
    //     this.address.nativeElement.focus();
    //   }
    // }

    public onEnterAadharCardNo(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }

    public onEnterphone(event): void {
        if (event.which === 13) {
            this.religion.nativeElement.focus();


        }
    }
    public onEntermobile(event): void {
        if (event.which === 13) {
            this.phone.nativeElement.focus();
        }
    }

    public onEnteraddress(event): void {
        if (event.which === 13) {
            this.area.nativeElement.focus();
        }
    }

    onClose() {
        this.dialogRef.close();
    }
    onClear(val: boolean) {
        this.personalFormGroup.reset();
        this.dialogRef.close(val);
    }


    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            RegId: [{ value: '', disabled: this.isRegSearchDisabled }]
        });
    }
    onChangeDateofBirth(DateOfBirth) {

        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.registerObj.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            this.registerObj.ageMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            this.registerObj.ageDay = Math.abs(todayDate.getDate() - dob.getDate());
            this.registerObj.dateofBirth = DateOfBirth;
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


    getSearchList() {
        var m_data = {
            "F_Name": `${this.searchFormGroup.get('RegId').value}%`,
            "L_Name": '%',
            "Reg_No": '0',
            "From_Dt": '01/01/1900',
            "To_Dt": '01/01/1900',
            "MobileNo": '%'
        }
        console.log(m_data);
        // if (this.searchFormGroup.get('RegId').value.length >= 1) {
        //   this._registerService.getRegistrationList(m_data).subscribe(resData => {
        //     this.filteredOptions = resData;
        //     if (this.filteredOptions.length == 0) {
        //       this.noOptionFound = true;
        //     } else {
        //       this.noOptionFound = false;
        //     }
        //   });
        // }

    }


    IsCharity: any;
    onChangeIsactive(SiderOption) {
        this.IsCharity = SiderOption.checked
        console.log(this.IsCharity);
    }

    myFunction(s) {
        this.snackmessage = s;

        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
    }


    // new Api?
    PrefixId = 0;
    genderId = 0;
    areaId = 0;
    cityId = 0;
    stateId = 0;
    countryId = 0;
    regilionId = 0;
    mstausId = 0;
    cityName = 'Pune';


    selectChangeprefix(obj: any) {
        console.log(obj);
        // this.PrefixId=obj;
    }

    selectChangegender(obj: any) {
        console.log(obj);
        this.genderId = obj
    }

    selectChangearea(obj: any) {
        console.log(obj);
        this.areaId = obj
    }

    selectChangecity(obj: any) {
        debugger
        console.log(obj);
        this.cityId = obj
        // this.cityName=obj.text
    }
    selectChangestate(obj: any) {
        debugger
        console.log(obj);
        this.stateId = obj
    }

    selectChangecountry(obj: any) {
        console.log(obj);
        this.countryId = obj
    }

    selectChangemstatus(obj: any) {
        console.log(obj);
        this.mstausId = obj
    }

    selectChangereligion(obj: any) {
        console.log(obj);
        this.regilionId = obj
    }
}
