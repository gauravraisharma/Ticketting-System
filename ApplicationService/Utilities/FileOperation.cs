using Azure.Core;
using DataRepository.EntityModels;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Collections;
using System.Net.Http.Headers;

namespace ApplicationService.Utilities
{
    public static class FileOperation
    {
      
        public static List<FileUploadResponse> UploadFile(IFormFileCollection files, IWebHostEnvironment _hostingEnvironment,IConfiguration _config)
        {
            string webRootPath = _hostingEnvironment.WebRootPath;
            string attachmentsPath = Path.Combine(_config["AssetPath"], "Attachments");

            try
            {
                if (!Directory.Exists(attachmentsPath))
                    Directory.CreateDirectory(attachmentsPath);

                List<FileUploadResponse> attachmentsResponse = new List<FileUploadResponse>();
                for(int index=0; index< files.Count();index++)
                {
                    string fileName = String.Concat(DateTime.Now.ToString("MM_dd_yyyy_HH_mm"),"_",index ,"_attachment", Path.GetExtension(ContentDispositionHeaderValue.Parse(files[index].ContentDisposition).FileName.Trim('"')));
                    string fullPath = Path.Combine(attachmentsPath, fileName);
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        files[index].CopyTo(stream);
                    }
                    attachmentsResponse.Add(new FileUploadResponse
                    {
                        FileName = fileName,
                        ByteSize = files[index].Length
                    }); ;
                }
                return attachmentsResponse;
            }catch(Exception ex)
            {
                return null;
            }
        }

       
    }
}
