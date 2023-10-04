import { check } from "k6";
import http from "k6/http";
import { sleep } from "k6";

const jsonData = JSON.parse(open("data.json"));

function randomGenerator(array) {
  return Math.floor(Math.random() * array.length);
}

const products = jsonData.items[randomGenerator(jsonData.items)];
const users = jsonData.users[randomGenerator(jsonData.users)];

export const options = {
  vus: 1,
  duration: "5s",
  thresholds: {
    http_req_duration: ["p(95) < 400", "max < 400"],
    http_req_failed: ["rate < 0.03"],
    vus: ["value >= 1"],
    checks: ["rate >= 0.95"],
  },
};

export default function () {
  const urlLogin = "https://dummyjson.com/auth/login";
  const urlProducts = "https://dummyjson.com/products";
  const urlSingleProduct = `https://dummyjson.com/products/${products.id}`;
  const urlAddProduct = `https://dummyjson.com/products/add`;
  const urlUpdateProduct = "https://dummyjson.com/products/1";
  const productName = jsonData.products[randomGenerator(jsonData.products)];

  console.log(productName);
  //const productName = "BMW Pencil";
  const payload = JSON.stringify({
    username: "kminchelle",
    password: "0lelplR",
    title: `${productName}`,
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const resLogin = http.post(urlLogin, payload, params);
  const resAllProducts = http.get(urlProducts);
  const resSinglePro = http.get(urlSingleProduct);
  const resAddProduct = http.post(urlAddProduct, payload, params);
  const updateProduct = http.put(urlUpdateProduct, payload, params);

  check(resLogin, {
    "Login - Status code is 200": (r) => {
      return r.status === 200;
    },
    [`Response body has username ${users.username}`]: (r) => {
      const jsonResponse = JSON.parse(r.body);
      return jsonResponse.username === users.username;
    },

    [`is authenticated as user id = ${users.id}`]: (r) => {
      const jsonResponse = JSON.parse(r.body);
      return jsonResponse.id === users.id;
    },
  });

  sleep(1);
  check(resAllProducts, {
    "Get list of products - status code is 200": (r) => r.status === 200,
    [`Include ${products.title} in list of products`]: (r) => {
      const jsonResponse = JSON.parse(r.body);
      return jsonResponse.products.some((ele) => ele.title === products.title);
    },
  });
  sleep(1);
  check(resSinglePro, {
    "Get single product - status code 200": (r) => r.status === 200,
    [`Check product ${products.title}`]: (r) => {
      const jsonRes = JSON.parse(r.body);
      return jsonRes.title === products.title;
    },
  });
  sleep(1);
  check(resAddProduct, {
    "Status is 200": (r) => r.status === 200,
    [`Add product ${productName}`]: (r) => {
      const resAdd = JSON.parse(r.body);
      return resAdd.title === productName;
    },
  });
  sleep(1);
  check(updateProduct, {
    [`Update product name to (${productName}) with id = 1 `]: (r) => {
      const resUpdate = JSON.parse(r.body);
      return resUpdate.title === productName;
    },
  });
}
