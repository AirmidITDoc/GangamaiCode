import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class SubtpaCompanyMasterService {
    myform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myform = this.createsubtpacompanyForm();
        this.myformSearch = this.createSearchForm();
    }
    createsubtpacompanyForm(): FormGroup {
        return this._formBuilder.group({
           
            subCompanyId: [0],
            compTypeId: ["",
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            ],
            companyName: ["",
                [
                    Validators.required, Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            address: ["", 
                Validators.required,Validators.maxLength(100),
                //Validators.pattern("^[a-zA-Z0-9\s,.'-]+$")
                Validators.pattern('^[a-zA-Z0-9 ]*$')
            ],
            city: [
                "",
                [
                    Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ],
            ],
            pinNo: ["", 
                [
                    Validators.required,Validators.maxLength(10),
                    Validators.pattern("^[0-9\s\-]{3,10}$")
                ]
            ],
            phoneNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.maxLength(10),
                ],
            ],
            mobileNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.maxLength(10),
                ],
            ],
            faxNo: ["0"],
            isActive:[true,[Validators.required]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CompanyNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    initializeFormGroup() {
        this.createsubtpacompanyForm();
    }

    public subTpaCompanyMasterInsert(Param: any) {
        if (Param.subCompanyId) {
            return this._httpClient.PutData("SubTpaCompany/" + Param.subCompanyId, Param);
        } else return this._httpClient.PostData("SubTpaCompany", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("SubTpaCompany?Id=" + m_data.toString());
    }

    getCompanyById(subCompanyId: any) {
        return this._httpClient.GetData("SubTpaCompany/" + subCompanyId);
    }
}
