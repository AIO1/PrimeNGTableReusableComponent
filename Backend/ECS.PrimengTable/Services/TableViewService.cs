using ECS.PrimengTable.Interfaces;
using ECS.PrimengTable.Models;
using Microsoft.EntityFrameworkCore;

namespace ECS.PrimengTable.Services {
    internal class TableViewService<T> where T : class, ITableViewEntity, new() {
        private readonly DbContext _context;

        internal TableViewService(DbContext context) {
            _context = context;
        }

        internal async Task<List<ViewDataModel>> GetViewsAsync(string username, string tableKey) {
            var data = await _context.Set<T>()
                .AsNoTracking()
                .Where(s => s.Username == username && s.TableKey == tableKey)
                .OrderBy(s => s.ViewAlias)
                .ToListAsync();
            return data.Select(s => new ViewDataModel {
                ViewAlias = s.ViewAlias,
                ViewData = s.ViewData,
                LastActive = s.LastActive
            }).ToList();
        }

        internal async Task SaveViewsAsync(string username, string tableKey, List<ViewDataModel> views) {
            // Begin transaction
            using var transaction = await _context.Database.BeginTransactionAsync();
            try {
                // Get existing views for this user & table (tracked)
                var existingViews = await _context.Set<T>()
                    .Where(t => t.Username == username && t.TableKey == tableKey)
                    .ToListAsync();

                // Names of the received views
                var receivedViewNames = views.Select(s => s.ViewAlias).ToList();

                // Add or update views
                foreach(var view in views) {
                    var existingView = existingViews
                        .FirstOrDefault(s => s.ViewAlias == view.ViewAlias);

                    if(existingView != null) {
                        // Update existing
                        existingView.ViewData = view.ViewData;
                    } else {
                        // Add new
                        var newView = new T {
                            Username = username,
                            TableKey = tableKey,
                            ViewAlias = view.ViewAlias,
                            ViewData = view.ViewData,
                            LastActive = view.LastActive
                        };
                        await _context.Set<T>().AddAsync(newView);
                    }
                }

                // Delete removed views
                var viewsToDelete = existingViews
                    .Where(e => !receivedViewNames.Contains(e.ViewAlias))
                    .ToList();

                if(viewsToDelete.Count != 0) {
                    _context.Set<T>().RemoveRange(viewsToDelete);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            } catch {
                await transaction.RollbackAsync();
                throw; // Let the caller handle the exception
            }
        }
    }
}