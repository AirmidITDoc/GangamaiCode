import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, Inject } from "@angular/core";
import { ServiceMaster, ServiceMasterComponent, Servicedetail } from "../service-master.component";
import { fuseAnimations } from "@fuse/animations";
import { MatTableDataSource } from "@angular/material/table";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ServiceMasterService } from "../service-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { element } from "protractor";
import { NONE_TYPE } from "@angular/compiler";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { compact } from "lodash";
import { error } from "console";

@Component({
    selector: "app-service-master-form",
    templateUrl: "./service-master-form.component.html",
    styleUrls: ["./service-master-form.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
  })
  
  export class ServiceMasterFormComponent implements OnInit {
    serviceForm:FormGroup;
    TariffId=0
    gridConfig: gridModel = {
      apiUrl: "ClassMaster/List",
  columnsList: [
      { heading: "Code", key: "classId", sort: true, align: 'left', emptySign: 'NA', width:160 },
      { heading: "Billing Class Name", key: "className", sort: true, align: 'left', emptySign: 'NA', width:700 },
     
     { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:160 },
           {
              heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:160, actions: [
                  {
                      action: gridActions.edit, callback: (data: any) => {
                          this.onSave(data);
                      }
                  }, {
                      action: gridActions.delete, callback: (data: any) => {
                          this.confirmDialogRef = this._matDialog.open(
                              FuseConfirmDialogComponent,
                              {
                                  disableClose: false,
                              }
                          );
                          this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                          this.confirmDialogRef.afterClosed().subscribe((result) => {
                              if (result) {
                                  let that = this;
                                  this._serviceMasterService.deactivateTheStatus(data.classId).subscribe((response: any) => {
                                      this.toastr.success(response.message);
                                      that.grid.bindGridData();
                                  });
                              }
                              this.confirmDialogRef = null;
                          });
                      }
                  }]
          } //Action 1-view, 2-Edit,3-delete
      ],
      sortField: "classId",
      sortOrder: 0,
      filters: [
          { fieldName: "className", fieldValue: "", opType: OperatorComparer.Contains },
          { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      row: 25
  }
  private _matDialog: any;

  onSave(row: any=null){
    
  }
  isEditMode: boolean = false;
  showEmg: boolean = false;
  showDoctor: boolean = false;
  submitted = false;

  TariffId=0
  registerObj=new ServiceMaster({});

  butDisabled:boolean = false;
  msg:any;
  emg_amt = "";
  emg_per = "";
  DSServicedetailList = new MatTableDataSource<Servicedetail>();
  
  getServiceMasterList: any;

  // new api
  autocompleteModegroupName:string="GroupName";
  autocompleteModesubGroupName:string="SubGroupName";
  autocompleteModetariff: string = "Tariff";
  confirmDialogRef: any;
  grid: any;

  constructor(public _serviceMasterService: ServiceMasterService,
    public toastr : ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ServiceMasterComponent>,
    ) {
     
      //this.getClassList();
     
     }

    @ViewChild(MatSort) sort:MatSort;
    @ViewChild(MatPaginator) paginator:MatPaginator;
    
    
    displayedColumns: string[] = [
      'ClassId',
      'ClassName',
      'ClassRate',
    ];
    
  ngOnInit(): void {
this.serviceForm=this._serviceMasterService.createServicemasterForm();
 
   this.getClassList()
  //  this.getServicewiseClassMasterList();
   
   this.serviceForm=this._serviceMasterService.createServicemasterForm();

   this.serviceForm.get('EffectiveDate').setValue(new Date());



   if (this.data) {
   // this.getServicewiseClassMasterList();
    this.registerObj = this.data.registerObj;
    
}

  }
  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    const focusedElement = document.activeElement as HTMLElement;
    if (event.key === 'Enter' || event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        if (focusedElement.classList.contains('inputs')) {
            let nextElement: HTMLElement | null = null;
            if (event.key === 'ArrowRight' || event.key==='Enter') {
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

 
  getClassList() {
    var param={
      "first": 0,
      "rows": 25,
      sortField: "classId",
      sortOrder: 0,
      filters: [
          { fieldName: "className", fieldValue: "", opType: OperatorComparer.Contains },
          { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
      
      ],
      "exportType": "JSON"
    }
    this._serviceMasterService.getClassMasterList(param).subscribe(Menu => {
    
      this.DSServicedetailList.data = Menu.data as Servicedetail[];;
      this.DSServicedetailList.sort = this.sort;
      this.DSServicedetailList.paginator = this.paginator;      
      console.log(this.DSServicedetailList.data)
    });
  }

  gettableclassrate(element,ClassRate){
    console.log(element)
    // this.DSServicedetailList[element.ClassId]["ClassRate"]=ClassRate;
  }
  classratearry=[];
  // getServicewiseClassMasterList() {
  //   var data={
  //     ServiceId :this.data.registerObj.ServiceId || 0
  //   }
  //   this._serviceMasterService.getServicewiseClassMasterList(data).subscribe(Menu => {
  //     this.DSServicedetailList.data = Menu as Servicedetail[];
  //     console.log(this.DSServicedetailList.data)
      
  //   });
    
  // }

  

  get f() { return this.serviceForm.controls; }

  
  
  valuechange(event, cls){    
    cls['ClassRate'] = parseInt(event.target.value);
  }

  onSubmit() {
    debugger;
  //   if (this.showEmg) {
  //     this.serviceForm.get('EmgAmt').setValidators([Validators.required,Validators.min(0)]);
  //     this.serviceForm.get('EmgPer').setValidators([Validators.required,Validators.min(0)]);
      
  // } else {
  //     this.serviceForm.get('EmgAmt').clearValidators();
  //     this.serviceForm.get('EmgPer').clearValidators();
  // }            
  // this.serviceForm.get('EmgAmt').updateValueAndValidity();
  // this.serviceForm.get('EmgPer').updateValueAndValidity();
  //   if (this.serviceForm.valid ) {

  //     var clas_d = [];
  //     var class_det ={      
  //       "serviceId":parseInt(this.serviceForm.get("ServiceId").value || 0),
  //       "tariffId":this.serviceForm.get("TariffId").value || 0,
  //       "classId": 0,
  //       "classRate":0,
  //       "effectiveDate":this.serviceForm.get("EffectiveDate").value || "01/01/1900",
  //    }
  //     this.DSServicedetailList.data.forEach(element => {
  //       debugger
  //       let c =  JSON.parse(JSON.stringify(class_det));
  //       c['classId'] = element.ClassId;
  //       c['classRate'] = element.ClassRate || 0;        
  //       clas_d.push(c)
  //     });


  //     let serviceMasterdata = {
  //       "serviceShortDesc": this.serviceForm.get("ServiceShortDesc").value,
  //       "serviceName": (this.serviceForm.get("ServiceName").value).trim(),
  //       "price": parseInt(this.serviceForm.get("Price").value || "0"),
  //       "printOrder": parseInt(this.serviceForm.get("PrintOrder").value),
  //       "isEditable": String(this.serviceForm.get("IsEditable").value) == 'false' ?  false : true ,
  //       "creditedtoDoctor":  String (this.serviceForm.get("CreditedtoDoctor").value) == 'false' ? false : true ,
  //       "isPathology": String(this.serviceForm.get("IsPathology").value) == 'false' ? 0:1,
  //       "isRadiology": String(this.serviceForm.get("IsRadiology").value) == 'false' ? 0:1,
  //       "isActive": String(this.serviceForm.get("IsActive").value) == 'false' ?  false : true ,
  //       "isPackage": String(this.serviceForm.get("IsPackage").value) == 'false' ? 0:1 ,
  //       "isDocEditable": String(this.serviceForm.get("IsDocEditable").value) == 'false' ? false : true,  

  //       "isEmergency": String(this.serviceForm.get("IsEmergency").value) == 'false' ? false : true ,
  //       "emgAmt": parseInt(this.serviceForm.get("EmgAmt").value ||"0"),
  //       "emgPer": parseInt(this.serviceForm.get("EmgPer").value ||"0"),
        
  //       "groupId": parseInt(this.serviceForm.get("GroupId").value || 0),
  //       "subgroupId": parseInt(this.serviceForm.get("SubGroupId").value || 0),
  //       "doctorId": this.serviceForm.get("DoctorId").value ||0,        
     
  //       "serviceId":parseInt(this.serviceForm.get("ServiceId").value || 0),                 
  //     }


  //     if (!this.serviceForm.get("ServiceId").value) {

       
  //       let m_data = {
  //         "serviceMasterInsert": serviceMasterdata,
  //         "serviceDetailInsert" :clas_d 
  //       }
  //       console.log(m_data);

  //       this._serviceMasterService.serviceMasterInsert(m_data).subscribe(data => {
  //         this.msg = data;
  //         if (data) {
  //           this.toastr.success('Record Saved Successfully.', 'Saved !', {
  //               toastClass: 'tostr-tost custom-toast-success',
  //             });
            
  //       } else {
  //           this.toastr.error('Service Master Data not saved !, Please check API error..', 'Error !', {
  //               toastClass: 'tostr-tost custom-toast-error',
  //             });  
  //       }      
  //   },error => {
  //       this.toastr.error('Service Data not saved !, Please check API error..', 'Error !', {
  //        toastClass: 'tostr-tost custom-toast-error',
  //      });
  //    });
       
  //     }
  //     else {
  //       debugger;
  //       var m_dataUpdate = {        
  //           "serviceMasterUpdate": serviceMasterdata,
  //           "serviceDetailInsert" :clas_d, 
  //           "serviceDetDelete": {
  //             "serviceId": this.serviceForm.get("ServiceId").value,
  //             "tariffId":this.serviceForm.get("TariffId").value,
  //           },
  //       }

  //       this._serviceMasterService.serviceMasterUpdate(m_dataUpdate).subscribe(data => {
  //         this.msg = data; 
  //          if (data) {
  //           this.toastr.success('Record updated Successfully.', 'updated !', {
  //               toastClass: 'tostr-tost custom-toast-success',
  //             });                      
  //       } else {
  //           this.toastr.error('Service Master Data not updated !, Please check API error..', 'Error !', {
  //               toastClass: 'tostr-tost custom-toast-error',
  //             });
  //       }      
  //   },error => {
  //       this.toastr.error('Service Data not Updated !, Please check API error..', 'Error !', {
  //        toastClass: 'tostr-tost custom-toast-error',
  //      });
  //    });       
  //     }
     
  //   }
  
  if(!this.serviceForm.get("ServiceId").value){

    var data1=[];
    var clas_d = [];
    var class_det ={      
      "serviceId":parseInt(this.serviceForm.get("ServiceId").value || 0),
      "tariffId":this.serviceForm.get("TariffId").value || 0,
      "classId": 0,
      "classRate":0,
      "effectiveDate":this.serviceForm.get("EffectiveDate").value || "01/01/1900",
   }
    this.DSServicedetailList.data.forEach(element => {
      debugger
      let c =  JSON.parse(JSON.stringify(class_det));
      c['classId'] = element.ClassId;
      c['classRate'] = element.ClassRate || 0;        
      clas_d.push(c)
    });

    console.log("ServiceInsert data1:",data1);

    var mdata={
      "serviceId": 0,
      "groupId": this.groupId || 0,
      "serviceShortDesc": this.serviceForm.get("ServiceShortDesc").value,
      "serviceName": this.serviceForm.get("ServiceName").value,
      "price":  parseInt(this.serviceForm.get("Price").value),
      "isEditable": true,
      "creditedtoDoctor": true,
      "isPathology":  0,
      "isRadiology": 0,
      "printOrder": parseInt(this.serviceForm.get("PrintOrder").value),
      "isPackage": 0,
      "subGroupId": this.subGroupId || 0,
      "doctorId": 0,
      "isEmergency": true,
      "emgAmt": 0,
      "emgPer": 0,
      "isDocEditable": true,
      "serviceDetails": data1
    }
    console.log("insert mdata:", mdata);
    this._serviceMasterService.serviceMasterInsert(mdata).subscribe((response)=>{
      this.toastr.success(response.message);
      this.onClear(true);
    },(error)=>{
      this.toastr.error(error.message);
    })
    
  }else{
    //update
  }
this.dialogRef.close();
    
  }
  
  
  onEdit(row) {
    this.isEditMode = true;
    var m_data = {
    "ServiceId":row.ServiceId,
    "ServiceShortDesc":row.ServiceShortDesc.trim(),
    "ServiceName":row.ServiceName.trim(),
    "Price":row.Price,
    "IsEditable":JSON.stringify(row.IsEditable),
    "CreditedtoDoctor":JSON.stringify(row.CreditedtoDoctor),
    "IsPathology":JSON.stringify(row.IsPathology),
    "IsRadiology":JSON.stringify(row.IsRadiology),
    "IsActive":JSON.stringify(row.IsActive),
    "PrintOrder":row.PrintOrder,
    "IsPackage":JSON.stringify(row.IsPackage),
    "SubGroupId":row.SubGroupId,
    "DoctorId":row.DoctorId,
    "IsEmergency":JSON.stringify(row.IsEmergency),
    "EmgAmt":row.EmgAmt,
    "EmgPer":row.EmgPer,
    "IsDocEditable":JSON.stringify(row.IsDocEditable),
    "UpdatedBy":row.UpdatedBy,
    }
    this._serviceMasterService.populateForm(m_data);
  }

  onClear(val:boolean) {
    this.DSServicedetailList.data = this.DSServicedetailList.data.map(element => {
      return { ...element, ClassRate: 0 }; // Create a new object with updated ClassRate
  });
  this.DSServicedetailList._updateChangeSubscription(); // Manually trigger change detection for MatTableDataSource
  this.serviceForm.reset();
  this.serviceForm.get('IsEditable').setValue(true);
  this.serviceForm.get('IsActive').setValue(true);
  this.serviceForm.get('EffectiveDate').setValue(new Date());
  // this.serviceForm.get('TariffId').setValue(this.TariffcmbList[0].TariffId);



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
  onClose() {
    this.serviceForm.reset();
  
    this.dialogRef.close();
  }
  
  

  onChange(isChecked: boolean) {

    console.log(isChecked);

    if (isChecked==true)
   {
      this.butDisabled=true;
     console.log(this.butDisabled);
    } 
    else
     {
      this.butDisabled=false;
      console.log(this.butDisabled);
    }
    
  }

  // new api
  groupId=0;
  subGroupId=0;
  tariffId=0;

  selectChangegroupName(obj:any){
    this.groupId=obj.value;
  }
  selectChangesubGroupName(obj:any){
    this.subGroupId=obj.value;
  }
  selectChangetariff(obj: any){
    console.log(obj);
    this.tariffId=obj.value
  }

  getValidationGroupMessages(){
    return {
      GroupId: [
          { name: "required", Message: "Group Name is required" }
      ]
  };
  }
  getValidationSubGroupNameMessages(){
    return{
      SubGroupId: [
        { name: "required", Message: "SubGroup Name is required" }
      ]
    }
  }
  getValidationTariffMessages(){
    return{
      TariffId: [
        { name: "required", Message: "Tariff Name is required" }
      ]
    }
  }


}

 
