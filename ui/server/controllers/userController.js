
const userModel = require("../models/userModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const axios = require('axios');

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.json({ msg: "Incorrect Username or Password", status: false });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck)
      return res.json({ msg: "Username already used", status: false });
    const emailCheck = await User.findOne({ email });
    if (emailCheck)
      return res.json({ msg: "Email already used", status: false });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      username,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (ex) {
    next(ex);
  }
};
async function createChatGptUser()
{
  const username = 'ChatGPT';

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return 'ChatGPT User already exists'
  }
  const email = 'chatGpt@dfs.org';
  const hashedPassword = await bcrypt.hash('password1234', 10);

  const user = await User.create({
    email,
    username,
    password: hashedPassword,
    status:1,
    isAvatarImageSet : true,
    avatarImage :  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMzEgMjMxIj48cGF0aCBkPSJNMzMuODMsMzMuODNhMTE1LjUsMTE1LjUsMCwxLDEsMCwxNjMuMzQsMTE1LjQ5LDExNS40OSwwLDAsMSwwLTE2My4zNFoiIHN0eWxlPSJmaWxsOiMxODEyODQ7Ii8+PHBhdGggZD0ibTExNS41IDUxLjc1YTYzLjc1IDYzLjc1IDAgMCAwLTEwLjUgMTI2LjYzdjE0LjA5YTExNS41IDExNS41IDAgMCAwLTUzLjcyOSAxOS4wMjcgMTE1LjUgMTE1LjUgMCAwIDAgMTI4LjQ2IDAgMTE1LjUgMTE1LjUgMCAwIDAtNTMuNzI5LTE5LjAyOXYtMTQuMDg0YTYzLjc1IDYzLjc1IDAgMCAwIDUzLjI1LTYyLjg4MSA2My43NSA2My43NSAwIDAgMC02My42NS02My43NSA2My43NSA2My43NSAwIDAgMC0wLjA5OTYxIDB6IiBzdHlsZT0iZmlsbDojZjVhYTc3OyIvPjxwYXRoIGQ9Im0xNDEuNzUgMTk1YTExNC43OSAxMTQuNzkgMCAwIDEgMzggMTYuNSAxMTUuNTMgMTE1LjUzIDAgMCAxLTEyOC40NiAwIDExNC43OSAxMTQuNzkgMCAwIDEgMzgtMTYuNWwxNS43MSAxNS43NWgyMXoiIHN0eWxlPSJmaWxsOiMyMTIxMjE7Ii8+PHBhdGggZD0ibTg5LjI5MSAxOTVhMTE0Ljc5IDExNC43OSAwIDAgMC0zOC4wMDIgMTYuNSAxMTUuNTMgMTE1LjUzIDAgMCAwIDM4LjAwMiAxNi40ODJ6bTUyLjQzNCAwdjMyLjk4MmExMTUuNTMgMTE1LjUzIDAgMCAwIDM4LTE2LjQ4MiAxMTQuNzkgMTE0Ljc5IDAgMCAwLTM4LTE2LjV6IiBzdHlsZT0iZmlsbDojZmZmOyIvPjxwYXRoIGQ9Im0xNTcuMTUgMTk5Ljc1YzAuMjU0OCA3LjQ1MDEgMS41NCAxNC44NTUgNC45NTEyIDIxLjQzMmExMTUuNTMgMTE1LjUzIDAgMCAwIDE3LjYxOS05LjY3OTcgMTE0Ljc5IDExNC43OSAwIDAgMC0yMi41Ny0xMS43NTJ6bS04My4yOTUgMmUtM2ExMTQuNzkgMTE0Ljc5IDAgMCAwLTIyLjU3IDExLjc1IDExNS41MyAxMTUuNTMgMCAwIDAgMTcuNjIxIDkuNjc5N2MzLjQxMS02LjU3NjUgNC42OTQ0LTEzLjk4IDQuOTQ5Mi0yMS40M3oiIHN0eWxlPSJmaWxsOiMyMTIxMjE7Ii8+PHBhdGggZD0ibTk5LjE5NyAyMDQuOTd2MmUtM2wxNi4zMDIgMTYuMzAxIDE2LjMwMS0xNi4zMDF2LTJlLTN6IiBzdHlsZT0iZmlsbDojZmZmOyIvPjxwYXRoIGQ9Im0xMTUuNSA1MS43NWMtMzguNzAyIDUuMzEwMS01NC4yMTUgMTguMDM4LTU5Ljg2MyAzNS4xMDEiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6I0ZGRkFBRDsiLz48cGF0aCBkPSJtMTE1LjUgNTEuNzVjLTcuODM5MyAzLjYzMzctNS41OTc0IDE2LjU4My0xNC4zNDEgMjMuNDUyIiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTExMS4zNSA0OC42MTRjLTIyLjYzNC02LjkxODEtNDIuNDU3LTMuMTk4OC01NS43MzMgMi41MTA1IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTExNS40NyA1NC4wMDhjMC4xOTY1LTYuNzc3NC0wLjE0MzYtMjYuMzA5IDAuMDUtMzguMTg0IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTY4Ljg3NCAyOC4xNzdjMzQuMTE1LTMuMzgyIDQxLjk4NyAxMy4zMjEgNDUuMTcgMTkuNjAyIiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTExNi40OSA0OC42OWMyLjg4NzYtNi4zMDE5IDEwLjM1OC0yMS41MTggNDMuNDY5LTIyLjMyNiIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojRkZGQUFEOyIvPjxwYXRoIGQ9Im0xMTYuOTIgNTEuNzY2YzEuNTA5NCA2LjM5OTEgMy40OTg4IDE1LjU5NSAxMC4wODggMjMuMDU4IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTExMy44MSA1MS41MzJjMjIuMDMtNy44Njc0IDQ2LjcwOS03LjM2MTQgNTkuNDQ0LTIuMDQ2NSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZTojRkZGQUFEOyIvPjxwYXRoIGQ9Im0xMTQuNTMgNTIuMjc4YzM2LjIyNiA0Ljg1ODMgNTIuNDE0IDE3LjA5MiA1OS4zNzMgMzMuMzQ3IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTU1LjYzNyA4Ni44NTFjLTQuMTIxMyAxMi40NTItMi45ODc3IDI3LjIxMy0xLjc3NyA0My4wODQiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6I0ZGRkFBRDsiLz48cGF0aCBkPSJtNTUuNjE0IDUxLjEyNGMtMTMuNDIyIDUuNTAxOS0yMS45MDggMTYuNDA5LTI0LjcxMiAyOC43NzQtMS44MzIyIDguNDYzMi0xLjk4MDkgMTguMTU2LTEuNjA5NiAyOC40ODYiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6I0ZGRkFBRDsiLz48cGF0aCBkPSJtMTczLjI2IDQ5LjQ4NmMyNC45MTcgMTAuMzk5IDI2LjcwNyAzNi41MzcgMjcuMjA5IDU5LjYyIiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTE3My45IDg1LjYyNWM1LjQwNDIgMTIuNjI1IDUuMjQxMyAyNy42NzUgNC41NzQ1IDQzLjU4IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOiNGRkZBQUQ7Ii8+PHBhdGggZD0ibTUzLjg2IDEyOS45M2MxLjI5MyAxNi45NTEgMi42NzM4IDM1LjE2OS0yLjE2NjQgNTMuMTkzIiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOm5vbmU7Ii8+PHBhdGggZD0ibTI5LjI5MiAxMDguMzhjMC42MTczIDE3LjE3NyAyLjY3MjIgMzYuMTE5IDAuODE1OCA1NC4xMDgiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6bm9uZTsiLz48cGF0aCBkPSJtMjAwLjQ3IDEwOS4xMWMwLjM1ODYgMTguNTI5LTEuMjc1MSAzNi45NCAxLjkyMzEgNDguOTg1IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlOm5vbmU7Ii8+PHBhdGggZD0ibTE3OC40OCAxMjkuMmMtMC43Mjc5IDE3LjM2Mi0yLjA1NjMgMzUuNzQzIDIuNjAxMSA1My4wOTkiIHN0eWxlPSJmaWxsOm5vbmU7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS13aWR0aDoxMjtzdHJva2U6bm9uZTsiLz48bGluZSB4MT0iODUuMjkiIHgyPSI4NS4yOSIgeTE9Ijk4LjczIiB5Mj0iMTA5Ljc5IiBzdHlsZT0iZmlsbDpub25lO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6OC43OTk5cHg7c3Ryb2tlOmJsYWNrOyIvPjxwYXRoIGQ9Im0xMDguMjggNzIuMTZoNjIuMThjOS4xOSAwIDEzLjMyIDEuMjEgMTQuNzEgOC41MiAzLjYxIDE4Ljk1IDIuMiAzMy40OS0wLjQ0IDQzLjc1YTY1LjA3IDY1LjA3IDAgMCAxLTUuODkgMTQuNzggNzMuNTIgNzMuNTIgMCAwIDEtNy4wNiAxMC4yNmMtMS44IDIuMjctNS4xNyAxLjIxLTQuMTktMS4wOSAwLjE0LTAuNDcgMC4yNy0xIDAuNC0xLjQ4YTE0LjI5IDE0LjI5IDAgMCAwIDAuNTItNi42MiAxMi41MiAxMi41MiAwIDAgMC0zLjg4LTYuM2MtNC4xNy0zLjktMTIuODEtOC43MS0zMi41My0xMy42Ni02LjQtMS42LTEwLjY5LTIuMjQtMTEuNzYtMi43OWE3LjA4IDcuMDggMCAwIDEtMy44NS02LjMxdi05YzAtMi4zOSAwLjE4LTQuNTUtMS41Ni02LjU3cy00LjE2LTIuMTMtNi42NS0yLjE0YTYgNiAwIDAgMS02LTZ2LTkuMzVhNiA2IDAgMCAxIDYtNnoiIHN0eWxlPSJmaWxsOiMxZGY3ZmY7b3BhY2l0eTowLjY0OyIvPjxwYXRoIGQ9Im0xMzUuOSA5OC43M3Y5LjI3bTE1LjIyLTkuMjl2OS4yOSIgc3R5bGU9ImZpbGw6bm9uZTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLXdpZHRoOjcuNzk5OHB4O3N0cm9rZTojZmNmZjJjOyIvPjxwYXRoIGQ9Im0xMTUuNjggMTYwLjY0YzcuMDggMCAxMy4xMS00LjkzIDE1LjQ2LTExLjg0YTIuMTQgMi4xNCAwIDAgMC0xLjUxLTIuNjEwMSAyLjMgMi4zIDAgMCAwLTAuNzM5OTUtMC4wNTkzaC0yNi40MmEyLjEyIDIuMTIgMCAwIDAtMi4zMSAxLjkwOTkgMS44NSAxLjg1IDAgMCAwIDAuMDU5MyAwLjczOTk1YzIuMzQwMSA2LjkzMDEgOC4zODAyIDExLjg2IDE1LjQ2IDExLjg2eiIgc3R5bGU9ImZpbGw6IzFhMWExYTsiLz48L3N2Zz4="
  });
  delete user.password;
}
module.exports.getAllUsers = async (req, res, next) => {
  try {
    await createChatGptUser();
    const users = await userModel
      .find({
        _id: { $ne: req.params.id },
        status: { $eq: 1 } 
      })
      .select(["email", "username", "avatarImage", "_id", "status"]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};



module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};

module.exports.logOut = (req, res, next) => {
  try {
    if (!req.params.id) return res.json({ msg: "User id is required " });
    onlineUsers.delete(req.params.id);
    return res.status(200).send();
  } catch (ex) {
    next(ex);
  }
};
