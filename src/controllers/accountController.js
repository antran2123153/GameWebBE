const Account = require("../models/Account");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const body = JSON.parse(req.body);

    const account = await Account.findOne({ username: body.username });
    if (!account) return res.status(400).send("Username is not found");

    const checkValid = await bcrypt.compare(body.password, account.password);
    if (!checkValid) return res.status(400).send("Invalid password");

    const token = jwt.sign({ _id: account._id }, process.env.TOKEN_SECRET);
    res.status(200).send({ token });
  } catch (error) {
    res.send(error.message);
  }
};

exports.register = async (req, res) => {
  try {
    const body = req.body;

    const checkUsername = await Account.findOne({
      username: body.username,
    });
    if (checkUsername) return res.status(400).send("Username already !!");

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(body.password, salt);
    let model = new Account({
      fullname: body.fullname,
      birthday: body.birthday,
      username: body.username,
      password: hashPassword,
    });
    model
      .save()
      .then((account) => {
        const token = jwt.sign({ _id: account._id }, "12bfo128b12olqk2bff");
        res.status(200).send({ token });
      })
      .catch((error) => {
        res.send(error.message);
      });
  } catch (error) {
    res.send(error.message);
  }
};

exports.get = async (req, res) => {
  try {
    const account = jwt.verify(req.header("token"), process.env.TOKEN_SECRET);
    const _id = account._id;
    console.log(_id);
    Account.findById(_id)
      .exec()
      .then((info) => {
        res.status(200).send(info);
      })
      .catch((error) => res.send(error.message));
  } catch (error) {
    res.send(error.message);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const account = jwt.verify(req.header("token"), process.env.TOKEN_SECRET);
    const _id = account._id;
    Account.deleteOne({ _id: _id })
      .exec()
      .then((result) => {
        res.status(200).json({
          message: "Account deleted !",
        });
      })
      .catch((error) => res.send(error.message));
  } catch (error) {
    res.send(error.message);
  }
};

exports.update = async (req, res, next) => {
  try {
    const account = jwt.verify(req.header("token"), process.env.TOKEN_SECRET);
    console.log(account);
    const _id = account._id;
    const info = await Account.findOne({ _id: _id });

    const validPass = await bcrypt.compare(req.body.password, info.password);
    if (!validPass) return res.status(400).send("Invalid password");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.newpassword, salt);

    const newAccount = new Account({
      _id: _id,
      fullname: req.body.fullname,
      birthday: req.body.birthday,
      username: req.body.username,
      password: hashPassword,
    });

    Account.findByIdAndUpdate(_id, newAccount, { new: true })
      .exec()
      .then((data) => {
        res.status(200).json({ data });
      })
      .catch((error) => res.send(error.message));
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
