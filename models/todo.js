// models/todo.js
"use strict";
const { Model } = require("sequelize");

var Sequelize = require("sequelize");
const Op = Sequelize.Op;
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      const d = new Date();

      console.log("My Todo list \n");

      console.log("Overdue");
      const over = await this.overdue();
      over.map((task) => {
        console.log(task.displayableString());
      });
      console.log("\n");

      console.log("Due Today");
      const today = await this.dueToday();
      today.map((task) => {
        console.log(task.displayableString());
      });
      console.log("\n");

      console.log("Due Later");
      const later = await this.dueLater();
      later.map((task) => console.log(task.displayableString()));
    }

    static async overdue() {
      const d = new Date();
      const task = await Todo.findAll({
        where: { dueDate: { [Op.lt]: d.toLocaleDateString("en-CA") } },
        order: [["id", "ASC"]],
      });
      return task;
    }

    static async dueToday() {
      const d = new Date();
      const task = await Todo.findAll({
        where: { dueDate: { [Op.eq]: d.toLocaleDateString("en-CA") } },
        order: [["id", "ASC"]],
      });
      return task;
    }

    static async dueLater() {
      const d = new Date();
      const task = await Todo.findAll({
        where: { dueDate: { [Op.gt]: d.toLocaleDateString("en-CA") } },
        order: [["id", "ASC"]],
      });
      return task;
    }

    static async markAsComplete(id) {
      return Todo.update({ completed: true }, { where: { id: id } });
    }

    displayableString() {
      let checkbox = this.completed ? "[x]" : "[ ]";
      let date =
        this.dueDate === new Date().toLocaleDateString("en-CA")
          ? ""
          : ` ${this.dueDate}`;
      return `${this.id}. ${checkbox} ${this.title}${date}`;
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
  
};
