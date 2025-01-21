import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, Inject, ElementRef } from "@angular/core";
import { ServiceMaster, ServiceMasterComponent, Servicedetail } from "../service-master.component";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, Validators } from "@angular/forms";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ServiceMasterService } from "../service-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { map, startWith } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { timeStamp } from "console";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-service-master-form",
  templateUrl: "./service-master-form.component.html",
  styleUrls: ["./service-master-form.component.scss"],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})

export class ServiceMasterFormComponent implements OnInit {

  displayedColumns: string[] = [
    'ClassId',
    'ClassName',
    'ClassRate',
  ];

  vGroupId: any;
  vTariffId: any;
  vDoctorId: any;
  vServiceName: any;
  vServiceShortDesc: any;
  vPrintOrder: any;
  vsubGroupId: any;
  isGroupIdSelected: boolean = false;
  isTariffIdSelected: boolean = false;
  isDoctorIdSelected: boolean = false;
  isEditMode: boolean = false;
  showEmg: boolean = false;
  showDoctor: boolean = false;
  isSubGroupIdselected: boolean = false;


  filteredGroupname: Observable<string[]>
  filteredTariff: Observable<string[]>
  filteredDoctor: Observable<string[]>
  filteredSubgroupname: Observable<string[]>

  registerObj = new ServiceMaster({});
  submitted = false;
  GroupcmbList: any = [];
  DoctorcmbList: any = [];
  SubGroupcmbList: any = [];
  ClasscmbList: any = [];
  TariffcmbList: any = [];
  vemg_amt:any;
  vemg_per:any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  DSServicedetailList = new MatTableDataSource<Servicedetail>();

  constructor(
    public _serviceMasterService: ServiceMasterService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public datePipe: DatePipe,   
    public dialogRef: MatDialogRef<ServiceMasterComponent>,
  ) { }

  ngOnInit(): void {
   
    if (this.data) { 
      this.registerObj = this.data.registerObj;
      this.vServiceName = this.registerObj.ServiceName
      this.vPrintOrder = this.registerObj.PrintOrder
      this.vServiceShortDesc = this.registerObj.ServiceShortDesc
      this.onEditService(this.registerObj);
      //this.emg_amt = this.registerObj.EmgAmt

      if (this.registerObj.CreditedtoDoctor == true) {
        this._serviceMasterService.myform.get('CreditedtoDoctor').setValue(this.registerObj.CreditedtoDoctor) 
        this.showDoctor = true;
      } 
      if (this.registerObj.IsEmergency == true) {
        this._serviceMasterService.myform.get('IsEmergency').setValue(this.registerObj.IsEmergency) 
        this.showEmg = true;
        this.vemg_amt = this.registerObj.EmgPer
        this.vemg_per = this.registerObj.EmgPer
      }
    }
    this.getClassList() 
    this.getGroupNameCombobox();
    this.getTariffNameCombobox();
    this.getSubgroupNameCombobox(); 
    this.getDoctorNameCombobox();
    //  this.getServicewiseClassMasterList(); 
   // this._serviceMasterService.myform.get('EffectiveDate').setValue(new Date());
  }
  onEditService(row) {
    console.log(row)
    var m_data = {  
      IsDocEditable:row.IsDocEditable,
      IsEditable: row.IsEditable,
      IsPackage: row.IsPackage,
      IsRadiology: row.IsRadiology,
      IsPathology: row.IsPathology, 
    };
    this._serviceMasterService.populateForm(m_data);
  }
  getGroupNameCombobox() {
    this._serviceMasterService.getGroupMasterCombo().subscribe(data => {
      this.GroupcmbList = data;

      this.filteredGroupname = this._serviceMasterService.myform.get('GroupId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterGroupName(value) : this.GroupcmbList.slice()),
      );
      if (this.data) {
        const ddValue = this.GroupcmbList.filter(c => c.GroupId == this.data.registerObj.GroupId);
        this._serviceMasterService.myform.get('GroupId').setValue(ddValue[0]);
        return;
      }
    });
  }
  getTariffNameCombobox() {
    this._serviceMasterService.getTariffMasterCombo().subscribe(data => {
      this.TariffcmbList = data;
      this.filteredTariff = this._serviceMasterService.myform.get('TariffId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTariff(value) : this.TariffcmbList.slice()),
      );
      if (this.data) {
        const ddValue = this.TariffcmbList.filter(c => c.TariffId == this.data.registerObj.TariffId);
        this._serviceMasterService.myform.get('TariffId').setValue(ddValue[0]);
        return;
      }
    });
  }
  getDoctorNameCombobox() {
    debugger
    this._serviceMasterService.getDoctorMasterCombo().subscribe(data => {
      this.DoctorcmbList = data;
      this.filteredDoctor = this._serviceMasterService.myform.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoctorName(value) : this.DoctorcmbList.slice()),
      );

      if (this.data) {
        const ddValue = this.DoctorcmbList.filter(c => c.DoctorID == this.data.registerObj.DoctorId);
        this._serviceMasterService.myform.get('DoctorId').setValue(ddValue[0]);
        return;
      }  
    });
   
  }
  getSubgroupNameCombobox() {
    var data = {
      SubGroupName: '%'
    }
    this._serviceMasterService.getSubgroupMasterCombo(data).subscribe(data => {
      this.SubGroupcmbList = data;
      this.filteredSubgroupname = this._serviceMasterService.myform.get('SubGroupId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSubGroupName(value) : this.SubGroupcmbList.slice()),
      );
      
      if (this.data) {
        const ddValue = this.SubGroupcmbList.filter(c => c.SubGroupId == this.data.registerObj.SubGroupid);
        this._serviceMasterService.myform.get('SubGroupId').setValue(ddValue[0]);
        return;
      }  
    });
  }
  getClassList() {
    if(this.registerObj.ServiceId){
      var data = {
        ServiceId: this.registerObj.ServiceId || 0
      }
      this._serviceMasterService.getServicewiseClassMasterList(data).subscribe(Menu => {
        this.DSServicedetailList.data = Menu as Servicedetail[];
        console.log(this.DSServicedetailList.data)
      });
    }else{
      this._serviceMasterService.getClassMasterList().subscribe(Menu => {
        this.DSServicedetailList.data = Menu as Servicedetail[];;
        this.DSServicedetailList.sort = this.sort;
        this.DSServicedetailList.paginator = this.paginator;
        console.log(this.DSServicedetailList.data)
      });
    } 
  }
  gettableclassrate(element, ClassRate) {
    console.log(element)
    // this.DSServicedetailList[element.ClassId]["ClassRate"]=ClassRate;
  }
 


  //filters
  private _filterTariff(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
      return this.TariffcmbList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }
  }
  private _filterGroupName(value: any): string[] {
    if (value) {
      const filterValue = value && value.GroupName ? value.GroupName.toLowerCase() : value.toLowerCase();
      return this.GroupcmbList.filter(option => option.GroupName.toLowerCase().includes(filterValue));
    }
  }
  private _filterDoctorName(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.DoctorcmbList.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }
  }
  private _filterSubGroupName(value: any): string[] {
    if (value) {
      const filterValue = value && value.SubGroupName ? value.SubGroupName.toLowerCase() : value.toLowerCase();
      return this.SubGroupcmbList.filter(option => option.SubGroupName.toLowerCase().includes(filterValue));
    }
  }

  //options
  getOptionTextgroupid(option) {
    return option && option.GroupName ? option.GroupName : '';
  }
  getOptionTextTariff(option) {
    return option && option.TariffName ? option.TariffName : '';
  }
  getOptionTextDoctorId(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }
  getOptionTextSubGroup(option) {
    return option && option.SubGroupName ? option.SubGroupName : '';
  }

  //onsave


  onSubmit() { 
      const currentDate = new Date();
      const datePipe = new DatePipe('en-US');
      const formattedTime = datePipe.transform(currentDate, 'yyyy-MM-dd hh:mm');
      const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    if ((this.vGroupId == '' || this.vGroupId == undefined || this.vGroupId == null)) {
      this.toastr.warning('Please select GroupName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._serviceMasterService.myform.get('GroupId').value) {
      if (!this.GroupcmbList.some(item => item.GroupId === this._serviceMasterService.myform.get('GroupId').value.GroupId)) {
        this.toastr.warning('Please Select valid GroupName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if ((this.vServiceName == '' || this.vServiceName == undefined || this.vServiceName == null)) {
      this.toastr.warning('Please enter ServiceName.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((this.vServiceShortDesc == '' || this.vServiceShortDesc == undefined || this.vServiceShortDesc == null)) {
      this.toastr.warning('Please enter Service Short Description', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    // if ((this.vPrintOrder == '' || this.vPrintOrder == undefined || this.vPrintOrder == '0')) {
    //   this.toastr.warning('Please enter Print Order.', 'Warning !', {
    //     toastClass: 'tostr-tost custom-toast-warning',
    //   });
    //   return;
    // }

    if ((this.vTariffId == '' || this.vTariffId == undefined || this.vTariffId == null)) {
      this.toastr.warning('Please select Tariff Name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._serviceMasterService.myform.get('TariffId').value) {
      if (!this.TariffcmbList.some(item => item.TariffId === this._serviceMasterService.myform.get('TariffId').value.TariffId)) {
        this.toastr.warning('Please Select valid Tariff Name', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (this.showDoctor) {
      if ((this.vDoctorId == '' || this.vDoctorId == undefined || this.vDoctorId == null)) {
        this.toastr.warning('Please select Doctor Name.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if (this._serviceMasterService.myform.get('DoctorId').value) {
        if (!this.DoctorcmbList.some(item => item.DoctorName === this._serviceMasterService.myform.get('DoctorId').value.DoctorName)) {
          this.toastr.warning('Please select valid DoctorName.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }
    } 
    if (this.showEmg) {
      if ((this.vemg_amt == '' || this.vemg_amt == undefined || this.vemg_amt == '0')) {
        this.toastr.warning('Please enter emergency amount.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      if ((this.vemg_per == '' || this.vemg_per == undefined || this.vemg_per == '0')) {
        this.toastr.warning('Please select emergency %.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    } 
    let subGroupId  = 0;
    if(this._serviceMasterService.myform.get("SubGroupId").value)
      subGroupId =  this._serviceMasterService.myform.get("SubGroupId").value.SubGroupId

    
    let doctorId  = 0;
    if(this._serviceMasterService.myform.get("DoctorId").value)
      doctorId = this._serviceMasterService.myform.get("DoctorId").value.DoctorID

    let IsPathology = 0;
    if(this._serviceMasterService.myform.get("IsPathology").value == true){
      IsPathology = 1
    }
    let IsRadiology = 0;
    if(this._serviceMasterService.myform.get("IsRadiology").value == true){
      IsRadiology = 1
    }
    let IsPackage = 0;
    if(this._serviceMasterService.myform.get("IsPackage").value == true){
      IsPackage = 1
    }

    if (this._serviceMasterService.myform.valid) {

      let serviceMasterdata = {
        "groupId": this._serviceMasterService.myform.get("GroupId").value.GroupId || 0,
        "serviceShortDesc": this._serviceMasterService.myform.get("ServiceShortDesc").value || '',
        "serviceName": this._serviceMasterService.myform.get("ServiceName").value || '',
        "price": 0,//this._serviceMasterService.myform.get("Price").value || 0,
        "isEditable": this._serviceMasterService.myform.get("IsEditable").value,
        "creditedtoDoctor": this._serviceMasterService.myform.get("CreditedtoDoctor").value,
        "isPathology": IsPathology, 
        "isRadiology": IsRadiology, 
        "isActive": this._serviceMasterService.myform.get("IsActive").value,
        "printOrder": this._serviceMasterService.myform.get("PrintOrder").value || 0,
        "isPackage":IsPackage, 
        "subgroupId": subGroupId,
        "doctorId": doctorId,
        "isEmergency": this._serviceMasterService.myform.get("IsEmergency").value,
        "emgAmt": this._serviceMasterService.myform.get("EmgAmt").value || 0,
        "emgPer": this._serviceMasterService.myform.get("EmgPer").value || 0,
        "isDocEditable": String(this._serviceMasterService.myform.get("IsDocEditable").value) == 'false' ? false : true,
        "serviceId": this._serviceMasterService.myform.get("ServiceId").value || 0
      }

      var clas_d = [];
      var serviceDetailInsert = {
        "serviceId": this._serviceMasterService.myform.get("ServiceId").value || 0,
        "tariffId": this._serviceMasterService.myform.get("TariffId").value.TariffId || 0,
        "classId": 0,
        "classRate": 0,
        "effectiveDate": formattedDate,
      }
      this.DSServicedetailList.data.forEach(element => {
        let c = JSON.parse(JSON.stringify(serviceDetailInsert));
        c['classId'] = element.ClassId;
        c['classRate'] = element.ClassRate || 0;
        clas_d.push(c)
      });

      if (!this.registerObj.ServiceId) {
        let m_data = {
          "serviceMasterInsert": serviceMasterdata,
          "serviceDetailInsert": clas_d
        }
        console.log(m_data);

        this._serviceMasterService.serviceMasterInsert(m_data).subscribe(data => {
          if (data) {
            this.toastr.success('Record Saved Successfully.', 'Saved !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.onClose();
          } else {
            this.toastr.error('Service Master Data not saved !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        }, error => {
          this.toastr.error('Service Data not saved !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        });
      }
      else {  
      let serviceDetDelete = {
        "serviceId": this.registerObj.ServiceId || 0,
        "tariffId": this._serviceMasterService.myform.get("TariffId").value.TariffId || 0, 
      } 

        var m_dataUpdate = {
          "serviceMasterUpdate": serviceMasterdata,
          "serviceDetailInsert": clas_d,
          "serviceDetDelete": serviceDetDelete 
        }
        console.log(m_dataUpdate)
        this._serviceMasterService.serviceMasterUpdate(m_dataUpdate).subscribe(data => {

          if (data) {
            this.toastr.success('Record updated Successfully.', 'updated !', {
              toastClass: 'tostr-tost custom-toast-success',
            });
            this.onClose();
          } else {
            this.toastr.error('Service Master Data not updated !, Please check API error..', 'Error !', {
              toastClass: 'tostr-tost custom-toast-error',
            });
          }
        }, error => {
          this.toastr.error('Service Data not Updated !, Please check API error..', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        });
      }
    }
  }

  onClose() {
    this._serviceMasterService.myform.reset();
    this._serviceMasterService.myform.get('IsEditable').setValue(true);
    this._serviceMasterService.myform.get('IsActive').setValue(true);
    //this._serviceMasterService.myform.get('EffectiveDate').setValue(new Date());
    this._serviceMasterService.myform.get('TariffId').setValue(this.TariffcmbList[0]);
    this.dialogRef.close();
  }


  creditChk(event){
    if(event.checked){
      this.showDoctor = true 
    }else{
      this.showDoctor = false
      this._serviceMasterService.myform.get('DoctorId').setValue('')
    }
  }
  emergencyChk(event){
    if(event.checked){
      this.showEmg = true 
    }else{
      this.showEmg = false
      this._serviceMasterService.myform.get('EmgAmt').setValue('')
      this._serviceMasterService.myform.get('EmgPer').setValue('')
    }
  }

  @ViewChild('subGroupId') subGroupId: ElementRef;
  @ViewChild('ServiceName') ServiceName: ElementRef;
  @ViewChild('ServiceShortDesc') ServiceShortDesc: ElementRef;
  @ViewChild('Price') Price: ElementRef;
  @ViewChild('PrintOrder') PrintOrder: ElementRef;
  @ViewChild('TariffId') TariffId: ElementRef;

  public onEntergrpname(event): void {
    if (event.which === 13) {
      this.subGroupId.nativeElement.focus();
    }
  }
  public onEntersubGroup(event): void {
    if (event.which === 13) {
      this.ServiceName.nativeElement.focus();
    }
  }

  public onEnterServiceName(event): void {
    if (event.which === 13) {
      this.ServiceShortDesc.nativeElement.focus();
    }
  }

  public onEnterServiceShortDesc(event): void {
    if (event.which === 13) {
      this.TariffId.nativeElement.focus();
    }
  }

  public onEnterPrice(event): void {
    if (event.which === 13) {
      //this.PrintOrder.nativeElement.focus();
    }
  }
  public onEnterTariff(event): void {
    if (event.which === 13) {
      this.PrintOrder.nativeElement.focus();
    }
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

  get f() { return this._serviceMasterService.myform.controls; }

  valuechange(event, cls) {
    cls['ClassRate'] = parseInt(event.target.value);
  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (event.key === 'Enter' || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      if (focusedElement.classList.contains('inputs')) {
        let nextElement: HTMLElement | null = null;
        if (event.key === 'ArrowRight' || event.key === 'Enter') {
          nextElement = focusedElement.closest('td')?.nextElementSibling as HTMLElement | null;
        } else if (event.key === 'ArrowLeft') {
          nextElement = focusedElement.closest('td')?.previousElementSibling as HTMLElement | null;
        }
        if (nextElement) {
          const nextInputs = nextElement.querySelectorAll('.inputs');
          if (nextInputs.length > 0) {
            (nextInputs[0] as HTMLInputElement).focus();
          }
        }
      }
    }
  }

}


