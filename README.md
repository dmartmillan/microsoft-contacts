# Microsoft Graph - Contacts

Little sample of a Node.js Express web app, using [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0). 
Fundamentally, what we can see on this repo is how `delta` query could work for contacts resource.

This code was built for a quick test, without any intention to put it on production. If this was your desire, we 
recommend you to check up any kind of vulnerability and search out for more information.

## Set up

First of all, in order to test this sample web app, it is needed to register an App in 
[Azure Active Directory](https://azure.microsoft.com/en-us/services/active-directory/). We recommend you to follow this [simple tutorial](https://docs.microsoft.com/en-us/graph/auth-register-app-v2?view=graph-rest-1.0). 

Further on, it is required to create a `.env` file to being able to deploy the necessary environment variables. 
In particular, it is need to replace `OAUTH_APP_ID` and `OAUTH_APP_PASSWORD` variables. There's `.env.example` file as 
an example. 

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

Before next step, you need to have installed `Node.js` and `NPM`.

```bash
npm install
npm start
```
## Inefficiencies

Keeping in mind that this repo was made for `v1.0` of __Microsoft Graph__. We could detect some different inefficiencies
related to the usage of `delta` query:

+ As we know, `delta` query only works for a single `contactFolder`, so, in order to have whole contact changes we will 
needed to scan all `contactFolders` and track their changes for each.  

+ Further on, the response of `delta` query will give us only `id` and `displayName` attributes of a contact, therefore 
will need to make a `GET` query for entirety of its attributes. 

+ `delta` query will report which contact has been deleted, it will appear `@removed` attribute. On the other hand, `delta`
query doesn't report if a contact was updated or deleted. This issue will carry us a little bit of work and inefficiency 
to know exactly if it was updated or created.      

## License
[MIT](https://choosealicense.com/licenses/mit/)
