// Actions

let rest_config = {  
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

export function verifyEmail(email_string) {
  //TODO: Validade email

  rest_config.body = JSON.stringify({
    email: email_string,
  })

  fetch('api.goodquestion.io/email/verify', rest_config)  
    .then(function(response) {

      // Fake endpoint responses for now.
      response = {
        verified: true
      }

      if (response.verified) {
        dispatch({
                  type: 'EMAIL_SET_VERIFIED',
                  email: email_string
                })
       } else {
        dispatch ({ type: 'EMAIL_SET_INVALID' })
       }
     });

  return {
    type: 'EMAIL_FETCH_VERIFY',
    email: email_string
  }

  
}