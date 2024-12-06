import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoaderService } from "app/core/components/loader/loader.service";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ServiceMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    edit_data = {};
    constructor(
        private _httpClient: ApiCaller,
        private _loaderService: LoaderService,
        private _formBuilder: FormBuilder
    ) {
        this.myform = this.createServicemasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createServicemasterForm(): FormGroup {
        return this._formBuilder.group({
            ServiceId: [""],
            GroupId: [""],
            GroupName: [""],
            ServiceShortDesc: ["", 
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            ServiceName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            Price: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            IsEditable: ["0"],
            CreditedtoDoctor: ["0"],
            IsPathology: ["0"],
            IsRadiology: ["0"],
            IsDeleted: ["0"],
            PrintOrder: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            IsPackage: ["0"],
            SubGroupId: [""],
            DoctorId: [""],
            FirstName: ["", Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            IsEmergency: ["0"],
            EmgAmt: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            EmgPer: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            IsDocEditable: ["0"],
            AddedBy: [""],
            UpdatedBy: [""],
            IsActive:[true],
            ServiceDetailId: [""],
            TariffId: ["",
                [
                    Validators.required
                ]
            ],
            ClassId: ["0"],
            ClassRate: ["0"],
            EffectiveDate: [""],
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ServiceNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createServicemasterForm();
    }
    // getValidationGroupNameMessages(){
    //     return {
    //         GroupId: [
    //           { name: "required", Message: "Group Name is required" }
    //       ]
    //   };
    // }
    // getValidationtariffMessages() {
    //     return {
    //       TariffId: [
    //             { name: "required", Message: "Tariff Name is required" }
    //         ]
    //     };
    // }
    // public getbankMasterList(param: gridRequest, showLoader = true) {
    //     return this._httpClient.PostData("BankMaster/List", param, showLoader);
    // }

    // public bankMasterSave(Param: any, id: string ,showLoader = true) {
    //     if(id)
    //         return this._httpClient.PutData("bank/"+ id, Param, showLoader);
    //     else
    //         return this._httpClient.PostData("bank", Param, showLoader);       
    // }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("bank?Id=" + m_data.toString());
    }

    public serviceMasterInsert(Param: any, showLoader = true) {
        if (Param.serviceId) {
            return this._httpClient.PutData("BillingService/InsertEDMX" + Param.serviceId, Param, showLoader);
        } else return this._httpClient.PostData("BillingService/InsertEDMX", Param, showLoader);
    }

    public getClassMasterList(param) {
        return this._httpClient.PostData("ClassMaster/List",param);
    }

    // public getServicewiseClassMasterList(param,loader = true) {
    //     if (loader) {
    //         this._loaderService.show();
    //     }
    //     return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ServiceClassdetail",param
    //     );
    // }

    populateForm(param) {
        debugger;
        this.myform.patchValue(param);
        this.edit_data = param;
        this.myform.get("IsPathology").setValue(param.IsPathology == "1" ? true : false);
        this.myform.get("IsRadiology").setValue(param.IsRadiology == "1" ? true : false);
        this.myform.get("CreditedtoDoctor").setValue(param.CreditedtoDoctor == "true" ? true : false);
        this.myform.get("IsEditable").setValue(param.IsEditable == "true" ? true : false);
        this.myform.get("IsEmergency").setValue(param.IsEmergency == "true" ? true : false);
    }
}
