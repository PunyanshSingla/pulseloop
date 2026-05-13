import Poll, { IPoll } from "../../models/Poll";
import Question from "../../models/Question";
import QuestionOption from "../../models/QuestionOption";
import Response from "../../models/Response";
import User from "../../models/User";
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
    const polls = await Poll.find(filters).sort({ createdAt: -1 }).lean();
    
    // Add response count for each poll
    const pollsWithCounts = await Promise.all(
      polls.map(async (poll) => {
        const responseCount = await Response.countDocuments({ pollId: poll._id });
        return { ...poll, responseCount };
      })
    );

    return pollsWithCounts;
  }

  async getPollById(id: string) {
    const poll = await Poll.findById(id).lean();
    if (!poll) return null;

    const questions = await Question.find({ pollId: id }).sort({ order: 1 }).lean();
    const totalPollResponses = await Response.countDocuments({ pollId: id });
    
    const questionsWithOptions = await Promise.all(
      questions.map(async (q) => {
        const options = await QuestionOption.find({ questionId: q._id })
          .sort({ order: 1 })
          .lean();

        const optionsWithStats = await Promise.all(
          options.map(async (o) => {
            const count = await Response.countDocuments({ selectedOptionId: o._id });
            const totalQuestionResponses = await Response.countDocuments({ questionId: q._id });
            const percentage = totalQuestionResponses > 0 ? (count / totalQuestionResponses) * 100 : 0;
            return { ...o, responseCount: count, percentage };
          })
        );

        return { ...q, options: optionsWithStats };
      })
    );

    return { ...poll, questions: questionsWithOptions, responseCount: totalPollResponses };
  }

  async castVote(pollId: string, questionId: string, optionId: string, userId?: string, timeTaken: number = 0) {
    const response = new Response({
      pollId,
      questionId,
      selectedOptionId: optionId,
      respondentId: userId || null,
      isAnonymous: !userId,
      timeTaken,
    });

    await response.save();
    return response;
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
