import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";

@Injectable({
    providedIn: "root",
})
export class ItemMasterService {
    currencyMasterSave(value: any) {
        throw new Error("Method not implemented.");
    }
    myform: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: FormBuilder
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
            ItemID: [""], 
            ItemName:['', [
                Validators.required,
                Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
              ]],
            ItemTypeID: [""],
            ItemTypeName: [""],
            ItemCategoryId: ["",],
            ItemCategoryName: [""],
            ItemGenericNameId: [""],
            ItemGenericName: [""],
            ItemClassId: [""],
            ItemClassName: [""],
            PurchaseUOMId: [""],
            UnitofMeasurementName: [""],
            StockUOMId: [""],
            ConversionFactor: ["", Validators.pattern("[0-9]+")],
            CurrencyId: [""],
            CurrencyName: [""],
           // TaxPer: ["", [Validators.required, Validators.pattern("[0-9]+")]],
            IsBatchRequired: ["true"],
            MinQty: ["", Validators.pattern("[0-9]+")],
            MaxQty: ["", Validators.pattern("[0-9]+")],
            ReOrder: ["", Validators.pattern("[0-9]+")],
            IsNursingFlag: ["true"],
            HSNcode: ["", Validators.required],
            CGST: [""],
            SGST: [""],
            IGST: [""],
            IsNarcotic: ["true"],
            ManufId: [""],
            ManufName: [""],
            ProdLocation: [""],
            IsH1Drug: ["true"],
            IsScheduleH: ["true"],
            IsHighRisk: ["true"],
            IsScheduleX: ["true"],
            IsLASA: ["true"],
            IsEmgerency: ["true"],
            AddedByName: [""],
            IsDeleted: ["false"],
            action: [""],
            StoreId: [""],
            Storagelocation:[""],
            CompanyId:["", Validators.required],
            DrugType:[""],
            ItemColorcode:[""],
            MaxDisc:["",Validators.pattern("[0-9]+")],
            CreateApproval:["true"],
            // Verify:[""]
        });
    }

    public itemMasterSave(Param: any, showLoader = true) {
        if (Param.ItemID) {
            return this._httpClient.PutData("CurrencyMaster/" + Param.ItemID, Param, showLoader);
        } else return this._httpClient.PostData("CurrencyMaster", Param, showLoader);
    }

    getValidationMessages() {
        return {
            itemName: [
                { name: "required", Message: "Item Name is required" },
                { name: "maxlength", Message: "Item Name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("itemMaster?Id=" + m_data.toString());
    }

    public getItemMasterList(param) {
        return this._httpClient.PostData( 
            "Generic/GetByProc?procName=m_Rtrv_ItemMaster_by_Name",
            param
        );
    }

    public deactivateTheStatus(param) {
        return this._httpClient.PostData(
            "Generic/ExecByQueryStatement?query=" + param,
            {}
        );
    }

    public getitemtypeMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_ItemTypeMasterForCombo",
            {}
        );
    }

    public getitemclassMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_ItemClassForCombo",
            {}
        );
    }

    public getitemcategoryMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_ItemCategoryMasterForCombo",
            {}
        );
    }

    public getitemgenericMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_ItemGenericNameMasterForCombo",
            {}
        );
    }

    public getunitofMeasurementMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_PurchaseUOMForCombo",
            {}
        );
    }

    public getStockUMOMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_StockUOMForCombo",
            {}
        );
    }


    public getManufactureMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_ItemManufactureMasterForCombo",
            {}
        );
    }

    public getStoreMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=RetrieveStoerMasterForCombo",
            {}
        );
    }

    public getCurrencyMasterCombo() {
        return this._httpClient.PostData(
            "Generic/GetByProc?procName=Retrieve_CurrencyForCombo",
            {}
        );
    }

    //insert update of item master
    public insertItemMaster(Param: any, showLoader = true) {
        if (Param.itemId) {
            return this._httpClient.PutData("ItemMaster/InsertEDMX" + Param.itemId, Param, showLoader);
        } else return this._httpClient.PostData("ItemMaster/InsertEDMX", Param, showLoader);
    }

    public updateItemMaster(param) {
        return this._httpClient.PostData("Inventory/ItemMasterUpdate", param);
    }

    public InsertAssignItemToStore(param) {
        return this._httpClient.PostData("Inventory/ItemMasterSave", param);
    }

    public DeleteAssignItemToStore(param) {
        return this._httpClient.PostData("Inventory/ItemMasterUpdate", param);
    }

    populateForm(param) {
        this.myform.patchValue(param);
    }
      //company Combobox List
  public getCompanyCombo() {
    return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_ItemCompanyMasterForCombo", {})
  }
  public getDrugTypeCombo() {
    return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_ItemDrugTypeList", {})
  }

  public getHistoryList() {
    return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_M_PastHistoryMasterForCombo",{});
  }
  public getAssigneToStoreList(param) {
    return this._httpClient.PostData("Generic/GetByProc?procName=Rtrv_ItemMaster_by_Store",param);
  }
}
