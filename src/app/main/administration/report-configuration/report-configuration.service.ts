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
            reportSection:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportName:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            parentid:["",
                [
                    Validators.required,
                    Validators.maxLength(10),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            reportTitle:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportHeader:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportColumn:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportHeaderFile:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportBodyFile:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportFolderName:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportFileName:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportSPName:["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            reportPageOrientation:["",[Validators.required]],
            reportPageSize:["",[Validators.required]],
            isActive:[true,[Validators.required]],
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
            return this._httpClient.PutData("MReportConfig/" + Param.reportId, Param);
        } else return this._httpClient.PostData("MReportConfig", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
}
