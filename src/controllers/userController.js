import bcrypt from "bcrypt";
import fetch from "node-fetch";
import User from "../models/User";
import Video from "../models/Video";

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
    const exists = await User.exists({ username, socialOnly: false })
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

export const startGibhubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize"
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    }
    const params =  new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    return res.redirect(finalUrl);
};

export const finishGibhubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params =  new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`
    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json"
        },
    })).json();
    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`
            }
        }
        )).json();
       
        const emailData = await(
            await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`
            },
        })).json();
        
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            return res.redirect("login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if(!user){
            user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
        } 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
        
    }else {
        return res.redirect("login");
    }
};

export const logout = (req, res) => {
    req.session.destroy()
    return res.redirect("/");
}

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" , user: req.session.user})
}

export const postEdit = async (req, res) => {
    const {
        body: { name, email, username, location,},
        file,
        session: {
          user: { _id, avatarUrl },
        },
      } = req;
      console.log(file)
    const findUsername = await User.findOne({ username });
    const findEmail = await User.findOne({ email });
    if (
        (findUsername != null && findUsername._id != _id) ||
        (findEmail != null && findEmail._id != _id)
        ) {
      return res.render("edit-profile", {
        pageTitle: "Edit  Profile",
        errorMessage: "User is exist",
      });
    }

    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? file.path : avatarUrl,
        name, email, username, location}, {new: true})
    req.session.user = updateUser;
    return res.render("edit-profile", { pageTitle: "Profile"})
}

export const remove = (req, res) => {
    res.render("remove")
}

export const profile = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found."});
    }
    console.log(user)
    return res.render("profile", {pageTitle: `${user.name}'s Profile`, user})
} 



export const getChangepassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("change-password", { pageTitle: "Change Password"})
}

export const postChangepassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword1, newPassword },
        session: {
          user: { _id },
        },
      } = req;
    const user = await User.findById({_id});
    if (newPassword !== newPassword1) {
        return res.status(400).render("change-password", {pageTitle, errorMessage: "Password confirmation does not match"});
    }
    const match = await bcrypt.compare(user.password, oldPassword)
    if (!match) {
        return res.status(404).render("login", {pageTitle: "Login Error", errorMessage: "The current password is incorrect!"})
    }
    user.password = newPassword
    await user.save();
    return res.redirect("/users/logout")
}