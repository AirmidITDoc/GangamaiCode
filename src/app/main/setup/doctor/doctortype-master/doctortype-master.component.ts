import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { DoctortypeMasterService } from "./doctortype-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: "app-doctortype-master",
    templateUrl: "./doctortype-master.component.html",
    styleUrls: ["./doctortype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DoctortypeMasterComponent implements OnInit {
    isLoading = true;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = ["Id", "DoctorType", "IsDeleted", "action"];

    DSDoctorTypeMasterList = new MatTableDataSource<DoctortypeMaster>();

    constructor(public _doctortypeService: DoctortypeMasterService) {}

    ngOnInit(): void {
        this.getDoctortypeMasterList();
    }

    getDoctortypeMasterList() {
        this._doctortypeService.getDoctortypeMasterList().subscribe((Menu) => {
            this.DSDoctorTypeMasterList.data = Menu as DoctortypeMaster[];
            this.DSDoctorTypeMasterList.sort = this.sort;
            this.DSDoctorTypeMasterList.paginator = this.paginator;
        });
    }
    onSearch() {
        this.getDoctortypeMasterList();
    }

    onSearchClear() {
        this._doctortypeService.myformSearch.reset({
            DoctorTypeSearch: "",
            IsDeletedSearch: "2",
        });
    }
    onClear() {
        this._doctortypeService.myform.reset({ IsDeleted: "false" });
        this._doctortypeService.initializeFormGroup();
    }

    onSubmit() {
        if (this._doctortypeService.myform.valid) {
            if (!this._doctortypeService.myform.get("Id").value) {
                var m_data = {
                    doctortTypeMasterInsert: {
                        doctorType: this._doctortypeService.myform
                            .get("DoctorType")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._doctortypeService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._doctortypeService
                    .doctortTypeMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getDoctortypeMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    doctorTypeMasterUpdate: {
                        id: this._doctortypeService.myform.get("Id").value,
                        doctorType:
                            this._doctortypeService.myform.get("DoctorType")
                                .value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._doctortypeService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._doctortypeService
                    .doctorTypeMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getDoctortypeMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            Id: row.Id,
            DoctorType: row.DoctorType.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
        };
        this._doctortypeService.populateForm(m_data);
    }
}

export class DoctortypeMaster {
    Id: number;
    DoctorType: string;
    IsDeleted: boolean;
    /**
     * Constructor
     *
     * @param DoctortypeMaster
     */
    constructor(DoctortypeMaster) {
        {
            this.Id = DoctortypeMaster.Id || "";
            this.DoctorType = DoctortypeMaster.DoctorType || "";
            this.IsDeleted = DoctortypeMaster.IsDeleted || "false";
        }
    }
}
