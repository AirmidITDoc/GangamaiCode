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
    filteredresultdr: Observable<string[]>;
    filteredpathdr: Observable<string[]>;
    filteredrefdr: Observable<string[]>;
    filteredresultdr3: Observable<string[]>;

    optionsDoc1: any[] = [];
    optionsDoc2: any[] = [];
    optionsDoc3: any[] = [];
    optionsDoc4: any[] = [];
    currentDate: Date = new Date();

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
    PathReportId: any;
    PathResultDr1: any;
    SexId: any;
    CheckAge: any;
    CheckAgemonth: any = 0
    CheckAgeday: any = 0

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
        public toastr: ToastrService,
        private _fuseSidebarService: FuseSidebarService) {

        if (this.data) {

            this.selectedAdvanceObj2 = data.patientdata;
            console.log(this.selectedAdvanceObj2)
            this.OPIPID = this.selectedAdvanceObj2.OPD_IPD_ID;
            this.OP_IPType = this.selectedAdvanceObj2.OPD_IPD_Type;
            this.SexId = this.selectedAdvanceObj2.GenderId;
            if (this.selectedAdvanceObj2.AgeYear)
                this.CheckAge = this.selectedAdvanceObj2.AgeYear.trim();
            if (this.selectedAdvanceObj2.AgeMonth)
                this.CheckAgemonth = this.selectedAdvanceObj2.AgeMonth.trim();
            if (this.selectedAdvanceObj2.AgeDay)
                this.CheckAgeday = this.selectedAdvanceObj2.AgeDay.trim();

            this.reportIdData = [];

            this.data.RIdData.forEach((element) => {
                this.reportIdData.push(element.PathReportId)
                this.ServiceIdData.push(element.ServiceId)
                if (element.IsCompleted == "true")
                    this.Iscompleted = 1;
            });

        }
        this.getPathresultdoctorList();


        if (this.Iscompleted == 1) {
            if (this.OP_IPType == 1)
                this.getResultListIP();
            else
                this.getResultListOP();

        } else {
            this.getResultList(this.selectedAdvanceObj2);
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

        this.filteredresultdr = this.otherForm.get('PathResultDoctorId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterdoc3(value)),
        );


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
    onResultUp(data) {
        
        let items = this.dataSource.data.filter(x => (x?.Formula ?? "").indexOf('{{' + data.ParameterShortName + '}}') > 0);
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
        if (data.ParaIsNumeric) {

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


    getResultList(advanceData) {
        this.sIsLoading = 'loading-data';

        let SelectQuery

        if (this.OP_IPType == 0) {
            if (this.selectedAdvanceObj2.AgeYear > 0)
                SelectQuery = "Select * from m_lvwRtrv_PathologyResultOPWithAge where opd_ipd_id=" + this.OPIPID + " and ServiceID in (" + this.ServiceIdData + ") and OPD_IPD_Type = " + this.OP_IPType + " AND IsCompleted = 0 and PathReportID in ( " + this.reportIdData + ") and SexId=" + this.SexId + " and MaxAge >= " + this.CheckAge + " and MinAge < " + this.CheckAge + " AND AgeType='YEAR' "
            else if (this.selectedAdvanceObj2.AgeMonth > 0)
                 SelectQuery = "Select * from m_lvwRtrv_PathologyResultOPWithAge where opd_ipd_id=" + this.OPIPID + " and ServiceID in (" + this.ServiceIdData + ") and OPD_IPD_Type = " + this.OP_IPType + " AND IsCompleted = 0 and PathReportID in ( " + this.reportIdData + ") and SexId=" + this.SexId + " and MaxAge >= " + this.CheckAgemonth + " and MinAge < " + this.CheckAgemonth +"AND AgeType='MONTH'"
            else if (this.selectedAdvanceObj2.AgeDay > 0)
                SelectQuery = "Select * from m_lvwRtrv_PathologyResultOPWithAge where opd_ipd_id=" + this.OPIPID + " and ServiceID in (" + this.ServiceIdData + ") and OPD_IPD_Type = " + this.OP_IPType + " AND IsCompleted = 0 and PathReportID in ( " + this.reportIdData + ") and SexId=" + this.SexId + " and MaxAge >= " + this.CheckAgeday + " and MinAge < " + this.CheckAgeday + " AND AgeType='DAY' "
        } else if (this.OP_IPType == 1) {
            if (this.selectedAdvanceObj2.AgeYear > 0)
                SelectQuery = "Select * from m_lvwRtrv_PathologyResultIPWithAge where opd_ipd_id=" + this.OPIPID + " and ServiceID in (" + this.ServiceIdData + ") and OPD_IPD_Type = " + this.OP_IPType + " AND IsCompleted = 0 and PathReportID in ( " + this.reportIdData + ") and SexId=" + this.SexId + " and MaxAge >= " + this.CheckAge + " and MinAge < " + this.CheckAge + " AND AgeType='YEAR' "
            else if (this.selectedAdvanceObj2.AgeMonth > 0)
                SelectQuery = "Select * from m_lvwRtrv_PathologyResultIPWithAge where opd_ipd_id=" + this.OPIPID + " and ServiceID in (" + this.ServiceIdData + ") and OPD_IPD_Type = " + this.OP_IPType + " AND IsCompleted = 0 and PathReportID in ( " + this.reportIdData + ") and SexId=" + this.SexId + " and MaxAge >= " + this.CheckAgemonth + " and MinAge < " + this.CheckAgemonth + "AND AgeType='MONTH'"
            else if (this.selectedAdvanceObj2.AgeDay > 0)
                SelectQuery = "Select * from m_lvwRtrv_PathologyResultIPWithAge where opd_ipd_id=" + this.OPIPID + " and ServiceID in (" + this.ServiceIdData + ") and OPD_IPD_Type = " + this.OP_IPType + " AND IsCompleted = 0 and PathReportID in ( " + this.reportIdData + ") and SexId=" + this.SexId + " and MaxAge >= " + this.CheckAgeday + " and MinAge < " + this.CheckAgeday + " AND AgeType='DAY' "
        }



        console.log(SelectQuery)
        this._SampleService.getPathologyResultList(SelectQuery).subscribe(Visit => {
            this.dataSource.data = Visit as Pthologyresult[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }




    getResultListIP() {
        this.sIsLoading = 'loading-data';
        let SelectQuery = "Select * from m_lvw_Retrieve_PathologyResultUpdate_IPAgeWise where PathReportId in(" + this.reportIdData + ")"
        console.log(SelectQuery);
        this._SampleService.getPathologyResultListforIP(SelectQuery).subscribe(Visit => {
            this.dataSource.data = Visit as Pthologyresult[];
            //  this.Pthologyresult = Visit as Pthologyresult[];
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

    getResultListOP() {
        this.sIsLoading = 'loading-data';
        let SelectQuery = "Select * from m_lvw_Retrieve_PathologyResultUpdate_OPAgeWise where PathReportId in(" + this.reportIdData + ")"
        console.log(SelectQuery)
        this._SampleService.getPathologyResultListforOP(SelectQuery).subscribe(Visit => {
            this.dataSource.data = Visit as Pthologyresult[];
            // this.Pthologyresult = Visit as Pthologyresult[];
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.sIsLoading = '';
            this.PathResultDr1 = this.dataSource.data[0]["PathResultDr1"];
            this.vsuggation = this.dataSource.data[0]["SuggestionNote"];
            console.log(this.PathResultDr1);
            this.getPathresultDoctorList();
        },
            error => {
                this.sIsLoading = '';
            });

    }


    onUpload(){
       
            if ((this.vPathResultDoctorId == '')) {
                this.toastr.warning('Please select valid Pathalogist', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
    
            this.isLoading = 'submit';
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
                pathologyInsertReportObj['PIsNumeric'] = element.PIsNumeric || 0;
                pathologyInsertReportObj['CategoryName'] = element.CategoryName || '';
                pathologyInsertReportObj['TestName'] = element.TestName || '';
                pathologyInsertReportObj['SubTestName'] = element.SubTestName || '';
                pathologyInsertReportObj['ParameterName'] = element.ParameterName || '';
                pathologyInsertReportObj['UnitName'] = element.UnitName || '';
                pathologyInsertReportObj['PatientName'] = this.selectedAdvanceObj2.PatientName || '';
                pathologyInsertReportObj['RegNo'] = this.selectedAdvanceObj2.RegNo;
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
                    pathologyUpdateReportObj['ReportTime'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy hh:mm"),
                    pathologyUpdateReportObj['IsCompleted'] = true;
                pathologyUpdateReportObj['IsPrinted'] = true;
                pathologyUpdateReportObj['PathResultDr1'] = this.otherForm.get('PathResultDoctorId').value.DoctorId || 0;
                pathologyUpdateReportObj['PathResultDr2'] = 0; //this.otherForm.get('DoctorId').value.DoctorId || 0;
                pathologyUpdateReportObj['PathResultDr3'] = 0;
                pathologyUpdateReportObj['IsTemplateTest'] = 0;
                pathologyUpdateReportObj['SuggestionNotes'] = this.otherForm.get('suggestionNotes').value || "";
                pathologyUpdateReportObj['AdmVisitDoctorID'] = 0; //this.otherForm.get('AdmDoctorID').value.DoctorID || 0;
                pathologyUpdateReportObj['RefDoctorID'] = this.otherForm.get('RefDoctorID').value.DoctorID || 0;
    
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
                    });
                } else {
                    Swal.fire('Error !', 'Pathology Resulentry data not saved', 'error');
                }
                this.isLoading = '';
            });
    
        }
    
    getOptionTextresultdr(option) {
        return option && option.Doctorname ? option.Doctorname : '';
    }
    getOptionTextpath(option) {
        return option && option.Doctorname ? option.Doctorname : '';
    }
    getOptionTextRefdr(option) {
        return option && option.Doctorname ? option.Doctorname : '';
    }

    nEnterresultdr
    Saveflag = 2;
    printf: boolean = true;

    onSave() {
        if ((this.vPathResultDoctorId == '')) {
            this.toastr.warning('Please select valid Pathalogist', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        this.isLoading = 'submit';
        let PathInsertArry = [];
        let pathologyUpdateReportObjarray = [];

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
            pathologyResult['pisNumeric'] = element.PIsNumeric || 0;
            pathologyResult['categoryName'] = element.CategoryName || '';
            pathologyResult['testName'] = element.TestName || '';
            pathologyResult['subTestName'] = element.SubTestName || '';
            pathologyResult['parameterName'] = element.ParameterName || '';
            pathologyResult['unitName'] = element.UnitName || '';
            pathologyResult['patientName'] = this.selectedAdvanceObj2.PatientName || '';
            pathologyResult['regNo'] = this.selectedAdvanceObj2.RegNo;
            pathologyResult['minValue'] = parseFloat(element.MinValue) || 0;
            pathologyResult['maxValue'] = parseFloat(element.MaxValue) || 0;
            pathologyResult['sampleId'] = element.SampleID || '';

            pathologyResult['paraBoldFlag'] = element.ParaBoldFlag || '';

            PathInsertArry.push(pathologyResult);
        });

        this.data.RIdData.forEach((element) => {
            let pathologyReport = {};

            pathologyReport['pathReportId'] = element.PathReportId// element1.PathReportId;
            pathologyReport['reportDate'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy"),
                pathologyReport['reportTime'] = this.datePipe.transform(this.currentDate, "MM-dd-yyyy hh:mm"),
                pathologyReport['isCompleted'] = true;
            pathologyReport['isPrinted'] = true;
            pathologyReport['pathResultDr1'] = this.otherForm.get('PathResultDoctorId').value.DoctorId || 0;
            pathologyReport['pathResultDr2'] = 0; //this.otherForm.get('DoctorId').value.DoctorId || 0;
            pathologyReport['pathResultDr3'] = 0;
            pathologyReport['isTemplateTest'] = 0;
            pathologyReport['suggestionNotes'] = this.otherForm.get('suggestionNotes').value || "";
            pathologyReport['admVisitDoctorId'] = 0; //this.otherForm.get('AdmDoctorID').value.DoctorID || 0;
            pathologyReport['refDoctorId'] = this.otherForm.get('RefDoctorID').value.DoctorID || 0;

            pathologyUpdateReportObjarray.push(pathologyReport);
        });

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

    getPathresultdoctorList() {
        this._SampleService.getPathologyDoctorCombo().subscribe(data => {
            this.PathologyDoctorList = data;
            this.optionsDoc3 = this.PathologyDoctorList.slice();
            this.filteredresultdr = this.otherForm.get('PathResultDoctorId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterdoc3(value) : this.PathologyDoctorList.slice()),
            );
        });
    }

    getPathresultDoctorList() {

        this._SampleService.getPathologyDoctorCombo().subscribe(data => {
            this.PathologyDoctorList = data;
            if (this.data) {

                const ddValue = this.PathologyDoctorList.filter(c => c.DoctorId == this.PathResultDr1);
                this.otherForm.get('PathResultDoctorId').setValue(ddValue[0]);
                this.otherForm.updateValueAndValidity();
                return;
            }
        });
    }
    private _filterdoc3(value: any): string[] {
        if (value) {
            const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
            return this.PathologyDoctorList.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
        }
    }

    // // getDoctorList() {
    // //     this._SampleService.getDoctorMaster1Combo().subscribe(data => {
    // //         this.DoctorList = data;
    // //         this.optionsDoc2 = this.DoctorList.slice();
    // //         this.filteredpathdr = this.otherForm.get('DoctorId').valueChanges.pipe(
    // //             startWith(''),
    // //             map(value => value ? this._filterdoc2(value) : this.DoctorList.slice()),
    // //         );
    // //     });
    // // }

    // private _filterdoc2(value: any): string[] {
    //     if (value) {
    //         const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
    //         return this.optionsDoc2.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    //     }
    // }

    // getRefDoctorList() {
    //     this._SampleService.getDoctorMaster1Combo().subscribe(data => {
    //         this.Doctor1List = data;
    //         this.optionsDoc1 = this.Doctor1List.slice();
    //         this.filteredrefdr = this.otherForm.get('RefDoctorID').valueChanges.pipe(
    //             startWith(''),
    //             map(value => value ? this._filterdoc1(value) : this.Doctor1List.slice()),
    //         );
    //     });
    // }

    // private _filterdoc1(value: any): string[] {
    //     if (value) {
    //         const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
    //         return this.optionsDoc1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    //     }
    // }




    viewgetPathologyTestReportPdf(contact) {

        setTimeout(() => {
            // this.SpinLoading = true;
            // this.AdList = true;
            this._SampleService.getPathTestReport(
                contact.OP_IP_Type
            ).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "pathology Test  Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {

                });
            });

        }, 100);
    }

    Printresultentry() {
        let pathologyDelete = [];
        this.data.RIdData.forEach((element) => {
            let pathologyDeleteObj = {};
            pathologyDeleteObj['pathReportId'] = element.PathReportId// element1.PathReportId;
            pathologyDelete.push(pathologyDeleteObj);
            let submitData = {
                "printInsert": pathologyDelete,
            };
            console.log(submitData);
            this._SampleService.PathPrintResultentryInsert(submitData).subscribe(response => {
                if (response) {
                    Swal.fire('Congratulations !', 'Pathology Report Print !!', 'success').then((result) => {
                        if (result.isConfirmed) {
                            this.viewgetPathologyTestReportPdf(this.OP_IPType)
                        }
                    });
                } else {
                    Swal.fire('Error !', 'Pathology Print not saved', 'error');
                }
            });
        });
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
    PIsNumeric: any;
    CategoryName: any;
    UnitName: any;
    MinValue: any;
    MaxValue: any;
    SampleID: any;

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

        this.PathReportId = Pthologyresult.PathReportId || '';
        this.CategoryId = Pthologyresult.CategoryId || '';
        this.TestId = Pthologyresult.TestId || '';
        this.SubTestId = Pthologyresult.SubTestId || '';
        this.UnitId = Pthologyresult.UnitId || '';
        this.PrintOrder = Pthologyresult.PrintOrder || '';
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
    PIsNumeric: boolean;
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