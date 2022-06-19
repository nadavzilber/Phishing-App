import express from "express"
import {insertSeedEmails, getPhishingEmails, phishingLinkClicked, sendPhishingEmail} from "../controllers/email.js";
import {isAuthorized} from "../middleware/auth.js";
import {clearCollection} from "../controllers/email.js";
export const emailRouter = express.Router()

emailRouter.get('/seed', insertSeedEmails)

emailRouter.get('/clear', clearCollection)

emailRouter.post('/send', isAuthorized, sendPhishingEmail)

emailRouter.get('/phish', phishingLinkClicked)

emailRouter.get('/', isAuthorized, getPhishingEmails)
