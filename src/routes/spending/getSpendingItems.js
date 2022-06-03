const express = require("express");
const router = express.Router();
const SpendingItem = require("../../models/spendingItems");
const Spending = require("../../models/spendings");

const makeDate = require("../../method/makeDate");

/**
 * 全件取得.
 */
router.get("/", async (req, res, next) => {
  const data = await SpendingItem.find({});

  response = {
    status: "成功",
    message: `全支出データを取得しました。`,
    spItem: data,
  };
  res.send(response);
});

/**
 * IDで取得.
 */
router.get("/:id", async (req, res, next) => {
  const itemData = await SpendingItem.findById(req.params.id);

  //カテゴリ名も取得
  const data = await Spending.findOne({ spendingId: req.params.id });

  if (data == undefined) {
    res.status(500).json({
      response: {
        status: "失敗",
        spItem: "",
        message: "該当のデータが見当たりませんでした。",
      },
    });
    return;
  }

  const category = data.categoryName;

  response = {
    status: "成功",
    message: "該当のデータを取得しました。",
    spItem: itemData,
    categoryName: category,
  };
  res.send(response);
});

/**
 * 月を指定して取得.
 * @remarks 必要なデータ:年月,ユーザID
 */
router.post("/month", async (req, res, next) => {
  const startDate = makeDate.makeStartDate(req.body.year, req.body.month);
  const endDate = makeDate.makeEndDate(req.body.year, req.body.month);

  const data = await Spending.find({
    userId: req.body.userId,
    createdAt: {
      $gte: new Date(startDate),
      $lt: new Date(endDate),
    },
  }).populate("spendingId");

  response = {
    status: "成功",
    message: `${req.body.year}年${req.body.month}月分の支出データを取得しました。`,
    spItem: data,
  };

  res.send(response);
});

module.exports = router;
