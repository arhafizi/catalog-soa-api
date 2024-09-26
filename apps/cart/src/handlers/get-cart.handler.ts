import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCartQuery } from '../commands/get-cart.query';
import { CartSession } from '../entities/cart-session.entity';
import { CartRepository } from '../providers/cart.repository';
import { CatalogClientService } from '../providers/catalog-client.service';

@QueryHandler(GetCartQuery)
export class GetCartHandler
    implements IQueryHandler<GetCartQuery, CartSession>
{
    constructor(
        private readonly cartRepo: CartRepository,
        private readonly catalogApi: CatalogClientService,
    ) {}

    async execute(query: GetCartQuery): Promise<CartSession> {
        const { id } = query;
        const cartSession = await this.cartRepo.getCart(id);

        if (!cartSession) {
            throw new NotFoundException('Cart not found');
        }

        const enrichedItems = await Promise.all(
            cartSession.items.map(async (item) => {
                return await this.catalogApi.enrichCartItem(item);
            }),
        );

        cartSession.items = enrichedItems;
        return cartSession;
    }
}
