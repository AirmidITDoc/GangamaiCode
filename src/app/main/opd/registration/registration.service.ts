import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
    ) { }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            FirstName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.maxLength(50),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            fromDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            enddate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            MobileNo: ['', [
                Validators.minLength(10),
                Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
        });
    }

    createPesonalForm1() {
        return this._formBuilder.group({
            RegId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            RegNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            PrefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            FirstName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            MiddleName: ['', [
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.allowEmptyStringValidator()
            ]],
            LastName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            GenderId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            Address: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(200)]],
            DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            Age: ['0'],
            AgeYear: ['0', [
                Validators.maxLength(3),
                Validators.pattern("^[0-9]*$")]],
            AgeMonth: ['0', [Validators.pattern("^[0-9]*$")]],
            AgeDay: ['0', [Validators.pattern("^[0-9]*$")]],
            PhoneNo: ['', [Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
            this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            MobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
            this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            aadharCardNo: ['', [
                Validators.minLength(12),
                Validators.maxLength(12),
                Validators.pattern("^[0-9]*$"),
                this._FormvalidationserviceService.onlyNumberValidator()
            ]],

            panCardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            MaritalStatusId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]], //changed by raksha
            ReligionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            AreaId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            CityId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            City: [''],
            StateId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            CountryId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            updatedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            RegDate: ['', Validators.required],
            RegTime: ['', Validators.required],
            Photo: [''],
            PinNo: [''],

            //emergency form
            emgContactPersonName: ['', [Validators.maxLength(50),this._FormvalidationserviceService.allowEmptyStringValidator()]],
            emgRelationshipId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            emgMobileNo: ['', [Validators.minLength(10), Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), this._FormvalidationserviceService.onlyNumberValidator()]],
            emgLandlineNo: ['', [Validators.minLength(10), Validators.maxLength(10),
                Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), this._FormvalidationserviceService.onlyNumberValidator()]],
            engAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
            emgAadharCardNo: ['', [Validators.minLength(12), Validators.maxLength(12),
                Validators.pattern("^[0-9]*$"), this._FormvalidationserviceService.onlyNumberValidator()]],
            emgDrivingLicenceNo: ['', [Validators.minLength(16), Validators.maxLength(16),
                Validators.pattern("^[0-9]*$"), this._FormvalidationserviceService.onlyNumberValidator()]], 
                //Validators.pattern(/^[A-Z]{2}-\d{2}-\d{7,11}$/) eg:MH-14-20210001234

            // medical tourisum
            medTourismPassportNo: ['', [Validators.minLength(8), Validators.maxLength(8),Validators.pattern("^[0-9]*$"),
                 this._FormvalidationserviceService.onlyNumberValidator()]], //Validators.pattern(/^[A-Z][0-9]{7}$/) eg:A1234567
            medTourismVisaIssueDate: [null], //"2025-10-25",
            medTourismVisaValidityDate: [null], //"2025-10-25",
            medTourismNationalityId: ['', [Validators.minLength(10), Validators.maxLength(20)]], 
            medTourismCitizenship: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            medTourismPortOfEntry: ['', [Validators.maxLength(20)]],
            medTourismDateOfEntry: [null], //"2025-10-25",
            medTourismResidentialAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
            medTourismOfficeWorkAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
        });

    }

    // new Api
    initializeFormGroup() { }

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
