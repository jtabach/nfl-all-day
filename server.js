const express = require("express"); //Line 1
const app = express(); //Line 2
const port = process.env.PORT || 5000; //Line 3
const request = require("request");

// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); //Line 6

// create a GET route
app.get("/express_backend", (req, res) => {
  //Line 9
  //   res.send({ express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT" }); //Line 10

  var url =
    "https://api.momentranks.com/v1/flow/listings?page=1&sort=LISTING_DATE_DESC&limit=48&contractAddress=0xe4cf4bdc1751c65d&contractName=AllDay&tier=COMMON&tier=RARE";

  request(url, function (err, resp, body) {
    var body = JSON.parse(body);

    var moments = body.docs;

    if (!body.docs) {
      console.log("crap no moments");
      res.send(body);
    } else {
      var valuedMoments = moments.map(function (moment) {
        var valueDelta =
          moment.valuations.MRValue - moment.listings.cheapestListingPrice;
        console.log("listing price", moment.listings.cheapestListingPrice);
        console.log("moment value", moment.valuations.MRValue);
        console.log("valueDelta", valueDelta);
        var discountValue = valueDelta / moment.listings.cheapestListingPrice;

        moment.discountValue = parseFloat(discountValue * 100).toFixed(1);
        console.log("discountValue", moment.discountValue);
        return moment;
      });

      var sortedValuedMoments = valuedMoments.sort(function (a, b) {
        return b.discountValue - a.discountValue;
      });
      console.log(sortedValuedMoments);
      res.send(sortedValuedMoments);
    }
  });
});
