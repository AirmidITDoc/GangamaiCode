import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class SubspecialityMasterService {

      //   "subSpecialtyId": 0,
  // "specialtyId": 0,
  // "subSpecialtyName": "mkoi"
      myForm: FormGroup;
      myformSearch: FormGroup;
      constructor(
          private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder,
          private _FormvalidationserviceService: FormvalidationserviceService
      ) {
          this.myForm = this.createSubSpecialityForm();
          this.myformSearch = this.createSearchForm();
      }
  
      createSubSpecialityForm(): FormGroup {
          return this._formBuilder.group({
              subSpecialtyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
              subSpecialtyName: ["",
                  [
                      Validators.required,
                      // Validators.pattern('^[a-zA-Z0-9 ]*$'),
                      this._FormvalidationserviceService.allowEmptyStringValidator()
                  ]
              ],
              specialtyId: ["",
                  [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]
              ]  
          });  
      }
  
      createSearchForm(): FormGroup {
          return this._formBuilder.group({
              subSpecialtyName: [""],
              IsDeletedSearch: ["2"],
          });
      }
  
      initializeFormGroup() {
          this.createSubSpecialityForm();
      }
  
      public subSpecialitySave(Param: any) {
        console.log("param",Param)
          if (Param.subSpecialtyId) {
              return this._httpClient.PutData("SubSpecialtyMaster/" + Param.subSpecialtyId, Param);
          } else return this._httpClient.PostData("SubSpecialtyMaster", Param);
      }
      public deactivateTheStatus(m_data) {
          debugger
          return this._httpClient.DeleteData("SubSpecialtyMaster?Id=" + m_data.toString());
      }
}
