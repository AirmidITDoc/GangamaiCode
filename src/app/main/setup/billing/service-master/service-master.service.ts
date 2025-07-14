import { Injectable } from "@angular/core";
import { AbstractControl, FormGroup, UntypedFormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class ServiceMasterService {
    myform: FormGroup;
    myTariffform: FormGroup;
    myformSearch: FormGroup;
    edit_data = {};
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) {
        this.myform = this.createServicemasterForm();
        this.myTariffform = this.createTariffmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createServicemasterForm(): FormGroup {
        return this._formBuilder.group({
            ServiceId: 0,
            groupId: [0,[Validators.required, notEmptyOrZeroValidator()]],
            GroupName: [""],
            ServiceShortDesc: ["", 
                [
                    Validators.required,
                    //Validators.pattern("^[A-Za-z0-9 ]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            ServiceName: ["",
                [
                    Validators.required,
                   // Validators.pattern("^[A-Za-z0-9 ]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            TariffName: ["",
                [
                    Validators.required,
                   // Validators.pattern("^[A-Za-z0-9 ]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            Price: [0],
            IsEditable: ["0"],
            CreditedtoDoctor: ["0"],
            IsPathology: ["0"],
            IsRadiology: ["0"],
            IsDeleted: ["0"],
            PrintOrder: ["",[Validators.required, Validators.pattern("[0-9]+")]],
            IsPackage: ["0"],
            SubGroupId: [""],
            FirstName: ["",
                 //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                 Validators.pattern('^[a-zA-Z0-9 ]*$')
                ],
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
            tariffId: [0,[Validators.required, notEmptyOrZeroValidator()]],
            // classId: ["0"],
            // classRate: ["0"],
            EffectiveDate: [""],
        });
    }

    createTariffmasterForm(): FormGroup {
        return this._formBuilder.group({            
            oldTariffId: [0,[Validators.required, notEmptyOrZeroValidator()]],
            // newTariffId: [0,[Validators.required, notEmptyOrZeroValidator()]],
            newTariffId: [[],[Validators.required, notEmptyOrZeroValidator()]],
        });
    }

    createAllTariffmasterForm(): FormGroup {
        return this._formBuilder.group({            
            TariffId: [0,[Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isAll: [true],
            isSelected:[false]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TariffId:[""],
            GroupId:[""],
            ServiceNameSearch: [""],
            IsDeletedSearch: ["2"],
            IsRadPath: ["1"],
        });
    }

    initializeFormGroup() {
        this.createServicemasterForm();
    }

    public SaveTariff(Param: any) {
        return this._httpClient.PutData("BillingService/UpdateDifferTariff", Param);
    }
    

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ServicDelete?Id=" + m_data.toString());
    }

    public SavePackagedet(param) {
        return this._httpClient.PostData("BillingService/PackageDetailsInsert", param);
    }

    public getClassMasterList(param) {
        return this._httpClient.PostData("ClassMaster/List",param);
    }

    public getRtevPackageDetList(param) {
        return this._httpClient.PostData("BillingService/PackageServiceInfoList",param);
    }

    public ServiceMasterCancle(Id: any) {
        
      return this._httpClient.DeleteData(`BillingService/ServicDelete?Id=${Id}`);
    }

    public serviceMasterInsert(Param: any) {
         if (Param.serviceId) {
            return this._httpClient.PutData("BillingService/Edit/" + Param.serviceId, Param);
        }else return this._httpClient.PostData("BillingService/InsertEDMX", Param);
    }

    // public serviceMasterUpdate(Param: any) {
        // if (Param.serviceId) {
        //     return this._httpClient.PutData("BillingService/Edit/" + Param.serviceId, Param);
        // }
    // }

    public getClassMasterListRetrive(param) {
        return this._httpClient.PostData("Billing/ServiceClassdetaillList",param);
    }

    
    public getServicesNew(param) {
        return this._httpClient.GetData("BillingService/GetServicesNew?TariffId="+param);
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

function notEmptyOrZeroValidator(): any {
  return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value > 0 ? null : { greaterThanZero: { value: value } };
    };
}