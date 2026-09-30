import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class MealtypeMasterService {
  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createMealTypeForm();
    this.myformSearch = this.createSearchForm();
  }

  createMealTypeForm(): FormGroup {

    return this._formBuilder.group({
      mealId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      mealName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      dispatchTime:"00:00",
      preparationStartTime: "00:00",
      orderCutoffTime: "00:00",
      defaultTime: ["", [Validators.required]]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      mealNameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  initializeFormGroup() {
    this.createMealTypeForm();
  }

  public mealTypeSave(Param: any) {
    if (Param.mealId) {
      return this._httpClient.PutData("MealTypeMaster/" + Param.mealId, Param);
    } else return this._httpClient.PostData("MealTypeMaster/Insert", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("MealTypeMaster?Id=" + m_data.toString());
  }
}
