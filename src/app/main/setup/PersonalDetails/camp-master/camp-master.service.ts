import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class CampMasterService {

 campform: FormGroup;
     myformSearch: FormGroup;
     constructor(
         private _httpClient: ApiCaller,
         private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
     ) {
         this.campform = this.createCampForm();
         this.myformSearch = this.createSearchForm();
     }
 
     createCampForm(): FormGroup {
         return this._formBuilder.group({
             campId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
             campName: ["",
                 [
                     Validators.required,
                     Validators.pattern('^[a-zA-Z0-9 ]*$'),
                     this._FormvalidationserviceService.allowEmptyStringValidator()
                 ] 
             ],
             campLocation: ["", 
                 [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]
             ],
           //  isActive:[true,[Validators.required]]
         });
     }
     createSearchForm(): FormGroup {
         return this._formBuilder.group({
             CampNameSearch: [""],
             IsDeletedSearch: [""],
         });
     }
 
     initializeFormGroup() {
         this.createCampForm();
     }
 
    
 
     public campMasterSave(Param: any) {
         if (Param.campId) {
             return this._httpClient.PutData("CampMaster/" + Param.campId, Param);
         } else return this._httpClient.PostData("CampMaster", Param);
     }

 
     public deactivateTheStatus(m_data) {
         return this._httpClient.DeleteData("CampMaster?Id=" + m_data.toString());
     }
}
