using Data.PrimengTableReusableComponent;
using Microsoft.AspNetCore.Mvc;
using PrimeNG.DTOs;
using PrimeNG.HelperFunctions;
using PrimeNGTableReusableComponent.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using System.Reflection;
using Microsoft.EntityFrameworkCore;

namespace PrimeNGTableReusableComponent.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MainController(primengTableReusableComponentContext context) : ControllerBase {
        private readonly primengTableReusableComponentContext _context = context; // Injection of the context

        private static readonly MethodInfo stringDateFormatMethod = typeof(MyDBFunctions).GetMethod(nameof(MyDBFunctions.FormatDateWithCulture), new[] { typeof(DateTime), typeof(string), typeof(string), typeof(string) })!; // Needed import for being able to perform global search on dates

        #region HttpGet - TestGetCols
        [HttpGet("[action]")]
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
        [SwaggerOperation(
            "Retrieves all information to be show in the table for Test.",
            "This API function will get all the data that needs to be shown in Test applying all requested rules."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(PrimeNGPostReturn))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Returned if the items per page is not allowed or no columns have been specified.", typeof(string))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public IActionResult TestGetData([FromBody] PrimeNGPostRequest inputData) {
            try {
                if(!PrimeNGHelper.ValidateItemsPerPageSizeAndCols(inputData.pageSize, inputData.columns)) { // Validate the items per page size and columns
                    return BadRequest("Invalid page size or no columns for selection have been specified.");
                }
                IQueryable<TestDto> baseQuery = _context.TestTables
                    .Select(
                        u => new TestDto {
                            id = u.Id,
                            username = u.Username,
                            age = u.Age,
                            employmentStatusName =
                                u.EmploymentStatusId != null ?
                                    _context.EmploymentStatusCategories
                                        .Where(d => d.Id == u.EmploymentStatusId)
                                        .Select(d => d.StatusName).FirstOrDefault() 
                                    : null,
                            birthdate = u.Birthdate,
                            payedTaxes = u.PayedTaxes
                        }
                    ).AsNoTracking();
                return Ok(PrimeNGHelper.PerformDynamicQuery(inputData, baseQuery, stringDateFormatMethod, "username", 1, ["id"]));
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region HttpGet - GetEmploymentStatus
        [HttpGet("[action]")]
        [SwaggerOperation(
            "Retrieves all possible employment status.",
            "This API function will return all employment status."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(List<EmploymentStatusDto>))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public async Task<IActionResult> GetEmploymentStatus() {
            try {
                List<EmploymentStatusDto> data = await _context.EmploymentStatusCategories.OrderBy(t => t.StatusName).Select(t => new EmploymentStatusDto {
                    StatusName = t.StatusName,
                    ColorR = t.ColorR,
                    ColorG = t.ColorG,
                    ColorB = t.ColorB
                }).AsNoTracking().ToListAsync();
                return Ok(data);
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
    }
}
