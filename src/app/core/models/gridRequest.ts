export class gridRequest {
    first: number = 0;
    rows: number = 10;
    sortField: string = "";
    sortOrder: number = 0;
    filters: gridFilter[] = [];
    columns: [] = [];
    exportType: gridResponseType = gridResponseType.JSON;
}

export class gridRequest1 {
    first: number = 0;
    rows: number = 10;
     mode: string = "";
    sortOrder: number = 0;
    searchFields: gridFilter[] = [];
    columns: [] = [];
    exportType: gridResponseType = gridResponseType.JSON;
}


export class gridFilter {
    fieldName: string = "";
    fieldValue: string = "";
    opType: OperatorComparer = OperatorComparer.Equals;
}
export enum gridResponseType {
    JSON = 1, Excel = 2, Pdf = 3
}
export class gridModel {
    columnsList: any[] = [];
    apiUrl: string = "";
    sortField: string = "";
    sortOrder: number = 0;
    filters: gridFilter[] = [];
    row?: number = 10;
}

export class gridModel1 {
    columnsList: any[] = [];
    apiUrl: string = "";
    mode: string = "";
    sortOrder: number = 0;
    searchFields: gridFilter[] = [];
    sortField: string = "";
    row?: number = 25;
}


export enum OperatorComparer {
    Contains='Contains',
    StartsWith='StartsWith',
    EndsWith='EndsWith',
    Equals='Equals',
    GreaterThan='GreaterThan',
    GreaterThanOrEqual='GreaterThanOrEqual',
    LessThan='LessThan',
    LessThanOrEqual='LessThanOrEqual',
    NotEqual='NotEqual',
    InClause='InClause',
    DateRange='DateRange'
}
export enum Color{
    RED = 'red-200-bg',
    BLUE = 'blue-200-bg',
    GREEN = 'green-200-bg',
    YELLOW = 'yellow-200-bg',
}