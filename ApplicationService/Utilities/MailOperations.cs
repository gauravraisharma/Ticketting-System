using System.Net.Mail;
using System.Net;
using Microsoft.Extensions.Configuration;

namespace ApplicationService.Utilities
{
    public static class MailOperations
    {
        public static  Task SendEmailAsync(List<string> email, string subject, string message, IConfiguration _config)
        {
            var fromMail = _config["SMTP_Mail"];
            var password = _config["SMTP_Password"];
            var SMTP_client = _config["SMTP_client"];
            var client = new SmtpClient(SMTP_client, 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(fromMail, password)
            };

            var mailMessage = new MailMessage();
            MailAddress _fromMail = new MailAddress(fromMail);
            mailMessage.From = _fromMail;
            mailMessage.Subject = subject;
            mailMessage.Body = message;
            email.ForEach(mail =>
            {
                mailMessage.To.Add(new MailAddress(mail));
            });
            
            return  client.SendMailAsync(mailMessage );

        }
    }
}
