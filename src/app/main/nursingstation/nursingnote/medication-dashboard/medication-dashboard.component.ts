// import { Component, OnInit, ViewEncapsulation } from '@angular/core';
// import * as dayjs from 'dayjs';
// import { MatDialog } from '@angular/material/dialog';
// import { DoseDialogComponent } from './dose-dialog.component';
// import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
// import { addDays, addHours, endOfMonth, startOfDay, subDays } from 'date-fns';
// import { EventColor } from 'calendar-utils';
// import { Subject } from 'rxjs';
// import { fuseAnimations } from '@fuse/animations';
// const colors: Record<string, EventColor> = {
//     red: {
//         primary: '#ad2121',
//         secondary: '#FAE3E3',
//     },
//     blue: {
//         primary: '#1e90ff',
//         secondary: '#D1E8FF',
//     },
//     yellow: {
//         primary: '#e3bc08',
//         secondary: '#FDF1BA',
//     },
// };
// @Component({
//     selector: 'app-medication-dashboard',
//     templateUrl: './medication-dashboard.component.html',
//     styleUrls: ['./medication-dashboard.component.scss'],
//     encapsulation: ViewEncapsulation.None,
//     animations: fuseAnimations
// })
// export class MedicationDashboardComponent implements OnInit {
//     actions: CalendarEventAction[] = [
//         {
//             label: '<i class="fas fa-fw fa-plus"></i>',
//             a11yLabel: 'Add',
//             onClick: ({ event }: { event: CalendarEvent }): void => {
//                 //this.handleEvent('CellClicked', event);
//             },
//         },
//         {
//             label: '<i class="fas fa-fw fa-pencil-alt"></i>',
//             a11yLabel: 'Edit',
//             onClick: ({ event }: { event: CalendarEvent }): void => {
//                 //this.handleEvent('CellClicked', event);
//             },
//         },
//         {
//             label: '<i class="fas fa-fw fa-trash-alt"></i>',
//             a11yLabel: 'Delete',
//             onClick: ({ event }: { event: CalendarEvent }): void => {
//                 // this.confirmDialogRef = this._matDialog.open(
//                 //     FuseConfirmDialogComponent,
//                 //     {
//                 //         disableClose: false,
//                 //     }
//                 // );
//                 // this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to cancel this appointment?";
//                 // this.confirmDialogRef.afterClosed().subscribe((result) => {
//                 //     if (result) {
//                 //         this._service.phoneMasterCancle(event.id).subscribe((response: any) => {
//                 //             this.toastr.success(response.message);
//                 //             this.bindData();
//                 //         });
//                 //     }
//                 //     this.confirmDialogRef = null;
//                 // });
//             },
//         },
//     ];
//     viewDate: Date = new Date();
//     events: CalendarEvent[] = [
//         {
//             start: subDays(startOfDay(new Date()), 1),
//             end: addDays(new Date(), 1),
//             title: 'A 3 day event',
//             color: { ...colors.red },
//             actions: this.actions,
//             allDay: true,
//             resizable: {
//                 beforeStart: true,
//                 afterEnd: true,
//             },
//             draggable: true,
//         },
//         {
//             start: startOfDay(new Date()),
//             title: 'An event with no end date',
//             color: { ...colors.yellow },
//             actions: this.actions,
//         },
//         {
//             start: subDays(endOfMonth(new Date()), 3),
//             end: addDays(endOfMonth(new Date()), 3),
//             title: 'A long event that spans 2 months',
//             color: { ...colors.blue },
//             allDay: true,
//         },
//         {
//             start: addHours(startOfDay(new Date()), 2),
//             end: addHours(new Date(), 2),
//             title: 'A draggable and resizable event',
//             color: { ...colors.yellow },
//             actions: this.actions,
//             resizable: {
//                 beforeStart: true,
//                 afterEnd: true,
//             },
//             draggable: true,
//         },
//     ];
//     refresh = new Subject<void>();
//     handleEvent(action: string, event: CalendarEvent): void {

//     }
//     eventTimesChanged({
//         event,
//         newStart,
//         newEnd,
//     }: CalendarEventTimesChangedEvent): void {
//         event.start = newStart;
//         event.end = newEnd;
//         this.handleEvent('Dropped or resized', event);
//     }
//     currentTime: any;

//     patient = {
//         name: 'John Doe',
//         regNo: '123456',
//         age: 65,
//         ward: '7B',
//         doctor: 'Dr. Smith',
//         allergies: ['Penicillin', 'Sulfa']
//     };

//     summary = {
//         total: 22,
//         given: 1,
//         dueSoon: 4,
//         missed: 3,
//         upcoming: 9
//     };

//     timeSlots = ['06:00', '08:00', '10:00', '12:00', '14:00', '18:00', '20:00', '22:00'];

//     medicines: any[] = [
//         {
//             name: 'Paracetamol',
//             dose: '500mg PO - Q6H',
//             schedule: {
//                 '06:00': 'missed',
//                 '12:00': 'given',
//                 '18:00': 'due'
//             }
//         },
//         {
//             name: 'Lisinopril',
//             dose: '100mg PO - Q8H',
//             schedule: {
//                 '08:00': 'given',
//                 '18:00': 'dueSoon'
//             }
//         }
//     ];

//     constructor(private dialog: MatDialog) { }

//     ngOnInit() {
//         this.updateTime();
//         setInterval(() => this.updateTime(), 1000);
//         setInterval(() => {
//             this.medicines.forEach(med => {
//                 Object.keys(med.schedule).forEach(time => {
//                     const diff = dayjs(time, 'HH:mm').diff(dayjs(), 'minute');

//                     if (diff === 5) {
//                         alert(`Reminder: ${med.name} in 5 mins`);
//                     }
//                 });
//             });
//         }, 60000);
//     }

//     updateTime() {
//         this.currentTime = dayjs();
//     }

//     getStatusClass(status: string) {
//         return {
//             'given': 'status-given',
//             'due': 'status-due',
//             'dueSoon': 'status-due-soon',
//             'missed': 'status-missed'
//         }[status];
//     }

//     openDoseDialog(medicine: any, time: string) {
//         this.dialog.open(DoseDialogComponent, {
//             width: '400px',
//             data: { medicine, time }
//         });
//     }

//     isCurrentSlot(time: string) {
//         return this.currentTime.format('HH:mm') === time;
//     }

// }

import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { interval, Subscription } from 'rxjs';

/* ── Domain Models ───────────────────────────────────────────── */
export type DoseStatus = 'given' | 'overdue' | 'due-now' | 'upcoming' | 'hold' | 'cancelled' | 'postponed';

export interface Patient {
    name: string; mrn: string; dob: string; age: number;
    ward: string; bed: string; consultant: string;
    allergies: string[]; bloodGroup: string;
    admitDate: string; diagnosis: string;
    weight: string; height: string;
}

export interface DoseMeta {
    medicineId: string;
    medicineName: string;
    genericName: string;
    dose: string;
    route: string;
    frequency: string;
    category: string;
    instructions: string;
    status: DoseStatus;
    scheduledTime: Date;
    givenTime?: Date;
    givenBy?: string;
    remark?: string;
    doseNumber: number;
}

export interface Medicine {
    id: string;
    name: string;
    genericName: string;
    dose: string;
    route: string;
    frequency: string;
    interval: string;
    category: string;
    prescribedBy: string;
    instructions: string;
    color: string;
    doses: DoseMeta[];
}

export interface PopupState {
    visible: boolean;
    event: CalendarEvent<DoseMeta> | null;
    remark: string;
    selectedAction: string;
}

/* ── Status colour map ───────────────────────────────────────── */
const STATUS_COLORS: Record<DoseStatus, { primary: string; secondary: string }> = {
    'given': { primary: '#065f46', secondary: '#d1fae5' },
    'overdue': { primary: '#991b1b', secondary: '#fee2e2' },
    'due-now': { primary: '#1e40af', secondary: '#dbeafe' },
    'upcoming': { primary: '#475569', secondary: '#f1f5f9' },
    'hold': { primary: '#92400e', secondary: '#fef3c7' },
    'cancelled': { primary: '#374151', secondary: '#f3f4f6' },
    'postponed': { primary: '#5b21b6', secondary: '#ede9fe' },
};

const STATUS_ICONS: Record<DoseStatus, string> = {
    'given': '✓', 'overdue': '⚠', 'due-now': '●',
    'upcoming': '○', 'hold': '⏸', 'cancelled': '✕', 'postponed': '⏩'
};

@Component({
    selector: 'app-medication-dashboard',
    templateUrl: './medication-dashboard.component.html',
    styleUrls: ['./medication-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MedicationDashboardComponent implements OnInit, OnDestroy {

    /* ── State ─────────────────────────────────────────────────── */
    viewDate: Date = new Date();
    currentTime: Date = new Date();
    calendarEvents: CalendarEvent<DoseMeta>[] = [];
    selectedCategory: string = 'ALL';
    sidebarCollapsed = false;
    alertQueue: { id: string; text: string; medicine: string }[] = [];
    private alerted = new Set<string>();
    private ticker!: Subscription;

    popup: PopupState = { visible: false, event: null, remark: '', selectedAction: '' };

    /* ── Patient ───────────────────────────────────────────────── */
    patient: Patient = {
        name: 'John Doe', mrn: 'MRN-20250221-0042',
        dob: '15 Mar 1978', age: 47,
        ward: 'Ward 4B', bed: 'Bed 12',
        consultant: 'Dr. S. Patel',
        allergies: ['Penicillin', 'Sulfa'],
        bloodGroup: 'B+', admitDate: '20 Feb 2026',
        diagnosis: 'Community Acquired Pneumonia',
        weight: '72 kg', height: '170 cm'
    };

    /* ── Medicines master list ─────────────────────────────────── */
    medicines: Medicine[] = [];
    get categories(): string[] {
        return ['ALL', ...new Set(this.medicines.map(m => m.category))];
    }
    get filteredMedicines(): Medicine[] {
        return this.selectedCategory === 'ALL'
            ? this.medicines
            : this.medicines.filter(m => m.category === this.selectedCategory);
    }

    /* ── Stats ─────────────────────────────────────────────────── */
    //   get allDoses(): DoseMeta[] {
    //     return this.medicines.flatMap(m => m.doses);
    //   }
    get allDoses(): DoseMeta[] {
        return ([] as DoseMeta[]).concat(...this.medicines.map(m => m.doses));
    }
    get totalDoses() { return this.allDoses.length; }
    get givenCount() { return this.allDoses.filter(d => d.status === 'given').length; }
    get overdueCount() { return this.allDoses.filter(d => d.status === 'overdue').length; }
    get dueNowCount() { return this.allDoses.filter(d => d.status === 'due-now').length; }
    get upcomingCount() { return this.allDoses.filter(d => d.status === 'upcoming').length; }
    get onTimeRate(): number {
        const g = this.allDoses.filter(d => d.status === 'given');
        if (!g.length) return 0;
        const ok = g.filter(d => {
            if (!d.givenTime) return false;
            return Math.abs(d.givenTime.getTime() - d.scheduledTime.getTime()) <= 15 * 60000;
        }).length;
        return Math.round((ok / g.length) * 100);
    }

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.buildMedicines();
        this.buildCalendarEvents();
        this.ticker = interval(30000).subscribe(() => {
            this.currentTime = new Date();
            this.refreshStatuses();
            this.buildCalendarEvents();
            this.checkAlerts();
            this.cdr.markForCheck();
        });
        this.checkAlerts();
    }

    ngOnDestroy(): void { this.ticker?.unsubscribe(); }

    /* ── Build sample medicine + dose data ─────────────────────── */
    buildMedicines(): void {
        const today = new Date();
        const t = (h: number, m = 0): Date => {
            const d = new Date(today); d.setHours(h, m, 0, 0); return d;
        };
        const now = new Date();

        const calcStatus = (sched: Date, fixed?: DoseStatus): DoseStatus => {
            if (fixed) return fixed;
            const diff = (now.getTime() - sched.getTime()) / 60000;
            if (diff > 15) return 'overdue';
            if (diff >= -15) return 'due-now';
            return 'upcoming';
        };

        this.medicines = [
            {
                id: 'm1', name: 'Paracetamol', genericName: 'Acetaminophen',
                dose: '500 mg', route: 'PO', frequency: 'Q6H', interval: 'Every 6 hrs',
                category: 'ANALGESICS', prescribedBy: 'Dr. S. Patel',
                instructions: 'After food. Monitor liver enzymes.',
                color: '#10b981',
                doses: [
                    { medicineId: 'm1', medicineName: 'Paracetamol', genericName: 'Acetaminophen', dose: '500mg', route: 'PO', frequency: 'Q6H', category: 'ANALGESICS', instructions: 'After food', status: 'given', scheduledTime: t(6), givenTime: t(6, 8), givenBy: 'Nurse Priya', remark: 'Patient tolerated well', doseNumber: 1 },
                    { medicineId: 'm1', medicineName: 'Paracetamol', genericName: 'Acetaminophen', dose: '500mg', route: 'PO', frequency: 'Q6H', category: 'ANALGESICS', instructions: 'After food', status: 'given', scheduledTime: t(12), givenTime: t(12, 5), givenBy: 'Nurse Rita', remark: '', doseNumber: 2 },
                    { medicineId: 'm1', medicineName: 'Paracetamol', genericName: 'Acetaminophen', dose: '500mg', route: 'PO', frequency: 'Q6H', category: 'ANALGESICS', instructions: 'After food', status: calcStatus(t(18)), scheduledTime: t(18), doseNumber: 3 },
                    { medicineId: 'm1', medicineName: 'Paracetamol', genericName: 'Acetaminophen', dose: '500mg', route: 'PO', frequency: 'Q6H', category: 'ANALGESICS', instructions: 'After food', status: 'upcoming', scheduledTime: t(0), doseNumber: 4 },
                ]
            },
            {
                id: 'm2', name: 'Ibuprofen', genericName: 'Ibuprofen',
                dose: '400 mg', route: 'PO', frequency: 'Q8H', interval: 'Every 8 hrs',
                category: 'ANALGESICS', prescribedBy: 'Dr. S. Patel',
                instructions: 'With food. Avoid on empty stomach.',
                color: '#f59e0b',
                doses: [
                    { medicineId: 'm2', medicineName: 'Ibuprofen', genericName: 'Ibuprofen', dose: '400mg', route: 'PO', frequency: 'Q8H', category: 'ANALGESICS', instructions: 'With food', status: 'overdue', scheduledTime: t(6), doseNumber: 1 },
                    { medicineId: 'm2', medicineName: 'Ibuprofen', genericName: 'Ibuprofen', dose: '400mg', route: 'PO', frequency: 'Q8H', category: 'ANALGESICS', instructions: 'With food', status: calcStatus(t(14)), scheduledTime: t(14), doseNumber: 2 },
                    { medicineId: 'm2', medicineName: 'Ibuprofen', genericName: 'Ibuprofen', dose: '400mg', route: 'PO', frequency: 'Q8H', category: 'ANALGESICS', instructions: 'With food', status: 'upcoming', scheduledTime: t(22), doseNumber: 3 },
                ]
            },
            {
                id: 'm3', name: 'Amoxicillin', genericName: 'Amoxicillin Trihydrate',
                dose: '500 mg', route: 'PO', frequency: 'Q8H', interval: 'Every 8 hrs',
                category: 'ANTIBIOTICS', prescribedBy: 'Dr. S. Patel',
                instructions: '⚠️ ALLERGY ALERT — Confirm with doctor',
                color: '#ef4444',
                doses: [
                    { medicineId: 'm3', medicineName: 'Amoxicillin', genericName: 'Amoxicillin', dose: '500mg', route: 'PO', frequency: 'Q8H', category: 'ANTIBIOTICS', instructions: 'Check allergy', status: 'hold', scheduledTime: t(8), remark: 'Allergy review pending', doseNumber: 1 },
                    { medicineId: 'm3', medicineName: 'Amoxicillin', genericName: 'Amoxicillin', dose: '500mg', route: 'PO', frequency: 'Q8H', category: 'ANTIBIOTICS', instructions: 'Check allergy', status: 'hold', scheduledTime: t(16), doseNumber: 2 },
                    { medicineId: 'm3', medicineName: 'Amoxicillin', genericName: 'Amoxicillin', dose: '500mg', route: 'PO', frequency: 'Q8H', category: 'ANTIBIOTICS', instructions: 'Check allergy', status: 'hold', scheduledTime: t(0), doseNumber: 3 },
                ]
            },
            {
                id: 'm4', name: 'Ceftriaxone', genericName: 'Ceftriaxone Sodium',
                dose: '1 g', route: 'IV', frequency: 'Q12H', interval: 'Every 12 hrs',
                category: 'ANTIBIOTICS', prescribedBy: 'Dr. S. Patel',
                instructions: 'IV infusion over 30 min. Flush line.',
                color: '#8b5cf6',
                doses: [
                    { medicineId: 'm4', medicineName: 'Ceftriaxone', genericName: 'Ceftriaxone', dose: '1g', route: 'IV', frequency: 'Q12H', category: 'ANTIBIOTICS', instructions: '30 min infusion', status: 'given', scheduledTime: t(8), givenTime: t(8, 12), givenBy: 'Nurse Rita', doseNumber: 1 },
                    { medicineId: 'm4', medicineName: 'Ceftriaxone', genericName: 'Ceftriaxone', dose: '1g', route: 'IV', frequency: 'Q12H', category: 'ANTIBIOTICS', instructions: '30 min infusion', status: calcStatus(t(20)), scheduledTime: t(20), doseNumber: 2 },
                ]
            },
            {
                id: 'm5', name: 'Pantoprazole', genericName: 'Pantoprazole Sodium',
                dose: '40 mg', route: 'IV', frequency: 'BD', interval: 'Twice daily',
                category: 'GI & METABOLIC', prescribedBy: 'Dr. S. Patel',
                instructions: 'Before meals. IV push over 2 min.',
                color: '#3b82f6',
                doses: [
                    { medicineId: 'm5', medicineName: 'Pantoprazole', genericName: 'Pantoprazole', dose: '40mg', route: 'IV', frequency: 'BD', category: 'GI & METABOLIC', instructions: 'Before meals', status: 'given', scheduledTime: t(8), givenTime: t(8, 0), givenBy: 'Nurse Priya', doseNumber: 1 },
                    { medicineId: 'm5', medicineName: 'Pantoprazole', genericName: 'Pantoprazole', dose: '40mg', route: 'IV', frequency: 'BD', category: 'GI & METABOLIC', instructions: 'Before meals', status: 'upcoming', scheduledTime: t(20), doseNumber: 2 },
                ]
            },
            {
                id: 'm6', name: 'Ondansetron', genericName: 'Ondansetron HCl',
                dose: '4 mg', route: 'IV', frequency: 'TDS', interval: 'Three times daily',
                category: 'GI & METABOLIC', prescribedBy: 'Dr. S. Patel',
                instructions: 'Slow IV over 5 min. Monitor QT interval.',
                color: '#06b6d4',
                doses: [
                    { medicineId: 'm6', medicineName: 'Ondansetron', genericName: 'Ondansetron', dose: '4mg', route: 'IV', frequency: 'TDS', category: 'GI & METABOLIC', instructions: 'Slow IV 5 min', status: 'given', scheduledTime: t(6), givenTime: t(6, 10), givenBy: 'Nurse Priya', doseNumber: 1 },
                    { medicineId: 'm6', medicineName: 'Ondansetron', genericName: 'Ondansetron', dose: '4mg', route: 'IV', frequency: 'TDS', category: 'GI & METABOLIC', instructions: 'Slow IV 5 min', status: 'postponed', scheduledTime: t(14), remark: 'Patient nausea resolved, postponed', doseNumber: 2 },
                    { medicineId: 'm6', medicineName: 'Ondansetron', genericName: 'Ondansetron', dose: '4mg', route: 'IV', frequency: 'TDS', category: 'GI & METABOLIC', instructions: 'Slow IV 5 min', status: 'upcoming', scheduledTime: t(22), doseNumber: 3 },
                ]
            },
            {
                id: 'm7', name: 'Metoprolol', genericName: 'Metoprolol Succinate',
                dose: '25 mg', route: 'PO', frequency: 'OD', interval: 'Once daily',
                category: 'CARDIAC', prescribedBy: 'Dr. S. Patel',
                instructions: 'Check BP & HR before. Hold if HR < 55.',
                color: '#ec4899',
                doses: [
                    { medicineId: 'm7', medicineName: 'Metoprolol', genericName: 'Metoprolol', dose: '25mg', route: 'PO', frequency: 'OD', category: 'CARDIAC', instructions: 'Check BP/HR', status: 'given', scheduledTime: t(8), givenTime: t(8, 20), givenBy: 'Nurse Rita', remark: 'BP 118/76, HR 72', doseNumber: 1 },
                ]
            },
            {
                id: 'm8', name: 'Normal Saline', genericName: '0.9% NaCl',
                dose: '500 ml', route: 'IV', frequency: 'Q8H', interval: 'Every 8 hrs',
                category: 'IV FLUIDS', prescribedBy: 'Dr. S. Patel',
                instructions: 'Run at 60 ml/hr. Monitor IV site hourly.',
                color: '#0ea5e9',
                doses: [
                    { medicineId: 'm8', medicineName: 'Normal Saline', genericName: '0.9% NaCl', dose: '500ml', route: 'IV', frequency: 'Q8H', category: 'IV FLUIDS', instructions: '60 ml/hr', status: 'given', scheduledTime: t(6), givenTime: t(6, 5), givenBy: 'Nurse Rita', doseNumber: 1 },
                    { medicineId: 'm8', medicineName: 'Normal Saline', genericName: '0.9% NaCl', dose: '500ml', route: 'IV', frequency: 'Q8H', category: 'IV FLUIDS', instructions: '60 ml/hr', status: calcStatus(t(14)), scheduledTime: t(14), doseNumber: 2 },
                    { medicineId: 'm8', medicineName: 'Normal Saline', genericName: '0.9% NaCl', dose: '500ml', route: 'IV', frequency: 'Q8H', category: 'IV FLUIDS', instructions: '60 ml/hr', status: 'upcoming', scheduledTime: t(22), doseNumber: 3 },
                ]
            },
        ];
    }

    /* ── Map doses → CalendarEvents ────────────────────────────── */
    buildCalendarEvents(): void {
        const filtered = this.selectedCategory === 'ALL'
            ? this.medicines
            : this.medicines.filter(m => m.category === this.selectedCategory);
        this.calendarEvents = ([] as CalendarEvent<DoseMeta>[]).concat(
            ...filtered.map(med =>
                med.doses.map(dose => {
                    const col = STATUS_COLORS[dose.status];
                    const icon = STATUS_ICONS[dose.status];
                    const end = new Date(dose.scheduledTime.getTime() + 30 * 60000);
                    return {
                        id: `${dose.medicineId}-${dose.doseNumber}`,
                        start: dose.scheduledTime,
                        end,
                        title: `${icon} ${dose.medicineName} ${dose.dose} (${dose.route}) — Dose #${dose.doseNumber}`,
                        color: col,
                        meta: dose,
                        resizable: { beforeStart: false, afterEnd: false },
                        draggable: false,
                        cssClass: `cal-event-${dose.status}`
                    } as CalendarEvent<DoseMeta>;
                })
            ));
    }

    /* ── Auto-status refresh ───────────────────────────────────── */
    refreshStatuses(): void {
        const now = new Date();
        this.medicines.forEach(med => {
            med.doses.forEach(dose => {
                if (['given', 'hold', 'cancelled', 'postponed'].includes(dose.status)) return;
                const diff = (now.getTime() - dose.scheduledTime.getTime()) / 60000;
                dose.status = diff > 15 ? 'overdue' : diff >= -15 ? 'due-now' : 'upcoming';
            });
        });
    }

    /* ── Alert engine ──────────────────────────────────────────── */
    checkAlerts(): void {
        const now = new Date();
        this.medicines.forEach(med => {
            med.doses.forEach(dose => {
                const key = `${dose.medicineId}-${dose.doseNumber}`;
                const diff = (dose.scheduledTime.getTime() - now.getTime()) / 60000;
                if (diff > 0 && diff <= 15 && !this.alerted.has(key)) {
                    this.alerted.add(key);
                    this.alertQueue.unshift({
                        id: key,
                        medicine: `${dose.medicineName} ${dose.dose} ${dose.route}`,
                        text: `Due in ${Math.round(diff)} min (${this.fmtTime(dose.scheduledTime)})`
                    });
                    if (this.alertQueue.length > 4) this.alertQueue.pop();
                }
            });
        });
    }

    dismissAlert(id: string): void {
        this.alertQueue = this.alertQueue.filter(a => a.id !== id);
    }

    /* ── Calendar event click ──────────────────────────────────── */
    eventClicked({ event }: { event: CalendarEvent<DoseMeta> }): void {
        this.popup = {
            visible: true,
            event,
            remark: event.meta?.remark || '',
            selectedAction: ''
        };
    }

    /* ── Sidebar dose click ────────────────────────────────────── */
    openFromSidebar(dose: DoseMeta): void {
        const ev = this.calendarEvents.find(
            e => e.meta?.medicineId === dose.medicineId && e.meta?.doseNumber === dose.doseNumber
        );
        if (ev) this.popup = { visible: true, event: ev, remark: dose.remark || '', selectedAction: '' };
    }

    /* ── Popup actions ─────────────────────────────────────────── */
    applyAction(status: DoseStatus): void {
        if (!this.popup.event?.meta) return;
        const meta = this.popup.event.meta;
        meta.status = status;
        meta.remark = this.popup.remark;
        if (status === 'given') {
            meta.givenTime = new Date();
            meta.givenBy = 'Current Nurse';
        }
        this.buildCalendarEvents();
        this.closePopup();
    }

    closePopup(): void { this.popup.visible = false; }

    /* ── Category filter ───────────────────────────────────────── */
    filterCategory(cat: string): void {
        this.selectedCategory = cat;
        this.buildCalendarEvents();
    }

    /* ── Helpers ───────────────────────────────────────────────── */
    fmtTime(d: Date): string {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    getStatusColor(s: DoseStatus): string { return STATUS_COLORS[s]?.primary || '#475569'; }
    getStatusBg(s: DoseStatus): string { return STATUS_COLORS[s]?.secondary || '#f1f5f9'; }
    getStatusIcon(s: DoseStatus): string { return STATUS_ICONS[s] || '○'; }

    statusLabel(s: DoseStatus): string {
        const map: Record<DoseStatus, string> = {
            'given': 'Given', 'overdue': 'Overdue', 'due-now': 'Due Now',
            'upcoming': 'Upcoming', 'hold': 'On Hold', 'cancelled': 'Cancelled', 'postponed': 'Postponed'
        };
        return map[s] || s;
    }

    catIcon(cat: string): string {
        const m: Record<string, string> = {
            'ANALGESICS': '💊', 'ANTIBIOTICS': '🧬', 'GI & METABOLIC': '🫁', 'CARDIAC': '🫀', 'IV FLUIDS': '💧'
        };
        return m[cat] || '🔬';
    }

    trackById(i: number, item: any) { return item.id || i; }
    trackByDose(i: number, d: DoseMeta) { return `${d.medicineId}-${d.doseNumber}`; }
}
