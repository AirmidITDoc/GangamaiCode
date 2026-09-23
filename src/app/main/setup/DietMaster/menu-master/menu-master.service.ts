import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class MenuMasterService {
  dietMenuForm: FormGroup;
  myformSearch: FormGroup;
  dietMenuDetailForm: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.dietMenuForm = this.createMenuForm();
    this.dietMenuDetailForm = this.createDietMenuDetailForm();
    // this.myformSearch = this.createSearchForm();
  }


  filterForm(): FormGroup {
    return this._formBuilder.group({
      Fromdate: [(new Date()).toISOString()],
      Todate: [(new Date()).toISOString()]
    });
  }

  createMenuForm(): FormGroup {
    return this._formBuilder.group({
      dietMenuId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      dietMenuName: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      // dietMenuCode: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      mealTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      dietTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      texture: ["", [Validators.pattern(/^[a-zA-Z ]+$/),Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      calories: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      protein: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      foodItemId: [''],
      active: [true, [Validators.required]],

      // mDietMenuDetailMasters: this._formBuilder.array([])
    });
  }

  createDietMenuDetailForm(): FormGroup {
    return this._formBuilder.group({
      menuDetId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      dietMenuId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      foodItemId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      quantity: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      unitId: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      sequenceNo: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
    })
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      // dietMenuName: [""],
      Fromdate: [(new Date()).toISOString()],
      Todate: [(new Date()).toISOString()],
      IsDeletedSearch: ["2"],
    });
  }

  initializeFormGroup() {
    this.createMenuForm();
    this.createDietMenuDetailForm();
  }

  public menuSave(Param: any) {
    if (Param.dietMenuId) {
      return this._httpClient.PutData("DietMenuMaster/" + Param.dietMenuId, Param);
    } else return this._httpClient.PostData("DietMenuMaster/Insert/", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("DietMenuMaster?Id=" + m_data.toString());
  }
}
