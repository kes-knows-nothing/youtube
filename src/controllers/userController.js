import User from "../models/User";

export const getJoin = (req, res) => {
    
    return res.render("join", {pageTitle:"Create Account"})
}

export const postJoin = async (req, res) => {
    const { name, username, email, password, location } = req.body;
    await  User.create({
        name,
        username,
        email,
        password,
        location
    })
    return res.redirect("/login")
}


export const login = (req, res) => {
    return res.render("login")
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