import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class CategoryMasterService {


     myForm: FormGroup;
       myformSearch: FormGroup;
       constructor(
           private _httpClient: ApiCaller,
           private _formBuilder: UntypedFormBuilder
       ) {
           this.myForm = this.createCategoryForm();
           this.myformSearch = this.createSearchForm();
       }

         createCategoryForm(): FormGroup {
                return this._formBuilder.group({
                    SurgeryCategoryId: [0],
                    SurgeryCategoryName: ["",
                        [ Validators.required,
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                   ]
                    ],
                    talukaName: [""],
                    isActive:[true,[Validators.required]]
                });
            }
          
            createSearchForm(): FormGroup {
                return this._formBuilder.group({
                    SurgeryCategorySearch: [""],
                    IsDeletedSearch: ["2"],
                });
            }
        
            initializeFormGroup() {
                this.createCategoryForm();
            }
        
            public stateMasterSave(Param: any) {
                if (Param.SurgeryCategoryId) {
                    return this._httpClient.PutData("SurgeryCategoryMaster/" + Param.SurgeryCategoryId, Param);
                } else return this._httpClient.PostData("SurgeryCategoryMaster", Param);
            }
       public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SurgeryCategoryMaster?Id=" + m_data.toString());
}
}
