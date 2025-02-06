import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ParametermasterService } from "./parametermaster.service";
import { fuseAnimations } from "@fuse/animations";
import { ParameterFormMasterComponent } from "./parameter-form-master/parameter-form-master.component";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { AddformulaComponent } from "./addformula/addformula.component";

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-parametermaster",
    templateUrl: "./parametermaster.component.html",
    styleUrls: ["./parametermaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParametermasterComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "ParameterMaster/MPathParameterList", //PathParameterMaster/List
        columnsList: [
            { heading: "Code", key: "parameterId", width: 100, sort: true, align: 'left', emptySign: 'NA' },

            { heading: "Parameter Name", key: "parameterName", width: 200, sort: true, align: 'left', emptySign: 'NA' },

            { heading: "Short Name", key: "parameterShortName", width: 200, sort: true, align: 'left', emptySign: 'NA' },

            { heading: "PrintParameterName", key: "printParameterName", width: 200, sort: true, align: 'left', emptySign: 'NA' },

            { heading: "Unit Name", key: "unitId", width: 200, sort: true, align: 'left', emptySign: 'NA' },

            { heading: "IsNumeric", key: "isNumeric", width: 100, sort: true, align: 'left', emptySign: 'NA' },

            { heading: "IsPrintDisSummary", key: "isPrintDisSummary", width: 100, sort: true, align: 'left', emptySign: 'NA' },
            
            { heading: "Formula", key: "Formula", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            
            { heading: "Added By", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },

            { heading: "IsActive", key: "isActive", width: 100, type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", width: 100, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onAdd(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ParameterService.deactivateTheStatus(data.parameterId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "UnitId",
        sortOrder: 0,
        filters: [
            { fieldName: "ParameterName", fieldValue: "Serum Uric Acid", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _ParameterService: ParametermasterService,
        public _matDialog: MatDialog,
        private reportDownloadService: ExcelDownloadService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    onSearchClear() {
        this._ParameterService.myformSearch.reset({
            ParameterNameSearch: "",
            IsDeletedSearch: "2",
        });

    }
    onSearch() {

    }
    onClear() {
        this._ParameterService.myform.reset({ IsDeleted: "false" });
        this._ParameterService.initializeFormGroup();
    }

    onEdit(row) {
        console.log()
        var m_data = {
            ParameterID: row.ParameterID,
            ParameterShortName: row.ParameterShortName.trim(),
            ParameterName: row.ParameterName.trim(),
            PrintParameterName: row.PrintParameterName.trim(),
            UnitId: row.UnitId,
            IsNumeric: row.IsNumericParameter,
            IsDeleted: JSON.stringify(row.Isdeleted),
            UpdatedBy: row.UpdatedBy,
            IsPrintDisSummary: JSON.stringify(row.IsPrintDisSummary),
            MethodName: row.MethodName,
            ParaMultipleRange: row.ParaMultipleRange,
            Formula: row.Formula,
        };

        this._ParameterService.getTableData(row.ParameterID).subscribe((data) => {
            if (row.IsNumericParameter == 1) {

                m_data['numericList'] = data;
                m_data['descriptiveList'] = [];

            }
            else {
                let updatedData = []
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const element = data[key];
                        updatedData.push(element.ParameterValues);
                    }
                }

                m_data['descriptiveList'] = updatedData;
                m_data['numericList'] = [];
            }
            this._ParameterService.populateForm(m_data);
            const dialogRef = this._matDialog.open(ParameterFormMasterComponent, {
                maxWidth: "75vw",
                maxHeight: "95vh",
                width: "100%",
                height: "100%",
                data: {
                    registerObj: row,
                }
            });

            dialogRef.afterClosed().subscribe((result) => {
                console.log("The dialog was closed - Insert Action", result);

            });
        })
    }

    onAdd(row: any = null) {
        
        let that = this;
        const dialogRef = this._matDialog.open(ParameterFormMasterComponent,
            {
                maxWidth: "100vw",
                height: '95%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }
    onaddformula(row) {

        const dialogRef = this._matDialog.open(AddformulaComponent, {
            maxWidth: "50vw",
            maxHeight: "55vh",
            width: "100%",
            height: "100%",
            data: {
                registerObj: row,
            }

        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);

        });
    }
    currentStatus = 0;
    toggle(val: any) {
        if (val == "2") {
            this.currentStatus = 2;
        } else if (val == "1") {
            this.currentStatus = 1;
        }
        else {
            this.currentStatus = 0;

        }
    }
}

export class PathparameterMaster {
    ParameterID: number;
    ParameterShortName: string;
    ParameterName: string;
    PrintParameterName: string;
    UnitId: number;
    IsNumeric: Number;
    Isdeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    IsPrintDisSummary: boolean;
    MethodName: string;
    Formula: string;
    ParaMultipleRange: string;
    IsDeletedSearch: number;

    /**
     * Constructor
     *
     * @param PathparameterMaster
     */
    constructor(PathparameterMaster) {
        {
            this.ParameterID = PathparameterMaster.parameterId || "";
            this.ParameterShortName = PathparameterMaster.ParameterShortName || "";
            this.ParameterName = PathparameterMaster.ParameterName || "";
            this.MethodName = PathparameterMaster.MethodName || "";
            this.Formula = PathparameterMaster.Formula || "";
            this.PrintParameterName = PathparameterMaster.PrintParameterName || "";
            this.UnitId = PathparameterMaster.UnitId || "";
            this.IsNumeric = PathparameterMaster.IsNumeric || "1";
            this.Isdeleted = PathparameterMaster.Isdeleted || "";
            this.AddedBy = PathparameterMaster.AddedBy || "";
            this.UpdatedBy = PathparameterMaster.UpdatedBy || "";
            this.IsPrintDisSummary = PathparameterMaster.IsPrintDisSummary || "false";
            this.ParaMultipleRange = PathparameterMaster.ParaMultipleRange || "";
            this.IsDeletedSearch = PathparameterMaster.IsDeletedSearch || "";
        }
    }
}

