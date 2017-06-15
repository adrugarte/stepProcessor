using System;
using System.Threading.Tasks;
using System.Configuration;
using Twilio;
using Twilio.Rest.Api.V2010.Account;
using Twilio.Types;
using System.Collections.Generic;

namespace twilioCom
{
    public class twilioSms
    {

        private string TwilioAccountSid;
        private string TwilioauthToken;
        private string TwilioPhoneNumber;

        public twilioSms(string _twilioAccountSid, string _twilioauthToken, string _twilioPhoneNumber)
        {
            TwilioAccountSid = _twilioAccountSid;
            TwilioauthToken = _twilioauthToken;
            TwilioPhoneNumber = _twilioPhoneNumber;
        }

        public string Send(string toPhone, string msg, List<Uri> mediaUrl=null)
        {
            string error = "";

            TwilioClient.Init(TwilioAccountSid, TwilioauthToken);

            CreateMessageOptions  msgOptions = new CreateMessageOptions(new PhoneNumber(toPhone));
            msgOptions.Body = msg;
            msgOptions.From = new PhoneNumber(TwilioPhoneNumber);
            if (mediaUrl != null) msgOptions.MediaUrl = mediaUrl;

            var message = MessageResource.Create(msgOptions);

            if (message.Status == MessageResource.StatusEnum.Failed)
            {
                error = message.ErrorMessage + " error: " + message.ErrorCode.ToString();
            }

            return error;

        }
    }


}
