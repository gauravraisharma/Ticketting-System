using System.Net.Mail;
using System.Net;

namespace webapi.Utilities
{
    public static class MailOperations
    {
        public static  Task SendEmailAsync(string email, string subject, string message, IConfiguration _config)
        {
            var mail = _config["SMTP_Mail"];
            var password = _config["SMTP_Password"];
            var SMTP_client = _config["SMTP_client"];
            var client = new SmtpClient(SMTP_client, 587)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(mail, password)
            };

            return  client.SendMailAsync(
                new MailMessage(from: mail,
                                to: email,
                                subject,
                                message
                                ));

        }
    }
}
