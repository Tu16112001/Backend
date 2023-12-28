const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const { Op } = require("sequelize");
const { trace } = require("joi");


CURRENT_ANDROID_BUILD = 114
DEMO_KEY = 1000000


module.exports = {
  getHomePageAndroid,
  getHomePage,
  getAll,
  getByGenre,
  getById,
  create,
  createMultiple,
  update,
  delete: _delete,
  increaseReadCount,
  updateLovedBook,
  updateReadCount,
  getByGenreIdand
};

async function getAll() {
  return await db.Book.findAll({
    where: {
      key: {
        [Op.lt]: DEMO_KEY
      }
    },
    include: [
      {
        model: db.Audio,
        as: "audios",
      },
    ],
  });
}

async function getHomePage() {
 
  const { count, rows } = await db.Genre.findAndCountAll({
    order: [["order", "ASC"]],
  });

  const [results, metadata] = await db.sequelize.query("SELECT * FROM Books ORDER BY RAND() DESC LIMIT 200;");
  const rels = [];
  const original = results || [];
  for (var i = 0; i < original.length; i++) {
    const book = original[i];
    const exist = rels.filter(b => b.genre_id == book.genre_id);
    console.log(exist);
    if (exist && exist.length == 0 && book.key < DEMO_KEY) {
      rels.push(book);
    }

    if (rels.length == rows.length) {
      break
    }
  }

  let rates = await getTopRate(false);
  let news = await getTopNew(false);
  
  let appConfig = {
    coverUrl: "http://103.166.182.247:4000/sachhay/cover/", 
    epubUrl: "https://storage.googleapis.com/sach_hay/books/"
  }

  return {
    status: 200,
    genres: rows || [],
    recommends: rels,
    topRates: rates || [],
    newReleases: news || [],
    appConfig: appConfig
  };
}

async function getHomePageAndroid(req) {
  let build = parseInt(req.query.buildNum) || 0;
  let isDemo = build > CURRENT_ANDROID_BUILD;
  
  const { count, rows } = await db.Genre.findAndCountAll({
    order: [["order", "ASC"]],
  });

  let sql = ""
  if (isDemo) {
    sql = "SELECT * FROM sachhay.Books WHERE  Books.readCount IN (SELECT max(Books.readCount) FROM sachhay.Books WHERE Books.key > 1000000 GROUP BY genre_id) ORDER BY readCount DESC;"
  } else {
    sql = "SELECT * FROM sachhay.Books WHERE  Books.readCount IN (SELECT max(Books.readCount) FROM sachhay.Books WHERE Books.key < 1000000 GROUP BY genre_id) ORDER BY readCount DESC;"
  }
  const [results, metadata] = await db.sequelize.query(sql);

  const rels = [];
  const original = results || [];
  for (var i = 0; i < original.length; i++) {
    const book = original[i];
    const exist = rels.filter(b => b.genre_id == book.genre_id);
    console.log(exist);
    if (exist && exist.length == 0) {
      rels.push(book);
    }
  }

  let rates = await getTopRate(isDemo);
  let news = await getTopNew(isDemo);
  
  let appConfig = {
    coverUrl: "http://103.166.182.247:4000/sachhay/cover/", 
    epubUrl: "https://storage.googleapis.com/sach_hay/books/"
  }

  return {
    status: 200,
    genres: rows || [],
    recommends: rels,
    topRates: rates || [],
    newReleases: news || [],
    appConfig: appConfig
  };
}


async function getTopRate(isDemo) {
  if (isDemo == true) {
    const { count, rows } = await db.Book.findAndCountAll({
      order: [["readCount", "DESC"]],
      where: {
        key: {
          [Op.gt]: DEMO_KEY
        }
      },
      offset: 0,
      limit: 15,
    });
  
    return rows || [];
  } else {
    const { count, rows } = await db.Book.findAndCountAll({
      order: [["readCount", "DESC"]],
      where: {
        key: {
          [Op.lt]: DEMO_KEY
        }
      },
      offset: 0,
      limit: 15,
    });

    return rows || [];
  }
  
}

async function getTopNew(isDemo) {
  if (isDemo) {
    const { count, rows } = await db.Book.findAndCountAll({
      order: [["id", "DESC"]],
      where: {
        key: {
          [Op.gt]: DEMO_KEY
        }
      },
      offset: 0,
      limit: 15,
    });
    
    return rows || [];
  } else {
    const { count, rows } = await db.Book.findAndCountAll({
      order: [["id", "DESC"]],
      where: {
        key: {
          [Op.lt]: DEMO_KEY
        }
      },
      offset: 0,
      limit: 15,
    });
    
    return rows || [];
  }
}

async function getByGenre(req) {
  return await getByGenreId(req);
}

async function getById(key) {
  return await getBook(key);
}

async function createMultiple(params) {
  params.forEach(book => {
    if (book.readCount ==  100) {
      book.readCount = Math.floor(Math.random() * 5000);
    }
    if (book.loveCount == 100) {
      book.loveCount = Math.floor(Math.random() * 2000);
    }
  });
  await db.Book.bulkCreate(params, {});
}

async function create(params) {
  // validate
  if (await db.Book.findOne({ where: { key: params.key } })) {
    throw 'Book "' + params.key + '" is already registered';
  }

  const book = new db.Book(params);

  // save user
  await book.save();
}

async function update(id, params) {
  const book = await getBook(id);

  // validate
  const keyChanged = params.key && book.key !== params.key;
  if (keyChanged && (await db.Book.findOne({ where: { key: params.key } }))) {
    throw 'Book Id "' + params.key + '" is already registered';
  }

  // copy params to user and save
  Object.assign(book, params);
  await book.save();
}

async function _delete(id) {
  const book = await getBook(id);
  await book.destroy();
}

// helper functions
async function getByGenreId(req) {
  let genreId = parseInt(req.query.genreId);
  if (!genreId) {
    return "Genre Id is required";
  }

  let orderField = req.query.orderField || "readCount";
  let pageSize = parseInt(req.query.pageSize) || 10000000;
  let pageNum = parseInt(req.query.pageNum) || 0;
  let afterId = parseInt(req.query.afterId) || 0;

  const { count, rows } = await db.Book.findAndCountAll({
    order: [[orderField, "DESC"]],
    where: {
      genre_id: genreId,
      id: {
        [Op.gt]: afterId
      },
      key: {
        [Op.lt]: DEMO_KEY
      }
    },
    include: [
      {
        model: db.Audio,
        as: "audios",
      },
    ],
    offset: pageNum * pageSize,
    limit: parseInt(pageSize),
  });

  if (!rows) throw [];
  return {
    status: 200,
    total: count,
    books: rows,
  };
}

async function getByGenreIdand(req) {
  let build = parseInt(req.query.buildNum) || 0;
  let isDemo = build > CURRENT_ANDROID_BUILD;

  let genreId = parseInt(req.query.genreId);
  if (!genreId) {
    return "Genre Id is required";
  }

  let orderField = req.query.orderField || "readCount";
  let pageSize = parseInt(req.query.pageSize) || 10000000;
  let pageNum = parseInt(req.query.pageNum) || 0;
  let afterId = parseInt(req.query.afterId) || 0;

  if (isDemo) {
    const { count, rows } = await db.Book.findAndCountAll({
      order: [[orderField, "DESC"]],
      where: {
        genre_id: genreId,
        id: {
          [Op.gt]: afterId
        },
        key: {
          [Op.gt]: DEMO_KEY
        }
      },
      include: [
        {
          model: db.Audio,
          as: "audios",
        },
      ],
      offset: pageNum * pageSize,
      limit: parseInt(pageSize),
    });
  
    if (!rows) throw [];
    return {
      status: 200,
      total: count,
      books: rows,
    };
  } else {
    const { count, rows } = await db.Book.findAndCountAll({
      order: [[orderField, "DESC"]],
      where: {
        genre_id: genreId,
        id: {
          [Op.gt]: afterId
        },
        key: {
          [Op.lt]: DEMO_KEY
        }
      },
      include: [
        {
          model: db.Audio,
          as: "audios",
        },
      ],
      offset: pageNum * pageSize,
      limit: parseInt(pageSize),
    });
  
    if (!rows) throw [];
    return {
      status: 200,
      total: count,
      books: rows,
    };
  }

}

async function increaseReadCount(id) {
  const book = await getBook(id);
  book.readCount += 1;

  await book.save();
}

async function updateReadCount(id, count) {
  const book = await getBook(id);
  book.readCount = count;

  await book.save();
}

async function updateLovedBook(id, isLoved) {
  const book = await getBook(id);
  if (isLoved == "true") {
    book.loveCount += 1;
  } else {
    book.loveCount -= 1;
  }

  await book.save();
}

async function getBook(id) {
  const book = await db.Book.findByPk(id);
  if (!book) throw "Book not found";
  return book;
}
