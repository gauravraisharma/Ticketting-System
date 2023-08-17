namespace ApplicationService.HubModel
{
    public class ChatMessage
    {
        public string Message { get; set; }
        public string ChatRoomId { get; set; }
        public string UserId { get; set; }
    }  
    public class ChatMessageFromClient
    {
        public string Message { get; set; }
        public string ChatRoomId { get; set; }
        public string UserId { get; set; }
        public string CompanyId { get; set; }
        public string DepartmentId { get; set; }
    }
}
