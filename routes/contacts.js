var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');

/* GET /contacts */
router.get('/',
    async function(req, res) {
        if (!req.isAuthenticated()) {
            // Redirect unauthenticated requests to home page
            res.redirect('/')
        } else {
            let params = {
                active: { contacts: true }
            };

            // Get the access token
            var accessToken;
            try {
                accessToken = await tokens.getAccessToken(req);
            } catch (err) {
                req.flash('error_msg', {
                    message: 'Could not get access token. Try signing out and signing in again.',
                    debug: JSON.stringify(err)
                });
            }

            if (accessToken && accessToken.length > 0) {
                try {
                    // Get contacts
                    var contacts = await graph.getContacts(accessToken);
                    params.contacts = contacts.value;
                } catch (err) {
                    req.flash('error_msg', {
                        message: 'Could not fetch contacts',
                        debug: JSON.stringify(err)
                    });
                }
            }

            res.render('contacts', params);
        }
    }
);

module.exports = router;
