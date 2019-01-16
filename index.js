/**
 * An AWS Lambda Node.js script to check web page status and content.
 * Created by: Martin Tomsik, Internet Mate Ltd (United Kingdom).
 */

const config = require('./config.json');
const url = require('url');

exports.handler = (event, context, callback) => {

  if (config.debug) console.log('Config: ', config.pagesToCheck);

  // Loop through each URL to check for HTTP status 200 and for strings.
  for(let i = 0, len = config.pagesToCheck.length; i < len; i++){

    let endpointUrl = config.pagesToCheck[i].url;
    let strings =  config.pagesToCheck[i].strInHtml;

    const urlObject = url.parse(endpointUrl);
    const httpx = require(
      urlObject.protocol.substring(0, urlObject.protocol.length - 1)
    );

    console.log('Getting content from: ', endpointUrl);

    httpx.get(endpointUrl, (response) => {

      let body = "";
      let countChunks = 0;

      // ERROR: The resource is not giving back HTTP code 200 in response.
      if (response.statusCode != 200) {
        const error = new Error("The URL " + endpointUrl
          + " is not returning code 200 in HTTP "
          + "response. It returns HTTP code " + response.statusCode + ".");
        callback(error);
      }

      response.on('data', (chunk) => {
          countChunks++;
          body += chunk;
      });

      response.on('end', () => {

          const result = {
              countChunks: countChunks,
              body: body
          };

          // Find required string(s) in HTML as set in config.json.
          for (let i in strings) {
              let strIncluded = body.includes(strings[i]);
              let strIncludedMsg;
              console.log("Checking string '" + strings[i]
                  + "' exits on " + endpointUrl + ": ",
                  (strIncluded) ? "[FOUND]" : "[NOT FOUND]");
              if (!strIncluded) {
                  const error = new Error("String '" + strings[i]
                    + "' not found on " + endpointUrl);
                  callback(error);
              }
          }
      });
    }).on('error', (err) => {
      //console.log(err);
      const error = new Error("Checking '" + endpointUrl + "' failed. Not getting any response.");
      callback(error);
    });
  }

  // Success. All URLs get correct response and all strings are present.
  //callback(null, "SUCCESS");

};
