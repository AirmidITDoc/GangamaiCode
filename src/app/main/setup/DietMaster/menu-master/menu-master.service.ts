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
    // this.myformSearch = this.createSearchForm();
  }


  filterForm(): FormGroup {
    return this._formBuilder.group({
      Fromdate: [(new Date()).toISOString()],
      Todate: [(new Date()).toISOString()]
    });
  }



  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      // dietMenuName: [""],
      Fromdate: [(new Date()).toISOString()],
      Todate: [(new Date()).toISOString()],
      IsDeletedSearch: ["2"],
    });
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
