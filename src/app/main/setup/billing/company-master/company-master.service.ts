import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: "root",
})
export class CompanyMasterService {
  
    companyForm: FormGroup;
    myformSearch: FormGroup;
    
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
         private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.companyForm = this.createCompanymasterForm();
        this.myformSearch = this.createSearchForm();
    }

    createCompanymasterForm(): FormGroup {
        return this._formBuilder.group({
            companyId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            companyName: ["",
                [
                    Validators.required, 
                    Validators.maxLength(50),
                   // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            compTypeId: ["",
                [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            ],
            address: ["",
                 Validators.required,
                 Validators.maxLength(100),
               //  Validators.pattern("^[a-zA-Z0-9\s,.'-]+$")
                 Validators.pattern('^[a-zA-Z0-9 ]*$')
            ],
            city: ["",
                [
                    Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ],
            ],
            pinNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                            Validators.minLength(6),
                            Validators.maxLength(6),]],
            phoneNo: ["",
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
            traiffId: ["",
                [
                    Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            isActive:[true,[Validators.required]]
        });
    }

    createCompanymasterFormDemo(): FormGroup {
        return this._formBuilder.group({
            companyId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],

            companyName: ['', [Validators.required, Validators.maxLength(50),Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()]],

            shortName: ['', [Validators.required, Validators.maxLength(50),Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()]],

            address: ['', [Validators.maxLength(100),this._FormvalidationserviceService.allowEmptyStringValidator()]],

            city: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            state: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            country: [0, [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            contactPerson: ['', [Validators.maxLength(50),Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()]],

            designation: ['', [Validators.maxLength(50),Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()]],

            phoneNo: ["",[Validators.required, Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.maxLength(10)]],

            landlineNumber: ["",[Validators.required, Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.maxLength(10)]],

            email: ['', [Validators.email]],
            website: [''],
            loginUser: [''],
            loginPassword: [''],
            companyType: ['', Validators.required],
            isSubCompany: [false],
            paymentMode: [''],
            creditDays: [0],
            panNo: [''],
            tanNo: [''],
            gstin: [''],
            // billReportFormat: [''],
            adminCharges: [0],
            isActive: [true],
            pinNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
                            Validators.minLength(6),
                            Validators.maxLength(6),]],
            faxNo: ["0"],
            traiffId: ["",[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            CompanyNameSearch: [""],
            IsDeletedSearch: [""],
        });
    }

    initializeFormGroup() {
        this.createCompanymasterForm();
    }
    
    public companyMasterSave(Param: any) {
        if (Param.companyId) {
            return this._httpClient.PutData("CompanyMaster/" + Param.companyId, Param);
        } else return this._httpClient.PostData("CompanyMaster", Param);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("CompanyMaster?Id=" + m_data.toString());
    }

    getCompanyById(companyId: any) {
        return this._httpClient.GetData("CompanyMaster/" + companyId);
    }
     public getstateId(Id) {
        return this._httpClient.GetData("StateMaster/" + Id);
    }
}
