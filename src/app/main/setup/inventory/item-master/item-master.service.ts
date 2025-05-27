import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable()

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
            IsDeletedSearch: ["2"],
        });
    }

    createItemmasterForm(): FormGroup {
        return this._formBuilder.group({
            itemID: [0],
            itemShortName: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                  //  Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
                ]
            ],
            itemName: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                  //  Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    Validators.pattern('^[a-zA-Z0-9 ]*$')
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
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            purchaseUomid: [0,
                [
                    Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            stockUomid: [0,
                [
                    Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            conversionFactor: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    //Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
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
            isActive:[true],
            isBatchRequired: [true as boolean],
            minQty: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            maxQty: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            reOrder: ["0",
                [
                    Validators.required,
                    // Validators.maxLength(50),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            hsNcode: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern('^[0-9]*$')
                ]
            ],
            cgst: ["",
                [
                    Validators.required,
                    Validators.maxLength(15),
                    Validators.pattern('^[0-9.]*$')

                ]
            ],
            sgst: ["",
                [
                    Validators.required,
                    Validators.maxLength(15),
                    Validators.pattern('^[0-9.]*$')

                ]
            ],
            igst: ["",
                [
                    Validators.required,
                    Validators.maxLength(15),
                    Validators.pattern('^[0-9.]*$')

                ]
            ],

            manufId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            isNarcotic: true,
            isH1drug: true,
            isScheduleH: true,
            isHighRisk: true,
            isScheduleX: true,
            isLasa: true,
            isEmgerency: true,
            drugType: [0,
                [
                    Validators.required,
                ]
            ],
            drugTypeName: [""
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            prodLocation: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z ]*$")
                    
                ]
            ],
            itemCompnayId: [0,
                [
                    Validators.required,
                    this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]
            ],
            itemTime: [(new Date()).toISOString()],
            // mAssignItemToStores: [
            //     {
            //         assignId: 0,
            //         storeId: 0,
            //         itemId: 0
            //     },[Validators.required]
            // ]
            addedby: this._loggedService.currentUserValue.userId,
            upDatedBy: this._loggedService.currentUserValue.userId,
            doseName: "",
            doseDay: 0,
            instruction: "",
            mAssignItemToStores: [[], Validators.required] // empty array, not an object

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
        return this._httpClient.DeleteData("ItemMaster?Id=" + m_data.toString());
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
