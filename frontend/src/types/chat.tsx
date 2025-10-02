export interface Conversation {
  id: string;
  type: 'individual' | 'group';
  name: string;
  lastMessage: string;
  timestamp: string;
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  isMine: boolean;
  timestamp: string;
}