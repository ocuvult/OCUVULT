// var FacebookStrategy = require('passport-facebook').Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
// var User = require('../models/user');
// var session = require('express-session');
// var jwt = require('jsonwebtoken');
// var secret = 'spice';
//
// module.exports = function(app, passport){
//
//     app.use(passport.initialize());
//     app.use(passport.session());
//     app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: true, cookie: { secure: false } }));
//
//     passport.serializeUser(function(user, done) {
//       token = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h'} );
//       done(null, user.id);
//     });
//
//     passport.deserializeUser(function(id, done) {
//       User.findById(id, function(err, user) {
//         done(err, user);
//       });
//     });
//
//     passport.use(new FacebookStrategy({
//         clientID: '437497773290974',
//         clientSecret: '12c8052fca53db67df746532dae41fd8',
//         callbackURL: "http://localhost:8080/auth/facebook/callback",
//         profileFields: ['id', 'displayName', 'photos', 'email']
//       },
//       function(accessToken, refreshToken, profile, done) {
//         User.findOne({ email: profile._json.email }).select('username password email').exec(function(err, user) {
//             if (err) done(err);
//
//             if (user && user != null) {
//               done(null, user);
//             } else {
//               done(err);
//             }
//         });
//       }
//     ));
//
//     passport.use(new TwitterStrategy({
//         consumerKey: 'HQjQ1HCEvxltH9MJ5ZVIRaKU0',
//         consumerSecret: '0whHX4hsXmJHKilWup0qGsDWARcbYmFighXc9jE1umfZfiwf1M',
//         callbackURL: "http://localhost:8080/auth/twitter/callback",
//         userProfileURL: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true"﻿
//       },
//       function(token, tokenSecret, profile, done) {
//         console.log(profile);
//       // User.findOrCreate(..., function(err, user) {
//       //   if (err) { return done(err); }
//       //   done(null, user);
//       // });
//         done(null, profile);
//       }
//     ));
//
//     app.get('/auth/twitter', passport.authenticate('twitter'));
//
//     app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/twittererror' }));
//
//     app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/facebookerror' }), function(req, res) {
//         res.redirect('/facebook/' + token);
//     });
//
//     app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));
//
//     return passport;
// }
