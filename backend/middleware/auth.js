// import jwt from 'jsonwebtoken';

// const authMiddleware = async (req, res, next) => {
//     const { token } = req.headers;
//     if (!token) {
//         return res.json({success:false,message:'Not Authorized Login Again'});
//     }
//     try {
//         const token_decode =  jwt.verify(token, process.env.JWT_SECRET);
//         req.body.userId = token_decode.id;
//         next();
//     } catch (error) {
//         return res.json({success:false,message:error.message});
//     }
// }


import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
    let authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded_token = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded_token.id; // safer than modifying req.body
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: "Invalid Token" });
    }
};



export default authMiddleware;
