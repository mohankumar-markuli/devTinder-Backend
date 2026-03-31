
const userAuth = (req,res,next)=>{
    console.log("user auth started");
    const token = "abcsdf";
    const isAdminAuthd = token === "abc";
    if(!isAdminAuthd){
        res.status(401).send("Unauthoried request");
    }else{
        next();
    }
};


module.exports = {
    userAuth
};