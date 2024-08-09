import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { DischargeCancelService } from './discharge-cancel.service';
import { element } from 'protractor';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-discharge-cancel',
  templateUrl: './discharge-cancel.component.html',
  styleUrls: ['./discharge-cancel.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DischargeCancelComponent implements OnInit {

  displayedColumns = [ 
    'DOA', 
    'RegNo',
    'PatientName',
    'Age',
    'Doctorname', 
    'IPNo',
    'CompanyName',
    'WardName',
    'TariffName', 
    'Action'
  ];

  dateTimeObj:any;
  sIsLoading: string = '';
  isLoading = true;

  dsDischargeList =new MatTableDataSource<DischargeList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public _DischargeCancelService: DischargeCancelService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getDischargPatientList();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  resultsLength:any=0;
  ArryList:any=[];
  getDischargPatientList(){
    debugger
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name":  this._DischargeCancelService.DischargeForm.get('FirstName').value || '%',
      "L_Name": this._DischargeCancelService.DischargeForm.get('LastName').value || '%',
      "Reg_No": this._DischargeCancelService.DischargeForm.get('RegNo').value || 0, 
      "From_Dt": this.datePipe.transform(this._DischargeCancelService.DischargeForm.get('start').value, "MM-dd-yyyy") || '01/01/1900',
      "To_Dt ": this.datePipe.transform(this._DischargeCancelService.DischargeForm.get('end').value, "MM-dd-yyyy") || '01/01/1900',
      "OP_IP_Type": 1,
      "AdmDisFlag": 1,
      "IPNumber" :  this._DischargeCancelService.DischargeForm.get('IPDNo').value ||  0
    }
    console.log(D_data);
    this._DischargeCancelService.OPIPPatientList(D_data).subscribe(data => { 
       this.ArryList = data as DischargeList[] 
      this.dsDischargeList.data =this.ArryList.Table; 
      console.log(this.dsDischargeList.data) 
      this.dsDischargeList.sort = this.sort;
      this.dsDischargeList.paginator = this.paginator; 
      this.sIsLoading = this.dsDischargeList.data.length == 0 ? 'no-data' : ''; 
  
    },
      error => {
        this.sIsLoading = '';
      });
  }
  isLoading123:boolean=false;
  DischargeCancel(contact){
 
    Swal.fire({
      title: 'Do you want to cancel the Discharge ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Cancel it!" 
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      // if (result.isConfirmed) {  
      //   let billCancellationParamObj = {};
      //   billCancellationParamObj['oP_IP_type'] = contact.OPD_IPD_Type;
      //   billCancellationParamObj['billNo'] = contact.BillNo || 0;

      //   let SubmitDate ={
      //     "billCancellationParam":billCancellationParamObj
      //   }
      //   this._CancellationService.SaveCancelBill(SubmitDate).subscribe(response => {
      //     if (response) {
      //       Swal.fire('Congratulations !', 'Bill Cancel Successfully !', 'success').then((result) => {
      //         if (result.isConfirmed) { 
      //           this.getSearchList(); 
      //         }
      //       });
      //     } else {
      //       Swal.fire('Error !', 'Discharge  not saved', 'error');
      //     } 
      //   });  
      // }else{
      //   this.getSearchList(); 
      // }
    })
  }
  onClear(){
    this._DischargeCancelService.DischargeForm.reset();
    this._DischargeCancelService.DischargeForm.get('start').setValue(new Date())
    this._DischargeCancelService.DischargeForm.get('end').setValue(new Date())

  }
}
export class DischargeList{
 
  DOA: any;
  RegNo: any;
  PatientName: string;
  Age: any;
  Doctorname: any;
  IPNo:any;
  CompanyName: string;
  WardName: string;
  TariffName: string;
  constructor(DischargeList) {
    {
      this.DOA = DischargeList.DOA || 0;
      this.RegNo = DischargeList.RegNo || 0;
      this.PatientName = DischargeList.PatientName || '';
      this.CompanyName = DischargeList.CompanyName || '';
      this.WardName = DischargeList.WardName || '';
      this.TariffName = DischargeList.TariffName || '';
      this.Doctorname = DischargeList.Doctorname || '';
      this.Age = DischargeList.Age || 0;
      this.IPNo = DischargeList.IPNo || 0;
    }
  }
}
