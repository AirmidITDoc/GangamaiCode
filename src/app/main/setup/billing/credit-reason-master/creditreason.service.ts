import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
                //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                Validators.pattern('^[a-zA-Z0-9 ]*$')
            ]
        ],
        isActive:[true,[Validators.required]]
      });
  }
  createSearchForm(): FormGroup {
      return this._formBuilder.group({
          CreditReasonSearch: [""],
          IsDeletedSearch: [""],
      });
  }

  initializeFormGroup() {
      this.createCreditreasonForm();
  }
  
  public creditreasonMasterSave(Param: any) {
      if (Param.creditId) {
          return this._httpClient.PutData("CreditReasonMaster/" + Param.creditId, Param);
      } else return this._httpClient.PostData("CreditReasonMaster", Param);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("CreditReasonMaster?Id=" + m_data.toString());
}
}