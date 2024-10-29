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
      TemplateId:[''],
      TemplateName:[''],
      TemplateDesc:[''],
      IsDeleted:['true']
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

 
  public gettemplateMasterList(param: gridRequest, showLoader = true) {
    return this._httpClient.PostData("RadiologyTemplate/List", param, showLoader);
}

public templateMasterSave(Param: any, id: string ,showLoader = true) {
    if(id)
        return this._httpClient.PutData("template/"+ id, Param, showLoader);
    else
        return this._httpClient.PostData("template", Param, showLoader);       
}

public deactivateTheStatus(m_data) {
    return this._httpClient.PostData("template", m_data);
}
  populateForm(employee) {
    this.myform.patchValue(employee);
  }

  populatePrintForm(employee) {
    this.myform.patchValue(employee);
  }

 
}
