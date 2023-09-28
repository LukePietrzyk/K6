import { check } from "k6";
import http from "k6/http";
import { sleep } from "k6";

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
  const url1 = "https://dummyjson.com/auth/login";
  const url2 = "https://dummyjson.com/products";
  const payload = JSON.stringify({
    username: "kminchelle",
    password: "0lelplR",
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(url1, payload, params);
  check(res, {
    "Login - Status code is 200": (r) => r.status === 200,
    "Response body has username": (r) =>
      r.body.includes("kminchelle", "0lelplR"),
  });

  sleep(1);
  const res1 = http.get(url2);
  check(res1, {
    "Get list of products - status code is 200": (r) => r.status === 200,
    "Include products": (r) => r.body.includes("iPhone 9"),
  });
}
