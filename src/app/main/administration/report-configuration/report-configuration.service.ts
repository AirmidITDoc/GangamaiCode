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

        /**
         * 
         * {
  "reportId": 3,
  "reportSection": "reportSection",
  "reportName": "report",
  "parentid": 13,
  "reportTitle": "reportTitle",
  "reportHeader": "Header",
  "reportColumn": "Column",
  "reportHeaderFile": "HeaderFile",
  "reportBodyFile": "BodyFile",
  "reportFolderName": "FolderName",
  "reportFileName": "FileName",
  "reportSpname": "Spname",
  "reportPageOrientation": "PageOrientation",
  "reportPageSize": "PageSize"
}
         */
    
    createForm(): FormGroup {
        return this._formBuilder.group({
            reportId:[0],
            reportSection:[""],
            reportName:[""],
            parentid:[""],
            reportTitle:[""],
            reportHeader:[""],
            reportColumn:[""],
            reportHeaderFile:[""],
            reportBodyFile:[""],
            reportFolderName:[""],
            reportFileName:[""],
            reportSPName:[""],
            reportPageOrientation:[""],
            reportPageSize:[""],
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
     public insertReportConfig(Param: any, showLoader = true) {
        if (Param.reportId) {
            return this._httpClient.PutData("MReportConfig/" + Param.reportId, Param, showLoader);
        } else return this._httpClient.PostData("MReportConfig", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }
}
