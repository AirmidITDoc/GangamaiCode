import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class SpecimumMasterService {

  currentStatus = 0
  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) {
    this.myform = this.createSpecmasterForm();
    this.myformSearch = this.createSearchForm();
  }

  createSpecmasterForm(): FormGroup {
    return this._formBuilder.group({
      specimenId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      specimenName: ["",
        [
          Validators.required,
          this._FormvalidationserviceService.allowEmptyStringValidator()
        ]
      ],
      isActive: [true, [Validators.required]]
    });
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      NameSearch: [""],
      IsDeletedSearch: [""],
    });
  }

  initializeFormGroup() {
    this.createSpecmasterForm();
  }

  public specMasterSave(Param: any) {
    if (Param.specimenId) {
      return this._httpClient.PutData("PathSpecimenMaster/" + Param.specimenId, Param);
    } else return this._httpClient.PostData("PathSpecimenMaster", Param);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("PathSpecimenMaster?Id=" + m_data.toString());
  }
}
