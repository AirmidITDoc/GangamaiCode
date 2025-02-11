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
            serviceId: [""],
            groupId: [""],
            GroupName: [""],
            serviceShortDesc: ["", 
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            serviceName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z0-9]+$")
                ]
            ],
            price: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            isEditable: ["0"],
            creditedtoDoctor: ["0"],
            isPathology: ["0"],
            isRadiology: ["0"],
            IsDeleted: ["0"],
            printOrder: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            isPackage: ["0"],
            subGroupId: [""],
            doctorId: [""],
            FirstName: ["", Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
            isEmergency: true,
            emgAmt: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            emgPer: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            isDocEditable: true,
            AddedBy: [""],
            UpdatedBy: [""],
            IsActive:[true],
            serviceDetails: [
                {
                    serviceDetailId : 0,
                    serviceId : 0,
                    tariffId : 0,
                    classId : 0,
                    classRate : 0
                }
            ],
            // tariffId: ["",
            //     [
            //         Validators.required
            //     ]
            // ],
            // classId: ["0"],
            // classRate: ["0"],
            EffectiveDate: [""],
        });
    }

    /**
             * {
  "serviceId": 0,
  "groupId": 0,
  "serviceShortDesc": "shilpa",
  "serviceName": "xyz",
  "price": 500,
  "isEditable": true,
  "creditedtoDoctor": true,
  "isPathology": 0,
  "isRadiology": 0,
  "printOrder": 0,
  "isPackage": 0,
  "subGroupId": 0,
  "doctorId": 0,
  "isEmergency": true,
  "emgAmt": 0,
  "emgPer": 0,
  "isDocEditable": true,
  "serviceDetails": [
    {
      "serviceDetailId": 0,
      "serviceId": 0,
      "tariffId": 123,
      "classId": 0,
      "classRate": 0
    }
  ]
}

             */
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
    }
}
