import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { InstructionmasterService } from "./instructionmaster.service";
import Swal from "sweetalert2";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewInstructionMasterComponent } from "./new-instruction-master/new-instruction-master.component";

@Component({
    selector: "app-instructionmaster",
    templateUrl: "./instructionmaster.component.html",
    styleUrls: ["./instructionmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class InstructionmasterComponent implements OnInit {

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    
    constructor(public _InstructionService: InstructionmasterService,public _matDialog: MatDialog,
        public toastr : ToastrService) {}
    
    gridConfig: gridModel = {
        apiUrl: "InstructionMastere/List",
        columnsList: [
            { heading: "Code", key: "instructionId", sort: true, align: 'left', emptySign: 'NA', width:100  },
            { heading: "Instruction Name", key: "instructionDescription", sort: true, align: 'left', emptySign: 'NA', width:600 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center", width:200  },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:250, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                debugger
                                if (result) {
                                    let that = this;
                                    this._InstructionService.deactivateTheStatus(data.instructionId).subscribe((data: any) => {
                                    this.toastr.success(data.message)
                                    that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "instructionId",
        sortOrder: 0,
        filters: [
            { fieldName: "instructionName", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "1", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    
    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewInstructionMasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
                data:row
            });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                that.grid.bindGridData();
            }

        });
    }

    InstructionMasterList: any;
    sIsLoading:string= '';
    msg: any;

    displayedColumns: string[] = [
        "InstructionId",
        "InstructionName",
        "IsDeleted",
        "action",
    ];

    // DSInstructionMasterList = new MatTableDataSource<InstructionMaster>();


    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    ngOnInit(): void {
    }
    onSearch() {
    }

    onSearchClear() {
        this._InstructionService.myformSearch.reset({
            InstructionNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    // getInstructionMasterList() {
    //     this.sIsLoading = 'loading-data';
    //     var param = {
    //         InstructionName:this._InstructionService.myformSearch.get("InstructionNameSearch")
    //                 .value.trim() + "%" || "%",
    //     };
    //     this._InstructionService.getInstructionMasterList(param).subscribe((Menu) => {
    //         this.DSInstructionMasterList.data = Menu as InstructionMaster[];
    //         this.DSInstructionMasterList.sort = this.sort;
    //         this.DSInstructionMasterList.paginator = this.paginator;
    //         this.sIsLoading = '';
    //     },
    //     error => {
    //       this.sIsLoading = '';
    //     });
                  
           
    // }
   
    onClear() {
        this._InstructionService.myForm.reset({ IsDeleted: "false" });
        this._InstructionService.initializeFormGroup();
    }

    // onSubmit() {
    //     if (this._InstructionService.myForm.valid) {
    //         if (!this._InstructionService.myForm.get("InstructionId").value) {
    //             var m_data = {
    //                 insertInstructionMaster: {
    //                     instructionName: this._InstructionService.myForm
    //                         .get("InstructionName")
    //                         .value.trim(),

    //                     isActive: Boolean(
    //                         JSON.parse(
    //                             this._InstructionService.myForm.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                     // addedBy: 1,
    //                 },
    //             };
    //             this._InstructionService
    //                 .insertInstructionMaster(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = m_data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                         this.getInstructionMasterList();
    //                         // Swal.fire(
    //                         //     "Saved !",
    //                         //     "Record saved Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getInstructionMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('Instruction Master Data not saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getInstructionMasterList();
    //                 },error => {
    //                     this.toastr.error('Instruction Class Data not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  });
    //         } else {
    //             var m_dataUpdate = {
    //                 updateInstructionMaster: {
    //                     instructionId:
    //                         this._InstructionService.myForm.get("InstructionId")
    //                             .value,
    //                     instructionName: this._InstructionService.myForm
    //                         .get("InstructionName")
    //                         .value.trim(),

    //                     isActive: Boolean(
    //                         JSON.parse(
    //                             this._InstructionService.myForm.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                     // updatedBy: 1,
    //                 },
    //             };
    //             this._InstructionService
    //                 .updateInstructionMaster(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = m_dataUpdate;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                         this.getInstructionMasterList();
    //                         // Swal.fire(
    //                         //     "Updated !",
    //                         //     "Record updated Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getInstructionMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('Instruction Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getInstructionMasterList();
    //                 },error => {
    //                     this.toastr.error('Instruction Class Data not updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  });
    //         }
    //         this.onClear();
    //     }
    // }

    onEdit(row) {
        var m_data1 = {
            InstructionId: row.InstructionId,
            InstructionName: row.InstructionName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._InstructionService.populateForm(m_data1);
    }
}
export class InstructionMaster {
    InstructionId: number;
    InstructionName: string;

    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param InstructionMaster
     */
    constructor(InstructionMaster) {
        {
            this.InstructionId = InstructionMaster.InstructionId || "";
            this.InstructionName = InstructionMaster.InstructionName || "";

            this.IsDeleted = InstructionMaster.IsDeleted || "false";
            this.AddedBy = InstructionMaster.AddedBy || "";
            this.UpdatedBy = InstructionMaster.UpdatedBy || "";
        }
    }
}
