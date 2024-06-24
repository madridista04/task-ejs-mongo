exports.getSuccessResponse = (message, data = null) => {
    let response = {
      message,
      status: "successful",
    };
    if (data) response.data = data;
    return response;
  };
  
  exports.getFailuerResponse = (statusCode, message, errName) => {
    return {
      status: errName || "error" ,
      error: {
        statusCode,
        message,
      },
    };
  };
  