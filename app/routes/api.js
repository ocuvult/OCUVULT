var User = require('../models/user');
var jwt = require('jsonwebtoken');
var secret = 'fire water';

module.exports = function(router) {
    // http://localhost:8080/api/users
    // USER REGISTRATION ROUTE
    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        // user.ocuvult = req.body.ocuvult;
        if (req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == '') {
            res.json({ success: false, message: 'Ensure username, email, and password were provided' });
        } else {
            user.save(function(err) {
                if (err) {
                    if(err.errors != null) {
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                        } else if (err.errors.email) {
                            res.json({ success: false, message: err.errors.email.message });
                        } else if (err.errors.username) {
                            res.json({ success: false, message: err.errors.username.message });
                        } if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            res.json({ success: false, message: err });
                        }
                    } else if (err) {
                        if (err.code == 11000) {

                            if (err.errmsg[59] == "u" ) {
                                res.json({ success: false, message: 'That username is already taken.' });
                            } else if (err.errmsg[59] == "e") {
                                res.json({ success: false, message: 'That e-mail is already taken.'});
                            }
                            else {
                              res.json ({ success: false, message: 'That username or e-mail is already taken.' })
                            }
                        } else {
                            res.json({ success: false, message: err });
                        }
                    }
                  } else {
                    res.json({ success: true, message: 'user created!' });
                }
            });
        }
    });

    router.post('/checkusername', function(req, res) {
      User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
        if (err) throw err;

        if (user) {
            res.json({ success: false, message: 'That username is already taken' });
        } else {
           res.json({ success: true, message: 'Valid username' });
        }
      });
    });

    router.post('/checkemail', function(req, res) {
      User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
        if (err) throw err;

        if (user) {
            res.json({ success: false, message: 'That e-mail is already taken' });
        } else {
           res.json({ success: true, message: 'Valid e-mail' });
        }
      });
    });

    router.post('/authenticate', function(req, res) {
      User.findOne({ username: req.body.username }).select('email username password ocuvult actiontoken').exec(function(err, user) {
        if (err) throw err;

        if (!user) {
          res.json({ success: false, message: 'Could not authenticate user'});
        } else {
          if (req.body.password) {
            var validPassword = user.comparePassword(req.body.password);
        	// Here you should be validating the password, since you have verified that it exists
        	if (!validPassword) {
        	 // console.log('in');
        	  res.json({ success: false, message: 'Could not authenticate password.'});
        	} else {
        	 // console.log('out');
            var token = jwt.sign({ username: user.username, email: user.email, ocuvult: user.ocuvult, actiontoken: user.actiontoken }, secret, {expiresIn: '900s'} );
        	  res.json({ success: true, message: 'User authenticated!', token: token });
        	}
          } else {
            res.json({ success: false, message: 'No password provided.'});
          }
        }
      });
    });

    router.use(function(req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];

        if (token) {

            jwt.verify(token, secret, function(err, decoded){
                if (err) {
                    res.json({ success: false, message: 'Token invalid'});
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            res.json({ success: false, message: 'No token provided'});
        }

    });

    router.post('/me', function(req, res){
       res.send(req.decoded);
    });


    router.get('/renewToken/:username', function(req, res) {
        User.findOne({ username: req.params.username }).select().exec(function(err,user) {
            if (err) throw err;
            if (!user) {
                res.json({ success: false, message: 'No user was found.' });
            } else {
                var newToken = jwt.sign({ username: user.username, email: user.email, ocuvult: user.ocuvult, actiontoken: user.actiontoken }, secret, {expiresIn: '900s'});
                res.json({ success: true, token: newToken });
            }
        });
    });

    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user){
           if (err) throw err;
           if (!user) {
               res.json({ success: false, message: 'No user was found.' });
           } else {
               res.json({ success: true, permission: user.permission });
           }

        });
    });

    router.get('/ocuvult', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user){
           if (err) throw err;
           if (!user) {
               res.json({ success: false, message: 'No user was found.' });
           } else {
               res.json({ success: true, ocuvult: user.ocuvult });
           }

        });
    });

    router.get('/actiontoken', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user){
           if (err) throw err;
           if (!user) {
               res.json({ success: false, message: 'No user was found.' });
           } else {
               res.json({ success: true, actiontoken: user.actiontoken });
           }

        });
    });

    router.get('/management', function(req, res) {
       User.find({}, function(err, users){
           if (err) throw err;
           User.findOne({ username: req.decoded.username }, function(err, mainUser) {
               if (err) throw err;
               if (!mainUser) {
                 res.json({ success: false, message: 'No user found' });
               } else {
                   if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                       if (!users) {
                           res.json({ success: false, message: 'Users not found' });
                       } else {
                           res.json({ success: true, users: users, permission: mainUser.permission });
                       }

                   } else {
                       res.json({ success: false, message: 'Insufficent Permissions' });
                   }
               }
           });
       });
    });

    router.delete('/management/:username', function(req, res){
         var deletedUser = req.params.username;
         User.findOne({ username: req.decoded.username }, function(err, mainUser){
             if (err) throw err;
             if (!mainUser) {
                 res.json({ success: false, message: 'No user found'});
             } else {
                 if (mainUser.permission !== 'admin') {
                     res.json({ success: false, message: 'Insufficent Permissions' });
                 } else {
                     User.findOneAndRemove({ username: deletedUser }, function(err, user) {
                         if (err) throw err;
                         res.json({ success: true });
                     });
                 }
             }
         });
    });

    router.get('/edit/:id', function(req, res) {
         var editUser = req.params.id;
         User.findOne({ username: req.decoded.username }, function(err, mainUser){
             if (err) throw err;
             if (!mainUser) {
                res.json({ success: false, message: 'No user found' });
             } else {
                 if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                     User.findOne({ _id: editUser }, function(err, user) {
                         if(err) throw err;
                         if (!user) {
                             res.json({ success: false, message: 'No user found.' });
                         } else {
                             res.json({ success: true, user: user });
                         }
                     });
                 } else {
                     res.json({ success: false, message: 'Insufficient Permissions.'});
                 }
             }
         });
    });

    router.put('/edit', function(req, res) {
        var editUser = req.body._id;
        if (req.body.name) var newName = req.body.name;
        if (req.body.username) var newUsername = req.body.username;
        if (req.body.email) var newEmail = req.body.email;
        if (req.body.ocuvult) var newOcuvult = req.body.ocuvult;
        if (req.body.actiontoken) var newActiontoken= req.body.actiontoken;
        if (req.body.permission) var newPermission = req.body.permission;
        User.findOne({ username: req.decoded.username }, function(err, mainUser) {
            if (err) throw err;
            if (!mainUser) {
                res.json({ success: false, message: "no user found" });
            } else {
              if (newName){
                  if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                      User.findOne({_id: editUser}, function(err, user){
                          if (err) throw err;
                          if (!user) {
                              res.json({ success: false, message: 'No user found.' });
                          } else {
                              user.name = newName;
                              user.save(function(err){
                                  if (err) {
                                      console.log(err);

                                  } else {
                                      res.json({ success: true, message: 'Name has been updated!' });
                                  }
                              });

                          }

                      });
                  } else {
                     res.json({ success: false, message: 'Insufficient Permissions.' });
                  }
              }
              if (newUsername) {
                  if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                      User.findOne({ _id: editUser }, function(err, user) {
                          if (err) throw err;
                          if (!user) {
                              res.json({ success: false, message: 'No user found.' });
                          } else {
                             user.username = newUsername;
                             user.save(function(err){
                                 if (err) {
                                     console.log(err);
                                 } else {
                                     res.json({ success: true, message: 'Username has been updated.'});
                                 }
                             });
                          }
                      });

                  } else {
                     res.json({ success: false, message: 'Insufficient Permissions.' });
                  }
              }
              if (newEmail) {
                  if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                      User.findOne({ _id: editUser }, function(err, user) {
                          if (err) throw err;
                          if (!user) {
                              res.json({ success: false, message: 'No user found.' });
                          } else {
                             user.email = newEmail;
                             user.save(function(err){
                                 if (err) {
                                     console.log(err);
                                 } else {
                                     res.json({ success: true, message: "E-mail has been updated." });
                                 }
                             });
                          }
                      });
                  } else {
                      res.json({ success: false, message: 'Insufficient Permissions.' });

                  }
              }

              if (newPermission) {
                  if (mainUser.permission === 'admin' || mainUser.permission === 'moderator') {
                      User.findOne({ _id: editUser }, function(err, user) {
                          if (err) throw err;
                          if (!user) {
                              res.json({ success: false, message: 'No user found.' });
                          } else {
                              if (newPermission === 'user') {
                                  if (user.permission === 'admin') {
                                      if (mainUser.permission !== 'admin') {
                                          res.json({ success: false, message: 'Insufficient Permissions.' });
                                      } else {
                                         user.permission = newPermission;
                                         user.save(function(err) {
                                             if (err) {
                                                 console.log(err);
                                             } else {
                                                 res.json({ success: true, message: 'Permissions have been updated!'});
                                             }
                                         });
                                      }
                                  } else {
                                      user.permission = newPermission;
                                      user.save(function(err) {
                                          if (err) {
                                              console.log(err);
                                          } else {
                                              res.json({ success: true, message: 'Permissions have been updated!'});
                                          }
                                      });
                                  }
                              }
                              if (newPermission === 'moderator') {
                                   if(user.permission === 'admin') {
                                      if (mainUser.permission !== 'admin') {
                                          res.json({ success: false, message: 'Insufficient Permissions.'});
                                      } else {
                                          user.permission = newPermission;
                                          user.save(function(err) {
                                              if (err) {
                                                  console.log(err);
                                              } else {
                                                  res.json({ success: true, message: 'Permissions have been updated!'});
                                              }
                                          });
                                      }
                                   } else {
                                       user.permission = newPermission;
                                       user.save(function(err) {
                                           if (err) {
                                               console.log(err);
                                           } else {
                                               res.json({ success: true, message: 'Permissions have been updated!'});
                                           }
                                       });
                                   }
                              }
                              if (newPermission === 'admin') {
                                  if (mainUser.permission === 'admin') {
                                      user.permission = newPermission;
                                      user.save(function(err) {
                                          if (err) {
                                              console.log(err);
                                          } else {
                                              res.json({ success: true, message: 'Permissions have been updated!'});
                                          }
                                      });

                                  } else {
                                      res.json({ success: false, message: 'Insufficient Permissions.' });
                                  }
                              }

                          }
                      });
                  } else {
                    res.json({ success: false, message: 'Insufficient Permissions.' });
                  }
              }

            }
        });

    });

    return router;
};
