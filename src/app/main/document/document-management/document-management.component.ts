import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { DocumentManagementService } from "./document-management.service";

@Component({
    selector: "app-document-management",
    templateUrl: "./document-management.component.html",
    styleUrls: ["./document-management.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DocumentManagementComponent implements OnInit {
    ParentDataList: any;
    msg: any;
    IsLoading: string = '';
    docList : any = [];
    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatPaginator) paginator: MatPaginator;

    // displayedColumns: string[] = [
    //     "CashCounterId",
    //     "CashCounterName",
    //     "Prefix",
    //     "BillNo",
    //     // "AddedBy",
    //     "IsDeleted",
    //     "action",
    // ];

    // DSDocManagementList = new MatTableDataSource<DocumentManagementComponent>();

    constructor(public _documentManagementService: DocumentManagementService,
        public toastr : ToastrService,) {
            this._documentManagementService.initializeFormGroup();
            this._documentManagementService.myform.reset({ IsDeleted: "true" });
        }

    ngOnInit(): void {
        this.getConfigList();
    }
    getConfigList() {
        this.IsLoading = 'loading-data';
        
        this._documentManagementService.documentnanagemenList().subscribe(doc => {
          this.docList = doc;
          this.IsLoading = '';
        },
          error => {
            this.IsLoading = '';
          });
    }
    // onSearch() {
    //     this.getDocManagementList();
    // }

    // onSearchClear() {
    //     this._documentManagementService.myformSearch.reset({
    //         CashCounterNameSearch: "",
    //         IsDeletedSearch: "2",
    //     });
    //     this.getDocManagementList();
    // }
    // getDocManagementList() {
    //     var param = {
    //         CashCounterName:
    //             this._documentManagementService.myformSearch
    //                 .get("CashCounterNameSearch")
    //                 .value.trim() || "%",
    //     };
    //     this._documentManagementService
    //         .getdocumentnanagementList(param)
    //         .subscribe((Menu) => {
    //             this.DSDocManagementList.data = Menu as DocumentManagement[];
    //             this.DSDocManagementList.sort = this.sort;
    //             this.DSDocManagementList.paginator = this.paginator;
    //             console.log(this.DSDocManagementList);
    //         });
    // }

    onClear() {
        this._documentManagementService.myform.reset({ IsDeleted: "false" });
        this._documentManagementService.initializeFormGroup();
    }

    onSubmit() {
        if (this._documentManagementService.myform.valid) {
            if (!this._documentManagementService.myform.get("Id").value) {
                var m_data = {
                    insertDocumentTypeMaster: {
                        upId: this._documentManagementService.myform
                        .get("UpId")
                        .value,
                        docType: this._documentManagementService.myform
                            .get("DocType")
                            .value.trim(),
                        shortCode: this._documentManagementService.myform
                            .get("ShortCode")
                            .value.trim(),
                        isActive: Boolean(
                            JSON.parse(
                                this._documentManagementService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._documentManagementService
                    .documentnanagementInsert(m_data)
                    .subscribe((response) => {
                        this.msg = response;
                        if (response) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                             // this.getDocManagementList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getDocManagementList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Document Type Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                    },error => {
                        this.toastr.error('Document Type Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateDocumentTypeMaster: {
                        Id:
                            this._documentManagementService.myform.get("Id")
                                .value,
                        docType:
                            this._documentManagementService.myform.get(
                                "DocType"
                            ).value,

                        isActive: Boolean(
                            JSON.parse(
                                this._documentManagementService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._documentManagementService
                    .documentnanagementUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getConfigList();
                           // this.getDocManagementList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getDocManagementList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Document Type Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        //this.getDocManagementList();
                    },error => {
                        this.toastr.error('Document Type Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            Id: row.Id,
            UpId: row.UpId,
            DocType: row.DocType,
            ShortCode: row.ShortCode,
            IsDeleted: JSON.stringify(row.IsDeleted),
            // UpdatedBy: row.UpdatedBy,
        };
        this._documentManagementService.populateForm(m_data);
    }
}

export class DocumentManagement {
    Id: number;
    UpId: number;
    DocType: string;
    ShortCode: string;
    IsDeleted: boolean;
    // AddedBy: number;
    // UpdatedBy: number;

    /**
     * Constructor
     *
     * @param DocumentManagement
     */
    constructor(DocumentManagement) {
        {
            this.Id = DocumentManagement.Id || "";
            this.UpId = DocumentManagement.UpId || "";
            this.DocType = DocumentManagement.DocType || "";
            this.ShortCode = DocumentManagement.ShortCode || "";
            this.IsDeleted = DocumentManagement.IsDeleted || "false";
            //  this.AddedBy = DocumentManagement.AddedBy || "";
            // this.UpdatedBy = DocumentManagement.UpdatedBy || "";
        }
    }
}
