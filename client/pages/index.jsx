import axios from "axios";
import Link from "next/link";

const HomePage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href={`/tickets/[ticketId]`} as={`/tickets/${ticket.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    )
  });

  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}
        </tbody>
      </table>
    </div>
  )
};

HomePage.getInitialProps = async (context, client, currentUser) => {

  let data;
  if (typeof window === "undefined") {
    const headers = context.req.headers;
    const response = await axios.get("http://tickets-service:3000/api/tickets", { headers })
      .catch((err) => { console.log(err.message) });
    data = response.data;
  } else {
    const response = await axios.get("/api/tickets")
      .catch((err) => { console.log(err.message) });
    data = response.data;
  }

  return { tickets: data };
};

export default HomePage;