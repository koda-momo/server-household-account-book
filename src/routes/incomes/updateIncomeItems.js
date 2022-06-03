const express = require("express");
const router = express.Router();
const IncomeItem = require("../../models/incomeItems");
const Income = require("../../models/incomes");

const makeDate = require("../../method/makeDate");
const make = require("../../method/makeNewIctable");

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
    const icItem = await IncomeItem.findById(itemId);

    //削除する方の支出テーブルデータ取得
    const ic = await Income.findOne({
      incomeId: itemId,
    });

    //追加する方の支出テーブルデータ取得
    const newIc = await Income.findOne({
      categoryName: req.body.categoryName,
      createdAt: {
        $gte: new Date(startDate),
        $lt: new Date(endDate),
      },
    });

    //変更前の年月データ
    const beforeYear = new Date(icItem.createdAt).getFullYear();
    const beforeMonth = Number(new Date(icItem.createdAt).getMonth()) + 1;

    //カテゴリ、日付変更の場合は支出テーブルの方も変更が必要
    if (
      ic.categoryName != req.body.categoryName ||
      beforeYear != year ||
      beforeMonth != month
    ) {
      //もし変更後のテーブルがなければ作成
      if (newIc == undefined) {
        make.Ictable(
          req.body.categoryName,
          req.body.howmatch,
          ic.userId,
          itemId,
          req.body.date
        );

        //対象のIDを配列から削除
        newIcArray = await ic.incomeId.filter((id) => itemId != id);
        ic.incomeId = [...newIcArray];
        //変更前のテーブルのトータル金額から変更前の金額を引く
        ic.total = ic.total - icItem.howmatch;

        //もしトータルが0になったなら削除、0でなければ保存
        if (ic.total == 0) {
          await Income.deleteOne({ _id: ic._id });
        } else {
          await ic.save();
        }
      } else {
        //対象のIDを配列から削除
        newIcArray = await ic.incomeId.filter((id) => itemId != id);
        ic.incomeId = [...newIcArray];
        //変更前のテーブルのトータル金額から変更前の金額を引く
        ic.total = ic.total - icItem.howmatch;

        //もしトータルが0になったなら削除、0でなければ保存
        if (ic.total == 0) {
          await Income.deleteOne({ _id: ic._id });
        } else {
          await ic.save();
        }

        //追加の方も変更(ID追加, 金額追加)
        newIc.incomeId.push(itemId);
        newIc.total = newIc.total + req.body.howmatch;
        await newIc.save();
      }

      //金額に変更があった場合もトータル金額のみ変更の必要あり
    } else if (icItem.howmatch != req.body.howmatch) {
      price = ic.total - icItem.howmatch;
      ic.total = price + req.body.howmatch;
      await ic.save();
    }

    //アイテムの方も更新
    icItem.name = req.body.name;
    icItem.howmatch = req.body.howmatch;
    icItem.createdAt = new Date(req.body.date);
    const saveIcItem = await icItem.save();

    response = {
      status: "成功",
      message: "支出データを更新しました。",
      icItem: saveIcItem,
    };
    res.send(response);
  } catch (err) {
    res.status(500).json({
      response: {
        status: "失敗",
        icItem: err.name,
        message: err.message,
      },
    });
  }
});

module.exports = router;
