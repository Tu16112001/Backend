const db = require('_helpers/db');
const resp = require('../variables/response');
const { Op } = require("sequelize");

/*Crud*/
let create = async (params) => {
  const exist = await _checkExisting({ title: params.title, categoryId: params.categoryId });

  if (exist != null) {
    let result = resp.response(false, 100, "The product is existing", {});
    return result;
  }

  const product = new db.Product(params);
  await product.save();

  return resp.response(true, null, "", { product: product });
}

let _checkExisting = async (params) => {
  const product = await db.Product.findOne({
    where: {
      title: params.title,
      categoryId: params.categoryId
    }
  });

  return product;
}

let update = async (id, params) => {
  const product = await db.Product.findByPk(id);

  if (product == null) {
    return resp.response(false, 100, "Product not found", {});
  }

  Object.assign(product, params);
  await product.save();

  return resp.response(true, null, "Product updated", {});
}

let deleteOne = async (id) => {
  const product = await db.Product.findByPk(id);
  if (!product) {
    return resp.response(false, 100, "Product not found", {});
  }

  product.isAvailable = false
  await book.save();

  return resp.response(true, null, "Deleted product", {});
}

/* Queries */

let getById = async (id) => {
  const product = await db.Product.findByPk(id);
  if (!product || product.isAvailable != true) {
    return resp.response(false, 100, "Product not found", {});
  }

  return resp.response(true, null, "", { product: product });
}

let getProduct = async (req) => {
  let orderField = req.query.orderField || "id";
  let pageSize = parseInt(req.query.pageSize) || 15;
  let pageNum = parseInt(req.query.pageNum) || 0;
  let sortby = (req.query.sortby || "desc").toUpperCase();
  let categoryId = parseInt(req.query.categoryId);

  console.log(categoryId);
  var wh = {}
  if (categoryId != null && categoryId != NaN && categoryId >= 0) {
    wh = {
      isAvailable: true,
      categoryId: categoryId,
    }
  } else {
    wh = {
      isAvailable: true,
    }
  }

  const { count, rows } = await db.Product.findAndCountAll({
    order: [[orderField, sortby]],
    where: wh,
    offset: pageNum * pageSize,
    limit: parseInt(pageSize),
  });

  return resp.response(true, null, "", { total: count || 0, products: rows || [] });
}

let searchProduct = async (req) => {
  let pageSize = parseInt(req.query.pageSize) || 15;
  let pageNum = parseInt(req.query.pageNum) || 0;
  let keyword = req.query.keyword || ""

  if (keyword == "") {
    return resp.response(true, null, "", { total: 0, products: [] });
  }

  console.log('START SEARCH');
  const { count, rows } = await db.Product.findAndCountAll({
    where: {
      title: {
        [Op.like]: keyword + '%'
      }
    },
    offset: pageNum * pageSize,
    limit: parseInt(pageSize),
  });

  return resp.response(true, null, "", { total: count || 0, products: rows || [] });
}

module.exports = {
  create,
  update,
  deleteOne,
  getById,
  getProduct,
  searchProduct
};

/*QUERY*/

/*
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
*/