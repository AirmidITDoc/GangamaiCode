import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class CompanyMasterService {


    companyForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        // this.companyForm = this.createCompanymasterForm();
        // this.myformSearch = this.createSearchForm();
    }

createCompanymasterFormDemo(): FormGroup {
return this._formBuilder.group({
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            companyName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$'),
            this._FormvalidationserviceService.allowEmptyStringValidator()]],
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            companyShortName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            // tariffId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            companyCode: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$'),
this._FormvalidationserviceService.allowEmptyStringValidator()]],

            address: ['', [Validators.required,Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidator()]],

            cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            contactPerson: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$')]],
            companyServicePrint: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$'),
            this._FormvalidationserviceService.allowEmptyStringValidator()]],
            inInclusionOrExclusion: [0],

            // designation: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$'),
            // this._FormvalidationserviceService.allowEmptyStringValidator()]],

            phoneNo: ["", [Validators.required, Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
            Validators.maxLength(10)]],

            contactNumber: ["", [Validators.required, Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
            Validators.maxLength(10)]],

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
            pinNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
            Validators.minLength(6),
            Validators.maxLength(6),]],
            faxNo: [" ",[Validators.required, Validators.maxLength(10)]],
            traiffId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            creditDays: [0, Validators.maxLength(3)],

            loginWebsiteUser: "",
            loginWebsitePassword: "",

});
}
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CompanyNameSearch: [""],
            Isactive: ["1"],
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
            compTypeId: [0, [ notEmptyOrZeroValidator()]],
            ServiceSearch: [""],
            // ClassId1: [0, [notEmptyOrZeroValidator()]],
            TariffId1:[0, [notEmptyOrZeroValidator()]],
            ClassId2:[0, [notEmptyOrZeroValidator()]],
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
            return this._httpClient.PutData("CompanyMaster/" + Param.companyId, Param);
        } else return this._httpClient.PostData("CompanyMaster", Param);
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
        return this._httpClient.PostData("Common", data);
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


 public Servdiscupdate(Param: any) {
     if (Param.compServiceDetailId) {
            return this._httpClient.PutData("CompanyMaster/CompanyWiseServiceDiscount/" + Param.compServiceDetailId, Param);
        } else 
      return this._httpClient.PostData("CompanyMaster/CompanyWiseServiceDiscount", Param);
    }

    
}
function notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return value > 0 ? null : { greaterThanZero: { value: value } };
    };
}