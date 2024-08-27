import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from '../advance';
import { MatDialog } from '@angular/material/dialog';
import { CompanyListService } from './company-list.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Admission } from '../Admission/admission/admission.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { CompanyBillComponent } from '../ip-search-list/company-bill/company-bill.component';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class CompanyListComponent implements OnInit {
  displayedColumns = [
    'button',
    'IsBillGenerated',
    'IsMLC',
    'RegNo',
    'PatientName',
    'DOA',
    'IPDNo',
    'Doctorname',
    'RefDocName',
    'PatientType',
    'CompanyName',
    'buttons1',
    'buttons'
  ];

  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = '';
  click: boolean = false;
  isChecked: boolean = false;
  hasSelectedContacts: boolean;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  
  dataSource = new MatTableDataSource<Admission>();
  dataSource1 = new MatTableDataSource<AdvanceDetailObj>();
  
  menuActions: Array<string> = [];
  constructor(
    public _CompanyListService: CompanyListService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored
  ) { }

  ngOnInit(): void {
    this.getAdmittedPatientList();
    if (this._ActRoute.url == '/ipd/companylist') {
      this.menuActions.push('Company Bill'); 
    }
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  get f() { return this._CompanyListService.myFilterform.controls; }
  resultsLength = 0;
  getAdmittedPatientList() {

    if (this._CompanyListService.myFilterform.get("IsDischarge").value == "0" || this._CompanyListService.myFilterform.get("IsDischarge").value == false) {
      this.isLoadingStr = 'loading';
      var D_data = {
        "F_Name": this._CompanyListService.myFilterform.get("FirstName").value + '%' || "%",
        "L_Name": this._CompanyListService.myFilterform.get("LastName").value + '%' || "%",
        "Reg_No": this._CompanyListService.myFilterform.get("RegNo").value || 0,
        "Doctor_Id": this._CompanyListService.myFilterform.get("DoctorId").value || 0,
        "From_Dt": this.datePipe.transform(this._CompanyListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
        "To_Dt": this.datePipe.transform(this._CompanyListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
        "Admtd_Dschrgd_All": this._CompanyListService.myFilterform.get('IsDischarge').value || 0,
        "M_Name": this._CompanyListService.myFilterform.get("MiddleName").value + '%' || "%",
        "IPNo": this._CompanyListService.myFilterform.get("IPDNo").value || 0,
        Start: (this.paginator?.pageIndex ?? 0),
        Length: (this.paginator?.pageSize ?? 35),
      }

      setTimeout(() => {
        this.isLoadingStr = 'loading';
        this._CompanyListService.getAdmittedPatientList_1(D_data).subscribe(data => {
          this.dataSource.data = data["Table1"] ?? [] as Admission[];
           console.log(this.dataSource.data)
          this.dataSource.sort = this.sort;
          this.resultsLength = data["Table"][0]["total_row"];
          this.sIsLoading = '';
        },
          error => {
            this.sIsLoading = '';
          });
      }, 1000);
    } else {
      this.isLoadingStr = 'loading';
      var Params = {
        "F_Name": this._CompanyListService.myFilterform.get("FirstName").value + '%' || "%",
        "L_Name": this._CompanyListService.myFilterform.get("LastName").value + '%' || "%",
        "M_Name": this._CompanyListService.myFilterform.get("MiddleName").value + '%' || "%",
        "Reg_No": this._CompanyListService.myFilterform.get("RegNo").value || 0,
        "Doctor_Id": this._CompanyListService.myFilterform.get("DoctorId").value || 0,
        "From_Dt": this.datePipe.transform(this._CompanyListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
        "To_Dt": this.datePipe.transform(this._CompanyListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
        "Admtd_Dschrgd_All": this._CompanyListService.myFilterform.get('IsDischarge').value,
        "IPNo": this._CompanyListService.myFilterform.get("IPDNo").value || 0,
        Start: (this.paginator?.pageIndex ?? 0),
        Length: (this.paginator?.pageSize ?? 35),
      }
      setTimeout(() => {
        this.isLoadingStr = 'loading';
        this._CompanyListService.getDischargedPatientList_1(Params).subscribe(data => {
          // this.dataSource.data = data as Admission[];
          this.dataSource.data = data["Table1"] ?? [] as Admission[];
          console.log(this.dataSource.data)
          this.dataSource.sort = this.sort;
          this.resultsLength = data["Table"][0]["total_row"];
          // this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
          this.sIsLoading = '';
          // this.click = false;
        },
          error => {
            this.sIsLoading = '';
          });
      }, 1000);

    } 
  }
  getRecord(contact, m): void { 
    if(contact.CompanyId){
      if (m == "Company Bill") {
        // let m_data = {
        //   RegNo: contact.RegNo,
        //   RegId: contact.RegID,
        //   AdmissionID: contact.AdmissionID,
        //   OPD_IPD_ID: contact.OPD_IPD_Id,
        //   PatientName: contact.PatientName,
        //   Doctorname: contact.Doctorname,
        //   AdmDateTime: contact.AdmDateTime,
        //   AgeYear: contact.AgeYear,
        //   ClassId: contact.ClassId,
        //   TariffName: contact.TariffName,
        //   TariffId: contact.TariffId,
        //   DoctorId: contact.DoctorId,
        //   DOA: contact.DOA,
        //   DOT: contact.DOT,
        //   DoctorName: contact.DoctorName,
        //   RoomName: contact.RoomName,
        //   BedNo: contact.BedName,
        //   IPDNo: contact.IPDNo,
        //   DocNameID: contact.DocNameID,
        //   opD_IPD_Typec: contact.opD_IPD_Type,
        //   CompanyName: contact.CompanyName
        // }
  
        this.advanceDataStored.storage = new AdvanceDetailObj(contact); 
        if (!contact.IsBillGenerated) {
        const dialogRef = this._matDialog.open(CompanyBillComponent,
          {
            maxWidth: "90%",
            width: '98%',
            height: '95%',
          });
        dialogRef.afterClosed().subscribe(result => {
          this.getAdmittedPatientList();
        });
        }else Swal.fire("Bill already Generated")
      }
    }
   else{
     // Swal.fire('Selected Patient is not company patient')

      Swal.fire({
        title: 'Selected Patient is not company patient',
        text: "Please Select Compnay Patient!",
        icon: "warning",  
        cancelButtonColor: "#d33",
        confirmButtonText: "Ok" 
      });
    }
  }
 
  onClear() {
  
    this._CompanyListService.myFilterform.reset();
    this._CompanyListService.myFilterform.get("IsDischarge").setValue(0);
    this._CompanyListService.myFilterform.get("FirstName").setValue('');
    this._CompanyListService.myFilterform.get("MiddleName").setValue('');
    this._CompanyListService.myFilterform.get("LastName").setValue('');
    this.getAdmittedPatientList();
  }
  IsDischarge: any;
  onChangeIsactive(SiderOption) {
    this.IsDischarge = SiderOption.checked;
    if (SiderOption.checked == true) {
      this._CompanyListService.myFilterform.get('IsDischarge').setValue(1);
      this._CompanyListService.myFilterform.get('start').setValue((new Date()).toISOString());
      this._CompanyListService.myFilterform.get('end').setValue((new Date()).toISOString());
    }
    else {
      this._CompanyListService.myFilterform.get('IsDischarge').setValue(0);
      this._CompanyListService.myFilterform.get('start').setValue(''),
        this._CompanyListService.myFilterform.get('end').setValue('')
    }
  }
  printDischargeslip(contact) {
    console.log(contact)
    this._CompanyListService.getIpDischargeReceipt(
      contact.AdmissionID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "CHECK OUT SLIP Viewer"
          }
        });
    });
  }


  printDischargesummary(contact) {

    this._CompanyListService.getIpDischargesummaryReceipt(
      contact.AdmissionID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Discharge SummaryViewer"
          }
        });
    });
  }
}
