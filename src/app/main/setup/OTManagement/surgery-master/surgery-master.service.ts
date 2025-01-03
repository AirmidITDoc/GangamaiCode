import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SurgeryMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myform=this.createSurgeryForm();
    this.myformSearch=this.createSearchForm();
  }

  createSurgeryForm(): FormGroup {
    return this._formBuilder.group({
      SurgeryId:[''],
      Site:[''],
      ProcedureName:[''],
      CategoryName:[''],
      SystemName:[''],
      TemplateName:[''],
      DepartmentName:[''],
      Amount:[''],
      Departmentid:[''],
      Systemid:[''],
      Siteid:[''],
      IsDeleted:['true']
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      SurgeryNameSearch: [""],
    });
}

   //Deartment Combobox List
   public getDepartmentCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
}

}
