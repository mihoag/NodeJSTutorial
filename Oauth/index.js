require('dotenv').config();
const express = require('express')
const app = express()
const expressHandleBar = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const passport = require('passport');
var userProfile;
app.use(passport.initialize());
//
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'thisissecret',
    cookie: { maxAge: 600000000 }
}));
app.use(passport.session());
//const auth = require('./MiddlewareFunction/authorization')

app.engine('handlebars', expressHandleBar.engine({}))
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'resources/views'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (req, res) => {
    res.render('home')
})
const isAuth = function (req, res, next) {
    if (req.user) {
        next();
    }
    else {
        res.redirect('/');
    }
}

app.get('/dashboard', isAuth, (req, res) => {
    res.render('userSide');
})



app.get('/success', (req, res) => res.render('userSide'));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '326217566106-m45dv35olkf9a9ea0bffochfb9evqmnd.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/login/oauth2/code/google"
},
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
));



app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/login/oauth2/code/google',
    passport.authenticate('google', { failureRedirect: '/error' }),
    function (req, res) {
        // Successful authentication, redirect success.
        //res.redirect('/success');
        res.redirect('/dashboard');
    });


// Login with facebook
const strategy = require('passport-facebook')
const FacebookStrategy = strategy.Strategy;

const FACEBOOK_CLIENT_ID = "1231243597525713";
const FACEBOOK_CLIENT_SECRET = "113f784f993f0db26c18d301f905f0a3";
const FACEBOOK_CALLBACK_URL = "http://localhost:3000/login/oauth2/code/facebook";

passport.use(
    new FacebookStrategy(
        {
            clientID: FACEBOOK_CLIENT_ID,
            clientSecret: FACEBOOK_CLIENT_SECRET,
            callbackURL: FACEBOOK_CALLBACK_URL,
            profileFields: ["email", "name", "picture", "gender"]
        },
        function (accessToken, refreshToken, profile, done) {
            const { email, first_name, last_name } = profile._json;
            console.log(profile._json);
            const userData = {
                email,
                firstName: first_name,
                lastName: last_name
            };
            console.log(userData);
            done(null, profile);
        }
    )
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
    "/login/oauth2/code/facebook",
    passport.authenticate("facebook", {
        successRedirect: "/successF",
        failureRedirect: "/fail"
    })
);

app.get("/failF", (req, res) => {
    res.send("Failed attempt");
});

app.get("/successF", (req, res) => {
    // res.send("Success");
    res.redirect('/dashboard');
});

// Login with github

const GitHubStrategy = require('passport-github').Strategy;
const GITHUB_CLIENT_ID = "08e680aa603baab8667a";
const GITHUB_CLIENT_SECRET = "3bd964d7e9412172b5acdc457f8e7ae07d6e6c6e";
const GITHUB_CALLBACK_URL = "http://localhost:3000/login/oauth2/code/github";

passport.use(
    new GitHubStrategy(
        {
            clientID: GITHUB_CLIENT_ID,
            clientSecret: GITHUB_CLIENT_SECRET,
            callbackURL: GITHUB_CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, cb) {
            console.log(profile._json)
            cb(null, profile);
        }
    )
);


app.get('/auth/github', passport.authenticate('github'));

app.get(
    '/login/oauth2/code/github',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashboard');
    }
);


app.get('/logout', async (req, res, next) => {
    req.logOut(err => {
        if (err) {
            //console.log(err);
            next(err);
        }
        else {
            //console.log("Logged out");
            res.redirect('/');
        }
    });
}
)


app.listen(3000);