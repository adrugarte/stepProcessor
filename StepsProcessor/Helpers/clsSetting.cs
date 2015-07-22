using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StepsProcessor.Helpers
{
    static class Setting
    {
        private static string _filePath;

        public static string FilePath { get { setFilePath(); return _filePath; }}

        private static void setFilePath(){
            if (_filePath == null) {
                _filePath = "/Files";
            }
        }
    }
}
