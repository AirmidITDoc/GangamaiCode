import { Component, Inject, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { ServiceTariffViewService } from "./service-tariff-view.service";

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

  myformSearch: FormGroup;

  ServiceList: any[] = [];
  ColumnList: any[] = [];
  filteredList: any[] = [];
  autocompleteModetariff: string = "Tariff";
  tariffId = "0";
  displayedColumns: string[] = [];
  showTable = false;

  ngOnInit(): void {
    this.myformSearch = this._serviceMasterService.createnewServiceSearchForm()
  }

  applyFilters() {

    const selectedTariffId = this.myformSearch.get('searchTariffName')?.value;

    if (selectedTariffId > 0) {

      this._serviceMasterService.getServicesNew(selectedTariffId).subscribe((response: any) => {

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

  onClear() {
    this.myformSearch.get('searchServiceName').setValue("");
    this.myformSearch.get('searchTariffName').setValue("");
  }

}
