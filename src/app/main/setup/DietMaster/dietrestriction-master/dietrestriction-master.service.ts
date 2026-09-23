import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class DietrestrictionMasterService {
  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createRestrictionForm();
    this.myformSearch = this.createSearchForm();
  }

  createRestrictionForm(): FormGroup {
    return this._formBuilder.group({
      restrictionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      restrictionName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      // restrictionCode: [''],
      restrictionTypeId: [0, [Validators.required]],
      description: [""]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      restrictionNameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  initializeFormGroup() {
    this.createRestrictionForm();
  }

  public DietRestrictionSave(Param: any) {
    if (Param.restrictionId) {
      return this._httpClient.PutData("DietRestriction/Edit/" + Param.restrictionId, Param);
    } else return this._httpClient.PostData("DietRestriction/Insert", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("DietRestriction?Id=" + m_data.toString());
  }
}
