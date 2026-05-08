import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class SupplierwiseRateDefineService { 
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.CreateRateDefineForm();
        this.myformSearch = this.createSearchForm();
    }

    CreateRateDefineForm(): FormGroup {
        return this._formBuilder.group({
            defId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            supplierId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            supplierRate:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
           // isActive: [true, [Validators.required]]
        });
    } 
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            itemId:'',
            supplierId: [""],
            IsDeletedSearch: [""],
        });
    }
    initializeFormGroup() {
        this.CreateRateDefineForm();
    }


    public SupplierWsieRateDefineSave(Param: any) {
        debugger
        if (Param.defId) {
            return this._httpClient.PutData("ItemWiseSupplierRate/" + Param.defId, Param);
        } else return this._httpClient.PostData("ItemWiseSupplierRate", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemWiseSupplierRate?Id=" + m_data.toString());
    }

}
