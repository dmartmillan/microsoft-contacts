var graph = require('@microsoft/microsoft-graph-client');
var fetch = require('isomorphic-fetch');

module.exports = {
    getUserDetails: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const user = await client.api('/me').get();
        return user;
    },
    getContacts: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const contacts = await client
            .api('/me/contacts')
            .top(50)
            .select('givenName,surname,mobilePhone')
            .orderby('givenName ASC')
            .get();
        return contacts;
    },
    getTokenDelta: async function(accessToken) {
        const client = getAuthenticatedClient(accessToken);

        const folderList = await client.api('/me/contactFolders')
            .version('beta')
            .get();

        // On a real dev, it will need to scan all folders
        // Get and save delta token in a database for each different contactFolder
        // On this sample web app, we will only check default contactFolder, which corresponds to
        // the first one

        const idFolder = folderList.value[0].id;

        let response = await client.api(`/me/contactFolders/${idFolder}/contacts/delta`)
            .select('displayName')
            .header('Prefer','odata.maxpagesize=100')
            .get();

        var idSkyptoken = response['@odata.nextLink'];
        var key = "skiptoken=";
        var detect = idSkyptoken.match(key);
        var token = idSkyptoken.substring(detect.index + key.length, idSkyptoken.length);
        var stop = response.value.length > 0;
        while (stop) {
            response = await client.api(`/me/contactFolders/${idFolder}/contacts/delta`)
                .header('Prefer','odata.maxpagesize=100')
                .skipToken(token)
                .select('displayName')
                .get();
            stop = !response.hasOwnProperty('@odata.deltaLink');

        }

        var idDeltatoken = response['@odata.deltaLink'];
        key = "deltatoken=";
        detect = idDeltatoken.match(key);
        var deltaToken = idDeltatoken.substring(detect.index + key.length, idDeltatoken.length);

        return deltaToken;
    },
    getContactChanged: async function(accessToken, deltaToken) {
        const client = getAuthenticatedClient(accessToken);

        const folderList = await client.api('/me/contactFolders')
            .version('beta')
            .get();

        // On a real dev, it will need to scan all folders
        // Get and save delta token in a database for each different contactFolder
        // On this sample web app, we will only check default contactFolder, which corresponds to
        // the first one

        const idFolder = folderList.value[0].id;

        let contacts = await client.api(`/me/contactFolders/${idFolder}/contacts/delta?$deltatoken=${deltaToken}`)
            .header('Prefer','odata.maxpagesize=100')
            .get();

        var idDeltatoken = contacts['@odata.deltaLink'];
        var key = "deltatoken=";
        var detect = idDeltatoken.match(key);
        deltaToken = idDeltatoken.substring(detect.index + key.length, idDeltatoken.length);
        return {deltaToken, contacts};
    }
};

function getAuthenticatedClient(accessToken) {
    // Initialize Graph client
    const client = graph.Client.init({
        // Use the provided access token to authenticate
        // requests
        authProvider: (done) => {
            done(null, accessToken);
        }
    });

    return client;
}
