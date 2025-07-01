import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import usersRouter from './routes/users.js';
import mealPlansRouter from './routes/meal-plans.js';
import subscriptionsRouter from './routes/subscriptions.js';
import testimonialsRouter from './routes/testimonials.js';
import adminRouter from './routes/admin.js';
import { initializeDatabase } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Initialize database
initializeDatabase().catch(console.error);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/meal-plans', mealPlansRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  
  // Send JSON response for API routes
  if (req.path.startsWith('/api/')) {
    res.json({
      success: false,
      message: err.message,
      error: req.app.get('env') === 'development' ? err : {}
    });
  } else {
    res.render('error');
  }
});

export default app;