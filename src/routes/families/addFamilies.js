const express = require("express");
const router = express.Router();
const Family = require("../../models/families");
const User = require("../../models/users");

/**
 * 新規追加.
 * @remarks 必要な情報:グループ名、合言葉、パスワード、登録者のID
 */
router.post("/", async (req, res) => {
  //データをDBに保存
  try {
    //リクエストを受け取る
    const family = new Family({
      name: req.body.name,
      secretWord: req.body.secretWord,
      password: req.body.password,
    });

    const savedFamily = await family.save();

    //グループ情報を登録したユーザのfamilyIdにIDを登録
    User.findById(req.body.userId, async (err, userData) => {
      //404エラー
      if (err) {
        res.status(404).json("ユーザが存在しません");
        return;
      }

      userData.familyId = savedFamily._id;
      await userData.save();
    });

    response = {
      status: "成功",
      message: "グループを新規登録しました。",
      family: savedFamily,
    };

    res.send(response);
  } catch (err) {
    res.status(500).json({
      response: {
        status: "失敗",
        family: err.name,
        message: err.message,
      },
    });
  }
});

module.exports = router;
