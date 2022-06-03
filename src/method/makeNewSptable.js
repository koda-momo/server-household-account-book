const Category = require("../models/categories");
const Spending = require("../models/spendings");
const User = require("../models/users");

/**
 * 支出テーブル追加メソッド.
 * @param categoryName - カテゴリの名前
 * @param howmatch - 値段
 * @param userId - ユーザID
 * @param itemId - 登録した支出アイテムのID
 * @param date - 使った日付
 */
exports.Sptable = async function (
  categoryName,
  howmatch,
  userId,
  itemId,
  date
) {
  //カテゴリーテーブルから情報を取得
  const categoryData = await Category.findOne({
    name: categoryName,
  });

  //ユーザテーブルのspendingId配列に追加するため情報取得
  const userData = await User.findById(userId);

  //支出テーブル新規作成
  const newSpending = new Spending({
    categoryName: categoryName,
    color: categoryData.color,
    icon: categoryData.icon,
    total: howmatch,
    userId: userId,
    spendingId: [itemId],
    createdAt: new Date(date),
  });
  const savedSp = await newSpending.save();

  //ユーザテーブルのspendingId配列に追加
  userData.spendingId.push(savedSp._id);
  await userData.save();
};
