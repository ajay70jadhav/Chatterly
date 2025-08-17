//in it you can define function that will add users in database
import { response } from "express";
import user from "../model/user.js";
export const addUser = async (req, res) => {
  try {
    let exist = await user.findOne({ sub: req.body.sub });
    if (exist) {
      res.status(200).json({ msg: "user alredy exist" });
      return;
    }
    const newUser = new user(req.body);
    await newUser.save();
    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await user.find({});
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
