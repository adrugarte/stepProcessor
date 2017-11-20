using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;

using System.Web.Http;
using AdminWeb.Models;
using AdminWeb.Helpers;
using System.Threading.Tasks;
using System.Web;
using System.IO;
using System.Net.Http.Headers;
using BravoModel.Model;
using BravoRepository;
using System.Configuration;
using twilioCom;
using System.Net.Mail;
using System.Text;


namespace AdminWeb.Controllers
{
    public class ComunicationController : ApiController
    {
        public IHttpActionResult PostComm([FromBody] messageVM msg)
        {
            string errormessage="";
            if (msg.via == "email")
            {
                msg.text = msg.text.Replace("\n", "<br/>");
                sendEmail(msg);
            }
            if (msg.via == "text") sendTextAws();//errormessage = sendTexTwilio(msg);//sendText(msg);

            return Ok(new { errormessage = errormessage});
        }

        private string sendTexTwilio(messageVM _message)
        {
            string signature = "";
            string error = "";
            string msg = "";
            string TwilioAccountSid = ConfigurationManager.AppSettings["TwilioAccountSid"].ToString();
            string TwilioauthToken = ConfigurationManager.AppSettings["TwilioauthToken"].ToString();
            string TwilioPhone = ConfigurationManager.AppSettings["TwilioPhone"].ToString();
            if (ConfigurationManager.AppSettings["EmailSignature"] != null)
            {
                string[] st = ConfigurationManager.AppSettings["EmailSignature"].ToString().Split('|');
                signature = Environment.NewLine + "MB Immigration" + Environment.NewLine + st[1];
                //signature = signature + st[2];
            }

            List<Uri> MediaUrl = null;

            if (_message.includeVcard) {
                if (MediaUrl == null) MediaUrl = new List<Uri>();
                //var fileInfo = new FileInfo(@"..\files\soniamartell.vcf");
                MediaUrl.Add(new Uri(@"http://mbadminweb.us-east-1.elasticbeanstalk.com/files/soniamartell.vcf"));
            }

            msg = _message.text  + Environment.NewLine + signature;

            twilioSms twiliosms = new twilioSms(TwilioAccountSid, TwilioauthToken, TwilioPhone);

            foreach (string phone in _message.customers.Select(c => c.Celular).ToArray())
            {
                if (!string.IsNullOrEmpty(phone) && !(phone.Length < 10)) {
                    try { 
                        twiliosms.Send(phone, msg, MediaUrl); 
                    }
                    catch(Exception e){
                        error = error + Environment.NewLine + e.Message;
                    }
                }
            }

            twiliosms = null;
            return error;
        }


        private void sendTextAws()
        {
            AwsComunication awsCom = new AwsComunication();
            awsCom.sendText();
  

        }


        private void sendText(messageVM msg)
        {
            string signature = "";
            if (ConfigurationManager.AppSettings["EmailSignature"] != null)
            {
                string[] st = ConfigurationManager.AppSettings["EmailSignature"].ToString().Split('|');
                signature = "<p><strong style='color:#0d52f8;'>" + st[0] + "</strong>";
                signature = signature + "<br><b>Office:</b>" + st[1];
                signature = signature + "<br><b>email:</b>" + st[2] + "</p>";
            }
            Comunication commClass = new Comunication();
            //foreach (recipientVM cust in msg.customers)
            //{
            //    if (!string.IsNullOrEmpty(cust.Email))
            //    {
            //        commClass = new Comunication();
            //        //string message = string.Format("Estimado {0}", cust.Name) + Environment.NewLine + msg.text;
            //        //commClass.EmailSubject = msg.subject;
            //        //commClass.EmailTo[0] = cust.Celular;
            //        commClass.EmailBcc = 
            //        commClass.EmailBody = msg.text ;
            //        commClass.sendTextMessage();
            //    }
            //}

            commClass.EmailTo = msg.customers.Select(c => c.Celular).ToArray();
            commClass.EmailBody = msg.text; // +Environment.NewLine + signature; 
            commClass.sendTextMessage();

            commClass = null;
        }


        public bool IsValidEmail(string emailaddress)
        {
            try
            {
                MailAddress m = new MailAddress(emailaddress);
                return true;
            }
            catch (FormatException)
            {
                return false;
            }
        }

        private void sendEmail(messageVM msg)
        {

            string signature = "";
            if (ConfigurationManager.AppSettings["EmailSignature"] != null){
                string[] st= ConfigurationManager.AppSettings["EmailSignature"].ToString().Split('|');
                signature = "<p><strong style='color:#0d52f8;'>" + st[0] + "</strong>";
                signature = signature + "<br><b>Office:</b>" + st[1];
                signature = signature + "<br><b>email:</b>" + st[2] + "</p>"; 
            }

            ////MailMessage.Body = EmailBody + Environment.NewLine + Environment.NewLine + signature;

            Comunication commClass = new Comunication();
            //foreach (recipientVM cust in msg.customers)
            //{
            //    if (!string.IsNullOrEmpty(cust.Email)) { 
            //        commClass = new Comunication();
            //        //string message = string.Format("Estimado {0}", cust.Name) + Environment.NewLine + msg.text;
            //        commClass.EmailSubject = msg.subject;
            //        commClass.EmailTo[0] = cust.Email;
            //        commClass.EmailBody = msg.text + Environment.NewLine + Environment.NewLine + signature; ;
            //        commClass.SendMail(commClass);
            //    }
            //}
            commClass.EmailSubject = msg.subject;
            commClass.EmailTo[0] = "contact@martellbravo.us";

            
            commClass.EmailBody = msg.text + Environment.NewLine + Environment.NewLine + signature;
            try
            {
                int totalacct = msg.customers.Count();
                int sentacct = 0;
                int take = 49;
                while (sentacct < totalacct)
                {
                    if (totalacct - sentacct < take) take = totalacct - sentacct; 
                    if (sentacct > 0)
                        commClass.EmailBcc = msg.customers.Skip(sentacct).Take(take).ToList().Where(c => !string.IsNullOrEmpty(c.Email) && IsValidEmail(c.Email)).Select(c => c.Email).ToArray();
                    else
                        commClass.EmailBcc = msg.customers.Take(take).ToList().Where(c => !string.IsNullOrEmpty(c.Email) && IsValidEmail(c.Email)).Select(c => c.Email).ToArray();

                    commClass.SendMail(commClass);
                    sentacct += take;
                }
                
            }
            catch(Exception e){
                
            }
            commClass = null;

        }

        [Route("api/birthdaygreeting")]
        public IHttpActionResult GetBirthday()
        {
            SQLRepository Repo = new SQLRepository();
            var customers = Repo.person.GetFiltered(p => p.Id== 31).//(p => p.BirthDate == DateTime.Now.Date).
                Select(p => new recipientVM()
                {
                    id = p.Id,
                    Name = p.LastName + ", " + p.FirstName,
                    Email = p.Contacts.Any(c => c.Type == ContactType.email) ? p.Contacts.FirstOrDefault(c => c.Type == ContactType.email).value : ""
                });
            StreamReader SR = new StreamReader(HttpContext.Current.Server.MapPath("~/App/View/Template/felizcumple.html"));
            string _emailContent = SR.ReadToEnd();

            string[] st = ConfigurationManager.AppSettings["EmailSignature"].ToString().Split('|');


            Comunication commClass = new Comunication();
            foreach (recipientVM cust in customers)
            {
                if (!string.IsNullOrEmpty(cust.Email))
                {
                    string EmailContent = _emailContent;
                    EmailContent = EmailContent.Replace("[company]", st[0]);
                    EmailContent = EmailContent.Replace("[phone]", st[1]);
                    EmailContent = EmailContent.Replace("[email]", st[2]);
                    EmailContent = EmailContent.Replace("[customer]", cust.Name);
                    commClass = new Comunication();
                    //string message = string.Format("Estimado {0}", cust.Name) + Environment.NewLine + msg.text;
                    commClass.EmailSubject = "Happy Birthday!!!";
                    commClass.EmailTo[0] = cust.Email;
                    commClass.EmailBody = EmailContent;
                    commClass.SendMail(commClass);
                }
            }
            commClass = null;
            return Ok();
        }



        //public async Task<HttpResponseMessage> UploadFile()
        //{
        //    int maxFileLengthOut, maxImgFileLength;
        //    HttpResponseMessage task = default(HttpResponseMessage);
        //    string providerPath;
        //    CustomMultipartFormDataStreamProvider provider;
            
        //    string strmaxFileLength = System.Web.Configuration.WebConfigurationManager.AppSettings["maxFileLength"];
        //    if (strmaxFileLength != null && int.TryParse(strmaxFileLength, out maxFileLengthOut)) maxImgFileLength = maxFileLengthOut;

        //    HttpRequestMessage request = this.Request;
        //    if (!request.Content.IsMimeMultipartContent()) throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

        //    providerPath = HttpContext.Current.Server.MapPath("~/TmpFiles");
        //    if (!Directory.Exists(providerPath)) Directory.CreateDirectory(providerPath);
        //    provider = new CustomMultipartFormDataStreamProvider(providerPath);
        //    try
        //    {
        //        await Request.Content.ReadAsMultipartAsync(provider);
        //        // This illustrates how to get the file names.
        //        //  Retrieven files to folder and file data
        //        foreach (MultipartFileData file in provider.FileData)
        //        {
        //            FileStream fileStream = File.Open(file.LocalFileName, FileMode.Open);
        //        }
        //        string subject = (string)provider.FormData["subject"]; 
        //        string body = (string)provider.FormData["text"];
        //        var customers = provider.FormData["customers"];

        //        task = Request.CreateResponse(HttpStatusCode.OK);
        //        task.Content = new StringContent("Uploading success"); 
        //    }
        //    catch (Exception e)
        //    {
        //        task = Request.CreateResponse(HttpStatusCode.RequestEntityTooLarge);
        //        task.Content = new StringContent("Failed uploading file(s)" + "/" + e.Message + "/ " + e.InnerException.Message);
        //    }
        //    return task;
        //}


        
        // POST: api/Comunication
        //public IHttpActionResult PostComm([FromBody]string subject, string text, List<personVM> customers)
        //{
        //    Comunication commClass = new Comunication();
        //    foreach (personVM cust in customers) { 
        //        string message = string.Format("Estimado {0}",cust.LastName + ", " + cust.FirstName) + Environment.NewLine  + text ;
        //        commClass.email(cust.Email, subject, message);
        //    }
        //    commClass = null;

        //    return Ok();
        //}

    }
}

public class messageVM
{
    public string via { get; set; }
    public string subject { get; set; }
    public string text { get; set;}
    public bool includeVcard { get; set; }
    public List<recipientVM> customers { get; set; }
}

public class CustomMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
{
    public CustomMultipartFormDataStreamProvider(string path) : base(path) { }

    public override string GetLocalFileName(HttpContentHeaders headers)
    {
        return headers.ContentDisposition.FileName.Replace("\"", string.Empty);
    }
}

