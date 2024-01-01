
let response = (isSucess, errorCode, messsage, data) => {
    let res = {
        isSucess: isSucess,
        errorCode: errorCode,
        messsage: messsage,
        data: data
    }

    return res
}

module.exports = {
    response
}