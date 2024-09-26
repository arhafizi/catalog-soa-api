import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { CartService } from './providers/cart.service';

@Controller('api/carts')
export class CartController {
    constructor(private readonly service: CartService) {}

    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.service.findone(id);
    }

    @Post()
    async create(@Body() dto: CreateCartDto) {
        return this.service.create(dto);
    }

    @Patch(':cartId/items/:id')
    async add(
        @Param('cartId', ParseUUIDPipe) cartId: string,
        @Param('id') id: string,
    ) {
        return this.service.updateQuantity(cartId, id, true);
    }

    @Delete(':cartId/items/:id')
    async delete(
        @Param('cartId', ParseUUIDPipe) cartId: string,
        @Param('id') id: string,
    ) {
        return this.service.updateQuantity(cartId, id, false);
    }
}
