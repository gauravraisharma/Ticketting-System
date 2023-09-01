using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataRepository.EntityModels
{
    internal class DasboardResponse
    {
    }
    public class ChartResponse {
        public string Status { get; set; }
        public string Message { get; set; }
        public List<DepartmentChartData> DepartmentChartData { get; set; }
    }
    public class DepartmentChartData {
       public string DepartmentName { get; set; }
        public int Value { get; set; }
    }

}
