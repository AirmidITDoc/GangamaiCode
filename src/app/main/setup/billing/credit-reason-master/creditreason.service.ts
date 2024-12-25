import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CreditreasonService {
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
      private _httpClient: ApiCaller,
      private _formBuilder: FormBuilder
  ) {
      this.myform = this.createCreditreasonForm();
      this.myformSearch = this.createSearchForm();
  }
  
  createCreditreasonForm(): FormGroup {
      return this._formBuilder.group({
        creditId: [""],
        creditReason: ["", 
            [
                Validators.required,Validators.maxLength(50),
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
            ]
        ],
        //   isActive: ["true"],
        //   AddedBy: ["0"],
        //   UpdatedBy: ["0"],
        //   AddedByName: [""],
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