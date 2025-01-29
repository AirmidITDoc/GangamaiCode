import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
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
        private _formBuilder: UntypedFormBuilder
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
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            ServiceName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z0-9]+$")
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
            TariffId:[""],
            GroupId:[""],
            ServiceNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    initializeFormGroup() {
        this.createServicemasterForm();
    }
    

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("bank?Id=" + m_data.toString());
    }

    public serviceMasterInsert(Param: any) {
        if (Param.serviceId) {
            return this._httpClient.PutData("BillingService/InsertEDMX" + Param.serviceId, Param);
        } else return this._httpClient.PostData("BillingService/InsertEDMX", Param);
    }

    public getClassMasterList(param) {
        return this._httpClient.PostData("ClassMaster/List",param);
    }

  

    populateForm(param) {
        ;
        this.myform.patchValue(param);
        this.edit_data = param;
        this.myform.get("IsPathology").setValue(param.IsPathology == "1" ? true : false);
        this.myform.get("IsRadiology").setValue(param.IsRadiology == "1" ? true : false);
        this.myform.get("CreditedtoDoctor").setValue(param.CreditedtoDoctor == "true" ? true : false);
        this.myform.get("IsEditable").setValue(param.IsEditable == "true" ? true : false);
        this.myform.get("IsEmergency").setValue(param.IsEmergency == "true" ? true : false);
    }
}
