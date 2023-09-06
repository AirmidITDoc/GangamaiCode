import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OPSearhlistService } from '../op-searhlist.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { fuseAnimations } from '@fuse/animations';
import { EditRegistrationComponent } from '../../registration/edit-registration/edit-registration.component';
import { RegInsert } from '../../registration/registration.component';
import { RegistrationService } from '../../registration/registration.service';
import { NewAppointmentComponent } from '../../appointment/new-appointment/new-appointment.component';
import { NewRegistrationComponent } from '../../registration/new-registration/new-registration.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SearchPageComponent implements OnInit {


  step = 0;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  sIsLoading: string = '';
  setStep(index: number) {
    this.step = index;
  }
  registerObj = new RegInsert({});

  Range: boolean = false;
  OP_IP_Type: any;
  PatientType: any = 1;
  Fromdate: any;
  Todate: any;
  @Input() dataArray: any;
  msg: any;
  SearchName: string;
  screenFromString = 'OP-billing';
  displayedColumns: string[] = [


    'RegNo',
    'PatientName',
    'AgeYear',
    'GenderName',
    'PhoneNo',
    'MobileNo',
    // 'Address',

    'action'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<OPIPPatientModel>();
  isLoading: String = '';

  constructor(
    public _SearchdialogService: OPSearhlistService,
    public _registrationService: RegistrationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<SearchPageComponent>,
  ) { }

  ngOnInit(): void {
    // this.myFilterform=this.filterForm();

    debugger;
    this.sIsLoading = 'loading-data';

    var m_data = {

      "F_Name": (this._SearchdialogService.myFilterform.get("FirstName").value).trim() + '%' || '%',
      "L_Name": (this._SearchdialogService.myFilterform.get("LastName").value).trim() + '%' || '%',
      "Reg_No": this._SearchdialogService.myFilterform.get("RegNo").value || 0,
      "From_Dt": this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._SearchdialogService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "MobileNo": '%'
    }

    console.log(m_data);
    this.sIsLoading = 'loading-data';
    this._SearchdialogService.getOPPatientList(m_data).subscribe(Visit => {
      console.log(this.dataSource.data);
      this.dataSource.data = Visit as OPIPPatientModel[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = ' ';


    },
      error => {
        this.sIsLoading = '';
      });

    if (this.data) {
      debugger;
      this.registerObj = this.data.registerObj;

      console.log(this.registerObj);

    }
  }

  getOPIPPatientList() {

    this.sIsLoading = 'loading-data';
    this.PatientType = this._SearchdialogService.myFilterform.get("PatientType").value;

    console.log(this.PatientType);

    if (this.PatientType != "0") {
      this.Fromdate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");//'01/01/1900';
      this.Todate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");
      this._SearchdialogService.myFilterform.get('start').value.disable;
      this._SearchdialogService.myFilterform.get('end').value.disable;
      // this.Range = true;
      this.OP_IP_Type = 1;
    }
    else {
      this.Fromdate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000");
      this.Todate = this.datePipe.transform(this._SearchdialogService.myFilterform.get("end").value, "yyyy-MM-dd 00:00:00.000");

      this._SearchdialogService.myFilterform.get('start').value.enable;
      this._SearchdialogService.myFilterform.get('end').value.enable;
      // this.Range = false;
      this.OP_IP_Type = 0;
    }

    var m_data = {
      "F_Name": (this._SearchdialogService.myFilterform.get("FirstName").value) + '%' || '%',
      "L_Name": (this._SearchdialogService.myFilterform.get("LastName").value) + '%' || '%',
      "Reg_No": this._SearchdialogService.myFilterform.get("RegNo").value || 0,
      "From_Dt": this.datePipe.transform(this._SearchdialogService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.Todate,//this.Todate this.datePipe.transform(this._SearchdialogService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "MobileNo": '%'
    }
    console.log(m_data);
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._SearchdialogService.getOPPatientList(m_data).subscribe(Visit => {
        console.log(this.dataSource.data);
        this.dataSource.data = Visit as OPIPPatientModel[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;

        this.sIsLoading = ' ';

      },
        error => {
          this.sIsLoading = '';
        });
    }, 50);
  }


  onClear() {
    this._SearchdialogService.myFilterform.get('FirstName').reset();
    this._SearchdialogService.myFilterform.get('LastName').reset();
    this._SearchdialogService.myFilterform.get('RegNo').reset();
    this._SearchdialogService.myFilterform.get('IPDNo').reset();

  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onClose() {
    // this._NursingStationService.mySaveForm.reset();
    this.dialogRef.close();
  }


  onEdit(row) {
    console.log(row);
    var m_data = {
      "RegNo": row.RegNo,
      "RegId": row.RegId,
      "PrefixID": row.PrefixID,
      "PrefixName": row.PrefixName,
      "FirstName": row.FirstName.trim(),
      "MiddleName": row.MiddleName.trim(),
      "LastName": row.LastName.trim(),
      "PatientName": row.PatientName.trim(),
      "DateofBirth": row.DateofBirth,
      "MaritalStatusId": row.MaritalStatusId,
      "AadharCardNo": row.AadharCardNo,
      "Age": row.Age,
      "AgeDay": row.AgeDay.trim(),
      "AgeMonth": row.AgeMonth.trim(),
      "AgeYear": row.AgeYear.trim(),
      "Address": row.Address.trim(),
      "AreaId": row.AreaId,
      "City": row.City.trim(),
      "CityId": row.CityId,
      "StateId": row.StateId,
      "CountryId": row.CountryId,
      "PhoneNo": row.PhoneNo.trim(),
      "MobileNo": row.MobileNo.trim(),
      "GenderId": row.GenderId,
      "GenderName": row.GenderName,
      "ReligionId": row.ReligionId,
      "IsCharity": 0,
      "PinNo": row.PinNo,
      "RegDate": row.RegDate,
      "RegNoWithPrefix": row.RegNoWithPrefix,
      "RegTime": row.RegTime.trim()
    }

   
    this._registrationService.populateFormpersonal(m_data);
    this.onClose();
    debugger;
    if (this.data.registerObj.RegAppoint == 0) {
      const dialogRef = this._matDialog.open(NewAppointmentComponent,
        {
          maxWidth: "95vw",
          height: '800px',
          width: '100%',
          data: {
            registerObj: m_data,
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        // this._SearchdialogService.getregisterList(this.D_data1).subscribe(reg=> {
        //   this.dataArray = reg;
        //   this.getregistrationList();
        //   this.sIsLoading = '';
        // },
        // error => {
        //   this.sIsLoading = '';
        // });
      });
    } 
    else {

      var D_data = {
        RegId: row.RegId,
      };
      this._registrationService.getregisterListByRegId(D_data).subscribe((reg) => {
        this.dataArray = reg;
        console.log(this.dataArray);
        var m_data = {
          RegNo: this.dataArray[0].RegNo,
          RegId: this.dataArray[0].RegId,
          PrefixID: this.dataArray[0].PrefixId,
          PrefixName: this.dataArray[0].PrefixName,
          FirstName: this.dataArray[0].FirstName,
          MiddleName: this.dataArray[0].MiddleName,
          LastName: this.dataArray[0].LastName,
          PatientName: this.dataArray[0].PatientName,
          DateofBirth: this.dataArray[0].DateofBirth,
          MaritalStatusId: this.dataArray[0].MaritalStatusId,
          AadharCardNo: this.dataArray[0].AadharCardNo || 0,
          Age: this.dataArray[0].Age.trim(),
          AgeDay: this.dataArray[0].AgeDay,
          AgeMonth: this.dataArray[0].AgeMonth,
          AgeYear: this.dataArray[0].AgeYear,
          Address: this.dataArray[0].Address,
          AreaId: this.dataArray[0].AreaId,
          City: this.dataArray[0].City,
          CityId: this.dataArray[0].CityId,
          StateId: this.dataArray[0].StateId,
          CountryId: this.dataArray[0].CountryId,
          PhoneNo: this.dataArray[0].PhoneNo,
          MobileNo: this.dataArray[0].MobileNo,
          GenderId: this.dataArray[0].GenderId,
          GenderName: this.dataArray[0].GenderName,
          ReligionId: this.dataArray[0].ReligionId,
          IsCharity: 0,
          PinNo: this.dataArray[0].PinNo,
          RegDate: this.dataArray[0].RegDate,
          RegNoWithPrefix: this.dataArray[0].RegNoWithPrefix,
          RegTime: this.dataArray[0].RegTime,
        };
        this._registrationService.populateFormpersonal(m_data);
        const dialogRef = this._matDialog.open(
          EditRegistrationComponent,
          {
            maxWidth: "85vw",
            height: "550px",
            width: "100%",
            data: {
              registerObj: m_data,
            },
          }
        );
        dialogRef.afterClosed().subscribe((result) => {
          console.log(
            "The dialog was closed - Insert Action",
            result
          );
          // this.getVisitList();
        });
      },
        (error) => {
          this.sIsLoading = "";
        }
      );

      const dialogRef = this._matDialog.open(NewRegistrationComponent,
        {
          maxWidth: "85vw",
          height: '550px',
          width: '100%',
          data: {
            registerObj: m_data,
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        // this._SearchdialogService.getregisterList(this.D_data1).subscribe(reg=> {
        //   this.dataArray = reg;
        //   this.getregistrationList();
        //   this.sIsLoading = '';
        // },
        // error => {
        //   this.sIsLoading = '';
        // });
        this._matDialog.closeAll();
      });

    }
  }

}


export class OPIPPatientModel {
  Adm_Vit_ID: any;
  PatientName: string;
  RegNoWithPrefix: any;
  AgeYear: any;
  IP_OP_Number: any;
  Adm_DoctorName: string;
  ClassName: any;
  TariffName: any;
  CompanyName: Number;
  IPNumber: any;
  Adm_Vit_Date: Date;
  Adm_Vit_Time: Date;
  PatientType: any;
  IsDischarged: any;
  WardId: any;
  BedId: any;
  IsPharClearance: any
  Bedname: any;
  TariffId: any;
  ClassId: any;
  OP_IP_ID: any;
  RegNo: number;
  /**
* Constructor
*
* @param OPIPPatientModel
*/
  constructor(OPIPPatientModel) {
    {
      this.Adm_Vit_ID = OPIPPatientModel.Adm_Vit_ID || '';
      this.PatientName = OPIPPatientModel.PatientName || '';
      this.RegNoWithPrefix = OPIPPatientModel.RegNoWithPrefix || '';
      this.AgeYear = OPIPPatientModel.AgeYear || 0;
      this.IP_OP_Number = OPIPPatientModel.IP_OP_Number || 0;
      this.Adm_DoctorName = OPIPPatientModel.Adm_DoctorName || 0;
      this.ClassName = OPIPPatientModel.ClassName || '';
      this.TariffName = OPIPPatientModel.TariffName || '';
      this.CompanyName = OPIPPatientModel.CompanyName || '';
      this.IPNumber = OPIPPatientModel.IPNumber || '';

      this.Adm_Vit_Date = OPIPPatientModel.Adm_Vit_Date || '';
      this.Adm_Vit_Time = OPIPPatientModel.Adm_Vit_Time || '';
      this.PatientType = OPIPPatientModel.PatientType || '';
      this.IsDischarged = OPIPPatientModel.IsDischarged || '';
      this.WardId = OPIPPatientModel.WardId || '';
      this.BedId = OPIPPatientModel.BedId || '';
      this.IsPharClearance = OPIPPatientModel.IsPharClearance || '';
      this.RegNo = OPIPPatientModel.RegNo || 0;
      this.Bedname = OPIPPatientModel.Bedname || '';
      this.WardId = OPIPPatientModel.WardId || '';
      this.PatientType = OPIPPatientModel.PatientType || '';
      this.TariffId = OPIPPatientModel.TariffId || 0;
      this.ClassId = OPIPPatientModel.ClassId || 0;
      this.OP_IP_ID = OPIPPatientModel.OP_IP_ID || 0;
    }
  }
}

