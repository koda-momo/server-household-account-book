const express = require("express");
const router = express.Router();
const User = require("../../models/users");

/**
 * 更新.
 */
router.post("/:userId", async (req, res) => {
  try {
    User.findById(req.params.userId, async (err, data) => {
      //404エラー
      if (err) {
        res.status(404).json("ユーザが存在しません");
        return;
      }

      //データを上書き
      data.name = req.body.name;
      data.mail = req.body.mail;
      data.image = req.body.image;
      data.role = req.body.role;
      data.color = req.body.color;
      await data.save();

      //返すデータ
      const responseData = {
        status: "成功",
        message: "ユーザ情報を編集しました。",
        user: data,
      };
      res.send(responseData);
    });
  } catch (err) {
    res.status(500).json({
      error: { status: "失敗", user: err.name, message: err.message },
    });
  }
});

/**
 * パスワード更新.
 */
router.post("/password", async (req, res) => {
  try {
    User.findOne({ mail: req.body.mail }, async (err, data) => {
      //404エラー
      if (err) {
        res.status(404).json("ユーザが存在しません");
        return;
      }

      //データを上書き
      data.password = req.body.password;
      await data.save();

      //返すデータ
      const responseData = {
        status: "成功",
        message: "パスワードを編集しました。",
        user: data,
      };
      res.send(responseData);
    });
  } catch (err) {
    res.status(500).json({
      error: { status: "失敗", user: err.name, message: err.message },
    });
  }
});

module.exports = router;
