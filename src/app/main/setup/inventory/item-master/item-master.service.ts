import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})

export class ItemMasterService {

    itemForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.itemForm = this.createItemmasterForm();
        // this.myformSearch = this.createSearchForm();
    }


    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemNameSearch: [""],
            ToStoreId: this._loggedService.currentUserValue.user.storeId,
            CatId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            GenericId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ProdLocation: ['', [this._FormvalidationserviceService.onlyNumberValidator()]],
            ManufId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            DrugTypeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }

    createItemmasterForm(): FormGroup {
        return this._formBuilder.group({
            itemID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemShortName: ["",
                [
                    Validators.required,
                    Validators.maxLength(150),
                    // Validators.pattern('^[a-zA-Z0-9 ]*$'),
                    this._FormvalidationserviceService.allowEmptyStringValidator()
                ]
            ],
            itemName: ["",
                [
                    Validators.required,
                    Validators.maxLength(150),
                    // Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            itemTypeId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            itemCategaryId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            itemGenericNameId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            itemClassId: [0,
                [
                    // Validators.required,
                    // this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            purchaseUomid: [0,
                [
                    Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            stockUomid: [0,
                [
                    // Validators.required, 
                    // this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            conversionFactor: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            currencyId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            taxPer: ["0"],
            isActive: [true],
            isBatchRequired: [true as boolean],
            minQty: [0,
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            maxQty: [0,
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            reOrder: ["0",
                [
                    Validators.required,
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            hsNcode: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            cgst: [0],
            sgst: [0],
            igst: [0],

            manufId: [0,
                [
                    // Validators.required,
                    // this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            isNarcotic: true,
            isH1drug: true,
            isScheduleH: true,
            isHighRisk: true,
            isScheduleX: true,
            isLasa: true,
            isEmgerency: true,
            drugType: ["0",
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            drugTypeName: ["",
                [
                    // Validators.required,
                    // this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            prodLocation: ["",
                [
                    // Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[a-zA-Z0-9 ]*$')

                ]
            ],
            itemCompnayId: [0,
                [
                    // Validators.required,
                    // this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            itemTime: [(new Date()).toISOString()],

            addedby: this._loggedService.currentUserValue.userId,
            upDatedBy: this._loggedService.currentUserValue.userId,
            doseName: "",
            doseDay: 0,
            instruction: "",
            mAssignItemToStores: [[], Validators.required], // empty array, not an object

            content: ['', [Validators.required]],
            isValidContent: [false, Validators.requiredTrue],
        });
    }

    createItemwiseSuppRateForm(): FormGroup {
        return this._formBuilder.group({
            itemId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            itemName: ["", [Validators.required, Validators.maxLength(50)]],
            supplierId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            price: [0, [Validators.required]],
            period: [new Date()]
        });
    }

    initializeFormGroup() {
        this.createItemmasterForm();
    }

    //insert update of item master
    public insertItemMaster(Param: any) {
        return this._httpClient.PostData("ItemMaster/InsertEDMX", Param);
    }

    public updateItemMaster(Param: any) {
        if (Param.itemID) {
            return this._httpClient.PutData("ItemMaster/Edit/" + Param.itemID, Param);
        }
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("ItemMaster?Id=" + m_data);
    }

    public getstoreById(Id) {
        return this._httpClient.GetData("ItemMaster/" + Id);
    }

    public getItemGenericById(Id) {
        return this._httpClient.GetData("ItemType/" + Id);
    }

    // public ItemMasterCancle(Param: any) {

    //   return this._httpClient.PostData("ItemMaster/ItemCanceled", Param);
    // }

}
