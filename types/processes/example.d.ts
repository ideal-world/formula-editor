import { VarKind } from './interface';
export declare const exampleProps: {
    targetVar: () => {
        name: string;
        label: string;
        kind: VarKind;
        note: string;
        minLen: number;
        maxLen: number;
    };
    materials: () => ({
        name: string;
        label: string;
        isVar: boolean;
        showLabel: boolean;
        color: string;
        items: ({
            name: string;
            label: string;
            kind: VarKind;
            note: string;
            minLen: number;
            maxLen: number;
            cates: string[];
        } | {
            name: string;
            label: string;
            kind: VarKind;
            cates: string[];
            note?: undefined;
            minLen?: undefined;
            maxLen?: undefined;
        })[];
    } | {
        name: string;
        label: string;
        isVar: boolean;
        showLabel: boolean;
        color: string;
        items: {
            name: string;
            label: string;
            note: string;
            input: {
                kind: VarKind;
            }[];
            isVarLen: boolean;
            isAsync: boolean;
            output: {
                kind: VarKind;
            };
            cates: string[];
        }[];
    } | {
        name: string;
        label: string;
        isVar: boolean;
        showLabel: boolean;
        color: string;
        items: {
            name: string;
            label: string;
            note: string;
            input: {
                label: string;
                kind: VarKind;
            }[];
            isVarLen: boolean;
            isAsync: boolean;
            output: {
                kind: VarKind;
            };
            cates: string[];
        }[];
    })[];
    formulaValue: string;
    entrance: string;
};
