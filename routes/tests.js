const { ObjectId } = require("mongodb");
const mongodb = require("../features/mongodb");
const quizRouter = require("express").Router();

async function run() {
  const testCollection = await mongodb.collection("Tests");
  try {
    // Insert a new Test
    quizRouter.post("/new-test", async (req, res) => {
      const testDetails = req.body;
      testDetails.questions = [];
      const result = await testCollection.insertOne(testDetails);
      res.send(result);
    });

    // Get All Test Specified an Admin with
    quizRouter.get("/all/:email", async (req, res) => {
      const email = req.params.email;
      const result = await testCollection
        .find({ author: email })
        .project({ _id: 1, testTitle: 1, author: 1 })
        .toArray();
      res.send(result);
    });

    // Get a Test Details
    quizRouter.get("/details/:testId", async (req, res) => {
      const testId = req.params.testId;
      const result = await testCollection.findOne({ _id: ObjectId(testId) });
      res.send(result);
    });

    // Delete a Test
    quizRouter.delete("/delete/:id", async (req, res) => {
      const testId = req.params.id;
      const result = await testCollection.deleteOne({ _id: ObjectId(testId) });
      res.send(result);
    });

    // Insert a question to the test
    quizRouter.put("/question", async (req, res) => {
      const { quizData, testId } = req.body;
      const query = { _id: ObjectId(testId) };
      const options = { upsert: true };
      const updateQuestion = { $push: { questions: quizData } };
      const result = await testCollection.updateOne(
        query,
        updateQuestion,
        options
      );
      res.send(result);
    });

    // Update a Question
    quizRouter.put("/update", async (req, res) => {
      const { quizData, testId } = req.body;
      const { question, qType, option_1, option_2, option_3, option_4 } =
        quizData;
      const query = { _id: ObjectId(testId), "questions.question": question };
      const options = { upsert: true };
      let updateDoc = {};
      if (qType === "Short Text") {
        updateDoc = { $set: { "questions.$.qType": qType } };
      } else {
        updateDoc = {
          $set: {
            "questions.$.qType": qType,
            "questions.$.option_1": option_1,
            "questions.$.option_2": option_2,
            "questions.$.option_3": option_3,
            "questions.$.option_4": option_4,
          },
        };
      }
      const result = await testCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // Delete a Question
    quizRouter.put("/delete-question", async (req, res) => {
      const { testId, questionText } = req.body;
      console.log(req.body);
      const query = { _id: ObjectId(testId) };
      const updateDoc = { $pull: { "questions": { "question": questionText } } };
      const result = await testCollection.update(query, updateDoc);
      res.send(result);
    });
  } finally {
    // Nothing to do
  }
}

run().catch(console.dir);

module.exports = quizRouter;
