<template>
    <div>
        <h1>Cart</h1>

        <table v-if="cart.items.length > 0" class="table table-striped">
            <thead>
            <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
            </thead>

            <tbody>
            <tr v-for="item in cart.items" :key="item.id">
                <td>{{ item.product.name }}</td>
                <td>
                    {{ item.quantity }} &nbsp;
                    <button class="btn btn-success" @click="increaseQuantity(item)" :disabled="item.product.inStock == 0">+</button>
                    <button class="btn btn-danger" @click="decreaseQuantity(item)">-</button>
                </td>
                <td>{{ item.quantity * item.product.price | currency }}</td>
            </tr>

            <tr>
                <td class="text-right" colspan="2">
                    <strong>Subtotal</strong>
                </td>

                <td>{{ cartTotal | currency }}</td>
            </tr>

            <tr>
                <td class="text-right" colspan="2">
                    <strong>Taxes</strong>
                </td>

                <td>{{ taxAmount(10) | currency }}</td>
            </tr>

            <tr>
                <td class="text-right" colspan="2">
                    <strong>Coupon code</strong>
                </td>
                <td>
                    <input type="text" class="form-control" placeholder="Enter coupon code here" style="... " 
                            v-model="couponCode">
                </td>
            </tr>

            <tr>
                <td class="text-right" colspan="2">
                    <strong>Grand total</strong>
                </td>

                <td>{{ cartTotal + taxAmount(10) | currency }}</td>
            </tr>

            <tr>
                <td class="text-right" colspan="2">
                    <span v-if="couponCode">
                        <em>Lucky you! You have entered the following coupon code: {{ couponCode }} </em>
                    </span>
                </td>
                <td><button class="btn btn-success" @click="checkout">Checkout</button></td>
            </tr>
            </tbody>
        </table>

        <p v-else>Your cart is currently empty.</p>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex';
    import { mapMutations } from 'vuex';
    import { CHECKOUT, UPDATE_COUPON_CODE } from './mutation-types';

    export default {
        computed: {
            ...mapGetters([
                'cartTotal',
                'taxAmount'
            ]),
            cart() {
                return this.$store.state.cart;
            },
            couponCode: {
                get() {
                    return this.$store.state.couponCode;
                },
                set(value) {
                    this.$store.commit(UPDATE_COUPON_CODE, value);
                }
            }
        },
        // TODO: Access cart items, cart total, and tax amount

        // TODO: Implement increaseQuantity method

        // TODO: Implement decreaseQuantity method

        // TODO: Implement checkout method

        beforeRouteLeave(to, from, next) {
            if (this.cart.items.length > 0) {
                if (!confirm('Are you sure you don\'t want to buy these amazing products?')) {
                    return next(false);
                }
            }

            next();
        },
        methods: {
            /*checkout() {
                if (confirm('Are you sure that you want to purchase these awesome products?')) {
                    this.$store.commit('checkout');
                }
            }*/
            ...mapMutations([
                CHECKOUT
            ])
        }
    }
</script>