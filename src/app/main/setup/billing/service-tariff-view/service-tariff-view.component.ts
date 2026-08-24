import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { ServiceTariffViewService } from "./service-tariff-view.service";
import { MatPaginator, PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-service-tariff-view',
  templateUrl: './service-tariff-view.component.html',
  styleUrls: ['./service-tariff-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class ServiceTariffViewComponent {

  constructor(public _serviceMasterService: ServiceTariffViewService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
  ) { }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  myformSearch: FormGroup;

  ServiceList: any[] = [];
  ColumnList: any[] = [];
  filteredList: any[] = [];
  autocompleteModetariff: string = "Tariff";
  tariffId = "0";
  displayedColumns: string[] = [];
  showTable = false;

  totalRecords = 0;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [25, 50, 120, 200];
  selectedTariffId: number | null = null;
  searchServiceName = '%';

  ngOnInit(): void {
    this.myformSearch = this._serviceMasterService.createnewServiceSearchForm()
  }

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

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  loadData() {
    if (this.selectedTariffId && this.selectedTariffId > 0) {

      this._serviceMasterService
        .getServicesNew(
          this.selectedTariffId,
          this.searchServiceName,
          this.pageIndex,
          this.pageSize
        )
        .subscribe({
          next: (response: any) => {
            this.ServiceList = response.data || [];

            // TotalCount rides along on every row (per proc design)
            this.totalRecords = this.ServiceList.length > 0
              ? this.ServiceList[0].totalCount
              : 0;

            this.ColumnList = response.columns || [];

            this.displayedColumns = [
              'serviceName',
              ...this.ColumnList.map((x: any) => x.classId.toString())
            ];

            this.filteredList = this.ServiceList.map((service: any) => {
              const values: any = {};
              service.columnValues?.forEach((item: any) => {
                values[item.classId] = item.classValue;
              });
              return { ...service, values };
            });

            this.showTable = this.filteredList.length > 0;
          },
          error: (err) => {
            console.error('Error fetching services:', err);
            this.showTable = false;
            this.filteredList = [];
          }
        });

    } else {
      this.showTable = false;
      this.filteredList = [];
      this.ColumnList = [];
      this.displayedColumns = [];
      this.totalRecords = 0;
    }
  }

  // applyFilters() {

  //   const SearchServiceName = this.myformSearch.get('searchServiceName')?.value || '%';
  //   const selectedTariffId = this.myformSearch.get('searchTariffName')?.value;

  //   if (selectedTariffId > 0) {

  //     this._serviceMasterService.getServicesNew(selectedTariffId,SearchServiceName).subscribe((response: any) => {

  //       this.ServiceList = response.data;
  //       this.ColumnList = response.columns;

  //       // Create dynamic columns
  //       this.displayedColumns = [
  //         'serviceName',
  //         ...this.ColumnList.map((x: any) => x.classId.toString())
  //       ];

  //       // Prepare data for table
  //       this.filteredList = this.ServiceList.map((service: any) => {

  //         const values: any = {};

  //         service.columnValues.forEach((item: any) => {
  //           values[item.classId] = item.classValue;
  //         });

  //         return {
  //           ...service,
  //           values
  //         };

  //       });

  //       this.showTable = true;

  //     });

  //   } else {

  //     this.showTable = false;
  //     this.filteredList = [];
  //     this.ColumnList = [];
  //     this.displayedColumns = [];

  //   }

  // }

  onClear() {
    this.myformSearch.get('searchServiceName').setValue("");
    this.myformSearch.get('searchTariffName').setValue("");
  }

}
