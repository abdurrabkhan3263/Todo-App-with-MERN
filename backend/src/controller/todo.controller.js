const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const Todo = require("../models/todo.model");
const User = require("../models/user.model");
const { isValidObjectId, default: mongoose } = require("mongoose");

const createTodoForList = asyncHandler(async (req, res) => {
  const { list_id } = req.params;
  const userId = req?.user._id;
  const { todoName = "", content = "", dueDate = "", remindMe = "" } = req.body;
  if (!isValidObjectId(list_id)) throw new ApiError(400, "Invalid list id");

  if (!content.trim()) throw new ApiError(400, "Todo content is required");

  let todoValue = {};
  todoValue.isInList = true;
  todoValue.content = content;

  if (todoName.trim()) todoValue.todoName = todoName;
  if (dueDate) todoValue.dueDate = dueDate;
  if (remindMe) todoValue.remindMe = remindMe;
  if (isValidObjectId(userId)) todoValue.creator = userId;

  const createdTodo = await Todo.create({
    ...todoValue,
    "belongsTo.list_id": list_id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdTodo, "Todo is created successfully"));
});

const createTodo = asyncHandler(async (req, res) => {
  const user_id = req?.user._id;
  const { todoName = "", content = "", dueDate = "", remindMe = "" } = req.body;
  if (!isValidObjectId(user_id)) throw new ApiError(400, "Invalid list id");

  if (!content.trim()) throw new ApiError(400, "Todo content is required");

  let todoValue = {};

  todoValue.isInList = false;
  todoValue.content = content;

  if (todoName.trim()) todoValue.todoName = todoName;
  if (dueDate) todoValue.dueDate = dueDate;
  if (remindMe) todoValue.remindMe = remindMe;
  if (isValidObjectId(user_id)) todoValue.creator = user_id;

  const createdTodo = await Todo.create({
    ...todoValue,
    "belongsTo.user_id": user_id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, createdTodo, "Todo is created successfully"));
});

const deleteTodo = asyncHandler(async (req, res) => {
  const { todo_id } = req.params;

  if (!isValidObjectId(todo_id))
    throw new ApiError(400, "Todo id is not valid");

  const deleteTodo = await Todo.findByIdAndDelete(todo_id);
  if (!deleteTodo) throw new ApiError(400, "Invalid todo id");

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Todo is deleted successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  const { todo_id } = req.params;
  const { todoName = "", content = "", dueDate = "", remindMe = "" } = req.body;

  if (!isValidObjectId(todo_id)) throw new ApiError(400, "Invalid todo id");

  if (!(todoName.trim() || content.trim() || dueDate || remindMe))
    throw new ApiError(
      400,
      "Atleast one field ( todoName , content , dueDate , remainMe , isImportant )"
    );

  const updateValue = {};

  if (todoName.trim) updateValue.todoName = todoName;
  if (content.trim) updateValue.content = content;
  if (dueDate) updateValue.dueDate = dueDate;
  if (remindMe) updateValue.remindMe = remindMe;

  const updated = await Todo.findByIdAndUpdate(todo_id, updateValue, {
    new: true,
  });

  if (!updated) throw new ApiError(400, "Todo is not found");
  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Todo is updated successfully"));
});

const isImportant = asyncHandler(async (req, res) => {
  const { todo_id = "" } = req.body;
  if (!isValidObjectId(todo_id)) throw new ApiError(400, "Invalid todo id");

  const findTodo = await Todo.findById(todo_id).lean();
  if (!findTodo) throw new ApiError(404, "Todo is not found");

  const updateTodo = await Todo.findByIdAndUpdate(
    todo_id,
    {
      $set: { isImportant: !findTodo.isImportant },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updateTodo, "Todo is updated successfully"));
});

const getImportant = asyncHandler(async (req, res) => {
  const userId = req?.user._id;

  if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");

  const getImportantTodo = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "todos",
        localField: "_id",
        foreignField: "creator",
        as: "todos",
      },
    },
    {
      $addFields: {
        todos: {
          $filter: {
            input: "$todos",
            as: "todo",
            cond: {
              $eq: ["$$todo.isImportant", true],
            },
          },
        },
      },
    },
    {
      $project: {
        todos: 1,
        _id: false,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        getImportantTodo[0].todos,
        "Important todo fetched successfully"
      )
    );
});

const completeTodo = asyncHandler(async (req, res) => {
  const { todo_id } = req.body;

  if (!isValidObjectId(todo_id)) throw new ApiError(400, "Invalid todo id");

  const todo = await Todo.findById(todo_id);

  if (!todo) throw new ApiError(400, "Todo is not found");

  const updatedTodo = await Todo.findByIdAndUpdate(
    todo_id,
    {
      isCompleted: !todo.isCompleted,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo is completed successfully"));
});

const getDirectAllTodo = asyncHandler(async (req, res) => {
  const id = req?.user._id;

  const allLists = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "todos",
        localField: "_id",
        foreignField: "belongsTo.user_id",
        as: "Todos",
      },
    },
    {
      $project: {
        fullName: 1,
        avatar: 1,
        Todos: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, allLists[0], "All todos is fetched successfully")
    );
});

module.exports = {
  createTodoForList,
  createTodo,
  deleteTodo,
  updateTodo,
  completeTodo,
  getDirectAllTodo,
  isImportant,
  getImportant,
};
