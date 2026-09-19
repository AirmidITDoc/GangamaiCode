import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class FoodItemmasterService {
  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createFoodItemForm();
    this.myformSearch = this.createSearchForm();
  }

  createFoodItemForm(): FormGroup {
    return this._formBuilder.group({
      foodItemId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      foodName: ["", [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      foodCode: [0, [Validators.required]],
      foodCategoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      localName: ["", [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      unit: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // ServingSize: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      isVegetarian: ["", [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      active: [[Validators.required]]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      foodName: [""],
      IsDeletedSearch: ["2"],
    });
  }

  initializeFormGroup() {
    this.createFoodItemForm();
  }

  public foodItemSave(Param: any) {
    if (Param.foodItemId) {
      console.log("Update Form Value (Param)", Param)
      return this._httpClient.PutData("FoodItemMaster/" + Param.foodItemId, Param);
    } else return this._httpClient.PostData("FoodItemMaster", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("FoodItemMaster?Id=" + m_data.toString());
  }
}
