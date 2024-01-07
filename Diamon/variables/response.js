
let response = (isSucess, errorCode, messsage, data) => {
    let res = {
        isSucess: isSucess,
        errorCode: errorCode,
        messsage: messsage,
        data: data
    }

    return res
}

let create = (isSucess, errorCode, messsage, data) => {
    let res = {
        isSucess: isSucess,
        errorCode: errorCode,
        messsage: messsage,
        data: data
    }

    return res
}

module.exports = {
    response,
    create
}