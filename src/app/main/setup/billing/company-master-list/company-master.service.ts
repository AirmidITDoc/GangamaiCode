import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
            serviceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            tariffId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            companyCode: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$'),
            this._FormvalidationserviceService.allowEmptyStringValidator()]],
            companyServicePrint: ['', [Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9 ]*$'),
            this._FormvalidationserviceService.allowEmptyStringValidator()]],
            inInclusionOrExclusion: [0],


        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CompanyNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    createservSearchForm(): FormGroup {
        return this._formBuilder.group({
            ServiceName: [""],
            ClassId2: [""],
        });
    }

    creategroupSearchForm(): FormGroup {
        return this._formBuilder.group({
            ServiceName: [""],
            ClassId2: [""],
        });
    }

    createsubgroupSearchForm(): FormGroup {
        return this._formBuilder.group({
            ServiceName: [""],
            ClassId2: [""],
        });
    }

    createcompwiseservForm(): FormGroup {
        return this._formBuilder.group({
            ServiceName: [""],
            ClassId2: [""],
        });
    }
    createCompanysearchFormDemo(): FormGroup {
        return this._formBuilder.group({
            companyName: [""],
            compTypeId: 0,
            ServiceSearch: [""],
            ClassId1: [1],
            TariffId1: [0],
            ClassId2: [1],
            TariffId2: [1],
            IsPathRad: ["3"],
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
      return this._httpClient.PostData("CompanyMaster/CompanyWiseServiceDiscount", Param);
    }

    
}
