const express = require("express");
const router = express.Router();
const Family = require("../../models/families");
const User = require("../../models/users");

/**
 * 紐づけ解除.
 * @remarks 必要なデータ:ユーザのID、合言葉、グループパスワード
 */
router.post("/link/:familyId", async (req, res) => {
  try {
    //グループの検索
    Family.findById(req.params.familyId, async (err, data) => {
      //404エラー
      if (err) {
        res.status(404).json("グループが存在しません");
        return;
      }

      //合言葉かパスワードが誤っている場合は編集不可
      if (
        data.password !== req.body.password ||
        data.secretWord !== req.body.secretWord
      ) {
        res.status(404).json("合言葉またはパスワードが誤っています。");
        return;
      }

      //ユーザの検索→familyIdを空にする
      User.findById(req.body.userId, async (err, userData) => {
        //404エラー
        if (err) {
          res.status(404).json("ユーザが存在しません");
          return;
        }

        //データを上書き
        userData.familyId = "";
        await userData.save();
      });

      //返すデータ
      const responseData = {
        status: "成功",
        message: `グループからユーザを削除しました。`,
        family: data,
      };
      res.send(responseData);
    });
  } catch (err) {
    res.status(500).json({
      error: { status: "失敗", family: err.name, message: err.message },
    });
  }
});

/**
 * グループにユーザを紐づけ.
 * @remarks 必要なデータ:ユーザID、合言葉、グループパスワード
 */
router.post("/link", async (req, res) => {
  try {
    //グループの検索
    Family.findOne(
      { secretWord: req.body.secretWord, password: req.body.password },
      async (err, data) => {
        //404エラー
        if (err || data == undefined) {
          res.status(404).json("グループが存在しません");
          return;
        }

        //家族ID
        const familyId = data._id;

        //ユーザの検索→familyIdに取得したIDを登録
        User.findById(req.body.userId, async (err, userData) => {
          //404エラー
          if (err) {
            res.status(404).json("ユーザが存在しません");
            return;
          }

          //データを上書き
          userData.familyId = familyId;
          await userData.save();
        });

        //返すデータ
        const responseData = {
          status: "成功",
          message: `グループ『${data.name}』に紐づけました。`,
          family: data,
        };
        res.send(responseData);
      }
    );
  } catch (err) {
    res.status(500).json({
      error: { status: "失敗", family: err.name, message: err.message },
    });
  }
});

/**
 * グループ名更新.
 */
router.post("/:familyId", async (req, res) => {
  try {
    Family.findById(req.params.familyId, async (err, data) => {
      //404エラー
      if (err) {
        res.status(404).json("グループが存在しません");
        return;
      }
      //データを上書き
      data.name = req.body.name;
      await data.save();

      //返すデータ
      const responseData = {
        status: "成功",
        message: "グループ名を編集しました。",
        family: data,
      };
      res.send(responseData);
    });
  } catch (err) {
    res.status(500).json({
      error: { status: "失敗", family: err.name, message: err.message },
    });
  }
});

module.exports = router;
