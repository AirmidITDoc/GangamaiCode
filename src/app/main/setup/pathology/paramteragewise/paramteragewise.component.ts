import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatAccordion } from "@angular/material/expansion";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
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
     @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
        gridConfig: gridModel = {
            apiUrl: "PathCategoryMaster/List",
            columnsList: [
                { heading: "ParameterID", key: "ParameterID",  sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ParameterName", key: "ParameterName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ParameterShortName", key: "ParameterShortName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "PrintParameterName", key: "PrintParameterName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "UnitName", key: "UnitName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IsNumeric", key: "IsNumeric", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IsPrintDisSummary", key: "IsPrintDisSummary", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "AddedBy", key: "AddedBy", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
                {
                    heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                        {
                            action: gridActions.edit, callback: (data: any) => {
                                this.onSave(data);
                            }
                        }, {
                            action: gridActions.delete, callback: (data: any) => {
                                this._ParameterageService.deactivateTheStatus(data.categoryId).subscribe((response: any) => {
                                    this.toastr.success(response.message);
                                    this.grid.bindGridData();
                                });
                            }
                        }]
                } //Action 1-view, 2-Edit,3-delete
            ],
            sortField: "categoryId",
            sortOrder: 0,
            filters: [
                { fieldName: "categoryName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ]
        }
    
        ngOnInit(): void {
    
        }
    
        onSave(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
            
            let that = this;
            const dialogRef = this._matDialog.open(ParamteragewiseformComponent,
                {
                    maxWidth: "45vw",
                    height: '35%',
                    width: '70%',
                    data: row
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    that.grid.bindGridData();
                }
            });
        }

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
        public _ParameterageService: ParamteragewiseService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
                public toastr: ToastrService,
    ) { }

    // ngOnInit(): void {
    //     this.getParameterMasterList();
    // }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
      }
    onSearchClear() {
        this._ParameterageService.myformSearch.reset({
            ParameterNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getParameterMasterList();
    }
    onSearch() {
        this.getParameterMasterList();
    }
    onClear() {
        this._ParameterageService.myform.reset({ IsDeleted: "false" });
        this._ParameterageService.initializeFormGroup();
    }

    getParameterMasterList() {
        this.sIsLoading = 'loading-data';
        var m_data = {
            ParameterName:
                this._ParameterageService.myformSearch.get("ParameterNameSearch").value.trim() + "%" || "%",
        };
        this._ParameterageService.getParameterMasterList(m_data).subscribe((Menu) => {
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


    onDeactive(row,ParameterID) {
       
        Swal.fire({
            title: 'Do you want to Change Active Status Paramter',
             showCancelButton: true,
            confirmButtonText: 'OK',
      
          }).then((flag) => {
            let Query ;
            if (flag.isConfirmed) {
                if(row.Isdeleted){
                 Query =
                "Update M_PathParameterMaster set Isdeleted=0 where ParameterID=" +
                    ParameterID;
                console.log(Query);
                }else{
                     Query =
                    "Update M_PathParameterMaster set Isdeleted=1 where ParameterID=" +
                        ParameterID;
                    console.log(Query);
                }
                this._ParameterageService.deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getParameterMasterList();
            }
          });

    }

    onEdit1(row) {
        var m_data = {
            ParameterID: row.ParameterID,
            ParameterShortName: row.ParameterShortName.trim(),
            ParameterName: row.ParameterName.trim(),
            PrintParameterName: row.PrintParameterName.trim(),
            UnitId: row.UnitId,
            UnitName:row.UnitName,
            IsNumeric: JSON.stringify(row.IsNumericParameter),
            IsDeleted: JSON.stringify(row.Isdeleted),
            UpdatedBy: row.UpdatedBy,
            IsPrintDisSummary: JSON.stringify(row.IsPrintDisSummary),
            MethodName: row.MethodName,
            ParaMultipleRange: row.ParaMultipleRange,
        };
        console.log(row)
        console.log(m_data)
        

        this._ParameterageService.populateForm(m_data);

        const dialogRef = this._matDialog.open(ParamteragewiseformComponent, {
            maxWidth: "70vw",
            maxHeight: "95vh",
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

      
        this._ParameterageService.getTableData(row.ParameterID).subscribe((data) => {
                ;
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
            console.log(m_data)
            this._ParameterageService.populateForm1(m_data);
            const dialogRef = this._matDialog.open(ParamteragewiseformComponent, {
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
            this.getParameterMasterList();
        });
        })
    }
    onAdd() {
        const dialogRef = this._matDialog.open(ParamteragewiseformComponent, {
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
    Isdeleted: boolean;
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
            this.Isdeleted = PathparameterMaster.Isdeleted || "false";
            this.AddedBy = PathparameterMaster.AddedBy || "";
            this.UpdatedBy = PathparameterMaster.UpdatedBy || "";
            this.IsPrintDisSummary = PathparameterMaster.IsPrintDisSummary || "false";
            this.ParaMultipleRange =PathparameterMaster.ParaMultipleRange || "";
            this.IsDeletedSearch = PathparameterMaster.IsDeletedSearch || "";
        }
    }
}
