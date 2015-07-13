using System;

namespace StepsProcessor.Models
{
    public class Document
    {
        public string Id { get; set;}
        public string Name { get; set; }
        public string Type { get; set; }
        public string Path { get; set; }
        public DateTime Uploaded { get; set; }
        public DateTime CancelDate { get; set; }
        public string CustomerId { get; set; }
    }
}
