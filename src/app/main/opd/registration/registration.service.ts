import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegInsert } from './registration.component';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {

    myFilterform: FormGroup;
    mySaveForm: FormGroup;
    personalFormGroup: FormGroup;

    constructor(
        public _httpClient: HttpClient, public _httpClient1: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private accountService: AuthenticationService,
        private _loaderService: LoaderService
    ) {
        this.myFilterform = this.filterForm();
        this.personalFormGroup = this.createPesonalForm1();
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            FirstName: ['', [
                //  Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            MobileNo:['', [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]],
        });
    }

    createPesonalForm1() {
        return this._formBuilder.group({
            RegId: [0],
            RegNo: "0",
            PrefixId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            FirstName: ['', [
                Validators.required,
            //    Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            MiddleName: ['', [
            //    Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.required,
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            GenderId: new FormControl( [0, [Validators.required,notEmptyOrZeroValidator()]]),
            Address: '',
            DateOfBirth: [(new Date()).toISOString()],
            Age: ['0'],
            AgeYear: ['0', [
                // Validators.required,
                Validators.maxLength(3),
                Validators.pattern("^[0-9]*$")]],
            AgeMonth: ['0', [
                Validators.pattern("^[0-9]*$")]],
            AgeDay: ['0', [
                Validators.pattern("^[0-9]*$")]],
            PhoneNo: ['', [Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            MobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            aadharCardNo: ['', [
            Validators.minLength(12),
            Validators.maxLength(12),
            Validators.pattern("^[0-9]*$")
            ]],

            panCardNo: '',
            MaritalStatusId:0,
            ReligionId: 0,
            AreaId: 0,
            CityId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            City: [''],
            StateId:  [0, [Validators.required, notEmptyOrZeroValidator()]],
            CountryId:  [0, [Validators.required,notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy:this.accountService.currentUserValue.userId,
            updatedBy: this.accountService.currentUserValue.userId,
            RegDate: [(new Date()).toISOString()],
            RegTime: [(new Date()).toISOString()],
            Photo: [''],
            PinNo: [''],
            // isActive:[]
        });

    }
    // new Api
    initializeFormGroup() {
        // this.createPesonalForm1();
    }

    public RegstrationtSaveData(Param: any) {

        if (Param.RegId) {
        return this._httpClient1.PostData("OutPatient/RegistrationUpdate", Param);
        } else return this._httpClient1.PostData("OutPatient/RegistrationInsert", Param);
    }


    public deactivateTheStatus(m_data) {
        return this._httpClient1.PostData("OutPatient/RegistrationInsert", m_data);
    }

   
    public getNewRegistrationList(employee) {
        return this._httpClient1.PostData("OutPatient/RegistrationList", employee)
    }
    populateForm(param) {
        this.personalFormGroup.patchValue(param);
    }
    populateFormpersonal(param) { }

    public getRegistraionById(Id) {
        return this._httpClient1.GetData("OutPatient/" + Id);
    }

    
    public getPatientListView(mode) {
        return this._httpClient1.PostData("Report/NewViewReport", mode);

    }

    
    public getstateId(Id) {
        return this._httpClient1.GetData("StateMaster/" + Id);
    }
}


function notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return value > 0 ? null : { greaterThanZero: { value: value } };
      };
}
// Set NODE_OPTIONS="--max-old-space-size=8192"
