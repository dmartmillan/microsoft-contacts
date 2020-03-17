var express = require('express');
var router = express.Router();
var tokens = require('../tokens.js');
var graph = require('../graph.js');

var deltaToken;

/* GET /contact-tracked */
router.get('/',
    async function(req, res) {
        if (!req.isAuthenticated()) {
            // Redirect unauthenticated requests to home page
            res.redirect('/')
        } else {
            let params = {
                active: { contactsTracked: true }
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
                    // Get deltaToken
                    deltaToken = await graph.getTokenDelta(accessToken);
                    // params.contacts = contacts.value;

                    params.contactsTracked = [];
                } catch (err) {
                    req.flash('error_msg', {
                        message: 'Could not fetch contacts',
                        debug: JSON.stringify(err)
                    });
                }
            }

            res.render('contactsTracked', params);
        }
    }
);


router.get('/sync',
    async function(req, res) {
        if (!req.isAuthenticated()) {
            // Redirect unauthenticated requests to home page
            res.redirect('/')
        } else {
            let params = {
                active: { contactsTracked: true }
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
                    // Get changes
                    console.log({deltaToken});
                    var response = await graph.getContactChanged(accessToken, deltaToken);
                    deltaToken = response.deltaToken;

                    for (var contact of response.contacts.value) {
                        if (contact.hasOwnProperty('@removed')) {
                            contact.removed = true;
                        }
                    }
                    params.contactsTracked = response.contacts.value;
                } catch (err) {
                    req.flash('error_msg', {
                        message: 'Could not fetch contacts',
                        debug: JSON.stringify(err)
                    });
                }
            }

            res.render('contactsTracked', params);
        }
    }
);

module.exports = router;
