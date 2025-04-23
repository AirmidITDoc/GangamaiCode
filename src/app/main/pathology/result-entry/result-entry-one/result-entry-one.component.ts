import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SampleDetailObj } from '../result-entry.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { ResultEntryService } from '../result-entry.service';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ConfigService } from 'app/core/services/config.service';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { debug } from 'console';
import { MatDrawer } from '@angular/material/sidenav';
import { MatAccordion } from '@angular/material/expansion';
import {MatMenuTrigger } from '@angular/material/menu';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
    selector: 'app-result-entry-one',
    templateUrl: './result-entry-one.component.html',
    styleUrls: ['./result-entry-one.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ResultEntryOneComponent implements OnInit {

    displayedColumns: string[] = [
        'TestName',
        // 'SubTestName',
        'ParameterName',
        'ResultValue',
        'Flag',
        'NormalRange',
        'Formula'
    ];

    isLoading: string = '';
    Pthologyresult: any = [];
    PathologyDoctorList: any = [];
    DoctorList: any = [];
    Doctor1List: any = [];
    otherForm: FormGroup;
    msg: any;

    selectedAdvanceObj1: SampleDetailObj;
    selectedAdvanceObj2: AdmissionPersonlModel;
    screenFromString = 'opd-casepaper';
    hasSelectedContacts: boolean;
    advanceData: any;
    dataSource = new MatTableDataSource<Pthologyresult>();
    resultdataSource = new MatTableDataSource<Pthologyresult>();

    configDoc: any;
    sIsLoading: string = '';
  
    currentDate: Date = new Date();
    autocompleteModeDoctor: string = "ConDoctor";

    isresultdrSelected: boolean = false;

    vPathResultDoctorId: any = 0;
    vDoctorId: any = 0;
    vRefDoctorID: any = 0;
    vsuggation: any = '';
    reportIdData: any = [];
    ServiceIdData: any = [];
    OPIPID: any = 0;
    OP_IPType: any;
    Iscompleted: any;
    vPathReportId: any;
    PathResultDr1: any;
    SexId: any;
    CheckAge: any;
    CheckAgemonth: any = 0
    CheckAgeday: any = 0
    regObj:any;

    // MaxAge:any;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @ViewChild('drawer') public drawer: MatDrawer;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(private formBuilder: UntypedFormBuilder,
        public _SampleService: ResultEntryService,
        public datePipe: DatePipe,
        private dialogRef: MatDialogRef<ResultEntryOneComponent>,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private advanceDataStored: AdvanceDataStored,
        private configService: ConfigService,
          private commonService: PrintserviceService,
        public toastr: ToastrService,
        private _fuseSidebarService: FuseSidebarService) {

        if (this.data) {
            // debugger
            this.selectedAdvanceObj2 = data.patientdata;
            console.log(this.selectedAdvanceObj2)
            this.OPIPID = this.selectedAdvanceObj2.opdipdid // this.selectedAdvanceObj2.OPD_IPD_ID;
            this.OP_IPType = this.selectedAdvanceObj2.opdipdtype;
            this.SexId = this.selectedAdvanceObj2.genderId;
            if (this.selectedAdvanceObj2.ageYear)
                this.CheckAge = this.selectedAdvanceObj2.ageYear.trim();
            if (this.selectedAdvanceObj2.ageMonth)
                this.CheckAgemonth = this.selectedAdvanceObj2.ageMonth.trim();
            if (this.selectedAdvanceObj2.ageDay)
                this.CheckAgeday = this.selectedAdvanceObj2.ageDay.trim();

            this.reportIdData = [];
            this.regObj=data.RIdData
                this.vPathReportId=this.regObj[0].PathReportId

                this.data.RIdData.forEach((element) => {
                this.reportIdData.push(element.PathReportId)
                this.ServiceIdData.push(element.ServiceId)
                if (element.IsCompleted == "true")
                    this.Iscompleted = 1;
                else
                    this.Iscompleted=0
            });

        }
        // this.getPathresultdoctorList();


        if (this.Iscompleted == 0) {
            if (this.OP_IPType == 1)
                this.getResultListIP(this.selectedAdvanceObj2,this.regObj);
            else
                this.getResultListOP(this.selectedAdvanceObj2,this.regObj);

        } else {
            this.getResultList1(this.regObj);
        }

    }

    ngOnInit(): void {
        this.otherForm = this.formBuilder.group({
            suggestionNotes: '',
            PathResultDoctorId: [0],
            DoctorId: [0],
            AdmDoctorID: [0],
            RefDoctorID: [0],
        });

        // setTimeout(function () {
        //     let element: HTMLElement = document.getElementById('auto_trigger') as HTMLElement;
        //     element.click();
        // }, 1000);

    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    setDropdownObjs() {

        this.vsuggation = this.dataSource.data[0].SuggestionNote;

        const toSelect = this.PathologyDoctorList.find(c => c.DoctorId == this.dataSource.data[0].PathResultDr1);
        this.otherForm.get('DoctorId').setValue(toSelect);
        this.otherForm.updateValueAndValidity();
    }

    getShortNames(formula: string): string[] {
        let Keys: string[] = [];
        const allKeys = formula.split('{{');
        allKeys.forEach((key: string) => {
            if (key.indexOf('}}') > -1) {
                const val = (key.split('}}'))[0];
                Keys = Keys.concat(val);
            }
        });
        return Keys;
    }

    // onResultUp(data) {
    //     debugger
        // let items = this.dataSource.data.filter(x => (x?.Formula ?? "").indexOf('{{' + data.ParameterShortName + '}}') > 0);
    //     let items = this.dataSource.data.filter(x => String(x?.Formula ?? "").indexOf('{{' + data.ParameterShortName + '}}') > 0);
    
    //     for (let i = 0; i < items.length; i++) {
    //         let formula = items[i].Formula;
    //         let formulas = this.getShortNames(formula);
    
    //         formulas.forEach(e => {
    //             let itm = this.dataSource.data.find(x => x.ParameterShortName?.toLowerCase().trim() === e.toLowerCase().trim());
    
    //             let valueToReplace = itm?.ResultValue !== undefined && itm?.ResultValue !== null ? itm.ResultValue : "0";
    
    //             formula = formula.replaceAll("{{" + e.trim() + "}}", valueToReplace);
    
    //             console.log("Matching for:", e.trim());
    //             console.log("Matched item:", itm);
    //             console.log("Replacing {{ " + e.trim() + " }} with:", valueToReplace);
    //         });
    
    //         if (formula.includes('{{')) {
    //             console.error("Formula still has unresolved placeholders:", formula);
    //             items[i].ResultValue = "";
    //         } else {
    //             try {
    //                 items[i].ResultValue = isNaN(eval(formula)) ? "" : eval(formula);
    
    //                 if (!isNaN(items[i].ResultValue)) {
    //                     items[i].ResultValue = Math.round(items[i].ResultValue * 100) / 100;
    //                 }
    //             } catch (error) {
    //                 console.error('Error evaluating formula:', formula, error);
    //                 items[i].ResultValue = "";
    //             }
    //         }
    //     }
    
    //     // Set flag for bold if the value is out of range
    //     data.ParaBoldFlag = '';
    //     if (data.PIsNumeric) {
    //         let a = parseFloat(data.ResultValue);
    //         let b = parseFloat(data.MinValue);
    //         let c = parseFloat(data.MaxValue);
    
    //         if (b != null && c != null && a != null) {
    //             if (a < b || a > c) {
    //                 data.ParaBoldFlag = 'B'; // Set bold flag if value is out of range
    //             }
    //         }
    //     }
    // }    
    
    // isValidFormula(formula: string): boolean {
    //     // Basic regex to allow only numbers, operators, and parentheses
    //     const validFormulaPattern = /^[0-9+\-*/().\s]+$/;
    //     return validFormulaPattern.test(formula.trim());
    // }
    
    onResultUp(data) {
        debugger
        let items = this.dataSource.data.filter(x => String(x?.Formula ?? "").indexOf('{{' + data.ParameterShortName + '}}') > 0);
        for (let i = 0; i < items.length; i++) {
            let formula = items[i].Formula;
            let formulas = this.getShortNames(formula);
            formulas.forEach(e => {
                let itm = this.dataSource.data.find(x => x.ParameterShortName == e);
                if (itm)
                    formula = formula.replace("{{" + e + "}}", itm.ResultValue)
            });
            items[i].ResultValue = isNaN(eval(formula)) ? "" : eval(formula);
            if (!isNaN(items[i].ResultValue))
                items[i].ResultValue = Math.round(items[i].ResultValue * 100) / 100;
        }

        data.ParaBoldFlag = '';
        if (data.ParaIsNumeric || data.PIsNumeric) {

            let a = parseFloat(data.ResultValue);
            let b = parseFloat(data.MinValue);
            let c = parseFloat(data.MaxValue);

            if (b != null && c != null && a != null) {
                if (a < b || a > c) {
                    data.ParaBoldFlag = 'B';
                }
            }
        }
    }

    boldstatus = 0;

    editflag(contact) {
        contact.ParaBoldFlag = contact.ParaBoldFlag
    }

    currentval = "";
    currentvaltemp = "";
    ParameterId = "";

    AddData1(contact, val) {

        console.warn(val);
        if (this.currentval != "")
            this.currentval = this.currentval + ' , ' + val;
        else
            this.currentval = this.currentval + '  ' + val;
        contact.ResultValue = this.currentval
    }

    helpItems: any[] = [];
    helpFullItems: any[] = [];
    selectedParam: any;
    onKeydown(e, data) {

        if (this.selectedParam != data.ParameterId)
            this.currentval = ""
        this.selectedParam = data.ParameterId;
        let SelectQuery = "SELECT ParameterValues, IsDefaultValue, ParameterId FROM dbo.M_ParameterDescriptiveMaster WHERE ParameterId = " + data.ParameterId;
        this._SampleService.getPathologyResultList(SelectQuery).subscribe(Visit => {
            this.helpItems = Visit as any[];
            this.helpFullItems = Visit as any[];
            data["IsHelpShown"] = true;
            setTimeout(() => {
                document.getElementById("helpText_" + data.ParameterId).focus();
            }, 100);
        },
            error => {
                this.sIsLoading = '';
            });

    }
    onSelectHelp(e, data) {
        this.dataSource.data.find(x => x.ParameterId == this.selectedParam).ResultValue = e;
        data["IsHelpShown"] = false;

        this.AddData1(data, data.ResultValue)
    }
    filterHelp(e) {
        this.helpItems = this.helpFullItems.filter(option => option.ParameterValues.toLowerCase().indexOf(e.target.value) >= 0);
    }

    getResultList1(rbj) {
        // debugger
        if (this.OP_IPType == 0) {
            var param =  {
                "searchFields": [          
                  {          
                    "fieldName": "PathReportId",   
                    "fieldValue": String(rbj[0].PathReportId), //"150452",  
                    "opType": "Equals"          
                  }          
                ],          
                "mode": "PathologyResultEntryOPCompleted"          
              }
        }
        else if(this.OP_IPType == 1){
            var param =  {
                "searchFields": [          
                  {          
                    "fieldName": "PathReportId",          
                    "fieldValue": String(rbj[0].PathReportId),         
                    "opType": "Equals"          
                  }          
                ],          
                "mode": "PathologyResultEntryIPCompleted"          
              }
        }
       
        console.log(param)
        this._SampleService.getPathologyResultListforOP(param).subscribe(Visit => {
            this.dataSource.data = Visit as Pthologyresult[];
            console.log(this.dataSource.data)
            // this.Pthologyresult = Visit as Pthologyresult[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.sIsLoading = '';
            this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].PathResultDr1)
            this.vPathResultDoctorId=this.dataSource.data[0].PathResultDr1
            this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
            this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
            console.log(this.PathResultDr1);
            // this.getPathresultDoctorList();
        },
            error => {
                this.sIsLoading = '';
            });

    }

    getResultListIP(obj,rbj) {
        debugger
        var SelectQuery=
        {        
          "searchFields": [        
            {
              "fieldName": "OPIPId",        
              "fieldValue": String(obj.opdipdid),        
              "opType": "Equals"
            },
            {        
              "fieldName": "ServiceId ",        
              "fieldValue": String(rbj[0].ServiceId),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "OPIPType",        
              "fieldValue": String(obj.opdipdtype),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "PathReportId",        
              "fieldValue": String(rbj[0].PathReportId),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "SexId",        
              "fieldValue": String(obj.genderId),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "MaxAge",        
              "fieldValue": String(obj.ageYear),        
              "opType": "Equals"        
            }        
          ],        
          "mode": "PathologyResultEntryIP"        
        }
         
        console.log(SelectQuery);
        this._SampleService.getPathologyResultListforIP(SelectQuery).subscribe(Visit => {
            this.dataSource.data = Visit as Pthologyresult[];
            //  this.Pthologyresult = Visit as Pthologyresult[];
            console.log(this.dataSource.data)
            this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)
            this.vPathResultDoctorId=this.dataSource.data[0].adm_Visit_docId
            this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
            this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }

    getResultListOP(obj,rbj) {
        const serviceIds = rbj.map(r => String(r.ServiceId));
        const pathReportIds = rbj.map(r => String(r.PathReportId));
        
        debugger
        var SelectQuery=
        {        
          "searchFields": [        
            {
              "fieldName": "OPIPId",        
              "fieldValue": String(obj.opdipdid),        
              "opType": "Equals"
            },
            {        
              "fieldName": "ServiceId ",        
              "fieldValue": String(rbj[0].ServiceId),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "OPIPType",        
              "fieldValue": String(obj.opdipdtype),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "PathReportId",        
              "fieldValue": String(rbj[0].PathReportId),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "SexId",        
              "fieldValue": String(obj.genderId),        
              "opType": "Equals"        
            },        
            {        
              "fieldName": "MaxAge",        
              "fieldValue": String(obj.ageYear),        
              "opType": "Equals"        
            }        
          ],        
          "mode": "PathologyResultEntryOP"        
        }
        console.log(SelectQuery)
        this._SampleService.getPathologyResultListforOP(SelectQuery).subscribe(Visit => {
            this.dataSource.data = Visit as Pthologyresult[];
            console.log(this.dataSource.data)
            // this.Pthologyresult = Visit as Pthologyresult[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.sIsLoading = '';
            // this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].PathResultDr1)
            this.otherForm.get('PathResultDoctorId').setValue(this.dataSource.data[0].adm_Visit_docId)

            this.vPathResultDoctorId=this.dataSource.data[0].adm_Visit_docId
            this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
            this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
            console.log(this.PathResultDr1);
            // this.getPathresultDoctorList();
        },
            error => {
                this.sIsLoading = '';
            });

    }

    selectChangeDoctor(row){
        this.vPathResultDoctorId=row.value;
    }
    onReload(){
        this.getResultList1(this.regObj);
    }

    onUpload(){
    //    debugger
            if ((this.vPathResultDoctorId == '')) {
                this.toastr.warning('Please select valid Pathalogist', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
    
            let PathInsertArry = [];
            // let pathologyDeleteObjarray = [];
            let pathologyUpdateReportObjarray = [];
    
            // this.data.RIdData.forEach((element) => {
            //     let pathologyDeleteObj = {};
            //     pathologyDeleteObj['pathReportID'] = element.PathReportId// element1.PathReportId;
            //     pathologyDeleteObjarray.push(pathologyDeleteObj);
            // });
    
            this.dataSource.data.forEach((element) => {
    
                let pathologyInsertReportObj = {};
                pathologyInsertReportObj['PathReportId'] = element.PathReportId //element1.PathReportId;
                pathologyInsertReportObj['CategoryID'] = element.CategoryId || 0;
                pathologyInsertReportObj['TestID'] = element.TestId || 0;
                pathologyInsertReportObj['SubTestId'] = element.SubTestId || 0;
                pathologyInsertReportObj['ParameterId'] = element.ParameterId || 0;
                pathologyInsertReportObj['ResultValue'] = element.ResultValue || ' ';
                pathologyInsertReportObj['UnitId'] = element.UnitId || 1;
                pathologyInsertReportObj['NormalRange'] = element.NormalRange || '';
                pathologyInsertReportObj['PrintOrder'] = element.PrintOrder || 0;
                pathologyInsertReportObj['PIsNumeric'] = element.ParaIsNumeric || element.PIsNumeric || 0;
                pathologyInsertReportObj['CategoryName'] = element.CategoryName || '';
                pathologyInsertReportObj['TestName'] = element.TestName || '';
                pathologyInsertReportObj['SubTestName'] = element.SubTestName || '';
                pathologyInsertReportObj['ParameterName'] = element.ParameterName || '';
                pathologyInsertReportObj['UnitName'] = element.UnitName || '';
                pathologyInsertReportObj['PatientName'] = this.selectedAdvanceObj2.PatientName || '';
                pathologyInsertReportObj['RegNo'] = this.selectedAdvanceObj2.regNo;
                pathologyInsertReportObj['MinValue'] = parseFloat(element.MinValue) || 0;
                pathologyInsertReportObj['MaxValue'] = parseFloat(element.MaxValue) || 0;
                pathologyInsertReportObj['SampleID'] = element.SampleID || '';
    
                pathologyInsertReportObj['ParaBoldFlag'] = element.ParaBoldFlag || '';
    
                PathInsertArry.push(pathologyInsertReportObj);
            });
    
            this.data.RIdData.forEach((element) => {
                let pathologyUpdateReportObj = {};
    
                pathologyUpdateReportObj['PathReportID'] = element.PathReportId// element1.PathReportId;
                pathologyUpdateReportObj['ReportDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
                // pathologyUpdateReportObj['ReportTime'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy hh:mm"),
                pathologyUpdateReportObj['ReportTime'] = this.datePipe.transform(this.currentDate, "HH:mm");
                pathologyUpdateReportObj['IsCompleted'] = true;
                pathologyUpdateReportObj['IsPrinted'] = true;
                pathologyUpdateReportObj['PathResultDr1'] = this.otherForm.get('PathResultDoctorId').value || 0;
                pathologyUpdateReportObj['PathResultDr2'] = 0; //this.otherForm.get('DoctorId').value.DoctorId || 0;
                pathologyUpdateReportObj['PathResultDr3'] = 0;
                pathologyUpdateReportObj['IsTemplateTest'] = 0;
                pathologyUpdateReportObj['SuggestionNotes'] = this.otherForm.get('suggestionNotes').value || "";
                pathologyUpdateReportObj['AdmVisitDoctorID'] = 0; //this.otherForm.get('AdmDoctorID').value.DoctorID || 0;
                pathologyUpdateReportObj['RefDoctorID'] = this.otherForm.get('RefDoctorID').value || 0;
    
                pathologyUpdateReportObjarray.push(pathologyUpdateReportObj);
            });
    
            console.log('==============================  PathologyResult ===========');
            let submitData = {
                // "deletepathreportheader": pathologyDeleteObjarray,
                "insertpathreportdetail": PathInsertArry,
                "updatepathreportheader": pathologyUpdateReportObjarray
            };
            console.log(submitData);
            this._SampleService.PathResultentryInsert(submitData).subscribe(response => {
                if (response) {
                    Swal.fire('Congratulations !', 'Data saved Successfully !', 'success').then((result) => {
                        this._matDialog.closeAll();
                        this.Printresultentry();
                    });
                } else {
                    Swal.fire('Error !', 'Pathology Resulentry data not saved', 'error');
                }
                this.isLoading = '';
            });
    
        }

    // Printresultentry() {
    //     debugger;
    //         const param = {
    //             searchFields: [
    //                 {
    //                     fieldName: "OP_IP_Type",
    //                     fieldValue: String(this.selectedAdvanceObj2.opdipdtype),
    //                     opType: "Equals"
    //                 }
    //             ],
    //             mode: "PathologyReport"
    //         };
    
    //         console.log(param);
    
    //         this._SampleService.getReportView(param).subscribe(res => {
    //             const matDialog = this._matDialog.open(PdfviewerComponent, {
    //                 maxWidth: "85vw",
    //                 height: '750px',
    //                 width: '100%',
    //                 data: {
    //                     base64: res["base64"] as string,
    //                     title: "Pathology Test Report Viewer"
    //                 }
    //             });
    
    //             matDialog.afterClosed().subscribe(result => {
                    
    //             });
    //         });        
    // }

    Printresultentry() {
        debugger
        let pathologyDelete = [];
    
        this.data.RIdData.forEach((element) => {
            pathologyDelete.push({ pathReportId: element.pathReportId });
        });
    
        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };
    
        console.log(submitData);
    
        this._SampleService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                debugger
                this.viewgetPathologyTestReportPdf()
            }
        });
    }

    viewgetPathologyTestReportPdf() {
        debugger;
            const param = {
                searchFields: [
                    {
                        fieldName: "OP_IP_Type",
                        fieldValue: String(this.selectedAdvanceObj2.opdipdtype),
                        opType: "Equals"
                    }
                ],
                mode: "PathologyReport"
            };
    
            console.log(param);
    
            this._SampleService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent, {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Pathology Test Report Viewer"
                    }
                });
    
                matDialog.afterClosed().subscribe(result => {
                    
                });
            });        
    }

    nEnterresultdr
    Saveflag = 2;
    printf: boolean = true;

    onSave() {
        debugger
        if ((this.vPathResultDoctorId == '')) {
            this.toastr.warning('Please select valid Pathalogist', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        let PathInsertArry = [];

        this.dataSource.data.forEach((element) => {

            let pathologyResult = {};
            pathologyResult['pathReportDetId'] = 0 //element1.PathReportId;
            pathologyResult['pathReportId'] = element.PathReportId //element1.PathReportId;
            pathologyResult['categoryId'] = element.CategoryId || 0;
            pathologyResult['testId'] = element.TestId || 0;
            pathologyResult['subTestId'] = element.SubTestId || 0;
            pathologyResult['parameterId'] = element.ParameterId || 0;
            pathologyResult['resultValue'] = element.ResultValue || ' ';
            pathologyResult['unitId'] = element.UnitId || 1;
            pathologyResult['normalRange'] = element.NormalRange || '';
            pathologyResult['printOrder'] = element.PrintOrder || 0;
            pathologyResult['pisNumeric'] = element.ParaIsNumeric || element.PIsNumeric || 0;
            pathologyResult['categoryName'] = element.CategoryName || '';
            pathologyResult['testName'] = element.TestName || '';
            pathologyResult['subTestName'] = element.SubTestName || '';
            pathologyResult['parameterName'] = element.ParameterName || '';
            pathologyResult['unitName'] = element.UnitName || '';
            pathologyResult['patientName'] = this.selectedAdvanceObj2.PatientName || '';
            pathologyResult['regNo'] = this.selectedAdvanceObj2.regNo;
            pathologyResult['sampleId'] = element.SampleID || '';
            pathologyResult['paraBoldFlag'] = element.ParaBoldFlag || '';
            pathologyResult['minValue'] = parseFloat(element.MinValue) || 0;
            pathologyResult['maxValue'] = parseFloat(element.MaxValue) || 0;

            PathInsertArry.push(pathologyResult);
        });

        let pathologyUpdateReportObjarray = 
        {        
            "pathReportId": this.vPathReportId,        
            "reportDate": this.datePipe.transform(this.currentDate, "yyyy-MM-dd"),        
            "reportTime":  this.datePipe.transform(this.currentDate, "HH:mm"),       
            "isCompleted": true,        
            "isPrinted": true,        
            "pathResultDr1": this.vPathResultDoctorId,        
            "pathResultDr2": 0,        
            "pathResultDr3": 0,        
            "isTemplateTest": 0,        
            "suggestionNotes": this.otherForm.get('suggestionNotes').value || "",        
            "admVisitDoctorId": 0,        
            "refDoctorId": 0        
          }

        console.log('==============================  PathologyResult ===========');
        let submitData = {
            "pathologyResult": PathInsertArry,
            "pathologyReport": pathologyUpdateReportObjarray
        };
        console.log(submitData);
        this._SampleService.PathResultentryInsert(submitData).subscribe(response => {
            if (response) {
                Swal.fire('Congratulations !', 'Data saved Successfully !', 'success').then((result) => {
                    this._matDialog.closeAll();
                    this.Printresultentry();
                });
            } else {
                Swal.fire('Error !', 'Pathology Resulentry data not saved', 'error');
            }
            this.isLoading = '';
        });

    }

    @ViewChild('PathResultDoctorId') PathResultDoctorId: ElementRef;
    @ViewChild('DoctorId') DoctorId: ElementRef;
    @ViewChild('RefDoctorID') RefDoctorID: ElementRef;
    @ViewChild('helpinput') helpinput: ElementRef;

    public onEnterSugg(event): void {
        if (event.which === 13) {
            this.PathResultDoctorId.nativeElement.focus();
        }
    }

    public onEnterPathResultDoctorId(event, value): void {

        if (event.which === 13) {
            console.log(value)
            if (value == undefined) {
                this.toastr.warning('Please Enter Valid Pathology Doctor .', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.DoctorId.nativeElement.focus();
            }
        }
    }

    onClear() {
        this.otherForm.reset();
    }

    onClose() {
        this.dialogRef.close();
    }
}

export class Pthologyresult {
    TestName: String;
    SubTestName: boolean;
    ParameterName: Date;
    NormalRange: any;
    Formula: any;
    ParameterShortName: any;
    ResultValue: any;
    ParameterId: any;
    ParaBoldFlag: any;
    SuggestionNote: any;
    PathResultDr1: any;
    PathReportId: any;
    CategoryId: any;
    TestId: any;
    SubTestId: any;
    UnitId: any;
    PrintOrder: any;
    ParaIsNumeric: any;
    PIsNumeric:any;
    CategoryName: any;
    UnitName: any;
    MinValue: any;
    MaxValue: any;
    SampleID: any;
    adm_Visit_docId:any;

    constructor(Pthologyresult) {
        this.TestName = Pthologyresult.TestName || '';
        this.SubTestName = Pthologyresult.SubTestName || '';
        this.ParameterName = Pthologyresult.ParameterName || '';
        this.NormalRange = Pthologyresult.NormalRange || '';
        this.Formula = Pthologyresult.Formula || '';
        this.ParameterShortName = Pthologyresult.ParameterShortName || '';
        this.ResultValue = Pthologyresult.ResultValue || '';
        this.ParameterId = Pthologyresult.ParameterId || '';
        this.ParaBoldFlag = Pthologyresult.ParaBoldFlag || '';
        this.SuggestionNote = Pthologyresult.SuggestionNote || '';
        this.PathResultDr1 = Pthologyresult.PathResultDr1 || 0;
        this.adm_Visit_docId=Pthologyresult.adm_Visit_docId || 0;
        this.PathReportId = Pthologyresult.PathReportId || '';
        this.CategoryId = Pthologyresult.CategoryId || '';
        this.TestId = Pthologyresult.TestId || '';
        this.SubTestId = Pthologyresult.SubTestId || '';
        this.UnitId = Pthologyresult.UnitId || '';
        this.PrintOrder = Pthologyresult.PrintOrder || '';
        this.ParaIsNumeric = Pthologyresult.ParaIsNumeric || '';
        this.PIsNumeric = Pthologyresult.PIsNumeric || '';
        this.CategoryName = Pthologyresult.CategoryName || '';
        this.UnitName = Pthologyresult.UnitName || '';
        this.MinValue = Pthologyresult.MinValue || '';
        this.MaxValue = Pthologyresult.MaxValue || 0;
        this.SampleID = Pthologyresult.SampleID || 0;
    }

}


export class PthologyTemplateresult {

    TemplateDesc: String;
    PrintTestName: String;
    PathReportID: any;
    TestId: any;
    PathResultDr1: any;

    constructor(PthologyTemplateresult) {
        this.TemplateDesc = PthologyTemplateresult.TemplateDesc || '';
        this.PrintTestName = PthologyTemplateresult.PrintTestName || '';
        this.PathReportID = PthologyTemplateresult.PathReportID || '';
        this.TestId = PthologyTemplateresult.TestId || 0;
        this.PathResultDr1 = PthologyTemplateresult.PathResultDr1 || '';
    }
}


export class PthologyresultInsert {
    PathReportId: number;
    CategoryID: number;
    TestID: any;
    SubTestId: any;
    ParameterId: any;
    ResultValue: any;
    UnitId: any;
    NormalRange: any;
    PrintOrder: any;
    ParaIsNumeric: boolean;
    PIsNumeric:any;
    CategoryName: any;
    TestName: any;
    SubTestName: any;
    ParameterName: any;
    UnitName: String;
    PatientName: any;
    RegNo: any;
    SampleID: any;

    constructor(pathologyInsertReportObj) {
        this.PathReportId = pathologyInsertReportObj.PathReportId || 0;
        this.CategoryID = pathologyInsertReportObj.CategoryID || 0;
        this.TestID = pathologyInsertReportObj.TestID || 0;
        this.SubTestId = pathologyInsertReportObj.SubTestId || 0;
        this.ParameterId = pathologyInsertReportObj.ParameterId || 0;
        this.ResultValue = pathologyInsertReportObj.ResultValue || '0';
        this.UnitId = pathologyInsertReportObj.UnitId || '0';
        this.NormalRange = pathologyInsertReportObj.NormalRange || '';
        this.PrintOrder = pathologyInsertReportObj.PrintOrder || '0';
        this.ParaIsNumeric = pathologyInsertReportObj.ParaIsNumeric || 0;
        this.PIsNumeric = pathologyInsertReportObj.PIsNumeric || 0;
        this.CategoryName = pathologyInsertReportObj.CategoryName || '';
        this.TestName = pathologyInsertReportObj.TestName || '';
        this.SubTestName = pathologyInsertReportObj.SubTestName || '';
        this.ParameterName = pathologyInsertReportObj.ParameterName || '';
        this.UnitName = pathologyInsertReportObj.UnitName || '';
        this.PatientName = pathologyInsertReportObj.PatientName || '';
        this.RegNo = pathologyInsertReportObj.RegNo || '0';
        this.SampleID = pathologyInsertReportObj.SampleID || 0;

    }

}

export class PthologyresulDelt {
    pathReportID: number;
    constructor(pathologyDeleteObj) {
        this.pathReportID = pathologyDeleteObj.pathReportID || 0;
    }
}


export class PthologyresulUp {
    PathReportID: number;
    ReportDate: any;
    ReportTime: any;
    IsCompleted: boolean;
    IsPrinted: boolean;
    PathResultDr1: any;
    PathResultDr2: any;
    PathResultDr3: any;
    IsTemplateTest: any;
    SuggestionNotes: any;
    AdmVisitDoctorID: any;
    RefDoctorID: any;

    constructor(pathologyUpdateReportObj) {
        this.PathReportID = pathologyUpdateReportObj.PathReportID || 0;
        this.RefDoctorID = pathologyUpdateReportObj.RefDoctorID || 0;
        this.ReportDate = pathologyUpdateReportObj.ReportDate || '';
        this.ReportTime = pathologyUpdateReportObj.ReportTime || '';
        this.IsCompleted = pathologyUpdateReportObj.IsCompleted || 0;
        this.IsPrinted = pathologyUpdateReportObj.IsPrinted || 0;
        this.PathResultDr1 = pathologyUpdateReportObj.PathResultDr1 || 0;
        this.PathResultDr2 = pathologyUpdateReportObj.PathResultDr2 || 0;
        this.PathResultDr3 = pathologyUpdateReportObj.PathResultDr3 || 0;
        this.IsTemplateTest = pathologyUpdateReportObj.IsTemplateTest || 0;
        this.SuggestionNotes = pathologyUpdateReportObj.SuggestionNotes || '';
        this.AdmVisitDoctorID = pathologyUpdateReportObj.AdmVisitDoctorID || 0;
        this.RefDoctorID = pathologyUpdateReportObj.RefDoctorID || 0;
    }
}


// select * from T_PathologyReportHeader order by 1 desc
// select * from T_PathologyReportDetails order by 1 desc

// select * from T_PathologyReportHeader where OPD_IPD_ID=184539
// select * from T_PathologyReportDetails where PathReportId=204118
// select * from T_PathologyReportDetails where PathReportId=204119