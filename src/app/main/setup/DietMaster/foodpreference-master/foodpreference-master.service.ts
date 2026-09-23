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
      foodPreferenceName: ["", [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      foodPreferenceCode: ["", [Validators.required]],
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
      console.log("Update Form Value (Param)", Param)
      return this._httpClient.PutData("FoodPreference/" + Param.foodPreferenceId, Param);
    } else return this._httpClient.PostData("FoodPreference", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("FoodPreference?Id=" + m_data.toString());
  }
}
