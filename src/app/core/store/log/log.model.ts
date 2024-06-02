import { User } from '@core/models/user.model';

export interface LogState {
    logs: Log[];
    isBusy: boolean;
}

export interface Log {
    _id?: string;
    level: string;
    message: string;
    timestamp: Date;
    meta: {
        user?: User;
        module: string;
        function?: string;
        itemId?: string;
        error: any;
    };
}
