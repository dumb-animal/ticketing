import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
// import buildClient from "../api/build-client";
import Header from "../components/header";

const App = ({ Component, pageProps, currentUser }) => {
  return <div>
    <Header currentUser={currentUser} />
    <Component {...pageProps} currentUser={currentUser} />
  </div>
};

App.getInitialProps = async (appContext) => {
  // const client = buildClient(context);
  // const { data } = client.get("/api/users/currentuser");

  let data;
  if (typeof window === "undefined") {
    const headers = appContext.ctx.req.headers;
    const response = await axios.get("http://auth-service:3000/api/users/currentuser", { headers })
      .catch((err) => { console.log(err.message) });
    data = response.data;
  } else {
    const response = await axios.get("/api/users/currentuser")
      .catch((err) => { console.log(err.message) });
    data = response.data;
  }

  // Если у App вызывать getInitialProps, то тогда getInitialProps у homePage
  // не будет вызвана автоматически, но ее можно вызвать вручную 
  let pageProps = {};
  if (appContext.Component.getInitialProps) {
    pageProps = await appContext.Component.getInitialProps(appContext.ctx);
  };

  return { pageProps, ...data };
};

export default App;