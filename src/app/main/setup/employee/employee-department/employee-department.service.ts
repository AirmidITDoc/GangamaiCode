import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
  providedIn: 'root'
})
export class EmployeeDepartmentService {

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
      empDepartmentId: [0],
      empDepartmentName: ["",
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

  public empDepSave(Param: any) {
    if (Param.empDepartmentId) {
      return this._httpClient.PutData("EmployeeDepartmentMaster/" + Param.empDepartmentId, Param);
    } else return this._httpClient.PostData("EmployeeDepartmentMaster", Param);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("EmployeeDepartmentMaster?Id=" + m_data.toString());
  }
}
