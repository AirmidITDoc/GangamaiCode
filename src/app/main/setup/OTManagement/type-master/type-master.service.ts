import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class TypeMasterService {
myForm: FormGroup;
  myformSearch: FormGroup;
  constructor(
      private _httpClient: ApiCaller,
      private _formBuilder: UntypedFormBuilder
  ) {
      this.myForm = this.createTypeForm();
      this.myformSearch = this.createSearchForm();
  }

     createTypeForm(): FormGroup {
             return this._formBuilder.group({
                 OttypeId: [0],
                 typeName: ["",
                      [
                    Validators.required,
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ] 
                 ],
                talukaName: [""],
                isActive:[true,[Validators.required]]
             });
         }
       
         createSearchForm(): FormGroup {
             return this._formBuilder.group({
                 typeNameSearch: [""],
                 IsDeletedSearch: ["2"],
             });
         }
     
         initializeFormGroup() {
             this.createTypeForm();
         }
     
         public stateMasterSave(Param: any) {
             if (Param.OttypeId) {
                 return this._httpClient.PutData("OtTypeMaster/" + Param.OttypeId, Param);
             } else return this._httpClient.PostData("OtTypeMaster", Param);
         }
  public deactivateTheStatus(m_data) {
   return this._httpClient.DeleteData("OtTypeMaster?Id=" + m_data.toString());
}
}
