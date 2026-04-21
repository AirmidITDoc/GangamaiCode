import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CalendarEvent, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { interval, Subscription } from 'rxjs';
import { NursingnoteService } from '../nursingnote.service';

/* ── Domain Models ───────────────────────────────────────────── */
export type DoseStatus = 'given' | 'overdue' | 'due-now' | 'upcoming' | 'hold' | 'cancelled' | 'postponed';

export interface DoseMeta {
    id: number;
    itemName: string;
    doseNo: number;
    start: Date;
    end: Date;
    firstName: string;
    lastName: string;
    middleName: string;
    color: string;
    status: number;
    comment: string;
    route: string;
    freq: string;
    regId: number;
    age: string;
    givenTime: Date;
    givenBy: string;
    category: string;
    genericName: string;
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
    allAchedules: DoseMeta[] = [];
    selectedCategory: string = 'ALL';
    sidebarCollapsed = false;
    alertQueue: { id: string; text: string; medicine: string }[] = [];
    private alerted = new Set<string>();
    private ticker!: Subscription;

    popup: PopupState = { visible: false, event: null, remark: '', selectedAction: '' };

    get categories(): string[] {
        return ['ALL', ...new Set(this.allAchedules.map(m => m.category))];
    }
    get totalDoses() { return this.allAchedules.length; }
    get givenCount() { return this.allAchedules.filter(d => d.color === 'given').length; }
    get overdueCount() { return this.allAchedules.filter(d => d.color === 'overdue').length; }
    get dueNowCount() { return this.allAchedules.filter(d => d.color === 'due-now').length; }
    get upcomingCount() { return this.allAchedules.filter(d => d.color === 'upcoming').length; }
    get onTimeRate(): number {
        const g = this.allAchedules.filter(d => d.color === 'given');
        if (!g.length) return 0;
        const ok = g.filter(d => {
            if (!d.givenTime) return false;
            return Math.abs(d.givenTime.getTime() - d.start.getTime()) <= 15 * 60000;
        }).length;
        return Math.round((ok / g.length) * 100);
    }

    constructor(private cdr: ChangeDetectorRef, private _service: NursingnoteService) { }

    ngOnInit(): void {
        this.buildMedicines();
        this.ticker = interval(30000).subscribe(() => {
            this.currentTime = new Date();
            this.buildCalendarEvents();
            this.checkAlerts();
            this.cdr.markForCheck();
        });
        this.checkAlerts();
        this.getSchedules();
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
    }
    getSchedules() {
        this._service.getShcedules(this.viewDate.toISOString().split('T')[0]).subscribe((data) => {
            this.allAchedules = data as DoseMeta[];
            this.buildCalendarEvents();
        });
    }

    /* ── Map doses → CalendarEvents ────────────────────────────── */
    buildCalendarEvents(): void {
        this.calendarEvents = this.allAchedules.filter(x => x.category == (this.selectedCategory == 'ALL' ? x.category : this.selectedCategory)).map(dose => {
            const col = STATUS_COLORS[dose.color];
            const icon = STATUS_ICONS[dose.color];
            return {
                id: `${dose.id}-${dose.doseNo}`,
                start: new Date(dose.start),
                end: new Date(dose.end),
                title: `${icon} ${dose.itemName} ${dose.freq} (${dose.route}) — Dose #${dose.doseNo}`,
                color: col,
                meta: dose,
                resizable: { beforeStart: false, afterEnd: false },
                draggable: false,
                cssClass: `cal-event-${dose.status}`
            } as CalendarEvent<DoseMeta>;
        });
    }

    /* ── Alert engine ──────────────────────────────────────────── */
    checkAlerts(): void {
        const now = new Date();
        this.allAchedules.forEach(dose => {
            const key = `${dose.id}-${dose.doseNo}`;
            const diff = (dose.start.getTime() - now.getTime()) / 60000;
            if (diff > 0 && diff <= 15 && !this.alerted.has(key)) {
                this.alerted.add(key);
                this.alertQueue.unshift({
                    id: key,
                    medicine: `${dose.itemName} ${dose.doseNo} ${dose.route}`,
                    text: `Due in ${Math.round(diff)} min (${this.fmtTime(dose.start)})`
                });
                if (this.alertQueue.length > 4) this.alertQueue.pop();
            }
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
            remark: event.meta?.comment || '',
            selectedAction: ''
        };
    }

    /* ── Sidebar dose click ────────────────────────────────────── */
    openFromSidebar(dose: DoseMeta): void {
        const ev = this.calendarEvents.find(
            e => e.meta?.id === dose.id && e.meta?.doseNo === dose.doseNo
        );
        if (ev) this.popup = { visible: true, event: ev, remark: dose.comment || '', selectedAction: '' };
    }

    /* ── Popup actions ─────────────────────────────────────────── */
    applyAction(status: DoseStatus): void {
        if (!this.popup.event?.meta) return;
        const meta = this.popup.event.meta;
        meta.color = status;
        meta.comment = this.popup.remark;
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
        if (d)
            return new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        else
            return '';
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
    trackByDose(i: number, d: DoseMeta) { return `${d.id}-${d.doseNo}`; }
}
