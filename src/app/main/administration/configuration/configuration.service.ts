import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder)
        { this.myform = this.createConfigForm();
            this.myformSearch = this.createSearchForm();}
    
    createConfigForm(): FormGroup {
        return this._formBuilder.group({
            // currencyId: [0],
            // currencyName: ["",
            //     [
            //         Validators.required, Validators.maxLength(50),
            //         Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            //     ]
            // ],
            // isDeleted: ["false"],
            // isActive:[true,[Validators.required]]
            registrationNo:[""],
            ipNo:[""],
            
        });
    }
    
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ConfigNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }
    
    initializeFormGroup() {
        this.createConfigForm();
    }

    public currencyMasterSave(Param: any) {
        if (Param.currencyId) {
            return this._httpClient.PutData("CurrencyMaster/" + Param.currencyId, Param);
        } else return this._httpClient.PostData("CurrencyMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CurrencyMaster?Id=" + m_data.toString());
    }
}
