using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Raven.Imports.Newtonsoft.Json.Serialization;

namespace DevKit.Entity.Enhanced
{
    public class EntityContractResolver : DefaultContractResolver
    {
        protected override IList<JsonProperty> CreateProperties(Type type, Raven.Imports.Newtonsoft.Json.MemberSerialization memberSerialization)
        {

            //type.GetProperties().Select( p => p.Attributes)

            return base.CreateProperties(type, memberSerialization);
        }
    }
}
