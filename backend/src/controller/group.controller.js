const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Group = require("../models/group.model");
const List = require("../models/list.model");
const { isValidObjectId } = require("mongoose");
const mongoose = require("mongoose");

const createGroup = asyncHandler(async (req, res) => {
  const user = req?.user;
  const { name = "", listTodo = "" } = req.body;

  if (Array.isArray(listTodo) && listTodo.length <= 0)
    throw new ApiError(400, "List must be in the array and not empty");

  const findList = await List.find({ _id: { $in: listTodo } });

  if (findList.some((lists) => lists?.isInGroup))
    throw new ApiError(400, "List already exits in group");

  if (!name?.trim()) throw new ApiError(400, "Group name is required");

  let updatedListIds = [];
  if (listTodo.length > 0) {
    const updateResult = await List.updateMany(
      {
        _id: { $in: listTodo },
      },
      { isInGroup: true }
    );
    updatedListIds = updateResult.modifiedCount > 0 ? listTodo : [];
  }

  const createdGroup = await Group.create({
    name,
    list: updatedListIds,
    belongsTo: user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdGroup, "Group is created successfully"));
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { group_id } = req.params;

  if (!isValidObjectId(group_id)) throw new ApiError(400, "Invalid group id");

  const group = await Group.findById(group_id);
  if (!group) throw new ApiError(404, "Group is not found");

  if (group?.list && group.list.length > 0) {
    await List.updateMany({ _id: { $in: group?.list } }, { isInGroup: false });
  }

  await Group.findByIdAndDelete(group_id);

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Group is deleted successfully"));
});

const updateGroup = asyncHandler(async (req, res) => {
  const { group_id } = req.params;
  const { name = "", list = [] } = req.body;

  const findList = await List.find({ _id: { $in: listTodo } });

  if (findList.some((lists) => lists?.isInGroup))
    throw new ApiError(400, "List already exits in group");

  if (!isValidObjectId(group_id)) throw new ApiError(400, "Invalid group id");

  if (!(name.trim() || (Array.isArray(list) && list.length > 0)))
    throw new ApiError(400, "Atleast one field ( name , list ) is required");

  const updatedGroup = await Group.findByIdAndUpdate(
    group_id,
    {
      $set: { name: name.trim() || undefined },
      $push: { list: { $each: list } },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedGroup)
    throw new ApiError(500, "Server error while updating the group");

  await List.updateMany({ _id: { $in: list } }, { isInGroup: true });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedGroup, "Group is updated successfully"));
});

const getGroup = asyncHandler(async (req, res) => {
  const user_id = req?.user._id;
  if (!isValidObjectId(user_id)) throw new ApiError(400, "Invalid user id");

  const groupData = await Group.aggregate([
    {
      $match: {
        belongsTo: new mongoose.Types.ObjectId(user_id),
      },
    },
    {
      $lookup: {
        from: "lists",
        localField: "list",
        foreignField: "_id",
        as: "list",
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, groupData[0], "Group is getted successfully"));
});

const removeList = asyncHandler(async (req, res) => {
  const { group_id } = req.params;
  const { list_id } = req.body;

  if (!isValidObjectId(group_id)) throw new ApiError(400, "Invalid group id");

  if (!Array.isArray(list_id) || !list_id.length > 0)
    throw new ApiError(400, "List id is required");

  const updatedGroup = await Group.findByIdAndUpdate(
    group_id,
    {
      $pull: { list: { $in: list_id } },
    },
    { new: true }
  );

  await List.updateMany(
    { _id: { $in: list_id } },
    {
      $set: { isInGroup: false },
    }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedGroup, "List is deleted from the group"));
});

module.exports = {
  createGroup,
  deleteGroup,
  updateGroup,
  getGroup,
  removeList,
};
