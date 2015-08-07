using Raven.Client.Listeners;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DevKit.Entity.Enhanced
{
    public class EntityDocumentConverter : IDocumentConversionListener
    {
        public void DocumentToEntity(string key, object entity, Raven.Json.Linq.RavenJObject document, Raven.Json.Linq.RavenJObject metadata)
        {
            ITrackChange e = entity as ITrackChange;
            if( e != null)
            {  
                e.ModifiedTime = metadata.Value<DateTime>("Last-Modified");
            }
        }

        public void EntityToDocument(string key, object entity, Raven.Json.Linq.RavenJObject document, Raven.Json.Linq.RavenJObject metadata)
        {
            //ITrackChange e = entity as ITrackChange;
            //if (e != null)
            //{
            //    //e.ModifiedTime = metadata.Value<DateTime>("Last-Modified");
            //}

        }
    }
}
