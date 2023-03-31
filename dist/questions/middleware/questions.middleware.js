"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//const log: debug.IDebugger = debug('app:questions-controllers');
class QuestionsMiddleware {
    isValidQuestionOrdering(req, res, next) {
        const survey = res.locals.survey;
        const newSorting = req.body.ordering;
        if (survey.questions.length == Object.keys(newSorting).length) {
            const questionIds = survey.questions.map(questionObject => questionObject._id);
            if (questionIds.every(questionId => questionId in newSorting &&
                typeof newSorting[questionId] === 'number')) {
                const toFill = {};
                for (let order = 1; order <= survey.questions.length; order++) {
                    toFill[order] = null;
                }
                Object.keys(newSorting).forEach(questionId => {
                    toFill[newSorting[questionId]] = questionId;
                });
                let valid = true;
                for (let orderAsString of Object.keys(toFill)) {
                    let order = parseInt(orderAsString);
                    if (toFill[order] === null) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    return next();
                }
            }
        }
        res.status(400).send();
    }
    validateQuestionExists(req, res, next) {
        const survey = res.locals.survey;
        const questions = survey.questions.filter(questionObject => questionObject._id === req.body.locals.questionId);
        if (questions.length > 0) {
            res.locals.question = questions[0];
            next();
        }
        else {
            res.status(404).send({
                error: `Question ${req.params.questionId} not found`,
            });
        }
    }
    extractQuestionId(req, res, next) {
        req.body.locals.questionId = req.params.questionId;
        next();
    }
}
exports.default = new QuestionsMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlc3Rpb25zLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9xdWVzdGlvbnMvbWlkZGxld2FyZS9xdWVzdGlvbnMubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLGtFQUFrRTtBQUVsRSxNQUFNLG1CQUFtQjtJQUN2Qix1QkFBdUIsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQ3JFLE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3pDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRXJDLElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxNQUFNLEVBQUU7WUFDN0QsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQ3RDLGNBQWMsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FDckMsQ0FBQztZQUVGLElBQ0UsV0FBVyxDQUFDLEtBQUssQ0FDZixVQUFVLENBQUMsRUFBRSxDQUNYLFVBQVUsSUFBSSxVQUFVO2dCQUN4QixPQUFPLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSyxRQUFRLENBQzdDLEVBQ0Q7Z0JBQ0EsTUFBTSxNQUFNLEdBQXFDLEVBQUUsQ0FBQztnQkFFcEQsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUM3RCxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO2lCQUN0QjtnQkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtvQkFDM0MsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUVqQixLQUFLLElBQUksYUFBYSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQzdDLElBQUksS0FBSyxHQUFXLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFFNUMsSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFO3dCQUMxQixLQUFLLEdBQUcsS0FBSyxDQUFDO3dCQUVkLE1BQU07cUJBQ1A7aUJBQ0Y7Z0JBRUQsSUFBSSxLQUFLLEVBQUU7b0JBQ1QsT0FBTyxJQUFJLEVBQUUsQ0FBQztpQkFDZjthQUNGO1NBQ0Y7UUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxzQkFBc0IsQ0FBQyxHQUFZLEVBQUUsR0FBYSxFQUFFLElBQWtCO1FBQ3BFLE1BQU0sTUFBTSxHQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3pDLE1BQU0sU0FBUyxHQUFlLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUNuRCxjQUFjLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUNwRSxDQUFDO1FBRUYsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN4QixHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFbkMsSUFBSSxFQUFFLENBQUM7U0FDUjthQUFNO1lBQ0wsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7Z0JBQ25CLEtBQUssRUFBRSxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxZQUFZO2FBQ3JELENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQztJQUVELGlCQUFpQixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO1FBRW5ELElBQUksRUFBRSxDQUFDO0lBQ1QsQ0FBQztDQUNGO0FBRUQsa0JBQWUsSUFBSSxtQkFBbUIsRUFBRSxDQUFDIn0=