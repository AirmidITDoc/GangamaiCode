import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class DietcategoryMasterService {
  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createDietCategoryForm();
    this.myformSearch = this.createSearchForm();
  }

  createDietCategoryForm(): FormGroup {
    return this._formBuilder.group({
      dietCategoryId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      categoryCode: [''],
      categoryName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      description: [""]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      categoryNameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  initializeFormGroup() {
    this.createDietCategoryForm();
  }

  public dietCategorySave(Param: any) {
    if (Param.dietCategoryId) {
      return this._httpClient.PutData("DietCategoryMaster/" + Param.dietCategoryId, Param);
    } else return this._httpClient.PostData("DietCategoryMaster", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("DietCategoryMaster?Id=" + m_data.toString());
  }
}
