let rest_config = {  
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

export function verifyEmail(email_string, callback) {
  //TODO: Validade email

  console.log('verifyEmail')

  rest_config.body = JSON.stringify({
    email: email_string,
  })

  fetch('http://api.goodquestion.io/email/verify', rest_config)  
    .then(function (response) {
      console.log('original response: ')
      console.log(response)

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