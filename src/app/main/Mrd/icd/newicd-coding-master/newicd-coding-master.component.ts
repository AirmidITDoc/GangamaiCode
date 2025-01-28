import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { IcdcodeFormService } from "./icdcode-form.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { IcdcodeFormComponent } from "./icdcode-form/icdcode-form.component";

@Component({
  selector: 'app-newicd-coding-master',
  templateUrl: './newicd-coding-master.component.html',
  styleUrls: ['./newicd-coding-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewicdCodingMasterComponent implements OnInit {

  sIsLoading: string = '';
  hasSelectedContacts: boolean;

  displayedColumns: string[] = [
    "Code",
    "ICDCode",
    "ICDCodeName",
    "MainCName",
    "isActive",
    "action",
  ];
  dsCodingMaster = new MatTableDataSource<IcdcodingMaster>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _newCodingService: IcdcodeFormService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewicdCodingMasterComponent>,
  ) { }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  ngOnInit(): void {
    this.getCodingMasterList();
  }

  getCodingMasterList() {
    const icdCode = this._newCodingService.myCodingForm.get("ICDCodeSearch").value || '';
    const icdCodeName = this._newCodingService.myCodingForm.get("ICDCodeNameSearch").value || '';

    const D_data = {
      "ICDCode": icdCode.trim() ? icdCode + '%' : '%',
      "ICDCodeName": icdCodeName.trim() ? icdCodeName + '%' : '%',
    };

    console.log("TypeList:", D_data);
    this._newCodingService.geticdCodingMasterList(D_data).subscribe((Menu) => {
      this.dsCodingMaster.data = Menu as IcdcodingMaster[];
      this.dsCodingMaster.sort = this.sort;
      this.dsCodingMaster.paginator = this.paginator;
    });
  }

  newCoding() {
    const dialogRef = this._matDialog.open(IcdcodeFormComponent,
      {
        maxWidth: "40%",
        width: "100%",
        height: "50%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCodingMasterList();
    });
  }

  OnEdit(contact) {
    const dialogRef = this._matDialog.open(IcdcodeFormComponent,
      {
        maxWidth: "40%",
        width: "100%",
        height: "50%",
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCodingMasterList();
    });
  }

  onDeactive(ICDCodingId) {
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
        const tableItem = this.dsCodingMaster.data.find(item => item.ICDCodingId === ICDCodingId);
        console.log("table:", tableItem)

        if (tableItem.IsActive) {
          Query = "Update M_ICDCodingMaster set IsActive=0 where ICDCodingId=" + ICDCodingId;
        } else {
          Query = "Update M_ICDCodingMaster set IsActive=1 where ICDCodingId=" + ICDCodingId;
        }

        console.log("query:", Query);

        this._newCodingService.deactivateTheStatus(Query)
          .subscribe(
            (data) => {
              Swal.fire('Changed!', 'ICD Coding Status has been Changed.', 'success');
              this.getCodingMasterList();
            },
            (error) => {
              Swal.fire('Error!', 'Failed to deactivate category.', 'error');
            }
          );
      }

    });
  }

  onClose() {
    this.dialogRef.close();
  }

  onClear() {
    this._newCodingService.myCodingForm.reset({
      IsDeleted: true,
      ICDCodeNameSearch: ''
    });
    this.getCodingMasterList();
  }

}

export class IcdcodingMaster {
  ICDCodingId: number;
  MainName: string;
  ICDDescription: string;
  IsActive: boolean;

  /**
   * Constructor
   *
   * @param IcdcodingMaster
   */
  constructor(IcdcodingMaster) {
    {
      this.ICDCodingId = IcdcodingMaster.ICDCodingId || "";
      this.MainName = IcdcodingMaster.MainName || "";
      this.ICDDescription = IcdcodingMaster.ICDDescription || "";
      this.IsActive = IcdcodingMaster.IsActive || "false";
    }
  }
}
