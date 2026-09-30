import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class DiettypeMasterService {
  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myForm = this.createDietTypeForm();
    this.myformSearch = this.createSearchForm();
  }

  createDietTypeForm(): FormGroup {
    return this._formBuilder.group({
      dietTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      dietName: ["", [Validators.pattern(/^[^0-9]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      shortName: ["",[Validators.pattern(/^[^0-9]+$/)]],
      dietCategoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      defaultCalories: [0,[Validators.pattern(/^[0-9]+$/)]],
      defaultProtein: [0, [Validators.pattern(/^[0-9]+$/)]],
      defaultFluid: [0, [Validators.pattern(/^[0-9]+$/)]],
      remarks: [""],
      description: [""]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      dietNameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  initializeFormGroup() {
    this.createDietTypeForm();
  }

  public dietTypeSave(Param: any) {
    if (Param.dietTypeId) {
      return this._httpClient.PutData("DietTypeMaster/" + Param.dietTypeId, Param);
    } else return this._httpClient.PostData("DietTypeMaster", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("DietTypeMaster?Id=" + m_data.toString());
  }
}
