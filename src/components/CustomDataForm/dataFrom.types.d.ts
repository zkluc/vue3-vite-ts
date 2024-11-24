type IFromType =
    | 'input'
    | 'textarea'
    | 'select'
    | 'radio'
    | 'password'
    | 'checkbox'
    | 'checkboxGroup'
    | 'markdown'
    | 'datePicker'
    | 'editor'
    | 'tinyEditor'
    | 'UEditor'
    | 'switch'
    | 'tree'
    | 'treeSelect'
    | 'inputNumber'
    | 'checkAccount'
    | 'appendInputBtn'
    | 'employeeId'
    | 'targetOwnerAccount'
    | 'textClick'
    | 'upload'
    | 'custom';

declare interface IRadios {
    name: string;
    label: string | number | boolean;
    disabled?: boolean;
}

declare interface IOption {
    id: string | number | boolean | symbol;
    label: string | number;
    disabled?: boolean;
}
declare interface IFromItem {
    label: string;
    prop: string;
    span?: number;
    type?: IFromType;
    height?: number | string;
    width?: number | string;
    rows?: number;
    tipMessage?: string;
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    rules?: any[];
    placeholder?: any;
    optionList?: IOption[];
    radios?: IRadios[];
    slotName?: string;
    // 针对特殊自定义的属性
    [prop: string]: any;
}