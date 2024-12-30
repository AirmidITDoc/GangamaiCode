import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CategoryMasterService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(private _httpClient: HttpClient,private _formBuilder: FormBuilder) {
    this.myform=this.createCategoryForm();
    this.myformSearch=this.createSearchForm();
  }

  createCategoryForm(): FormGroup {
    return this._formBuilder.group({
      CategoryId:[''],
      CategoryName:[''],
      IsDeleted:['true']
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      CategoryNameSearch: [""],
    });
}

}
