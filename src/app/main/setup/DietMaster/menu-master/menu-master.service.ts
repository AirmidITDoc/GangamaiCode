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
    private _formBuilder: UntypedFormBuilder
  ) {
    this.myformSearch = this.filterForm();
  }


  filterForm(): FormGroup {
    return this._formBuilder.group({
      DietName: '',
      MealName: "",
      DietMenuName: "",
    });
  }


  public menuSave(Param: any) {
    if (Param.dietmenumaster.dietMenuId) {
      return this._httpClient.PutData("DietMenuMaster/Edit/" + Param.dietmenumaster.dietMenuId, Param);
    } else return this._httpClient.PostData("DietMenuMaster/Insert", Param);
  }
  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("DietMenuMaster?Id=" + m_data.toString());
  }
  public getMenuDetList(param) {
    return this._httpClient.PostData("DietMenuMaster/DietmenumasterDetailsList", param);
  }
}
