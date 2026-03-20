import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class BarcodeConfigService {
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createBankForm();
        this.myformSearch = this.createSearchForm();
        // this.myform=this.createRadiologytemplateForm();
    }

    // createRadiologytemplateForm(): FormGroup {
    //     return this._formBuilder.group({
    //         templateId:[0],
    //         templateName:['',
    //         [
    //         // Validators.required,
    //         // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
    //     ]
    //     ],
    //     templateDesc:['', 
    //         // Validators.required
    //     ],
    //     });
    // }

    createBankForm(): FormGroup {
        return this._formBuilder.group({
            bankId: [0],
            templateid: [""],
            templatename: [""],
            bankName: ["",
                [
                    // Validators.required,
                    // Validators.maxLength(50),
                    // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            isActive: [true,
                // [Validators.required]
            ]
        });
    }
    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            BankNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createBankForm();
    }
    public barcodeConfigSave(Param: any) {
        if (Param.id) {
            return this._httpClient.PutData("BarcodeConfig/" + Param.id, Param);
        } else return this._httpClient.PostData("BarcodeConfig", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("BarcodeConfig?Id=" + m_data.toString());
    }

}