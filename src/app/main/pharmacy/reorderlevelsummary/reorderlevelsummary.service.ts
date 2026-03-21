import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class ReorderlevelsummaryService {
    SearchFrom: FormGroup;
    RaisedIndentFrom: FormGroup;
    constructor(
        public _httpClient: HttpClient,
        private _formBuilder: UntypedFormBuilder,
        public _httpClient1: ApiCaller,
        public _accountservice: AuthenticationService
    ) {
        this.SearchFrom = this.createSearchFrom();
        this.RaisedIndentFrom = this.createRaisedIndentFrom();
    }

    createSearchFrom() {
        return this._formBuilder.group({
            Type: [''],
            ReorderQty: ['']
        });
    }
    createRaisedIndentFrom() {
        return this._formBuilder.group({
            ToStoreId: [this._accountservice.currentUserValue.user.storeId],
            IndentQty: [''],

        });
    }

    public getReorderlevelList(params) {//m_rtrvItemReorderList
        return this._httpClient1.PostData("PharamacyReorder/ItemReorderList", params);
    }

    public RaisedIndentSave(Param) {
        return this._httpClient.post("InventoryTransaction/IndentSave", Param)
    }
}
