using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;
using System.Collections;

namespace ApplicationService.Utilities
{
    public static class MailOperations
    {
        public static  Task SendEmailAsync(List<string> email, string subject, string message, IConfiguration _config,Dictionary<string,string> subjectVariables, Dictionary<string, string> contentVariables)
        {
            var fromMail = _config["SMTP_Mail"];
            var password = _config["SMTP_Password"];
            var SMTP_client = _config["SMTP_client"];
            var SMTP_port = _config["SMTP_port"];
            var SMTP_EnableSsl = _config["SMTP_EnableSsl"];

            string subjectValue = (subjectVariables !=null )?ReplaceVaribaleWithValue(subjectVariables, subject):subject;
            string messageValue = (contentVariables!=null)?ReplaceVaribaleWithValue(contentVariables, message):message;


            var client = new SmtpClient(SMTP_client,int.Parse(SMTP_port))
            {
                EnableSsl = bool.Parse(SMTP_EnableSsl),
                Credentials = new NetworkCredential(fromMail, password)
            };

            var mailMessage = new MailMessage();
            MailAddress _fromMail = new MailAddress(fromMail);
            mailMessage.From = _fromMail;
            mailMessage.Subject = subjectValue;
            mailMessage.Body = messageValue;
            mailMessage.IsBodyHtml = true;
            email.ForEach(mail =>
            {
                mailMessage.To.Add(new MailAddress(mail));
            });
            
            return  client.SendMailAsync(mailMessage );

        }
        private static string ReplaceVaribaleWithValue(Dictionary<string, string> valuePairs, string oprationalString)
        {
            IDictionaryEnumerator dictionaryEnumerator = valuePairs.GetEnumerator();

            if (!string.IsNullOrEmpty(oprationalString))
            {
                while (dictionaryEnumerator.MoveNext())
                {
                    oprationalString = oprationalString.Replace(dictionaryEnumerator.Key.ToString(), dictionaryEnumerator.Value.ToString());
                }
            }

            return oprationalString;
        }
    }
}
