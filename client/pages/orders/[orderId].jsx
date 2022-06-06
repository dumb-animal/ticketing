import axios from "axios";
import Router from "next/router";
import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [errors, doRequest] = useRequest({
    url: "/api/payments",
    method: "post",
    body: { orderId: order.id },
    onSuccess: () => Router.push("/orders")
  })

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };

  }, [order]);

  if (timeLeft < 0) {
    return <div>Order Expired</div>
  }

  return (
    <div>
      {errors}
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        stripeKey="pk_test_51L7H2AIbUAVtbGzRfaHLaa74LYtuIvp3veeB7iOLDcRe3zs3z7LLVYJbWsFhBW3gUtv7aYLJGwBZCbbf5aFAJRXy002Vp7a3QL"
        token={({ id }) => doRequest({ token: id })}
        amount={order.ticket.price * 100}
        email={currentUser.email}
        currency="USD"
      />
    </div>
  );
};

OrderShow.getInitialProps = async (context) => {
  const { orderId } = context.query;

  let data;
  if (typeof window === "undefined") {
    const headers = context.req.headers;
    const response = await axios.get(`http://orders-service:3000/api/orders/${orderId}`, { headers })
      .catch((err) => { console.log(err.message) });
    data = response.data;
  } else {
    const response = await axios.get(`/api/orders/${orderId}`)
      .catch((err) => { console.log(err.message) });
    data = response.data;
  };

  return { order: data };
};

export default OrderShow;