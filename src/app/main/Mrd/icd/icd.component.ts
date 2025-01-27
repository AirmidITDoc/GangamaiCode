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
import { NewgroupMasterComponent } from "./newgroup-master/newgroup-master.component";
import { NewicdCodingMasterComponent } from "./newicd-coding-master/newicd-coding-master.component";

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
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns = [
    'RegNo',
    'PatientName',
    'AdmissionDate',
    'DischargeDate',
    'DoctorName',
    'IPDNo',
    'WardName',
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
    this.getPatientICDList();
  }

  getPatientICDList() {
    debugger
    this.sIsLoading = 'loading-data';
    const FromDate = this._MrdService.icdForm.get("start").value;
    const ToDate = this._MrdService.icdForm.get("end").value;
    const RegNo = this._MrdService.icdForm.get("uhidNo").value;

    // Prepare request payload
    const D_data = {
      "FromDate": this.datePipe.transform(FromDate, "MM-dd-yyyy") || "01/01/1900", // Default date if not set
      "ToDate": this.datePipe.transform(ToDate, "MM-dd-yyyy") || "01/01/1900", // Default date if not set
      "Reg_No": RegNo || '',
    };

    console.log("Request Payload:", D_data);

    // Make API call
    this._MrdService.getPatienticdList(D_data).subscribe(
      (response) => {
        console.log("API Response:", response);

        if (response && Array.isArray(response)) {
          // Update the data source and bind to the table
          this.dataSource.data = response as Icddetail[];
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        } else {
          console.error("Invalid data format received:", response);
        }
        // Clear loading state
        this.sIsLoading = '';
      },
      (error) => {
        console.error("Error Fetching Data:", error);
        this.sIsLoading = ''; // Clear loading state on error
      }
    );
  }

  addNewICD() {
    const dialogRef = this._matDialog.open(NewicdComponent,
      {
        maxWidth: "90%",
        width: "100%",
        height: "90%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getPatientICDList();
    });
  }
  addGroupmaster() {
    const dialogRef = this._matDialog.open(NewgroupMasterComponent,
      {
        maxWidth: "80%",
        width: "100%",
        height: "90%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getPatientICDList();
    });
  }
  addNewICDCodeMaster() {
    const dialogRef = this._matDialog.open(NewicdCodingMasterComponent,
      {
        maxWidth: "80%",
        width: "100%",
        height: "90%",
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getPatientICDList();
    });
  }
  onEdit(row) {
    const dialogRef = this._matDialog.open(NewicdComponent,
      {
        maxWidth: "90%",
        width: "100%",
        height: "90%",
        data: {
          Obj: row
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getPatientICDList();
    });
  }
  onClear() {
    this._MrdService.icdForm.reset({
      start: new Date(),
      end: new Date(),
    });
    this.getPatientICDList();
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
