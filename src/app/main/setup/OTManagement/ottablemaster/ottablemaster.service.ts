import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class OttablemasterService {
    myForm: FormGroup;
      myformSearch: FormGroup;
      constructor(
          private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder,
          private _FormvalidationserviceService: FormvalidationserviceService
      ) {
          this.myForm = this.createTableForm();
          this.myformSearch = this.createSearchForm();
      }
   createTableForm(): FormGroup {
         return this._formBuilder.group({
             ottableId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
             ottableName: ["",
                 [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                ] 
             ],
             locationId: ["",
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
             ],
             isActive:[true,[Validators.required]]
         });
     }
   

     
     createSearchForm(): FormGroup {
         return this._formBuilder.group({
             ottableNameSearch: [""],
             IsDeletedSearch: ["2"],
         });
     }
 
     initializeFormGroup() {
         this.createTableForm();
     }
 
     public stateMasterSave(Param: any) {
         if (Param.ottableId) {
             return this._httpClient.PutData("OtTableMaster/" + Param.ottableId, Param);
         } else return this._httpClient.PostData("OtTableMaster", Param);
     }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("OtTableMaster?Id=" + m_data.toString());
}
}