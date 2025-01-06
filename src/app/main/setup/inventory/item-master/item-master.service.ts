
import { Injectable } from "@angular/core";
import { UntypedFormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})

export class ItemMasterService {

    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder
    ) {
        this.myform = this.createItemmasterForm();
        this.myformSearch = this.createSearchForm();
    }

    initializeFormGroup() {
        this.createItemmasterForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            ItemNameSearch: [""],
            IsDeletedSearch: ["2"],
        });
    }

    
    createItemmasterForm(): FormGroup {
        return this._formBuilder.group({
             
            // as per payload list (insert)
                itemId: 0,
                itemShortName: ["", Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")],
                itemName: ["",
                    [
                        Validators.required, Validators.maxLength(50),
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
                        Validators.required, Validators.maxLength(50),
                        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    ] 
                ],
                currencyId: ["",
                    [
                        Validators.required,
                    ] 
                ],
                taxPer: ["0"],
                isBatchRequired: true,
                minQty: ["",
                    [
                        Validators.required,Validators.maxLength(50),
                        Validators.pattern('^[0-9]*$')
                    ] 
                ],
                maxQty: ["",
                    [
                        Validators.required,Validators.maxLength(50),
                        Validators.pattern('^[0-9]*$')
                    ] 
                ],
                reOrder: [0,
                    [
                        // Validators.required,Validators.maxLength(50),
                        // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    ] 
                ],
                hsNcode: ["",
                    [
                        Validators.required, Validators.maxLength(50),
                        Validators.pattern('^[0-9]*$')
                    ] 
                ],
                cgst: ["",
                    [
                        Validators.required,Validators.maxLength(15),
                        Validators.pattern('^[0-9]*$')
                    ] 
                ],
                sgst: ["",
                    [
                        Validators.required,Validators.maxLength(15),
                        Validators.pattern('^[0-9]*$')
                    ] 
                ],
                igst: ["",
                    [
                        Validators.required,Validators.maxLength(15),
                        Validators.pattern('^[0-9]*$')
                    ] 
                ],
                
                manufId: ["",
                    [
                        Validators.required,
                    ] 
                ],
                isNarcotic : true,
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
                        Validators.required,Validators.maxLength(50),
                        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
                    ] 
                ],
                itemCompnayId: ["",
                    [
                        Validators.required,
                    ] 
                ],
                itemTime: [(new Date()).toISOString()],
                // mAssignItemToStores: [
                //     {
                //         assignId: [""],
                //         storeId: ["",
                //             [
                //                 Validators.required,
                //             ] 
                //         ],
                //         itemId: [""]
                //     }
                // ],
                mAssignItemToStores: ["", Validators.required],
        });
    }


    //insert update of item master
    public insertItemMaster(Param: any, showLoader = true) {
        if (Param.itemId) {
            debugger
            return this._httpClient.PutData("ItemMaster/Edit/" + Param.itemId, Param, showLoader);
        } else return this._httpClient.PostData("ItemMaster/InsertEDMX", Param, showLoader);
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("itemMaster?Id=" + m_data.toString());
    }

    public getstoreById(Id, showLoader = true) {
        return this._httpClient.GetData("ItemMaster/" + Id,showLoader);
    } 
}
