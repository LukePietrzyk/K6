import http from "k6/http";
import { check } from "k6";
import { sleep } from "k6";

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(95) < 200"],
    http_req_failed: ["rate < 0.01"],
    http_reqs: ["count > 20", "rate < 10"],
    vus: ["value > 5"],
  },
};

export default function () {
  const res = http.get("https://test.k6.io");
  check(res, {
    "status Code is 200": (re) => re.status === 200,
    "Check title on website": (re) => re.body.includes("test.k6.io"),
  });
  sleep(2);
}
