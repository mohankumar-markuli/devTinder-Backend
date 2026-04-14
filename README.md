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
    POST /request/send/intrested/:userId
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
    GET /user/feed - Gets the 

Status - ignore, intrested, accepted, rejected