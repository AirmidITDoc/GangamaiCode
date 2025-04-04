import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'; 
import { OTManagementServiceService } from '../../ot-management-service.service'; 
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table'; 
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';  


@Component({
  selector: 'app-get-otrequet',
  templateUrl: './get-otrequet.component.html',
  styleUrls: ['./get-otrequet.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class GetOTRequetComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _OtManagementService: OTManagementServiceService, 
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<GetOTRequetComponent>,
    public datePipe: DatePipe 
  ){ } 

  displayedColumns: string[] = [ 
    'SurgeryType', 
    'UHID',
    'OTbookingDateTime',
    'Patientname',
    'SurgeonName',
    'SurgeryCategoryName',
    'SiteDesc',
    'SurgeryName'
  ];


  dataSource = new MatTableDataSource<getRequestlist>();

  ngOnInit(): void {
    this.getRequestListInReservation();
  }

  getRequestListInReservation() {
    const FromDate = this._OtManagementService.otreservationFormGroup.get("start").value;
    const ToDate = this._OtManagementService.otreservationFormGroup.get("end").value;
    const D_data = {
      "FromDate": this.datePipe.transform(FromDate, "MM-dd-yyyy") || "01/01/1900", // Default date if not set
      "ToDate": this.datePipe.transform(ToDate, "MM-dd-yyyy") || "01/01/1900", // Default date if not set
    };
    console.log("Request Payload:", D_data);

    this.sIsLoading = 'loading-data';
    this._OtManagementService.getOTRequestListInReser(D_data).subscribe(Visit => {
      this.dataSource.data = Visit as getRequestlist[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  onRowClick(row) {
    console.log('data row:',row)
    this.dialogRef.close(row);
  }

  onClose() {
    this._OtManagementService.otreservationFormGroup.reset({
      start: new Date(),
      end: new Date(),
    })
    this.dialogRef.close();
  }

}
export class getRequestlist {
  OTBookingId: any;
  RegNo: any;
  PatientName: String;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  RegID: any;
  AdmissionID: any;
  RoomName: any;
  OTbookingDate: any;
  BedName: any;
  OP_IP_Id: any;
  SurgeonId: any;
  SurgeryId: any;
  DoctorId: any;
  DepartmentId: any;
  CategoryId: any;
  RoomId: any;
  BedId: any;
  GenderId: any;
  AdmittingDoctor: any;
  SurgeryCategoryName: any;
  DepartmentName: any;
  AddedBy: any;
  UpdateBy: any;
  GenderName: any;
  OTbookingTime: any;
  IsCancelledBy: any;
  WardName: any;
  WardId: any;
  OPDNo: any;
  IPDNo: any;
  CompanyName: any;
  TariffName: any;
  OP_IP_MobileNo: any;
  DoctorName: any;
  AgeYear: any;
  MobileNo: any;
  Age: any;
  SiteDescId: any;
  SurgeryCategoryId: any;

  IsCancelled: any;
  OP_IP_Type: any;
  SurgeryType: any;
  OTbookingDateTime: any;
  SurgeonName: any;

  constructor(Requestlist) {
    this.OTBookingId = Requestlist.OTBookingId || 0;
    this.RegNo = Requestlist.RegNo || '';
    this.PatientName = Requestlist.PatientName || '';
    this.RoomName = Requestlist.RoomName || '';
    this.OTbookingDate = Requestlist.OTbookingDate || '';
    this.BedName = Requestlist.BedName || 0;
    this.OP_IP_Id = Requestlist.OP_IP_Id || 0;
    this.OP_IP_Type = Requestlist.OP_IP_Type || '';
    this.SurgeonId = Requestlist.SurgeonId || '';
    this.SurgeryId = Requestlist.SurgeryId || 0;
    this.DoctorId = Requestlist.DoctorId || 0;
    this.DepartmentId = Requestlist.DepartmentId || '';
    this.CategoryId = Requestlist.CategoryId || '';
    this.RoomId = Requestlist.RoomId || '';
    this.BedId = Requestlist.BedId || 0;
    this.GenderId = Requestlist.GenderId || 0;
    this.AdmittingDoctor = Requestlist.AdmittingDoctor || '';
    this.SurgeonName = Requestlist.SurgeonName || '';
    this.SurgeryCategoryName = Requestlist.SurgeryCategoryName || '';
    this.SurgeryType = Requestlist.SurgeryType || 0;
    this.AddedBy = Requestlist.AddedBy || 0;
    this.UpdateBy = Requestlist.UpdateBy || '';
    this.IsCancelled = Requestlist.IsCancelled || '';
    this.GenderName = Requestlist.GenderName || '';
    this.OTbookingTime = Requestlist.OTbookingTime || 0;
    this.IsCancelledBy = Requestlist.IsCancelledBy || 0;
    this.WardName = Requestlist.WardName || '';
    this.WardId = Requestlist.WardId || 0;
    this.MobileNo = Requestlist.MobileNo || 0;
    this.OPDNo = Requestlist.OPDNo || 0;
    this.IPDNo = Requestlist.IPDNo || 0;
    this.CompanyName = Requestlist.CompanyName || '';
    this.TariffName = Requestlist.TariffName || '';
    this.OP_IP_MobileNo = Requestlist.OP_IP_MobileNo || 0;
    this.DoctorName = Requestlist.DoctorName || '';
    this.AgeYear = Requestlist.AgeYear || '';
    this.Age = Requestlist.Age || '';
    this.FirstName = Requestlist.FirstName || '';
    this.MiddleName = Requestlist.MiddleName || '';
    this.LastName = Requestlist.LastName || '';
    this.RegID = Requestlist.RegID || '';
    this.AdmissionID = Requestlist.AdmissionID || '';
    this.SiteDescId = Requestlist.SiteDescId || '';
    this.SurgeryCategoryId = Requestlist.SurgeryCategoryId || ''
  }
}