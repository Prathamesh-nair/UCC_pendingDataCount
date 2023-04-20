require("dotenv").config();
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const axios = require("axios").default;
const postError = async function (task = "", msg = "") {
  axios({
    method: "post",
    url: process.env.TECHOPSALERT,
    data: {
      text: `${task}\n>${msg}`,
    },
    header: { "Content-type": "application/json" },
  }).catch((err) => {
    console.error(err);
  });
};

module.exports = postError;
