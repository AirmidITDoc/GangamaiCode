import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class AllergyMasterService {

  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createAllergyForm();
    this.myformSearch = this.createSearchForm();
  }

  createAllergyForm(): FormGroup {
    return this._formBuilder.group({
      allergyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      allergyCode: [""],
      allergyName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      categoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      severityId: [0, [Validators.required]],
      reaction: [""],
      isKitchenAlert: [true],
      // active: [[Validators.required]]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      allergyNameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  initializeFormGroup() {
    this.createAllergyForm();
  }

  public allergySave(Param: any) {
    if (Param.allergyId) {
      return this._httpClient.PutData("Allergy/Edit/" + Param.allergyId, Param);
    } else return this._httpClient.PostData("Allergy/Insert", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("Allergy?Id=" + m_data.toString());
  }
}
