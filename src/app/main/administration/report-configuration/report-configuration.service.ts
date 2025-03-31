import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class ReportConfigurationService {
    myformSearch: FormGroup;
    myform: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    )  {
            this.myformSearch = this.createSearchForm();
            this.myform = this.createForm();
        }
    

    createForm(): FormGroup {
        return this._formBuilder.group({
            reportId:[0],
            menuId: [1],
            reportSection:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                    Validators.pattern("^[A-Za-z @#&]+$") //include space 
                ]
            ],
            reportName:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                    Validators.pattern("^[A-Za-z @#&]+$")
                ]
            ],
            parentid:["",
                [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            reportMode:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportTitle:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                    Validators.pattern("^[A-Za-z @#&]+$")
                ]
            ],
            reportHeader:["",
                [
                    Validators.required, 
                    // Validators.maxLength(2000),
                ]
            ],
            reportColumn:["",
                [
                    Validators.required, 
                ]
            ],

            reportTotalField:[""],
            reportGroupByLabel:["",
            ],
            reportHeaderFile:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                    Validators.pattern("^[A-Za-z .,@$&]+$") //.html
                ]
            ],
            reportBodyFile:["", 
                [
                    Validators.required, 
                    Validators.maxLength(500),
                ]
            ],
            reportFolderName:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                ]
            ],
            reportFileName:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                ]
            ],
            reportSpname:["",
                [
                    Validators.required, 
                    Validators.maxLength(500),
                ]
            ],
            reportPageOrientation:["",[Validators.required]],
            reportPageSize:["",[Validators.required]],
            // isActive:[true,[Validators.required]],
            reportFilter: ["",
                [
                    Validators.maxLength(500),
                ]
            ],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            StoreNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createForm();
    }

     //insert update of Report Configuration
    public insertReportConfig(Param: any) {
        
        if (Param.reportId) {
            return this._httpClient.PutData("ReportConfig/" + Param.reportId, Param);
        } else return this._httpClient.PostData("ReportConfig",Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ReportConfig?Id=" + m_data.toString());
    }
}
