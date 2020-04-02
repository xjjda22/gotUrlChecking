# Got URL Checking

## Getting Started
```shell
# Install all dependencies
npm install

# Run on port 3000
npm start

Api Endpoint:
Method:HEAD

Case: Correct Url
EndPoint:http://localhost:3000/api/https://sindresorhus.com
Response:{
	"url": "https://sindresorhus.com/",
    "httpCode": 200,
    "content_type": "text/html; charset=utf-8",
    "content_length": -1
}

Case: Wrong Url
EndPoint:http://localhost:3000/api/https://sindresorhus.com1
Response:{
	"httpCode": 500,
    "message": "The server encountered an unexpected condition which prevented it from fulfilling the request."
}

Case: Correct Url with wrong endpoint
EndPoint:http://localhost:3000/api/https://sindresorhus.com/api
Response:{
	"httpCode": 500,
    "message": "The server encountered an unexpected condition which prevented it from fulfilling the request."
}

```