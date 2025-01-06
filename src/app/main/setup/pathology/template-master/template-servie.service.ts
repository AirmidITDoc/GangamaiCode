import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class TemplateServieService {
  myform: UntypedFormGroup;
  myformSearch: UntypedFormGroup;

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.myformSearch = this.createSearchForm();
    this.myform = this.createTemplateForm();
   }

   createSearchForm():UntypedFormGroup{
    return this._formBuilder.group({
      TemplateNameSearch: [""],
        IsDeletedSearch: ["2"],
    });
}

createTemplateForm(): UntypedFormGroup {
  return this._formBuilder.group({
      templateId: [0],
      templateName: [""], 
      templateDesc:[""],
      templateDescInHtml:[""],
  });
}

public templateMasterSave(Param: any, showLoader = true) {
  if (Param.templateId) {
      return this._httpClient.PutData("PathologyTemplate/" + Param.templateId, Param, showLoader);
  } else return this._httpClient.PostData("PathologyTemplate", Param, showLoader);
}

public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("PathologyTemplate?Id=" + m_data.toString());
}
}

