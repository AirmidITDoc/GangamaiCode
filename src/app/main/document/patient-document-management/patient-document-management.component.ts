import {
    Component,
    ElementRef,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { DocumentManagementService } from "../document-management.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DocData } from "app/main/opd/appointment/appointment.component";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";

@Component({
    selector: "app-patient-document-management",
    templateUrl: "./patient-document-management.component.html",
    styleUrls: ["./patient-document-management.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PatientDocumentManagementComponent implements OnInit {
    ParentDataList: any;
    msg: any;
    IsLoading: string = "";
    docList: any = [];

    // upload document
    doclist: any = [];
    Filename: any;
    noOptionFound: boolean = false;
    noOptionFound1: boolean = false;
    RegNo: any = 0;
    // Document Upload
    personalFormGroup: FormGroup;
    title = "file-upload";
    images: any[] = [];
    docs: any[] = [];
    docsArray: DocData[] = [];
    filteredOptions: any;
    showOptions: boolean = false;
    IsPathRad: any;
    PatientName: any = "";
    RegId: any = 0;
    OPIP: any = "";
    CompanyId: any = 0;
    VisitId: any;
    imgDataSource = new MatTableDataSource<any>();
    isRegIdSelected1: boolean = false;

    constructor(
        public _documentManagementService: DocumentManagementService,
        private formBuilder: FormBuilder,
        public toastr: ToastrService
    ) {
        this._documentManagementService.initializeFormGroup();
        this._documentManagementService.myform.reset({ IsDeleted: "true" });
    }

    ngOnInit(): void {
        this.getConfigList();
        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup.markAsUntouched();
    }
    createPesonalForm() {
        return this.formBuilder.group({
            RegId: "",

            PrefixId: "",
            PrefixID: "",
            FirstName: [
                "",
                [
                    Validators.required,
                    Validators.maxLength(50),
                    // Validators.pattern("^[a-zA-Z._ -]*$"),
                    Validators.pattern("^[a-zA-Z () ]*$"),
                ],
            ],
            MiddleName: ["", []],
            LastName: ["", [Validators.required]],
            GenderId: "",
            Address: "",
            AgeYear: [
                "",
                [Validators.required, Validators.pattern("^[0-9]*$")],
            ],
            AgeMonth: ["", Validators.pattern("[0-9]+")],
            AgeDay: ["", Validators.pattern("[0-9]+")],
            PhoneNo: [
                "",
                [
                    Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            MobileNo: [
                "",
                [
                    Validators.required,
                    Validators.pattern("^[0-9]*$"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            AadharCardNo: [""],
            PanCardNo: [
                "",
                [
                    Validators.pattern("/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/"),
                    Validators.minLength(10),
                    Validators.maxLength(10),
                ],
            ],
            MaritalStatusId: "",
            ReligionId: "",
            AreaId: "",
            CityId: "",
            StateId: "",
            CountryId: "",
        });
    }
    public handleKeyboardEvent(event: MatAutocompleteSelectedEvent): void {
        if (event.source.isOpen) {
            (
                (event.option as any)._element as ElementRef
            ).nativeElement.scrollIntoView();
        }
    }
    getConfigList() {
        this.IsLoading = "loading-data";

        this._documentManagementService.documentnanagemenList().subscribe(
            (doc) => {
                this.docList = doc;
                this.IsLoading = "";
            },
            (error) => {
                this.IsLoading = "";
            }
        );
    }
    getSearchDocuploadPatientList() {
        var m_data = {
            Keyword: `${this.personalFormGroup.get("RegId").value}%`,
        };
        this._documentManagementService
            .getDocPatientRegList(m_data)
            .subscribe((data) => {
                this.filteredOptions = data;
                if (this.filteredOptions.length == 0) {
                    this.noOptionFound1 = true;
                } else {
                    this.noOptionFound1 = false;
                }
            });
    }
    getPatientSelectedObj(obj) {
        this.PatientName =
            obj.FirstName + " " + obj.MiddleName + " " + obj.LastName;
        this.RegId = obj.RegID;
        this.VisitId = obj.VisitId;

        this.getdocumentList(this.VisitId);
    }

    getdocumentList(VisitId) {
        this.images = [];
        let query =
            "SELECT * FROM PatientDocumentMaster WHERE Id= " +
            VisitId +
            " AND PId=0";
        this._documentManagementService
            .getuploadeddocumentsList(query)
            .subscribe((resData: any) => {
                if (resData.length > 0) {
                    Swal.fire("Documents Already Uploaded");
                    for (let i = 0; i < resData.length; i++) {
                        this.images.push({
                            url: "",
                            name: resData[i].FileName,
                            Id: resData[i].ID,
                        });
                    }
                    this.imgDataSource.data = this.images;
                    this.imgDataSource.data.forEach((currentValue, index) => {
                        if (currentValue.Id > 0) {
                            if (currentValue.name.endsWith(".pdf")) {
                                this._documentManagementService
                                    .getfile(currentValue.Id)
                                    .subscribe((resFile: any) => {
                                        if (resFile.file)
                                            currentValue.url =
                                                "data:application/pdf;base64," +
                                                resFile.file;
                                    });
                            } else {
                                this._documentManagementService
                                    .getfile(currentValue.Id)
                                    .subscribe((resFile: any) => {
                                        if (resFile.file)
                                            currentValue.url =
                                                "data:image/jpg;base64," +
                                                resFile.file;
                                    });
                            }
                        }
                    });
                }
            });
    }
    getPatientOptionText(option) {
        if (!option) return "";
        return (
            option.FirstName + " " + option.LastName + " (" + option.RegNo + ")"
        );
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
                        upId: this._documentManagementService.myform.get("UpId")
                            .value,
                        docType: this._documentManagementService.myform
                            .get("DocType")
                            .value.trim(),
                        shortCode: this._documentManagementService.myform
                            .get("ShortCode")
                            .value.trim(),
                        isActive: Boolean(
                            JSON.parse(
                                this._documentManagementService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };
                this._documentManagementService
                    .documentnanagementInsert(m_data)
                    .subscribe(
                        (response) => {
                            this.msg = response;
                            if (response) {
                                this.toastr.success(
                                    "Record Saved Successfully.",
                                    "Saved !",
                                    {
                                        toastClass:
                                            "tostr-tost custom-toast-success",
                                    }
                                );
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
                                this.toastr.error(
                                    "Document Type Data not saved !, Please check API error..",
                                    "Error !",
                                    {
                                        toastClass:
                                            "tostr-tost custom-toast-error",
                                    }
                                );
                            }
                        },
                        (error) => {
                            this.toastr.error(
                                "Document Type Data not saved !, Please check API error..",
                                "Error !",
                                {
                                    toastClass: "tostr-tost custom-toast-error",
                                }
                            );
                        }
                    );
            } else {
                var m_dataUpdate = {
                    updateDocumentTypeMaster: {
                        Id: this._documentManagementService.myform.get("Id")
                            .value,
                        docType:
                            this._documentManagementService.myform.get(
                                "DocType"
                            ).value,

                        isActive: Boolean(
                            JSON.parse(
                                this._documentManagementService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._documentManagementService
                    .documentnanagementUpdate(m_dataUpdate)
                    .subscribe(
                        (data) => {
                            this.msg = data;
                            if (data) {
                                this.toastr.success(
                                    "Record updated Successfully.",
                                    "updated !",
                                    {
                                        toastClass:
                                            "tostr-tost custom-toast-success",
                                    }
                                );
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
                                this.toastr.error(
                                    "Document Type Data not updated !, Please check API error..",
                                    "Error !",
                                    {
                                        toastClass:
                                            "tostr-tost custom-toast-error",
                                    }
                                );
                            }
                            //this.getDocManagementList();
                        },
                        (error) => {
                            this.toastr.error(
                                "Document Type Data not updated !, Please check API error..",
                                "Error !",
                                {
                                    toastClass: "tostr-tost custom-toast-error",
                                }
                            );
                        }
                    );
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
