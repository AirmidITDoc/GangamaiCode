import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CategoryMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(private _httpClient: HttpClient, private _formBuilder: FormBuilder) {
    this.myform = this.createCategoryForm();
    this.myformSearch = this.createSearchForm();
  }

  createCategoryForm(): FormGroup {
    return this._formBuilder.group({
      CategoryId: [''],
      CategoryName: [''],
      IsDeleted: [true]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      CategoryNameSearch: [""],
    });
  }
  public getSurgeryCategoryListlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_otSurgeryCategoryMasterList", employee)
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.post(
        "Generic/ExecByQueryStatement?query=" + m_data,{}
    );
  }

  public SurgeryCategoryCancle(employee)
{
  return this._httpClient.post("OT/CancelMOTSurgeryCategoryMaster", employee);
}
public SurgeryCategoryInsert(employee)
{    
  return this._httpClient.post("OT/SaveMOTSurgeryCategoryMaster",employee);
}
public SurgeryCategoryUpdate(employee)
{    
  return this._httpClient.post("OT/UpdateMOTSurgeryCategoryMaster",employee);
}

}
