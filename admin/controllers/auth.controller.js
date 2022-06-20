import { Admin } from '../models/index.js';
import { randomStringFromCrypto } from "../helpers/uniqueGenerator.js";
import { messagePusher } from "../middlewares/message.middleware.js";
import { redisSet, redisGet } from "../../database/redisDb.js";
import { comparePassword } from "../helpers/password.js";

export const loginGetController = (req, res) => {
    const next = req.query.next || "/admin";
    const csrfToken = randomStringFromCrypto(16);
    redisSet(csrfToken, "csrfToken", 60 * 1); // 1 minute

    const resParams = {
        pagePath: "Login",
        title: "Login",
        csrfToken: csrfToken,
        next: next,
    };
    res.render("pages/auth/login", resParams);
}

export const loginPostController = async (req, res) => {
    const { email, password, csrfToken, next } = req.body;
    if (email && password) {
        if (csrfToken) {
            const csrfTokenFromRedis = await redisGet(csrfToken);
            if (csrfTokenFromRedis) {
                const user = await Admin.findOne({ email: email });
                if (user) {
                    const isPasswordCorrect = await comparePassword(password, user.password);
                    if (isPasswordCorrect) {
                        user.password = undefined;
                        user.__v = undefined;
                        user.createdAt = undefined;
                        user.updatedAt = undefined;

                        // Set session
                        req.session.user = user;
                        messagePusher(req, "success", "Login success");
                        return res.redirect(next);
                    } else {
                        messagePusher(req, "danger", "Email & Password incorrect");
                    }
                } else {
                    messagePusher(req, "danger", "Email & Password incorrect");
                }
            } else {
                messagePusher(req, "danger", "CSRF token expired");
            }
        } else {
            messagePusher(req, "danger", "CSRF token not found");
        }
    } else {
        messagePusher(req, "danger", "Email and password required");
    }
    return res.redirect("/admin/login");
}

export const logoutController = (req, res) => {
    req.session.destroy();
    messagePusher(req, "success", "Logout successfully");
    return res.redirect("/admin/login");
}