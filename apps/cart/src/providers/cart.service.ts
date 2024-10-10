import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetCartQuery } from '../commands/get-cart.query';
import { UpdateCartItemQuantityCommand } from '../commands/update-cart-item-quantity.command';
import { CreateCartCommand } from '../commands/create-cart.command';
import { CreateCartDto } from '../dto/create-cart.dto';
import { CartRepository } from './cart.repository';

@Injectable()
export class CartService {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly queryBus: QueryBus,
        private readonly cartRepo: CartRepository,
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

    async removeSoldedItem(id: string) {
        console.log(`Item sold out: ${id}`);

        const cartIds = await this.cartRepo.getCarts();

        for (const cartId of cartIds) {
            const cart = await this.cartRepo.getCart(cartId);
            if (cart) {
                cart.items = cart.items.filter(
                    (item) => item.cartItemId !== id,
                );
                await this.cartRepo.addOrUpdate(cart);
            }
        }

        console.log(`Item ${id} has been removed from all carts`);
    }
}
