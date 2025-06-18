import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class HospitalService {
  HospitalForm: FormGroup;
  myformSearch: FormGroup;
  constructor(private _httpClient: ApiCaller, private _FormvalidationserviceService: FormvalidationserviceService,
    private _formBuilder: UntypedFormBuilder) {
    // this.HospitalForm = this.createHospitalForm();
    // this.myformSearch = this.createSearchForm();
  }


  createHospitalForm(): FormGroup {
    return this._formBuilder.group({
      HospitalId: [""],
      HospitalName: ["",
                [
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
      HospitalAddress:["",
                [
                    Validators.required,
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
      City:["",
                      [
                          Validators.required,
                          Validators.pattern('^[a-zA-Z0-9 ]*$')
                      ]
                  ],
      // CityId: [""],
      Pin: ["", Validators.pattern("[0-9]{7}")],
      Phone:['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
            this._FormvalidationserviceService.onlyNumberValidator()
            ]],
      Email: [""],
      website: [""],
    
      // HospitalHeader: [""]
      header:[""],
      IsActive:1
    });
  }


  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      NameSearch: [""],
      IsDeletedSearch: ["1"],
    });
  }

   
    public HospitalInsert(Param: any) {
        if (Param.hospitalId) {
            return this._httpClient.PostData("HospitalMaster/", Param);
        } else return this._httpClient.PostData("ospitalMaster", Param);
    }

      public HospitalCancle(Id: any) {

        return this._httpClient.DeleteData(`Supplier/SupplierDelete?Id=${Id}`);
    }
 
  populateForm(param) {
    this.HospitalForm.patchValue(param);
  }
}
