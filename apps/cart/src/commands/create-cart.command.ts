import { ICommand } from '@nestjs/cqrs';

export class CreateCartCommand implements ICommand {
    constructor(
        public readonly itemsIds: string[],
        public readonly userEmail: string,
    ) {}
}
