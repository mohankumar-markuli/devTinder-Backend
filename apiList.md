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
    POST /request/review/accepted/:requestId
    POST /request/review/rejected/:requestId

## userRouter
    GET /user/connections
    GET /user/request/received
    GET /user/feed - Gets the 

Status - ignore, intrested, accepted, rejected