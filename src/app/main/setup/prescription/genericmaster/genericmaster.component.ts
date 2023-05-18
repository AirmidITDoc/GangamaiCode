import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { GenericmasterService } from "./genericmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-genericmaster",
    templateUrl: "./genericmaster.component.html",
    styleUrls: ["./genericmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenericmasterComponent implements OnInit {
    GenericMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "GenericId",
        "GenericName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSGenericMasterList = new MatTableDataSource<GenericMaster>();

    constructor(
        public _GenericService: GenericmasterService,
       
    ) {}

    ngOnInit(): void {
        this.getGenericMasterList();
    }
    onSearch() {
      this.getGenericMasterList();
  }

  onSearchClear() {
      this._GenericService.myformSearch.reset({
          PrefixNameSearch: "",
          IsDeletedSearch: "2",
      });
  }
    getGenericMasterList() {
        this._GenericService
            .getGenericMasterList()
            .subscribe(
                (Menu) => (this.DSGenericMasterList.data = Menu as GenericMaster[])
            );
    }

    onClear() {
        this._GenericService.myForm.reset({ IsDeleted: "false" });
        this._GenericService.initializeFormGroup();
    }

    onSubmit() {
        if (this._GenericService.myForm.valid) {
            if (!this._GenericService.myForm.get("GenericId").value) {
                var m_data = {
                    insertGenericMaster: {
                        GenericName: this._GenericService.myForm
                            .get("GenericName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._GenericService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                      
                    },
                };
                this._GenericService
                    .insertGenericMaster(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        this.getGenericMasterList();
                    });
               
            } else {
                var m_dataUpdate = {
                    updateGenericMaster: {
                        GenericId:
                            this._GenericService.myForm.get("GenericId").value,
                        GenericName: this._GenericService.myForm
                            .get("GenericName")
                            .value.trim(),

                        IsDeleted: Boolean(
                            JSON.parse(
                                this._GenericService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                       
                    },
                };
                this._GenericService
                    .updateGenericMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        this.getGenericMasterList();
                    });
                
            }
            this.onClear();
        }
    }
    onEdit(row) {
       
        var m_data1 = {
            GenericId: row.GenericId,
            GenericName: row.GenericName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._GenericService.populateForm(m_data1);
    }
}

export class GenericMaster {
    GenericId: number;
    GenericName: string;

    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param GenericMaster
     */
    constructor(GenericMaster) {
        {
            this.GenericId = GenericMaster.GenericId || "";
            this.GenericName = GenericMaster.GenericName || "";

            this.IsDeleted = GenericMaster.IsDeleted || "false";
            this.AddedBy = GenericMaster.AddedBy || "";
            this.UpdatedBy = GenericMaster.UpdatedBy || "";
            this.AddedByName = GenericMaster.AddedByName || "";
        }
    }
}
