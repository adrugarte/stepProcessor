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
using StepsProcessor.Models;
using Raven.Abstractions.Util;
using Raven.Client.UniqueConstraints;

namespace StepsProcessor.Controllers
{
    public class RavenDbController : ApiController
    {
        private IDocumentSession _session;
            public static IDocumentStore DocStore
            {
                get { return LazyDocStore.Value; }
            }

            //private RavenDbController() { }

            private static readonly Lazy<IDocumentStore> LazyDocStore = new Lazy<IDocumentStore>(() =>
            {
                var docStore = new DocumentStore
                {
                    ConnectionStringName = "RavenServer",
                };

                docStore.Initialize();
                docStore.RegisterListener(new UniqueConstraintsStoreListener());
                docStore.Conventions.IdentityPartsSeparator = "-";
                docStore.Conventions.FindTypeTagName = type => type == typeof(Person) ? "Persons" : DocumentConvention.DefaultTypeTagName(type);
                RegisterIdConventions(ref docStore);
                return docStore;
            });

            public IAsyncDocumentSession AsyncSession { get; set; }
            public IDocumentSession Session {
                get { if (_session == null) _session = DocStore.OpenSession(); return _session;} } 

            public async override Task<HttpResponseMessage> ExecuteAsync(
                HttpControllerContext controllerContext,
                CancellationToken cancellationToken)
            {
                using (AsyncSession = DocStore.OpenAsyncSession())
                {
                    var result = await base.ExecuteAsync(controllerContext, cancellationToken);
                    await AsyncSession.SaveChangesAsync();

                    return result;
                }
            }

            private static void RegisterIdConventions(ref DocumentStore docStore)
            {
                docStore.Conventions.RegisterIdConvention<Person>((dbname, commands, person) => "person/");
                docStore.Conventions.RegisterAsyncIdConvention<Person>((dbname, commands, person) => new CompletedTask<string>("person/"));
            }

    }
}
