using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data.Entity;
using System.ComponentModel.DataAnnotations;

namespace AdminWeb.Helpers
{
    public static class clsDataManager
    {

        public static AwsS3Credential S3Config { get { return S3ConfigGet(); } }

        private static AwsS3Credential S3ConfigGet()
        {
            return new AwsS3Credential() { AccessKeyId = "AKIAJ7NNERD5PLTCWVEA", AccessSecretkey = "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", RegionEndPoint = "us-east-1", Bucket = "bravos3", cloudfronturl = "" };
        }

    }

    
    public class AwsS3Credential 
    {
        [StringLength(200)]
        public string Bucket { get; set; }

        [StringLength(500)]
        public string AccessKeyId { get; set; }

        [StringLength(500)]
        public string AccessSecretkey { get; set; }

        [StringLength(200)]
        public string RegionEndPoint { get; set; }

        [StringLength(500)]
        public string cloudfronturl { get; set; }
    }


}