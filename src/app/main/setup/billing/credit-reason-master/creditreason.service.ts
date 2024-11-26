import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
        creditReason: [""],
          isDeleted: ["false"],
          AddedBy: ["0"],
          UpdatedBy: ["0"],
          AddedByName: [""],
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
  getValidationMessages() {
      return {
        creditReason: [
              { name: "required", Message: "Credit Reason is required" },
              { name: "maxlength", Message: "Credit Reason should not be greater than 50 char." },
              { name: "pattern", Message: "Special char not allowed." }
          ]
      };
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