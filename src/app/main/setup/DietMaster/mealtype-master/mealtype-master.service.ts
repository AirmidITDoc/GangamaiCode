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
    // const now = new Date();
    // const currentTime =
    //   `${String(now.getHours()).padStart(2, '0')}:` +
    //   `${String(now.getMinutes()).padStart(2, '0')}`;

    return this._formBuilder.group({
      mealId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      mealTypeCode: ["", [Validators.required]],
      mealName: ["", [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],

      // dispatchTime: [currentTime],
      // preparationStartTime: [currentTime],
      // orderCutoffTime: [currentTime],
      // defaultTime: [currentTime]

      dispatchTime: ["", [Validators.required]],
      preparationStartTime: ["", [Validators.required]],
      orderCutoffTime: ["", [Validators.required]],
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
    } else return this._httpClient.PostData("MealTypeMaster", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("MealTypeMaster?Id=" + m_data.toString());
  }
}
