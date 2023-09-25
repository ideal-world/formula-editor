export declare enum VarKind {
    STRING = "\u5B57\u7B26\u4E32",
    NUMBER = "\u6570\u503C",
    BOOLEAN = "\u5E03\u5C14",
    NULL = "\u7A7A",
    STRINGS = "\u5B57\u7B26\u4E32\u6570\u7EC4",
    NUMBERS = "\u6570\u503C\u6570\u7EC4",
    BOOLEANS = "\u5E03\u5C14\u6570\u7EC4",
    ANY = "\u4EFB\u610F\u7C7B\u578B"
}
export interface EditorProps {
    targetVar: VarInfo;
    materials: Namespace[];
    formulaValue: string;
    entrance: string | null;
}
export interface Namespace {
    name: string;
    label: string;
    color?: string;
    isVar: boolean;
    showLabel: boolean;
    items: VarInfo[] | FunInfo[];
}
export interface VarGuard {
    kind: VarKind;
    minLen?: number;
    maxLen?: number;
    checkReg?: string;
    options?: [{
        value: any;
        label: string;
    }];
}
export interface VarInfo extends VarGuard {
    name?: string;
    label?: string;
    note?: string;
    cates?: string[];
    defaultValue?: any;
}
export interface FunInfo {
    name: string;
    label: string;
    note?: string;
    input: VarInfo[];
    isVarLen: boolean;
    isAsync: boolean;
    output: VarGuard;
    cates: string[];
}
