import { Component, HostListener, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import Chart, { Color } from 'chart.js/auto';
import { DashboardService } from '../dashboard.service';
import { BedDetailsDialogComponent } from './bed-details-dialog/bed-details-dialog.component';

@Component({
    selector: 'app-bed-occupancy',
    templateUrl: './bed-occupancy.component.html',
    styleUrls: ['./bed-occupancy.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BedOccupancyComponent implements OnInit, OnDestroy {
    @ViewChild(MatSort) sort: MatSort;

    public displayedColumns = ['RegNo', 'PatientName', 'DoctorName', 'IsAvailible', 'BedName'];
    warDataArr: WardDetails[] = [];
    warItemArr: WardItemDetails[] = [];
    dashBedStatistics: any;
    prevSelectedWard: WardDetails;
    public isTableLoading = false;
    public selectedRoom!: string;
    public dataSource = new MatTableDataSource<WardItemDetails>();
    public selectedMonth: string = 'Month';
    public months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    public selectedDepartment: number = 0; // Track selected department index
    public filteredBeds: any[] = []; // Filtered beds based on selected department
    public isBedsLoading: boolean = false; // Loading state for bed data
    public departments: any[] = []; // Department data from API
    public isDepartmentsLoading: boolean = false; // Loading state for department data

    // Slider properties
    public currentSlideIndex: number = 0;
    public slideWidth: number = 296; // Width of each slide (280px card + 16px gap)
    public slidesPerView: number = 4; // Number of slides visible at once
    public maxSlideIndex: number = 0;
    public sliderDots: any[] = [];
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
    public dischargeLineLarge: any;
    public departmentImages: string[] = [
        'assets/images/default.jpg',
        'assets/images/logos/1.png',
        'assets/images/logos/2.png',
        'assets/images/logos/3.png'
    ];

    // selectedRoom = 'Oncology room 1';
    rooms = ['Oncology room 1', 'Oncology room 2', 'ICU', 'General Ward'];

    beds = [
        { id: 1, status: 'In Use', patient: 'Michael Scott', admissionDate: '09/12/2019', age: 67, sex: 'Male', icon: 'hotel', department: 0 },
        { id: 2, status: 'Reserved', patient: 'Steve Smith', admissionDate: '01/20/2020', age: 43, sex: 'Male', icon: 'person_pin', department: 0 },
        { id: 3, status: 'In Use', patient: 'James Smith', admissionDate: '12/27/2019', age: 73, sex: 'Male', icon: 'hotel', department: 1 },
        { id: 4, status: 'In Use', patient: 'Cindy Love', admissionDate: '12/12/2019', age: 36, sex: 'Female', icon: 'hotel', department: 1 },
        { id: 5, status: 'In Use', patient: 'James Johnson', admissionDate: '11/12/2019', age: 56, sex: 'Male', icon: 'hotel', department: 2 },
        { id: 6, status: 'In Use', patient: 'Maria Garcia', admissionDate: '01/12/2020', age: 49, sex: 'Female', icon: 'hotel', department: 2 },
        { id: 7, status: 'Empty', patient: '', admissionDate: '', age: '', sex: '', icon: 'person_add', department: 3 },
        { id: 8, status: 'In Use', patient: 'Robert Scott', admissionDate: '01/01/2020', age: 60, sex: 'Male', icon: 'hotel', department: 3 },
    ];
    constructor(
        public _dashboardServices: DashboardService,
        public dialog: MatDialog
    ) { }

    ngOnInit(): void {
        // this.getWard();
        // Load department data first, then load initial bed data
        this.loadDepartments();
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
            if (document.getElementById('BedDischargeLine')) {
                this.dischargeLineLarge = this.getLargeDischargeChart();
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
            this.selectedRoom = this.prevSelectedWard.WardName;
            console.log(this.warDataArr);
            this.getWardDetails(this.prevSelectedWard.WardId);
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

    public getDeptData(index: number) {
        // Use API data if available, otherwise fall back to static data
        const dept = this.departments[index];
        if (!dept) {
            return {
                name: 'Department ' + (index + 1),
                image: this.departmentImages[index],
                total: 0,
                inUse: 0,
                reserved: 0,
                empty: 0,
                percent: 0
            };
        }

        // Extract data from API response
        const total = this.extractNumberValue(dept.TotalCount) || this.extractNumberValue(dept.TotalBeds) || 0;
        const inUse = this.extractNumberValue(dept.OccuipedCount) || this.extractNumberValue(dept.OccupiedCount) || 0;
        const available = this.extractNumberValue(dept.AvailableCount) || 0;
        const reserved = Math.max(Math.round(total * 0.07), 0); // Calculate reserved as 7% of total
        const percent = total ? Math.round((inUse / total) * 100) : 0;

        return {
            name: this.extractStringValue(dept.WardName) || this.extractStringValue(dept.DepartmentName) || 'Department ' + (index + 1),
            image: this.departmentImages[index % this.departmentImages.length],
            total,
            inUse,
            reserved,
            empty: Math.max(total - inUse - reserved, 0),
            percent
        };
    }

    extractNumberValue(value: any): number {
        if (!value) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    }

    // reverted: department cards helper removed

    // chart helpers (mirroring Daily Dashboard style)
    getLineChartData(charId: string, backgroundColor: Color, borderColor: Color) {
        return new Chart(charId, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
                        backgroundColor: ['#6366f1', '#497df7', '#4c52f8', '#4b48f3', '#4a25f3',],
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

        let totalOccupiedCount = 0;

        const dataLabelsPlugin = {
            id: 'dataLabels',
            afterDatasetDraw: (chart: any) => {
                const { ctx, chartArea } = chart;
                const labels = chart.data.labels;

                chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
                    const meta = chart.getDatasetMeta(datasetIndex);
                    if (!meta.hidden) {
                        meta.data.forEach((element: any, index: number) => {
                            const value = dataset.data[index];
                            if (value > 0) {
                                ctx.save();

                                // Get arc properties
                                const model = element;
                                const centerX = chart.width / 2;
                                const centerY = chart.height / 2;

                                // Calculate middle angle of the arc
                                const startAngle = model.startAngle;
                                const endAngle = model.endAngle;
                                const midAngle = startAngle + (endAngle - startAngle) / 2;

                                // Position in the middle of the arc segment
                                const radius = (model.outerRadius + model.innerRadius) / 2;
                                const labelX = centerX + Math.cos(midAngle) * radius;
                                const labelY = centerY + Math.sin(midAngle) * radius;

                                // Calculate percentage
                                const total = dataset.data.reduce((sum: number, val: number) => sum + val, 0);
                                const percentage = Math.round((value / total) * 100);

                                // Get label name
                                const labelName = labels[index];

                                // Custom label text - Option 3: Label name with count and percentage
                                const line1Text = labelName;
                                const line2Text = `${value} (${percentage}%)`;
                                console.log("================>>>>>>>..", line1Text, percentage)
                                if (line1Text === 'Used') {
                                    totalOccupiedCount = percentage;
                                }

                                // Draw labels with white text and shadow for contrast
                                ctx.fillStyle = 'white';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';

                                // Draw label name (e.g., "In use")
                                ctx.font = 'bold 13px Inter, sans-serif';
                                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                                ctx.lineWidth = 3;
                                ctx.strokeText(line1Text, labelX, labelY - 10);
                                ctx.fillText(line1Text, labelX, labelY - 10);

                                // Draw count and percentage (e.g., "5 (25%)")
                                ctx.font = 'bold 15px Inter, sans-serif';
                                ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
                                ctx.lineWidth = 2.5;
                                ctx.strokeText(line2Text, labelX, labelY + 8);
                                ctx.fillText(line2Text, labelX, labelY + 8);

                                ctx.restore();
                            }
                        });
                    }
                });
            }
        };

        const centerTextPlugin = {
            id: 'centerText',
            beforeDraw: (chart: any) => {
                const { width, height, ctx } = chart;
                ctx.restore();

                // Main percentage text
                const percentText = `${totalOccupiedCount}%`;
                ctx.font = 'bold 42px Inter, sans-serif';
                ctx.fillStyle = '#2c3e50';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                const percentX = width / 2;
                const percentY = height / 2 - 10;
                ctx.fillText(percentText, percentX, percentY);

                // Subtitle text
                ctx.font = '14px Inter, sans-serif';
                ctx.fillStyle = '#6c757d';
                const subtitleY = height / 2 + 25;
                ctx.fillText('Occupancy', percentX, subtitleY);

                ctx.save();
            }
        };

        const payload = {
            "searchFields": [],
            "mode": "DashBedStatistics"
        };

        this._dashboardServices.HomeDashboardAPI(payload).subscribe((res: any) => {
            const apiData = res && res.length ? res[0] : {};
            this.dashBedStatistics = apiData;
            console.log("apiDataapiDataapiData", apiData)

            return new Chart('BedOverallDoughnut', {
                type: 'doughnut',
                data: {
                    labels: Object.entries(apiData)
                        .filter(([key]) => key !== 'TotalBedCount')
                        .map(([key, _]) => key.replace(/Count/gi, ''))
                        || [],
                    datasets: [
                        {
                            backgroundColor: ['#6366f1', '#497df7', '#4c52f8', '#4b48f3', '#4a25f3'],
                            data: Object.entries(apiData)
                                .filter(([key]) => key !== 'TotalBedCount') // skip that key
                                .map(([_, value]) => value) || []
                        }
                    ]
                },
                options: {
                    plugins: {
                        tooltip: { enabled: true },
                        legend: { display: false }
                    },
                    cutout: '50%'
                },
                plugins: [centerTextPlugin, dataLabelsPlugin]
            });

        }, err => {
            return []
        })


    }

    getLargeAdmissionsChart() {
        const payload = {
            "searchFields": [],
            "mode": "DashAdmissionDateWiseCount"
        };
        this._dashboardServices.HomeDashboardAPI(payload).subscribe((res: any) => {
            const apiData = res && res.length ? res : {};
            console.log(res)
            return new Chart('BedAdmissionsLine', {
                type: 'line',
                data: {
                    labels: apiData?.map(data => data?.AdmissionDate) || [],
                    datasets: [
                        {
                            label: 'Admissions',
                            data: apiData?.map(data => data?.Count) || [],
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

        }, err => {
            return new Chart('BedAdmissionsLine', {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Admissions',
                            data: [],
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
        })

    }

    getLargeDischargeChart() {
        const payload = {
            "searchFields": [],
            "mode": "DashDischargeDateWiseCount"
        };

        this._dashboardServices.HomeDashboardAPI(payload).subscribe((res: any) => {
            const apiData = res && res.length ? res : {};
            console.log(res)
            return new Chart('BedDischargeLine', {
                type: 'line',
                data: {
                    labels: apiData?.map(data => data?.DischargeDate) || [],
                    datasets: [
                        {
                            label: 'Discharges',
                            data: apiData?.map(data => data?.Count) || [],
                            backgroundColor: 'rgba(99,179,237,0.15)',
                            borderColor: '#5ac8fa',
                            pointBackgroundColor: '#5ac8fa',
                            pointRadius: 3,
                            tension: 0.35,
                            fill: true
                        }
                    ]
                },
                options: { maintainAspectRatio: false }
            });
        }, err => {

            return new Chart('BedDischargeLine', {
                type: 'line',
                data: {
                    labels: ['01 Mon', '02 Tue', '03 Wed', '04 Thu', '05 Fri', '06 Sat', '07 Sun', '08 Mon', '09 Tue', '10 Wed', '11 Thu', '12 Fri', '13 Sat', '14 Sun'],
                    datasets: [
                        {
                            label: 'Discharges',
                            data: [22, 20, 30, 38, 52, 40, 35, 38, 18, 24, 35, 32, 28, 85],
                            backgroundColor: 'rgba(99,179,237,0.15)',
                            borderColor: '#5ac8fa',
                            pointBackgroundColor: '#5ac8fa',
                            pointRadius: 3,
                            tension: 0.35,
                            fill: true
                        }
                    ]
                },
                options: { maintainAspectRatio: false }
            });
        })


    }

    onSelectWard(element: WardDetails) {
        this.prevSelectedWard.isSelected = false;
        this.prevSelectedWard = element;
        element.isSelected = true;
        this.getWardDetails(element.WardId);
        console.log(element)
        this.selectedRoom = element.WardName;
    }

    getWardDetails(item: any) {
        this.isTableLoading = true;
        const reqParam = {
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

    openBedDetails(bed: any): void {
        this.dialog.open(BedDetailsDialogComponent, {
            width: '650px',
            maxWidth: '90vw',
            data: bed,
            panelClass: 'bed-details-dialog'
        });
    }

    getBedStatusClass(status: string): string {
        if (!status) return '';
        const normalizedStatus = status.toLowerCase().trim();

        if (normalizedStatus === 'in use' || normalizedStatus === 'inuse') {
            return 'use';
        } else if (normalizedStatus === 'reserved') {
            return 'reserved';
        } else if (normalizedStatus === 'empty') {
            return 'empty';
        }
        return '';
    }

    isBedEmpty(status: string): boolean {
        if (!status) return false;
        return status.toLowerCase().trim() === 'empty';
    }

    // Department selection methods
    selectDepartment(departmentIndex: number): void {
        this.selectedDepartment = departmentIndex;
        this.loadBedsForDepartment(departmentIndex);
    }

    loadBedsForDepartment(departmentIndex: number): void {
        this.isBedsLoading = true;
        this.filteredBeds = [];

        // Get ward ID from department data
        const dept = this.departments[departmentIndex];
        let wardId = departmentIndex + 1; // Default fallback

        if (dept) {
            wardId = this.extractNumberValue(dept.WardId) || this.extractNumberValue(dept.Id) || (departmentIndex + 1);
        }

        this._dashboardServices.getBedWiseList(wardId).subscribe(
            (response: any) => {
                this.isBedsLoading = false;
                console.log('API Response for WardId', wardId, ':', response);
                if (response && response.length > 0) {
                    this.filteredBeds = this.transformApiDataToBedFormat(response);
                    console.log('Transformed bed data:', this.filteredBeds);
                } else {
                    this.filteredBeds = [];
                }
            },
            (error) => {
                this.isBedsLoading = false;
                console.error('Error loading bed data:', error);
                this.filteredBeds = [];
            }
        );
    }

    transformApiDataToBedFormat(apiData: any[]): any[] {
        return apiData.map((item, index) => ({
            id: item.BedId || (index + 1),
            status: this.getBedStatus(item),
            patient: this.extractStringValue(item.PatientName),
            admissionDate: this.extractStringValue(item.AdmissionDate),
            age: this.extractStringValue(item.Age),
            sex: this.extractStringValue(item.GenderName),
            icon: this.getBedIcon(item),
            department: this.selectedDepartment,
            // Additional API fields
            regNo: this.extractStringValue(item.UHID),
            doctorName: this.extractStringValue(item.DoctorName),
            roomName: this.extractStringValue(item.RoomName),
            wardName: this.extractStringValue(item.WardName)
        }));
    }

    extractStringValue(value: any): string {
        if (!value) return '';

        // If it's already a string, return it
        if (typeof value === 'string') return value.trim();

        // If it's an object, try to extract meaningful data
        if (typeof value === 'object') {
            // Check for common object properties that might contain the actual value
            if (value.name && typeof value.name === 'string') return value.name.trim();
            if (value.value && typeof value.value === 'string') return value.value.trim();
            if (value.text && typeof value.text === 'string') return value.text.trim();
            if (value.label && typeof value.label === 'string') return value.label.trim();
            if (value.displayName && typeof value.displayName === 'string') return value.displayName.trim();

            // Handle name objects with first and last name
            if (value.firstName || value.lastName) {
                const firstName = value.firstName ? String(value.firstName).trim() : '';
                const lastName = value.lastName ? String(value.lastName).trim() : '';
                return `${firstName} ${lastName}`.trim();
            }

            // If it's an array, join the elements
            if (Array.isArray(value)) {
                return value.filter(v => v && typeof v === 'string').map(v => v.trim()).join(' ');
            }

            // Log the object structure for debugging
            console.warn('Unexpected object structure:', value);

            // If none of the above, return empty string to avoid [object Object]
            return '';
        }

        // For other types, convert to string
        return String(value).trim();
    }

    getBedStatus(item: any): string {
        if (item.IsAvailable === true || item.IsAvailable === 'true') {
            return 'Empty';
        } else if (item.IsReserved === true || item.IsReserved === 'true') {
            return 'Reserved';
        } else {
            return 'In Use';
        }
    }

    getBedIcon(item: any): string {
        const status = this.getBedStatus(item);
        switch (status) {
            case 'In Use':
                return 'hotel';
            case 'Reserved':
                return 'person_pin';
            case 'Empty':
            default:
                return 'person_add';
        }
    }

    isDepartmentSelected(departmentIndex: number): boolean {
        return this.selectedDepartment === departmentIndex;
    }

    // Department loading methods
    loadDepartments(): void {
        this.isDepartmentsLoading = true;

        this._dashboardServices.getWardWiseBedData().subscribe(
            (response: any) => {
                this.isDepartmentsLoading = false;
                console.log('Department API Response:', response);
                if (response && response.length > 0) {
                    this.departments = response;
                    this.initializeSlider();
                    // Load initial bed data for first department
                    this.loadBedsForDepartment(0);
                } else {
                    this.departments = [];
                    this.sliderDots = [];
                    console.warn('No department data received from API');
                }
            },
            (error) => {
                this.isDepartmentsLoading = false;
                console.error('Error loading department data:', error);
                this.departments = [];
                this.sliderDots = [];
            }
        );
    }

    // Slider methods
    initializeSlider(): void {
        this.currentSlideIndex = 0;
        this.updateSliderSettings();
        this.generateSliderDots();
    }

    updateSliderSettings(): void {
        // Calculate how many slides we can show based on screen size
        const screenWidth = window.innerWidth;
        if (screenWidth < 768) {
            this.slidesPerView = 1;
            this.slideWidth = 296;
        } else if (screenWidth < 1024) {
            this.slidesPerView = 2;
            this.slideWidth = 296;
        } else if (screenWidth < 1440) {
            this.slidesPerView = 3;
            this.slideWidth = 296;
        } else if (screenWidth < 1920) {
            this.slidesPerView = 4;
            this.slideWidth = 296;
        } else {
            this.slidesPerView = 5;
            this.slideWidth = 296;
        }

        // Calculate maximum slide index
        this.maxSlideIndex = Math.max(0, this.departments.length - this.slidesPerView);
    }

    generateSliderDots(): void {
        const totalSlides = Math.ceil(this.departments.length / this.slidesPerView);
        this.sliderDots = Array(totalSlides).fill(0).map((_, index) => ({ index }));
    }

    nextSlide(): void {
        if (this.currentSlideIndex < this.maxSlideIndex) {
            this.currentSlideIndex++;
        }
    }

    previousSlide(): void {
        if (this.currentSlideIndex > 0) {
            this.currentSlideIndex--;
        }
    }

    goToSlide(slideIndex: number): void {
        this.currentSlideIndex = slideIndex;
    }

    @HostListener('window:resize', ['$event'])
    onResize(event?: any): void {
        this.updateSliderSettings();
        this.generateSliderDots();
        // Ensure current slide index is still valid
        if (this.currentSlideIndex > this.maxSlideIndex) {
            this.currentSlideIndex = this.maxSlideIndex;
        }
    }

    ngOnDestroy(): void {
        // Cleanup if needed
    }

    // Added by raksha 25/11/25
    onReset() {
        this._dashboardServices.bedReset().subscribe((response) => {
            // this.toastr.success(response.message);
        });
    }

}

export class WardDetails {
    AvailableCount: number;
    LocationName: string;
    OccuipedCount: number;
    OccupiedPercentage: number;
    TotalCount: number;
    isSelected: boolean = false;
    WardId: number;
    WardName: string;


    constructor(wardData) {
        this.AvailableCount = wardData.AvailableCount || 0;
        this.LocationName = wardData.LocationName || '';
        this.OccuipedCount = wardData.OccuipedCount || 0;
        this.OccupiedPercentage = wardData.OccupiedPercentage || 0;
        this.TotalCount = wardData.TotalCount || 0;
        this.WardId = wardData.WardId || 0;
        this.WardName = wardData.WardName || '';
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