import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class TemplateServieService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder
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
      templateId: [0],
      templateName: [""], 
      templateDesc:[""],
      templateDescInHtml:[""],
  });
}

public templateMasterSave(Param: any) {
  debugger
  if (Param.templateId) {
      return this._httpClient.PutData("PathologyTemplate/" + Param.templateId, Param);
  } else return this._httpClient.PostData("PathologyTemplate", Param);
}

public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("PathologyTemplate?Id=" + m_data.toString());
}
}

