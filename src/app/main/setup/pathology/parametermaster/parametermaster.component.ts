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
        "Isdeleted",
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
    tempList = new MatTableDataSource<PathparameterMaster>();
    constructor(
        public _ParameterService: ParametermasterService,
        public _matDialog: MatDialog,
        private reportDownloadService: ExcelDownloadService,
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
            ParameterName:this._ParameterService.myformSearch.get("ParameterNameSearch").value.trim() + "%" || "%",
            IsDeleted: this._ParameterService.myformSearch.get("IsDeletedSearch").value || 0
        };
      
        this._ParameterService.getParameterMasterList(m_data).subscribe((Menu) => {
            this.DSParameterList.data = Menu as PathparameterMaster[];
            console.log( this.DSParameterList.data )
            this.isLoading = false;
            this.DSParameterList.sort = this.sort;
            this.DSParameterList.paginator = this.paginator;
            this.sIsLoading = '';
            console.log(this.DSParameterList.data);
        },
            error => {
                this.sIsLoading = '';
            });
    }


    onDeactive(row,ParameterID) {
        Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Active Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
          }).then((result) => {
            let Query;
            if (result.isConfirmed) {
                if(row.Isdeleted){
                 Query =
                "Update M_PathParameterMaster set Isdeleted=0 where ParameterID=" +
                    ParameterID;
                console.log(Query);
                }else{
                     Query =
                    "Update M_PathParameterMaster set Isdeleted=1 where ParameterID=" +
                        ParameterID;
                }

                this._ParameterService.deactivateTheStatus(Query)
                  .subscribe((data) => {
                        // Handle success response
                        Swal.fire('Changed!', 'Parameter Status has been Changed.', 'success');
                       
                      }, (error) => {
                        // Handle error response
                        Swal.fire('Error!', 'Failed to Change  Parameter status.', 'error');
                      });
            }
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

        this._ParameterService.getTableData(row.ParameterID).subscribe((data) => {
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
            this._ParameterService.populateForm(m_data);
            const dialogRef = this._matDialog.open(ParameterFormMasterComponent, {
            maxWidth: "75vw",
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
        })
    }

    onAdd() {

        const dialogRef = this._matDialog.open(ParameterFormMasterComponent, {
            maxWidth: "70vw",
            maxHeight: "80vh",
            width: "100%",
            height: "100%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getParameterMasterList();
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
    
    exportParameterExcel(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['ParameterID', 'ParameterShortName','ParameterName','PrintParameterName', 'UnitId','IsNumeric','MethodName','Isdeleted', 'AddedBy', 'UpdatedBy'];
    this.reportDownloadService.getExportJsonData(this.DSParameterList.data, exportHeaders, 'Pathology Parameter');
    this.DSParameterList.data = [];
    this.sIsLoading = '';
  }

  exportReportPdf() {
    let actualData = [];
    this.DSParameterList.data.forEach(e => {
      var tempObj = [];
      tempObj.push(e.ParameterID);
      tempObj.push(e.ParameterShortName);
      tempObj.push(e.ParameterName);
      tempObj.push(e.PrintParameterName);
      tempObj.push(e.UnitId);
      tempObj.push(e.IsNumeric);
      tempObj.push(e.MethodName);
      tempObj.push(e.Isdeleted);
      tempObj.push(e.AddedBy);
      
      actualData.push(tempObj);
    });
    let headers = [['ParameterID', 'ParameterShortName','ParameterName','PrintParameterName','UnitId','MethodName', 'Isdeleted', 'AddedBy', 'UpdatedBy']];
    this.reportDownloadService.exportPdfDownload(headers, actualData, 'Pathology Parameter');
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
            this.MethodName = PathparameterMaster.MethodName || "";
            this.PrintParameterName =PathparameterMaster.PrintParameterName || "";
            this.UnitId = PathparameterMaster.UnitId || "";
            this.IsNumeric = PathparameterMaster.IsNumeric || "false";
            this.Isdeleted = PathparameterMaster.Isdeleted || "";
            this.AddedBy = PathparameterMaster.AddedBy || "";
            this.UpdatedBy = PathparameterMaster.UpdatedBy || "";
            this.IsPrintDisSummary = PathparameterMaster.IsPrintDisSummary || "false";
            this.ParaMultipleRange =PathparameterMaster.ParaMultipleRange || "";
            this.IsDeletedSearch = PathparameterMaster.IsDeletedSearch || "";
        }
    }
}

