import { HttpService } from '@nestjs/axios';
import {
    BadRequestException,
    Injectable,
    RequestTimeoutException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CatalogClientService {
    constructor(private readonly axios: HttpService) {}

    async enrichCartItem(cartItem: CartItem): Promise<CartItem> {
        try {
            const url = `http://catalog:3000/api/items/${cartItem.cartItemId}`;
            const response = await firstValueFrom(this.axios.get(url));
            const itemData = response.data;

            cartItem.name = itemData.name;
            cartItem.description = itemData.description;
            cartItem.labelName = itemData.labelName;
            cartItem.pictureUri = itemData.pictureUri;
            cartItem.price = itemData.price;
            cartItem.artistName = itemData.artist?.name;
            cartItem.genreName = itemData.genre?.name;

            return cartItem;
        } catch (error) {
            if (error.response) {
                throw new BadRequestException(
                    `Catalog service error: ${error.response.data?.message || 'Unknown error'}`,
                );
            }
            throw new RequestTimeoutException(
                'Unable to enrich cart item at this time',
            );
        }
    }

    async validateItemIds(itemIds: string[]): Promise<string[]> {
        try {
            const response = await firstValueFrom(
                this.axios.post('http://catalog:3000/api/items/validate', {
                    itemIds,
                }),
            );
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new BadRequestException(
                    `Catalog service error: ${error.response.data?.message || 'Unknown error'}`,
                );
            }
            throw new BadRequestException(
                'Unable to validate item IDs at this time',
            );
        }
    }
}
