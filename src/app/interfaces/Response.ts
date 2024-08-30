// To parse this data:
//
//   import { Convert, Res } from "./file";
//
//   const res = Convert.toRes(json);

export interface Res {
    error: boolean;
    data:  any;
    code:  number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toRes(json: string): Res {
        return JSON.parse(json);
    }

    public static resToJson(value: Res): string {
        return JSON.stringify(value);
    }
}
