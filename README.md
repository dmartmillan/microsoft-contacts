# Microsoft Graph - Contacts

Little sample of Node.js Express web app, using [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0). Fundamentally, what we can see on this repo is how `delta` query could work.

This code was made for a quick test, without any intention to put it on production. If this was your desire, we recommend you to check up any kind of vulnerability and search out for more information.

## Installation 

First of all, in order to test this sample web app, it is needed to register ann App in [Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/). We recommend you to follow this [simple tutorial](https://docs.microsoft.com/en-us/graph/auth-register-app-v2?view=graph-rest-1.0). 

Further on, it is required to create a `.env` file to being able to deploy the necessary environment variables. In particular, it is need to replace `OAUTH_APP_ID` and `OAUTH_APP_PASSWORD` variables.  There's `.env.example` file as an example. 

```bash
OAUTH_APP_ID=YOUR_APP_ID_HERE
OAUTH_APP_PASSWORD=YOUR_APP_PASSWORD_HERE
OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
OAUTH_SCOPES='profile offline_access user.read calendars.read'
OAUTH_AUTHORITY=https://login.microsoftonline.com/common/
OAUTH_ID_METADATA=v2.0/.well-known/openid-configuration
OAUTH_AUTHORIZE_ENDPOINT=oauth2/v2.0/authorize
OAUTH_TOKEN_ENDPOINT=oauth2/v2.0/token
```

## Usage

```bash
npm install
npm start
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
