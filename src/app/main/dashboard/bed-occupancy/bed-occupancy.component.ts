import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { DashboardService } from '../dashboard.service';
import Chart, { Color } from 'chart.js/auto';

@Component({
    selector: 'app-bed-occupancy',
    templateUrl: './bed-occupancy.component.html',
    styleUrls: ['./bed-occupancy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BedOccupancyComponent implements OnInit {
    @ViewChild(MatSort) sort: MatSort;

    public displayedColumns = ['RegNo', 'PatientName', 'DoctorName', 'IsAvailible', 'BedName'];
    warDataArr: WardDetails[] = [];
    warItemArr: WardItemDetails[] = [];
    prevSelectedWard: WardDetails;
    public isTableLoading = false;
    public selectedRoom!: string;
    public dataSource = new MatTableDataSource<WardItemDetails>();
    public selectedMonth: string = 'Month';
    public months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public admissionSeries: any[] = [
        {
            name: 'Admissions',
            series: [
                { name: '01', value: 28 },
                { name: '02', value: 22 },
                { name: '03', value: 35 },
                { name: '04', value: 40 },
                { name: '05', value: 62 },
                { name: '06', value: 54 },
                { name: '07', value: 40 },
                { name: '08', value: 30 },
                { name: '09', value: 44 },
                { name: '10', value: 38 },
                { name: '11', value: 49 },
                { name: '12', value: 45 },
                { name: '13', value: 50 },
                { name: '14', value: 92 }
            ]
        }
    ];

    // charts
    public smallChart1: any;
    public smallChart2: any;
    public smallChart3: any;
    public smallChart4: any;
    public occupancyTrendChart: any;
    public distributionChart: any;
    public overallDoughnutChart: any;
    public admissionsLineLarge: any;
    public departmentImages: string[] = [
        'assets/images/default.jpg',
        'assets/images/logos/1.png',
        'assets/images/logos/2.png',
        'assets/images/logos/3.png'
    ];

    // selectedRoom = 'Oncology room 1';
    rooms = ['Oncology room 1', 'Oncology room 2', 'ICU', 'General Ward'];
  
    beds = [
      { id: 1, status: 'In Use', patient: 'Michael Scott', admissionDate: '09/12/2019', age: 67, sex: 'Male', icon: 'hotel' },
      { id: 2, status: 'Reserved', patient: 'Steve Smith', admissionDate: '01/20/2020', age: 43, sex: 'Male', icon: 'person_pin' },
      { id: 3, status: 'In Use', patient: 'James Smith', admissionDate: '12/27/2019', age: 73, sex: 'Male', icon: 'hotel' },
      { id: 4, status: 'In Use', patient: 'Cindy Love', admissionDate: '12/12/2019', age: 36, sex: 'Female', icon: 'hotel' },
      { id: 5, status: 'In Use', patient: 'James Johnson', admissionDate: '11/12/2019', age: 56, sex: 'Male', icon: 'hotel' },
      { id: 6, status: 'In Use', patient: 'Maria Garcia', admissionDate: '01/12/2020', age: 49, sex: 'Female', icon: 'hotel' },
      { id: 7, status: 'Empty', patient: '', admissionDate: '', age: '', sex: '', icon: 'person_add' },
      { id: 8, status: 'In Use', patient: 'Robert Scott', admissionDate: '01/01/2020', age: 60, sex: 'Male', icon: 'hotel' },
    ];
    constructor(
        public _dashboardServices: DashboardService
    ) { }

    ngOnInit(): void {
        this.getWard();
        // initialize charts using same helpers as Daily Dashboard
        setTimeout(() => {
            if (document.getElementById('BedMiniChart1')) {
                this.smallChart1 = this.getLineChartData('BedMiniChart1', '#d4bbf4', '#c5aae6');
            }
            if (document.getElementById('BedMiniChart2')) {
                this.smallChart2 = this.getLineChartData('BedMiniChart2', '#f3ddb3', '#ebcf9a');
            }
            if (document.getElementById('BedMiniChart3')) {
                this.smallChart3 = this.getLineChartData('BedMiniChart3', '#d1efad', '#c5e999');
            }
            if (document.getElementById('BedMiniChart4')) {
                this.smallChart4 = this.getLineChartData('BedMiniChart4', '#c5f1ef', '#a1e6e3');
            }
            if (document.getElementById('BedSurveyChart')) {
                this.occupancyTrendChart = this.getSurveyChart();
            }
            if (document.getElementById('BedDoughnutChart')) {
                this.distributionChart = this.getDoughnutChart();
            }
            if (document.getElementById('BedOverallDoughnut')) {
                this.overallDoughnutChart = this.getOverallDoughnutChart();
            }
            if (document.getElementById('BedAdmissionsLine')) {
                this.admissionsLineLarge = this.getLargeAdmissionsChart();
            }
        });
    }

    getWard() {
        this._dashboardServices.getWard({}).subscribe(data => {
            this.warDataArr = data as WardDetails[];
            this.warDataArr.forEach(element => {
                element['isSelected'] = false;
            });
            this.warDataArr[0].isSelected = true;
            this.prevSelectedWard = this.warDataArr[0];
            this.selectedRoom = this.prevSelectedWard.RoomName;
            console.log(this.warDataArr);
            this.getWardDetails(this.prevSelectedWard.RoomId);
        });
    }

    get totalOccupied(): number {
        return this.warDataArr.reduce((acc, w) => acc + (Number(w.OccuipedCount) || 0), 0);
    }

    get totalAvailable(): number {
        return this.warDataArr.reduce((acc, w) => acc + (Number(w.AvailableCount) || 0), 0);
    }

    get totalBeds(): number {
        return this.totalAvailable + this.totalOccupied;
    }

    get occupancyPercent(): number {
        if (!this.totalBeds) { return 0; }
        return Math.round((this.totalOccupied / this.totalBeds) * 100);
    }

    get dept1() {
        return this.getDeptData(0);
    }

    get dept2() {
        return this.getDeptData(1);
    }

    get dept3() {
        return this.getDeptData(2);
    }

    get dept4() {
        return this.getDeptData(3);
    }

    private getDeptData(index: number) {
        const w = this.warDataArr[index];
        if (!w) return { name: 'Department ' + (index + 1), image: this.departmentImages[index], total: 0, inUse: 0, reserved: 0, empty: 0, percent: 0 };
        
        const total = (Number(w.AvailableCount) || 0) + (Number(w.OccuipedCount) || 0);
        const inUse = Number(w.OccuipedCount) || 0;
        const available = Number(w.AvailableCount) || 0;
        const reserved = Math.max(Math.round(total * 0.07), 0);
        const percent = total ? Math.round((inUse / total) * 100) : 0;
        return {
            name: w.RoomName,
            image: this.departmentImages[index % this.departmentImages.length],
            total,
            inUse,
            reserved,
            empty: Math.max(total - inUse - reserved, 0),
            percent
        };
    }

    // reverted: department cards helper removed

    // chart helpers (mirroring Daily Dashboard style)
    getLineChartData(charId: string, backgroundColor: Color, borderColor: Color) {
        return new Chart(charId, {
            type: 'line',
            data: {
                labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
                datasets: [
                    {
                        label: 'Count',
                        data: [22, 30, 28, 34, 40, 38, 44],
                        backgroundColor: backgroundColor,
                        borderColor: borderColor
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                elements: { point: { radius: 0 } }
            }
        });
    }

    getSurveyChart() {
        const canvas = document.getElementById('BedSurveyChart') as HTMLCanvasElement;
        const ctx = canvas?.getContext('2d');
        const gradient1 = ctx?.createLinearGradient(0, 0, 0, 400);
        gradient1?.addColorStop(0, 'rgba(10,10,10,.2)');
        gradient1?.addColorStop(1, 'rgba(255,255,255,1)');
        const gradient2 = ctx?.createLinearGradient(0, 0, 0, 400);
        gradient2?.addColorStop(0, 'rgb(183 115 208 / 20%)');
        gradient2?.addColorStop(1, 'rgba(255,255,255,1)');
        return new Chart('BedSurveyChart', {
            type: 'line',
            data: {
                labels: ['Mon','Tue','Wed','Thu','Fri','Sat'],
                datasets: [
                    { label: 'Admissions', data: [26, 34, 28, 22, 30, 42], backgroundColor: gradient1 as any, borderColor: 'rgba(10,10,10,.2)' },
                    { label: 'Discharges', data: [20, 24, 18, 25, 22, 30], backgroundColor: gradient2 as any, borderColor: 'rgb(156 76 186 / 20%)' }
                ]
            }
        });
    }

    getDoughnutChart() {
        return new Chart('BedDoughnutChart', {
            type: 'doughnut',
            data: {
                datasets: [
                    {
                        backgroundColor: ['#FF3784','#36A2EB','#4BC0C0','#F77825','#9966FF'],
                        data: [this.totalOccupied, this.totalAvailable, 8, 3, 1]
                    }
                ]
            },
            options: {
                plugins: { tooltip: { enabled: true } }
            }
        });
    }

    getOverallDoughnutChart() {
        return new Chart('BedOverallDoughnut', {
            type: 'doughnut',
            data: {
                labels: ['In use', 'Reserved', 'Empty', 'Clean up', 'Other'],
                datasets: [
                    {
                        backgroundColor: ['#ff5a8a','#f6c542','#3ecf8e','#5ac8fa','#a283f6'],
                        data: [Math.max(this.totalOccupied, 1), 4, Math.max(this.totalAvailable, 1), 2, 1]
                    }
                ]
            },
            options: { plugins: { tooltip: { enabled: true } } }
        });
    }

    getLargeAdmissionsChart() {
        return new Chart('BedAdmissionsLine', {
            type: 'line',
            data: {
                labels: ['01 Mon','02 Tue','03 Wed','04 Thu','05 Fri','06 Sat','07 Sun','08 Mon','09 Tue','10 Wed','11 Thu','12 Fri','13 Sat','14 Sun'],
                datasets: [
                    {
                        label: 'Admissions',
                        data: [30,26,35,42,60,45,40,41,22,28,40,36,30,90],
                        backgroundColor: 'rgba(255,99,132,0.15)',
                        borderColor: '#ff5a8a',
                        pointBackgroundColor: '#ff5a8a',
                        pointRadius: 3,
                        tension: 0.35,
                        fill: true
                    }
                ]
            },
            options: { maintainAspectRatio: false }
        });
    }

    onSelectWard(element: WardDetails) {
        this.prevSelectedWard.isSelected = false;
        this.prevSelectedWard = element;
        element.isSelected = true;
        this.getWardDetails(element.RoomId);
        console.log(element)
        this.selectedRoom = element.RoomName;
    }

    getWardDetails(item: any) {
        this.isTableLoading = true;
        let reqParam = {
            WardId: item
        }
        this._dashboardServices.getWardDetails(reqParam).subscribe(data => {
            console.log(data);
            this.warItemArr = data as WardItemDetails[];
            this.isTableLoading = false;
            this.dataSource.data = data as WardItemDetails[];
            this.dataSource.sort = this.sort;
        });
    }

}
export class WardDetails {
    AvailableCount: number;
    LocationName: string;
    OccuipedCount: number;
    RoomId: number;
    RoomName: string;
    isSelected: boolean = false;

    constructor(wardData) {
        this.AvailableCount = wardData.AvailableCount || 0;
        this.LocationName = wardData.LocationName || '';
        this.OccuipedCount = wardData.OccuipedCount || 0;
        this.RoomId = wardData.RoomId || 0;
        this.RoomName = wardData.RoomName || '';
        this.isSelected = wardData.isSelected || false;
    }
}

export class WardItemDetails {
    AvailableCnt: number;
    BedName: string;
    DocNameID: number;
    DoctorName: string;
    FirstName: string;
    IsAvailible: boolean;
    OccuipiedCnt: number;
    PatientName: string;
    RegNo: string;
    RoomId: number;
    RoomName: string;
    WardId: number;

    constructor(wardData) {
        this.AvailableCnt = wardData.AvailableCnt || 0;
        this.BedName = wardData.BedName || '';
        this.DocNameID = wardData.DocNameID || 0;
        this.DoctorName = wardData.DoctorName || '';
        this.FirstName = wardData.FirstName || '';
        this.IsAvailible = wardData.IsAvailible || false;
        this.OccuipiedCnt = wardData.OccuipiedCnt || 0;
        this.PatientName = wardData.PatientName || '';
        this.RegNo = wardData.RegNo || '';
        this.RoomId = wardData.RoomId || 0;
        this.RoomName = wardData.RoomName || '';
        this.WardId = wardData.WardId || 0;
    }
}