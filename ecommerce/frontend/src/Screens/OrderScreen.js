import React, { useState, useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom'; // useNavigate instead of history
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import { getOrderDetails, payOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET } from '../constants/orderConstants';
import { PayPalButton } from 'react-paypal-button-v2';

function OrderScreen() {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [sdkReady, setSdkReady] = useState(false);

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const orderPay = useSelector((state) => state.orderPay);
    const { loading: loadingPay, success: successPay } = orderPay;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const addPayPalScript = () => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.paypal.com/sdk/js?client-id=AQ6UUhmcdC8V74ev5olentoXSiCSJ_8GD7GhaoMiUDhf5j7kwWtmYsUcPp_6_eupg4ZB4oiw7gtJVboh';
        script.async = true;
        script.onload = () => setSdkReady(true);
        document.body.appendChild(script);
    };

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            if (!order || successPay || order._id !== Number(orderId)) {
                dispatch({ type: ORDER_PAY_RESET });
                dispatch(getOrderDetails(orderId));
            } else if (!order.isPaid) {
                if (!window.paypal) {
                    addPayPalScript();
                } else {
                    setSdkReady(true);
                }
            }
        }
    }, [dispatch, order, orderId, successPay, userInfo, navigate]);

    const successPaymentHandler = (paymentResult) => {
        dispatch(payOrder(orderId, paymentResult));
    };

    // Ensure order is defined and has items before performing calculations
    const itemsPrice = order ? order.orderItems.reduce((acc, item) => acc + item.qty * item.price, 0) : 0;

    return loading ? (
        <Loader />
    ) : error ? (
        <Message variant="danger">{error}</Message>
    ) : (
        <div>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                    {/* Shipping Details */}
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong>
                                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                            </p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                                {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                            </p>
                            {order.isDelivered ? (
                                <Message variant="success">Delivered on {order.deliveredAt}</Message>
                            ) : (
                                <Message variant="warning">Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        {/* Payment Method */}
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong> {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant="success">Paid on {order.paidAt}</Message>
                            ) : (
                                <Message variant="warning">Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        {/* Order Items */}
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            {order && order.orderItems && order.orderItems.length === 0 ? (
                                <Message variant="info">Order is empty</Message>
                            ) : (
                                <ListGroup variant="flush">
                                    {order && order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>

                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items:</Col>
                                    <Col>${itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping:</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax:</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total:</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {!sdkReady ? (
                                        <Loader />
                                    ) : (
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default OrderScreen;
