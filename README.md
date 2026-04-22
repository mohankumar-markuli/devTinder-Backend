# devTinder-Backend

## authRouter

    POST /signup
    POST /login
    POST /logout

## profileRouter

    GET /profile/views
    PATCH /profile/edit
    PATCH /profile/password

## ConnectRequestRouter

    POST /request/send/interested/:userId
    POST /request/send/ignore/:userId

    insted use dynamic API
    POST /request/send/:status/:userId

    POST /request/review/accepted/:requestId
    POST /request/review/rejected/:requestId

    insted use dynamic API
    POST /request/review/:status/:userId

## userRouter

    GET /user/connections
    GET /user/request/received
    GET /user/feed

Status - ignore, interested, accepted, rejected
