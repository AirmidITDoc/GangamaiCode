import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { OTManagementServiceService } from '../ot-management-service.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { NewRequestComponent } from './new-request/new-request.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-ot-request',
  templateUrl: './ot-request.component.html',
  styleUrls: ['./ot-request.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OTRequestComponent implements OnInit {

  
  sIsLoading: string = '';
  isLoading = true;
  searchFormGroup: FormGroup;
  click: boolean = false;
  MouseEvent = true;
  patientName: any;
  OPIPNo: any;
  D_data1: any;
  dataArray = {};
  hasSelectedContacts: boolean;

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  

  
  displayedColumns: string[] = [

    'status',  
    'OTbookingDateTime',
    'Patientname',
    'SurgeonName',
    'SurgeryCategoryName',
    'SiteDesc',
    'SurgeryName',
    'DepartmentName',
    'AddedBy',
    'action'
  ];
  dataSource = new MatTableDataSource<Requestlist>();

  // @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,  
    public _OtManagementService: OTManagementServiceService, 
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService, ) 
    {  }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.getRequestList();
    // this.onEdit();
  }

  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      SurgeryType: ['0'],
    });
  } 
  getRequestList() { 
    this.sIsLoading = 'loading-data';
    var m_data = {
      "FromDate": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2022-03-28 00:00:00.000',
      "ToDate": this.datePipe.transform(this.searchFormGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '2022-03-28 00:00:00.000',
    }
    console.log(m_data);
    this._OtManagementService.getOTRequestList(m_data).subscribe(Visit => {
       this.dataSource.data = Visit as Requestlist[];
      console.log(this.dataSource.data);
       this.dataSource.sort = this.sort;
       this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }

  CancleOTBooking(contact) {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');  
    
    Swal.fire({
      title: 'Do you want to cancel the OT Booking?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!"
    }).then((flag) => {
      debugger
      if (flag.isConfirmed) {
        let bookingcancle = {};
        bookingcancle['otRequestId'] = contact.OTRequestId;
        bookingcancle['isCancelled'] = 1;
        bookingcancle['isCancelledBy'] = this.accountService.currentUserValue.user.id;
    
        let submitData = {
          "cancelOTBookingRequestParam": bookingcancle,
        }; 
        console.log("cancelOTBookingRequestParam:",submitData); 
        this.isLoading = true; 
        this._OtManagementService.BookingCancle(submitData).subscribe(
          (response) => {
            if (response) {
              this.toastr.success('Record Cancelled Successfully.', 'Cancelled!', {
                toastClass: 'tostr-tost custom-toast-success',
              });
            } else {
              this.toastr.error('Record Data not Cancelled! Please check API error..', 'Error!', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
            this.getRequestList();
  
            this.isLoading = false;
          },
          (error) => {
            
            this.toastr.error('An error occurred while canceling the appointment.', 'Error!', {
              toastClass: 'tostr-tost custom-toast-error',
            });
            this.isLoading = false;
          }
        );
      } else {
        this.getRequestList();
      }
    });
  }

  getPrint() {

  }

  NewTestRequest() {
    const dialogRef = this._matDialog.open(NewRequestComponent,
      {
        maxWidth: '80%',
        height: '90%',
        width: '100%',
        // height: "100%"
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getRequestList();
     });
  }
  OnEdit(contact){
    const dialogRef = this._matDialog.open(NewRequestComponent,
      {
        maxWidth: '80%',
        height: '90%',
        width: '100%',
        data: {
          Obj: contact
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getRequestList();
     });
  }

  onShow(event: MouseEvent) { 
    this.click = !this.click; 
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data'; 
        this.getRequestList();
      }

    }, 50);
    this.MouseEvent = true;
    this.click = true;

  }
  onEdit(contact) {
    // debugger;
    console.log(contact);
    let PatInforObj = {};
    PatInforObj['RegNo'] = contact.RegNo, 
      PatInforObj['PatientName'] = contact.PatientName,
      PatInforObj['GenderName'] = contact.GenderName,

      PatInforObj['OTbookingDate'] = contact.OTRequestDate,
      PatInforObj['OTbookingTime'] = contact.OTRequestTime,
      PatInforObj['RoomName'] = contact.RoomName,
      PatInforObj['BedId'] = contact.BedId,
      PatInforObj['OP_IP_Id'] = contact.OP_IP_Id,
      PatInforObj['AdmittingDoctor'] = contact.AdmittingDoctor,

      PatInforObj['SurgeonName'] = contact.SurgeonName,
      PatInforObj['SurgeryCategoryName'] = contact.SurgeryCategoryName,
      PatInforObj['SurgeryType'] = contact.SurgeryType,
      PatInforObj['DepartmentId'] = contact.DepartmentId,
      //  PatInforObj['DepartmentId'] = contact.CategoryId,
      PatInforObj['SurgeonId'] = contact.SurgeonId,
      PatInforObj['RoomId'] = contact.RoomId,
      PatInforObj['OTBookingId'] = contact.OTRequestId,
      PatInforObj['SurgeryId'] = contact.SurgeryId,
      PatInforObj['CategoryId'] = contact.SurgeryCategoryId,


      console.log(PatInforObj);


    this._OtManagementService.populateFormpersonal(PatInforObj);

    this.advanceDataStored.storage = new Requestlist(PatInforObj);

    const dialogRef = this._matDialog.open(NewRequestComponent,
      {
        maxWidth: "70%",
        height: '70%',
        width: '100%',
        data: {
          PatObj: PatInforObj
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);

    });
    // if (contact) this.dialogRef.close(PatInforObj);
  }


  onClear() {
    this.searchFormGroup.reset({
      start: new Date(),
      end: new Date(),

    });
    this.getRequestList();
  }
}



export class Requestlist {
  OTRequestId: any;
  RegNo: any;
  PatientName: String;
  FirstName:string;
  MiddleName:string;
  LastName:string;
  RegID:any;
  AdmissionID:any;
  RoomName: any;
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
  IsCancelledBy: any;
  WardName: any;
  WardId:any;
  OPDNo: any;
  IPDNo:any;
  CompanyName: any;
  TariffName: any;
  OP_IP_MobileNo: any;
  DoctorName: any;
  AgeYear:any;
  MobileNo:any;
  Age:any;
  SiteDescId:any;
  SurgeryCategoryId:any;
  OTRequestDate:any;
  OTRequestTime:any;
  IsCancelled:any;
  OP_IP_Type:any;
  SurgeryType:any;
  OTbookingDateTime:any;
  SurgeonName:any;

  constructor(Requestlist) {
    this.OTRequestId = Requestlist.OTRequestId || 0;
    this.RegNo = Requestlist.RegNo || '';
    this.PatientName = Requestlist.PatientName || '';
    this.RoomName = Requestlist.RoomName || '';
    this.OTRequestDate = Requestlist.OTRequestDate || '';
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
    this.OTRequestTime = Requestlist.OTRequestTime || 0;
    this.IsCancelledBy = Requestlist.IsCancelledBy || 0;
    this.WardName = Requestlist.WardName || '';
    this.WardId = Requestlist.WardId || 0;
    this.MobileNo=Requestlist.MobileNo || 0;
    this.OPDNo = Requestlist.OPDNo || 0;
    this.IPDNo = Requestlist.IPDNo || 0;
    this.CompanyName = Requestlist.CompanyName || '';
    this.TariffName = Requestlist.TariffName || '';
    this.OP_IP_MobileNo = Requestlist.OP_IP_MobileNo || 0;
    this.DoctorName = Requestlist.DoctorName || '';    
    this.AgeYear = Requestlist.AgeYear || '';
    this.Age = Requestlist.Age || '';
    this.FirstName=Requestlist.FirstName || '';
    this.MiddleName=Requestlist.MiddleName || '';
    this.LastName=Requestlist.LastName || '';
    this.RegID=Requestlist.RegID || '';
    this.AdmissionID=Requestlist.AdmissionID || '';
    this.SiteDescId=Requestlist.SiteDescId || '';
    this.SurgeryCategoryId=Requestlist.SurgeryCategoryId || ''
  }
}


// export NODE_OPTIONS="--max-old-space-size=7168" # Increases to 7 GB
// export NODE_OPTIONS="--max-old-space-size=8192" # Increases to 8 GB
