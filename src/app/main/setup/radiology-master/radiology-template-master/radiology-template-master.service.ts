import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { gridRequest } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class RadiologyTemplateMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;
  
  constructor(  private _httpClient: ApiCaller,private _formBuilder: FormBuilder) {
    this.myform=this.createRadiologytemplateForm();
    this.myformSearch=this.createSearchForm();
  }
 
  

  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
      templateId:[0],
      templateName:[''],
      templateDesc:[''],
      //IsDeleted:['true']
        });
  }
  createSearchForm(): FormGroup {
    return this._formBuilder.group({
        TemplateNameSearch: [""],
        IsDeletedSearch: ["2"],
    });
}
  // filterForm(): FormGroup {
  //   return this._formBuilder.group({
  //   RegNoSearch:[0],
  //   FirstNameSearch:[''],
  //   LastNameSearch:[''],
  //   PatientTypeSearch:['1'],
  //   StatusSearch: ['0'],
  //   CategoryId:[''],
  //    start: [new Date().toISOString()],
  //    end: [new Date().toISOString()],
  //   });
  // }


  initializeFormGroup() {
    this.createRadiologytemplateForm();
    this.createSearchForm();
  }

  getValidationMessages() {
    return {
        templateName: [
            { name: "required", Message: "Template Name is required" },
            { name: "maxlength", Message: "Template name should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
  }
  
  public templateMasterSave(Param: any, showLoader = true) {
    if (Param.templateId) {
        return this._httpClient.PutData("RadiologyTemplate/" + Param.templateId, Param, showLoader);
    } else return this._httpClient.PostData("RadiologyTemplate", Param, showLoader);
  }
  
//   public deactivateTheStatus(m_data) {
//     return this._httpClient.PostData("RadiologyTemplate", m_data);
//   }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("RadiologyTemplate?Id=" + m_data.toString());
}
  }