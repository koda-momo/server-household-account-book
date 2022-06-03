const express = require("express");
const router = express.Router();
const User = require("../../models/users");

/**
 * 新規追加.
 */
router.post("/", async (req, res) => {
  //データをDBに保存
  try {
    //リクエストを受け取る
    const user = new User({
      name: req.body.name,
      mail: req.body.mail,
      password: req.body.password,
      image: req.body.image,
      familyId: "",
      role: "",
      color: req.body.color,
      incomeId: [],
      spendingId: [],
    });

    const savedUser = await user.save();
    response = {
      status: "成功",
      message: "ユーザを新規登録しました。",
      user: savedUser,
    };

    res.send(response);
  } catch (err) {
    res.status(500).json({
      response: {
        status: "失敗",
        user: err.name,
        message: err.message,
      },
    });
  }
});

module.exports = router;
