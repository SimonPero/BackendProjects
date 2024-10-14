import base64 from "base-64"

function decodedCredentials(authHeader) {
    const encodedCredentials = authHeader.trim().replace(/Basic\s+/i, "")
    const decodedCredentials = base64.decode(encodedCredentials)
    return decodedCredentials.split(":")
}   

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || ""
    const [username, password] = decodedCredentials(authHeader)
    if (username === "admin" && password === "admin") {
        return next()
    }
    res.set("WWW-Authenticate", "Basic realm='use_pages'")
    res.status(401).send("Authentication required.")
}