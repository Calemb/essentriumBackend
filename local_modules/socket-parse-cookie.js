const parseCookie = (settings, cookieHeader) => {
  var cookieParserer = settings.cookieParser(settings.secret);
  var req = {
    headers: {
      cookie: cookieHeader
    }
  };
  var result;
  cookieParserer(req, {}, function (err) {
    if (err) throw err;
    result = req.signedCookies || req.cookies;
  });
  return result;
}

module.exports = parseCookie