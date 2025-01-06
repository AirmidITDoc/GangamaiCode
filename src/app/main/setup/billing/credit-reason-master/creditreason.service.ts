import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CreditreasonService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
      private _httpClient: ApiCaller,
      private _formBuilder: UntypedFormBuilder
  ) {
      this.myform = this.createCreditreasonForm();
      this.myformSearch = this.createSearchForm();
  }
  
  createCreditreasonForm(): FormGroup {
      return this._formBuilder.group({
        creditId: [0],
        creditReason: ["", 
            [
                Validators.required,Validators.maxLength(50),
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            ]
        ],
      });
  }
  createSearchForm(): FormGroup {
      return this._formBuilder.group({
          CreditReasonSearch: [""],
          IsDeletedSearch: ["2"],
      });
  }

  initializeFormGroup() {
      this.createCreditreasonForm();
  }
  
  public creditreasonMasterSave(Param: any, showLoader = true) {
      if (Param.creditId) {
          return this._httpClient.PutData("CreditReasonMaster/" + Param.creditId, Param, showLoader);
      } else return this._httpClient.PostData("CreditReasonMaster", Param, showLoader);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("CreditReasonMaster?Id=" + m_data.toString());
}
}