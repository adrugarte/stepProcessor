using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Web;

namespace AdminWeb.Helpers
{
    public class Comunication
    {
        public Comunication()
        {
            EmailTo = new string[4];
            EmailCc = new string[3];
            EmailBcc = new string[3];
        }

        public string EmailFrom { get; set; }

        public string[] EmailTo { get; set; }
        public string[] EmailCc { get; set; }
        public string[] EmailBcc { get; set; }
        //public List<EmailAttachment> attachment { get; set; }

        public string EmailSubject { get; set; }
        public string EmailBody { get; set; }

        /// <summary>
        /// Following function prepare email message and sends.
        /// </summary>
        /// <param name="obj"></param>
        public void SendMail(Comunication obj)
        {
            string errorMessage = "";
            try
            {
                MailMessage MailMessage = new MailMessage();

                MailMessage.From = new MailAddress(MailMessage.From.ToString(), ConfigurationManager.AppSettings["EmailfromName"]??"MB Immigration Services"); //only overwrite if not specified on web.config smtp (from)
                
                MailMessage.Subject = EmailSubject;

                //string signature = ConfigurationManager.AppSettings["EmailSignature"]!=null?ConfigurationManager.AppSettings["EmailSignature"].ToString().Replace('|', '\n'):"";
                ////string signature = "";
                ////if (ConfigurationManager.AppSettings["EmailSignature"] != null){
                ////    string[] st= ConfigurationManager.AppSettings["EmailSignature"].ToString().Split('|');
                ////    signature = "<p><strong style='color:#0d52f8;'>" + st[0] + "</strong>";
                ////    signature = signature + "<br><b>Office:</b>" + st[1];
                ////    signature = signature + "<br><b>email:</b>" + st[2] + "</p>"; 
                ////}

                ////MailMessage.Body = EmailBody + Environment.NewLine + Environment.NewLine + signature;
                ////MailMessage.IsBodyHtml = true;


                MailMessage.Body = EmailBody;
                MailMessage.IsBodyHtml = true;


                // Adding the EmailTo Addresses
                string to = "";
                if (EmailTo != null)
                {
                    for (int i = 0; i < EmailTo.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(EmailTo[i]))
                        {
                            string[] strEmail = Regex.Split(EmailTo[i], ";");
                            for (int t = 0; t < strEmail.Length; t++)
                            {
                                if (!string.IsNullOrEmpty(strEmail[t].Trim()) &&
                                    !to.ToLower().Contains(strEmail[t].Trim().ToLower()))
                                {
                                    // Control TO
                                    to += strEmail[t].Trim();
                                    // TO
                                    MailMessage.To.Add(new MailAddress(strEmail[t].Trim()));
                                }
                            }
                        }
                    }
                }

                // Adding the EmailCc Addresses
                string cc = "";
                if (EmailCc != null)
                {
                    for (int i = 0; i < EmailCc.Length; i++)
                    {
                        if (!string.IsNullOrEmpty(EmailCc[i]))
                        {
                            string[] strEmail = Regex.Split(EmailCc[i], ";");
                            for (int t = 0; t < strEmail.Length; t++)
                            {
                                if (
                                    !string.IsNullOrEmpty(strEmail[t].Trim()) &&
                                    !to.ToLower().Contains(strEmail[t].Trim().ToLower()) &&
                                    !cc.ToLower().Contains(strEmail[t].Trim().ToLower()))
                                {
                                    // Control CC
                                    cc += strEmail[t].Trim();
                                    // CC
                                    MailMessage.CC.Add(new MailAddress(strEmail[t]));
                                }
                            }
                        }
                    }
                }


                // Adding the EmailBcc Addresses
                string bcc = "";
                for (int i = 0; i < EmailBcc.Length; i++)
                {
                    if (!string.IsNullOrEmpty(EmailBcc[i]))
                    {
                        string[] strEmail = Regex.Split(EmailBcc[i], ";");
                        for (int t = 0; t < strEmail.Length; t++)
                        {
                            if (
                                !string.IsNullOrEmpty(strEmail[t].Trim()) &&
                                !to.ToLower().Contains(strEmail[t].Trim().ToLower()) &&
                                !cc.ToLower().Contains(strEmail[t].Trim().ToLower()) &&
                                !bcc.ToLower().Contains(strEmail[t].Trim().ToLower())
                             )
                            {
                                // Control BCC
                                bcc += strEmail[t].Trim();
                                // BCC
                                MailMessage.Bcc.Add(new MailAddress(strEmail[t]));
                            }
                        }
                    }
                }

                SmtpClient smtps = new SmtpClient();
                smtps.Send(MailMessage);

            }
            catch (Exception e)
            {
                errorMessage = e.Message;
            }
        }


   }
}