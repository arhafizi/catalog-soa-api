import { CartItem } from './cart-item.entity';
import { CartUser } from './cart-user.entity';

export class CartSession {
    constructor(
        public id: string,
        public user: CartUser,
        public validityDate: Date,
        public items: CartItem[] = [],
    ) {}

    addItem(item: CartItem) {
        this.items.push(item);
    }

    removeItem(cartItemId: string) {
        this.items = this.items.filter(
            (item) => item.cartItemId !== cartItemId,
        );
    }
}
