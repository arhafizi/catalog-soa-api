import { BadRequestException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCartCommand } from '../commands/create-cart.command';
import { CartItem } from '../entities/cart-item.entity';
import { CartSession } from '../entities/cart-session.entity';
import { CartUser } from '../entities/cart-user.entity';
import { CartRepository } from '../providers/cart.repository';
import { CatalogClientService } from '../providers/catalog-client.service';

@CommandHandler(CreateCartCommand)
export class CreateCartHandler
    implements ICommandHandler<CreateCartCommand, CartSession>
{
    constructor(
        private readonly cartRepo: CartRepository,
        private readonly catalogApi: CatalogClientService,
    ) {}

    async execute(command: CreateCartCommand): Promise<CartSession> {
        const { itemsIds, userEmail } = command;

        const existingCart = await this.cartRepo.cartExistsForUser(userEmail);
        if (existingCart) {
            throw new BadRequestException(
                'A cart already exists for this user email',
            );
        }
        let validIds = null;
        let cartItems = [];

        if (itemsIds?.length) {
            validIds = await this.catalogApi.validateItemIds(itemsIds);
            if (!validIds.length) {
                throw new BadRequestException('Invalid item IDs');
            }
            cartItems = validIds.map((id) => new CartItem(id, 1));
        }

        const cartUser = new CartUser(userEmail);

        const cartSession = new CartSession(
            '', // empty id (will be generated on repo)
            cartUser,
            new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            cartItems,
        );

        await this.cartRepo.addOrUpdate(cartSession);

        if (cartItems.length > 0) {
            const enrichedItems = await Promise.all(
                cartItems.map(async (item) => {
                    return await this.catalogApi.enrichCartItem(item);
                }),
            );
            cartSession.items = enrichedItems;
        }
        return cartSession;
    }
}
