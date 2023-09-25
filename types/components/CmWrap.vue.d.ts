import { iwInterface } from '../processes';
declare const _default: import("vue").DefineComponent<{
    targetGuard: {
        type: import("vue").PropType<iwInterface.VarGuard>;
        required: true;
    };
    materials: {
        type: import("vue").PropType<iwInterface.Namespace[]>;
        required: true;
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
}, {
    insertMaterial: (namespace: string, name: string) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "update:formulaValue"[], "update:formulaValue", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    targetGuard: {
        type: import("vue").PropType<iwInterface.VarGuard>;
        required: true;
    };
    materials: {
        type: import("vue").PropType<iwInterface.Namespace[]>;
        required: true;
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
}>> & {
    "onUpdate:formulaValue"?: ((...args: any[]) => any) | undefined;
}, {
    formulaValue: string;
    entrance: string | null;
}, {}>;
export default _default;
