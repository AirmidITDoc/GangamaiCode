import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ManufactureMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createManufactureForm();
        this.myformSearch = this.createSearchForm();
    }

    // {
    //     "manufId": 0,
    //     "manufName": "Pharmacy",
    //     "manufShortName": "Medical"
    //   }
      

    createManufactureForm(): FormGroup {
        return this._formBuilder.group({
            manufId: [0],
            manufName: ["",
                [
                    Validators.required,Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z @#&]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            manufShortName: ["",
                [
                    Validators.required,Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z @#&]+$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            isDeleted: false,
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            isActive:[true,[Validators.required]]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ManufNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createManufactureForm();
    }

    public manufactureMasterSave(Param: any) {
        if (Param.manufId) {
            return this._httpClient.PutData("ManufactureMaster/" + Param.manufId, Param);
        } else return this._httpClient.PostData("ManufactureMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ManufactureMaster?Id=" + m_data.toString());
    }
}
