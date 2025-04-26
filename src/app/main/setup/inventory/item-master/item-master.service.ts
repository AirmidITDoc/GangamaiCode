import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable()

export class ItemMasterService {

    itemForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
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
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            itemName: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            itemTypeId: ["",
                [
                    Validators.required,
                ]
            ],
            itemCategaryId: ["",
                [
                    Validators.required,
                ]
            ],
            itemGenericNameId: ["",
                [
                    Validators.required,
                ]
            ],
            itemClassId: ["",
                [
                    Validators.required,
                ]
            ],
            purchaseUomid: [0,
                [
                    Validators.required,
                ]
            ],
            stockUomid: [0,
                [
                    Validators.required,
                ]
            ],
            conversionFactor: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            currencyId: ["",
                [
                    Validators.required,
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

            manufId: ["",
                [
                    Validators.required,
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
            drugTypeName: [""],
            prodLocation: ["",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                ]
            ],
            itemCompnayId: ["",
                [
                    Validators.required,
                ]
            ],
            itemTime: [(new Date()).toISOString()],
            mAssignItemToStores: [
                {
                    assignId: 0,
                    storeId: 0,
                    itemId: 0
                }
            ]

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

    // public ItemMasterCancle(Param: any) {
        
    //   return this._httpClient.PostData("ItemMaster/ItemCanceled", Param);
    // }
    
}
