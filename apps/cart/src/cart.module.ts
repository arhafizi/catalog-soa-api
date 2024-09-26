import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CartController } from './cart.controller';
import { CartRepository } from './providers/cart.repository';
import { CartService } from './providers/cart.service';
import { CatalogClientService } from './providers/catalog-client.service';
import { CreateCartHandler } from './handlers/create-cart.handler';
import { GetCartHandler } from './handlers/get-cart.handler';
import { UpdateCartItemQuantityHandler } from './handlers/update-cart-item-quantity.handler';

@Module({
    imports: [CqrsModule.forRoot(), HttpModule],
    providers: [
        CatalogClientService,
        CartService,
        CartRepository, 
        CreateCartHandler,
        GetCartHandler,
        UpdateCartItemQuantityHandler,
    ],
    controllers: [CartController],
})
export class CartModule {}
