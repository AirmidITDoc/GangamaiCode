import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class ConsentMasterService {

  myForm: FormGroup;
      myformSearch: FormGroup;
      constructor(
          private _httpClient: ApiCaller,
          private _formBuilder: UntypedFormBuilder
      ) {
          this.myForm = this.createVillageForm();
          this.myformSearch = this.createSearchForm();
      }
    
         createVillageForm(): FormGroup {
                 return this._formBuilder.group({
                     villageId: [0],
                     villageName: [""],
                     talukaName: [""],
                     isActive:[true,[Validators.required]]
                 });
             }
           
             createSearchForm(): FormGroup {
                 return this._formBuilder.group({
                     VillageNameSearch: [""],
                     IsDeletedSearch: ["2"],
                 });
             }
         
             initializeFormGroup() {
                 this.createVillageForm();
             }
         
             public stateMasterSave(Param: any) {
                 if (Param.villageId) {
                     return this._httpClient.PutData("VillageMaster/" + Param.villageId, Param);
                 } else return this._httpClient.PostData("VillageMaster", Param);
             }
      public deactivateTheStatus(m_data) {
       return this._httpClient.DeleteData("VillageMaster?Id=" + m_data.toString());
    }
}
