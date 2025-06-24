import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class SurgeryMasterService {

  myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
      private _httpClient: ApiCaller,
      private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
  ) {
      this.myForm = this.createSurgeryForm();
      this.myformSearch = this.createSearchForm();
  }

    createSurgeryForm(): FormGroup {
           return this._formBuilder.group({
               SurgeryId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
               SurgeryName: ["",
                  [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                ] 
               ],
               surgeryCategoryId: [0],
                departmentId: [0],
                surgeryAmount: [0],
                 ottemplateId: [0],
                 siteDescId:[0],
               //isActive:[true,[Validators.required]]
           });
       }
     
       createSearchForm(): FormGroup {
           return this._formBuilder.group({
               SurgeryNameSearch: [""],
               IsDeletedSearch: ["2"],
           });
       }
   
       initializeFormGroup() {
           this.createSurgeryForm();
       }
   
       public stateMasterSave(Param: any) {
           if (Param.surgeryId) {
               return this._httpClient.PutData("SurgeryMaster/" + Param.surgeryId, Param);
           } else return this._httpClient.PostData("SurgeryMaster", Param);
       }
  public deactivateTheStatus(m_data) {
   return this._httpClient.DeleteData("SurgeryMaster?Id=" + m_data.toString());
}
}
