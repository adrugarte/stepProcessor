using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Net.Mail;
using BravoWeb.Models;
using System.Configuration;

namespace BravoWeb.Utils
{
    public static class mailing
    {
        public static void send(Contact contact)
        {
            var smtpServer = ConfigurationManager.AppSettings["MailServer"] != null && ConfigurationManager.AppSettings["MailServer"].Length > 0 ? ConfigurationManager.AppSettings["MailServer"] : "smtp.zoho.com";
            var mailFrom = ConfigurationManager.AppSettings["WebMail"] != null && ConfigurationManager.AppSettings["WebMail"].Length > 0 ? ConfigurationManager.AppSettings["WebMail"] : "web@martellbravo.us";
            var mailTo = ConfigurationManager.AppSettings["DestMail"] != null && ConfigurationManager.AppSettings["DestMail"].Length > 0 ? ConfigurationManager.AppSettings["DestMail"] : "contact@dadepaper.com";
            var labelFrom = ConfigurationManager.AppSettings["CompanyName"] != null && ConfigurationManager.AppSettings["CompanyName"].Length > 0 ? ConfigurationManager.AppSettings["CompanyName"] : "Martell Bravo Co.";

            using (SmtpClient client = new SmtpClient(smtpServer,465))
            {
                client.EnableSsl = true;
                client.Credentials = new System.Net.NetworkCredential("soniavictoria@martellbravo.us", "Vikamartelona2015");
                MailMessage message = new MailMessage();
                message.From = new MailAddress(mailFrom, labelFrom);
                message.To.Add(new MailAddress(mailTo, "Name"));
                //message.To.Add(new MailAddress(cust, "Name"));

                //System.Net.Mail.Attachment attachment = new System.Net.Mail.Attachment(ms, new System.Net.Mime.ContentType("application/pdf"));
                //attachment.Name = "DadePaper-Quote-" + quote.Id.ToString() + "-" + customer.Name.Replace(" ", "-") + ".pdf";
                //message.Attachments.Add(attachment);
                message.Body = "Nombre: " + contact.name + "\n\r" + "Comments: " + contact.comments + "\n\r" + "Email: " + contact.email + "\n\r"  + "Phone: " + contact.phone;
                message.Subject = "Consulta Web - "  + contact.name;
                message.IsBodyHtml = false;
                try
                {
                    client.Send(message);
                }
                catch (Exception ex)
                {
                    var m = ex.Message;
                    var c = m.ToString();
                } 
                finally
                {
                    message.Dispose();
                }
            }


        } 

    }
}
