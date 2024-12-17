import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class VendorListService {
  myform:FormGroup;
  SearchForm:FormGroup;

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient,
    public _loaderService:LoaderService
  ) { 
    this.myform = this.Createmyform();
    this.SearchForm = this.CreateSearchForm();
   }

  CreateSearchForm(){
    return this._formbuilder.group({
      VendorName:[''],
    })
  }

  Createmyform(){
    return this._formbuilder.group({
      VendorName:['',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ]
      ],
      Address:['',
        [
          Validators.required
        ]
      ],
      MobileNo:[''],
      PersonName:['',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ]
      ],
      PersonMobileNo:['', 
                        [ 
                          Validators.required,
                          Validators.pattern("^[0-9]{10}$"),
                        ]
                    ],
      PinCode:[''],
      Date:[new Date()],

    })
   }

   public getVenderList(param, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_VendorInformation_List",param);
  }
}
