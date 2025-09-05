using System.Linq.Expressions;
using System.Reflection;
using System.Text.Json;

namespace ECS.PrimengTable.Services {
    internal class PredicateBuilderService {
        /// <summary>
        /// Creates a text filter predicate for the specified property taking into account the passed filter value and match mode.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="matchMode">The mode of string matching. Valid values are: "startsWith", "contains", "notContains", "endsWith", "equals" or "notEquals". Optional. Default value is "contains".</param>
        /// <returns>An expression representing the text filter predicate for the specified property, filter value and match mode.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and match mode.
        /// It handles string matching, and optional null checks for specific data types. Search is case-insensitive
        /// </remarks>
        /// <exception cref="ArgumentException">Thrown when an unsupported match mode is specified.</exception>
        /// <exception cref="ArgumentNullException">Thrown when the property is null.</exception>
        internal static Expression<Func<T, bool>> CreateTextFilterPredicate<T>(MemberExpression property, string filterValue, MethodInfo stringDateFormatMethod, string matchMode = "contains", string dateFormat = "", string dateTimezone = "", string dateCulture = "") {
            #region PREPARE THE toStringMethod
            Expression toStringMethod; // Prepare the method to convert the property to a string if necessary
            bool isStringProperty = property.Type == typeof(string) || Nullable.GetUnderlyingType(property.Type) == typeof(string); // Check if the property type is a string or nullable string
            bool isDateTimeProperty = property.Type == typeof(DateTime) || Nullable.GetUnderlyingType(property.Type) == typeof(DateTime); // Check if the property type is DateTime or nullable DateTime
            if(isStringProperty) { // If the property is a string (or nullable string)
                toStringMethod = property; // Get the property as is, its already a string
            } else if(isDateTimeProperty) { // If the property is DateTime (or nullable DateTime)
                Expression propertyAccess = property;
                if(property.Type == typeof(DateTime?)) {
                    propertyAccess = Expression.Property(property, "Value");
                }
                toStringMethod = Expression.Call(
                    stringDateFormatMethod,
                    propertyAccess,
                    Expression.Constant(dateFormat), // Format
                    Expression.Constant(dateTimezone), // Timezone
                    Expression.Constant(dateCulture) // Culture
                );
            } else { // The property is not a string
                toStringMethod = Expression.Call(property, "ToString", null); // We need to cast ToString
            }
            #endregion
            MethodCallExpression toUpperMethod = Expression.Call(toStringMethod, "ToUpper", null); // Convert property string to uppercase (for case insensitive search)
            filterValue = filterValue.ToUpper(); // Convert filter value to uppercase (for case insensitive search)
            dynamic matchModeCheck = matchMode switch { // Create the predicate based on the match mode
                "startsWith" => Expression.Call(toUpperMethod, "StartsWith", null, Expression.Constant(filterValue)),
                "contains" => Expression.Call(toUpperMethod, "Contains", null, Expression.Constant(filterValue)),
                "notContains" => Expression.Not(Expression.Call(toUpperMethod, "Contains", null, Expression.Constant(filterValue))),
                "endsWith" => Expression.Call(toUpperMethod, "EndsWith", null, Expression.Constant(filterValue)),
                "equals" => Expression.Equal(toUpperMethod, Expression.Constant(filterValue)),
                "notEquals" => Expression.NotEqual(toUpperMethod, Expression.Constant(filterValue)),
                _ => throw new ArgumentException("Invalid filtering option value for text predicate", nameof(matchMode)),
            };
            #region PREPARE THE predicateBody
            dynamic predicateBody; // Prepare the predicate body
            if(isStringProperty) { // If filterDataType is text
                BinaryExpression nullCheck = Expression.NotEqual(property, Expression.Constant(null)); // Prepare binary expression to check for null values
                predicateBody = Expression.AndAlso(nullCheck, matchModeCheck); // Combine null check and string matching conditions using AndAlso
            } else {// If filterDataType is not text
                predicateBody = matchModeCheck; // Just use the matching conditions
            }
            #endregion
            return Expression.Lambda<Func<T, bool>>(predicateBody, property.Expression as ParameterExpression); // Create and return the lambda expression
        }

        /// <summary>
        /// Creates a date filter predicate for the specified property taking into account the passed filter value and match mode.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="parameter">The parameter expression to use in the predicate.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="matchMode">The mode of date matching. Valid values are: "dateIs", "dateIsNot", "dateBefore", "dateAfter". Optional. Default value is "dateIs".</param>
        /// <returns>An expression representing the date filter predicate for the specified property, filter value and match mode.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and match mode.
        /// It handles date matching, and optional null checks for dates.
        /// </remarks>
        /// <exception cref="ArgumentException">Thrown when an unsupported match mode is specified.</exception>
        /// <exception cref="ArgumentNullException">Thrown when the property is null.</exception>
        internal static Expression<Func<T, bool>>? CreateDateFilterPredicate<T>(MemberExpression property, ParameterExpression parameter, dynamic filterValue, string matchMode = "dateIs") {
            Expression<Func<T, bool>>? predicate; // Initialize the predicate as null since it will be set later
            MemberExpression dateProperty = null!; // Initialize the dateProperty as null since it will be set later
            if(!DateTime.TryParse(filterValue.ToString(), out DateTime filterDateTime)) { // Try parsing the filter value as a DateTime
                return null; // Early return if provided filter value is not a date
            }
            if(property.Type != typeof(DateTime)) { // Check if the property is of type DateTime, if not, extract the Date part
                MemberExpression valueExpression = Expression.Property(property, "Value"); // Create an expression representing the "Value" property of the original property
                dateProperty = Expression.Property(valueExpression, nameof(DateTime.Date)); // Create an expression representing the "Date" property of the "Value" property
            }
            predicate = matchMode switch { // Create the predicate based on the match mode
                "dateIs" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.Equal(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.AndAlso(Expression.NotEqual(property, Expression.Constant(null)), Expression.Equal(dateProperty, Expression.Constant(filterDateTime.Date))),
                    parameter),
                "dateIsNot" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.NotEqual(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.Condition(Expression.NotEqual(property, Expression.Constant(null)), Expression.NotEqual(dateProperty, Expression.Constant(filterDateTime.Date)), Expression.Constant(true))
                    , parameter),
                "dateBefore" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.LessThan(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.AndAlso(Expression.NotEqual(property, Expression.Constant(null)), Expression.LessThan(dateProperty, Expression.Constant(filterDateTime.Date))),
                    parameter),
                "dateAfter" => Expression.Lambda<Func<T, bool>>(
                    (property.Type == typeof(DateTime)) ? Expression.GreaterThan(Expression.Property(property, nameof(DateTime.Date)), Expression.Constant(filterDateTime))
                    : Expression.AndAlso(Expression.NotEqual(property, Expression.Constant(null)), Expression.GreaterThan(dateProperty, Expression.Constant(filterDateTime.Date))),
                    parameter),
                _ => throw new ArgumentException("Invalid filtering option value for date predicate", nameof(matchMode)),
            };
            return predicate;
        }

        /// <summary>
        /// Creates a numeric filter predicate for the specified property taking into account the passed filter value and match mode.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="parameter">The parameter expression to use in the predicate.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <param name="matchMode">The mode of numeric matching. Valid values are: "equals", "notEquals", "lt", "lte", "gt", "gte". Optional. Default value is "equals".</param>
        /// <returns>An expression representing the numeric filter predicate for the specified property, filter value, and match mode.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and match mode.
        /// It handles numeric matching and optional null checks for nullable numeric types.
        /// </remarks>
        /// <exception cref="ArgumentException">Thrown when an unsupported match mode is specified.</exception>
        /// <exception cref="ArgumentNullException">Thrown when the property is null.</exception>
        internal static Expression<Func<T, bool>> CreateNumericFilterPredicate<T>(MemberExpression property, ParameterExpression parameter, dynamic filterValue, string matchMode = "equals") {
            Expression<Func<T, bool>> predicate; // Initialize the predicate as null since it will be set later
            MemberExpression valueExpression; // Declare a member expression for the property value
            dynamic constantValue = null!; // Initialize the constant value as null since it will be set later
            MemberExpression conditionExpression; // Declare a member expression for the condition (for nullable types)
            dynamic convertedValue; // Declare a dynamic variable for the converted filter value
            bool isNullableNumber = IsNullableNumber(property); // Check if the property type is nullable
            if(isNullableNumber) { // If the property type is nullable
                convertedValue = Convert.ChangeType(filterValue.ToString(), Nullable.GetUnderlyingType(property.Type)); // Convert the filter value to the underlying type of the nullable property
                valueExpression = Expression.Property(property, "Value"); // Create an expression representing the "Value" property of the original property
                constantValue = Expression.Constant(Convert.ChangeType(convertedValue, Nullable.GetUnderlyingType(property.Type))); // Create a constant expression for the converted filter value
                conditionExpression = Expression.Property(property, "HasValue"); // Create an expression representing the "HasValue" property of the nullable property
            } else { // If the property type is not nullable
                convertedValue = Convert.ChangeType(filterValue.ToString(), property.Type); // Convert the filter value to the property type
                valueExpression = property; // Use the property directly as the value expression
                conditionExpression = null!; // Set the condition expression to null since it's not needed for non-nullable types
            }
            predicate = matchMode switch { // Create the predicate based on the match mode
                "equals" => Expression.Lambda<Func<T, bool>>(isNullableNumber ? Expression.AndAlso(conditionExpression, Expression.Equal(valueExpression, constantValue))
                                        : Expression.Equal(property, Expression.Constant(convertedValue)), parameter),
                "notEquals" => Expression.Lambda<Func<T, bool>>(isNullableNumber ? Expression.OrElse(Expression.AndAlso(conditionExpression, Expression.NotEqual(valueExpression, constantValue)),
                                        Expression.Equal(property, Expression.Constant(null, property.Type)))
                                        : Expression.NotEqual(property, Expression.Constant(convertedValue)), parameter),
                "lt" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.AndAlso(conditionExpression, Expression.LessThan(valueExpression, constantValue))
                                        : Expression.LessThan(property, Expression.Constant(convertedValue)), parameter),
                "lte" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.Condition(conditionExpression, Expression.LessThanOrEqual(valueExpression, constantValue), Expression.Constant(false))
                                        : Expression.LessThanOrEqual(property, Expression.Constant(convertedValue)), parameter),
                "gt" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.AndAlso(conditionExpression, Expression.GreaterThan(valueExpression, constantValue))
                                        : Expression.GreaterThan(property, Expression.Constant(convertedValue)), parameter),
                "gte" => Expression.Lambda<Func<T, bool>>(
                                        isNullableNumber ? Expression.Condition(conditionExpression, Expression.GreaterThanOrEqual(valueExpression, constantValue), Expression.Constant(false))
                                        : Expression.GreaterThanOrEqual(property, Expression.Constant(convertedValue)), parameter),
                _ => throw new ArgumentException("Invalid filtering option value for numeric predicate", nameof(matchMode)),
            };
            return predicate;
        }
        private static bool IsNullableNumber(MemberExpression property) {
            return property.Type.IsGenericType && property.Type.GetGenericTypeDefinition() == typeof(Nullable<>);
        }
        /// <summary>
        /// Creates a boolean filter predicate for the specified property taking into account the passed filter value.
        /// </summary>
        /// <typeparam name="T">The type of entity.</typeparam>
        /// <param name="property">The property to filter on.</param>
        /// <param name="parameter">The parameter expression to use in the predicate.</param>
        /// <param name="filterValue">The value to filter with.</param>
        /// <returns>An expression representing the boolean filter predicate for the specified property and filter value.</returns>
        /// <remarks>
        /// The method creates a predicate based on the provided filter value and the type of the property.
        /// It handles boolean matching for both nullable and non-nullable boolean properties.
        /// </remarks>
        internal static Expression<Func<T, bool>>? CreateBoolFilterPredicate<T>(MemberExpression property, ParameterExpression parameter, dynamic filterValue) {
            Expression<Func<T, bool>>? predicate = null; // Initialize the predicate as null since it will be set later
            Type propertyType = property.Type; // Get the type of the property
            if(!bool.TryParse(filterValue.ToString(), out bool filterBool)) { // Try parsing the filter value as a boolean
                return null; // Early return if provided filter value is not a boolean
            }
            if(propertyType == typeof(bool?)) { // If the property type is nullable boolean
                predicate = Expression.Lambda<Func<T, bool>>(
                    Expression.Equal(property, Expression.Constant((bool?)filterBool, typeof(bool?))),
                    parameter); // Create the predicate for nullable boolean property
            } else if(propertyType == typeof(bool)) { // If the property type is non-nullable boolean
                predicate = Expression.Lambda<Func<T, bool>>(
                    Expression.Equal(property, Expression.Constant(filterBool, typeof(bool))),
                    parameter); // Create the predicate for non-nullable boolean property
            }
            return predicate;
        }

        internal static Expression<Func<T, bool>> CreateListFilterPredicate<T>(MemberExpression property, dynamic filterValue) {
            dynamic filterValuesDeserialized = JsonSerializer.Deserialize((JsonElement)filterValue, typeof(string))!.ToString()!.ToUpper();
            MethodCallExpression toUpperMethod = Expression.Call(property, "ToUpper", null);
            dynamic listContains = Expression.Call(toUpperMethod, "Contains", null, Expression.Constant(filterValuesDeserialized));
            return Expression.Lambda<Func<T, bool>>(listContains, property.Expression as ParameterExpression);
        }
    }
}