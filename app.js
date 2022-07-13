const express = require('express');
const router = require('./routes/routes');
const viewRouter = require('./routes/viewRoutes');
const path = require('path');
const compression = require('compression');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser')

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(compression());


app.use(helmet({
    contentSecurityPolicy: {
        useDefaults: true,
        directives: {
            'script-src': ["'self'", "https://cdnjs.cloudflare.com/"]
        }
    }
}));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize())
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests please try again in an hour"
})
app.use(limiter);

app.use('/', viewRouter);
app.use('/api', router);



module.exports = app;