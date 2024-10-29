import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { ParametermasterService } from "./parametermaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { MatAccordion } from "@angular/material/expansion";
import { fuseAnimations } from "@fuse/animations";
import { ParameterFormMasterComponent } from "./parameter-form-master/parameter-form-master.component";
import { connectableObservableDescriptor } from "rxjs/internal/observable/ConnectableObservable";
import Swal from "sweetalert2";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { AddformulaComponent } from "./addformula/addformula.component";

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { ToastrService } from "ngx-toastr";


@Component({
    selector: "app-parametermaster",
    templateUrl: "./parametermaster.component.html",
    styleUrls: ["./parametermaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParametermasterComponent implements OnInit {
    gridConfig: gridModel = {
        apiUrl: "PathCategoryMaster/List",
        columnsList: [
            { heading: "Code", key: "parameterId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Parameter Name", key: "parameterName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onAdd(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.genderId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "parameterId",
        sortOrder: 0,
        filters: [
            { fieldName: "parameterName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent, any>;
    

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

    onDeactive(parameterId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._ParameterService.deactivateTheStatus(parameterId).subscribe((response: any) => {
                    if (response.StatusCode == 200) {
                        this.toastr.success(response.Message);
                        // this.getGenderMasterList();
                        // How to refresh Grid.
                    }
                });
            }
            this.confirmDialogRef = null;
        });
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
            if(row.IsNumericParameter==1){
                
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
            data : {
                registerObj : row,
              }
             });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
           
        });
        })
    }

    onAdd(row:any = null) {
        const dialogRef = this._matDialog.open(ParameterFormMasterComponent,
        {
            maxWidth: "45vw",
            height: '35%',
            width: '70%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
             
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
            data : {
                registerObj : row,
              }
            
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
           
        });
    }
    currentStatus=0;
    toggle(val: any) {
        if (val == "2") {
            this.currentStatus = 2;
        } else if(val=="1") {
            this.currentStatus = 1;
        }
        else{
            this.currentStatus = 0;

        }
    }
//     onFilterChange(){
//         ;
//         if(this.currentStatus==1){
//             this.tempList.data = []
//             for (let item of this.DSParameterList.data) {
//                 if(item.Isdeleted)this.tempList.data.push(item)
                    
//                 }
//             }
            
//         else if(this.currentStatus==2){
//             debugger
//             this.tempList.data = []
//             for (let item of this.DSParameterList.data) {
//                 if(!item.Isdeleted)this.tempList.data.push(item)
//             }
//         }
//         else{
//             this.tempList.data = this.DSParameterList.data;
//         }

// this.getParameterMasterList()
//     }
    
    
}

export class PathparameterMaster {
    parameterId: number;
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
            this.parameterId = PathparameterMaster.parameterId || "";
            this.ParameterShortName = PathparameterMaster.ParameterShortName || "";
            this.ParameterName = PathparameterMaster.ParameterName || "";
            this.MethodName = PathparameterMaster.MethodName || "";
            this.Formula = PathparameterMaster.Formula || "";
            this.PrintParameterName =PathparameterMaster.PrintParameterName || "";
            this.UnitId = PathparameterMaster.UnitId || "";
            this.IsNumeric = PathparameterMaster.IsNumeric || "1";
            this.Isdeleted = PathparameterMaster.Isdeleted || "";
            this.AddedBy = PathparameterMaster.AddedBy || "";
            this.UpdatedBy = PathparameterMaster.UpdatedBy || "";
            this.IsPrintDisSummary = PathparameterMaster.IsPrintDisSummary || "false";
            this.ParaMultipleRange =PathparameterMaster.ParaMultipleRange || "";
            this.IsDeletedSearch = PathparameterMaster.IsDeletedSearch || "";
        }
    }
}

