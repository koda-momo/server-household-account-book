const express = require("express");
const router = express.Router();
const SpendingItem = require("../../models/spendingItems");
const Spending = require("../../models/spendings");

const makeDate = require("../../method/makeDate");
const make = require("../../method/makeNewSptable");

/**
 * 更新.
 */
router.post("/:itemId", async (req, res) => {
  try {
    //変更する支出データのID
    const itemId = req.params.itemId;

    //変更後の年月データ作成
    const year = new Date(req.body.date).getFullYear();
    const month = Number(new Date(req.body.date).getMonth()) + 1;
    const startDate = makeDate.makeStartDate(year, month);
    const endDate = makeDate.makeEndDate(year, month);

    //対象の支出アイテムデータ取得
    const spItem = await SpendingItem.findById(itemId);

    //削除する方の支出テーブルデータ取得
    const sp = await Spending.findOne({
      spendingId: itemId,
    });

    //追加する方の支出テーブルデータ取得
    const newSp = await Spending.findOne({
      categoryName: req.body.categoryName,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    //変更前の年月データ
    const beforeYear = new Date(spItem.createdAt).getFullYear();
    const beforeMonth = Number(new Date(spItem.createdAt).getMonth()) + 1;

    //カテゴリ、日付変更の場合は支出テーブルの方も変更が必要
    if (
      sp.categoryName != req.body.categoryName ||
      beforeYear != year ||
      beforeMonth != month
    ) {
      //もし変更後のテーブルがなければ作成
      if (newSp == undefined) {
        make.Sptable(
          req.body.categoryName,
          req.body.howmatch,
          sp.userId,
          itemId,
          req.body.date
        );

        //対象のIDを配列から削除
        newSpArray = await sp.spendingId.filter((id) => itemId != id);
        sp.spendingId = [...newSpArray];

        //変更前のテーブルのトータル金額から変更前の金額を引く
        sp.total = sp.total - spItem.howmatch;

        //もしトータルが0になったなら削除、0でなければ保存
        if (sp.total == 0) {
          await Spending.deleteOne({ _id: sp._id });
        } else {
          await sp.save();
        }
      } else {
        //対象のIDを配列から削除
        newSpArray = await sp.spendingId.filter((id) => itemId != id);
        sp.spendingId = [...newSpArray];
        //変更前のテーブルのトータル金額から変更前の金額を引く
        sp.total = sp.total - spItem.howmatch;

        //もしトータルが0になったなら削除、0でなければ保存
        if (sp.total == 0) {
          await Spending.deleteOne({ _id: sp._id });
        } else {
          await sp.save();
        }

        //追加の方も変更(ID追加, 金額追加)
        newSp.spendingId.push(itemId);
        newSp.total = newSp.total + req.body.howmatch;
        await newSp.save();
      }

      //金額に変更があった場合もトータル金額のみ変更の必要あり
    } else if (spItem.howmatch != req.body.howmatch) {
      price = sp.total - spItem.howmatch;
      sp.total = price + req.body.howmatch;
      await sp.save();
    }

    //アイテムの方も更新
    spItem.name = req.body.name;
    spItem.howmatch = req.body.howmatch;
    spItem.createdAt = new Date(req.body.date);
    const saveSpItem = await spItem.save();

    response = {
      status: "成功",
      message: "支出データを更新しました。",
      spItem: saveSpItem,
    };
    res.send(response);
  } catch (err) {
    res.status(500).json({
      response: {
        status: "失敗",
        spItem: err.name,
        message: err.message,
      },
    });
  }
});

module.exports = router;
