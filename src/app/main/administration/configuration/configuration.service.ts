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
        private _formBuilder: UntypedFormBuilder) {
        // this.myform = this.createConfigForm();
        // this.myformSearch = this.createSearchForm();
    }

    createConfigForm(): FormGroup {
        return this._formBuilder.group({
          

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

    public ConfigSave(Param: any) {
        if (Param.currencyId) {
            return this._httpClient.PutData("Configuration/" + Param.currencyId, Param);
        } else return this._httpClient.PostData("Configuration", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Configuration?Id=" + m_data.toString());
    }

    

      public getloginaccessRetrive(param) {
        return this._httpClient.PostData("Common", param);
    }

}
