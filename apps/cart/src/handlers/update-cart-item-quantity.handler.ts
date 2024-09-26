import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import { UpdateCartItemQuantityCommand } from '../commands/update-cart-item-quantity.command';
import { CartItem } from '../entities/cart-item.entity';
import { CartSession } from '../entities/cart-session.entity';
import { CartRepository } from '../providers/cart.repository';
import { CatalogClientService } from '../providers/catalog-client.service';

@CommandHandler(UpdateCartItemQuantityCommand)
export class UpdateCartItemQuantityHandler
    implements ICommandHandler<UpdateCartItemQuantityCommand, CartSession>
{
    constructor(
        private readonly cartRepo: CartRepository,
        private readonly catalogApi: CatalogClientService,
    ) {}

    async execute(
        command: UpdateCartItemQuantityCommand,
    ): Promise<CartSession> {
        const { cartId, cartItemId, isAddOperation } = command;

        const validIds = await this.catalogApi.validateItemIds([cartItemId]);

        if (!Types.ObjectId.isValid(cartItemId) || !validIds.length) {
            throw new BadRequestException('Invalid item ID');
        }

        const cartSession = await this.cartRepo.getCart(cartId);
        if (!cartSession) {
            throw new BadRequestException('Cart not found');
        }

        cartSession.items = cartSession.items.map((item) =>
            Object.assign(new CartItem(item.cartItemId, item.quantity), item),
        );

        const cartItem = cartSession.items.find(
            (item) => item.cartItemId === cartItemId,
        );

        if (isAddOperation) {
            if (cartItem) {
                cartItem.increaseQuantity();
            } else {
                cartSession.items.push(new CartItem(cartItemId, 1));
            }
        } else {
            if (!cartItem) {
                throw new BadRequestException('Item not found in cart');
            }
            cartItem.decreaseQuantity();
        }

        cartSession.items = cartSession.items.filter(
            (item) => item.quantity > 0,
        );

        await this.cartRepo.addOrUpdate(cartSession);

        const enrichedItems = await Promise.all(
            cartSession.items.map(async (item) => {
                return await this.catalogApi.enrichCartItem(item);
            }),
        );

        cartSession.items = enrichedItems;
        return cartSession;
    }
}
