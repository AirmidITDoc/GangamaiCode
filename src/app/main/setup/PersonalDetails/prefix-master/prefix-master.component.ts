import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { PrefixMasterService } from "./prefix-master.service";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-prefix-master",
    templateUrl: "./prefix-master.component.html",
    styleUrls: ["./prefix-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PrefixMasterComponent implements OnInit {
    GendercmbList: any = [];

    displayedColumns: string[] = [
        "PrefixID",
        "PrefixName",
        "GenderName",
        // "AddedByName",
        "IsDeleted",
        "action",
    ];

    dsPrefixMasterList = new MatTableDataSource<PrefixMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _PrefixService: PrefixMasterService) {}

    ngOnInit(): void {
        this.getPrefixMasterList();
        this.getGenderNameCombobox();
    }

    onSearch() {
        this.getPrefixMasterList();
    }

    onSearchClear() {
        this._PrefixService.myformSearch.reset({
            PrefixNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    getGenderNameCombobox() {
        this._PrefixService
            .getGenderMasterCombo()
            .subscribe((data) => (this.GendercmbList = data));
    }

    getPrefixMasterList() {
        var Param = {
            PrefixName:
                this._PrefixService.myformSearch
                    .get("PrefixNameSearch")
                    .value.trim() + "%" || "%",
            // p_IsDeleted:
            //     this._PrefixService.myformSearch.get("IsDeletedSearch").value,
        };
        this._PrefixService.getPrefixMasterList(Param).subscribe((Menu) => {
            this.dsPrefixMasterList.data = Menu as PrefixMaster[];
            this.dsPrefixMasterList.sort = this.sort;
            this.dsPrefixMasterList.paginator = this.paginator;
        });
    }

    onSubmit() {}

    onClear() {}
}

export class PrefixMaster {
    PrefixID: number;
    PrefixName: string;
    SexID: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;
    IsDeletedSearch: number;
    /**
     * Constructor
     *
     * @param PrefixMaster
     */
    constructor(PrefixMaster) {
        {
            this.PrefixID = PrefixMaster.PrefixID || 0;
            this.PrefixName = PrefixMaster.PrefixName || "";
            this.SexID = PrefixMaster.SexID || 0;
            this.IsDeleted = PrefixMaster.IsDeleted || "false";
            this.AddedBy = PrefixMaster.AddedBy || 0;
            this.UpdatedBy = PrefixMaster.UpdatedBy || 0;
            this.AddedByName = PrefixMaster.AddedByName || "";
            this.IsDeletedSearch = PrefixMaster.IsDeletedSearch || "2";
        }
    }
}
