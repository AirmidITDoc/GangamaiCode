import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { ServiceMasterComponent } from "../service-master.component";
import { ServiceMasterService } from "../service-master.service";
import { FormGroup } from "@angular/forms";
import { debug } from "console";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form-new.component.html",
    styleUrls: ["./service-master-form-new.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class ServiceMasterFormNewComponent implements OnInit {
    constructor(public _serviceMasterService: ServiceMasterService,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,

        public dialogRef: MatDialogRef<ServiceMasterComponent>,
    ) { }

    myformSearch: FormGroup;

    ServiceList: any[] = [];
    ColumnList: any[] = [];
    filteredList: any[] = [];
    autocompleteModetariff: string = "Tariff";
    tariffId = "0";

    getClassValue(item: any, classId: number): number {
        return item.columnValues.find(x => x.classId === classId)?.classValue ?? 0;
    }

    setClassValue(item: any, classId: number, value: any) {
        const found = item.columnValues.find(x => x.classId === classId);
        if (found) {
            found.classValue = value;
        } else {
            item.columnValues.push({
                classId: classId,
                classValue: Number(value)
            });
        }
    }
    ngOnInit(): void {
        this.myformSearch = this._serviceMasterService.createnewServiceSearchForm()
        this._serviceMasterService.getServicesNew(1).subscribe((response) => {
            this.ServiceList = response.data;
            this.filteredList = this.ServiceList;
            this.ColumnList = response.columns;
            console.log(this.ServiceList)
        });
    }

    applyFilters() {
        const selectedTariffId = this.myformSearch.get('searchTariffName')?.value;

        this._serviceMasterService.getServicesNew(selectedTariffId).subscribe((response) => {
            this.ServiceList = response.data;
            this.ColumnList = response.columns;
            
            const serviceFilter = this.myformSearch.get('searchServiceName')?.value?.toLowerCase() || '';

            this.filteredList = this.ServiceList.filter(item =>
                item.serviceName?.toLowerCase().includes(serviceFilter)
            );
        });
        console.log('aasasas:',this.myformSearch.get('searchTariffName')?.value)
    }

    onSubmit() {
        var data = { TariffId: 1, Data: this.ServiceList, Columns: [] };
        this._serviceMasterService.saveServicesNew(data).subscribe(() => {
            
        });
    }

    onClose() {
        this.dialogRef.close();
    }

    onClear() {
        this.myformSearch.get('searchServiceName').setValue("");
        this.myformSearch.get('searchTariffName').setValue("");
    }

}