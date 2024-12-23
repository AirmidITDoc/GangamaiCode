import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { PrescriptionclassmasterService } from "./prescriptionclassmaster.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewPrescriptionClassComponent } from "./new-prescription-class/new-prescription-class.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-prescriptionclassmaster",
    templateUrl: "./prescriptionclassmaster.component.html",
    styleUrls: ["./prescriptionclassmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrescriptionclassmasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "Priscriptionclass/List",
        columnsList: [
            { heading: "Code", key: "classId", sort: true, align: 'left', emptySign: 'NA', width:150 },
            { heading: "Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width:800 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width:100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:100, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data)
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            debugger
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage =
                                "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                debugger
                                if (result) {
                                    let that=this;
                                    this._PrescriptionclassService.deactivateTheStatus(data.classId).subscribe((data: any) => {
                                        this.toastr.success(data.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "classId",
        sortOrder: 0,
        filters: [
            { fieldName: "className", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(
        public _PrescriptionclassService: PrescriptionclassmasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,
    ) {}

    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewPrescriptionClassComponent,
            {
                maxWidth: "45vw",
                height: '30%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit(): void {
       
    }
  
    onSearchClear() {
        this._PrescriptionclassService.myformSearch.reset({
            TemplateNameSearch: "",
            IsDeletedSearch: "2",
        });
       
    }
   
    onSearch() {
       
    }
     
    onClear() {
        this._PrescriptionclassService.prescriptionForm.reset({ IsDeleted: "false" });
        this._PrescriptionclassService.initializeFormGroup();
    }

  
    onEdit(row) {
        // console.log(row);
        var m_data1 = {
            classId: row.classId,
            TemplateName: row.TemplateName.trim(),
            TemplateDesc: row.TemplateDesc.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._PrescriptionclassService.populateForm(m_data1);
    }

    // changeStatus(status: any) {
    //     switch (status.id) {
    //         case 1:
    //             //this.onEdit(status.data)
    //             break;
    //         case 2:
    //             this.onEdit(status.data)
    //             break;
    //         // case 5:
    //         //     this.onDeactive(status.data.classId);
    //         //     break;
    //         default:
    //             break;
    //     }
    // }
}
export class PrescriptionClassMaster {
    classId: number;
    className: string;
    // TemplateDesc: string;
    isActive: boolean;
    // AddedBy: number;
    // UpdatedBy: number;
    // AddedByName: string;

    /**
     * Constructor
     *
     * @param PrescriptionClassMaster
     */
    constructor(PrescriptionClassMaster) {
        {
            this.classId = PrescriptionClassMaster.classId || "";
            this.className = PrescriptionClassMaster.className || "";
            // this.TemplateDesc = PrescriptionClassMaster.TemplateDesc || "";
            this.isActive = PrescriptionClassMaster.isActive || "false";
            // this.AddedBy = PrescriptionClassMaster.AddedBy || "";
            // this.UpdatedBy = PrescriptionClassMaster.UpdatedBy || "";
            // this.AddedByName = PrescriptionClassMaster.AddedByName || "";
        }
    }
}
