import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { DoctorShareService } from '../doctor-share.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { BillListForDocShrList } from '../doctor-share.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { AnyNaptrRecord } from 'dns';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';

@Component({
  selector: 'app-add-doctor-share',
  templateUrl: './add-doctor-share.component.html',
  styleUrls: ['./add-doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AddDoctorShareComponent implements OnInit {

    autocompleteModeItem: string = "ConDoctor";
    autocompletedepartment: string = "Department";
    autocompleteModeService: string = "Service";
    autocompleteClass: string = "Class";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "CurrencyMaster/List",
            columnsList: [
                { heading: "-", key: "firstName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "DoctorName", key: "middleName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ServiceName", key: "lastName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "Share%", key: "address", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "ShareAmt", key: "City", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "DocShareType", key: "Age", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "ClassName", key: "PhoneNo", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "O", key: "oPBILL", sort: true, align: 'left', emptySign: 'NA'},
            ],
            sortField: "firstName",
            sortOrder: 0,
            filters: [
                { fieldName: "firstName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
                // { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.Equals },
                // { fieldName: "To_Dt", fieldValue:this.toDate, opType: OperatorComparer.Equals },
            ]
        }


        itemId = 0;
        selectChangeItem(obj: any){
            console.log(obj);
            this.itemId=obj
        }

        getValidationMessages() {
            return {
                registrationNo:[],
                ipNo:[],
                opNo:[],
                patientType:[],

            };
        }

    displayedColumns:string[] = [ 
        'button',
        'DoctorName',
        'ServiceName',
        'Share',
        'ShareAmt',
        'DocShareType',
        'ClassName',
        'OP_IP_Type',  
      ];
    
      DoctorListfilteredOptions:Observable<string[]>; 
      DoctorNamefilteredOptions:Observable<string[]>; 
      ClassListfilteredOptions:Observable<string[]>; 
      doctorNameCmbList:any=[];
      sIsLoading: string = '';
      isDoctorIDSelected: boolean=false;
      isDoctorID1Selected: boolean=false;
      isServiceIDSelected: boolean=false; 
      isClassIdSelected: boolean=false; 
      ServiceList:any=[];
      filterdService:Observable<string[]>;
      noOptionFound:any;
      doctorNameCmbList1:any=[];
      GroupList:any=[];
      isGroupnameSelected:boolean=false;
      GroupListfilteredOptions:Observable<string[]>;
      doctorShareId:any;
      ClassList:any=[];
    
      dataSource = new MatTableDataSource<BillListForDocShrList>();
      @ViewChild(MatSort) sort:MatSort;
      @ViewChild(MatPaginator) paginator:MatPaginator;
data: any;
      
      constructor(
        public _DoctorShareService: DoctorShareService,
        public datePipe: DatePipe, 
        public _matDialog: MatDialog,
        public toastr: ToastrService,
      ) { }
    
      ngOnInit(): void {
        this.getAddDoctorList();
        this.getDoctorNameCombobox();
        this.getClassNameCombobox(); 
        this.getDoctorNameList();  
        this.getGroupListCombobox();
      }
    
      getDoctorNameList() {
        this._DoctorShareService.getAdmittedDoctorCombo().subscribe(data => {
          this.doctorNameCmbList1 = data; 
          //console.log(this.doctorNameCmbList);
          this.DoctorNamefilteredOptions = this._DoctorShareService.DocFormGroup.get('DoctorName').valueChanges.pipe(
            startWith(''), 
            map(value => value ? this._filterDocname1(value) : this.doctorNameCmbList1.slice()),
          );
        });
      }
      private _filterDocname1(value: any): string[] {
        if (value) {
          const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
          return this.doctorNameCmbList1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
        }
      }
      getOptionTextDoctorName1(option) {
        return option && option.Doctorname;
      }
    
      getDoctorNameCombobox() {
        this._DoctorShareService.getAdmittedDoctorCombo().subscribe(data => {
          this.doctorNameCmbList = data; 
         // console.log(this.doctorNameCmbList);
          this.DoctorListfilteredOptions = this._DoctorShareService.DocFormGroup.get('DoctorID').valueChanges.pipe(
            startWith(''), 
            map(value => value ? this._filterDocname(value) : this.doctorNameCmbList.slice()),
          );
        });
      }
      private _filterDocname(value: any): string[] {
        if (value) {
          const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
          return this.doctorNameCmbList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
        }
      }
      getOptionTextDoctorName(option) {
        return option && option.Doctorname;
      } 
    
      searchdoctorID:any=0;
      getAddDoctorList() {  
        if(this._DoctorShareService.DocFormGroup.get('DoctorName').value){
          this.searchdoctorID = this._DoctorShareService.DocFormGroup.get('DoctorName').value.DoctorId || 0;
        }else{
          this.searchdoctorID = 0;
        }
        this.sIsLoading = 'loading-data';
        var m_data = { 
          "DoctorId" :  this.searchdoctorID,
          "ShrTypeSerOrGrp":this._DoctorShareService.DocFormGroup.get('Type').value
        } 
        console.log(m_data);
        this._DoctorShareService.getDocShrList(m_data).subscribe(Visit => {
          this.dataSource.data = Visit as BillListForDocShrList[];
          //console.log(this.dataSource.data);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.sIsLoading = '';  
        },
          error => {
            this.sIsLoading = '';
          });
      } 
    
      getServiceListCombobox() {
        let ServiceName;
        if(this.ServiceName){
          ServiceName = this.ServiceName;
        }else{
          ServiceName = this._DoctorShareService.DocFormGroup.get('ServiceID').value;
        }
        var m_data = {
          "SrvcName": `${ServiceName}%`
        } 
        console.log(m_data);
        this._DoctorShareService.getServiceList(m_data).subscribe(data => {
          this.ServiceList = data;
          console.log(this.ServiceList);  
          this.filterdService = this._DoctorShareService.DocFormGroup.get('ServiceID').valueChanges.pipe(
            startWith(''), 
            map(value => value ? this._filterServicename(value) : this.ServiceList.slice()),
          ); 
          if(this.ServiceName){ 
              this._DoctorShareService.DocFormGroup.get('ServiceID').setValue(this.ServiceList[0])
          }
        });
      }
      private _filterServicename(value: any): string[] {
        if (value) {
          const filterValue = value && value.ServiceName ? value.ServiceName.toLowerCase() : value.toLowerCase();
          return this.ServiceList.filter(option => option.ServiceName.toLowerCase().includes(filterValue));
        }
      }
     
      getOptionTextService(option) { 
        return option && option.ServiceName ? option.ServiceName : ''; 
      }
      
    
      getClassNameCombobox() {
        var vdata={
           'ClassName': this._DoctorShareService.DocFormGroup.get('ClassId').value || '%'
        }
        this._DoctorShareService.getClassList(vdata).subscribe(data => {
          this.ClassList = data; 
          //console.log(this.ClassList);
          this.ClassListfilteredOptions = this._DoctorShareService.DocFormGroup.get('ClassId').valueChanges.pipe(
            startWith(''), 
            map(value => value ? this._filterClassName(value) : this.ClassList.slice()),
          );
        });
      }
      private _filterClassName(value: any): string[] {
        if (value) {
          const filterValue = value && value.ClassName ? value.ClassName.toLowerCase() : value.toLowerCase();
          return this.ClassList.filter(option => option.ClassName.toLowerCase().includes(filterValue));
        }
      }
      getOptionTextClassName(option) {
        return option && option.ClassName;
      } 
    
    
      getGroupListCombobox() { 
        this._DoctorShareService.getGroupList().subscribe(data => {
          this.GroupList = data; 
          //console.log(this.GroupList);
          this.GroupListfilteredOptions = this._DoctorShareService.DocFormGroup.get('GroupWise').valueChanges.pipe(
            startWith(''), 
            map(value => value ? this._filterGroupName(value) : this.GroupList.slice()),
          );
        });
      }
      private _filterGroupName(value: any): string[] {
        if (value) {
          const filterValue = value && value.GroupName ? value.GroupName.toLowerCase() : value.toLowerCase();
          return this.GroupList.filter(option => option.GroupName.toLowerCase().includes(filterValue));
        }
      }
      getOptionTextGroupName(option) {
        return option && option.GroupName;
      } 
      ServiceName:any;
      OnEdit(contact){
        console.log(contact)
        debugger 
        this.doctorShareId = contact.DoctorShareId; 
        this.ServiceName = contact.ServiceName; 
        this.getServiceListCombobox();
        if(contact.ServicePercentage>0){
          this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
          this.vServicePerc = contact.ServicePercentage;
        }else{
          this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('A');
          this.vServiceAmt = contact.ServiceAmount;
        } 
        if(contact.Op_IP_Type == '0'){
          this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
        }else{
          this._DoctorShareService.DocFormGroup.get('PatientType').setValue('1');
        } 
        if(contact.ShrTypeSerOrGrp== '1'){
          this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
        }else{
          this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('2');
        } 
        if(contact.DoctorId){
        const doctorValue =  this.doctorNameCmbList.find(item => item.DoctorId ===contact.DoctorId) 
        console.log(doctorValue)
          this._DoctorShareService.DocFormGroup.get('DoctorID').setValue(doctorValue)
        } 
        if(contact.ClassId){
          const ClassValue =  this.ClassList.find(item => item.ClassId ===contact.ClassId) 
          console.log(ClassValue)
            this._DoctorShareService.DocFormGroup.get('ClassId').setValue(ClassValue)
        }
        
     
      }
      vServicePerc:any;
      vServiceAmt:any; 
      OnSave(){
        if(this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value == '1'){
          if(!this._DoctorShareService.DocFormGroup.get('ServiceID').value){
            this.toastr.warning('Please Select Service Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return; 
          }
          if(!this.ServiceList.some(item => item.ServiceName === this._DoctorShareService.DocFormGroup.get('ServiceID').value.ServiceName)){
            this.toastr.warning('Please Select valid Service Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          } 
        }
        if(this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value == '2'){
          if(!this._DoctorShareService.DocFormGroup.get('GroupWise').value){
            this.toastr.warning('Please Select Group Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return; 
          }
          // if(!this.ServiceList.some(item => item.ServiceName === this._DoctorShareService.DocFormGroup.get('ServiceID').value.ServiceName)){
          //   this.toastr.warning('Please Select valid Service Name', 'Warning !', {
          //     toastClass: 'tostr-tost custom-toast-warning',
          //   });
          //   return;
          // } 
        }
        if(!this._DoctorShareService.DocFormGroup.get('ClassId').value){
          this.toastr.warning('Please Select Class Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
        if(this._DoctorShareService.DocFormGroup.get('ClassId').value){
          if(!this.ClassList.some(item => item.ClassName === this._DoctorShareService.DocFormGroup.get('ClassId').value.ClassName)){
            this.toastr.warning('Please Select valid Class Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }  
        } 
        if(!this._DoctorShareService.DocFormGroup.get('DoctorID').value){
          this.toastr.warning('Please Select Doctor Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
        if(this._DoctorShareService.DocFormGroup.get('DoctorID').value){
          if(!this.doctorNameCmbList.some(item => item.Doctorname === this._DoctorShareService.DocFormGroup.get('DoctorID').value.Doctorname)){
            this.toastr.warning('Please Select valid Doctor Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }  
        }
        if( this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'P'){
          if(this.vServicePerc == '' || this.vServicePerc == undefined || this.vServicePerc == '0' || this.vServicePerc == null){
            this.toastr.warning('Please enter Doctor Share Percentage ', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return; 
          } 
        }
        if( this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'A'){
          if(this.vServiceAmt == '' || this.vServiceAmt == undefined || this.vServiceAmt == '0' || this.vServiceAmt == null){
            this.toastr.warning('Please enter Doctor Share Amount ', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return; 
          } 
        } 
        if(!this.doctorShareId){
          let insertDoctorShareMasterParamObj = {};
          insertDoctorShareMasterParamObj['doctorShareId'] = 0,
          insertDoctorShareMasterParamObj['doctorID'] = this._DoctorShareService.DocFormGroup.get('DoctorID').value.DoctorId || 0;
          insertDoctorShareMasterParamObj['serviceId'] = this._DoctorShareService.DocFormGroup.get('ServiceID').value.ServiceId || 0;
          insertDoctorShareMasterParamObj['servicePercentage'] = this._DoctorShareService.DocFormGroup.get('Percentage').value || 0;
          insertDoctorShareMasterParamObj['docShrType'] = 0//this._DoctorShareService.DocFormGroup.get('DocShareType').value || 0;
          if( this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'P'){
            insertDoctorShareMasterParamObj['docShrTypeS'] = 'P'
          }else{
            insertDoctorShareMasterParamObj['docShrTypeS'] = 'A'
          } 
          insertDoctorShareMasterParamObj['serviceAmount'] = this._DoctorShareService.DocFormGroup.get('Amount').value || 0;
          insertDoctorShareMasterParamObj['classId'] =this._DoctorShareService.DocFormGroup.get('ClassId').value.ClassId || 0;
          insertDoctorShareMasterParamObj['shrTypeSerOrGrp'] =  this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value || 0;
          insertDoctorShareMasterParamObj['op_IP_Type'] = this._DoctorShareService.DocFormGroup.get('PatientType').value || 0;
      
          let submitData={
            'insertDoctorShareMasterParam':insertDoctorShareMasterParamObj
          }
          this._DoctorShareService.InsertDocShare(submitData).subscribe((response)=>{
            if (response) {
              this.toastr.success('Doctor Share Saved Successfully', 'Save !', {
                toastClass: 'tostr-tost custom-toast-success',
              });
              this.getAddDoctorList()
              this.Reset(); 
            } else {
              this.toastr.error('API Error!', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
          });
        }
        else{
          let updateDoctorShareMasterParamObj = {};
          updateDoctorShareMasterParamObj['doctorShareId'] = this.doctorShareId,
          updateDoctorShareMasterParamObj['doctorID'] = this._DoctorShareService.DocFormGroup.get('DoctorID').value.DoctorId || 0;
          updateDoctorShareMasterParamObj['serviceId'] = this._DoctorShareService.DocFormGroup.get('ServiceID').value.ServiceId || 0;
          updateDoctorShareMasterParamObj['servicePercentage'] = this._DoctorShareService.DocFormGroup.get('Percentage').value || 0;
          updateDoctorShareMasterParamObj['docShrType'] = 0//this._DoctorShareService.DocFormGroup.get('DocShareType').value || 0;
          if( this._DoctorShareService.DocFormGroup.get('DocShareType').value == 'P'){
            updateDoctorShareMasterParamObj['docShrTypeS'] = 'P'
          }else{
            updateDoctorShareMasterParamObj['docShrTypeS'] = 'A'
          } 
          updateDoctorShareMasterParamObj['serviceAmount'] = this._DoctorShareService.DocFormGroup.get('Amount').value || 0;
          updateDoctorShareMasterParamObj['classId'] =this._DoctorShareService.DocFormGroup.get('ClassId').value.ClassId || 0;
          updateDoctorShareMasterParamObj['shrTypeSerOrGrp'] =  this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').value || 0;
          updateDoctorShareMasterParamObj['op_IP_Type'] = this._DoctorShareService.DocFormGroup.get('PatientType').value || 0;
      
          let submitData={
            'updateDoctorShareMasterParam':updateDoctorShareMasterParamObj
          }
          this._DoctorShareService.UpdateDocShare(submitData).subscribe((response)=>{
            if (response) {
              this.toastr.success('Doctor Share Updated Successfully', 'Update !', {
                toastClass: 'tostr-tost custom-toast-success',
              });
              this.getAddDoctorList()
              this.Reset(); 
            } else {
              this.toastr.error('API Error!', 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
              });
            }
          });
        }
      
      }
      onClose(){
        this._matDialog.closeAll();
        this._DoctorShareService.DocFormGroup.reset();
        this.dataSource.data = [];
        this.Reset();
        this._DoctorShareService.DocFormGroup.get('Type').setValue('1');
      }
      Reset(){
        this._DoctorShareService.DocFormGroup.get('DoctorID').setValue('');
        this._DoctorShareService.DocFormGroup.get('GroupWise').setValue('');
        this._DoctorShareService.DocFormGroup.get('ServiceID').setValue('');
        this._DoctorShareService.DocFormGroup.get('Percentage').setValue('');
        this._DoctorShareService.DocFormGroup.get('Amount').setValue('');
        this._DoctorShareService.DocFormGroup.get('ClassId').setValue('');
        this._DoctorShareService.DocFormGroup.get('DocShareType').setValue('P');
        this._DoctorShareService.DocFormGroup.get('ServiceOrgrpType').setValue('1');
        this._DoctorShareService.DocFormGroup.get('PatientType').setValue('0');
      }
      keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      } 
      keyPressCharater(event){
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
          return true;
        } else {
          event.preventDefault();
          return false;
        }
      }
    }
    