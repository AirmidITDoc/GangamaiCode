import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ConfigService } from 'app/core/services/config.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyMasterService {


    Is5_Digit_Pincode_Id: boolean = false;
    companyForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        public _configue: ConfigService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        // this.companyForm = this.createCompanymasterForm();
        // this.myformSearch = this.createSearchForm();

    }

    createCompanymasterFormDemo(): FormGroup {
        const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.Is5_Digit_Pincode_Id = id === "1";
        const maxLen = this.Is5_Digit_Pincode_Id ? 5 : 6;
        return this._formBuilder.group({
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            companyName: ['', [Validators.required, Validators.maxLength(50),
            // Validators.pattern('^[a-zA-Z0-9 ]*$'),
            this._FormvalidationserviceService.allowEmptyStringValidator()]],
            companyShortName: ['', [Validators.required, Validators.maxLength(50),
                // Validators.pattern('^[a-zA-Z0-9 ]*$')
            ]],

            address: ['', [Validators.required, Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidator()]],

            cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            contactPerson: ['', [Validators.maxLength(50),
                //  Validators.pattern('^[a-zA-Z0-9 ]*$')
            ]],

            phoneNo: ["", [Validators.required, Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"), Validators.minLength(10),
            Validators.maxLength(10)]],

            contactNumber: ["", [Validators.required, Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
            Validators.maxLength(10), Validators.minLength(10),]],

            emailId: ['', [Validators.email]],
            website: [''],

            compTypeId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isSubCompany: [false],
            paymodeOfPayId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            tanno: ['', Validators.maxLength(13)],
            gstin: ['', Validators.maxLength(10)],
            panNo: ['', Validators.maxLength(10)],
            adminCharges: [0, Validators.maxLength(5)],
            // isActive: [true],
            pinNo: ['', [Validators.required,
            Validators.minLength(maxLen),
            Validators.maxLength(maxLen)  //, Validators.pattern("^[0-9]*$")
            ]],
            faxNo: ["0"],
            traiffId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            creditDays: [0],

            loginWebsiteUser: "",
            loginWebsitePassword: "",
            dayWiseCredit: 0,
            mCompanyExecutiveInfos: [{
                id: 0,
                companyId: 0,
                employeId: 0
            }, [Validators.required]],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CompanyNameSearch: [""],
            cityId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            compTypeId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            phoneNo: '',
            Isactive: ["2"],
        });
    }

    createservSearchForm(): FormGroup {
        return this._formBuilder.group({
            ServiceName: [""],
            ClassId2: [""],
        });
    }

    // creategroupSearchForm(): FormGroup {
    //     return this._formBuilder.group({
    //         ServiceName: [""],
    //         ClassId2: [""],
    //     });
    // }

    // createsubgroupSearchForm(): FormGroup {
    //     return this._formBuilder.group({
    //         ServiceName: [""],
    //         ClassId2: [""],
    //     });
    // }

    createcompwiseservForm(): FormGroup {
        return this._formBuilder.group({
            ServiceName: [""],
            ClassId2: [""],
        });
    }
    createCompanysearchFormDemo(): FormGroup {
        return this._formBuilder.group({
            companyName: [""],
            compTypeId: [0, [notEmptyOrZeroValidator()]],
            ServiceSearch: [""],
            // ClassId1: [0, [notEmptyOrZeroValidator()]],
            TariffId1: [0, [notEmptyOrZeroValidator()]],
            ClassId2: [0, [notEmptyOrZeroValidator()]],
            // TariffId2: [0, [notEmptyOrZeroValidator()]],
            // IsPathRad: ["3"],
            ServiceName: ['%']

        });
    }



    initializeFormGroup() {
        // this.createCompanymasterForm();
    }

    public companyMasterSave(Param: any) {
        if (Param.companyId) {
            return this._httpClient.PutData("CompanyMaster/Edit/" + Param.companyId, Param);
        } else return this._httpClient.PostData("CompanyMaster/Insert", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CompanyMaster?Id=" + m_data.toString());
    }

    getCompanyById(companyId: any) {
        return this._httpClient.GetData("CompanyMaster/" + companyId);
    }
    public getstateId(Id) {
        return this._httpClient.GetData("StateMaster/" + Id);
    }

    public getservicMasterListRetrive(data) {
        return this._httpClient.PostData("CompanyMaster/ServiceTariffWiseList", data);
    }

    public getservicCodeList(data) {
        return this._httpClient.PostData("CompanyMaster/ServiceCompanyTariffWiseList ", data);
    }

    public getsubtpaListRetrive(data) {
        return this._httpClient.PostData("Common", data);
    }

    public servicecoderateupdate(Param: any) {
        // if (Param.serviceId) {
        //     return this._httpClient.PutData("BillingService/Edit/" + Param.serviceId, Param);
        // } else 
        return this._httpClient.PutData("CompanyMaster/updatecompanywiseservicerate", Param);
    }

    public updateservicecodeSave(Param: any) {
        return this._httpClient.PostData("CompanyMaster/ServiceWiseCompanySave", Param);
    }

    public SaveserviceCompanyCode(Param: any) {
        return this._httpClient.PostData("BillingService/ServiceWiseCompanyCode", Param);
    }

    public Servdiscupdate(Param: any) {
        if (Param.compServiceDetailId) {
            return this._httpClient.PutData("CompanyMaster/CompanyWiseServiceDiscount/" + Param.compServiceDetailId, Param);
        } else
            return this._httpClient.PostData("CompanyMaster/CompanyWiseServiceDiscount", Param);
    }
    public getempList(employee) {
        return this._httpClient.PostData("CompanyMaster/CompanyExecutiveInfoList", employee);
    }


}
function notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return value > 0 ? null : { greaterThanZero: { value: value } };
    };
}