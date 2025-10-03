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
  }


  createHospitalForm(): FormGroup {
    return this._formBuilder.group({
      HospitalId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      hospitalHeaderLine: [" "],
      HospitalName: [" ",
        [
          Validators.required
        ]
      ],
      HospitalAddress: ["",
        [
          Validators.required,
        ]
      ],
      City: ["",
        [
          Validators.required
        ]
      ],
      // CityId: [""],
      Pin: ["", Validators.pattern("[0-9]{6}")],
      Phone: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      emailId: ["",[Validators.required]],
      webSiteInfo: ["",[Validators.required]],
      header: [""],//, [Validators.required,this._FormvalidationserviceService.allowEmptyStringValidator()]],
      IsActive: true,

      opdBillingCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      opdReceiptCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      opdRefundBillCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      opdRefundBillReceiptCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      opdAdvanceCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      opdRefundAdvanceCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      ipdAdvanceCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      ipdBillingCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      ipdReceiptCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      ipdRefundOfBillCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      ipdRefundOfBillReceiptCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
      ipdRefundOfAdvanceCounterId: [0, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
    });
  }


  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      NameSearch: [""],
      IsActive: ['1'],
      cityId:[0],
      phoneNo:['']
    });
  }
  public gethospitalById(Id) {
    return this._httpClient.GetData("HospitalMaster/" + Id);
  }

  public HospitalInsert(Param: any) {
    if (Param.HospitalId > 0) {
      return this._httpClient.PutData("HospitalMaster/" + Param.HospitalId, Param);
    } else return this._httpClient.PostData("HospitalMaster", Param);
  }

  public HospitalCancle(Id: any) {
    return this._httpClient.DeleteData(`HospitalMaster?Id=${Id}`);
  }

  populateForm(param) {
    this.HospitalForm.patchValue(param);
  }
}
