/*
Set key-value pairs representing context of the
original server request.

Examples:
  * Request URL
  * Request method
  * Host header

*/
module.exports = {
  set: function set(object) {
    return {
      type: 'SET',
      payload: object
    }
  }
}
