const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const promisify = require('util').promisify;
const sign = promisify(jwt.sign).bind(jwt);
const verify = promisify(jwt.verify).bind(jwt);
const jwtVariable = require('../variables/jwt');
const {SALT_ROUNDS} = require('../variables/auth');
const randToken = require('rand-token');
const helper = require('./user.helper');

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
        }

        const user = new db.User(newUser);
        await user.save();
    })

    return true
}

let login = async (req) => {
    console.log(req.body)
    let user = await findUser(req.body);
    console.log(user)
    if (user === null) {
        return {
            isSuccess: false,
            message: "Tài khoản không tồn tại",
            data: {}
        };
    } else {
        let comparePass = await bcrypt.compare(req.body.password, user.password);
        if (comparePass === false) {
            return {
                isSuccess: false,
                message: "Mật khẩu không chính xác",
                data: {}
            };
        } else {
            const accessTokenLife =
                process.env.ACCESS_TOKEN_LIFE || jwtVariable.accessTokenLife;
            const accessTokenSecret =
                process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

            const dataForAccessToken = {
                username: user.id,
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

            return {
                isSuccess: true,
                message: "",
                data: {
                    user: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken
                }
            };
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


let isAuth = async (req, res, next) => {
    const accessTokenFromHeader = req.headers.x_authorization;
    if (!accessTokenFromHeader) {
        return res.status(401).send('Không tìm thấy access token!');
    }

    const accessTokenSecret =
        process.env.ACCESS_TOKEN_SECRET || jwtVariable.accessTokenSecret;

    const verified = await authMethod.verifyToken(
        accessTokenFromHeader,
        accessTokenSecret,
    );

    if (!verified) {
        return res
            .status(401)
            .send('Bạn không có quyền truy cập vào tính năng này!');
    }

    const user = await userModle.getUser(verified.payload.username);
    req.user = user;

    return next();
};

module.exports = {
    register,
    login,
    isLogging,    
    isAuth
};