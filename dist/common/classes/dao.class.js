"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAO = void 0;
class DAO {
    static isCascadeRemoval(query) {
        return ((query.getOptions().comment && 'cascade' in query.getOptions().comment) ||
            query.getOptions().comment.cascade === true);
    }
}
exports.DAO = DAO;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGFvLmNsYXNzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tbW9uL2NsYXNzZXMvZGFvLmNsYXNzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUVBLE1BQXNCLEdBQUc7SUFHaEIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEtBQStCO1FBQzVELE9BQU8sQ0FDTCxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLElBQUksU0FBUyxJQUFJLEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUM7WUFDdkUsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUM1QyxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBVEQsa0JBU0MifQ==