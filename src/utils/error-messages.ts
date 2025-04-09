// errorMessages.js
const errorMessages = (statusCode: number): string => {
  switch (statusCode) {
    case 400:
      return "Bad Request. Please check your input and try again.";
    case 401:
      return "Unauthorized. Please log in and try again.";
    case 403:
      return "Forbidden. You do not have permission to perform this action.";
    case 404:
      return "Not Found. The requested resource could not be found.";
    case 500:
      return "Internal Server Error. Please try again later.";
    case 502:
      return "Bad Gateway. The server received an invalid response from the upstream server.";
    case 503:
      return "Service Unavailable. The server is currently unable to handle the request.";
    case 504:
      return "Gateway Timeout. The server did not receive a timely response from the upstream server.";
    default:
      return "An unknown error occurred. Please try again.";
  }
};

export default errorMessages;
