import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import App from './App.vue';
import { routes } from './routes';
import { ADD_PRODUCT_TO_CART, CHECKOUT, INCREASE_PRODUCT_QUANTITY, UPDATE_COUPON_CODE } from './mutation-types';

Vue.filter('currency', function(value) {
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
    });
    
    return formatter.format(value);
});

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);

const store = new Vuex.Store({
    state: {
        cart: {
            items: []
        },
        couponCode: ''
    },
    mutations: {
        [CHECKOUT] (state) {
            state.cart.items.forEach(function(item) {
                item.product.inStock += item.quantity;
            });
            state.cart.items = [];
        },
        [ADD_PRODUCT_TO_CART] (state, payLoad) {

            //TODO: Verify that there is "quantity" of product in stock before adding it.
            state.cart.items.push({
                product: payLoad.product,
                quantity: payLoad.quantity
            });
            payLoad.product.inStock -= payLoad.quantity;
            
        },
        [INCREASE_PRODUCT_QUANTITY] (state, payLoad) {
            payLoad.cartItem.quantity += payLoad.quantity;
            payLoad.product.inStock -= payLoad.quantity;
        },
        [UPDATE_COUPON_CODE] (state, payLoad) {
            state.couponCode = payLoad;
        }
    },
    actions: {
        [ADD_PRODUCT_TO_CART] ({commit, getters}, payLoad) {
            /*let requestUrl = 'http://localhost:3000/cart/add/{productId}/{quantity}';
            Vue.http.post(requestUrl, {}, {
                params: {
                    productId: payLoad.product.id,
                    quantity: payLoad.quantity 
                }
            }).then(
                response => context.commit(ADD_PRODUCT_TO_CART, payLoad),
                response => alert("Could not add product to cart")
            );*/
            let cartItem = getters.getCartItem(payLoad.product);
            payLoad.cartItem = cartItem;
            if (cartItem == null) {
                commit(ADD_PRODUCT_TO_CART, payLoad);
            }else{
                commit(INCREASE_PRODUCT_QUANTITY, payLoad);
            }
        }
    },
    getters: {
        cartTotal: (state) => {
            let total = 0;
            state.cart.items.forEach(function(item) {
                total += item.product.price * item.quantity;
            });
            return total;
        },
        // Static taxes
        /*taxAmount: (state, getters) => {
            return ((getters.cartTotal * 10) / 100);
        }*/
        // Dynamic taxes
        /*taxAmount: (state, getters) => {
            return function (percentage) {
                return ((getters.cartTotal * percentage) / 100);
            }
        }*/
        // Dynamic taxes with ER6 functions
        taxAmount: (state, getters) => (percentage) => {
            return ((getters.cartTotal * percentage) / 100);
        },
        getCartItem: (state) => (product) => {
            for (let i = 0; i < state.cart.items.length; i++) {
                if (state.cart.items[i].product.id === product.id) {
                    return state.cart.items[i];
                }
            }
            return null;
        }
    }
}); 

const router = new VueRouter({
    routes: routes,
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            };
        }
        
        if (savedPosition) {
            return savedPosition;
        }
        
        return { x: 0, y: 0 };
    }
});

Vue.http.options.root = 'http://localhost:3000';

new Vue({
    el: '#app',
    render: h => h(App),
    router: router,
    store: store
});