using Data.PrimengTableReusableComponent;
using Microsoft.AspNetCore.Mvc;
using PrimeNG.DTOs;
using PrimeNG.HelperFunctions;
using PrimeNGTableReusableComponent.DTOs;
using Swashbuckle.AspNetCore.Annotations;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
using Models.PrimengTableReusableComponent;
using static System.Runtime.InteropServices.JavaScript.JSType;

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
                    ).AsNoTracking();
                return Ok(PrimeNGHelper.PerformDynamicQuery(inputData, baseQuery, stringDateFormatMethod, "Username", 1));
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
                    ID = t.Id,
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
        #region 
        [HttpPost("[action]")]
        public async Task<IActionResult> GetSaveState([FromBody] PrimeNGGetSaveStateRequestDTO request) {
            try {
                var stateData = await _context.TableSaveStates
                .Where(s => s.Username == request.Username && s.TableKey == request.TableStateSaveKey)
                .ToListAsync();
                if(stateData.Any()) {
                    var result = stateData.Select(s => new PrimeNGSaveStateListDTO {
                        StateAlias = s.StateName, // Asumiendo que StateName es el alias
                        State = s.StateData
                    }).ToList();
                    return Ok(result);
                }
                return Ok(new List<PrimeNGSaveStateListDTO>());
            } catch(Exception ex) {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
        #region 
        [HttpPost("[action]")]
        public async Task<IActionResult> SetSaveState([FromBody] PrimeNGSetSaveStateRequestDTO request) {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try {
                List<TableSaveState>? existingStates = await _context.TableSaveStates
                    .Where(t => t.Username == request.Username && t.TableKey == request.TableStateSaveKey)
                    .ToListAsync();
                List<string>? receivedAliases = request.SaveStates.Select(s => s.StateAlias).ToList();
                foreach(PrimeNGSaveStateListDTO saveState in request.SaveStates) {
                    TableSaveState? existingState = existingStates.Find(s => s.StateName == saveState.StateAlias);
                    if(existingState != null) {
                        existingState.StateData = saveState.State;
                    } else {
                        TableSaveState newState = new TableSaveState {
                            Username = request.Username,
                            TableKey = request.TableStateSaveKey,
                            StateName = saveState.StateAlias,
                            StateData = saveState.State
                        };
                        await _context.TableSaveStates.AddAsync(newState);
                    }
                }
                var statesToDelete = existingStates.Where(e => !receivedAliases.Contains(e.StateName)).ToList();
                if(statesToDelete.Count != 0) {
                    _context.TableSaveStates.RemoveRange(statesToDelete);
                }
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
                return Ok();
            } catch(Exception ex) {
                await transaction.RollbackAsync();
                return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred: {ex.Message}");
            }
        }
        #endregion
    }
}