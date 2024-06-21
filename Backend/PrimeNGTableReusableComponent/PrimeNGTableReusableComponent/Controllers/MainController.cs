using Data.PrimengTableReusableComponent;
using Microsoft.AspNetCore.Mvc;
using PrimeNG.DTOs;
using PrimeNG.HelperFunctions;
using PrimeNGTableReusableComponent.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using System.Data.Entity;
using System.Reflection;

namespace PrimeNGTableReusableComponent.Controllers {
    [ApiController]
    [Route("[controller]")]
    public class MainController(primengTableReusableComponentContext context) : ControllerBase {
        private readonly primengTableReusableComponentContext _context = context; // Injection of the context

        private static readonly MethodInfo stringDateFormatMethod = typeof(MyDBFunctions).GetMethod(nameof(MyDBFunctions.FormatDateWithCulture), new[] { typeof(DateTime), typeof(string), typeof(string), typeof(string) })!; // Needed import for being able to perform global search on dates

        #region HttpGet - Test1GetCols
        [HttpGet("[action]")]
        [SwaggerOperation(
            "Retrieves all information needed to init the table for Test 1.",
            "This API function will get all the table columns data for Test 1 needed, and some additional information like the date format and allowed items per page."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(PrimeNGTableColsAndAllowedPagination))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public IActionResult Test1GetCols() {
            try {
                return Ok(PrimeNGHelper.GetColumnsInfo<TestDTO>()); // Get all the columns information to be returned
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region HttpPost - Test1GetData
        [HttpPost("[action]")]
        [SwaggerOperation(
            "Retrieves all information to be show in the table for Test 1.",
            "This API function will get all the data that needs to be shown in Test 1 applying all requested rules."
            )]
        [SwaggerResponse(StatusCodes.Status200OK, "Returned if everything went OK.", typeof(List<PrimeNGPostReturn>))]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Returned if the items per page is not allowed or no columns have been specified.", typeof(string))]
        [SwaggerResponse(StatusCodes.Status500InternalServerError, "Returns an error message if an unexpected error occurs.", typeof(string))]
        public IActionResult Test1GetData([FromBody] PrimeNGPostRequest inputData) {
            try {
                if(!PrimeNGHelper.ValidateItemsPerPageSizeAndCols(inputData.pageSize, inputData.columns)) { // Validate the items per page size and columns
                    return BadRequest("Invalid page size or no columns for selection have been specified.");
                }
                IQueryable<TestDTO> baseQuery = _context.Test1Tables
                    .Select(
                        u => new TestDTO {
                            id = u.Id,
                            username = u.Username,
                            age = u.Age,
                            birthdate = u.Birthdate,
                            payedTaxes = u.PayedTaxes,
                            dateCreated = u.DateCreated,
                            dateUpdated = u.DateUpdated
                        }
                    ).AsNoTracking();
                return Ok(PrimeNGHelper.PerformDynamicQuery(inputData, baseQuery, stringDateFormatMethod, "username", 1, ["id"]));
            } catch(Exception ex) { // Exception Handling: Returns a result with status code 500 (Internal Server Error) and an error message.
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion

    }
}
