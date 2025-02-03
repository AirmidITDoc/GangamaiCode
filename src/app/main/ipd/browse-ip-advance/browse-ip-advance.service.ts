import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class BrowseIpAdvanceService {
    UserFormGroup: FormGroup;
    MyForm: FormGroup;

    constructor(
        public _formBuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller)
    { this.UserFormGroup = this.createUserFormGroup() }

    createUserFormGroup() {
        return this._formBuilder.group({
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],

        })
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
}
