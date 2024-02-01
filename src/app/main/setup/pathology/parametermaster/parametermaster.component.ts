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

@Component({
    selector: "app-parametermaster",
    templateUrl: "./parametermaster.component.html",
    styleUrls: ["./parametermaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParametermasterComponent implements OnInit {
    displayedColumns: string[] = [
        "ParameterID",
        "ParameterName",
        "ParameterShortName",
        "PrintParameterName",
        "UnitName",
        "IsNumeric",
        "IsPrintDisSummary",
        // "MethodName",
        //"ParaMultipleRange",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    isLoading = true;
    sIsLoading: string = '';
    msg: any;
    step = 0;
    SearchName: string;

    setStep(index: number) {
        this.step = index;
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;



    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DSParameterList = new MatTableDataSource<PathparameterMaster>();

    constructor(
        public _ParameterService: ParametermasterService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.getParameterMasterList();
    }

    onSearchClear() {
        this._ParameterService.myformSearch.reset({
            ParameterNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getParameterMasterList();
    }
    onSearch() {
        this.getParameterMasterList();
    }
    onClear() {
        this._ParameterService.myform.reset({ IsDeleted: "false" });
        this._ParameterService.initializeFormGroup();
    }

    getParameterMasterList() {
        this.sIsLoading = 'loading-data';
        var m_data = {
            ParameterName:
                this._ParameterService.myformSearch.get("ParameterNameSearch").value.trim() + "%" || "%",
        };
        this._ParameterService.getParameterMasterList(m_data).subscribe((Menu) => {
            this.DSParameterList.data = Menu as PathparameterMaster[];
            this.isLoading = false;
            this.DSParameterList.sort = this.sort;
            this.DSParameterList.paginator = this.paginator;
            this.sIsLoading = '';
            console.log(this.DSParameterList);
        },
            error => {
                this.sIsLoading = '';
            });
    }


    onDeactive(ParameterID) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let Query =
                "Update M_PathParameterMaster set Isdeleted=0 where ParameterID=" +
                    ParameterID;
                console.log(Query);
                this._ParameterService.deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getParameterMasterList();
            }
            this.confirmDialogRef = null;
        });
        this.getParameterMasterList();
    }

    onEdit(row) {
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
        };
        console.log(row)
        

        this._ParameterService.populateForm(m_data);

        const dialogRef = this._matDialog.open(ParameterFormMasterComponent, {
            maxWidth: "70vw",
            maxHeight: "80vh",
            width: "100%",
            height: "100%",
            data : {
                registerObj : row,
              }
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getParameterMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(ParameterFormMasterComponent, {
            maxWidth: "70vw",
            maxHeight: "90vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getParameterMasterList();
        });
    }
}

export class PathparameterMaster {
    ParameterID: number;
    ParameterShortName: string;
    ParameterName: string;
    PrintParameterName: string;
    UnitId: number;
    IsNumeric: Number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    IsPrintDisSummary: boolean;
    MethodName: string;
    ParaMultipleRange: string;

    IsDeletedSearch: number;
    /**
     * Constructor
     *
     * @param PathparameterMaster
     */
    constructor(PathparameterMaster) {
        {
            this.ParameterID = PathparameterMaster.ParameterID || "";
            this.ParameterShortName = PathparameterMaster.ParameterShortName || "";
            this.ParameterName = PathparameterMaster.ParameterName || "";
            this.PrintParameterName =PathparameterMaster.PrintParameterName || "";
            this.UnitId = PathparameterMaster.UnitId || "";
            this.IsNumeric = PathparameterMaster.IsNumeric || "false";
            this.IsDeleted = PathparameterMaster.IsDeleted || "false";
            this.AddedBy = PathparameterMaster.AddedBy || "";
            this.UpdatedBy = PathparameterMaster.UpdatedBy || "";
            this.IsPrintDisSummary = PathparameterMaster.IsPrintDisSummary || "false";
            this.ParaMultipleRange =PathparameterMaster.ParaMultipleRange || "";
            this.IsDeletedSearch = PathparameterMaster.IsDeletedSearch || "";
        }
    }
}

// export class PathDescriptiveMaster {
//     DescriptiveID: number;
//     ParameterId: number;
//     ParameterValues: String;
//     IsDefaultValue: boolean;
//     AddedBy: number;
//     UpdatedBy: number;
//     DefaultValue: String;
//     /**
//      * Constructor
//      *
//      * @param PathDescriptiveMaster
//      */
//     constructor(PathDescriptiveMaster) {
//         {
//             this.DescriptiveID = PathDescriptiveMaster.DescriptiveID || "";
//             this.ParameterId = PathDescriptiveMaster.ParameterId || "";
//             this.ParameterValues = PathDescriptiveMaster.ParameterValues || "";
//             this.IsDefaultValue = PathDescriptiveMaster.IsDefaultValue || "";
//             this.AddedBy = PathDescriptiveMaster.AddedBy || "";
//             this.UpdatedBy = PathDescriptiveMaster.UpdatedBy || "";
//             this.DefaultValue = PathDescriptiveMaster.DefaultValue || "";
//         }
//     }
// }

// export class PathParaRangeMaster {
//     PathparaRangeId: bigint;
//     ParaId: bigint;
//     SexId: bigint;
//     MinValue: String;
//     Maxvalue: String;
//     IsDeleted: boolean;
//     Addedby: bigint;
//     Updatedby: bigint;
//     /**
//      * Constructor
//      *
//      * @param PathParaRangeMaster
//      */
//     constructor(PathParaRangeMaster) {
//         {
//             this.PathparaRangeId = PathParaRangeMaster.PathparaRangeId || "";
//             this.ParaId = PathParaRangeMaster.ParaId || "";
//             this.SexId = PathParaRangeMaster.SexId || "";
//             this.MinValue = PathParaRangeMaster.MinValue || "";
//             this.Maxvalue = PathParaRangeMaster.Maxvalue || "";
//             this.IsDeleted = PathParaRangeMaster.IsDeleted || "";
//             this.Addedby = PathParaRangeMaster.Addedby || "";
//             this.Updatedby = PathParaRangeMaster.Updatedby || "";
//         }
//     }
// }
