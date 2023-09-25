import { App } from 'vue';
declare const _default: (app: App) => void;
export default _default;
export declare const IwEditorComp: import("vue").VueElementConstructor<Readonly<import("vue").ExtractPropTypes<{
    materials: {
        type: import("vue").PropType<import("./processes/interface").Namespace[]>;
        required: true;
        default: () => ({
            name: string;
            label: string;
            isVar: boolean;
            showLabel: boolean;
            color: string;
            items: ({
                name: string;
                label: string;
                kind: import("./processes/interface").VarKind;
                note: string;
                minLen: number;
                maxLen: number;
                cates: string[];
            } | {
                name: string;
                label: string;
                kind: import("./processes/interface").VarKind;
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
                    kind: import("./processes/interface").VarKind;
                }[];
                isVarLen: boolean;
                isAsync: boolean;
                output: {
                    kind: import("./processes/interface").VarKind;
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
                    kind: import("./processes/interface").VarKind;
                }[];
                isVarLen: boolean;
                isAsync: boolean;
                output: {
                    kind: import("./processes/interface").VarKind;
                };
                cates: string[];
            }[];
        })[];
    };
    formulaValue: {
        type: import("vue").PropType<string>;
        required: true;
        default: string;
    };
    entrance: {
        type: import("vue").PropType<string | null>;
        required: true;
        default: string;
    };
    targetVar: {
        type: import("vue").PropType<import("./processes/interface").VarInfo>;
        required: true;
        default: () => {
            name: string;
            label: string;
            kind: import("./processes/interface").VarKind;
            note: string;
            minLen: number;
            maxLen: number;
        };
    };
}>> & {
    "onUpdate:formulaValue"?: ((...args: any[]) => any) | undefined;
}>;
declare module 'vue' {
    interface GlobalComponents {
        'IwEditor': typeof IwEditorComp;
    }
}
export * from './processes';
