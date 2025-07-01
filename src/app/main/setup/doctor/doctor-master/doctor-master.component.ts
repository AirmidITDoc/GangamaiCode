import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { DoctorMasterService } from "./doctor-master.service";
import { NewDoctorComponent } from "./new-doctor/new-doctor.component";
import Swal from "sweetalert2";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { ExcelPreviewDialogComponent } from "./excel-preview-dialog/excel-preview-dialog.component";
import { DoctorschdulerComponent } from "./doctorschduler/doctorschduler.component";

@Component({
  selector: "app-doctor-master",
  templateUrl: "./doctor-master.component.html",
  styleUrls: ["./doctor-master.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorMasterComponent implements OnInit {
  myformSearch: FormGroup;

  f_name: any = ""
  l_name: any = ""
  active: any = "2"
  isCon: any = "1"
  isRef: any = "0"

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Code", key: "doctorId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Prefix", key: "prefixName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "FirstName", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "MiddleName", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "LastName", key: "lastName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "DateofBirth", key: "dateofBirth", sort: true, align: 'left', emptySign: 'NA', width:100, type: 6 },
    { heading: "Address", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "City", key: "city", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Pin", key: "pin", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Phone", key: "phone", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Mobile", key: "mobile", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Education", key: "education", sort: true, align: 'left', emptySign: 'NA'  ,width: 200,},
    // { heading: "IsConsultant", key: "isConsultant", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "IsRefDoc", key: "isRefDoc", sort: true, align: 'left', emptySign: 'NA'  },

    { heading: "IsConsultant", key: "isConsultant", type: gridColumnTypes.status, align: "center" },
{ heading: "IsRefDoc", key: "isRefDoc", type: gridColumnTypes.status, align: "center" },

    { heading: "Doctor Type", key: "doctorType", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Age Year", key: "ageYear", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Age Month", key: "ageMonth", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Age Day", key: "ageDay", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "PassportNo", key: "passportNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Esino", key: "esino", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "RegNo",key: "regno", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Reg Date", key: "regDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
    { heading: "Mah RegNo", key: "mahregno", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Mah RegDate ", key: "mahRegDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
    { heading: "RefDocHospitalName", key: "refDocHospitalName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsInHouseDoctor", key: "isInHouseDoctor", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsOnCallDoctor", key: "isOnCallDoctor", sort: true, align: 'left', emptySign: 'NA' },



    { heading: "Pan CardNo", key: "panCardNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Aadhar CardNo", key: "aadharCardNo", sort: true, align: 'left', emptySign: 'NA'},
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, callback: (data: any) => {
            this.onEdit(data);
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._doctorService.deactivateTheStatus(data.doctorId).subscribe((response: any) => {
              this.toastr.success(response.message);
              this.grid.bindGridData();
            });
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]

  allFilters = [
    { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
    { fieldName: "FlagActive", fieldValue: "1", opType: OperatorComparer.Equals },
    { fieldName: "ConsultantDoc_All", fieldValue: "1", opType: OperatorComparer.Equals },
    { fieldName: "ReferDoc_All", fieldValue: "0", opType: OperatorComparer.Equals }
  ]
  gridConfig: gridModel = {
    // apiUrl: "Doctor/ListLinq",
    apiUrl: "Doctor/DoctorList",
    columnsList: this.allColumns,
    sortField: "DoctorId",
    sortOrder: 1,
    filters: this.allFilters,
    row: 25
  }

  constructor(
    public _doctorService: DoctorMasterService, public toastr: ToastrService,
    private accountService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    public _matDialog: MatDialog,
    private excelDownloadService: ExcelDownloadService
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._doctorService.createSearchForm();
  }

  onClear() {
    this._doctorService.myform.reset({ IsDeleted: "false" });
    this._doctorService.initializeFormGroup();
  }

  onChangeFirst() {
    
    this.f_name = this.myformSearch.get('DoctorNameSearch').value + "%"
    this.l_name = this.myformSearch.get('lastName').value + "%" || "%"
    this.active = this.myformSearch.get('FlagActive').value
debugger
    if (this.myformSearch.get('IsConsultant').value == true) {
      this.isCon = "1"
       this.isRef = "0"
    } else {
      this.isCon = "0"
       this.isRef = "1"}
    //  if (this.myformSearch.get('IsConsultant').value == false) {
    //   this.isRef = "1"
    // } else {
    //   this.isCon = "0"
    // }
    this.getfilterdata();
  }

 
  getfilterdata() {
  
    this.gridConfig = {
      apiUrl: "Doctor/DoctorList",
      columnsList: this.allColumns,
      sortField: "DoctorId",
        sortOrder: 0,
        filters:  [
          { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        { fieldName: "FlagActive", fieldValue:this.active, opType: OperatorComparer.Equals },
        { fieldName: "ConsultantDoc_All", fieldValue: this.isCon, opType: OperatorComparer.Equals },
        { fieldName: "ReferDoc_All", fieldValue: this.isRef, opType: OperatorComparer.Equals }
        
            ],
        row: 25
    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

  }

  Clearfilter(event) {
    console.log(event)
    debugger
    if (event == 'firstName')
      this.myformSearch.get('DoctorNameSearch').setValue("")
    else
      if (event == 'lastName')
        this.myformSearch.get('lastName').setValue("")
    this.onChangeFirst();
  }

  
  // currentStatus = 1;
  // toggle(val: any) {
  //     if (val == "2") {
  //         this.currentStatus = 2;
  //     } else if (val == "1") {
  //         this.currentStatus = 1;
  //     }
  //     else {
  //         this.currentStatus = 0;

  //     }
  // }
  // currentStatus1 = 0;
  // toggle1(val: any) {
  //     if (val == "2") {
  //         this.currentStatus1 = 2;
  //     } else if (val == "1") {
  //         this.currentStatus1 = 1;
  //     }
  //     else {
  //         this.currentStatus1 = 0;

  //     }
  // }

  onEdit(row) {
    console.log(row)
    // this._doctorService.populateForm(row);
    const dialogRef = this._matDialog.open(
      NewDoctorComponent,
      {
        maxWidth: "95vw",
        maxHeight: "100vh",
        width: "100%",
        data: row
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.grid.bindGridData();
    });
  }
  changeStatus(status: any) {
    switch (status.id) {
      case 1:
        //this.onEdit(status.data)
        break;
      case 2:
        this.onEdit(status.data)
        break;
      case 5:
        this.onDeactive(status.data.genderId);
        break;
      default:
        break;
    }
  }

  onDeactive(doctorId) {

    this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      {
        disableClose: false,
      }
    );
    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to deactive?";
    this.confirmDialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this._doctorService.deactivateTheStatus(doctorId).subscribe((data: any) => {
          //  this.msg = data
          if (data.StatusCode == 200) {
            this.toastr.success(
              "Record updated Successfully.",
              "updated !",
              {
                toastClass:
                  "tostr-tost custom-toast-success",
              }
            );
            // this.getGenderMasterList();
          }
        });
      }
      this.confirmDialogRef = null;
    });
  }
  newDoctormaster() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button


    const dialogRef = this._matDialog.open(NewDoctorComponent, {
      maxWidth: "95vw",
      height: "95%",
      width: "100%",
      // height: "100%",
      autoFocus: false,
      ariaModal: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.grid.bindGridData();
    });
  }

  newSchdule() {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button
    const dialogRef = this._matDialog.open(DoctorschdulerComponent, {
      maxWidth: "95vw",
      maxHeight: "98vh",
      width: "100%",
      // height: "100%",
      autoFocus: false,
      ariaModal: true,

    });
    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed - Insert Action", result);
      this.grid.bindGridData();
    });
  }


  async handleFileChange(event: Event, inputRef: HTMLInputElement): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (!file) return;

    const allowedExtensions = ['.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();

    const isExcel = allowedExtensions.some((ext) => fileName.endsWith(ext));

    if (!isExcel) {
      Swal.fire('Invalid file type. Please select an Excel file (.xlsx or .xls)');
      inputRef.value = ''; // reset input
      return;
    }

    // Proceed file if valid
    try {
      const sheets = await this.excelDownloadService.readExcelFile(file);
      if (sheets && sheets.length) {
        const firstSheet = sheets[0];

        // Generating dynamic column for each row
        firstSheet.data = firstSheet.data.map((row: any) => ({
          ...row,
          DYNAMIC_COLUMN: '--',
        }));

        this._matDialog.open(ExcelPreviewDialogComponent, {
          width: '80%',
          height: '90%',
          data: firstSheet,
        });
        //   Reset the file value
        inputRef.value = '';
      }
    } catch (error) {
      console.log('Error in importinge excel file => ', error);
    }
  }
}

export class DoctorMaster {
  doctorId: number;
  prefixId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  dateofBirth: any;
  address: string;
  city: string;
  cityId: any;
  pin: string;
  phone: string;
  mobile: string;
  genderId: number;
  education: string;
  isConsultant: boolean;
  isRefDoc: boolean;
  isDeleted: boolean;
  doctorTypeId: number;
  ageYear: any;
  ageMonth: any;
  ageDay: any;
  passportNo: string;
  esino: string;
  regNo: string;
  regDate: any;
  RegDate1: any;
  mahRegNo: string;
  mahRegDate: any;
  MahRegDate1: any;
  UpdatedBy: number;
  refDocHospitalName: string;
  AddedBy: String;
  CurrentDate = new Date();
  IsDeletedSearch: number;
  Age: any;
  DoctorName: any;
  IsActive: any;
  MAHREGNO: any;
  panCardNo: any;
  aadharCardNo: any;
  isInHouseDoctor: any;
  Education: any;
  ESINO: any;
  signature: string;
  isOnCallDoctor: any;
  mDoctorDepartmentDets: DoctorDepartmentDet[];
  /**
   * Constructor
   *
   * @param DoctorMaster
   */
  constructor(DoctorMaster) {
    {
      this.doctorId = DoctorMaster.doctorId || 0;
      this.DoctorName = DoctorMaster.DoctorName || "";
      this.prefixId = DoctorMaster.prefixId || "";
      this.firstName = DoctorMaster.firstName || "";
      this.middleName = DoctorMaster.middleName || "";
      this.lastName = DoctorMaster.lastName || "";
      this.dateofBirth = DoctorMaster.dateofBirth || '';
      this.address = DoctorMaster.address || "";
      this.city = DoctorMaster.city || "";
      this.cityId = DoctorMaster.cityId || "";
      this.pin = DoctorMaster.pin || "";
      this.phone = DoctorMaster.phone || "";
      this.mobile = DoctorMaster.mobile || "";
      this.genderId = DoctorMaster.genderId || "";
      this.education = DoctorMaster.education || "";
      this.isConsultant = DoctorMaster.isConsultant || 1;
      this.isRefDoc = DoctorMaster.isRefDoc || 0;
      //  this.IsDeleted = DoctorMaster.IsDeleted || "false";
      this.doctorTypeId = DoctorMaster.doctorTypeId || "";
      this.Age = DoctorMaster.Age || "";
      this.ageYear = DoctorMaster.ageYear || "";
      this.ageMonth = DoctorMaster.ageMonth || "";
      this.ageDay = DoctorMaster.ageDay || "";
      this.passportNo = DoctorMaster.passportNo || "";
      this.esino = DoctorMaster.esino || "";
      this.regDate = DoctorMaster.regDate || this.CurrentDate;
      this.RegDate1 = DoctorMaster.RegDate1 || this.CurrentDate;
      this.Education = DoctorMaster.Education || "";
      this.mahRegDate = DoctorMaster.mahRegDate || this.CurrentDate;
      this.MahRegDate1 = DoctorMaster.MahRegDate1 || this.CurrentDate;
      this.UpdatedBy = DoctorMaster.UpdatedBy || "";
      this.AddedBy = DoctorMaster.AddedBy || "";
      this.IsActive = DoctorMaster.IsActive || 1;
      this.refDocHospitalName = DoctorMaster.refDocHospitalName || "";
      this.IsDeletedSearch = DoctorMaster.IsDeletedSearch || "";
      this.regNo = DoctorMaster.regNo || "";
      this.mahRegNo = DoctorMaster.mahRegNo || "";
      this.panCardNo = DoctorMaster.panCardNo || "";
      this.aadharCardNo = DoctorMaster.aadharCardNo || "";
      this.isInHouseDoctor = DoctorMaster.isInHouseDoctor || "";
      this.ESINO = DoctorMaster.ESINO || "";
      this.signature = DoctorMaster.Signature || "";
      this.isOnCallDoctor = DoctorMaster.isOnCallDoctor || 0;
      this.mDoctorDepartmentDets = DoctorMaster.mDoctorDepartmentDets;
    }
  }
}

export class DoctorDepartmentDet {
  Departmentid: any;
  departmentName: any;

  constructor(DoctorDepartmentDet) {
    {
      this.Departmentid = DoctorDepartmentDet.Departmentid || "";
      this.departmentName = DoctorDepartmentDet.departmentName || "";
    }
  }
}
