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
    
        var D_data = {
          "FromDate":this.datePipe.transform(this._MrdService.icdForm.get("start").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
          "ToDate": this.datePipe.transform(this._MrdService.icdForm.get("end").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
          "Reg_No":this._MrdService.icdForm.get("RegNo").value || 0
        };
    
        console.log("PatientList:", D_data);

        console.log("FromDate:", this.datePipe.transform(this._MrdService.icdForm.get("start").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900");
        console.log("todate:", this.datePipe.transform(this._MrdService.icdForm.get("end").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900");
        this._MrdService.getPatienticdList(D_data).subscribe(Menu=>{      
          this.dataSource.data = Menu as Icddetail[];
          this.dataSource.sort = this.sort;
          console.log("PatientList:", this.dataSource.data);
          this.dataSource.paginator = this.paginator;
        });
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
  WardName:any;
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
      this.WardName = Icddetail.WardName || '';
      this.AdmissionDate = Icddetail.DOA || '';
      this.DischargeDate = Icddetail.DOD || '';

    }
  }
}
