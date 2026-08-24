import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { ServiceMasterComponent } from "../service-master.component";
import { ServiceMasterService } from "../service-master.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";

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
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    ServiceList: any[] = [];
    ColumnList: any[] = [];
    filteredList: any[] = [];
    autocompleteModetariff: string = "Tariff";
    tariffId = "0";

    displayedColumns: string[] = [];
    totalRecords = 0;
    pageSize = 25;
    pageIndex = 0;
    pageSizeOptions = [25, 50, 120, 200];
    selectedTariffId: number | null = null;
    searchServiceName = '%';
    fullServiceList: any[] = [];
    filteredListFull: any[] = [];

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
    // applyFilters() {

    //     const SearchServiceName = this.myformSearch.get('searchServiceName')?.value || '%';
    //     const selectedTariffId = this.myformSearch.get('searchTariffName')?.value;

    //     if (selectedTariffId > 0) {

    //         this._serviceMasterService.getServicesNew(selectedTariffId, SearchServiceName).subscribe((response: any) => {

    //             this.ServiceList = response.data;
    //             this.ColumnList = response.columns;

    //             // Create dynamic columns
    //             this.displayedColumns = [
    //                 'serviceName',
    //                 ...this.ColumnList.map((x: any) => x.classId.toString())
    //             ];

    //             // Prepare data for table
    //             this.filteredList = this.ServiceList.map((service: any) => {

    //                 const values: any = {};

    //                 service.columnValues.forEach((item: any) => {
    //                     values[item.classId] = item.classValue;
    //                 });

    //                 return {
    //                     ...service,
    //                     values
    //                 };

    //             });

    //             this.showTable = true;

    //         });

    //     } else {

    //         this.showTable = false;
    //         this.filteredList = [];
    //         this.ColumnList = [];
    //         this.displayedColumns = [];

    //     }

    // }

    applyFilters() {
        const SearchServiceName = this.myformSearch.get('searchServiceName')?.value || '%';
        const selectedTariffId = this.myformSearch.get('searchTariffName')?.value;

        this.selectedTariffId = selectedTariffId;
        this.searchServiceName = SearchServiceName;

        // Reset to first page on every new search
        this.pageIndex = 0;
        if (this.paginator) {
            this.paginator.firstPage();
        }

        this.loadData();
    }

    loadData() {
        if (this.selectedTariffId && this.selectedTariffId > 0) {
            this._serviceMasterService
                .getServicesNew(
                    this.selectedTariffId,
                    this.searchServiceName,
                    0,      // fetch from start
                    999999     // or a very large number / a flag your API treats as "all"
                )
                .subscribe({
                    next: (response: any) => {
                        this.fullServiceList = response.data || [];
                        this.ColumnList = response.columns || [];

                        this.displayedColumns = [
                            'serviceName',
                            ...this.ColumnList.map((x: any) => x.classId.toString())
                        ];

                        const mapped = this.fullServiceList.map((service: any) => {
                            const values: any = {};
                            service.columnValues?.forEach((item: any) => {
                                values[item.classId] = item.classValue;
                            });
                            return { ...service, values };
                        });

                        this.filteredListFull = mapped; // full mapped list
                        this.totalRecords = mapped.length;
                        this.showTable = mapped.length > 0;

                        this.applyClientPage(); // slice out current page for display
                    },
                    error: (err) => {
                        console.error('Error fetching services:', err);
                        this.showTable = false;
                        this.filteredListFull = [];
                        this.filteredList = [];
                    }
                });
        } else {
            this.showTable = false;
            this.filteredListFull = [];
            this.filteredList = [];
            this.ColumnList = [];
            this.displayedColumns = [];
            this.totalRecords = 0;
        }
    }

    applyClientPage() {
        const start = this.pageIndex * this.pageSize;
        this.filteredList = this.filteredListFull.slice(start, start + this.pageSize);
    }

    onPageChange(event: PageEvent) {
        this.pageIndex = event.pageIndex;
        this.pageSize = event.pageSize;
        // this.loadData();
        this.applyClientPage();
    }

    // loadData() {
    //     if (this.selectedTariffId && this.selectedTariffId > 0) {

    //         this._serviceMasterService
    //             .getServicesNew(
    //                 this.selectedTariffId,
    //                 this.searchServiceName,
    //                 0, -1
    //                 // this.pageIndex,
    //                 // this.pageSize
    //             )
    //             .subscribe({
    //                 next: (response: any) => {
    //                     this.ServiceList = response.data || [];

    //                     // TotalCount rides along on every row (per proc design)
    //                     this.totalRecords = this.ServiceList.length > 0
    //                         ? this.ServiceList[0].totalCount
    //                         : 0;

    //                     this.ColumnList = response.columns || [];

    //                     this.displayedColumns = [
    //                         'serviceName',
    //                         ...this.ColumnList.map((x: any) => x.classId.toString())
    //                     ];

    //                     this.filteredList = this.ServiceList.map((service: any) => {
    //                         const values: any = {};
    //                         service.columnValues?.forEach((item: any) => {
    //                             values[item.classId] = item.classValue;
    //                         });
    //                         return { ...service, values };
    //                     });

    //                     this.showTable = this.filteredList.length > 0;
    //                 },
    //                 error: (err) => {
    //                     console.error('Error fetching services:', err);
    //                     this.showTable = false;
    //                     this.filteredList = [];
    //                 }
    //             });

    //     } else {
    //         this.showTable = false;
    //         this.filteredList = [];
    //         this.ColumnList = [];
    //         this.displayedColumns = [];
    //         this.totalRecords = 0;
    //     }
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
        // const data = { TariffId: this.myformSearch.get('searchTariffName')?.value, Data: this.ServiceList, Columns: [] };
        const data = {
            TariffId: this.myformSearch.get('searchTariffName')?.value,
            Data: this.filteredListFull, // ✅ full data, all pages
            Columns: []
        };
        console.log(data)
        
        this._serviceMasterService.saveServicesNew(data).subscribe(() => {
            this.onClose();
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