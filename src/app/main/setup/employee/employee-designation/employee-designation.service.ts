import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
  providedIn: 'root'
})
export class EmployeeDesignationService {

  myform: FormGroup;
  myformSearch: FormGroup;

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.myform = this.createForm();
    this.myformSearch = this.createSearchForm();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      empDesignationId: [0],
      empDesignationName: ["",
        [
          Validators.required, Validators.maxLength(255),
        ]
      ],
      isActive: [true, [Validators.required]]
    });
  }
  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      DoctorTypeSearch: [""],
      IsDeletedSearch: ["2"],
    });
  }

  initializeFormGroup() {
    this.createForm();
  }

  public empDesigSave(Param: any) {
    if (Param.empDesignationId) {
      return this._httpClient.PutData("EmployeeDesignationMaster/" + Param.empDesignationId, Param);
    } else return this._httpClient.PostData("EmployeeDesignationMaster", Param);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("EmployeeDesignationMaster?Id=" + m_data.toString());
  }
}
