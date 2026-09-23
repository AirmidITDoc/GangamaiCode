import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class FoodpreferenceMasterService {

  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createFoodPreferenceForm();
    this.myformSearch = this.createSearchForm();
  }

  createFoodPreferenceForm(): FormGroup {
    return this._formBuilder.group({
      foodPreferenceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      foodPreferenceName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      foodPreferenceCode: [""],
      // active: [[Validators.required]]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      foodPreferenceNameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  initializeFormGroup() {
    this.createFoodPreferenceForm();
  }

  public FoodPreferenceSave(Param: any) {
    if (Param.foodPreferenceId) {
      return this._httpClient.PutData("FoodPreference/Edit/" + Param.foodPreferenceId, Param);
    } else return this._httpClient.PostData("FoodPreference/Insert", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("FoodPreference?Id=" + m_data.toString());
  }
}
