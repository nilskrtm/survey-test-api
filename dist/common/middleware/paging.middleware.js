"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const maxPerPage = Number(process.env.MAX_PER_PAGE) || 50;
const roundUp = (number, decimals) => {
    if (decimals === 0) {
        return Math.ceil(number);
    }
    const factor = 10 ** decimals;
    return Math.ceil(number * factor) / factor;
};
class PagingMiddleware {
    extractPagingParameters(req, res, next) {
        try {
            let paging = {
                page: 1,
                perPage: maxPerPage,
            };
            if ('page' in req.query && !isNaN(Number(req.query.page))) {
                paging.page = Number(req.query.page);
            }
            if ('perPage' in req.query && !isNaN(Number(req.query.perPage))) {
                if (Number(req.query.perPage) > maxPerPage) {
                    paging.perPage = maxPerPage;
                }
                else {
                    paging.perPage = Number(req.query.perPage);
                }
            }
            req.body.paging = paging;
        }
        catch (err) {
            return res.status(400).send({ errors: ['Invalid paging info'] });
        }
        next();
    }
    dummyPagingParameters(req, res, next) {
        try {
            req.body.paging = {
                page: 1,
                perPage: maxPerPage,
            };
        }
        catch (err) {
            return res
                .status(400)
                .send({ errors: ['Error setting dummy paging info'] });
        }
        next();
    }
    calculatePaging(requestParams, count) {
        let offset = requestParams.perPage * (requestParams.page - 1);
        let lastPage = roundUp(count / requestParams.perPage, 0);
        let lastPageOffset = requestParams.perPage * (lastPage - 1);
        if (lastPage === 0) {
            lastPage = 1;
        }
        let paging = {
            perPage: requestParams.perPage,
            page: requestParams.page,
            lastPage: lastPage,
            offset: offset,
            count: count,
        };
        if (count - offset < 1) {
            if (count != 0) {
                paging.page = lastPage;
                paging.offset = lastPageOffset;
            }
            else {
                paging.page = 1;
                paging.offset = 0;
            }
        }
        return paging;
    }
    ignoreValue(value) {
        return value;
    }
}
exports.default = new PagingMiddleware();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFnaW5nLm1pZGRsZXdhcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21tb24vbWlkZGxld2FyZS9wYWdpbmcubWlkZGxld2FyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLGFBQWE7QUFDYixNQUFNLFVBQVUsR0FBVyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLENBQUM7QUFFbEUsTUFBTSxPQUFPLEdBQUcsQ0FBQyxNQUFjLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO0lBQ25ELElBQUksUUFBUSxLQUFLLENBQUMsRUFBRTtRQUNsQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDMUI7SUFFRCxNQUFNLE1BQU0sR0FBRyxFQUFFLElBQUksUUFBUSxDQUFDO0lBRTlCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQzdDLENBQUMsQ0FBQztBQUVGLE1BQU0sZ0JBQWdCO0lBQ3BCLHVCQUF1QixDQUFDLEdBQVksRUFBRSxHQUFhLEVBQUUsSUFBa0I7UUFDckUsSUFBSTtZQUNGLElBQUksTUFBTSxHQUF3QjtnQkFDaEMsSUFBSSxFQUFFLENBQUM7Z0JBQ1AsT0FBTyxFQUFFLFVBQVU7YUFDcEIsQ0FBQztZQUVGLElBQUksTUFBTSxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtnQkFDekQsTUFBTSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN0QztZQUVELElBQUksU0FBUyxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENB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