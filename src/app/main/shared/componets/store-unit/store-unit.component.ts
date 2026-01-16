import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { StoreUnitContextService } from '../../services/storeunit-context.service';
import { FormvalidationserviceService } from '../../services/formvalidationservice.service';

@Component({
    selector: 'airmid-store-unit',
    templateUrl: './store-unit.component.html',
    styleUrls: ['./store-unit.component.scss']
})
export class StoreUnitComponent implements OnInit {
    Stores = [];
    Units = [];

    storeId!: number;
    unitId!: number;
    storeName: string;
    unitName: string;
    itemForm: FormGroup;

    constructor(private contextSvc: StoreUnitContextService, private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService) { }
    ngOnInit(): void {
        this.itemForm = this._formBuilder.group({
            storeId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            storeName: ["", [Validators.required]],
            unitId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitName: ["", [Validators.required]],
        });
        const ctx = this.contextSvc.getContext();
        if (ctx) {
            this.storeId = ctx.storeId;
            this.unitId = ctx.unitId;
            this.Stores = ctx.Stores;
            this.Units = ctx.Units;
        }
    }
    onChange(value, type) {
        if (type == 'Store') {
            this.storeId = value.storeId;
            this.storeName = value.storeName;
        }
        else {
            this.unitId = value.unitId;
            this.unitName = value.unitName;
        }
        this.contextSvc.setContext({
            storeId: this.storeId,
            storeName: this.storeName,
            unitId: this.unitId,
            unitName: this.unitName,
            Stores: this.Stores,
            Units: this.Units
        });
    }
    getValidationMessages() {
        return {
            storeId: [
                { name: "required", Message: "Store is required" }
            ],
            unitId: [
                { name: "required", Message: "Unit is required" }
            ],
        };
    }
}
