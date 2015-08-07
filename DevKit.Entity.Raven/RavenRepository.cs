using DevKit.Entity;
using Raven.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using Raven.Client.Linq;
using System.Linq.Expressions;
using System.Collections;
using DevKit.Commerce.Enhanced; 

namespace DevKit.Entity.Enhanced
{
    public class RavenRepository<T> : DevKit.Entity.IRepository<T> where T: BaseEntity
    {
        public IAsyncDocumentSession AsyncSession;
        public IDocumentSession Session;
        public IDataContext DataContext { get; set; }

        public T Add(T t)
        {
            ITrackChange itrack = t as ITrackChange;
            if (itrack != null)
            {
                if (itrack.CreatedTime == DateTime.MinValue)
                    itrack.CreatedTime = DateTime.UtcNow;
            }

            Session.Store(t);
            return t;
        }

        public async System.Threading.Tasks.Task<T> AddAsync(T t)
        {
            ITrackChange itrack = t as ITrackChange;
            if (itrack != null)
            {
                if (itrack.CreatedTime == DateTime.MinValue)
                    itrack.CreatedTime = DateTime.UtcNow;
            }

            await AsyncSession.StoreAsync(t);
            return t;
        }

        public int Count()
        {
            throw new NotImplementedException();
        }

        public System.Threading.Tasks.Task<int> CountAsync()
        {
            throw new NotImplementedException();
        }

        public int Delete(long id)
        {
            int count = 0;
            var existing = Session.Load<T>(EntityUtility.GetRecordId<T>(id));
            if (existing != null)
            {
                count = 1;
                Session.Delete(existing);
            }
            return count;
            
        }

        public async System.Threading.Tasks.Task<int> DeleteAsync(long id)
        {
            int count = 0;
            var existing = await AsyncSession.LoadAsync<T>(EntityUtility.GetRecordId<T>(id));
            if (existing != null)
            {
                count = 1;
                AsyncSession.Delete(existing);
            }
            return count;
        }

        public T Find(System.Linq.Expressions.Expression<Func<T, bool>> match)
        {
            return Session.Query<T>().Where(match).FirstOrDefault();
        }


        public System.Threading.Tasks.Task<T> FindAsync(System.Linq.Expressions.Expression<Func<T, bool>> match)
        {
            return AsyncSession.Query<T>().Where(match).FirstOrDefaultAsync();
        }


        public IQueryable<T> FindAll(System.Linq.Expressions.Expression<Func<T, bool>> match)
        {   
            
            return Session.Query<T>().Where(match);
        }
        public async System.Threading.Tasks.Task<IEnumerable<T>> FindAllAsync(System.Linq.Expressions.Expression<Func<T, bool>> match)
        { 
            return await AsyncSession.Query<T>().Where(match).ToListAsync();
        }

        public T Get(long id)
        {
            return Session.Load<T>(EntityUtility.GetRecordId<T>(id));
        }

        public IQueryable<T> GetAll()
        {
            return Session.Query<T>().AsQueryable();
        }

        public async System.Threading.Tasks.Task<IEnumerable<T>> GetAllAsync()
        {
            return await AsyncSession.Query<T>().ToListAsync();
            
        }

        public async System.Threading.Tasks.Task<T> GetAsync(long id)
        {
            return await AsyncSession.LoadAsync<T>(EntityUtility.GetRecordId<T>(id));
        }

        public T Update(T updated, long id)
        {
            T t = Session.Load<T>(EntityUtility.GetRecordId<T>(id));
            t.CopyPropertiesFrom(updated);
            //t.Properties = updated.Properties;
            t.Id = id;
            return t;
        }

        public async System.Threading.Tasks.Task<T> UpdateAsync(T updated, long id)
        {
            T t = await AsyncSession.LoadAsync<T>(EntityUtility.GetRecordId<T>(id));
            t.CopyPropertiesFrom(updated);
            //t.Properties = updated.Properties;
            t.Id = id;
            return t;
        }

        public void Dispose()
        {
            
        }


        public IQueryable<P> FindAllByProperty<P>(string property, object value) where P:IProperties
        {
            return Session.Advanced.LuceneQuery<P, Idx_EntityDynamicProperty<P>>()
                 .WhereEquals(property, value).AsQueryable<P>();
        }

        public IRepository<T> Include<R>( Expression<Func<T, object>> expression) where R : BaseEntity
        {
            if (Session != null)
            {
                Session.Include<T, R>(expression);
            }
            if (AsyncSession != null)
            {
                Session.Include<T, R>(expression);
            }
            return this;
        }


        public T[] Get(long[] ids)
        {
            var array = ids.Select(id =>EntityUtility.GetRecordId<T>(id) ).ToArray();

            return Session.Load<T>(array); 
        }

        public Task<T[]> GetAsync(long[] ids)
        {
            var array = ids.Select(id => EntityUtility.GetRecordId<T>(id)).ToArray();
            return AsyncSession.LoadAsync<T>(array); 
        }
    }
}