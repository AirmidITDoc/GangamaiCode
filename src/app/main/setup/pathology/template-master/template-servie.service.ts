import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateServieService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
     private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myformSearch = this.createSearchForm();
    // this.myform = this.createTemplateForm();
   }

   createSearchForm():FormGroup{
    return this._formBuilder.group({
      TemplateNameSearch: ["",
         [ Validators.required,
         Validators.pattern('^[a-zA-Z0-9 ]*$')],
           this._FormvalidationserviceService.allowEmptyStringValidator()
      ],
        IsDeletedSearch: [""],
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

