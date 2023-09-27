import http from "k6/http";
import { sleep } from "k6";

// For this case, I will use a light test because I don't want to put too much load on an application that I can't control myself. Parameters for a real case should be in minutes and involve more users. Everything depends on the context :).

export const options = {
  stages: [
    {
      //rampUp
      duration: "10s", //5m
      target: 10, //100
    },
    {
      //steady Load
      duration: "30s", //50m
      target: 10, //100
    },
    {
      //rampDown
      duration: "10s", //5m
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
