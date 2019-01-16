# aws-lambda-nodejs-web-page-check
A Node.js script for AWS Lambda λ that check whether a web page is live and, optionally, whether it contains certain string(s).

## Using the script

In your AWS Lambda, select _Node.js 8.10_ as runtime. 
Script configuration can be found in file _config.json_ where you can add web pages and strings that you want to be checked by the script. 


## Running the script

### Success

If all checked web pages as set in the configuration file return HTTP code 200 and all the strings are found, the script finishes with status _Succeeded_.

### Failure / error

The script will fail if: 
* one or more web pages cannot be loaded (do not exist, have wrong SSL cert., etc)
* one or more web pages return HTTP code other than 200
* one or more strings cannot be found on a website

In case of failure, the first error that caused the failure is returned.
