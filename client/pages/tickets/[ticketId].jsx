import Router from "next/router";
import useRequest from "../../hooks/use-request";
import axios from "axios";

const TicketShow = ({ ticket }) => {
  const [errors, doRequest] = useRequest({
    url: "/api/orders",
    method: "post",
    body: { ticketId: ticket.id },
    onSuccess: (order) => Router.push(`/orders/[orderId]`, `/orders/${order.id}`)
  })
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>{ticket.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>Purchase</button>
    </div>
  );
};

TicketShow.getInitialProps = async (context) => {
  const { ticketId } = context.query;

  let data;
  if (typeof window === "undefined") {
    const headers = context.req.headers;
    const response = await axios.get(`http://tickets-service:3000/api/tickets/${ticketId}`, { headers })
      .catch((err) => { console.log(err.message) });
    data = response.data;
  } else {
    const response = await axios.get(`/api/tickets/${ticketId}`)
      .catch((err) => { console.log(err.message) });
    data = response.data;
  };

  return { ticket: data };
};

export default TicketShow;