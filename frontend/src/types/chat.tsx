export interface Conversation {
  id: string; // conversationId (_id from MongoDB)
  type: "individual" | "group";
  name: string; // Other participant's username or group name
  lastMessage: string;
  timestamp: string; // Formatted time
  otherUserId?: string; // The ID of the other user for 1-on-1 chats
  participants: string[]; // Array of participant user IDs
}

export interface Message {
  id: string; // message _id
  conversationId: string;
  sender: string; // sender User._id
  receiver: string; // receiver User._id
  content: string;
  isRead: boolean;
  timestamp: string;
  isMine?: boolean; // Frontend property for styling
  senderUsername?: string; // Populated sender username
}

export interface SearchUser {
  _id: string;
  username: string;
}