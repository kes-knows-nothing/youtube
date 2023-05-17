import bcrypt from "bcrypt";
import User from "../models/User";

export const getJoin = (req, res) => {
    
    return res.render("join", {pageTitle:"Create Account"})
}

export const postJoin = async (req, res) => {
    const { name, username, email, password, password1, location } = req.body;
    const pageTitle = "Join";
    if (password !== password1) {
        return res.status(400).render("join", {pageTitle, errorMessage: "Password confirmation does not match"});
    }
    const exists = await User.exists({ $or: [{username}, {email}]})
    if (exists) {
        return res.status(400).render("join", {pageTitle, errorMessage: "This username/email is already taken."});
    }
   try {
    await  User.create({
        name,
        username,
        email,
        password,
        location
    })
    return res.redirect("/login")
   } catch(error) {
    return res.status(400).render("join", {pageTitle, errorMessage: "Unknown Error Occurs"});
   }
}


export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "Login"})
}

export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const exists = await User.exists({ username })
    if (!exists) {
        return res.status(404).render("login", {pageTitle: "Login Error", errorMessage: "The username does not exist."});
    } 
    const user = await User.findOne({ username })
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(404).render("login", {pageTitle: "Login Error", errorMessage: "You got wrong password!"})
    }
    
    req.session.loggedIn = true;
    req.session.user = user
    return res.redirect("/")
}

export const edit = (req, res) => {
    res.render("editprofile")
}

export const remove = (req, res) => {
    res.render("remove")
}

export const profile = (req, res) => {
    res.render("profile")
} 