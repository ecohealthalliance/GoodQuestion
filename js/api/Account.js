let rest_config = {  
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

export function verifyLogin(email_string, callback) {
  //TODO: Use the validateEmailString function for client-side validation before sending a request.

  rest_config.body = JSON.stringify({
    email: email_string,
  })

  fetch('http://api.goodquestion.io/email/verify', rest_config)  
    .then(function (response) {
      // Fake endpoint responses for now.
      response = {
        email: email_string,
        verified: true
      }
      callback(response)
    })
    .catch(function (response) {
      // TODO: We will need to replace this with real error handling when our api endpoints are set.
      // For now we will return placeholder data.
      response = {
        email: email_string,
        verified: true
      }
      callback(response)
    })
}

/**
 * Validates an email string using RegEx.
 * @param  {string} email_string
 * @return {bool}   result
 */
function validateEmailString(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}
