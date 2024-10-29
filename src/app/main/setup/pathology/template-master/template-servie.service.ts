import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { gridRequest } from 'app/core/models/gridRequest';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class TemplateServieService {
  myform: FormGroup;
  
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: FormBuilder
  ) {
    this.myformSearch = this.createSearchForm();
    this.myform = this.createTemplateForm();
   }

   createSearchForm():FormGroup{
    return this._formBuilder.group({
      TemplateNameSearch: [""],
        IsDeletedSearch: ["2"],
    });
}


createTemplateForm(): FormGroup {
  return this._formBuilder.group({
      PTemplateId: [""],
      TestId: [""], 
      TemplateId:[""],
      TemplateName:[""],
      TemplateDesc:[""],
      IsDeleted:['true']
  });
}


public gettemplateMasterList(param: gridRequest, showLoader = true) {
  return this._httpClient.PostData("PathologyTemplate/List", param, showLoader);
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

//Edit pop data
populateForm(param) {
    this.myform.patchValue(param);
}

populatePrintForm(param) {
    this.myform.patchValue(param);
}
}
