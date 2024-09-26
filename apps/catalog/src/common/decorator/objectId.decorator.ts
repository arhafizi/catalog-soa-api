import {
    BadRequestException,
    createParamDecorator,
    ExecutionContext,
} from '@nestjs/common';
import { Types } from 'mongoose';

export const ParamObjId = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const param = data || 'id';
        const id = request.params[param];

        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid ObjectId');
        }

        return id;
    },
);
