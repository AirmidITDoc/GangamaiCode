import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NewgroupMasterService } from "./newgroup-master.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { GroupformComponent } from "./groupform/groupform.component";

@Component({
  selector: 'app-newgroup-master',
  templateUrl: './newgroup-master.component.html',
  styleUrls: ['./newgroup-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewgroupMasterComponent implements OnInit {

  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  displayedColumns: string[] = [
    "Code",
    "ICDCodeName",
    "isActive",
    "action",
  ];
  dsGroupMasterList = new MatTableDataSource<IcdgroupMaster>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _groupService: NewgroupMasterService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewgroupMasterComponent>,
  ) { }

  ngOnInit(): void {
    this.getGroupMasterList();
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}

  getGroupMasterList() {
    const icdCodeName = this._groupService.myGroupForm.get("ICDCodeNameSearch").value || '';
  
    const D_data = {
      "ICDCodeName": icdCodeName.trim() ? icdCodeName + '%' : '%', // Use '%' if search is empty
    };
  
    console.log("TypeList:", D_data);
    this._groupService.geticdGroupMasterList(D_data).subscribe((Menu) => {
      this.dsGroupMasterList.data = Menu as IcdgroupMaster[];
      this.dsGroupMasterList.sort = this.sort;
      this.dsGroupMasterList.paginator = this.paginator;
    });
  }

  newGroup() {
    const dialogRef = this._matDialog.open(GroupformComponent,
      {
        maxWidth: "40%",
        width: "100%",
        height: "35%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getGroupMasterList();
    });
  }

  OnEdit(contact) {
    const dialogRef = this._matDialog.open(GroupformComponent,
      {
        maxWidth: "40%",
        width: "100%",
        height: "35%",
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getGroupMasterList();
    });
  }

  onDeactive(ICDCdeMId){
 Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
        }).then((result) => {
            debugger

            if (result.isConfirmed) {
                let Query;
                const tableItem = this.dsGroupMasterList.data.find(item => item.ICDCdeMId === ICDCdeMId);
                console.log("table:", tableItem)

                if (tableItem.isActive) {
                    Query = "Update M_ICDCdeheadMaster set IsActive=0 where ICDCdeMId=" + ICDCdeMId;
                } else {
                    Query = "Update M_ICDCdeheadMaster set IsActive=1 where ICDCdeMId=" + ICDCdeMId;
                }

                console.log("query:", Query);

                this._groupService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'Group Master Status has been Changed.', 'success');
                            this.getGroupMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
  }

  onClose(){
    this.dialogRef.close();
  }

  onClear() {
    this._groupService.myGroupForm.reset({
      IsDeleted: true,
      ICDCodeNameSearch: ''
    });
    this.getGroupMasterList();
  }

}
export class IcdgroupMaster {
  ICDCdeMId: number;
  ICDCodeName: string;
  isActive: boolean;

  /**
   * Constructor
   *
   * @param IcdgroupMaster
   */
  constructor(IcdgroupMaster) {
    {
      this.ICDCdeMId = IcdgroupMaster.ICDCdeMId || "";
      this.ICDCodeName = IcdgroupMaster.ICDCodeName || "";
      this.isActive = IcdgroupMaster.isActive || "false";
    }
  }
}
