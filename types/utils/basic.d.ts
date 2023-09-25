export declare const groupBy: <T>(array: T[], predicate: (value: T, index: number, array: T[]) => string) => {
    [key: string]: T[];
};
