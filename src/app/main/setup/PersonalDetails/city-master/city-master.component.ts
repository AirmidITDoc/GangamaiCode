import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { CityMasterService } from "./city-master.service";
import { NewCityComponent } from "./new-city/new-city.component";

@Component({
    selector: "app-city-master",
    templateUrl: "./city-master.component.html",
    styleUrls: ["./city-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CityMasterComponent implements OnInit {

    msg: any;
    cityName: any = "";

    options: any[] = [{ Text: 'Text-1', Id: 1 }, { Text: 'Text-2', Id: 2 }, { Text: 'Text-3', Id: 3 }];
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [
        { heading: "Code", key: "cityId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "City Name", key: "cityName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "State Name", key: "stateId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._CityMasterService.deactivateTheStatus(data.cityId).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allFilters = [
        { fieldName: "cityName", fieldValue: this.cityName, opType: OperatorComparer.Contains },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        apiUrl: "CityMaster/List",
        columnsList: this.allColumns,
        sortField: "cityId",
        sortOrder: 0,
        filters: this.allFilters
    }
    autocompleteMode: string = "CityMaster";

    constructor(
        public _CityMasterService: CityMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'CityNameSearch')
    //         this._CityMasterService.myformSearch.get('CityNameSearch').setValue("")
    //    // this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.cityName = this._CityMasterService.myformSearch.get('CityNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._CityMasterService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "CityMaster/List",
    //         columnsList: this.allColumns,
    //         sortField: "cityId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "cityName", fieldValue: this.cityName, opType: OperatorComparer.Contains },
    //             { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    //     console.log("GridConfig:", this.gridConfig);
    // }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button


        let that = this;
        const dialogRef = this._matDialog.open(NewCityComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    selectChange(obj: any) {
        console.log(obj);
    }

}