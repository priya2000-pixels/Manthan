const mongoose = require("mongoose");

const Test = require("../models/tests.model");
const { GenerateTest, Sort } = require("./test_generator");

const Get = async (req, res) => {
  const { id } = req.params;

  try {
    const test = await Test.findById(id);

    res.status(200).json(test);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const Create = async (req, res) => {
  const {
    name,
    marks,
    questions,
    rules,
    scores,
    classroom,
    duration, 
    dueDate,
  } = req.body;
  const sortQuestions = Sort(questions);
  const newTest = new Test({
    name,
    marks,
    sortQuestions,
    classroom,
    rules,
    scores,
    duration,
    dueDate,
  });
  try {
    await newTest.save();
    res.status(201).json(newTest);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const GetTests = async (req, res) => {
  const { code } = req.params;
  try {
    const Tests = await Test.find({ classroom: code });
    res.status(200).json(Tests);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const Update = async (req, res) => {
  const { id } = req.params;
  const { name, marks, questions, rules, scores, duration, dueDate } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Test with id: ${id}`);

  const updatedTest = {
    name,
    marks,
    questions,
    rules,
    scores,
    duration, dueDate,
    _id: id,
  };

  await Test.findByIdAndUpdate(id, updatedTest, { new: true });

  res.json(updatedTest);
};

const Delete = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No Test with id: ${id}`);

  await Test.findByIdAndRemove(id);

  res.json({ message: "Test deleted successfully." });
};

const Generate = async (req, res) => {
  const { id } = req.params;
  try {
    const test = await Test.findById(id);
    const questions_id = GenerateTest(test.questions, test.rules);
    var generated_test = [];

    questions_id.forEach((id) => {
      generated_test = [...generated_test, test.questions[id]];
    });

    res.status(200).json(generated_test);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { Get, GetTests, Create, Update, Delete, Generate };
