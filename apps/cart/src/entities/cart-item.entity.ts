export class CartItem {
    constructor(
        public cartItemId: string,
        public quantity: number,
        public name?: string,
        public description?: string,
        public labelName?: string,
        public pictureUri?: string,
        public price?: { amount: number; currency: string },
        public artistName?: string,
        public genreName?: string,
    ) {}

    increaseQuantity() {
        this.quantity++;
    }

    decreaseQuantity() {
        this.quantity--;
    }
}
