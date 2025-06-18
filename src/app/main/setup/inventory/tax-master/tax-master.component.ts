import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewTaxComponent } from "./new-tax/new-tax.component";
import { TaxMasterService } from "./tax-master.service";

@Component({
    selector: "app-tax-master",
    templateUrl: "./tax-master.component.html",
    styleUrls: ["./tax-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TaxMasterComponent implements OnInit {
   
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    taxNature: any = "";
         allcolumns = [
            { heading: "TaxId", key: "id", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TaxNatureName", key: "taxNature", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            { heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        
                        this._TaxMasterService.deactivateTheStatus(data.id).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters = [
            { fieldName: "taxNature", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
        ]
    
 gridConfig: gridModel = {
        apiUrl: "TaxMaster/List",
        columnsList: this.allcolumns,
        sortField: "id",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _TaxMasterService: TaxMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog
    ) { }
    
    ngOnInit(): void { }
//filters addedby avdhoot vedpathak date-28/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'TaxNatureSearch')
    //         this._TaxMasterService.myformSearch.get('TaxNatureSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.taxNature = this._TaxMasterService.myformSearch.get('TaxNatureSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._TaxMasterService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "TaxMaster/List",
    //         columnsList: this.allcolumns,
    //         sortField: "id",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "taxNature", fieldValue: this.taxNature, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewTaxComponent,
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

