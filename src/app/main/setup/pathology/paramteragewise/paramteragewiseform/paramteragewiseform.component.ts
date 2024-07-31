import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ParamteragewiseService } from "../paramteragewise.service";
import { takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { ParamteragewiseComponent } from "../paramteragewise.component";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-paramteragewiseform",
    templateUrl: "./paramteragewiseform.component.html",
    styleUrls: ["./paramteragewiseform.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ParamteragewiseformComponent implements OnInit {
    ageType: string[] = ["Days", "Months", "Years"];


    displayedColumns: string[] = [
        "GenderName",
        "MinAge",
        "MaxAge",
        "AgeType",
        "MinValue",
        "Maxvalue",
    ];
    displayedColumns1: string[] = [
        "Value"
    ];

    submitted = false;
    isLoading = true;
    isHidden: boolean = true;
    UnitcmbList: any = [];
    Parametercmb: any = [];
    GendercmbList: any = [];
    AgeTypeList: any = [];
    chargeslist: any = [];
    Descriptivelist: any = [];
    vMinAge: any;
    vMaxAge: any;
    vMinValue: any;
    vMaxvalue: any;
    msg: any;

    selectedToAdd: any;
    groupsArray: any = [];
    selectedItems: any = [];
    isTxtUnique = true;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    dsParaDescriptiveList = new MatTableDataSource<PathDescriptiveMaster>();
    dsDecsripTempList = new MatTableDataSource<PathDescriptiveMaster>();
    dsParameterAgeList = new MatTableDataSource<PathParaRangeAgeMaster>();
    dsTempList = new MatTableDataSource<PathParaRangeAgeMaster>();

    constructor(
        public _ParameterageService: ParamteragewiseService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<ParamteragewiseComponent>,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
    ) { }
    registerObj:any;
    ngOnInit(): void {
        this.selectedItems = [];
        this.dsParameterAgeList.data=[];
       
        this.getUnitNameCombobox();
        this.getGenderNameCombobox();
        this.getAgeTypeList();
        this.getDscriptiveMasterList();
        if (this._ParameterageService.myform.get("ParameterID").value) {
       
            this.dsParameterAgeList.data =this._ParameterageService.numericList;
            this.selectedItems = this._ParameterageService.descriptiveList;
        }
        
    }

    get f() {
        return this._ParameterageService.myform.controls;
    }
    getGenderNameCombobox() {
        this._ParameterageService.getGenderMasterCombo().subscribe(data => {
            this.GendercmbList = data;
            console.log(this.GendercmbList);
        });
    }
    getAgeTypeList() {
        this._ParameterageService.getAgeTypeList().subscribe(data => {
            this.AgeTypeList = data;
            // console.log(this.AgeTypeList);
        });
    }
    getUnitNameCombobox() {

        this._ParameterageService.getUnitMasterCombo().subscribe((data) => {
            this.UnitcmbList = data;
           console.log(this.UnitcmbList)
            if (this.data) {
                const toSelectUnitId = this.UnitcmbList.find(c => c.UnitId == this.registerObj.UnitId);
                this._ParameterageService.myform.get('UnitId').setValue(toSelectUnitId);
               console.log(toSelectUnitId);  
              console.log(this.registerObj.UnitId); 
               } 
        });
    }

    getDscriptiveMasterList() {
        this._ParameterageService.getDescriptiveMasterList().subscribe((Menu) => {
            this.dsParameterAgeList.data = Menu as PathParaRangeAgeMaster[];
            this.dsParameterAgeList.sort = this.sort;
            this.dsParameterAgeList.paginator = this.paginator;
        });
    }
    // getNumericMasterList() {
    //     var vadata={
    //         "ParameterId": 1 //this._ParameterageService.myform.get('ParameterID').value || 1
    //     }
    //     console.log(vadata)
    //      this._ParameterageService.getNumericMasterList().subscribe((Menu) => {
    //         this.dsParameterAgeList.data = Menu as PathParaRangeAgeMaster[];
    //         this.chargeslist = Menu as PathParaRangeAgeMaster[];
    //         this.dsTempList.data = Menu as PathParaRangeAgeMaster[];
    //         console.log( this.dsParameterAgeList)
    //         this.dsParameterAgeList.sort = this.sort;
    //         this.dsParameterAgeList.paginator = this.paginator;
    //     });
    // }
    onAdd(event) {
        this.dsParameterAgeList.data = [];
        this.chargeslist = this.dsTempList.data;
        this.chargeslist.push(
            {
                GenderId: this._ParameterageService.myIsNumericform.get('SexID').value.GenderId || 0,
                GenderName: this._ParameterageService.myIsNumericform.get('SexID').value.GenderName || "",
                MinAge: this.vMinAge || 0,
                MaxAge: this.vMaxAge || 0,
                AgeType: this._ParameterageService.myIsNumericform.get('AgeType').value.AgeTypeName || "",
                MinValue: this.vMinValue || 0,
                Maxvalue: this.vMaxvalue || 0,

            });
        this.dsParameterAgeList.data = this.chargeslist
        console.log(this.chargeslist);
        this._ParameterageService.myIsNumericform.reset();
    }
    // getDscriptiveMasterList() {
    //     var vadata={
    //         "ParameterId": 25 //this._ParameterageService.myform.get('ParameterID').value || 25
    //     }
    //     console.log(vadata)
    //      this._ParameterageService.getDescriptiveMasterList().subscribe((Menu) => {
    //         this.dsParaDescriptiveList.data = Menu as PathDescriptiveMaster[];
    //         this.Descriptivelist = Menu as PathDescriptiveMaster[]; 
    //         this.dsDecsripTempList.data = Menu as PathDescriptiveMaster[];
    //         console.log( this.Descriptivelist)
    //         this.dsParaDescriptiveList.sort = this.sort;
    //         this.dsParaDescriptiveList.paginator = this.paginator;
    //     });
    // }
    onAddDescriptive(event) {
        this.dsParaDescriptiveList.data = [];
        this.Descriptivelist = this.dsDecsripTempList.data;
        this.Descriptivelist.push(
            {
                Value: this._ParameterageService.myIsDescriptiveform.get('Value').value || "",
            });
        this.dsParaDescriptiveList.data = this.Descriptivelist
        console.log(this.Descriptivelist);
        this._ParameterageService.myIsDescriptiveform.get('Value').setValue("");

    }

    
    AddData(txt) {
        if (txt.replace(/\s/g, '').length !== 0) {

            if (!this.selectedItems.includes(txt)) {
                this.selectedItems = this.selectedItems.concat(txt);
                this.selectedToAdd = [];
                
            }
            else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Duplicate Row',
                    text: 'You are adding a duplicate row.',
                    confirmButtonText: 'OK'
                });
            }
        }
    }
    onClear() {
        this._ParameterageService.myform.reset();
    }
    onClose() {
        this._ParameterageService.myform.reset();
        this.dialogRef.close();
    }

    public show: boolean = false; //numeric
    public show1: boolean = false; ///descriptive

    toggle(val: any) {
        if (val == 1) {
            this._ParameterageService.is_numeric = true;
            this.dsParameterAgeList.data = []
        } else {
            this._ParameterageService.is_numeric = false;
            this.selectedItems = []
        }
    }


    onSubmit1() {
        debugger;
        if (this._ParameterageService.myform.valid) {
            if (!this._ParameterageService.myform.get("ParameterID").value) {
              
               let insertParameterMasterRangeWise={};

insertParameterMasterRangeWise["paraId"]=0
insertParameterMasterRangeWise["sexId"]=0
insertParameterMasterRangeWise["minValue"]=0
insertParameterMasterRangeWise["maxvalue"]=0
insertParameterMasterRangeWise["addedby"]=0
                var m_data = {
                 
                    insertParameterMasterRangeWise: {
                        paraId:
                            "0" ||
                            this._ParameterageService.myform.get("ParameterID")
                                .value,
                        sexId: this._ParameterageService.myIsNumericform.get("SexID").value.GenderId,
                        minValue:
                            this._ParameterageService.myIsNumericform
                                .get("MinValue")
                                .value || "%",
                        maxvalue:
                            this._ParameterageService.myIsNumericform
                                .get("MaxValue")
                                .value || "%",
                     addedby:  this.accountService.currentUserValue.user.id ,
                    },
                    
                };

                this._ParameterageService
                    .insertParameterMasterAgeWise(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                        } else {
                            this.toastr.error('Parameter-Form Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                    }, error => {
                        this.toastr.error('Parameter-Form not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            } else {
              
                var m_dataUpdate = {
                   
                    insertParameterMasterRangeWise: {
                         paraId: this._ParameterageService.myform.get("ParameterID")
                            .value,
                        sexId:  this._ParameterageService.myform.get("SexIdD").value.GenderId,
                        minValue:
                            this._ParameterageService.myform
                                .get("MinValue")
                                .value.trim() || "%",
                        maxvalue:
                            this._ParameterageService.myform
                                .get("MaxValue")
                                .value.trim() || "%",
                        isDeleted: 0, // Boolean(JSON.parse(this._ParameterageService.myform.get("IsDeleted").value)),
                        addedby:  this.accountService.currentUserValue.user.id ,
                    },
                   
                };

                this._ParameterageService
                    .updateParameterMasterAgeWise(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                        } else {
                            this.toastr.error('Parameter-Form Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                    }, error => {
                        this.toastr.error('Parameter-Form not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            }
            this.onClear();
        }
    }
    // onSubmit() {
    //     if(!this._ParameterageService.myform.get("PathparaRangeId").value){
    //     let insertParameterMasterAgeWiseObj = [];
    //     this.dsParameterAgeList.data.forEach((element) => {
    //         let insertParameterMasterAgeWise = {};
    //         insertParameterMasterAgeWise['paraId'] = 0;
    //         insertParameterMasterAgeWise['sexId'] = element.GenderName;//this._ParameterageService.myIsNumericform.get('SexID').value.GenderName;
    //         insertParameterMasterAgeWise['minValue'] = element.MinValue;//this._ParameterageService.myIsNumericform.get("MinValue").value;
    //         insertParameterMasterAgeWise['maxvalue'] = element.Maxvalue;//this._ParameterageService.myIsNumericform.get("Maxvalue").value;
    //         insertParameterMasterAgeWise['addedby'] = this.accountService.currentUserValue.user.id;
    //         insertParameterMasterAgeWiseObj.push(insertParameterMasterAgeWise);
    //     });
    //     let submitData = {
    //         "insertParameterMasterAgeWise": insertParameterMasterAgeWiseObj,
    //     };

    //     console.log(submitData);

    //     this._ParameterageService.insertParameterMasterAgeWise(submitData).subscribe(response => {
    //         if (response) {
    //             this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                 toastClass: 'tostr-tost custom-toast-success',
    //             });

    //             this.onClear()

    //         } else {
    //             this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
    //                 toastClass: 'tostr-tost custom-toast-error',
    //             });
    //         }
    //     }, error => {
    //         this.toastr.error('New Test Master Data not saved !, Please check API error..', 'Error !', {
    //             toastClass: 'tostr-tost custom-toast-error',
    //         });
    //     });
    // }
    // else{
    //     let updateParameterMasterAgeWiseObj = [];
    //     this.dsParameterAgeList.data.forEach((element) => {
    //         let updateParameterMasterAgeWise = {};
    //         updateParameterMasterAgeWise['paraId'] = 0;
    //         updateParameterMasterAgeWise['sexId'] = element.GenderName;//this._ParameterageService.myIsNumericform.get('SexID').value.GenderName;
    //         updateParameterMasterAgeWise['minValue'] = element.MinValue;//this._ParameterageService.myIsNumericform.get("MinValue").value;
    //         updateParameterMasterAgeWise['maxvalue'] = element.Maxvalue;//this._ParameterageService.myIsNumericform.get("Maxvalue").value;
    //         updateParameterMasterAgeWise['addedby'] = this.accountService.currentUserValue.user.id;
    //         updateParameterMasterAgeWiseObj.push(updateParameterMasterAgeWise);
    //     });
    //     let submitData = {
    //         "updateParameterMasterAgeWise": updateParameterMasterAgeWiseObj,
    //     };

    //     console.log(submitData);

    //     this._ParameterageService.updateParameterMasterAgeWise(submitData).subscribe(response => {
    //         if (response) {
    //             this.toastr.success('Record Updated Successfully.', 'Updated !', {
    //                 toastClass: 'tostr-tost custom-toast-success',
    //             });

    //             this.onClear()

    //         } else {
    //             this.toastr.error('New Test Master Data not  Updated !, Please check API error..', 'Error !', {
    //                 toastClass: 'tostr-tost custom-toast-error',
    //             });
    //         }
    //     }, error => {
    //         this.toastr.error('New Test Master Data not Updated !, Please check API error..', 'Error !', {
    //             toastClass: 'tostr-tost custom-toast-error',
    //         });
    //     });
    // }
    // }

    // onSubmits() {
    //     if (this._ParameterageService.myform.valid) {
    //         if (!this._ParameterageService.myform.get("PathparaRangeId").value
    //         ) {
    //             var m_data = {
    //                 insertParameterMasterAgeWise: {
    //                     paraId: 0,//this._ParameterageService.myform.get("ParaId").value,
    //                     sexId: this._ParameterageService.myIsNumericform.get("SexID")
    //                         .value.GenderId,
    //                     minValue: this._ParameterageService.myIsNumericform.get("MinValue").value,
    //                     maxValue: this._ParameterageService.myIsNumericform.get("Maxvalue").value,
    //                     addedBy: this.accountService.currentUserValue.user.id,
    //                 },
    //             };
    //             console.log(m_data);
    //             this._ParameterageService.insertParameterMasterAgeWise(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                         });
    //                     } else {
    //                         this.toastr.error('Parameter-Age-Wise-Form Master Data not saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                         });
    //                     }
    //                 }, error => {
    //                     this.toastr.error('Parameter-Age-Wise-Form not saved !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                     });
    //                 });
    //         } else {
    //             var m_dataUpdate = {
    //                 updateParameterMasterAgeWise: {
    //                     pathparaRangeId:
    //                         this._ParameterageService.myform.get(
    //                             "PathparaRangeId"
    //                         ).value,
    //                     paraId: this._ParameterageService.myform.get("ParaId")
    //                         .value,
    //                     sexId: this._ParameterageService.myform.get("SexId")
    //                         .value,

    //                     minValue: this._ParameterageService.myform
    //                         .get("MinValue")
    //                         .value.trim(),
    //                     maxValue: this._ParameterageService.myform
    //                         .get("MaxValue")
    //                         .value.trim(),
    //                     updatedby: 1,

    //                 },
    //             };
    //             console.log(m_dataUpdate);
    //             this._ParameterageService
    //                 .updateParameterMasterAgeWise(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                         });
    //                     } else {
    //                         this.toastr.error('Parameter-Age-Wise-Form Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                         });
    //                     }
    //                 }, error => {
    //                     this.toastr.error('Parameter-Age-Wise-Form not updated !, Please check API error..', 'Error !', {
    //                         toastClass: 'tostr-tost custom-toast-error',
    //                     });
    //                 });
    //         }
    //         this.onClear();
    //     }
    // }


    // onSubmit() {
    //     if (this._ParameterageService.myform.valid) {
    //         if (
    //             !this._ParameterageService.myform.get("PathparaRangeId").value
    //         ) {  
    //             var m_data = {
    //                 insertParameterMasterAgeWise: {

    //                     paraId: 0,//this._ParameterageService.myform.get("ParaId").value,
    //                     sexId: this._ParameterageService.myIsNumericform.get("SexID")
    //                         .value.GenderId,
    //                     minValue: this._ParameterageService.myIsNumericform
    //                         .get("MinValue").value,
    //                     maxValue: this._ParameterageService.myIsNumericform
    //                         .get("Maxvalue").value,
    //                     addedBy: 1,

    //                 },
    //             };
    //             console.log(m_data);
    //             this._ParameterageService
    //                 .insertParameterMasterAgeWise(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                     } else {
    //                         this.toastr.error('Parameter-Age-Wise-Form Master Data not saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                 },error => {
    //                     this.toastr.error('Parameter-Age-Wise-Form not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  });
    //         } else {
    //             var m_dataUpdate = {
    //                 updateParameterMasterAgeWise: {
    //                     pathparaRangeId:
    //                         this._ParameterageService.myform.get(
    //                             "PathparaRangeId"
    //                         ).value,
    //                     paraId: this._ParameterageService.myform.get("ParaId")
    //                         .value,
    //                     sexId: this._ParameterageService.myform.get("SexId")
    //                         .value,

    //                     minValue: this._ParameterageService.myform
    //                         .get("MinValue")
    //                         .value.trim(),
    //                     maxValue: this._ParameterageService.myform
    //                         .get("MaxValue")
    //                         .value.trim(),
    //                     updatedby: 1,
    //                     minAge:
    //                         this._ParameterageService.myform.get("MinAge")
    //                             .value || "0",
    //                     maxAge:
    //                         this._ParameterageService.myform.get("MaxAge")
    //                             .value || "0",
    //                     ageType: this._ParameterageService.myform
    //                         .get("AgeType")
    //                         .value.trim(), 
    //                 },
    //             };
    //             console.log(m_dataUpdate);
    //             this._ParameterageService
    //                 .updateParameterMasterAgeWise(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                     } else {
    //                         this.toastr.error('Parameter-Age-Wise-Form Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                 },error => {
    //                     this.toastr.error('Parameter-Age-Wise-Form not updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  });
    //         }
    //         this.onClear();
    //     }
    // }
    // onEdit(row) {
    //     var m_data = {
    //         PathparaRangeId: row.PathparaRangeId,
    //         ParaId: row.ParaId,
    //         SexId: row.SexId,
    //         MinAge: row.MinAge,
    //         MaxAge: row.MaxAge,
    //         AgeType: row.IsNumeric,
    //         MinValue: row.MinValue.trim(),
    //         MaxValue: row.MaxValue.trim(),
    //         IsDeleted: JSON.stringify(row.IsDeleted),
    //         UpdatedBy: row.UpdatedBy,
    //     };
    // }

    // parameter filter
    // private filterParametername() {
    //     if (!this.Parametercmb) {
    //         return;
    //     }
    //     // get the search keyword
    //     let search = this.parameternameFilterCtrl.value;
    //     if (!search) {
    //         this.filteredParametername.next(this.Parametercmb.slice());
    //         return;
    //     } else {
    //         search = search.toLowerCase();
    //     }
    //     // filter the banks
    //     this.filteredParametername.next(
    //         this.Parametercmb.filter(
    //             (bank) => bank.ParameterName.toLowerCase().indexOf(search) > -1
    //         )
    //     );
    // } 

    // getParameterNameCombobox() {
    //     this._ParameterageService
    //         .getParameterMasterCombo()
    //         .subscribe((data) => {
    //             this.Parametercmb = data;
    //             this.filteredParametername.next(this.Parametercmb.slice());
    //         });
    // }


    onSubmit() {    
        const invalid = [];
        const controls = this._ParameterageService.myform.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        console.log(invalid);

        if (this._ParameterageService.myform.valid) {                                       
            var numeric_info = [];
            var data2 = [];
            if (!this._ParameterageService.is_numeric) {
                
                for (var val of this.selectedItems) {
                    var data = {
                        parameterID: +this._ParameterageService.myIsDescriptiveform.get("ParaId").value || 0,
                        parameterValues: val,
                        isDefaultValue: this._ParameterageService.myIsDescriptiveform.get("DefaultValue").value?true:false,
                        addedby: this.accountService.currentUserValue.user.id,
                        defaultValue:this._ParameterageService.myIsDescriptiveform.get("DefaultValue").value ? this._ParameterageService.myIsDescriptiveform.get("DefaultValue").value.trim() : "%",
                    };
                    data2.push(data);
                }
            }
            else{
                var info: any = {
                    paraId: 0 || +this._ParameterageService.myform.get("ParameterID").value,
                    sexId: 0,
                    minValue: "%",
                    MaxValue: "%",
                    addedby: this.accountService.currentUserValue.user.id ||1,
                    ageType: "%",
                    minAge: 0,
                    maxAge: 0
                };
                this.dsParameterAgeList.data.forEach(element => {
                    let c = JSON.parse(JSON.stringify(info));
                    c['sexId'] = element.GenderName == 'Male' ? 0 : element.GenderName == 'Female' ? 1 : 2;
                    c['minValue'] = element.MinValue;
                    c['minAge'] = +element.MinAge;
                    c['maxAge'] = +element.MaxAge;
                    c['maxvalue'] = element.Maxvalue;
                    c['ageType'] = element.AgeType;
                    numeric_info.push(c)
                });
            }   


            var PathParameterMasterInsert = {
                parameterShortName: this._ParameterageService.myform.get("ParameterShortName").value.trim() || "%",
                parameterName: this._ParameterageService.myform.get("ParameterName").value.trim() || "%",
                printParameterName: this._ParameterageService.myform.get("PrintParameterName").value.trim() || "%",
                methodName: this._ParameterageService.myform.get("MethodName").value || "%",
                unitId: this._ParameterageService.myform.get("UnitId").value.UnitId || 0,
                isNumeric: this._ParameterageService.is_numeric,
                isDeleted: Boolean(JSON.parse(this._ParameterageService.myform.get("IsDeleted").value)),
                parameterID: this._ParameterageService.myform.get("ParameterID").value || 0,
                isPrintDisSummary: Boolean(JSON.parse(this._ParameterageService.myform.get("IsPrintDisSummary").value))
            }           
            
            var m_data ={}

            if(this._ParameterageService.is_numeric){
                m_data['parameterRangeWithAgeMasterInsert']= numeric_info;
                m_data['parameterRangeWithAgeMasterDelete']= {parameterId: this._ParameterageService.myform.get("ParameterID").value || 0,};
            }else{
                m_data['parameterDescriptiveMasterInsert']= data2;   
                m_data['descriptiveParameterMasterDelete']= {parameterId: this._ParameterageService.myform.get("ParameterID").value || 0,}                           
            }   
            
            if (!this._ParameterageService.myform.get("ParameterID").value) {
                PathParameterMasterInsert['addedby'] = this.accountService.currentUserValue.user.id || 1;
               m_data['pathParameterMasterInsert'] = PathParameterMasterInsert;
               console.log(m_data);
                
            this._ParameterageService
            .insertParameterMasterAgeWise(m_data)
            .subscribe((data) => {
                this.msg = data;
                if (data) {                       
                    this._ParameterageService.myform.reset();
                    this._ParameterageService.myform.get("IsDeleted").setValue(true);
                    this.selectedItems = [];
                    this.dsParameterAgeList.data = [];

                    this.toastr.success('Record Saved Successfully.', 'Saved !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                } else {
                    this.toastr.error('Parameter-Form Master Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }, error => {
                this.toastr.error('Parameter-Form not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            });    
            }else{
                PathParameterMasterInsert['updatedby'] = this.accountService.currentUserValue.user.id || 1;
                m_data['pathParameterMasterUpdate'] = PathParameterMasterInsert;

                
            this._ParameterageService
            .updateParameterMasterAgeWise(m_data)
            .subscribe((data) => {
                this.msg = data;
                if (data) {                       
                    this._ParameterageService.myform.reset();
                    this._ParameterageService.myform.get("IsDeleted").setValue(true);
      

                    this.toastr.success('Record updated Successfully.', 'Updated !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });   
                } else {
                    this.toastr.error('Parameter-Form Master Data not saved !, Please check API error..', 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }, error => {
                this.toastr.error('Parameter-Form not saved !, Please check API error..', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            });              

            }
            
            this.onClear();
        }
    
    this.onClose()
    }

    
   

    checkFields(event){
        debugger
        const formValues = this._ParameterageService.myIsNumericform.value
        const fieldsTobeChecked = formValues.SexID
        && formValues.MinAge
        && formValues.MaxAge
        && formValues.AgeType
        && formValues.MinValue
        && formValues.MaxValue;
        if(!fieldsTobeChecked){
             event.preventDefault;
             this.toastr.warning('Please fill in all the fields in this row to add', 'Warning');
         }
         else this.onAdd(event);
      
  
     }

    @ViewChild('minage') minage: ElementRef;
    @ViewChild('maxage') maxage: ElementRef;
  // @ViewChild('purpose') purpose: ElementRef;
  
    ageyearcheck(event) {

        if (parseInt(event) < 0) {
          this.toastr.warning('Please Enter Valid Minium Age ', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
    
          this.minage.nativeElement.focus();
        }
        return;
       
      }

      ageyear1check(event) {

        if (parseInt(event) > 110) {
          this.toastr.warning('Please Enter Valid Maximum Age.', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
    
          this.maxage.nativeElement.focus();
        }
        return;
       
      }

      public onEnteragey(event, value): void {
        if (event.which === 13) {
          this.maxage.nativeElement.focus();
    
          this.ageyearcheck(value);
        }
      }
      public onEnteragem(event,value): void {
        if (event.which === 13) {
            this.ageyear1check(value);
         // this.maxage.nativeElement.focus();
        }
      }
      public onEntermin(event, value): void {
        if (event.which === 13) {
          this.maxage.nativeElement.focus();
    
        }
      }
      public onEntermax(event): void {
        if (event.which === 13) {
          this.maxage.nativeElement.focus();
        }
      }

}
export class PathParaRangeAgeMaster {
    PathparaRangeId: any;
    ParaId: any;
    GenderName: any;
    MinValue: any;
    Maxvalue: any;
    MinAge: any;
    MaxAge: any;
    AgeType: any;
    /**
     * Constructor
     *
     * @param PathParaRangeAgeMaster
     */
    constructor(PathParaRangeAgeMaster) {
        {
            this.PathparaRangeId = PathParaRangeAgeMaster.PathparaRangeId || 0;
            this.ParaId = PathParaRangeAgeMaster.ParaId || 0;
            this.GenderName = PathParaRangeAgeMaster.GenderName || "";
            this.AgeType = PathParaRangeAgeMaster.AgeType || "";
            this.MinValue = PathParaRangeAgeMaster.MinValue || 0;
            this.Maxvalue = PathParaRangeAgeMaster.Maxvalue || 0;
            this.MinAge = PathParaRangeAgeMaster.MinAge || 0;
            this.MaxAge = PathParaRangeAgeMaster.MaxAge || 0;
        }
    }
}
export class PathDescriptiveMaster {
    DescriptiveID: number;
    ParameterId: number;
    ParameterValues: String;
    IsDefaultValue: boolean;
    AddedBy: number;
    UpdatedBy: number;
    DefaultValue: String;
    /**
     * Constructor
     *
     * @param PathDescriptiveMaster
     */
    constructor(PathDescriptiveMaster) {
        {
            this.DescriptiveID = PathDescriptiveMaster.DescriptiveID || "";
            this.ParameterId = PathDescriptiveMaster.ParameterId || "";
            this.ParameterValues = PathDescriptiveMaster.ParameterValues || "";
            this.IsDefaultValue = PathDescriptiveMaster.IsDefaultValue || "";
            this.AddedBy = PathDescriptiveMaster.AddedBy || "";
            this.UpdatedBy = PathDescriptiveMaster.UpdatedBy || "";
            this.DefaultValue = PathDescriptiveMaster.DefaultValue || "";
        }
    }
}

