import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DoctortypeMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createDoctortypeForm();
        this.myformSearch = this.createSearchForm();
    }

    createDoctortypeForm(): FormGroup {
        return this._formBuilder.group({
            id: [0],
            doctorType: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z0-9]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                    
                ]
            ],
            isActive: [true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoctorTypeSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDoctortypeForm();
    }

    public doctortypeMasterSave(Param: any) {
        if (Param.id) {
            return this._httpClient.PutData("DoctorTypeMaster/" + Param.id, Param);
        } else return this._httpClient.PostData("DoctorTypeMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DoctorTypeMaster?Id=" + m_data.toString());
    }

}