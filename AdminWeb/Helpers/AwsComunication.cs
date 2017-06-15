using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Amazon.SimpleNotificationService;
using Amazon.SimpleNotificationService.Model;

namespace AdminWeb.Helpers
{
    public class AwsComunication
    {
        public string Phone { get; set; }
        public string Text { get; set; }
        public string Subject { get; set; }

        private AmazonSimpleNotificationServiceClient client;
        private string _bucketName = "*** bucket name ***";

        public void CreateTopic(string[] phoneList)
        {




        }


        public string sendText()
        {
            string s="success";
            var Config = clsDataManager.S3Config;

            Amazon.Runtime.AWSCredentials credentials = new Utils.Credentials(Config.AccessKeyId, Config.AccessSecretkey);


            using (client = new AmazonSimpleNotificationServiceClient(credentials, Utils.EndPointGet(Config.RegionEndPoint)))
            {
                Dictionary<String, MessageAttributeValue> smsAttributes =  new Dictionary<String, MessageAttributeValue>();
                smsAttributes.Add("AWS.SNS.SMS.SenderID", new MessageAttributeValue() { StringValue = "MBImmi", DataType = "String" });
                smsAttributes.Add("AWS.SNS.SMS.MaxPrice", new MessageAttributeValue()  { StringValue = "0.50", DataType = "Number" });
                smsAttributes.Add("AWS.SNS.SMS.SMSType", new MessageAttributeValue() { StringValue = "Transactional", DataType = "String" });

                PublishRequest req = new PublishRequest();
                req.PhoneNumber = "+17864137596";
                req.Message = "This is a test";
                req.MessageAttributes = smsAttributes;
                PublishResponse response = client.Publish(req);
                if (response.HttpStatusCode != System.Net.HttpStatusCode.OK) s = "error";
            }

            return s;
        }
    }
}