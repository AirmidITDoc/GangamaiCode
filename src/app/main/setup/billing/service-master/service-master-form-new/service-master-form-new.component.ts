import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { ServiceMasterComponent } from "../service-master.component";
import { ServiceMasterService } from "../service-master.service";

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

    displayedColumns: string[] = [];

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
        // this._serviceMasterService.getServicesNew(1).subscribe((response) => {
        //     this.ServiceList = response.data;
        //     this.filteredList = this.ServiceList;
        //     this.ColumnList = response.columns;
        //     console.log(this.ServiceList)
        // });
    }
    showTable = false;
    applyFilters() {

        const SearchServiceName = this.myformSearch.get('searchServiceName')?.value || '%';
        const selectedTariffId = this.myformSearch.get('searchTariffName')?.value;

        if (selectedTariffId > 0) {

            this._serviceMasterService.getServicesNew(selectedTariffId,SearchServiceName).subscribe((response: any) => {

                this.ServiceList = response.data;
                this.ColumnList = response.columns;

                // Create dynamic columns
                this.displayedColumns = [
                    'serviceName',
                    ...this.ColumnList.map((x: any) => x.classId.toString())
                ];

                // Prepare data for table
                this.filteredList = this.ServiceList.map((service: any) => {

                    const values: any = {};

                    service.columnValues.forEach((item: any) => {
                        values[item.classId] = item.classValue;
                    });

                    return {
                        ...service,
                        values
                    };

                });

                this.showTable = true;

            });

        } else {

            this.showTable = false;
            this.filteredList = [];
            this.ColumnList = [];
            this.displayedColumns = [];

        }

    }
    // applyFilters() {
    //     const selectedTariffId = this.myformSearch.get('searchTariffName')?.value;

    //     if (selectedTariffId > 0) {
    //         this._serviceMasterService.getServicesNew(selectedTariffId).subscribe((response) => {
    //             this.ServiceList = response.data;
    //             this.ColumnList = response.columns;

    //             const serviceFilter = this.myformSearch.get('searchServiceName')?.value?.toLowerCase() || '';

    //             this.filteredList = this.ServiceList.filter(item =>
    //                 item.serviceName?.toLowerCase().includes(serviceFilter)
    //             );
    //             this.showTable = true;
    //         });
    //     } else {
    //         this.showTable = false;
    //         console.log('aasasas:', this.myformSearch.get('searchTariffName')?.value)
    //     }
    //     console.log('aasasas:', this.myformSearch.get('searchTariffName')?.value)
    // }

    updateAmount(row: any, classId: number): void {

        const index = row.columnValues.findIndex((x: any) => x.classId === classId);

        if (index > -1) {
            row.columnValues[index].classValue = row.values[classId];
        } else {
            row.columnValues.push({
                classId: classId,
                classValue: row.values[classId]
            });
        }
    }

    onSubmit() {
        const data = { TariffId: this.myformSearch.get('searchTariffName')?.value, Data: this.ServiceList, Columns: [] };
        // const data = { TariffId: 1, Data: this.ServiceList, Columns: [] };
        
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