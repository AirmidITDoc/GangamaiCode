import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class ConsentMasterService {

  myForm: FormGroup;
      myformSearch: FormGroup;
      constructor(
          private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder,
           private _FormvalidationserviceService: FormvalidationserviceService
      ) {
          this.myForm = this.createConsentForm();
          this.myformSearch = this.createSearchForm();
      }
    
         createConsentForm(): FormGroup {
                 return this._formBuilder.group({
                     consentId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
                     consentName: ["",
                          [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                ] 
                     ],
                     consentDesc: ["",
                          [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ] 
                     ],
                     departmentId: ["",
                         [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
                     ],
                     //isActive:[true,[Validators.required,]]
                 });
             }
           
             createSearchForm(): FormGroup {
                 return this._formBuilder.group({
                     ConsentNameSearch: [""],
                     IsDeletedSearch: ["2"],
                 });
             }
         
             initializeFormGroup() {
                 this.createConsentForm();
             }
         
             public stateMasterSave(Param: any) {
                 if (Param.consentId) {
                     return this._httpClient.PutData("ConsentMaster/" + Param.consentId, Param);
                 } else return this._httpClient.PostData("ConsentMaster", Param);
             }
      public deactivateTheStatus(m_data) {
       return this._httpClient.DeleteData("ConsentMaster?Id=" + m_data.toString());
    }
}
