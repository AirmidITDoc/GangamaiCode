export interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string;
    ageYear: number;
    regNo: string;
    mobileNo: string;
    dateofBirth: string;
    gender: string;
    documentCount?: number;
    photoInitials:string;
}
