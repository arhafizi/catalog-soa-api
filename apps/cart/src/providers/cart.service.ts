import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCartQuery } from '../commands/get-cart.query';
import { UpdateCartItemQuantityCommand } from '../commands/update-cart-item-quantity.command';
import { CreateCartCommand } from '../commands/create-cart.command';
import { CreateCartDto } from '../dto/create-cart.dto';

@Injectable()
export class CartService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
    ) {}

    async findone(id: string) {
        return await this.queryBus.execute(new GetCartQuery(id));
    }

    async updateQuantity(cartId: string, id: string, isAddOperation: boolean) {
        const result = await this.commandBus.execute(
            new UpdateCartItemQuantityCommand(cartId, id, isAddOperation),
        );
        return result;
    }

    async create(dto: CreateCartDto) {
        const result = await this.commandBus.execute(
            new CreateCartCommand(dto.itemsIds, dto.userEmail),
        );
        return {
            data: result,
            location: `/api/carts/${result.id}`,
        };
    }
}
