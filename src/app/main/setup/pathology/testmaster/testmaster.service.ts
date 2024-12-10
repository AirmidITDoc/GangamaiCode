import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class TestmasterService {
    is_Test = true;
    is_subtest = false;
    is_templatetest= false;
    myformSearch: FormGroup;
    myform: FormGroup;
    AddParameterFrom: FormGroup;
    mytemplateform: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
    ) {
        this.myformSearch = this.createSearchForm();
        this.myform = this.createPathtestForm();
        this.AddParameterFrom = this.createAddparaFrom();
        this.mytemplateform = this.createTemplateForm();
    }

    createPathtestForm(): FormGroup {
        return this._formBuilder.group({

            TestId: [""],
            TestName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            PrintTestName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            CategoryId: [""],
            TechniqueName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            MachineName: ["",
                [
                    Validators.required,
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            SuggestionNote: ["", Validators.required],
            FootNote: ["", Validators.required],
            ServiceID: [""],
            ServiceName: [""],
            IsTemplateTest: ["0"],
            IsCategoryPrint: [""],
            IsPrintTestName: [""],
            ParameterId: [""],
            ParaId: [""],
            ParameterName: [""],
            IsDeleted: ["true"],
            UpdatedBy: [""],
            AddedBy: [""],
            action: [""],
            parametertxt: [""],
            PTemplateId: [""],
            IsSubTest: ["true"],
            Status:[1],
            ParameterNameSearch:[""]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            TestNameSearch: [""],
            IsDeletedSearch: ["2"],
            IsSubTest: [" "],
        });
    }
    createAddparaFrom(): FormGroup {
        return this._formBuilder.group({
            ParameterName: [""],
            NewIsSubTest: [" "],
        });
    }
    createTemplateForm(): FormGroup {
        return this._formBuilder.group({
            TemplateId:[""],
            TemplateName:[""],
        });
    }
      
    initializeFormGroup() {
        this.createPathtestForm();
    }
    
    getValidationMessages() {
        return {
            TestName: [
                { name: "required", Message: "TestName is required" },
                { name: "maxlength", Message: "TestName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            PrintTestName:[
                { name: "required", Message: "PrintTestName is required" },
                { name: "maxlength", Message: "PrintTestName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            TechniqueName: [
                { name: "required", Message: "TechniqueName is required" },
                { name: "maxlength", Message: "TechniqueName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            MachineName:[
                { name: "required", Message: "MachineName is required" },
                { name: "maxlength", Message: "MachineName should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
            // SuggestionNote:[
            //     { name: "required", Message: "Suggestion is required" },
            //     { name: "maxlength", Message: "Suggestion should not be greater than 50 char." },
            //     // { name: "pattern", Message: "Special char not allowed." }
            // ],
            // FootNote:[
            //     { name: "required", Message: "FootNote is required" },
            //     { name: "maxlength", Message: "FootNote should not be greater than 50 char." },
            //     // { name: "pattern", Message: "Special char not allowed." }
            // ]
        };
    }

    public unitMasterSave(Param: any, showLoader = true) {
        if (Param.TestId) {
            return this._httpClient.PutData("PathTestMaster/Insert" + Param.TestId, Param, showLoader);
        } else return this._httpClient.PostData("PathTestMaster/Insert", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.PostData("PathUnitMaster", m_data);
    }
}

