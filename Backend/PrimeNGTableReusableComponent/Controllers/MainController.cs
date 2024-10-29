using Data.PrimengTableReusableComponent;
using Microsoft.AspNetCore.Mvc;
using PrimeNG.DTOs;
using PrimeNG.HelperFunctions;
using PrimeNGTableReusableComponent.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Models.PrimengTableReusableComponent;
using System.Globalization;

namespace PrimeNGTableReusableComponent.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MainController(primengTableReusableComponentContext context) : ControllerBase {
        private readonly primengTableReusableComponentContext _context = context; // Injection of the context

        private static readonly MethodInfo stringDateFormatMethod = typeof(MyDBFunctions).GetMethod(nameof(MyDBFunctions.FormatDateWithCulture), new[] { typeof(DateTime), typeof(string), typeof(string), typeof(string) })!; // Needed import for being able to perform global search on dates

        #region HttpGet - TestGetCols
        [HttpGet("[action]")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Retrieves all information needed to init the table for Test.",
            "This API function will get all the table columns data for Test needed, and some additional information like the date format and allowed items per page."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(PrimeNGTableColsAndAllowedPagination))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public IActionResult TestGetCols() {
            try {
                return Ok(PrimeNGHelper.GetColumnsInfo<TestDto>()); // Get all the columns information to be returned
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region HttpPost - TestGetData
        [HttpPost("[action]")]
        [Consumes("application/json")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Retrieves all information to be show in the table for Test.",
            "This API function will get all the data that needs to be shown in Test applying all requested rules."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(PrimeNGPostReturn))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Returned if the items per page is not allowed or no columns have been specified.", typeof(string))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public IActionResult TestGetData([FromBody] PrimeNGPostRequest inputData) {
            try {
                if(!PrimeNGHelper.ValidateItemsPerPageSizeAndCols(inputData.PageSize, inputData.Columns)) { // Validate the items per page size and columns
                    return BadRequest("Invalid page size or no columns for selection have been specified.");
                }
                IQueryable<TestDto> baseQuery = _context.TestTables
                    .AsNoTracking()
                    .Select(
                        u => new TestDto {
                            RowID = u.Id,
                            CanBeDeleted = u.CanBeDeleted,
                            Username = u.Username,
                            Age = u.Age,
                            EmploymentStatusName =
                                u.EmploymentStatusId != null ?
                                    _context.EmploymentStatusCategories
                                        .Where(d => d.Id == u.EmploymentStatusId)
                                        .Select(d => d.StatusName).FirstOrDefault() 
                                    : null,
                            Birthdate = u.Birthdate,
                            PayedTaxes = u.PayedTaxes
                        }
                    );
                List<string> columnsToOrderByDefault = new List<string> { "Age", "EmploymentStatusName" };
                List<int> columnsToOrderByOrderDefault = new List<int> { 0, 0 };
                return Ok(PrimeNGHelper.PerformDynamicQuery(inputData, baseQuery, stringDateFormatMethod, columnsToOrderByDefault, columnsToOrderByOrderDefault));
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region HttpGet - GetEmploymentStatus
        [HttpGet("[action]")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Retrieves all possible employment status.",
            "This API function will return all employment status."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(List<EmploymentStatusDto>))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public async Task<IActionResult> GetEmploymentStatus() {
            try {
                List<EmploymentStatusDto> data = await _context.EmploymentStatusCategories
                    .AsNoTracking()
                    .OrderBy(t => t.StatusName)
                    .Select(t => new EmploymentStatusDto {
                        ID = t.Id,
                        StatusName = t.StatusName,
                        ColorR = t.ColorR,
                        ColorG = t.ColorG,
                        ColorB = t.ColorB
                    }).ToListAsync();
                return Ok(data);
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region HttpPost - GetViews
        [HttpPost("[action]")]
        [Consumes("application/json")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Get views of a table for a specific user.",
            "This API function will retrieve all views for a specific table an user. User is retrieved through JWT (in this example is not configured and it has been hardcoded)."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(PrimeNgGetViewsRequest))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public async Task<IActionResult> GetViews([FromBody] PrimeNgGetViewsRequest request) {
            try {
                string username = "User test"; // This username should be retrieved from a token. This is just for example purposes and it has been hardcoded
                List<TableView>? stateData = await _context.TableViews
                    .AsNoTracking()
                    .Where(s => s.Username == username && s.TableKey == request.TableViewSaveKey)
                    .OrderBy(s => s.ViewAlias)
                    .ToListAsync(); // Retrieve the views of the user for this table
                    if(stateData.Count != 0) { // If there is at least one view
                        List<PrimeNgViewData> result = stateData.Select(s => new PrimeNgViewData {
                            ViewAlias = s.ViewAlias,
                            ViewData = s.ViewData
                        }).ToList();
                        return Ok(result);
                    }
                return Ok(new List<PrimeNgViewData>()); // Return an empty list
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region HttpPost - SaveViews
        [HttpPost("[action]")]
        [Consumes("application/json")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Saves changes to the tables views of a user.",
            "This API function will save all changes made to a view. User is retrieved through JWT (in this example is not configured and it has been hardcoded)."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.")]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public async Task<IActionResult> SaveViews([FromBody] PrimeNgSaveViewsRequest request) {
            using var transaction = await _context.Database.BeginTransactionAsync(); // Begin a transaction to revert any changes in case of error
            try {
                string username = "User test"; // This username should be retrieved from a token. This is just for example purposes and it has been hardcoded
                List<TableView>? existingViews = await _context.TableViews
                    .Where(t => t.Username == username && t.TableKey == request.TableViewSaveKey)
                    .ToListAsync(); // Get a list of the current existing views for this user (need to be tracked for changes)
                List<string>? receivedViewNames = request.Views.Select(s => s.ViewAlias).ToList(); // Get the list of all received view names
                foreach(PrimeNgViewData view in request.Views) { // Loop trhough all views received
                    TableView? existingView = existingViews.Find(s => s.ViewAlias == view.ViewAlias); // Try to get if this view already existed
                    if(existingView != null) { // If the view already existed
                        existingView.ViewData = view.ViewData; // Update the view data
                    } else { // If this a new view
                        TableView newView = new TableView {
                            Username = username,
                            TableKey = request.TableViewSaveKey,
                            ViewAlias = view.ViewAlias,
                            ViewData = view.ViewData
                        }; // Create a new view
                        await _context.TableViews.AddAsync(newView); // Add the new view
                    }
                }
                List<TableView>? viewsToDelete = existingViews.Where(e => !receivedViewNames.Contains(e.ViewAlias)).ToList(); // Get a list of views that no longer exist and need to be deleted
                if(viewsToDelete.Count != 0) { // If there are views to delete
                    _context.TableViews.RemoveRange(viewsToDelete); // Remove all views that need to be deleted
                }
                await _context.SaveChangesAsync(); // Save changes
                await transaction.CommitAsync(); // Commit changes
                return Ok();
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                await transaction.RollbackAsync(); // Perform a rollback of any pending changes
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region HttpGet - TimezoneList
        [HttpGet("[action]")]
        [Produces("application/json")]
        [SwaggerOperation(
            "Returns list of available timezones.",
            "This API function will return all available timezones."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(List<dynamic>))]
        public IActionResult TimezoneList() {
            CultureInfo currentCulture = CultureInfo.CurrentCulture;
            CultureInfo.CurrentCulture = new CultureInfo("en-US");
            var timeZones = TimeZoneInfo.GetSystemTimeZones()
                .Where(tz => !tz.Id.Contains("UTC"))
                .Select(tz => new {
                    DisplayName = tz.DisplayName,
                    Id = tz.Id
                })
                .OrderBy(tz => tz.DisplayName)
                .ToList();
            CultureInfo.CurrentCulture = currentCulture;
            return Ok(timeZones);
        }
        #endregion
    }
}