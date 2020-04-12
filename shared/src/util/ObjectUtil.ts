/* eslint @typescript-eslint/no-explicit-any: 0, no-prototype-builtins: 0 */
import Logger from "@shared/Logger";

const logger = new Logger("ObjectUtil.ts");

export function isNull(input: any): boolean {
    return input === null || input === undefined;
}

export function isBlank(input: string | null | undefined): boolean {
    if (!input || !input.trim()) {
        return true;
    }

    return false;
}

export function isNonEmptyObject(input: any): input is Record<string, any> {
    if (isNull(input)) {
        return false;
    }
    return typeof input === "object" && !Array.isArray(input) && Object.keys(input).length > 0;
}

export function hasIdField(input: any): input is { id: any; [key: string]: any } {
    return isNonEmptyObject(input) && input.hasOwnProperty("id") && (input.id ?? false);
}

export function isArray(input: any) {
    if (isNull(input)) {
        return false;
    }
    return Array.isArray(input);
}

export function isNotNull(input: any): boolean {
    return !isNull(input);
}

export function isDate(input: any): input is Date {
    return isNotNull(input) && input instanceof Date;
}

export function isString(input: any): input is string {
    try {
        return isNotNull(input) && typeof input === "string";
    } catch {
        return false;
    }
}

export function isNumber(input: any): input is number {
    try {
        const number = Number(input);
        return isNotNull(number) && typeof input === "number";
    } catch (error) {
        return false;
    }
}

/**
 * Transform object keys based on provided transform function.
 * This will delete undefined keys in objects
 * @param {any} input
 * @param {(value: any) => Promise<void>} transform
 * @param {number} depth how deep the transform can go before exiting
 * @param {string} [forKey] the key that is being transformed currently. Mostly for logging purposes.
 * @return {any}
 */
export function transformObject(_input: any, transform: (value: any) => any, depth = 0, forKey?: string): any {
    let input = _input;
    if (depth >= 100) {
        logger.warn(
            `transformObjectSync method reached a depth greater than 10, Current depth = ${depth}. Key = ${forKey ||
                "rootKey"} Returning witihout processing`
        );
        return input;
    }
    if (isArray(input)) {
        return input.map((entry: any) => transformObject(entry, transform, depth + 1, forKey || "root-Array"));
    }

    // input = await (transform(input))
    const rootTransform = transform(input);

    if (rootTransform !== input) {
        return rootTransform;
    }

    if (isNonEmptyObject(input)) {
        input = Object.assign({}, input);
        Object.keys(input).forEach(key => {
            let value = input[key];

            //TODO: find a more robust way to detect if the value is a Firebase.DocumentRef (or other firebase object) and skip processing it.
            if (key === "_fl_meta_") {
                return value;
            }

            const transformed = transform(value);

            //if the transformation did something, don't loop through the value
            if (value === transformed && (isNonEmptyObject(value) || Array.isArray(value))) {
                value = transformObject(value, transform, depth + 1, key);
            } else {
                value = transformed;
            }

            if (value === undefined) {
                delete input[key];
            } else {
                input[key] = value;
            }
        });
    }
    return input;
}

export function shuffleArray(array: Array<any>) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
