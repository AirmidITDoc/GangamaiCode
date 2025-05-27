import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { CountryMasterService } from "./country-master.service";
import { NewCountryMasterComponent } from "./new-country-master/new-country-master.component";

@Component({
    selector: "app-country-master",
    templateUrl: "./country-master.component.html",
    styleUrls: ["./country-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CountryMasterComponent implements OnInit {
    msg: any;
    countryName:any=""
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    allcolumns= [
            { heading: "Code", key: "countryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Country Name", key: "countryName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            { heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._CountryService.deactivateTheStatus(data.countryId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        allfilters=[
            { fieldName: "countryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    gridConfig: gridModel = {
        apiUrl: "CountryMaster/List",
        columnsList: this.allcolumns,
        sortField: "countryId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _CountryService: CountryMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void { }

    Clearfilter(event) {
        console.log(event)
        if (event == 'CountryNameSearch')
            this._CountryService.myformSearch.get('CountryNameSearch').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.countryName = this._CountryService.myformSearch.get('CountryNameSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        let isActive = this._CountryService.myformSearch.get("IsDeletedSearch").value || "";
        this.gridConfig = {
            apiUrl: "CountryMaster/List",
            columnsList: this.allcolumns,
            sortField: "countryId",
            sortOrder: 0,
            filters: [
            { fieldName: "countryName", fieldValue: this.countryName, opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
        ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        console.log("GridConfig:", this.gridConfig);
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCountryMasterComponent,
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
}
