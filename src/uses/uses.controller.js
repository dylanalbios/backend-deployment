const uses = require("../data/uses-data");
const urls = require("../data/urls-data");

// list
function list(req, res) {
  res.json({ data: uses });
};

// read
function read(req, res) {
  res.json({ data: res.locals.use });
};


// use exists
function useExists(req, res, next) {
  const { urlId, useId } = req.params;

  if (urlId) {
    const foundUrl = urls.find((url) => url.id === Number(urlId));
    const foundUse = uses.find(
      (use) => use.id === Number(useId) && use.urlId === Number(urlId)
    );

    if (!foundUrl || !foundUse) {
      return next({
        status: 404,
        message: `Use ${useId} for url ${urlId} not found.`,
      });
    }
    
    res.locals.use = foundUse;
    next();
  } else {
    const foundUse = uses.find((use) => use.id === Number(useId));

    if (!foundUse) {
      return next({
        status: 404,
        message: `Use ${useId} not found.`,
      });
    }

    res.locals.use = foundUse;
    next();
  }
};

// get single use
function getUse(req, res) {
  const { useId } = req.params;

  const foundUse = uses.find((use) => use.id === Number(useId));
  if (foundUse) {
    res.json({ data: foundUse });
  } else {
    res.status(404).json({ error: `Use id not found: ${useId}` });
  }
};

// delete
function destroy(req, res) {
  const { useId } = req.params;
  const index = uses.findIndex((use) => use.id === Number(useId));
  if (index > -1) {
    uses.splice(index, 1);
    res.sendStatus(204);
  }
  res.sendStatus(405);
};

// get all uses unless url param present
function getAllUses(req, res, next) {
  const { urlId } = req.params;

  if (urlId) {
    const foundUrl = urls.find((url) => url.id === Number(urlId));
    if (!foundUrl) {
      return res.status(404).json({
        error: `Short URL id not found: ${urlId}`,
      });
    }

    const filteredUses = uses.filter((use) => use.urlId === Number(urlId));
    res.json({
      data: filteredUses,
    });
  } else {
    res.json({
      data: uses,
    });
  }
};

module.exports = {
  list,
  read,
  getUse: [useExists, getUse],
  delete: [useExists, destroy],
  getAllUses,
};
