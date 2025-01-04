import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CertificatemasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myform=this.createCertificatetemplateForm();
    this.myformSearch=this.createSearchForm();
  }

  createCertificatetemplateForm(): FormGroup {
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
    });
}

public getCertificatelist(employee) {
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CertificateMaster_List",employee)
}
public CertificateInsert(employee)
{    
  return this._httpClient.post("Prescription/SaveCertificateMaster",employee);
}
public CertificateUpdate(employee)
{    
  return this._httpClient.post("Prescription/UpdateCertificateMaster",employee);
}
public deactivateTheStatus(m_data) {
  return this._httpClient.post(
      "Generic/ExecByQueryStatement?query=" + m_data,{}
  );
}
}
