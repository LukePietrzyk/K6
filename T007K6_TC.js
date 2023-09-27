import http from "k6/http";
import { check } from "k6";
import { sleep } from "k6";
import exec from "k6/execution";

export const options = {
  vus: 10,
  duration: "10s",
  thresholds: {
    http_req_duration: ["p(95) < 200", "max < 300"],
    http_req_failed: ["rate < 0.03"],
    http_reqs: ["count > 20", "rate < 10"],
    vus: ["value > 5"],
    checks: ["rate >= 0.95"],
  },
};

export default function () {
  const res = http.get(
    "https://test.k6.io" + (exec.scenario.iterationInTest === 1 ? "/foo" : "")
  );
  check(res, {
    "status Code is 200": (re) => re.status === 200,
    "Check title on website": (re) => re.body.includes("test.k6.io"),
  });
  sleep(2);
}
