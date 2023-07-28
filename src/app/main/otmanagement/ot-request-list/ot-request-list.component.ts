import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { NewRequestComponent } from './new-request/new-request.component';
import Swal from 'sweetalert2';
import { OTManagementServiceService } from '../ot-management-service.service';

@Component({
  selector: 'app-ot-request-list',
  templateUrl: './ot-request-list.component.html',
  styleUrls: ['./ot-request-list.component.scss']
})
export class OTRequestListComponent implements OnInit {

  sIsLoading: string = '';
  searchFormGroup: FormGroup;
  click: boolean = false;
  MouseEvent = true;
  patientName: any;
  OPIPNo: any;
  D_data1: any;
  dataArray = {};

  
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;

  
  displayedColumns: string[] = [

    'RegNo',
    'PatientName',
    'GenderName',
    'OTbookingDate',
    'OTbookingTime',
    'RoomName',
    'BedName',
    'OP_IP_Id',
    // 'OP_IP_Type',
    'AdmittingDoctor',
    'SurgeonName',
    'SurgeryCategoryName',
    'SurgeryType',
    'DepartmentName',
    'AddedBy',
    // 'UpdateBy',
    'IsCancelled',
    'IsCancelledBy',


    'action'
  ];
  dataSource = new MatTableDataSource<Requestlist>();

  // @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

  constructor(private formBuilder: FormBuilder,
    // public _nursingStationService: OTManagementService,
    // private _IpSearchListService: IpSearchListService,
    private _ActRoute: Router,
    public _OtManagementService: OTManagementServiceService,
    // public dialogRef: MatDialogRef<OTRequestListComponent>,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,) {
    console.log("Line 77")
  }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    var D_data= {
      
      "F_Name": this.searchFormGroup.get('F_Name').value || "%",
      "L_Name": this.searchFormGroup.get('F_Name').value || "%",
      "From_Dt": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2022-03-28 00:00:00.000',
      "To_Dt": this.datePipe.transform(this.searchFormGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '2022-03-28 00:00:00.000',
      "Reg_No": this.searchFormGroup.get("Reg_No").value || 0
    
  } 
   console.log(D_data);
    this.D_data1=D_data;
    this._OtManagementService.getOTRequestList(this.D_data1).subscribe(Visit => {
      this.dataArray =  Visit as Requestlist[];
      this.dataSource.data = Visit as Requestlist[];
      console.log(this.dataSource.data);
      //  this.dataSource.sort = this.sort;
      //  this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });


    this.getRequestList();
    // this.onEdit();
  }

  createSearchForm() {
    return this.formBuilder.group({
      start: [new Date().toISOString()],
      end: [new Date().toISOString()],
      Reg_No: [''],
      F_Name: '',
      L_Name: ''
    });
  }


  getRequestList() {

    debugger
    this.sIsLoading = 'loading-data';
    var m_data = {
      "F_Name": (this.searchFormGroup.get('F_Name').value).trim() + '%' || "%",
      "L_Name": (this.searchFormGroup.get('L_Name').value).trim() + '%' || "%",
      "From_Dt": this.datePipe.transform(this.searchFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '2022-03-28 00:00:00.000',
      "To_Dt": this.datePipe.transform(this.searchFormGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '2022-03-28 00:00:00.000',
      "Reg_No": this.searchFormGroup.get("Reg_No").value || 0
    }
    console.log(m_data);
    this._OtManagementService.getOTRequestList(m_data).subscribe(Visit => {
       this.dataSource.data = Visit as Requestlist[];
      console.log(this.dataSource.data);
      //  this.dataSource.sort = this.sort;
      //  this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
      this.click = false;
    },
      error => {
        this.sIsLoading = '';
      });
  }



  getPrint() {

  }

  NewTestRequest() {
    const dialogRef = this._matDialog.open(NewRequestComponent,
      {
        maxWidth: '70%',
        height: '75%',
        width: '100%',
        // height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      this._OtManagementService.getOTRequestList(this.D_data1).subscribe(Visit => {
        this.dataArray =  Visit as Requestlist[];
        this.dataSource.data = Visit as Requestlist[];
        console.log(this.dataSource.data);
        //  this.dataSource.sort = this.sort;
        //  this.dataSource.paginator = this.paginator;

        this.sIsLoading = '';
        this.click = false;
      },
        error => {
          this.sIsLoading = '';
        });
    });
  }

  onShow(event: MouseEvent) {
    // this.click = false;// !this.click;
    this.click = !this.click;
    // this. showSpinner = true;

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

      PatInforObj['OTbookingDate'] = contact.OTbookingDate,
      PatInforObj['OTbookingTime'] = contact.OTbookingTime,
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
      PatInforObj['OTBookingId'] = contact.OTBookingId,
      PatInforObj['SurgeryId'] = contact.SurgeryId,
      PatInforObj['CategoryId'] = contact.SurgeryCategoryId,


      console.log(PatInforObj);


    // this._OtManagementService.populateFormpersonal(PatInforObj);

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

    this.searchFormGroup.get('start').reset();
    this.searchFormGroup.get('end').reset();
    this.searchFormGroup.get('Reg_No').reset();

  }

  // onExport(exprtType){
  //   let columnList=[];
  //   if(this.dataSource.data.length == 0){
  //     // this.toastr.error("No Data Found");
  //     Swal.fire('Error !', 'No Data Found', 'error');
  //   }
  //   else{
  //     var excelData = [];
  //     var a=1;
  //     for(var i=0;i<this.dataSource.data.length;i++){
  //       let singleEntry = {
  //         // "Sr No":a+i,
  //         "RegNo" :this.dataSource.data[i]["RegNo"] ? this.dataSource.data[i]["RegNo"]:"N/A",
           
  //           "Patient Name" :this.dataSource.data[i]["PatientName"] ? this.dataSource.data[i]["PatientName"] : "N/A",
  //           "GenderName" :this.dataSource.data[i]["GenderName"] ? this.dataSource.data[i]["GenderName"]:"N/A",
  //           "OTbookingDate" :this.dataSource.data[i]["OTbookingDate"] ? this.dataSource.data[i]["OTbookingDate"] :"N/A",
  //           "OTbookingTime" :this.dataSource.data[i]["OTbookingTime"] ? this.dataSource.data[i]["OTbookingTime"]:"N/A",
  //           "RoomName" :this.dataSource.data[i]["RoomName"] ? this.dataSource.data[i]["RoomName"]:"N/A",
  //           "BedName" :this.dataSource.data[i]["BedName"]+" - "+this.dataSource.data[i]["BedName"],
  //           "OP_IP_Id" :this.dataSource.data[i]["OP_IP_Id"] ? this.dataSource.data[i]["OP_IP_Id"]:"N/A",
  //            "AdmittingDoctor" :this.dataSource.data[i]["AdmittingDoctor"] ? this.dataSource.data[i]["AdmittingDoctor"]:"N/A",
  //            "SurgeonName" :this.dataSource.data[i]["SurgeonName"]+" - "+this.dataSource.data[i]["SurgeonName"],
  //            "SurgeryCategoryName" :this.dataSource.data[i]["SurgeryCategoryName"] ? this.dataSource.data[i]["SurgeryCategoryName"]:"N/A",
  //            "SurgeryType" :this.dataSource.data[i]["SurgeryType"]+" - "+this.dataSource.data[i]["SurgeryType"],
  //            "DepartmentName" :this.dataSource.data[i]["DepartmentName"] ? this.dataSource.data[i]["DepartmentName"]:"N/A"
             
  //       };
  //       excelData.push(singleEntry);
  //     }
  //     var fileName = "OT-Request-List " + new Date() +".xlsx";
  //     if(exprtType =="Excel"){
  //       const ws: XLSX.WorkSheet=XLSX.utils.json_to_sheet(excelData);
  //       var wscols = [];
  //       if(excelData.length > 0){ 
  //         var columnsIn = excelData[0]; 
  //         console.log(columnsIn);
  //         for(var key in columnsIn){
  //           let headerLength = {wch:(key.length+1)};
  //           let columnLength = headerLength;
  //           try{
  //             columnLength = {wch: Math.max(...excelData.map(o => o[key].length), 0)+1}; 
  //           }
  //           catch{
  //             columnLength = headerLength;
  //           }
  //           if(headerLength["wch"] <= columnLength["wch"]){
  //             wscols.push(columnLength)
  //           }
  //           else{
  //             wscols.push(headerLength)
  //           }
  //         } 
  //       }
  //       ws['!cols'] = wscols;
  //       const wb: XLSX.WorkBook = XLSX.utils.book_new();
  //       XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  //       XLSX.writeFile(wb, fileName);
  //     }else{
  //       let doc = new jsPDF('p','pt', 'a4');
  //       doc.page = 0;
  //       var col=[];
  //       for (var k in excelData[0]) col.push(k);
  //         console.log(col.length)
  //       var rows = [];
  //       excelData.forEach(obj => {
  //         console.log(obj)
  //         let arr = [];
  //         col.forEach(col => {
  //           arr.push(obj[col]);
  //         });
  //         rows.push(arr);
  //       });
      
  //       doc.autoTable(col, rows,{
  //         margin:{left:5,right:5,top:5},
  //         theme:"grid",
  //         styles: {
  //           fontSize: 3
  //         }});
  //       doc.setFontSize(3);
  //       // doc.save("Indoor-Patient-List.pdf");
  //       window.open(URL.createObjectURL(doc.output("blob")))
  //     }
  //   }
  // }
}



export class Requestlist {
  OTBookingId: any;
  RegNo: any;
  PatientName: String;
  RoomName: any;
  OTbookingDate: any;
  BedName: any;
  OP_IP_Id: any;
  OP_IP_Type: any;
  SurgeonId: any;
  SurgeryId: any;
  DoctorId: any;
  DepartmentId: any;
  CategoryId: any;
  RoomId: any;
  BedId: any;
  GenderId: any;
  AdmittingDoctor: any;
  SurgeonName: any;
  SurgeryCategoryName: any;
  SurgeryType: any;
  DepartmentName: any;
  AddedBy: any;
  UpdateBy: any;
  IsCancelled: any;
  GenderName: any;
  OTbookingTime: any;
  IsCancelledBy: any;

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
    this.SurgeryType = Requestlist.SurgeryType || 0;
    this.OTbookingTime = Requestlist.OTbookingTime || 0;
    this.IsCancelledBy = Requestlist.IsCancelledBy || 0;

  }
}



function ViewChild(MatSort: any) {
  throw new Error('Function not implemented.');
}


// export NODE_OPTIONS="--max-old-space-size=7168" # Increases to 7 GB
// export NODE_OPTIONS="--max-old-space-size=8192" # Increases to 8 GB