class HttpError extends Error {
    constructor(message, errorCode) {
      super(message); /// add message property, super mena comes from parent
      this.code = errorCode; // add code property
    }
  }
  
  export default HttpError; 
  