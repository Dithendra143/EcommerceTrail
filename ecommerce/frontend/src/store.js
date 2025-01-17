import { applyMiddleware, combineReducers, createStore } from 'redux';
import {thunk} from 'redux-thunk'; // Correct the import statement for thunk
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer } from './reducers/productReducer';
import { productDetailsReducer } from './reducers/productDetailsReducer';
import { cartReducer } from './reducers/cartReducer';
import { userLoginReducer,userRegisterReducer,userDetailsReducer,
    userUpdateProfileReducer, } from './reducers/userReducer';
import { orderCreateReducer,orderDetailsReducer,orderPayReducer,orderListMyReducer } from './reducers/orderReducers';

const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister:userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    orderCreate:orderCreateReducer,
    orderDetails:orderDetailsReducer,
    orderPay: orderPayReducer,
    orderListMy: orderListMyReducer,

    
});

const cartItemsFromStorage = localStorage.getItem('cartItems') 
    ? JSON.parse(localStorage.getItem('cartItems')) 
    : [];

const userInfoFromStorage = localStorage.getItem('userInfo') 
    ? JSON.parse(localStorage.getItem('userInfo')) 
    : null;

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: { cartItems: cartItemsFromStorage,
        shippingAddress: shippingAddressFromStorage,
     },
    userLogin: { userInfo: userInfoFromStorage }, // Fixed assignment
};

const middleware = [thunk];

const store = createStore(
    reducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
