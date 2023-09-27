import http from "k6/http";
import { sleep } from "k6";

export const options = {
  stages: [
    {
      //rampUp
      duration: "5m",
      target: 1000,
    },
    {
      //steady Load
      duration: "50m",
      target: 1000,
    },
    {
      //rampDown
      duration: "5m",
      target: 0,
    },
  ],
};

export default function () {
  http.get("https://test.k6.io");
  sleep(1);
  http.get("https://test.k6.io/contacts.php");
  sleep(2);
  http.get("https://test.k6.io/news.php");
}
