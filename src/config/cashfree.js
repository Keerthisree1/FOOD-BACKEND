const axios = require("axios");

const cashfree = axios.create({
  baseURL: "https://sandbox.cashfree.com/pg",
  headers: {
    "x-client-id": process.env.CASHFREE_APP_ID,
    "x-client-secret": process.env.CASHFREE_SECRET_KEY,
    "x-api-version": "2023-08-01",
    "Content-Type": "application/json"
  }
});

module.exports = cashfree;
