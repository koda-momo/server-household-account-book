const express = require("express");
const router = express.Router();
const Family = require("../../models/families");
const User = require("../../models/users");

const makeDate = require("../../method/makeDate");

/**
 * 全件取得.
 */
router.get("/", async (req, res, next) => {
  const data = await Family.find({});
  const response = {
    message: "情報を取得しました。",
    status: "成功",
    family: data,
  };
  res.send(response);
});

/**
 * IDで1件取得.
 */
router.get("/:familyId", (req, res) => {
  try {
    Family.findById(req.params.familyId, (err, data) => {
      //404エラー
      if (err) {
        res.status(404).json("グループが存在しません");
        return;
      }

      //返すデータ
      const response = {
        message: "情報を取得しました。",
        status: "成功",
        family: data,
      };
      res.send(response);
    });
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

/**
 * 家族情報→ユーザ情報の取得→収支情報の取得.
 * @remarks 家族ID, month, year
 */
router.post("/insp", async (req, res) => {
  try {
    //日付で搾るために日付データの作成
    const year = req.body.year;
    const month = req.body.month;
    const startDate = makeDate.makeStartDate(year, month);
    const endDate = makeDate.makeEndDate(year, month);

    const query = {
      $and: [
        { total: { $gt: 0 } },
        { createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) } },
      ],
    };

    const userData = await User.find({
      familyId: req.body.familyId,
    })
      .populate({
        path: "incomeId",
        match: query,
        populate: {
          path: "incomeId",
        },
      })
      .populate({
        path: "spendingId",
        match: query,
        populate: { path: "spendingId" },
      })
      .select(["id", "name", "image", "role", "color"]); //ユーザの情報は左の項目しか返さない

    //返すデータ
    const response = {
      message: "情報を取得しました。",
      status: "成功",
      family: userData,
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
