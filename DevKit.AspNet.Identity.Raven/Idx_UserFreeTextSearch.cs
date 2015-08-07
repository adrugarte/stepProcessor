using Raven.Client.Indexes;
using Raven.Abstractions.Indexing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace DevKit.AspNet.Identity.Raven
{
    public class Idx_UserFreeTextSearch<TUser> : AbstractIndexCreationTask<TUser, Idx_UserFreeTextSearch<TUser>.ReduceResult> where TUser : IdentityUser
    {
        public class ReduceResult
        {
            public string Id { get; set; }
            public object[] Text { get; set; }

            public DateTime CreatedTime { get; set; }
        }

        public Idx_UserFreeTextSearch()
        {
            Map = users => from user in users
                           select new {
                               Text = new object[] { user.Email , user.DisplayName, user.UserName, user.Phone, user.Id },
                               CreatedTime = user.CreatedTime
                           };

            Index(x => x.Text, FieldIndexing.Analyzed);
            Analyze(x => x.Text, "Lucene.Net.Analysis.Standard.StandardAnalyzer, Lucene.Net");
           
        }
    }
}
