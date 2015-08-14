using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Raven.Client.Document;
using System.Threading.Tasks;
using Raven.Client;
using System.Web.Http.Controllers;
using System.Threading;
using Raven.Abstractions.Util;
//using Raven.Client.UniqueConstraints;

namespace Dade_ContentSecurity.Helpers
{
    public static class RavenCnn
    {

        private static IAsyncDocumentSession _asyncsession;
        private static IDocumentSession _session;
        public static IDocumentStore DocStore
        {
            get { return LazyDocStore.Value; }
        }

        //private RavenDbController() { }

        private static readonly Lazy<IDocumentStore> LazyDocStore = new Lazy<IDocumentStore>(() =>
        {
            var docStore = new DocumentStore
            {
                ConnectionStringName = "RavenSecurity"
            };

            docStore.Initialize();
            //docStore.RegisterListener(new UniqueConstraintsStoreListener());
            //docStore.Conventions.IdentityPartsSeparator = "-";
            //docStore.Conventions.FindTypeTagName = type => type == typeof(Person) ? "Persons" : DocumentConvention.DefaultTypeTagName(type);
            //RegisterIdConventions(ref docStore);
            return docStore;
        });

        public static IDocumentSession Session {
            get { if (_session == null) _session = DocStore.OpenSession(); return _session; }
        }
        public static IAsyncDocumentSession AsyncSession
        {
            get { if (_asyncsession == null) _asyncsession = DocStore.OpenAsyncSession(); return _asyncsession; }
        }

        //public async override Task<HttpResponseMessage> ExecuteAsync(
        //    HttpControllerContext controllerContext,
        //    CancellationToken cancellationToken)
        //{
        //    using (AsyncSession = DocStore.OpenAsyncSession())
        //    {
        //        var result = await base.ExecuteAsync(controllerContext, cancellationToken);
        //        await AsyncSession.SaveChangesAsync();

        //        return result;
        //    }
        //}

        //private static void RegisterIdConventions(ref DocumentStore docStore)
        //{
        //    docStore.Conventions.RegisterIdConvention<Person>((dbname, commands, person) => "person/");
        //    docStore.Conventions.RegisterAsyncIdConvention<Person>((dbname, commands, person) => new CompletedTask<string>("person/"));
        //}





    }
}
