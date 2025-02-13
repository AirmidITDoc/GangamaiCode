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
                id:[""],
                upId: ["",
                    [
                        // Validators.required,
                        Validators.pattern('^[0-9]*$')
                        // ("^[A-Za-z]*[a-zA-Z]*$")
                    ]
                ],
                linkName: [""],
                icon: [""],
                linkAction: [""],
                sortOrder: [""],
                isActive: true,
                isDisplay: true,
                permissionCode:[""],
                tableNames:[""],

                /**
                 * {
  "id": 0,
  "upId": 0,
  "linkName": "string",
  "icon": "string",
  "linkAction": "string",
  "sortOrder": 0,
  "isDisplay": true,
  "permissionCode": "string",
  "tableNames": "string"
}
                 */
            });
    }

    createSearchForm(): FormGroup {
            return this._formBuilder.group({
                MenuNameSearch: [""],
                IsDeletedSearch: ["2"],
            });
    }

    initializeFormGroup() {
            this.createMenuForm();
    }

      public menuMasterSave(Param: any) {
        if (Param.id) {
            return this._httpClient.PutData("LoginManager/Edit/" + Param.id, Param);
        } else return this._httpClient.PostData("LoginManager/Insert", Param);
    }

    getValidationMessages() {
        return {
            bedName: [
                { name: "required", Message: "Bed Name is required" },
                { name: "maxlength", Message: "Bed name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            upId:[
                { name: "required", Message: "UP Id is required" },
            ],
            linkName:[
                { name: "required", Message: "Menu Name is required" },
                { name: "maxlength", Message: "Menu Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            icon:[
                { name: "required", Message: "Icon is required" },
            ],
            linkAction:[
                { name: "required", Message: "Action is required" },
            ]
        };
    }

    deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("MenuMaster?Id=" + m_data.toString());
    }
}
