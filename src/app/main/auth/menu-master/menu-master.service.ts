import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class MenuMasterService {

    myform: any;
    myformSearch: any;
   
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder) 
    {
        this.myform = this.createMenuForm();
        this.myformSearch = this.createSearchForm();
    }

    createMenuForm(): FormGroup {
    return this._formBuilder.group({
                id:[0],
                upId: ["",
                    [
                        Validators.required
                        // Validators.pattern('^[0-9]*$')
                        // ("^[A-Za-z]*[a-zA-Z]*$")
                    ]
                ],
                linkName: ['', [
                    Validators.required,
                    Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
                ]],
                icon: ['', [
                    Validators.required,
                    Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
                ]],
                linkAction: ['', [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
                ]],
                sortOrder: ["",
                    [
                        Validators.required,
                        Validators.pattern('^[0-9]*$')
                    ]
                ],
                isActive:[true,[Validators.required]],
                isDisplay: [true,[Validators.required]],
                permissionCode:["",
                    [
                        Validators.required,
                        // Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
                    ]
                ],
                tableNames:["",
                    [
                        Validators.required,
                        // Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
                    ]
                ]
            });
    }

    createSearchForm(): FormGroup {
            return this._formBuilder.group({
                MenuNameSearch: [0],
                LinkSearch: [""],
            });
    }

    initializeFormGroup() {
            this.createMenuForm();
    }

      public menuMasterSave(Param: any) {
        if (Param.id)
            return this._httpClient.PutData("MenuMaster/Edit/" + Param.id, Param);
        else
       return this._httpClient.PostData("MenuMaster/Insertsp", Param);
    }

    getValidationMessages() {
        return {
            sortOrder: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Please enter SortOrder" },
            ],
            upId:[
                { name: "required", Message: "UPID is required" },
            ],
            linkName:[
                { name: "required", Message: "Link Name is required" }
            ],
            icon:[
                { name: "required", Message: "Icon is required" },
            ],
            linkAction:[
                { name: "required", Message: "LinkAction is required" },
            ],
            permissionCode:[
                { name: "required", Message: "Permission Code is required" },
            ],
            tableNames:[
                { name: "required", Message: "Table Name is required" },
            ]
        };
    }

    deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("MenuMaster?Id=" + m_data.toString());
    }
}
