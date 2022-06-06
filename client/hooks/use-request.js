import axios from "axios";
import { useState } from "react";

export default ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    return await axios[method](url, { ...body, ...props })
      .then((res) => {
        if (onSuccess) return onSuccess(res.data);
        return res.data;
      })
      .catch((err) => {
        setErrors(
          <div className="alert alert-danger">
            <h4>Ooops....</h4>
            <ul className="my-0">
              {err.response.data.errors.map((err, i) => <li key={i}>{err.message}</li>)}
            </ul>
          </div>
        );

        throw err;
      })
  };

  return [errors, doRequest];
};