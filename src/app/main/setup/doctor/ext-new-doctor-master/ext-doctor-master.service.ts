
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";


@Injectable({
    providedIn: 'root'
})
export class ExtDoctorMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller, private formBuilder: FormBuilder,
        private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        // this.myform = this.createdDoctormasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            searchDoctorId: ["0"],
            DoctorNameSearch: [""],
            lastName: [""],

        });
    }


    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("Doctor?Id=" + m_data.toString());
    }

    public ExtdoctortMasterInsert(Param: any) {
        debugger
        if (Param.extDoctorId) {
            return this._httpClient.PutData("ExternalDoctor/" + Param.extDoctorId, Param);
        } else
            return this._httpClient.PostData("ExternalDoctor", Param);
    }


    populateForm(param) {
        this.myform.patchValue(param);
    }
}
