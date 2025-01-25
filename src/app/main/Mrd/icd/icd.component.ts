import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MrdService } from "../mrd.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { DatePipe } from "@angular/common";
import { NewicdComponent } from "./newicd/newicd.component";

@Component({
  selector: 'app-icd',
  templateUrl: './icd.component.html',
  styleUrls: ['./icd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IcdComponent implements OnInit {

  sIsLoading: string = '';
  hasSelectedContacts: boolean;
  displayedColumns = [
    'RegNo',
    'PatientName',
    'DoctorName',
    'IPDNo',
    'AdmissionDate',
    'DischargeDate',
    'action'
  ];

  dataSource = new MatTableDataSource<Icddetail>();

  constructor(
    private _fuseSidebarService: FuseSidebarService,
    public _MrdService: MrdService,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<IcdComponent>,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe) { }

  ngOnInit(): void {

  }

  getIcdList() {

  }

  addNewICD() {
    const dialogRef = this._matDialog.open(NewicdComponent,
      {
        maxWidth: "80%",
        width: "100%",
        height: "90%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIcdList();
    });
  }
  onEdit(row) {
    const dialogRef = this._matDialog.open(NewicdComponent,
      {
        maxWidth: "80%",
        width: "100%",
        height: "90%",
        data: {
          Obj: row
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIcdList();
    });
  }
  onClear() {
    this._MrdService.icdForm.reset({
      start: new Date(),
      end: new Date(),
    });
    this.getIcdList();
  }
}
export class Icddetail {
  RegNo: any;
  PatientName: any;
  DoctorName: string;
  IPDNo: any;
  AdmissionDate: any;
  DischargeDate: any;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(Icddetail) {
    {

      this.RegNo = Icddetail.RegNo || '';
      this.PatientName = Icddetail.PatientName || '';
      this.DoctorName = Icddetail.DoctorName || 0;
      this.IPDNo = Icddetail.IPDNo || '';
      this.AdmissionDate = Icddetail.AdmissionDate || '';
      this.DischargeDate = Icddetail.DischargeDate || '';

    }
  }
}
