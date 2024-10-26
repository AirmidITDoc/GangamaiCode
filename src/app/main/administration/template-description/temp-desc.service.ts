import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TempDescService {
  myform: FormGroup;
  constructor( public _formBuilder: FormBuilder,
    public _httpClient: HttpClient) {
      this.myform = this.createtempForm();
     }

    createtempForm(): FormGroup {
      return this._formBuilder.group({
        TempId:'',
        TemplateName:'',
        Tempdesc: [""],
        IsActive: ["1"],
      });
  }

  
public templateInsert(param) {
  return this._httpClient.post("Administration/NewTemplatedesc", param);
}

public TemplateUpdate(param) {
  return this._httpClient.post("Administration/UpdateTemplatedesc", param);
}

public getTemplateList() {
      
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ReportTemplateConfig", {})
}
populateForm(param) {
  this.myform.patchValue(param);
}

public deactivateTheStatus(m_data) {
  return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}

}
