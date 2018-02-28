module.exports = {
  facebookAuth: {
    clientID: '568606160149372', // your App ID
    clientSecret: '54458b31bead4db58db542aba19785e8', // your App Secret
    callbackURL: 'http://localhost:3000/users/auth/facebook/callback',
    profileURL:
      'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
    profileFields: ['id', 'email', 'name'] // For requesting permissions from
  },
  cookieKey: 'sdfsdfsdgsdgfsdfsgsdgsdgsasefrwegknmnc'
};
