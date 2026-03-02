import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class OtConsentsService {

  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createConsentForm();
    this.myformSearch = this.createSearchForm();
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      ConsentNameSearch: [""],
      IsDeletedSearch: ["2"],
    });
  }

  createConsentForm(): FormGroup {
    return this._formBuilder.group({
      consentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      consentName: ["",
        [
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9 ]*$'),
          this._FormvalidationserviceService.allowEmptyStringValidator()
        ]
      ],
      consentDesc: ["", [Validators.required]
      ],
      departmentId: ["",
        [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
      ],
    });
  }

   public getReportView(Param) {
         return this._httpClient.PostData("Report/ViewReportFromDB", Param);
    }
}
