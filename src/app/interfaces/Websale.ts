// To parse this data:
//
//   import { Convert, Websale } from "./file";
//
//   const websale = Convert.toWebsale(json);


export interface Websale {
    id:             number;
    seller:         string;
    number:         number;
    request_number: null | string;
    client:         string;
    register_date:  Date;
    payment_date:   Date | null;
    total:          number;
    guide:          null | string;
    note:           string;
    id_status:      number | null;
    status:         string | null;
    payment_status: string | null;
    payment_info: string | null;
    comment:        null | string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toWebsale(json: string): Websale {
        return JSON.parse(json);
    }

    public static websaleToJson(value: Websale): string {
        return JSON.stringify(value);
    }
}
