using System.Collections.Generic;
using System.Web.Http;
using InterviewTestPagination.Models;
using InterviewTestPagination.Models.Todo;
using System.Linq;

namespace InterviewTestPagination.Controllers
{
    /// <summary>
    /// 'Rest' controller for the <see cref="Todo"/>
    /// model.
    /// 
    /// TODO: implement the pagination Action
    /// </summary>
    public class TodoController : ApiController
    {

        // TODO: [low priority] setup DI 
        private readonly IModelService<Todo> _todoService = new TodoService();

        [HttpGet]
        public IEnumerable<Todo> Todos() {
            return _todoService.List();
        }

        [HttpGet]
        public IEnumerable<Todo> todoListPaginated(int size, int page, string orderBy = "creationDate", bool reOrderBy = true) {
            page--;
            switch (orderBy) {
                case "id":
                    if (reOrderBy) {
                        return _todoService.List().OrderByDescending(item => item.Id).Skip(size * page).Take(size);
                    }
                    else {
                        return _todoService.List().OrderBy(item => item.Id).Skip(size * page).Take(size);
                    }
                case "task":
                    if (reOrderBy) {
                        return _todoService.List().OrderByDescending(item => item.Task).Skip(size * page).Take(size);
                    }
                    else {
                        return _todoService.List().OrderBy(item => item.Task).Skip(size * page).Take(size);
                    }
                case "creationDate":
                    if (reOrderBy) {
                        return _todoService.List().OrderByDescending(item => item.CreatedDate).Skip(size * page).Take(size);
                    }
                    else {
                        return _todoService.List().OrderBy(item => item.CreatedDate).Skip(size * page).Take(size);
                    }
                default:
                    return _todoService.List().OrderBy(item => item.CreatedDate).Skip(size * page).Take(size);
            }
        }
    }
}
