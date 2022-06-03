const express = require("express");
const router = express.Router();
const Income = require("../../models/incomes");

const makeDate = require("../../method/makeDate");

/**
 * 全件取得.
 */
router.get("/", async (req, res, next) => {
  const data = await Income.find({});

  //返すデータ
  const response = {
    message: "情報を取得しました。",
    status: "成功",
    ic: data,
  };
  res.send(response);
});

/**
 * ネストさせて取得.
 * @remarks ユーザID,(カテゴリ名)
 */
router.post("/item", async (req, res, next) => {
  //日付で搾るために日付データの作成
  const year = req.body.year;
  const month = req.body.month;
  const startDate = makeDate.makeStartDate(year, month);
  const endDate = makeDate.makeEndDate(year, month);

  if (req.body.categoryName) {
    const data = await Income.findOne({
      userId: req.body.userId,
      categoryName: req.body.categoryName,
      total: { $gt: 0 }, //アイテム登録がないテーブルは排除
      createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
    }).populate("incomeId");

    //返すデータ
    const response = {
      message: "情報を取得しました。",
      status: "成功",
      ic: data,
    };

    res.send(response);
  } else {
    //ユーザIDのみで搾る場合
    const data = await Income.find({
      userId: req.body.userId,
      total: { $gt: 0 }, //アイテム登録がないテーブルは排除
      createdAt: { $gte: new Date(startDate), $lt: new Date(endDate) },
    }).populate("incomeId");

    //返すデータ
    const response = {
      message: "情報を取得しました。",
      status: "成功",
      ic: data,
    };

    res.send(response);
  }
});

module.exports = router;
