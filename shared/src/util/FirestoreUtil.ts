/* eslint @typescript-eslint/no-explicit-any: 0, no-prototype-builtins: 0 */
import { isDate, isNotNull, transformObject } from "@shared/util/ObjectUtil";
import { BaseModel, FirestoreData } from "@shared/models/Model";

export interface TimestampInterface {
    fromMillis<T extends TimestampInterface>(milliseconds: number): T;

    fromDate(date: Date): TimestampInterface;

    now(): TimestampInterface;

    seconds: number;
    nanoseconds: number;

    toDate(): Date;

    toMillis(): number;

    isEqual(other: TimestampInterface): boolean;
}

export interface SnapshotOptions {
    readonly serverTimestamps?: "estimate" | "previous" | "none";
}

export interface DocumentSnapshot {
    data(options?: SnapshotOptions): Record<string, any> | undefined;

    readonly id: string;
    readonly exists: boolean;
}

let TimestampClass: TimestampInterface | any;

export function initialize(params: { timestamp: any }) {
    const { timestamp } = params;
    TimestampClass = timestamp;
}

export function isTimestamp(value: any): boolean {
    return isNotNull(value) && (value instanceof TimestampClass || (value.seconds && value.nanoseconds));
}

export function timestampToDate(timestamp: any): Date | undefined {
    if (isTimestamp(timestamp)) {
        if (timestamp.toDate) {
            return timestamp.toDate();
        } else if (timestamp.hasOwnProperty("seconds") && timestamp.hasOwnProperty("nanoseconds")) {
            return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
        }
    }
    return;
}

export function toFirestoreData<T extends BaseModel>(input: T): FirestoreData {
    const copy = Object.assign({}, input);

    return transformObject(copy, value => {
        if (isDate(value)) {
            return TimestampClass.fromDate(value);
        }
        return value;
    });
}

export function convertDateToJSON(input: any): any {
    const copy = Object.assign({}, input);

    return transformObject(copy, value => {
        if (isDate(value)) {
            return value.getTime();
        }
        return value;
    });
}

export function convertTimestampToDate(input: any): any {
    const copy = Object.assign({}, input);

    return transformObject(copy, value => {
        if (isTimestamp(value)) {
            return timestampToDate(value);
        }

        return value;
    });
}

export function fromFirestoreData<T extends BaseModel>(data: any, Type: { new (): T }): T {
    const transformed = convertTimestampToDate(data);

    const model = new Type();
    const t = Object.assign(model, transformed) as T;
    t.prepareFromFirestore(data);

    return t;
}
