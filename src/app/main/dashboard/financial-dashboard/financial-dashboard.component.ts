import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

type WardHeadCountRow = {
  wardName: string;
  occupancyPct: number;
  patients: number;
};

type ServiceAmountRow = {
  serviceName: string;
  ip: number;
  op: number;
};

type OpVisitRow = {
  typeOfVisit: string;
  patients: number;
};

type PatientTypeRow = {
  typeOfPatient: string;
  ip: number;
  op: number;
};

type ReferralRow = {
  referredBy: string;
  ipPatients: number;
  opPatients: number;
};

type ReceiptSummaryRow = {
  label: string;
  amount: number;
};

type ModeSummaryRow = {
  label: string;
  amount: number;
};

type CollectionRow = {
  mode: string;
  amount: number;
};

type ConsultantChargeRow = {
  consultantName: string;
  patients: number;
  charges: number;
};

type PackageDetailRow = {
  packageName: string;
  patients: number;
};

@Component({
  selector: 'app-financial-dashboard',
  templateUrl: './financial-dashboard.component.html',
  styleUrls: ['./financial-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FinancialDashboardComponent {
  fromDate: Date = new Date(2026, 0, 27);
  toDate: Date = new Date(2026, 0, 27);

  wardHeadCountColumns: string[] = ['wardName', 'occupancyPct', 'patients'];
  wardHeadCount: WardHeadCountRow[] = [
    { wardName: 'A/C', occupancyPct: 25, patients: 2 },
    { wardName: 'NON A/C', occupancyPct: 0, patients: 0 },
    { wardName: 'GENERAL', occupancyPct: 0, patients: 0 },
  ];

  chargesColumns: string[] = ['serviceName', 'ip', 'op'];
  charges: ServiceAmountRow[] = [
    { serviceName: 'Consulting', ip: 0, op: 1825 },
    { serviceName: 'Pharmacy', ip: 5319, op: 33249 },
    { serviceName: 'Radiology', ip: 0, op: 1800 },
    { serviceName: 'Registration', ip: 0, op: 250 },
    { serviceName: 'Physiotherapy', ip: 0, op: 950 },
    { serviceName: 'MISCELLANEOUS', ip: 0, op: 950 },
    { serviceName: 'Procedures', ip: 0, op: 350 },
    { serviceName: 'CBG', ip: 0, op: 50 },
    { serviceName: 'DOCTOR CONTRIBUTION', ip: 0, op: 1300 },
  ];
  chargesDiscountIp = 0;
  chargesDiscountOp = 0;

  receiptsColumns: string[] = ['serviceName', 'ip', 'op'];
  receipts: ServiceAmountRow[] = [
    { serviceName: 'Consulting', ip: 0, op: 1825 },
    { serviceName: 'Pharmacy', ip: 0, op: 32303 },
    { serviceName: 'Radiology', ip: 0, op: 1800 },
    { serviceName: 'Registration', ip: 0, op: 250 },
    { serviceName: 'Physiotherapy', ip: 0, op: 950 },
    { serviceName: 'MISCELLANEOUS', ip: 0, op: 950 },
    { serviceName: 'Procedures', ip: 0, op: 350 },
    { serviceName: 'CBG', ip: 0, op: 50 },
    { serviceName: 'DOCTOR CONTRIBUTION', ip: 0, op: 1300 },
  ];
  receiptsDiscountIp = 0;
  receiptsDiscountOp = 0;

  opVisitColumns: string[] = ['typeOfVisit', 'patients'];
  opVisits: OpVisitRow[] = [
    { typeOfVisit: 'OUT PATIENT', patients: 41 },
    { typeOfVisit: 'POS PHARMACY', patients: 51 },
    { typeOfVisit: 'PHYSIOTHERAPY', patients: 4 },
    { typeOfVisit: 'NURSE SERVICE', patients: 17 },
    { typeOfVisit: 'DOCTOR CONTRIBUTION', patients: 3 },
  ];

  patientTypeColumns: string[] = ['typeOfPatient', 'ip', 'op'];
  patientTypes: PatientTypeRow[] = [
    { typeOfPatient: 'New', ip: 0, op: 8 },
    { typeOfPatient: 'Existing', ip: 0, op: 54 },
  ];

  referralColumns: string[] = ['referredBy', 'ipPatients', 'opPatients'];
  referrals: ReferralRow[] = [{ referredBy: 'Direct', ipPatients: 0, opPatients: 62 }];

  receiptSummary: ReceiptSummaryRow[] = [
    { label: 'Receipt', amount: 42248 },
    { label: 'Advance', amount: 0 },
    { label: 'Return', amount: 0 },
    { label: 'Refund', amount: 0 },
  ];

  modeSummary: ModeSummaryRow[] = [
    { label: 'Cash', amount: 12289 },
    { label: 'Card', amount: 29959 },
  ];

  collection: CollectionRow[] = [
    { mode: 'Cash', amount: 12289 },
    { mode: 'Cheque', amount: 0 },
    { mode: 'Card', amount: 29959 },
    { mode: 'EFT', amount: 0 },
    { mode: 'ECS', amount: 0 },
  ];

  consultantChargeColumns: string[] = ['consultantName', 'patients', 'charges'];
  consultantCharges: ConsultantChargeRow[] = [
    { consultantName: 'PARI', patients: 5, charges: 2000 },
    { consultantName: 'TAMILVANAN S', patients: 19, charges: 6650 },
    { consultantName: 'CHAKRABORTY A P', patients: 5, charges: 1750 },
    { consultantName: 'PROF S N MOHITHLAL', patients: 3, charges: 900 },
    { consultantName: 'KAVIMANI', patients: 1, charges: 125 },
    { consultantName: 'ARCHANA G', patients: 8, charges: 1000 },
  ];

  packageColumns: string[] = ['packageName', 'patients'];
  packages: PackageDetailRow[] = [];

  onGo(): void {
    // Dummy for now; later this will call the API based on fromDate/toDate.
  }

  get wardTotalPatients(): number {
    return this.wardHeadCount.reduce((sum, r) => sum + r.patients, 0);
  }

  get chargesTotalIp(): number {
    return this.charges.reduce((sum, r) => sum + (r.ip || 0), 0);
  }
  get chargesTotalOp(): number {
    return this.charges.reduce((sum, r) => sum + (r.op || 0), 0);
  }
  get chargesNetIp(): number {
    return this.chargesTotalIp - (this.chargesDiscountIp || 0);
  }
  get chargesNetOp(): number {
    return this.chargesTotalOp - (this.chargesDiscountOp || 0);
  }

  get receiptsTotalIp(): number {
    return this.receipts.reduce((sum, r) => sum + (r.ip || 0), 0);
  }
  get receiptsTotalOp(): number {
    return this.receipts.reduce((sum, r) => sum + (r.op || 0), 0);
  }
  get receiptsNetIp(): number {
    return this.receiptsTotalIp - (this.receiptsDiscountIp || 0);
  }
  get receiptsNetOp(): number {
    return this.receiptsTotalOp - (this.receiptsDiscountOp || 0);
  }

  get opTotalPatients(): number {
    return this.opVisits.reduce((sum, r) => sum + r.patients, 0);
  }

  get billingTotalCharges(): number {
    return this.receiptSummaryTotal;
  }

  get receiptSummaryTotal(): number {
    return this.receiptSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  get modeSummaryTotal(): number {
    return this.modeSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
  }

  get collectionTotal(): number {
    return this.collection.reduce((sum, r) => sum + (r.amount || 0), 0);
  }
}
