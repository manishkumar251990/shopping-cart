import { getProduct } from '../redux/products';

const CART_ADD   = 'cart/ADD';
const CART_REMOVE = 'cart/REMOVE';

const initialState = {
    items: [],
    currency: 'INR'
};

export default function cart(state = initialState, action = {}) {
    switch (action.type) {
        case CART_ADD:
            return handleCartAdd(state, action.payload);
        case CART_REMOVE:
            return handleCartRemove(state, action.payload);
        default:
            return state;
    }
}

function handleCartAdd(state, payload) {
    return {
        ...state,
        items: [ ...state.items, payload.productId ]
    };
}

function handleCartRemove(state, payload) {
    return {
        ...state,
        items: state.items.filter(id => id !== payload.productId)
    };
}

export function addToCart(productId) {
    return {
        type: CART_ADD,
        payload: {
            productId
        }
    }
}

export function removeFromCart(productId) {
    return {
        type: CART_REMOVE,
        payload: {
            productId
        }
    }
}

export function isInCart(state, props) {
    return state.cart.items.indexOf(props.id) !== -1;
}

export function getItems(state, props) {
    return state.cart.items.map(id => getProduct(state, { id }));
}

export function getItemsCount(state, props) {
    return state.cart.items.length;
}

export function getCurrency(state, props) {
    return state.cart.currency;
}

export function getTotal(state, props) {
    const productsClone = state.cart.items.concat([]);

    if(getItemsCount(state) > 2) {
        const discount = parseInt(getItemsCount(state) / 3, 10);
        for(let i=0; i < discount; i++) {
            const remove = (3*i)-1;
            productsClone.splice(remove, 1);
        }
    }

    return productsClone.reduce((acc, id, index) => {
        const item = getProduct(state, { id });
        return acc + item.price;
    
    }, 0);
}
