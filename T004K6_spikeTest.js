import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    {
      duration: "2m",
      //target: 20000,
    },
    {
      duration: "1m",
      target: 100,
    },
  ],
};

export default function () {
  const res = http.get("https://test.k6.io");
  console.log(res.status);
  sleep(1);
}
