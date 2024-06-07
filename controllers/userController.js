const express = require("express");
const userTable = require("../models").user;
const accountTable = require("../models").account;
const transactionTable = require("../models").transaction;
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { Op, DATEONLY } = require("sequelize");
const cookieParser = require("cookie-parser");
const { toDefaultValue } = require("sequelize/lib/utils");

const users = async (req, res) => {
  try {
    const isUser = await userTable.findAll();
    if (isUser) {
      return res.status(201).json({ message: "All registered users", isUser });
    }
    return res.status(400).json({ message: "No user found" });
  } catch (error) {
    return res.status(500).json({ messager: "internal server error", error });
  }
};

const updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const { firstName, lastName, phoneNo, address, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 15);
    const isUser = await userTable.findOne({ where: { email } });

    if (isUser) {
      const userUpdate = await userTable.update(
        {
          firstName,
          lastName,
          email,
          phoneNo,
          address,
          password: hashedPassword,
        },
        { where: { email } }
      );
      return res
        .status(201)
        .json({ message: `user ${isUser.firstName} successfully updated` });
    }
    return res
      .status(400)
      .json({ message: `error updating user ${firstName}` });
  } catch (error) {
    return res.status(500).json({ messager: "internal server error", error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { email } = req.params;
    const isUser = await userTable.findOne({ where: { email } });
    const destroyUser = userTable.destroy({ where: { email } });

    if (destroyUser) {
      return res
        .status(201)
        .json({ message: ` user ${isUser.firstName} deleted successfully` });
    }
    return res
      .status(400)
      .json({ message: `error deleting user ${isUser.firstName}` });
  } catch (error) {
    return res.status(500).json({ messager: "internal server error", error });
  }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNo, password, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 15);

    const userExist = await userTable.findOne({
      where: { email },
    });

    if (userExist) {
      console.log("not available");
      return res.status(400).json({ error: "user already exist" });
    }

    const newUser = await userTable.create({
      firstName,
      lastName,
      email,
      phoneNo,
      password: hashedPassword,
      address,
    });

    return res
      .status(201)
      .json({ message: "user created successfully", newUser });
  } catch (error) {
    return res.status(500).json({ messager: "internal server error", error });
  }
};

const createAccount = async (req, res) => {
  try {
    const { email } = req.body;

    const isUser = await userTable.findOne({ where: { email } });
    const isAccount = await accountTable.findOne({ where: { email } });

    console.log(isUser);

    if (!isUser) {
      console.log("hello");
      return res.status(400).json({ message: "user does not exist" });
    }

    if (isAccount) {
      return res.status(400).json({ message: "Account already exist" });
    }
    const acctNumber = await Math.floor(
      Math.random() * 9000000000 + 1000000000
    ).toString();
    const acctName = await `${isUser.firstName} ${isUser.lastName}`;

    console.log("we are here");
    const newAccount = await accountTable.create({
      accountName: acctName,
      email,
      accountBalance: 0.0,
      userId: isUser.id,
      accountNumber: acctNumber,
    });
    return res
      .status(201)
      .json(await { message: "account created successfully", newAccount });
  } catch (error) {
    return res.status(500).json({ messager: "internal server error", error });
  }
};

const makeCredit = async (req, res) => {
  try {
    const { transactionAmount } = req.body;

    const isAccount = await accountTable.findOne({
      where: { accountNumber: req.params.accountNumber },
    });

    if (!isAccount) {
      return res.status(400).json({ message: "Invalid account number" });
    }

    isAccount.accountBalance =
      parseFloat(isAccount.accountBalance) + parseFloat(transactionAmount);
    await isAccount.save();

    const credit = await transactionTable.create({
      accountId: isAccount.id,
      transactionAmount,
      transactionType: "credit",
    });
    return res
      .status(201)
      .json({ message: "money transferred successfully", credit });
  } catch (error) {
    res.status(500).json({ messager: "internal server error", error });
  }
};

const makeDeposit = async (req, res) => {
  try {
    const { transactionAmount } = req.body;

    const isAccount = await accountTable.findOne({
      where: { accountNumber: req.params.accountNumber },
    });

    if (!isAccount) {
      return res.status(404).json({ error: "Invalid account number" });
    }
    if (parseFloat(isAccount.accountBalance) < parseFloat(transactionAmount)) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
    isAccount.accountBalance =
      parseFloat(isAccount.accountBalance) - parseFloat(transactionAmount);
    await isAccount.save();

    const transaction = await transactionTable.create({
      accountId: isAccount.id,
      transactionAmount,
      transactionType: "debit",
    });

    return res
      .status(200)
      .json({ message: "transaction successful", transaction });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

const transactHistory = async (req, res) => {
  try {
    const accountHistory = await transactionTable.findAll({
      where: { accountId: req.params.id },
    });

    if (!accountHistory) {
      return res.status(400).json({ message: "No transaction found" });
    }

    return res.status(200).json({ accountHistory });
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

const generateAcctStatement = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const isAccount = await transactionTable.findAll({
      where: { accountId: req.params.id },
      createdAt: {
        [Op.between]: [new Date(startDate), new Date(endDate)],
      },
      include: [
        {
          model: accountTable,

          where: {
            id: req.params.id,
          },
        },
      ],
    });

    if (!isAccount) {
      return res.status(400).json({ message: "Account not found" });
    }
    return res.status(200).json(isAccount);
  } catch (error) {
    return res.status(500).json({ message: "internal server error", error });
  }
};

module.exports = {
  createUser,
  users,
  updateUser,
  deleteUser,
  createAccount,
  makeCredit,
  makeDeposit,
  generateAcctStatement,
  transactHistory,
};
