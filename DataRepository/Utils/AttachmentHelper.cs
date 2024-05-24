using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.Utils
{
    public static class AttachmentHelper
    {
        public static string GetAssetLink(string config, string folderName , string attachmentName)
        {
            return string.Concat(config, folderName, attachmentName);
        }
    }
}
