import { Option } from '../types';

export interface Data {
    config: {
        disabled: boolean;
        options: any[];
    };
    rules: any[];
    value: number | string | undefined;
    staticOptions: Option[];
}
