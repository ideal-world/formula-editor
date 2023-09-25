import { VarInfo } from '../processes/interface';
declare const _default: import("vue").DefineComponent<{
    materials: {
        type: import("vue").PropType<import("../processes/interface").Namespace[]>;
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
                kind: import("../processes/interface").VarKind;
                note: string;
                minLen: number;
                maxLen: number;
                cates: string[];
            } | {
                name: string;
                label: string;
                kind: import("../processes/interface").VarKind;
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
                    kind: import("../processes/interface").VarKind;
                }[];
                isVarLen: boolean;
                isAsync: boolean;
                output: {
                    kind: import("../processes/interface").VarKind;
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
                    kind: import("../processes/interface").VarKind;
                }[];
                isVarLen: boolean;
                isAsync: boolean;
                output: {
                    kind: import("../processes/interface").VarKind;
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
        type: import("vue").PropType<VarInfo>;
        required: true;
        default: () => {
            name: string;
            label: string;
            kind: import("../processes/interface").VarKind;
            note: string;
            minLen: number;
            maxLen: number;
        };
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:formulaValue"[], "update:formulaValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    materials: {
        type: import("vue").PropType<import("../processes/interface").Namespace[]>;
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
                kind: import("../processes/interface").VarKind;
                note: string;
                minLen: number;
                maxLen: number;
                cates: string[];
            } | {
                name: string;
                label: string;
                kind: import("../processes/interface").VarKind;
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
                    kind: import("../processes/interface").VarKind;
                }[];
                isVarLen: boolean;
                isAsync: boolean;
                output: {
                    kind: import("../processes/interface").VarKind;
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
                    kind: import("../processes/interface").VarKind;
                }[];
                isVarLen: boolean;
                isAsync: boolean;
                output: {
                    kind: import("../processes/interface").VarKind;
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
        type: import("vue").PropType<VarInfo>;
        required: true;
        default: () => {
            name: string;
            label: string;
            kind: import("../processes/interface").VarKind;
            note: string;
            minLen: number;
            maxLen: number;
        };
    };
}>> & {
    "onUpdate:formulaValue"?: ((...args: any[]) => any) | undefined;
}, {
    materials: import("../processes/interface").Namespace[];
    formulaValue: string;
    entrance: string | null;
    targetVar: VarInfo;
}, {}>;
export default _default;
