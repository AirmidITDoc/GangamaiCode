import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TariffMasterService } from "./tariff-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { NewTariffComponent } from "./new-tariff/new-tariff.component";

@Component({
    selector: "app-tariff-master",
    templateUrl: "./tariff-master.component.html",
    styleUrls: ["./tariff-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TariffMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
tariffName: any = "";
   
        allcolumns = [
            { heading: "Code", key: "tariffId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [

                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._TariffMasterService.deactivateTheStatus(data.tariffId).subscribe((response: any) => {
                                this.toastr.success(response.Message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
         allfilters = [
            { fieldName: "tariffName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    
 gridConfig: gridModel = {
        apiUrl: "TarrifMaster/List",
        columnsList: this.allcolumns,
        sortField: "tariffId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _TariffMasterService: TariffMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
 //filters addedby avdhoot vedpathak date-27/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'TariffNameSearch')
    //         this._TariffMasterService.myformSearch.get('TariffNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.tariffName = this._TariffMasterService.myformSearch.get('TariffNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._TariffMasterService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "TarrifMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "tariffId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "tariffName", fieldValue: this.tariffName, opType: OperatorComparer.Contains },
    //             { fieldName: "isActive", fieldValue: isActive, opType: OperatorComparer.Equals }
    //         ]
    //     }
    //     // this.grid.gridConfig = this.gridConfig;
    //     // this.grid.bindGridData();
    //     console.log("GridConfig:", this.gridConfig);

    // if (this.grid) {
    //     this.grid.gridConfig = this.gridConfig;
    //     this.grid.bindGridData();
    // } else {
    //     console.error("Grid is undefined!");
    // }
    // }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewTariffComponent,
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