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
    "ICDCode",
    "MainName",
    "ICDDescription",
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

  }

  newCoding() {

  }

  OnEdit(contact) {

  }

  onDeactive(ICDCode) {

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
  ICDCode: number;
  MainName: string;
  ICDDescription: string;
  isActive: boolean;

  /**
   * Constructor
   *
   * @param IcdcodingMaster
   */
  constructor(IcdcodingMaster) {
    {
      this.ICDCode = IcdcodingMaster.ICDCode || "";
      this.MainName = IcdcodingMaster.MainName || "";
      this.ICDDescription = IcdcodingMaster.ICDDescription || "";
      this.isActive = IcdcodingMaster.isActive || "false";
    }
  }
}
