const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const jwtVariable = require('../variables/jwt');
const randToken = require('rand-token');
const helper = require('../_helpers/jwt.helper');
const resp = require('../variables/response');
const cart = require('../carts/cart.service');

let register = async (req) => {
    console.log(req.body)
    let user = await findUser(req.body);
    if (user !== null) {
        return false
    }

    bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) { return next(err); }

        let newUser = {
            email: req.body.email,
            password: hash,
            role: "customer",
            address: req.body.address,
            phone: req.body.phone,
            fullName: req.body.fullName
        }

        const user = new db.User(newUser);
        await user.save();

        const cart = new db.Cart({ userId: user.id, status: 0 });
        await cart.save();
    })

    return true
}

let login = async (req) => {
    let user = await findUser(req.body);
    if (user === null) {
        return resp.response(false, 100, "Tài khoản không tồn tại", {})

    } else {
        let comparePass = await bcrypt.compare(req.body.password, user.password);
        if (comparePass === false) {
            return resp.response(false, 100, "Mật khẩu không chính xác", {})
        } else {
            const accessTokenLife =
                process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret =
                process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

            const dataForAccessToken = {
                userId: user.id,
                email: user.email
            };
            const accessToken = await helper.generateToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            );

            if (!accessToken) {
                return res
                    .status(401)
                    .send('Đăng nhập không thành công, vui lòng thử lại.');
            }

            let refreshToken = randToken.generate(jwtVariable.refreshTokenSize); // tạo 1 refresh token ngẫu nhiên
            if (!user.refreshToken) {
                // Nếu user này chưa có refresh token thì lưu refresh token đó vào database
                user.refreshToken = refreshToken
                await user.save();
            } else {
                // Nếu user này đã có refresh token thì lấy refresh token đó từ database
                refreshToken = user.refreshToken;
            }

            user.password = ""

            const cart = await db.Cart.findOne({
                where: {
                    userId: user.id
                }
            });


            return resp.response(true, null, "", { user: user, accessToken: accessToken, refreshToken: refreshToken, cart: cart });
        }
    };
};

let isLogging = async (req) => {
    if (req.session && req.session.user) {
        return true;
    } else {
        return false;
    }
}

let findUser = async (body) => {
    const user = await db.User.findOne({
        where: {
            email: body.email
        }
    })

    return user;
}

let logout = async (req) => {
    const current = req.user;
    console.log(current);
    const user = await db.User.findOne({
        where: {
            id: current.userId
        }
    });

    user.accessToken = "";
    user.refreshToken = "";
    await user.save();

    return resp.response(true, null, "Logedout successfully", {});
}

module.exports = {
    register,
    login,
    logout,
    isLogging
};