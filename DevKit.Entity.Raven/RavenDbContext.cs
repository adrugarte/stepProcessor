using DevKit.Entity;
using Raven.Client;
using Raven.Client.Document;
using Raven.Imports.Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DevKit.Entity.Enhanced
{
    public class RavenDbContext: IDataContext
    {

        static Dictionary<string, DocumentStore> stores = new Dictionary<string, DocumentStore>();

        IAsyncDocumentSession asyncSession;

        public IAsyncDocumentSession AsyncSession
        {
            get { return asyncSession; }
            set { asyncSession = value; }
        }

        IDocumentSession session;
        //EntityRavenDBJsonConverter converter = new EntityRavenDBJsonConverter();

        public IDocumentSession Session
        {
            get { return session; }
            set { session = value; }
        }
        public DocumentStore docStore;
        string dbName = "NetDapEnterprise";

        public void InitializeContext(string connectionString, params object[] parameters)
        {

            string[] vs = connectionString.Split(new char[] { ';' });

            Dictionary<string, string> properties = new Dictionary<string, string>();
            foreach (var se in vs)
            {
                var keyvalue = se.Split(new char[] { '=' });
                properties.Add(keyvalue[0], keyvalue[1]);

            }

            string storeKey =  connectionString ;

            if (stores.ContainsKey(storeKey))
            {
                docStore = stores[storeKey];
            }
            else
            {
                InitStore(properties, storeKey);
            }

            session = docStore.OpenSession();
        }

        private void InitStore(Dictionary<string, string> properties, string storeKey)
        {
            string json = JsonConvert.SerializeObject(properties);
            docStore = JsonConvert.DeserializeObject<DocumentStore>(json);

            docStore.Conventions.MaxNumberOfRequestsPerSession = 1000;

            docStore.Conventions.FindTypeTagName = (type) => type.Name;
            //docStore.Conventions.ShouldCacheRequest = url => true;



            //docStore.Conventions.JsonContractResolver = new EntityContractResolver();
            docStore.RegisterListener(new EntityDocumentConverter());

            docStore.Initialize();
            stores[storeKey] = docStore;

            if (StoreInitialized != null)
                StoreInitialized.Invoke();
        }

        public void InitializeAsyncContext(string connectionString, params object[] parameters)
        {
           string[] vs = connectionString.Split(new char[] { ';' });

            Dictionary<string, string> properties = new Dictionary<string, string>();
            foreach (var se in vs)
            {
                var keyvalue = se.Split(new char[] { '=' });
                properties.Add(keyvalue[0], keyvalue[1]);

            }

            string storeKey =  connectionString ;

            if (stores.ContainsKey(storeKey))
            {
                docStore = stores[storeKey];
            }
            else
            {
                InitStore(properties, storeKey);
            }
            asyncSession = docStore.OpenAsyncSession();
        }

        public event Action StoreInitialized;


        public void SaveChanges()
        {
            session.SaveChanges();
        }

        public void SaveChangesAsync()
        {
            asyncSession.SaveChangesAsync();
        }


        public IRepository<T> GetRepository<T>() where T : BaseEntity
        {
            
            return new RavenRepository<T>() { Session = session, AsyncSession = asyncSession, DataContext = this };
        }


        public void Dispose()
        {
            if (session != null)
                session.Dispose();

            if (asyncSession != null)
                asyncSession.Dispose();
        }


        public object GetNativeContext()
        {
            if (Session != null)
                return Session;

            if (asyncSession != null)
                return asyncSession;

            return null;
        }

        
    }
}