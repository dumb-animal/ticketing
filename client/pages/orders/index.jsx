import axios from "axios";

const OrderIndex = ({ orders }) => {
  return (
    <div>
      <ul>
        {orders.map((order) => {
          return <li key={order.id}>{order.ticket.title} - {order.status}</li>
        })}
      </ul>
    </div>
  )
};

OrderIndex.getInitialProps = async (context) => {

  let data;
  if (typeof window === "undefined") {
    const headers = context.req.headers;
    const response = await axios.get(`http://orders-service:3000/api/orders`, { headers })
      .catch((err) => { console.log(err.message) });
    data = response.data;
  } else {
    const response = await axios.get(`/api/orders`)
      .catch((err) => { console.log(err.message) });
    data = response.data;
  };

  return { orders: data };
};

export default OrderIndex;