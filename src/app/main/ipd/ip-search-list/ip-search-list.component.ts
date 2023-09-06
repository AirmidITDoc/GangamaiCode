import { DatePipe, Time } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { AdvanceDataStored } from '../advance';
import { IPSearchListService } from './ip-search-list.service';
import { Router } from '@angular/router';
import { IPAdvanceComponent } from './ip-advance/ip-advance.component';
import { IPSettlementComponent } from './ip-settlement/ip-settlement.component';
import Swal from 'sweetalert2';
import { DischargeComponent } from './discharge/discharge.component';
import { BedTransferComponent } from './bed-transfer/bed-transfer.component';
import { fuseAnimations } from '@fuse/animations';
import { ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { IPRefundofAdvanceComponent } from './ip-refundof-advance/ip-refundof-advance.component';
import { IPRefundofBillComponent } from './ip-refundof-bill/ip-refundof-bill.component';
import { Admission } from '../Admission/admission/admission.component';
import { IPBillingComponent } from './ip-billing/ip-billing.component';



@Component({
  selector: 'app-ip-search-list',
  templateUrl: './ip-search-list.component.html',
  styleUrls: ['./ip-search-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPSearchListComponent implements OnInit {
// ----- spinner loading 
  isLoadingStr: string = '';
  isLoading: String = '';


  hasSelectedContacts: boolean;
  MouseEvent = true;
  AdvanceId: number;
  AdmittedPatientList: any;
  msg: any;
  click: boolean = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;

  doctorNameCmbList: any = [];
  wardNameCmbList: any = [];

  isChecked: boolean = false;

  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  public wardFilterCtrl: FormControl = new FormControl();
  public filteredward: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  dataSource = new MatTableDataSource<Admission>();
  @Output() showClicked = new EventEmitter();
  sIsLoading: string = '';

  displayedColumns = [
    // 'IsBillGenerated',
    'RegNo',
    'PatientName',
    'DOA',
    'DOT',
    'IPDNo',
    'Doctorname',
    'RefDocName',
    'PatientType',
    'CompanyName',
    'buttons'
  ];


  
  menuActions: Array<string> = [];
  

  constructor(
    public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored) { }

  ngOnInit(): void {
    this.getAdmittedPatientList();

    if (this._ActRoute.url == '/ipd/ipadvance') {
      // this.menuActions.push('Medical CasePaper');
      this.menuActions.push('Advance');
      this.menuActions.push('Bed Transfer');
    }
    else if (this._ActRoute.url == '/ipd/discharge') {
      // this.menuActions.push('Medical CasePaper');
      this.menuActions.push('Discharge');
      this.menuActions.push('Discharge Summary');
    }
    else if (this._ActRoute.url == '/ipd/dischargesummary') {
      // this.menuActions.push('Medical CasePaper');
      this.menuActions.push('Discharge');
      this.menuActions.push('Discharge Summary');
    }
    else if (this._ActRoute.url == '/ipd/refund/iprefundofadvance' || this._ActRoute.url == '/ipd/refund/iprefundofbill') {
     
      this.menuActions.push('Refund of Bill');
      this.menuActions.push('Refund of Advance');
      
    }
   
    else if (this._ActRoute.url == '/ipd/add-billing') {
      this.menuActions.push('Advance');
      this.menuActions.push('Bill');
      this.menuActions.push('Refund of Bill');
      this.menuActions.push('Refund of Advance');
      this.menuActions.push('Payment');
    }
    else if (this._ActRoute.url == '/ipd/medicalrecords') {
      this.menuActions.push('Case Paper');
    }
    else if (this._ActRoute.url == '/ipd/ip-casepaper') {
      this.menuActions.push('Medical CasePaper');
      // this.menuActions.push('OT Ressrvation');
      // this.menuActions.push('Cath LabBooking');
      // this.menuActions.push('OT Ressrvation');
      // this.menuActions.push('Refund of Bill');
    }
    else if (this._ActRoute.url == '/nursingstation/bedtransfer') {
      this.menuActions.push('Bed Transfer');
      this.menuActions.push('Doctor Note');
      this.menuActions.push('Nursing Note');
     
    }
    // this.getAdvanceId();

  }
  get f() { return this._IpSearchListService.myFilterform.controls; }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    // console.log(changes.dataArray.currentValue, 'new arrrrrrr');

    this.click = !this.click;
    setTimeout(() => {
      {
        this.dataSource.data = changes.dataArray.currentValue as Admission[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.click = false;
      }
    }, 500);
    this.MouseEvent = true;


  }

  // getDischargeSummary()
  // {
  //   debugger;
  //   var m_data2={
  //     "AdmissionId": "19"//this._IpSearchListService.myShowDischargeSummaryForm.get("AdmissionID").value || "0",
  //   }
  //   console.log(m_data2);
  //       this._IpSearchListService.getDischargeSummary(m_data2).subscribe(data => {
  //         this.msg = data;
  //       });
  // }


  onExport(exprtType){
    // let columnList=[];
    // if(this.dataSource.data.length == 0){
    //   // this.toastr.error("No Data Found");
    //   Swal.fire('Error !', 'No Data Found', 'error');
    // }
    // else{
    //   var excelData = [];
    //   var a=1;
    //   for(var i=0;i<this.dataSource.data.length;i++){
    //     let singleEntry = {
    //       // "Sr No":a+i,
        
    //       "RegNo" :this.dataSource.data[i]["RegNo"] ? this.dataSource.data[i]["RegNo"]:"N/A",
    //       "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
    //       "DOA" :this.dataSource.data[i]["DOA"] ? this.dataSource.data[i]["DOA"]:"N/A",
    //       "DOT" :this.dataSource.data[i]["DOT"] ? this.dataSource.data[i]["DOT"]:"N/A",
    //       "IPDNo" :this.dataSource.data[i]["IPDNo"] ? this.dataSource.data[i]["IPDNo"]:"N/A",
    //       "Doctorname" :this.dataSource.data[i]["Doctorname"]+" - "+this.dataSource.data[i]["Doctorname"],
    //       "RefDocName" :this.dataSource.data[i]["RefDocName"]? this.dataSource.data[i]["RefDocName"]:"N/A",
    //        "PatientType" :this.dataSource.data[i]["PatientType"] ? this.dataSource.data[i]["PatientType"]:"N/A",
    //        "HospitalName" :this.dataSource.data[i]["HospitalName"] ? this.dataSource.data[i]["HospitalName"]:"N/A",
    //       };
    //     excelData.push(singleEntry);
    //   }
    //   var fileName = "Indoor-Patient-List " + new Date() +".xlsx";
    //   if(exprtType =="Excel"){
    //     const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
    //     var wscols = [];
    //     if(excelData.length > 0){ 
    //       var columnsIn = excelData[0]; 
    //       console.log(columnsIn);
    //       for(var key in columnsIn){
    //         let headerLength = {wch:(key.length+1)};
    //         let columnLength = headerLength;
    //         try{
    //           columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
    //         }
    //         catch{
    //           columnLength = headerLength;
    //         }
    //         if(headerLength["wch"] <= columnLength["wch"]){
    //           wscols.push(columnLength)
    //         }
    //         else{
    //           wscols.push(headerLength)
    //         }
    //       } 
    //     }
    //     ws['!cols'] = wscols;
    //     const wb: XLSX.WorkBook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    //     XLSX.writeFile(wb, fileName);
    //   }else{
    //     let doc = new jsPDF('p','pt', 'a4');
    //     doc.page = 0;
    //     var col=[];
    //     for (var k in excelData[0]) col.push(k);
    //       console.log(col.length)
    //     var rows = [];
    //     excelData.forEach(obj => {
    //       console.log(obj)
    //       let arr = [];
    //       col.forEach(col => {
    //         arr.push(obj[col]);
    //       });
    //       rows.push(arr);
    //     });
      
    //     doc.autoTable(col, rows,{
    //       margin:{left:5,right:5,top:5},
    //       theme:"grid",
    //       styles: {
    //         fontSize: 3
    //       }});
    //     doc.setFontSize(3);
    //     // doc.save("Indoor-Patient-List.pdf");
    //     window.open(URL.createObjectURL(doc.output("blob")))
    //   }
    // }
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
}


  getAdmittedPatientList() {
debugger;
    if (this._IpSearchListService.myFilterform.get("IsDischarge").value) {
      this.sIsLoading = 'loading-data';
      var D_data = {
        "F_Name": this._IpSearchListService.myFilterform.get("FirstName").value + '%' || "%",
        "L_Name": this._IpSearchListService.myFilterform.get("LastName").value + '%' || "%",
        "Reg_No": this._IpSearchListService.myFilterform.get("RegNo").value || 0,
        "Doctor_Id": this._IpSearchListService.myFilterform.get("DoctorId").value || "0",
        "From_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
        "To_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
        "Admtd_Dschrgd_All": "0",
        "M_Name": this._IpSearchListService.myFilterform.get("MiddleName").value + '%' || "%",
        "IPNo": this._IpSearchListService.myFilterform.get("IPDNo").value || "%",
      }

      console.log(D_data);
      setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._IpSearchListService.getAdmittedPatientList(D_data).subscribe(data => {
            this.dataSource.data = data as Admission[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
            // this.sIsLoading = '';
            // this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
      }, 1000);
    }
    else {

      this.sIsLoading = 'loading-data';
      var D_data = {
        "F_Name": this._IpSearchListService.myFilterform.get("FirstName").value + '%' || "%",
        "L_Name": this._IpSearchListService.myFilterform.get("LastName").value + '%' || "%",
        "Reg_No": this._IpSearchListService.myFilterform.get("RegNo").value || 0,
        "Doctor_Id": this._IpSearchListService.myFilterform.get("DoctorId").value || "0",
        "From_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
        "To_Dt": this.datePipe.transform(this._IpSearchListService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
        "Admtd_Dschrgd_All": "1",
        "M_Name": this._IpSearchListService.myFilterform.get("MiddleName").value + '%' || "%",
        "IPNo": this._IpSearchListService.myFilterform.get("IPDNo").value || "%",
      }

      setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._IpSearchListService.getDischargedPatientList(D_data).subscribe(data => {
          this.dataSource.data = data as Admission[];
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
          // this.sIsLoading = '';
          // this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
      }, 1000);

    }
  }


  dataSource1 = new MatTableDataSource<AdvanceDetailObj>();

  //   getAdvanceList()
  //   {
  //    debugger;
  //    var m_data={
  //      "AdmissionID": this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value || "0",
  //      }
  //      console.log("Displaying AdmissionID from getAdvanceList() 1:"+m_data);
  //      this._IpSearchListService.getAdvanceList(m_data).subscribe(Visit=> {
  //          console.log(this.dataSource1.data);
  //          this.dataSource1.data = Visit as AdvanceDetail[];
  //          this.dataSource1.sort =this.sort;
  //          this.dataSource1.paginator=this.paginator;
  //        });

  // }

  // getAdvanceId() {
  //   // var m_data = {
  //   //t"AdmissionID": this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value || "0",
  //   // }
  //   debugger;
  //   this.dataSource.data = [];
  //   this.isLoading = 'list-loading';
  //    let Query = "Select AdvanceId from T_AdvanceHeader where  OPD_IPD_Id="+this.AdmissionId +" ";

  //   this._IpSearchListService.getAdvanceId(Query).subscribe(data => {
  //     this.AdvanceId = data;
  //     // this.dataSource.data = this.chargeslist;

  //     console.log(this.AdvanceId);
  //   });
  // } 
  SubMenu(contact){
      let xx = {
        RegNo: contact.RegNo,
        AdmissionID: contact.AdmissionID,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        IsDischarged: contact.IsDischarged,
        IPDNo:contact.IPDNo,
        BedName:contact.BedName,
        WardName:contact.RoomName
      };
      this.advanceDataStored.storage = new AdvanceDetailObj(xx); 
      this._ActRoute.navigate(['ipd/add-billing/new-appointment']);
  }

  
  getRecord(contact, m): void {
    // debugger;
    console.log(contact);

    if (m == "Advance") {

      console.log(contact);
      var m_data = {
        RegNo: contact.RegNo,
        RegId: contact.RegID,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_ID:contact.OPD_IPD_Id,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,
        DOA: contact.DOA,
        DOT: contact.DOT,
        DoctorName: contact.DoctorName,
        RoomName: contact.RoomName,
        BedNo: contact.BedName,
        IPDNo: contact.IPDNo,
        DocNameID: contact.DocNameID,
        opD_IPD_Typec : contact.opD_IPD_Type

      }

      console.log(m_data)
      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      this._IpSearchListService.populateForm(m_data);

     
      const dialogRef = this._matDialog.open(IPAdvanceComponent,
        {
          maxWidth: "100%",
          height: '95%',
          width: '95%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);

      });
    }
    // else if (m == "Discharge Summary") {
    //   // debugger;
    //   var m_data1 = {
    //     "RegNo": contact.RegNo,
    //     "PatientName": contact.PatientName,
    //     "AdmissionId": contact.AdmissionID,
    //     "DOA": contact.DOA,
    //     "DOT": contact.DOT,
    //     "DoctorName": contact.DoctorName,
    //     "RoomName": contact.RoomName,
    //     "BedNo": contact.BedName,
    //     "IPDNo": contact.IPDNo
    //   }
    //   // console.log(m_data1);
    //   this._IpSearchListService.populateForm1(m_data1);
    //   const dialogRef = this._matDialog.open(DischargesummaryComponent,
    //     {

    //       maxWidth: "85vw",
    //       //maxWidth: "115vw", 
    //       // height: '600px !important',
    //       height: '94vh',
    //       width: '100%',



    //     });

    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('The dialog was closed - Insert Action', result);
    //   });
    // } 
    else if (m == "Payment") {
      // debugger;
      var m_data = {
        RegNo: contact.RegNo,
        RegId: contact.RegID,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_ID:contact.OPD_IPD_Id,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,
        DOA: contact.DOA,
        DOT: contact.DOT,
        DoctorName: contact.DoctorName,
        RoomName: contact.RoomName,
        BedNo: contact.BedName,
        IPDNo: contact.IPDNo,
        DocNameID: contact.DocNameID,
        opD_IPD_Typec : contact.opD_IPD_Type

      }
      // console.log(m_data1);
      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      this._IpSearchListService.populateForm1(m_data);
      const dialogRef = this._matDialog.open(IPSettlementComponent,
        {

          maxWidth: "95vw",
          //maxWidth: "115vw", 
          // height: '600px !important',
          height: '94vh',
          width: '100%',


        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    else if (m == "Refund of Bill") {
debugger;
      console.log(" This is for IP Refund of Bill pop : " + m);
      let xx = {
        RegNo: contact.RegId,
        AdmissionID: contact.AdmissionID,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,
        DOA: contact.DOA,
        DOT: contact.DOT,
        DoctorName: contact.DoctorName,
        RoomName: contact.RoomName,
        BedNo: contact.BedName,
        IPDNo: contact.IPDNo,
        DocNameID: contact.DocNameID,
      };
      this.advanceDataStored.storage = new AdvanceDetailObj(xx);

      this._ActRoute.navigate(['opd/new-OpdBilling']);
      const dialogRef = this._matDialog.open(IPRefundofBillComponent,
        {
          maxWidth: "110vw",
          height: '90%',
          width: '95%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        //  this.getRadiologytemplateMasterList();
      });
    }
    else if (m == "Refund of Advance") {
      let m_data = {
        RegNo: contact.RegId,
        AdmissionID: contact.AdmissionID,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        DoctorId: contact.DoctorId,
        DOA: contact.DOA,
        DOT: contact.DOT,
        DoctorName: contact.DoctorName,
        RoomName: contact.RoomName,
        BedNo: contact.BedName,
        IPDNo: contact.IPDNo,
        DocNameID: contact.DocNameID,
      }
      // console.log(m_data);
      debugger
      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      this._IpSearchListService.populateForm2(m_data);
       const dialogRef = this._matDialog.open(IPRefundofAdvanceComponent,
     {
         maxWidth: "110vw",
           maxHeight: "90%", width: '100%', height: "100%"
         });
       dialogRef.afterClosed().subscribe(result => {
         console.log('The dialog was closed - Insert Action', result);
         //this.getAdmittedPatientList();
       });
    }
    else if (m == "Bill") {

      debugger;
// console.log(m);
      console.log(" This is for  Bill pop : " + m);
      let xx = {
        RegNo: contact.RegNo,
        AdmissionID: contact.AdmissionID,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        IsDischarged: contact.IsDischarged,
        IPDNo:contact.IPDNo,
        BedName:contact.BedName,
        WardName:contact.RoomName,
        CompanyId:contact.CompanyId,
        IsBillGenerated:contact.IsBillGenerated,
        UnitId:contact.HospitalID
      };
      this.advanceDataStored.storage = new AdvanceDetailObj(xx);
      console.log(this.advanceDataStored.storage);
     if(!contact.IsBillGenerated){

      console.log(this.advanceDataStored.storage);
      const dialogRef = this._matDialog.open(IPBillingComponent,
        {

          maxWidth: "120vw",
          height: '890px',    //maxHeight: "170vh",
          // width: '100%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      
      });
    }else{Swal.fire("Final Bill Already Generated")}
    }
    else if (m == "Discharge") {
      debugger;
      if(!contact.IsDischarged){
      let m_data = {
        "RegNo": contact.RegNo,
        "PatientName": contact.PatientName,
        "AdmissionID": contact.AdmissionID,
        "DOA": contact.DOA,
        "DOT": contact.DOT,
        "DoctorName": contact.DoctorName,
        "RoomName": contact.RoomName,
        "BedNo": contact.BedName,
        "IPDNo": contact.IPDNo,
        "DocNameID": contact.DocNameID,
        "IsDischarged":contact.IsDischarged
      }
      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      this._IpSearchListService.populateForm(m_data);
      const dialogRef = this._matDialog.open(DischargeComponent,
        {
          maxWidth: "85vw",
          height: '400px',
          width: '100%',
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getAdmittedPatientList();
      });
    }else{
     
     
        Swal.fire({
          title: 'Patient Already Discharged Do you Want to Edit',
          // showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: 'OK',

        }).then((result) => {

        
        if (result.isConfirmed) {
          let m_data = {
            "RegNo": contact.RegNo,
            "PatientName": contact.PatientName,
            "AdmissionID": contact.AdmissionID,
            "DOA": contact.DOA,
            "DOT": contact.DOT,
            "DoctorName": contact.DoctorName,
            "RoomName": contact.RoomName,
            "BedNo": contact.BedName,
            "IPDNo": contact.IPDNo,
            "DocNameID": contact.DocNameID,
            "IsDischarged":contact.IsDischarged
          }
          this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
          this._IpSearchListService.populateForm(m_data);
         const dialogRef = this._matDialog.open(DischargeComponent,
           {
   
            maxWidth: "85vw",
             height: '400px',
              width: '100%',
           });
         dialogRef.afterClosed().subscribe(result => {
           console.log('The dialog was closed - Insert Action', result);
         
         });
           }
           else{
            
           }
         });
    
    }
  }
    else if (m == "Bed Transfer") {
      console.log(" This is for BedTransfer pop : " + m);
      let m_data = {
        "RegNo": contact.RegNo,
        "PatientName": contact.PatientName,
        "AdmissionID": contact.AdmissionID,
        "AdmDateTime": contact.AdmDateTime,
        "DOA": contact.DOA,
        //"Dot":contact.DOT,
        //"AdmittedDoctor1":contact.AdmittedDoctor1,
        "DocNameID": contact.DocNameID,
        "RoomId": contact.WardId,
        "WardId": contact.WardId,
        "RoomName": contact.RoomName,
        "BedId": contact.BedId,
        "BedName": contact.BedName,
        "TariffId": contact.TariffId,
        "TariffName": contact.TariffName,
        "ClassId": contact.ClassId,
        "ClassName": contact.ClassName
      }
      this.advanceDataStored.storage = new AdvanceDetailObj(m_data);
      this._IpSearchListService.populateForm(m_data);
      //      this.getAdvanceList();
      const dialogRef = this._matDialog.open(BedTransferComponent,
        {
          maxWidth: "95vw",
          maxHeight: "85vh", width: '100%', height: "100%"
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getAdmittedPatientList();
      });
    }
//     else if (m == "Prescription") {
//       console.log(" This is for Prescription pop : " + m);
//       let m_data = {
//         "RegNo": contact.RegNo,
//         "PatientName": contact.PatientName,
//         "AdmissionID": contact.AdmissionID,
//         "AdmDateTime": contact.AdmDateTime,
//         "DOA": contact.DOA,
//         //"Dot":contact.DOT,
//         //"AdmittedDoctor1":contact.AdmittedDoctor1,
//         "DocNameID": contact.DocNameID,
//         "RoomId": contact.WardId,
//         "WardId": contact.WardId,
//         "RoomName": contact.RoomName,
//         "BedId": contact.BedId,
//         "BedName": contact.BedName,
//         "TariffId": contact.TariffId,
//         "TariffName": contact.TariffName,
//         "ClassId": contact.ClassId,


//       }
//       // console.log(m_data);
//       this._IpSearchListService.populateForm(m_data);
//       //      this.getAdvanceList();
//       const dialogRef = this._matDialog.open(PrescriptionComponent,
//         {
//           maxWidth: "95vw",
//           maxHeight: "90vh", width: '100%', height: "100%"
//         });
//       dialogRef.afterClosed().subscribe(result => {
//         console.log('The dialog was closed - Insert Action', result);

//       });
//     }
   
//     else if (m == "Medical CasePaper") {
// debugger;
//       console.log(" This is for Medical CasePaper pop : " + m);
//       let xx = {
//         RegNo: contact.RegID,        
//         AdmissionID: contact.AdmissionID,
//         OPD_IPD_ID:contact.OPD_IPD_ID,
//         OPD_IPD_Type:contact.opD_IPD_Type,
//         PatientName: contact.PatientName,
//         Doctorname: contact.Doctorname,
//         AdmDateTime: contact.AdmDateTime,
//         AgeYear: contact.AgeYear,
//         ClassId: contact.ClassId,
//         TariffName: contact.TariffName,
//         TariffId: contact.TariffId,
//         DoctorId: contact.DoctorId,
//         DOA: contact.DOA,
//         DOT: contact.DOT,
//         DoctorName: contact.DoctorName,
//         WardName: contact.RoomName,
//         BedName: contact.BedName,
//         IPDNo: contact.IPDNo,
//         DocNameID: contact.DocNameID,
//       };
//       this.advanceDataStored.storage = new AdvanceDetailObj(xx);

//       const dialogRef = this._matDialog.open(CasePaperComponent,
//         {
//           maxWidth: "115vw",
//           height: '860px',
//           width: '100%',
//         });
//       dialogRef.afterClosed().subscribe(result => {
//         console.log('The dialog was closed - Insert Action', result);

//       });
//     }
//     else if (m == "Bed Transfer") {

//       console.log(" This is for Bed Transfer pop : " + m);
//       let xx = {
//         RegNo: contact.RegId,
//         AdmissionID: contact.AdmissionID,
//         OPD_IPD_ID:contact.OPD_IPD_ID,
//         OPD_IPD_Type:contact.opD_IPD_Type,
//         PatientName: contact.PatientName,
//         Doctorname: contact.Doctorname,
//         AdmDateTime: contact.AdmDateTime,
//         AgeYear: contact.AgeYear,
//         ClassId: contact.ClassId,
//         TariffName: contact.TariffName,
//         TariffId: contact.TariffId,
//         DoctorId: contact.DoctorId,
//         DOA: contact.DOA,
//         DOT: contact.DOT,
//         DoctorName: contact.DoctorName,
//         RoomName: contact.RoomName,
//         BedNo: contact.BedName,
//         IPDNo: contact.IPDNo,
//         DocNameID: contact.DocNameID,
//       };
//       this.advanceDataStored.storage = new AdvanceDetailObj(xx);

//       const dialogRef = this._matDialog.open(BedTransferComponent,
//         {
//           maxWidth: "115vw",
//           height: '860px',
//           width: '100%',
//         });
//       dialogRef.afterClosed().subscribe(result => {
//         console.log('The dialog was closed - Insert Action', result);

//       });  
//     }
//     else if (m == "Doctor Note") {

//       console.log(" This is for Doctor Note pop : " + m);
//       let xx = {
//         RegNo: contact.RegId,
//         AdmissionID: contact.AdmissionID,
//         OPD_IPD_ID:contact.OPD_IPD_ID,
//         OPD_IPD_Type:contact.opD_IPD_Type,
//         PatientName: contact.PatientName,
//         Doctorname: contact.Doctorname,
//         AdmDateTime: contact.AdmDateTime,
//         AgeYear: contact.AgeYear,
//         ClassId: contact.ClassId,
//         TariffName: contact.TariffName,
//         TariffId: contact.TariffId,
//         DoctorId: contact.DoctorId,
//         DOA: contact.DOA,
//         DOT: contact.DOT,
//         DoctorName: contact.DoctorName,
//         RoomName: contact.RoomName,
//         BedNo: contact.BedName,
//         IPDNo: contact.IPDNo,
//         DocNameID: contact.DocNameID,
//       };
//       this.advanceDataStored.storage = new AdvanceDetailObj(xx);

//       // const dialogRef = this._matDialog.open(DoctorNoteComponent,
//       //   {
//       //     maxWidth: "115vw",
//       //     height: '760px',
//       //     width: '90%',
//       //   });
//       // dialogRef.afterClosed().subscribe(result => {
//       //   console.log('The dialog was closed - Insert Action', result);

//       // });
//     }
//     else if (m == "Nursing Note") {

//       console.log(" This is for Nursing Note pop : " + m);
//       let xx = {
//         RegNo: contact.RegId,
//         AdmissionID: contact.AdmissionID,
//         OPD_IPD_ID:contact.OPD_IPD_ID,
//         OPD_IPD_Type:contact.opD_IPD_Type,
//         PatientName: contact.PatientName,
//         Doctorname: contact.Doctorname,
//         AdmDateTime: contact.AdmDateTime,
//         AgeYear: contact.AgeYear,
//         ClassId: contact.ClassId,
//         TariffName: contact.TariffName,
//         TariffId: contact.TariffId,
//         DoctorId: contact.DoctorId,
//         DOA: contact.DOA,
//         DOT: contact.DOT,
//         DoctorName: contact.DoctorName,
//         RoomName: contact.RoomName,
//         BedNo: contact.BedName,
//         IPDNo: contact.IPDNo,
//         DocNameID: contact.DocNameID,
//       };
//       this.advanceDataStored.storage = new AdvanceDetailObj(xx);

//       // const dialogRef = this._matDialog.open(NursingNoteComponent,
//       //   {
//       //     maxWidth: "115vw",
//       //     height: '760px',
//       //     width: '90%',
//       //   });
//       // dialogRef.afterClosed().subscribe(result => {
//       //   console.log('The dialog was closed - Insert Action', result);

//       // });
//     }
    
    //
  }



  onShow(event: MouseEvent) {
    debugger;
    //  console.log(this.IsDischarge);

    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        console.log(this._IpSearchListService.myFilterform);
        this.showClicked.emit(this._IpSearchListService.myFilterform);
        this.click = false;
      }
    }, 1000);
    this.MouseEvent = true;

  }


  onClear() {
    this._IpSearchListService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }


  private filterDoctor() {
    // debugger;
    if (!this.doctorNameCmbList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filtereddoctor.next(
      this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


  private filterWard() {
    // debugger;
    if (!this.wardNameCmbList) {
      return;
    }
    // get the search keyword
    let search = this.wardFilterCtrl.value;
    if (!search) {
      this.filteredward.next(this.wardNameCmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredward.next(
      this.wardNameCmbList.filter(bank => bank.RoomName.toLowerCase().indexOf(search) > -1)
    );
  }


  getWardNameCombo() {
    this._IpSearchListService.getWardNameCombo().subscribe(data => {
      this.wardNameCmbList = data;
      this.filteredward.next(this.wardNameCmbList.slice());
    });
  }

  getAdmittedDoctorCombo() {
    debugger;
    this._IpSearchListService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      console.log(data);
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
    });
  }


  Listdisplay(){
    this.click = !this.click;
    setTimeout(() => {
      {
        this.sIsLoading = 'loading-data';
        console.log(this._IpSearchListService.myFilterform);
        this.showClicked.emit(this._IpSearchListService.myFilterform);
        this.click = false;
      }
    }, 1000);
    this.MouseEvent = true;
  }

  IsDischarge: any;
  onChangeIsactive(SiderOption) {
    console.log(SiderOption);
    debugger;
   this.IsDischarge = SiderOption.checked;
    // console.log(this.IsDischarge);

    if (SiderOption.checked==true) {
      this._IpSearchListService.myFilterform.get('IsDischarge').setValue(1);
      // this._IpSearchListService.myFilterform.get('start').setValue((new Date()).toISOString());
      // this._IpSearchListService.myFilterform.get('end').setValue((new Date()).toISOString());
      setTimeout(() => {
        {
          this.sIsLoading = 'loading-data';
          console.log(this._IpSearchListService.myFilterform);
          this.showClicked.emit(this._IpSearchListService.myFilterform);
          this.click = false;
        }
      }, 1000);
      this.MouseEvent = true;
    }
    else {
          this._IpSearchListService.myFilterform.get('IsDischarge').setValue(0);
          // this._IpSearchListService.myFilterform.get('start').setValue(''),
          // this._IpSearchListService.myFilterform.get('end').setValue('')
            
          setTimeout(() => {
            {
              this.sIsLoading = 'loading-data';
              console.log(this._IpSearchListService.myFilterform);
              this.showClicked.emit(this._IpSearchListService.myFilterform);
              this.click = false;
            }
          }, 1000);
    }
  }
}



export class Bed {
  BedId: Number;
  BedName: string;

  /**
   * Constructor
   *
   * @param Bed
   */
  constructor(Bed) {
      {
          this.BedId = Bed.BedId || '';
          this.BedName = Bed.BedName || '';
      }
  }
}


export class AdvanceDetail
{
    AdvanceDetailID : Number;
    Date : Date;
    Time : Time;
    AdvanceId : number;
    RefId : number;
    TransactionID : number;
    OPD_IPD_Id : number;
    OPD_IPD_Type :number;
    AdvanceAmount : number;
    UsedAmount : number;
    BalanceAmount : number;
    RefundAmount : number;
    ReasonOfAdvanceId : number;
    AddedBy : number;
    IsCancelled : boolean;
    IsCancelledBy : number;
    IsCancelledDate : Date;
    Reason : string;

     /**
     * Constructor
     *
     * @param AdvanceDetail
     */
      constructor(AdvanceDetail) {
        {
           this.AdvanceDetailID = AdvanceDetail.AdvanceDetailID || '';
           this.Date = AdvanceDetail.Date || '';
           this.Time = AdvanceDetail.Time || '';
           this.AdvanceId = AdvanceDetail.AdvanceId || '';
           this.RefId = AdvanceDetail.RefId || '';
           this.TransactionID = AdvanceDetail.TransactionID || '';
           this.OPD_IPD_Id = AdvanceDetail.OPD_IPD_Id || '';
           this.OPD_IPD_Type = AdvanceDetail.OPD_IPD_Type || '';
           this.AdvanceAmount = AdvanceDetail.AdvanceAmount || '';
           this.UsedAmount = AdvanceDetail.UsedAmount || '';
           this.BalanceAmount = AdvanceDetail.BalanceAmount || '';
           this.RefundAmount= AdvanceDetail.RefundAmount || '';
           this.ReasonOfAdvanceId= AdvanceDetail.ReasonOfAdvanceId || '';
           this.AddedBy= AdvanceDetail.AddedBy || '';
           this.IsCancelled= AdvanceDetail.IsCancelled || '';
           this.IsCancelledBy = AdvanceDetail.IsCancelledBy || '';
           this.IsCancelledDate = AdvanceDetail.IsCancelledDate || '';
           this.Reason = AdvanceDetail.Reason || '';
        }
    }
}

export class AdvanceDetailObj
{
    RegNo : Number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    ClassId: number;
    ClassName:String;
    TariffName: String;
    TariffId : number;
    IsDischarged:boolean;
    opD_IPD_Type:number;
    PatientType:any;
    PatientTypeID:any;
    VisitId:any;
    AdmissionId:number;
    IPDNo:any;
    DoctorId:number;
    BedId:any;
    BedName:String;
    WardName:String;
    CompanyId:string;
    SubCompanyId:any;
    IsBillGenerated:any;
    UnitId:any;
    RegId:number;
    RefId:number;
     OPD_IPD_ID:any;
     storage: any;
     IsMLC:any;
     NetPayableAmt:any;
     /**
     * Constructor
     *
     * @param AdvanceDetailObj
     */
      constructor(AdvanceDetailObj) {
        {
           this.RegNo = AdvanceDetailObj.RegNo || '';
           this.RegId = AdvanceDetailObj.RegId || '';
           this.AdmissionID = AdvanceDetailObj.AdmissionID || '';
           this.PatientName = AdvanceDetailObj.PatientName || '';
           this.Doctorname = AdvanceDetailObj.Doctorname || '';
           this.AdmDateTime = AdvanceDetailObj.AdmDateTime || '';
           this.AgeYear = AdvanceDetailObj.AgeYear || '';
           this.ClassId = AdvanceDetailObj.ClassId || '';
           this.ClassName = AdvanceDetailObj.ClassName || '';
           this.TariffName = AdvanceDetailObj.TariffName || '';
           this.TariffId = AdvanceDetailObj.TariffId || '';
           this.IsDischarged =AdvanceDetailObj.IsDischarged || 0 ;
           this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type | 0;
           this.PatientType = AdvanceDetailObj.PatientType || 0;
           this.VisitId = AdvanceDetailObj.VisitId || '';
           this.AdmissionId = AdvanceDetailObj.AdmissionId || '';
           this.IPDNo = AdvanceDetailObj.IPDNo || '';
           this.BedName = AdvanceDetailObj.BedName || '';
           this.WardName = AdvanceDetailObj.WardName || '';
           this.CompanyId = AdvanceDetailObj.CompanyId || '';
           this.IsBillGenerated = AdvanceDetailObj.IsBillGenerated || 0;
           this.UnitId = AdvanceDetailObj.UnitId || 0;
           this.RefId = AdvanceDetailObj.RefId || 0;
            this.DoctorId = AdvanceDetailObj.DoctorId || 0;
            this.OPD_IPD_ID = AdvanceDetailObj.OPD_IPD_ID || 0;
            this.IsMLC = AdvanceDetailObj.IsMLC || 0;
            this.BedId = AdvanceDetailObj.BedId || 0;
            this.SubCompanyId =AdvanceDetailObj.SubCompanyId || 0;
            this.PatientTypeID =AdvanceDetailObj.PatientTypeID || 0;
           this.NetPayableAmt =AdvanceDetailObj.NetPayableAmt || 0;

        }
    }
}


export class ChargesList{
    ChargesId: number;
    ServiceId: number;
    ServiceName : String;
    Price:number;
    Qty: number;
    TotalAmt: number;
    DiscPer: number;
    DiscAmt: number;
    NetAmount: number;
    DoctorId:number;
    ChargeDoctorName: String;
    ChargesDate: Date;
    IsPathology:boolean;
    IsRadiology:boolean;
    ClassId:number;
    ClassName: string;
    ChargesAddedName: string;

    constructor(ChargesList){
            this.ChargesId = ChargesList.ChargesId || '';
            this.ServiceId = ChargesList.ServiceId || '';
            this.ServiceName = ChargesList.ServiceName || '';
            this.Price = ChargesList.Price || '';
            this.Qty = ChargesList.Qty || '';
            this.TotalAmt = ChargesList.TotalAmt || '';
            this.DiscPer = ChargesList.DiscPer || '';
            this.DiscAmt = ChargesList.DiscAmt || '';
            this.NetAmount = ChargesList.NetAmount || '';
            this.DoctorId=ChargesList.DoctorId || 0;
            this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
            this.ChargesDate = ChargesList.ChargesDate || '';
            this.IsPathology = ChargesList.IsPathology || '';
            this.IsRadiology = ChargesList.IsRadiology || '';
            this.ClassId=ChargesList.ClassId || 0;
            this.ClassName = ChargesList.ClassName || '';
            this.ChargesAddedName = ChargesList.ChargesAddedName || '';
    }
} 
export class AdvanceHeader
{
    AdvanceId : Number;
    Date : Date;
    RefId : number;
    OPD_IPD_Type :number;
    OPD_IPD_Id : number;
    AdvanceAmount : number;
    AdvanceUsedAmount : number;
    BalanceAmount : number;
    AddedBy : number;
    IsCancelled : boolean;
    IsCancelledBy : number;
    IsCancelledDate : Date;
    
     /**
     * Constructor
     *
     * @param AdvanceHeader
     */
      constructor(AdvanceHeader) {
        {
           this.AdvanceId = AdvanceHeader.AdvanceId || '';           
           this.Date = AdvanceHeader.Date || '';
           this.RefId = AdvanceHeader.RefId || '';
           this.OPD_IPD_Type = AdvanceHeader.OPD_IPD_Type || '';
           this.OPD_IPD_Id = AdvanceHeader.OPD_IPD_Id || '';
           this.AdvanceAmount = AdvanceHeader.AdvanceAmount || '';
           this.AdvanceUsedAmount = AdvanceHeader.AdvanceUsedAmount || '';
           this.BalanceAmount = AdvanceHeader.BalanceAmount || '';
           this.AddedBy= AdvanceHeader.AddedBy || '';
           this.IsCancelled= AdvanceHeader.IsCancelled || '';
           this.IsCancelledBy = AdvanceHeader.IsCancelledBy || '';
           this.IsCancelledDate = AdvanceHeader.IsCancelledDate || '';
           
        }
    }
}
export class Payment
{
    PaymentId : Number;
    BillNo : number;
	ReceiptNo : string;
	PaymentDate	: Date;
	PaymentTime : Time; 
	CashPayAmount :	number;
	ChequePayAmount : number;
	ChequeNo : string;
	BankName : string;
	ChequeDate : Date;
	CardPayAmount :	number;
	CardNo : string;
	CardBankName : string;
	CardDate : Date;
	AdvanceUsedAmount :	number;
	AdvanceId :	number;
	RefundId :	number;
	TransactionType :	number;
	Remark : string;
	AddBy:	number;
	IsCancelled	: boolean;
	IsCancelledBy : number;
	IsCancelledDate	: Date;
	CashCounterId :	number;
	IsSelfORCompany	: number;
	CompanyId : number;
	NEFTPayAmount :	number;
	NEFTNo : string;
	NEFTBankMaster : string;
	NEFTDate	:Date;
	PayTMAmount	: number;
    PayTMTranNo : string;
	PayTMDate : Date;

     /**
     * Constructor
     *
     * @param Payment
     */
      constructor(Payment) {
        {
           this.PaymentId = Payment.PaymentId || '';       
           this.BillNo = Payment.BillNo || '';       
           this.ReceiptNo = Payment.ReceiptNo || '';       
           this.PaymentDate = Payment.PaymentDate || '';       
           this.PaymentTime = Payment.PaymentTime || '';       
           this.CashPayAmount = Payment.CashPayAmount || '';       
           this.ChequePayAmount = Payment.ChequePayAmount || '';       
           this.ChequeNo = Payment.ChequeNo || '';       
           this.BankName = Payment.BankName || '';       
           this.ChequeDate = Payment.ChequeDate || '';       
           this.CardPayAmount = Payment.CardPayAmount || '';       
           this.CardNo = Payment.CardNo || '';       
           this.CardBankName = Payment.CardBankName || '';       
           this.CardDate = Payment.CardDate || '';       
           this.AdvanceUsedAmount = Payment.AdvanceUsedAmount || '';       
           this.AdvanceId = Payment.AdvanceId || '';       
           this.RefundId = Payment.RefundId || '';       
           this.TransactionType = Payment.TransactionType || '';       
           this.Remark = Payment.Remark || '';       
           this.AddBy = Payment.AddBy || '';       
           this.IsCancelled = Payment.IsCancelled || '';       
           this.IsCancelledBy = Payment.IsCancelledBy || '';       
           this.IsCancelledDate = Payment.IsCancelledDate || '';       
           this.CashCounterId = Payment.CashCounterId || '';       
           this.IsSelfORCompany = Payment.IsSelfORCompany || '';       
           this.CompanyId = Payment.CompanyId || '';       
           this.NEFTPayAmount = Payment.NEFTPayAmount || '';       
           this.NEFTNo = Payment.NEFTNo || '';       
           this.NEFTBankMaster = Payment.NEFTBankMaster || '';       
           this.NEFTDate = Payment.NEFTDate || '';       
           this.PayTMAmount = Payment.PayTMAmount || '';       
           this.PayTMTranNo = Payment.PaymentId || '';       
           this.PayTMDate = Payment.PayTMDate || '';       
          
           
        }
    }
    
}

export class Discharge
{
    DischargeId : Number;
    AdmissionID: Number;
    DischargeDate: Date;
    DischargeTime: Date;
    DischargeTypeId: string;
    DischargedDocId: number;
    AddedBy: number;
    
     /**
     * Constructor
     *
     * @param Discharge
     */
      constructor(Discharge) {
        {
           this.DischargeId = Discharge.DischargeId || '';
           this.AdmissionID = Discharge.AdmissionID || '';
           this.DischargeDate = Discharge.DischargeDate || '';
           this.DischargeTime = Discharge.DischargeTime || '';
           this.DischargeTypeId = Discharge.DischargeTypeId || '';
           this.DischargedDocId = Discharge.DischargedDocId || '';
           this.AddedBy = Discharge.AddedBy || '';
          
        }
    }
    }


    export class Bedtransfer
    {
   // BedId : Number;
    FromTime: Date;
    FromDate: Date;
    FromBedId: number;
    FromClassId: number;
    FromWardID: number;
    ToDate: Date;
    ToTime: Date;
    ToBedId: number;
    ToWardID : Number;
    ToClassId: Number;
    AddedBy: number;
    IsCancelled : boolean;
    IsCancelledBy: Number;
    
     /**
     * Constructor
     *
     * @param Bedtransfer
     */
      constructor(Bedtransfer) {
        {
           this.FromTime = Bedtransfer.FromTime || '';
           this.FromDate = Bedtransfer.FromDate || '';
           this.FromBedId = Bedtransfer.FromBedId || '';
           this.FromClassId = Bedtransfer.FromClassId || '';
           this.FromWardID = Bedtransfer.FromWardID || '';
           this.ToDate = Bedtransfer.ToDate || '';
           this.ToTime = Bedtransfer.ToTime || '';
           this.ToBedId = Bedtransfer.ToBedId || '';
           this.ToClassId = Bedtransfer.ToClassId || '';
           this.ToWardID = Bedtransfer.ToWardID || '';
           this.IsCancelled = Bedtransfer.IsCancelled || '';
           this.IsCancelledBy = Bedtransfer.IsCancelledBy || '';
            this.AddedBy = Bedtransfer.AddedBy || '';
          
        }
    }
}