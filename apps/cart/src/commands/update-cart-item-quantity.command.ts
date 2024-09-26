import { ICommand } from '@nestjs/cqrs';

export class UpdateCartItemQuantityCommand implements ICommand {
    constructor(
        public readonly cartId: string,
        public readonly cartItemId: string,
        public readonly isAddOperation: boolean,
    ) {}
}
