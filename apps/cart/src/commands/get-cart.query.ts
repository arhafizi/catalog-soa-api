import { IQuery } from '@nestjs/cqrs';

export class GetCartQuery implements IQuery {
    constructor(public readonly id: string) {}
}
