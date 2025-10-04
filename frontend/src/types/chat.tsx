// types/chat.ts

export interface Conversation {
  id: string; // conversationId
  type: 'individual' | 'group';
  name: string; // Other participant's username or group name
  lastMessage: string;
  timestamp: string; // formatted time
  otherUserId?: string; // The ID of the other user for 1-on-1 chats
}

export interface Message {
  id: string; // message _id
  conversationId: string;
  sender: string; // sender User._id
  receiver: string; // receiver User._id
  content: string;
  isRead: boolean;
  createdAt: string;
  isMine?: boolean; // Frontend property for styling
  senderUsername?: string; // Optional for group chats
}

export interface SearchUser {
  _id: string;
  username: string;
}