import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';

/* ─── Interfaces ─── */
interface WardRow {
  roomName: string;
  occupancyPercent: number;
  occupiedBeds: number;
}

interface ServiceRow {
  serviceName: string;
  ipAmount: number;
  opAmount: number;
}

interface ReceiptRow {
  serviceName: string;
  ipAmount: number;
  opAmount: number;
}

interface OpVisitRow {
  typeOfVisit: string;
  patientCount: number;
}

interface PatientTypeRow {
  typeOfPatient: string;
  ip: number;
  op: number;
}

interface ReferralRow {
  referredBy: string;
  ipPatients: number;
  opPatients: number;
}

interface ReceiptSummaryRow {
  label: string;
  amount: number;
}

interface ModeSummaryRow {
  label: string;
  amount: number;
}

interface CollectionRow {
  mode: string;
  amount: number;
}

interface ConsultantRow {
  consultantName: string;
  patients: number;
  charges: number;
}

interface PackageRow {
  packageName: string;
  patients: number;
}

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FinancialDashboardComponent implements OnInit {

  fromDate: Date = new Date();
  toDate: Date = new Date();

  /* ─── Patient Head Count ─── */
  wardHeadCount = new MatTableDataSource<WardRow>();
  wardHeadCountColumns: string[] = ['wardName', 'occupancyPct', 'patients'];

  /* ─── Charges ─── */
  charges = new MatTableDataSource<ServiceRow>();
  chargesColumns: string[] = ['serviceName', 'ip', 'op'];

  /* ─── Receipts ─── */
  receipts = new MatTableDataSource<ReceiptRow>();
  receiptsColumns: string[] = ['serviceName', 'ip', 'op'];

  /* ─── OP Visit Types ─── */
  opVisits = new MatTableDataSource<OpVisitRow>();
  opVisitColumns: string[] = ['typeOfVisit', 'patients'];

  /* ─── Patient Types ─── */
  patientTypes: PatientTypeRow[] = [];
  patientTypeColumns: string[] = ['typeOfPatient', 'ip', 'op'];

  /* ─── Referral List ─── */
  referrals = new MatTableDataSource<ReferralRow>();
  referralColumns: string[] = ['referredBy', 'ipPatients', 'opPatients'];

  /* ─── Billing Summary ─── */
  receiptSummary: ReceiptSummaryRow[] = [];
  modeSummary: ModeSummaryRow[] = [];
  collection: CollectionRow[] = [];

  /* ─── Consultant Charges ─── */
  consultantCharges = new MatTableDataSource<ConsultantRow>();
  consultantChargeColumns: string[] = ['consultantName', 'patients', 'charges'];

  /* ─── Package Details ─── */
  packages = new MatTableDataSource<PackageRow>();
  packageColumns: string[] = ['packageName', 'patients'];

  ngOnInit(): void {
    this.loadDummyData();
  }

  onGo(): void {
    // Will call API later based on fromDate/toDate
    this.loadDummyData();
  }

  /* ──────────── Computed Totals ──────────── */

  get wardTotalPatients(): number {
    return this.wardHeadCount.data.reduce((sum, r) => sum + r.occupiedBeds, 0);
  }

  get chargesTotalIp(): number {
    return this.charges.data.reduce((sum, r) => sum + (r.ipAmount || 0), 0);
  }
  get chargesTotalOp(): number {
    return this.charges.data.reduce((sum, r) => sum + (r.opAmount || 0), 0);
  }
  chargesDiscountIp = 0;
  chargesDiscountOp = 0;
  get chargesNetIp(): number {
    return this.chargesTotalIp - this.chargesDiscountIp;
  }
  get chargesNetOp(): number {
    return this.chargesTotalOp - this.chargesDiscountOp;
  }

  get receiptsTotalIp(): number {
    return this.receipts.data.reduce((sum, r) => sum + (r.ipAmount || 0), 0);
  }
  get receiptsTotalOp(): number {
    return this.receipts.data.reduce((sum, r) => sum + (r.opAmount || 0), 0);
  }
  receiptsDiscountIp = 0;
  receiptsDiscountOp = 0;
  get receiptsNetIp(): number {
    return this.receiptsTotalIp - this.receiptsDiscountIp;
  }
  get receiptsNetOp(): number {
    return this.receiptsTotalOp - this.receiptsDiscountOp;
  }

  get opTotalPatients(): number {
    return this.opVisits.data.reduce((sum, r) => sum + r.patientCount, 0);
  }

  get billingTotalCharges(): number {
    return this.receiptSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  get receiptSummaryNet(): number {
    return this.receiptSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  get modeSummaryNet(): number {
    return this.modeSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  get collectionTotal(): number {
    return this.collection.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  /* ──────────── Dummy Data ──────────── */
  private loadDummyData(): void {

    // Ward Head Count
    this.wardHeadCount.data = [
      { roomName: 'A/C', occupancyPercent: 25, occupiedBeds: 2 },
      { roomName: 'NON A/C', occupancyPercent: 0, occupiedBeds: 0 },
      { roomName: 'GENERAL', occupancyPercent: 0, occupiedBeds: 0 },
    ];

    // Charges
    this.charges.data = [
      { serviceName: 'Consulting', ipAmount: 0, opAmount: 1825 },
      { serviceName: 'Pharmacy', ipAmount: 5319, opAmount: 33249 },
      { serviceName: 'Radiology', ipAmount: 0, opAmount: 1800 },
      { serviceName: 'Registration', ipAmount: 0, opAmount: 250 },
      { serviceName: 'Physiotherapy', ipAmount: 0, opAmount: 950 },
      { serviceName: 'MISCELLANEOUS', ipAmount: 0, opAmount: 950 },
      { serviceName: 'Procedures', ipAmount: 0, opAmount: 350 },
      { serviceName: 'CBG', ipAmount: 0, opAmount: 50 },
      { serviceName: 'DOCTOR CONTRIB..', ipAmount: 0, opAmount: 1300 },
    ];
    this.chargesDiscountIp = 0;
    this.chargesDiscountOp = 0;

    // Receipts
    this.receipts.data = [
      { serviceName: 'Consulting', ipAmount: 0, opAmount: 1825 },
      { serviceName: 'Pharmacy', ipAmount: 0, opAmount: 32303 },
      { serviceName: 'Radiology', ipAmount: 0, opAmount: 1800 },
      { serviceName: 'Registration', ipAmount: 0, opAmount: 250 },
      { serviceName: 'Physiotherapy', ipAmount: 0, opAmount: 950 },
      { serviceName: 'MISCELLANEOUS', ipAmount: 0, opAmount: 950 },
      { serviceName: 'Procedures', ipAmount: 0, opAmount: 350 },
      { serviceName: 'CBG', ipAmount: 0, opAmount: 50 },
      { serviceName: 'DOCTOR CONTRIB..', ipAmount: 0, opAmount: 1300 },
    ];
    this.receiptsDiscountIp = 0;
    this.receiptsDiscountOp = 0;

    // OP Visit Types
    this.opVisits.data = [
      { typeOfVisit: 'OUT PATIENT', patientCount: 41 },
      { typeOfVisit: 'POS PHARMACY', patientCount: 51 },
      { typeOfVisit: 'PHYSIOTHERAPY', patientCount: 4 },
      { typeOfVisit: 'NURSE SERVICE', patientCount: 17 },
      { typeOfVisit: 'DOCTOR CONTRIBUTION', patientCount: 3 },
    ];

    // Patient Types
    this.patientTypes = [
      { typeOfPatient: 'New', ip: 0, op: 8 },
      { typeOfPatient: 'Existing', ip: 0, op: 54 },
    ];

    // Referral List
    this.referrals.data = [
      { referredBy: 'Direct', ipPatients: 0, opPatients: 62 },
    ];

    // Receipt Summary
    this.receiptSummary = [
      { label: 'Receipt', amount: 42248 },
      { label: 'Advance', amount: 0 },
      { label: 'Return', amount: 0 },
      { label: 'Refund', amount: 0 },
    ];

    // Mode Summary
    this.modeSummary = [
      { label: 'Cash', amount: 12289 },
      { label: 'Card', amount: 29959 },
    ];

    // Collection
    this.collection = [
      { mode: 'Cash', amount: 12289 },
      { mode: 'Cheque', amount: 0 },
      { mode: 'Card', amount: 29959 },
      { mode: 'EFT', amount: 0 },
      { mode: 'ECS', amount: 0 },
    ];

    // Consultant Charges
    this.consultantCharges.data = [
      { consultantName: 'PARI', patients: 5, charges: 2000 },
      { consultantName: 'TAMILVANAN S', patients: 19, charges: 6650 },
      { consultantName: 'CHAKRABORTY A P', patients: 5, charges: 1750 },
      { consultantName: 'PROF S N MOTHILAL', patients: 3, charges: 900 },
      { consultantName: 'KAVIMANI', patients: 1, charges: 125 },
      { consultantName: 'ARCHANA G', patients: 8, charges: 1000 },
    ];

    // Package Details (empty - No data)
    this.packages.data = [];
  }
}
