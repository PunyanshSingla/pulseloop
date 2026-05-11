import Poll, { IPoll } from "../../models/Poll";
import Question from "../../models/Question";
import QuestionOption from "../../models/QuestionOption";
import mongoose from "mongoose";
import { CreatePollInput, UpdatePollInput } from "./poll.types";

export class PollsService {
  async createPoll(data: CreatePollInput, userId: string) {
    const { questions, ...pollData } = data;

    const poll = new Poll({
      ...pollData,
      createdBy: userId,
    });

    await poll.save();

    if (questions && Array.isArray(questions)) {
      for (const [qIndex, qData] of questions.entries()) {
        const question = new Question({
          pollId: poll._id,
          text: qData.text,
          isMandatory: qData.isMandatory || false,
          order: qData.order ?? qIndex,
        });

        await question.save();

        if (qData.options && Array.isArray(qData.options)) {
          for (const [oIndex, oData] of qData.options.entries()) {
            const option = new QuestionOption({
              questionId: question._id,
              text: oData.text,
              order: oData.order ?? oIndex,
            });
            await option.save();
          }
        }
      }
    }

    return this.getPollById(poll._id.toString());
  }

  async getPolls(filters: any = {}) {
    return Poll.find(filters).sort({ createdAt: -1 });
  }

  async getPollById(id: string) {
    const poll = await Poll.findById(id).lean();
    if (!poll) return null;

    const questions = await Question.find({ pollId: id }).sort({ order: 1 }).lean();
    
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await QuestionOption.find({ questionId: q._id })
          .sort({ order: 1 })
          .lean();
        return { ...q, options };
      })
    );

    return { ...poll, questions: questionsWithOptions };
  }

  async updatePoll(id: string, data: UpdatePollInput, userId: string) {
    const poll = await Poll.findOne({ _id: id, createdBy: userId });
    if (!poll) throw new Error("Poll not found or unauthorized");

    const { questions, ...pollData } = data;

    // Update poll metadata
    Object.assign(poll, pollData);
    await poll.save();

    // If questions are provided, we replace them (simplest implementation for now)
    // A more complex implementation would diff and update/delete/add
    if (questions) {
      // Delete old questions and options
      const oldQuestions = await Question.find({ pollId: id });
      for (const q of oldQuestions) {
        await QuestionOption.deleteMany({ questionId: q._id });
      }
      await Question.deleteMany({ pollId: id });

      // Re-create new questions and options
      for (const [qIndex, qData] of questions.entries()) {
        const question = new Question({
          pollId: poll._id,
          text: qData.text,
          isMandatory: qData.isMandatory || false,
          order: qData.order ?? qIndex,
        });
        await question.save();

        if (qData.options) {
          for (const [oIndex, oData] of qData.options.entries()) {
            const option = new QuestionOption({
              questionId: question._id,
              text: oData.text,
              order: oData.order ?? oIndex,
            });
            await option.save();
          }
        }
      }
    }

    return this.getPollById(id);
  }

  async deletePoll(id: string, userId: string) {
    const poll = await Poll.findOne({ _id: id, createdBy: userId });
    if (!poll) throw new Error("Poll not found or unauthorized");

    const questions = await Question.find({ pollId: id });
    for (const q of questions) {
      await QuestionOption.deleteMany({ questionId: q._id });
    }
    await Question.deleteMany({ pollId: id });
    await Poll.deleteOne({ _id: id });

    return { success: true };
  }
}

export const pollsService = new PollsService();
