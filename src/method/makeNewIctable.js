const Category = require("../models/categories");
const Income = require("../models/incomes");
const User = require("../models/users");

/**
 * 収入テーブル追加メソッド.
 * @param categoryName - カテゴリの名前
 * @param howmatch - 値段
 * @param userId - ユーザID
 * @param itemId - 登録した支出アイテムのID
 * @param date - 使った日付
 */
exports.Ictable = async function (
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

  //ユーザテーブルのincomeId配列に追加するため情報取得
  const userData = await User.findById(userId);

  //支出テーブル新規作成
  const newIncome = new Income({
    categoryName: categoryName,
    color: categoryData.color,
    icon: categoryData.icon,
    total: howmatch,
    userId: userId,
    incomeId: [itemId],
    createdAt: new Date(date),
  });
  const savedIc = await newIncome.save();

  //ユーザテーブルのincomeId配列に追加
  userData.incomeId.push(savedIc._id);
  await userData.save();
};
