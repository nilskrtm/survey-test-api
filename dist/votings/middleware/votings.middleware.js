"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const log: debug.IDebugger = debug('app:votings-controllers');
class VotingsMiddleware {
    validVoteData(req, res, next) {
        const survey = res.locals.survey;
        const votes = req.body.votes;
        if (Array.isArray(votes) && survey.questions.length === votes.length) {
            const questionsWithAnswerOptions = {};
            for (let i = 0; i < survey.questions.length; i++) {
                const questionObject = survey.questions[i];
                questionsWithAnswerOptions[questionObject._id] =
                    questionObject.answerOptions.reduce((accumulator, answerOptionObject) => {
                        accumulator.push(answerOptionObject._id);
                        return accumulator;
                    }, []);
            }
            const valid = votes.every((voteObject) => voteObject.question in questionsWithAnswerOptions &&
                questionsWithAnswerOptions[voteObject.question].includes(voteObject.answerOption));
            if (valid) {
                return next();
            }
        }
        res.status(400).send({
            error: `Die Votes passen nicht zu der Umfrage.`,
        });
    }
}
exports.default = new VotingsMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidm90aW5ncy5taWRkbGV3YXJlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vdm90aW5ncy9taWRkbGV3YXJlL3ZvdGluZ3MubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLGdFQUFnRTtBQUVoRSxNQUFNLGlCQUFpQjtJQUNyQixhQUFhLENBQUMsR0FBWSxFQUFFLEdBQWEsRUFBRSxJQUFrQjtRQUMzRCxNQUFNLE1BQU0sR0FBVyxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUN6QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUU3QixJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEtBQUssS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUNwRSxNQUFNLDBCQUEwQixHQUFxQyxFQUFFLENBQUM7WUFFeEUsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNoRCxNQUFNLGNBQWMsR0FBYSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUVyRCwwQkFBMEIsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO29CQUM1QyxjQUFjLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FDakMsQ0FBQyxXQUFxQixFQUFFLGtCQUFnQyxFQUFFLEVBQUU7d0JBQzFELFdBQVcsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBRXpDLE9BQU8sV0FBVyxDQUFDO29CQUNyQixDQUFDLEVBQ0QsRUFBRSxDQUNILENBQUM7YUFDTDtZQUVELE1BQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQ3ZCLENBQUMsVUFBZSxFQUFFLEVBQUUsQ0FDbEIsVUFBVSxDQUFDLFFBQVEsSUFBSSwwQkFBMEI7Z0JBQ2pELDBCQUEwQixDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLENBQ3RELFVBQVUsQ0FBQyxZQUFZLENBQ3hCLENBQ0osQ0FBQztZQUVGLElBQUksS0FBSyxFQUFFO2dCQUNULE9BQU8sSUFBSSxFQUFFLENBQUM7YUFDZjtTQUNGO1FBRUQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbkIsS0FBSyxFQUFFLHdDQUF3QztTQUNoRCxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxrQkFBZSxJQUFJLGlCQUFpQixFQUFFLENBQUMifQ==