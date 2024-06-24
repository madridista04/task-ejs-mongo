const { ValidationError } = require('express-validation')

exports.notFoundHandler = (req, res, next) => {
  if(req.url === "/") {
    return res.redirect('/users/login');
  } else {
    return res.redirect('/users/login');
  }
}


const getErrorMessage = (err) => {
  for(let entity of ['query', 'body', 'params']) {
    if (err.details[entity]) {
      return err.details[entity][0].message;
    } 
  }
}

exports.errorHandler = (err, req, res, next) => {
  let errorMessage = err.message;
  const url = req.url;

  if (err instanceof ValidationError || err.name === 'ValidationError') {
    errorMessage = getErrorMessage(err);
    req.flash('error', errorMessage);
    return res.redirect(url);
  }
  req.flash('error', errorMessage);
  // console.log(err);
  return res.redirect(url);
}