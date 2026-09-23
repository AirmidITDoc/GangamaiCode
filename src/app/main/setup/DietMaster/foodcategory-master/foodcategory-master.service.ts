import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class FoodcategoryMasterService {

  myForm: FormGroup;
    myformSearch: FormGroup;
    constructor(
      private _httpClient: ApiCaller,
      private _formBuilder: UntypedFormBuilder,
      private _FormvalidationserviceService: FormvalidationserviceService
    ) {
      this.myForm = this.createFoodCategoryForm();
      this.myformSearch = this.createSearchForm();
    }
  
    createFoodCategoryForm(): FormGroup {
      return this._formBuilder.group({
        foodCategoryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        // foodCategoryCode: ["", [Validators.required]],
        foodCategoryName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]]
      });
    }
  
    createSearchForm(): FormGroup {
      return this._formBuilder.group({
        foodCategoryNameSearch: [""],
        IsDeletedSearch: [""],
      });
    }
  
    initializeFormGroup() {
      this.createFoodCategoryForm();
    }
  
    public foodCategorySave(Param: any) {
      if (Param.foodCategoryId) {
        return this._httpClient.PutData("FoodCategoryMaster/Edit/" + Param.foodCategoryId, Param);
      } else return this._httpClient.PostData("FoodCategoryMaster/Insert", Param);
    }
    public deactivateTheStatus(m_data) {
      return this._httpClient.DeleteData("FoodCategoryMaster?Id=" + m_data.toString());
    }
}
