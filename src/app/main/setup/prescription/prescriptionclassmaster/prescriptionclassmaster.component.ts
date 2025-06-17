import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewPrescriptionClassComponent } from "./new-prescription-class/new-prescription-class.component";
import { PrescriptionclassmasterService } from "./prescriptionclassmaster.service";


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
    className: any = "";
   
      allcolumns = [
            { heading: "Code", key: "classId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ClassName", key: "className", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TemplateDescName", key: "templateDescName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data)
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            
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
        ]
       
        
    allfilters =  [
            { fieldName: "className", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    gridConfig: gridModel = {
        apiUrl: "Priscriptionclass/List",
        columnsList: this.allcolumns,
        sortField: "classId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _PrescriptionclassService: PrescriptionclassmasterService,public _matDialog: MatDialog,
        public toastr : ToastrService,
    ) {}
 //filters addedby avdhoot vedpathak date-28/05/2025
    // Clearfilter(event) {
    //     console.log(event)
    //     if (event == 'TemplateNameSearch')
    //         this._PrescriptionclassService.myformSearch.get('TemplateNameSearch').setValue("")

    //     this.onChangeFirst();
    // }

    // onChangeFirst() {
    //     this.className = this._PrescriptionclassService.myformSearch.get('TemplateNameSearch').value
    //     this.getfilterdata();
    // }

    // getfilterdata() {
    //     debugger
    //     let isActive = this._PrescriptionclassService.myformSearch.get("IsDeletedSearch").value || "";
    //     this.gridConfig = {
    //         apiUrl: "Priscriptionclass/List",
    //         columnsList: this.allcolumns,
    //         sortField: "classId",
    //         sortOrder: 0,
    //         filters: [
    //             { fieldName: "className", fieldValue: this.className, opType: OperatorComparer.Contains },
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
        const dialogRef = this._matDialog.open(NewPrescriptionClassComponent,
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

    ngOnInit(): void { }
  
}
