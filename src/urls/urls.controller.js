const urls = require("../data/urls-data");
const uses = require("../data/uses-data");

// create
function create(req, res) {
    const { href } = req.body.data;
    if (!href) {
      return res.status(400).json({ error: "Missing 'href' property." });
    }
    const newUrl = {
      href,
      id: urls.length + 1,
    };
    urls.push(newUrl);
    res.status(201).json({ data: newUrl });

};

// has href
function hasHref(req, res, next) {
    const { data: { href } = {} } = req.body;
  
    if (href) {
      return next();
    }
    next({ status: 400, message: "An 'href' property is required." });
};

// list all urls
function list(req, res) {
    res.json({ data: urls });
};

// verify url exists
function urlExists(req, res, next) {
    const { urlId } = req.params;
    const foundUrl = urls.find((url) => url.id === Number(urlId));
    if (foundUrl) {
        res.locals.url = foundUrl;
        return next();
    }
    next({
        status: 404,
        message: `Url id not found: ${urlId}`,
    });
};

// read
function read(req, res, next) {
    res.json({ data: res.locals.url });
};

// update
function update(req, res, next) {
    const { urlId } = req.params;
    const foundUrl = urls.find((url) => url.id === Number(urlId));
    if (foundUrl) {
        foundUrl.href = req.body.data.href;
        res.status(200).json({ data: foundUrl});
    }   else {
        next({
            status: 404,
            message: `Url id not found: ${urlId}`,
        });
    }
};

// record the use of an existing short URL
function recordUse(req, res, next) {
    const { urlId } = req.params;
    const foundUrl = urls.find((url) => url.id === Number(urlId));
    if (foundUrl) {
      const newUse = {
        id: uses.length + 1,
        urlId: foundUrl.id,
        time: Date.now(),
      };
      uses.push(newUse);
      return next();
    }
    next({
      status: 404,
      message: `Url id not found: ${urlId}`,
    });
};

module.exports = {
    create: [hasHref, create],
    list,
    read: [urlExists, read],
    update: [urlExists, hasHref, update],
    recordUse: [urlExists, recordUse, read],
    urlExists,
};