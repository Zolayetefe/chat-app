import { useAuth } from '../context/AuthContext';

function ChatPage() {
    // Destructure the 'user' from your authentication context
    const { user, loading } = useAuth(); 

    // 1. Handle Loading State (Crucial for an Auth Protected page)
    if (loading) {
        return <div>Loading user status...</div>;
    }
    
    // 2. Conditional Rendering for Unauthenticated Users
    if (!user) {
        // Option A: Display a message (good if you don't use a router redirect)
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Access Denied</h1>
                <p>Please log in to view the chat page.</p>
                {/* You might add a <Link to="/login">Log In</Link> here */}
            </div>
        );

        // Option B: (If you're handling redirects in your router/AuthContext)
        // return null; 
    }

    // 3. Render the actual Chat Page for Authenticated Users
    return (
        <div style={{ padding: '20px' }}>
            <h1>Welcome to the Chat, {user.username}!</h1>
            <p>This is where the real chat application would live.</p>
            
            {/* Keeping the original message as a placeholder */}
            <h2>Under maintenance</h2> 
        </div>
    );
}

export default ChatPage;