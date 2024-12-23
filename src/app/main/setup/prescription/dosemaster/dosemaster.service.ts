import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { gridRequest } from "app/core/models/gridRequest";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()
export class DosemasterService {
    myForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myForm = this.createDoseForm();
        this.myformSearch = this.createSearchForm();
    }

    // {
    //     "doseId": 0,
    //     "doseName": "DOG",
    //     "doseNameInEnglish": "DOGGY",
    //     "doseNameInMarathi": "DOGGY",
    //     "doseQtyPerDay": 0
    //   }

    createDoseForm(): FormGroup {
        return this._formBuilder.group({
            doseId: [0],
            doseName: ["", 
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            doseNameInEnglish: ["", 
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            doseNameInMarathi :[""],
            doseQtyPerDay: ["",
                [
                    Validators.required,
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            isActive: ["true"],
            AddedBy: ["0"],
            UpdatedBy: ["0"],
            AddedByName: [""],
        });
    }

    getValidationMessages(){
        return{
            doseName: [
                { name: "required", Message: "Dose Name is required" },
                { name: "maxlength", Message: "Dose name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            doseNameInEnglish: [
                { name: "required", Message: "DoseNameInEnglish is required" },
                { name: "maxlength", Message: "DoseNameInEnglish should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            doseQtyPerDay: [
                { name: "required", Message: "DoseQtyPerDay is required" },
                { name: "maxlength", Message: "DoseQtyPerDay should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed, only Digits." }
            ],
            doseNameInMarathi: [

            ]
        }
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            DoseNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createDoseForm();
    }

    public getDoseMasterList(param: gridRequest, showLoader = true) {
        return this._httpClient.PostData("DoseMaster/List", param, showLoader);
    }

    public doseMasterInsert(Param: any, showLoader = true) {
        if (Param.doseId) {
            return this._httpClient.PutData("DoseMaster/" + Param.doseId, Param, showLoader);
        } else return this._httpClient.PostData("DoseMaster", Param, showLoader);
    }

    public doseMasterUpdate(id: number , Param: any, showLoader = true) {
        //return this._httpClient.put("Gender/" + id , Param, showLoader);
        return this._httpClient.PostData("DoseMaster", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("DoseMaster?Id=" + m_data.toString());
    }
    populateForm(param) {
        this.myForm.patchValue(param);
    }
}
