import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { ConfigurationService } from './configuration.service';
import { NewConfigurationComponent } from './new-configuration/new-configuration.component';
import { EditConfigurationComponent } from './edit-configuration/edit-configuration.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { AddAutoServiceComponent } from './add-auto-service/add-auto-service.component';
import { EditSMSConfigComponent } from './edit-smsconfig/edit-smsconfig.component';


@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ConfigurationComponent implements OnInit {

  myform: FormGroup
  ConfigFormGroup: FormGroup
  myConfigform: FormGroup
  smsSearchForm: FormGroup
  emailSearchForm: FormGroup
  auditFilterForm: FormGroup;
  smsUserName = ""
  emailUserName = ""
  ActionByName = ""
  autocompleteModeItem: string = "PatientType";
  autocompleteModeCashcounter: string = "CashCounter";
  autocompleteModeDepartment: String = "Department";
  autocompleteModedoctorty: string = "ConDoctor";
  screenFromString = 'Common-form';
  autocompleteModeClass: string = "Class";

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")



  DSServiceList = new MatTableDataSource<logervicedetail>();
  itemId = 0;
  dateTimeObj: any;
  Department = 0
  DoctorId = 0

  displayedColumns1: string[] = [
    'SystemConfigId',
    'Name',
    'SystemName',
    'IsInputField',
    'SystemInputValue'
  ];

  @ViewChild(AirmidTableComponent) smsgrid: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) emailgrid: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) auditgrid: AirmidTableComponent;
  // @ViewChild(AirmidTableComponent) grid3: AirmidTableComponent;
  @ViewChild('actionAuthanticate') actionAuthanticate!: TemplateRef<any>;
  @ViewChild('actionAuthanticatepass') actionAuthanticatepass!: TemplateRef<any>;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
  


  ngAfterViewInit() {
    this.gridConfig1.columnsList.find(col => col.key === 'reqAuthenticate')!.template = this.actionAuthanticate;
    this.gridConfig1.columnsList.find(col => col.key === 'passauthenticate')!.template = this.actionAuthanticatepass;
     this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
     this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  //SMS
  allColumnssms = [
    { heading: "SenderId", key: "senderId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "URL", key: "url", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Keys", key: "keys", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Campaign", key: "campaign", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "SPassword", key: "sPassword", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "StorageLocLink", key: "storageLocLink", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "ConType", key: "conType", sort: true, align: 'left', emptySign: 'NA', width: 120 },

    {
      heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  allFilterssms = [
    // { fieldName: "UserName", fieldValue: this.smsUserName, opType: OperatorComparer.StartsWith },
    // { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    // { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },

  ]

  gridConfig: gridModel = {
    apiUrl: "Configuration/SmsconfigList",
    columnsList: this.allColumnssms,
    sortField: "UserName",
    sortOrder: 0,
    filters: this.allFilterssms
  }
  //Email
  allColumnsemail = [
    { heading: "Status", key: "reqAuthenticate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Status", key: "passauthenticate", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
    { heading: "Display Name", key: "displayname", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Email Address", key: "emailaddress", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Mail Server", key: "mailserver", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Password", key: "password", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "isActive", key: "isActive", sort: true, align: 'left', emptySign: 'NA', width: 120 },

    {
      heading: "Action", key: "action", align: "right", width: 180, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate1  // Assign ng-template to the column
    }
  ]
  allFiltersemail = [
    // { fieldName: "UserName", fieldValue: this.emailUserName, opType: OperatorComparer.StartsWith },
    // { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
    // { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

  ]

  gridConfig1: gridModel = {
    apiUrl: "Configuration/EmailconfigList",
    columnsList: this.allColumnsemail,
    sortField: "UserName",
    sortOrder: 0,
    filters: this.allFiltersemail
  }
  

  constructor(
    public _ConfigurationService: ConfigurationService,
    private formBuilder: FormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService, public datePipe: DatePipe,
    private _matDialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.ConfigFormGroup = this.vConfigInsert()
    this.smsSearchForm = this._ConfigurationService.createsmsfilterConfigForm();
    this.emailSearchForm = this._ConfigurationService.createemailfilterConfigForm();

    this.myConfigform = this.vConfigFormInsert()
    this.getServiceList()

    this.serviceDetailsArray.push(this.createserviceDetail());
    this.auditFilterForm = this._ConfigurationService.CreateauditForm();
  }


  createserviceDetail(item: any = {}): FormGroup {
    console.log(item)
    return this.formBuilder.group({
      systemConfigId: [item.SystemConfigId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      systemCategoryId: [item.ConstantId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      systemName: [item.SystemName ?? '', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      isInputField: [item.IsInputField ? 1 : 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      systemInputValue: [item.SystemInputValue ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],

    });
  }

  get serviceDetailsArray(): FormArray {
    return this.ConfigFormGroup.get('serviceDetails') as FormArray;
  }

  vConfigInsert(): FormGroup {
    return this.formBuilder.group({
      serviceDetails: this.formBuilder.array([])

    });
  }

  vConfigFormInsert(): FormGroup {
    return this.formBuilder.group({
      Department: "",
      DoctorId: "",
      opdDepartment: "",
      opdDoctorId: "",
      InputFiled: 0,
      Inputvalue: 0,
      RegNo: 0,
      OPDNo: 0,
      OPSalesdisc: 0,
      IPSalesdisc: 0,
      SystemLogOutTime: 0
    });
  }
  onSubmit() {

    if (this.DSServiceList.data.length > 0) {

      Swal.fire({
        title: 'Confirm Action',
        text: 'Do you want to Change Configuration Setting ?',
        icon: 'warning',
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonColor: '#3085d6',
        denyButtonColor: '#6c757d',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        denyButtonText: 'No',
        // cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {

          this.serviceDetailsArray.clear();
          this.DSServiceList.data.forEach(item => {
            this.serviceDetailsArray.push(this.createserviceDetail(item));
          });
          console.log(this.serviceDetailsArray.value)
          this._ConfigurationService.ConfigSave(this.serviceDetailsArray.value).subscribe((response) => {

            this.getServiceList()
          });
        }
      });

    }

    else {
      this.toastr.warning('please check List is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }


  }


  getServiceList() {

    var param = {
      "searchFields": [

      ],
      "mode": "SystemConfigList"
    }
    console.log(param)
    this._ConfigurationService.getloginaccessRetrive(param).subscribe(Menu => {
      console.log(Menu)
      this.DSServiceList.data = Menu as logervicedetail[];
      console.log(this.DSServiceList.data)
    });
  }


  selectChangeDept(event) {
    this.Department = event.value
  }

  selectChangeDoctor(event) {
    this.DoctorId = event.value
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  //sms config
  onChangesmsuser() {
    this.fromDate = this.datePipe.transform(this.smsSearchForm.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.smsSearchForm.get('enddate').value, "yyyy-MM-dd")

    this.smsUserName = this.smsSearchForm.get('UserName').value

    this.getsmsfilterdata();
  }

  getsmsfilterdata() {

    this.gridConfig = {
      apiUrl: "Configuration/SmsconfigList",
      columnsList: this.allColumnssms,
      sortField: "UserName",
      sortOrder: 0,
      filters: [
        // { fieldName: "UserName", fieldValue: this.smsUserName, opType: OperatorComparer.Equals },

      ]
    }
    this.smsgrid.gridConfig = this.gridConfig;
    this.smsgrid.bindGridData();
  }

  Clearfiltersmsuser(event) {
    console.log(event)
    if (event == 'UserName')
      this.smsSearchForm.get('UserName').setValue("")
    this.onChangesmsuser()
  }

  //email config
  onChangeemailuser() {
    this.fromDate1 = this.datePipe.transform(this.emailSearchForm.get('fromDate').value, "yyyy-MM-dd")
    this.toDate1 = this.datePipe.transform(this.emailSearchForm.get('enddate').value, "yyyy-MM-dd")

    this.emailUserName = this.emailSearchForm.get('UserName').value

    this.getemailfilterdata();
  }

  getemailfilterdata() {
    this.gridConfig1 = {
      apiUrl: "Configuration/EmailconfigList",
      columnsList: this.allColumnsemail,
      sortField: "UserName",
      sortOrder: 0,
      filters: [
        // { fieldName: "UserName", fieldValue: this.emailUserName, opType: OperatorComparer.StartsWith },

      ]
    }
    this.emailgrid.gridConfig = this.gridConfig1;
    this.emailgrid.bindGridData();
  }

  Clearfilteremailuser(event) {
    console.log(event)
    if (event == 'UserName')
      this.emailSearchForm.get('UserName').setValue("")
    this.onChangeemailuser()
  }
  //Audit




  onClear(val: boolean) {
    this.myform.reset();
    //  this.dialogRef.close(val);
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }


  onClose() {
    //  this.dialogRef.close();
  }

  // Get unique category names from the data
  getCategoryNames(): string[] {
    if (!this.DSServiceList || !this.DSServiceList.data) {
      return [];
    }

    // Extract unique category names from the data
    const categories = this.DSServiceList.data
      .map(item => item.Name)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    
    return categories;
  }

  // Get configurations by category name
  getConfigByName(categoryName: string): any[] {
    if (!this.DSServiceList || !this.DSServiceList.data) {
      return [];
    }

    return this.DSServiceList.data.filter(item => item.Name === categoryName);
  }

  // Handle checkbox change event
  tableElementChecked(event: any, element: any) {
    console.log('Configuration changed:', element.SystemName, event);
    // Update the element's IsInputField property
    if (event.checked !== undefined) {
      element.IsInputField = event.checked;
    }
  }
      getAutoservice(){ 
            const dialogRef = this._matDialog.open(AddAutoServiceComponent,
                    {
                        maxWidth: "100%",
                        height: '75%',
                        width: '70%', 
                    });
                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed - Insert Action', result); 
                });
    }

    

      OnEditSms(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button 
            let that = this;
            const dialogRef = this._matDialog.open(EditSMSConfigComponent,
                {
                    maxWidth: "95vw",
                    height: '95%',
                    width: '90%',
                    data: row
    
                });
            dialogRef.afterClosed().subscribe(result => {
                // that.grid.bindGridData();
            });
        }

          OnEditEmail(row: any = null) {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button 
            let that = this;
            const dialogRef = this._matDialog.open(EditSMSConfigComponent,
                {
                    maxWidth: "95vw",
                    height: '95%',
                    width: '90%',
                    data: row
    
                });
            dialogRef.afterClosed().subscribe(result => {
                // that.grid.bindGridData();
            });
        }

}


export class Congigdetail {
  LoginConfigId: any;
  Name: any;
  AccessCategoryId: any;
  AccessValueId: any;
  IsInputField: any;


  constructor(Congigdetail) {
    {
      this.LoginConfigId = Congigdetail.LoginConfigId || 0;
      this.Name = Congigdetail.Name || '';
      this.AccessCategoryId = Congigdetail.AccessCategoryId || 0;
      this.AccessValueId = Congigdetail.AccessValueId || 0;
      this.IsInputField = Congigdetail.IsInputField || 0;

    }
  }
}



export class logervicedetail {
  SystemConfigId: any;
  SystemCategoryId: any;
  SystemName: any;
  IsInputField: any;
  SystemInputValue: any;
  Name: any;

  constructor(logervicedetail) {
    {
      this.SystemConfigId = logervicedetail.SystemConfigId || 0;
      this.SystemCategoryId = logervicedetail.SystemCategoryId || 0;
      this.SystemName = logervicedetail.SystemName || 0;
      this.IsInputField = logervicedetail.IsInputField || 0;
      this.SystemInputValue = logervicedetail.SystemInputValue || 0;
      this.Name = logervicedetail.Name || '';

    }
  }
}
