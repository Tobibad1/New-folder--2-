const { ObjectId } = require("mongodb");
const { getCollection } = require("../connection");

class TaskModel {
  static collection() {
    return getCollection("tasks");
  }

  static async getAll() {
    return this.collection().find({}).sort({ createdAt: -1 }).toArray();
  }

  static async getById(id) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return this.collection().findOne({ _id: new ObjectId(id) });
  }

  static async create(data) {
    const newTask = {
      title: data.title,
      completed: Boolean(data.completed),
      createdAt: new Date().toISOString()
    };

    const result = await this.collection().insertOne(newTask);
    return { _id: result.insertedId, ...newTask };
  }

  static async update(id, data) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const updateDoc = {};

    if (typeof data.title !== "undefined") {
      updateDoc.title = data.title;
    }

    if (typeof data.completed !== "undefined") {
      updateDoc.completed = Boolean(data.completed);
    }

    if (Object.keys(updateDoc).length === 0) {
      return this.getById(id);
    }

    const result = await this.collection().findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: "after" }
    );

    return result;
  }

  static async remove(id) {
    if (!ObjectId.isValid(id)) {
      return false;
    }

    const result = await this.collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}

module.exports = TaskModel;
