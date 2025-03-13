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
            ServiceId: 0,
            groupId: [""],
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
            FirstName: ["", Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            IsEmergency: true,
            EmgAmt: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            EmgPer: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            IsDocEditable: true,
            AddedBy: [""],
            UpdatedBy: [""],
            IsActive:[true],
            ServiceDetails: [
                {
                    serviceDetailId : 0,
                    serviceId : 0,
                    tariffId : 0,
                    classId : 0,
                    classRate : 0
                }
            ],
            DoctorId:[""],
            tariffId: ["",
                [
                    // Validators.required
                ]
            ],
            // classId: ["0"],
            // classRate: ["0"],
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

    public tariffMasterSave(Param: any) {
        if (Param.tariffId) {
            return this._httpClient.PutData("TarrifMaster/" + Param.tariffId, Param);
        } else return this._httpClient.PostData("TarrifMaster", Param);
    }
    

    public deactivateTheStatus(m_data) {
        
        return this._httpClient.DeleteData("BillingService?Id=" + m_data.toString());
    }

    public ServiceMasterCancle(Id: any) {
        
      return this._httpClient.DeleteData(`BillingService/ServicDelete?Id=${Id}`);
    }

    public serviceMasterInsert(Param: any) {
        return this._httpClient.PostData("BillingService/InsertEDMX", Param);
    }

    public serviceMasterUpdate(Param: any) {
        if (Param.serviceId) {
            return this._httpClient.PutData("BillingService/Edit/" + Param.serviceId, Param);
        }
    }

    public getClassMasterList(param) {
        return this._httpClient.PostData("Billing/ServiceClassdetaillList",param);
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
        this.myform.get("IsPackage").setValue(param.IsPackage == "true" ? true : false);
    }
}
