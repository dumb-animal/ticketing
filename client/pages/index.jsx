import axios from "axios";

const HomePage = ({ currentUser }) => {
  return <h1>Hello world!{JSON.stringify(currentUser)}</h1>
};

HomePage.getInitialProps = async ({ req }) => {
  if (typeof window === "undefined") {
    const { data } = await axios.get("http://auth-service:3000/api/users/currentuser", { headers: req.headers })
      .catch((err) => { console.log(err.message) });
    return data;
  } else {
    const { data } = await axios.get("/api/users/currentuser")
      .catch((err) => { console.log(err.message) });
    return data;
  }
};

export default HomePage;