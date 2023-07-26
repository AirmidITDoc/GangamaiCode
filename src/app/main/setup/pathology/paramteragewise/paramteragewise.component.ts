import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { ParamteragewiseService } from "./paramteragewise.service";
import { ParamteragewiseformComponent } from "./paramteragewiseform/paramteragewiseform.component";

@Component({
    selector: "app-paramteragewise",
    templateUrl: "./paramteragewise.component.html",
    styleUrls: ["./paramteragewise.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParamteragewiseComponent implements OnInit {
    isLoading = true;
    msg: any;
    step = 0;
    AgetypeSearch: string;

    setStep(index: number) {
        this.step = index;
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    displayedColumns: string[] = [
        "PathparaRangeId",
        "ParaId",
        "GenderName",
        "MinAge",
        "MaxAge",
        "AgeType",
        "MinValue",
        "MaxValue",
        "IsDeleted",
        "AddedBy",
        "action",
    ];

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    DSParameterAgewiseMasterList =
        new MatTableDataSource<PathparameterAgeWiseMaster>();

    constructor(
        public _ParameterageService: ParamteragewiseService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getParameterAgeMasterList();
    }

    onSearchClear() {
        this._ParameterageService.myformSearch.reset({
            ParameterIdSearch: "",
            IsDeletedSearch: "2",
        });
    }

    onClear() {
        this._ParameterageService.myform.reset({ IsDeleted: "false" });
        this._ParameterageService.initializeFormGroup();
    }

    onSearch() {
        this.getParameterAgeMasterList();
    }

    getParameterAgeMasterList() {
        var m_data = {
            ParameterId:
                this._ParameterageService.myformSearch.get("ParameterIdSearch")
                    .value || 1,
        };
        this._ParameterageService.getParameterAgeMasterList(m_data).subscribe(
            (Menu) => {
                this.DSParameterAgewiseMasterList.data =
                    Menu as PathparameterAgeWiseMaster[];
                this.isLoading = false;
                this.DSParameterAgewiseMasterList.sort = this.sort;
                this.DSParameterAgewiseMasterList.paginator = this.paginator;
            },
            (error) => (this.isLoading = false)
        );
    }

    onDeactive(ParaId) {
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
                    "Update M_PathParaRangeWithAgeMaster set IsDeleted=1 where PathparaRangeId=" +
                    ParaId;
                console.log(Query);
                this._ParameterageService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getParameterAgeMasterList();
            }
            this.confirmDialogRef = null;
        });
    }

    onEdit(row) {
        console.log(row);
        var m_data = {
            PathparaRangeId: row.PathparaRangeId,
            ParaId: row.ParaId,
            SexId: row.SexId,
            MinAge: row.MinAge,
            MaxAge: row.MaxAge,
            MinValue: row.MinValue.trim(),
            MaxValue: row.MaxValue.trim(),
            AgeType: row.AgeType.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };

        console.log(m_data);
        this._ParameterageService.populateForm(m_data);

        const dialogRef = this._matDialog.open(ParamteragewiseformComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });

        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getParameterAgeMasterList();
        });
    }

    onAdd() {
        const dialogRef = this._matDialog.open(ParamteragewiseformComponent, {
            maxWidth: "80vw",
            maxHeight: "95vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getParameterAgeMasterList();
        });
    }
}

export class PathparameterAgeWiseMaster {
    PathparaRangeId: Number;
    ParaId: Number;
    SexId: Number;
    MinAge: Number;
    MaxAge: Number;
    AgeType: Number;
    MinValue: String;
    MaxValue: String;
    IsDeleted: boolean;
    Addedby: Number;
    Updatedby: Number;

    /**
     * Constructor
     *
     * @param PathparameterAgeWiseMaster
     */
    constructor(PathparameterAgeWiseMaster) {
        {
            this.PathparaRangeId =
                PathparameterAgeWiseMaster.PathparaRangeId || "";
            this.ParaId = PathparameterAgeWiseMaster.ParaId || "";
            this.SexId = PathparameterAgeWiseMaster.SexId || "";
            this.MinAge = PathparameterAgeWiseMaster.MinAge || "";
            this.MaxAge = PathparameterAgeWiseMaster.MaxAge || "";
            this.AgeType = PathparameterAgeWiseMaster.AgeType || "";
            this.MinValue = PathparameterAgeWiseMaster.MinValue || "";
            this.MaxValue = PathparameterAgeWiseMaster.MaxValue || "";
            this.AgeType = PathparameterAgeWiseMaster.AgeType || "";
            this.IsDeleted = PathparameterAgeWiseMaster.IsDeleted || "false";
            this.Addedby = PathparameterAgeWiseMaster.AddedBy || "";
            this.Updatedby = PathparameterAgeWiseMaster.UpdatedBy || "";
        }
    }
}
