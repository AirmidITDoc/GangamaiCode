import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class IcdcodeFormService {

  myCodingForm: FormGroup;

  constructor(
    public _frombuilder: FormBuilder,
    public _httpClient: HttpClient,
        public loaderService:LoaderService
  ) { 
    this.myCodingForm = this.CreateMyGroupform();
  }
  CreateMyGroupform() {
    return this._frombuilder.group({
      ICDCode:[''],
      MainName: [''],
      ICDDescription: [''],
      IsDeleted: [true],
      ICDCodeNameSearch:[''],
    })
  }
}
