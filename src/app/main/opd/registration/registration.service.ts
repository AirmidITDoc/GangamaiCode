import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { RegInsert } from './registration.component';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class RegistrationService {
    constructor(
        public _httpClient: HttpClient, public _httpClient1: ApiCaller,
        private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
         private accountService: AuthenticationService,
        private _loaderService: LoaderService
    ) {}

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo:['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
            FirstName: ['', [
                   Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                    Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            fromDate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
            enddate:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
            MobileNo:['', [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
                ]],
        });
    }

    createPesonalForm1() {
        return this._formBuilder.group({
            RegId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            RegNo:['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
            PrefixId:[0, [Validators.required,  this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            FirstName: ['', [
                Validators.required,
             Validators.maxLength(50),
            Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            MiddleName: ['', [
           Validators.maxLength(50),
            Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.required,
               Validators.maxLength(50),
            Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            GenderId: new FormControl( [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]]),
            Address:['',[this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(150)]],
            DateOfBirth:[(new Date()).toISOString(),this._FormvalidationserviceService.validDateValidator()],
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

            panCardNo:['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
            MaritalStatusId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            ReligionId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            AreaId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            CityId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            City: [''],
            StateId:  [0, [Validators.required,  this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            CountryId:  [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: [this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            updatedBy: [this.accountService.currentUserValue.userId,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            RegDate: [(new Date()).toISOString()],
            RegTime: [(new Date()).toISOString()],
            Photo: [''],
            PinNo: [''],
            // isActive:[]
        });

    }
    // new Api
    initializeFormGroup() {}

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
        // this.personalFormGroup.patchValue(param);
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


// Set NODE_OPTIONS="--max-old-space-size=8192"
