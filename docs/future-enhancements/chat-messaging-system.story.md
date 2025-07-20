# Story 5.2: Real-time Messaging and Chat

## Status
Draft

## Story
**As a** student and lecturer,
**I want to** send real-time messages and participate in course chat channels,
**so that** I can have instant communication for quick questions, collaboration, and immediate support

## Acceptance Criteria
1. Course-based chat channels enable real-time group communication
2. Direct messaging allows private conversations between users
3. Message history is preserved and searchable
4. File sharing and rich content support in chat messages
5. Notification system alerts users of new messages and mentions

## Tasks / Subtasks
- [ ] Build real-time chat infrastructure (AC: 1)
  - [ ] Create course chat channels with WebSocket connections
  - [ ] Implement real-time message sending and receiving
  - [ ] Add chat channel management and permissions
  - [ ] Create message thread organization and structure
  - [ ] Build online user presence and status indicators
- [ ] Implement direct messaging system (AC: 2)
  - [ ] Create private messaging interface between users
  - [ ] Add contact list and user discovery
  - [ ] Implement message encryption for privacy
  - [ ] Create message delivery and read status tracking
  - [ ] Add message scheduling and delayed sending
- [ ] Add message history and search capabilities (AC: 3)
  - [ ] Build message storage and retrieval system
  - [ ] Create chat history with infinite scroll loading
  - [ ] Implement message search across channels and DMs
  - [ ] Add message filtering by date, user, and content type
  - [ ] Create message export and archive functionality
- [ ] Enable rich content and file sharing (AC: 4)
  - [ ] Add file upload and sharing in chat messages
  - [ ] Implement image and video preview in chat
  - [ ] Create emoji reactions and rich text formatting
  - [ ] Add voice message recording and playback
  - [ ] Build screen sharing and collaboration tools
- [ ] Build comprehensive notification system (AC: 5)
  - [ ] Create real-time in-app notifications for messages
  - [ ] Add desktop and mobile push notifications
  - [ ] Implement @mentions and channel alerts
  - [ ] Build notification preferences and do-not-disturb
  - [ ] Create message summary and digest emails
- [ ] Optimize chat system for free tier (AC: 1-5)
  - [ ] Implement efficient WebSocket connection management
  - [ ] Cache message data to reduce database load
  - [ ] Optimize file sharing within storage limits
  - [ ] Create connection pooling and load balancing
  - [ ] Add offline message queuing and sync

## Dev Notes

### Previous Story Context
This story builds on the forum system and adds real-time communication:
- **Story 5.1**: Course discussion forums for asynchronous communication
- **Epic 1 (1.1-1.3)**: User authentication and role management
- **Epic 2 (2.1-2.3)**: Course management and enrollment system
- **Epic 3 (3.1-3.3)**: Student dashboard and progress tracking
- **Epic 4 (4.1-4.3)**: Complete assignment workflow
- **Dependencies**: Requires real-time infrastructure, course enrollment, and notification system

### Technical Stack Context - Free Tier Optimized
[Source: docs/prd/technical-stack.md]
- **Frontend**: Next.js, Tailwind CSS (chat interface and real-time updates)
- **Backend**: Supabase (Free Tier - 500MB database, 2GB bandwidth)
- **Real-time**: Supabase Realtime for WebSocket connections
- **Database**: PostgreSQL via Supabase for message storage and history
- **File Storage**: Supabase Storage (1GB total - optimized for chat files)
- **Notifications**: Browser Push API and email notifications
- **Hosting**: Vercel (Free Tier)

### Data Models Extension
Extended database schema for real-time messaging system:
```sql
-- Chat channels for courses
CREATE TABLE chat_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  channel_name VARCHAR(100) NOT NULL,
  description TEXT,
  channel_type VARCHAR(20) DEFAULT 'public', -- 'public', 'private', 'announcement'
  is_archived BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID REFERENCES users(id), -- NULL for channel messages, set for DMs
  message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'file', 'image', 'voice', 'system'
  content TEXT,
  message_data JSONB, -- Additional data for different message types
  reply_to_id UUID REFERENCES chat_messages(id), -- For threaded replies
  is_edited BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  edited_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Full-text search for messages
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(content, ''))
  ) STORED
);

-- Message attachments and files
CREATE TABLE chat_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  thumbnail_path VARCHAR(500), -- For image/video thumbnails
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Message reactions and emoji
CREATE TABLE message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  emoji VARCHAR(10) NOT NULL, -- Unicode emoji
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, user_id, emoji)
);

-- User presence and online status
CREATE TABLE user_presence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'offline', -- 'online', 'away', 'busy', 'offline'
  last_seen TIMESTAMP DEFAULT NOW(),
  current_channel_id UUID REFERENCES chat_channels(id),
  is_typing BOOLEAN DEFAULT false,
  typing_in_channel UUID REFERENCES chat_channels(id),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Direct message conversations
CREATE TABLE dm_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1 UUID REFERENCES users(id) ON DELETE CASCADE,
  participant_2 UUID REFERENCES users(id) ON DELETE CASCADE,
  last_message_id UUID REFERENCES chat_messages(id),
  last_activity TIMESTAMP DEFAULT NOW(),
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(participant_1, participant_2)
);

-- Message delivery and read status
CREATE TABLE message_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'delivered', 'read'
  timestamp TIMESTAMP DEFAULT NOW(),
  UNIQUE(message_id, user_id)
);

-- Chat notifications and preferences
CREATE TABLE chat_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  notification_type VARCHAR(20) NOT NULL, -- 'mention', 'dm', 'channel', 'reaction'
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User chat preferences
CREATE TABLE chat_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  desktop_notifications BOOLEAN DEFAULT true,
  mobile_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT false,
  mention_notifications BOOLEAN DEFAULT true,
  dm_notifications BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  notification_schedule JSONB, -- Quiet hours and preferences
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Channel membership and permissions
CREATE TABLE channel_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- 'admin', 'moderator', 'member'
  can_send_messages BOOLEAN DEFAULT true,
  can_upload_files BOOLEAN DEFAULT true,
  joined_at TIMESTAMP DEFAULT NOW(),
  last_read_message_id UUID REFERENCES chat_messages(id),
  UNIQUE(channel_id, user_id)
);

-- Message threads for organized discussions
CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
  channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP,
  last_reply_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### File Locations
Based on Next.js conventions and chat system:
- Chat pages: `pages/courses/[courseId]/chat/` or `app/courses/[courseId]/chat/`
- Chat home: `pages/courses/[courseId]/chat/index.js` or `app/courses/[courseId]/chat/page.js`
- Channel chat: `pages/courses/[courseId]/chat/channel/[channelId].js` or `app/courses/[courseId]/chat/channel/[channelId]/page.js`
- Direct messages: `pages/chat/dm/[conversationId].js` or `app/chat/dm/[conversationId]/page.js`
- Chat components: `components/chat/ChatInterface.js`, `components/chat/MessageList.js`
- Message components: `components/chat/MessageBubble.js`, `components/chat/MessageInput.js`
- Real-time components: `components/chat/PresenceIndicator.js`, `components/chat/TypingIndicator.js`
- Chat utilities: `lib/chatHelpers.js`, `lib/realtimeManager.js`
- Chat hooks: `hooks/useChat.js`, `hooks/useRealtime.js`

### Free Tier Chat Optimization
**Efficient Real-time Chat Strategy:**
```javascript
// Optimized chat system for free tier
const ChatOptimization = {
  // WebSocket connection management
  connectionManagement: {
    maxConnections: 100, // Limit concurrent connections
    connectionTimeout: 30000, // 30 second timeout
    reconnectAttempts: 3,
    heartbeatInterval: 30000, // 30 second heartbeat
    connectionPooling: true
  },
  
  // Message handling optimization
  messageOptimization: {
    batchSize: 50, // Load 50 messages at a time
    cacheMessages: 100, // Cache last 100 messages per channel
    debounceTyping: 1000, // 1 second debounce for typing indicators
    messageCompression: true // Compress large messages
  },
  
  // File sharing optimization
  fileOptimization: {
    maxFileSize: 10, // 10MB max per file
    imageCompression: 80, // 80% quality for images
    thumbnailGeneration: true,
    videoPreview: false, // Disable for free tier
    allowedTypes: ['.jpg', '.png', '.pdf', '.doc', '.txt']
  },
  
  // Performance optimization
  performanceOptimization: {
    virtualScrolling: true, // Virtual scrolling for long chat history
    lazyLoadMedia: true, // Lazy load images and files
    offlineSupport: true, // Cache messages offline
    backgroundSync: true // Sync when connection restored
  }
};
```

### Real-time Chat Interface Design
```jsx
// Comprehensive chat system interface
const ChatSystem = () => {
  const [activeChannel, setActiveChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);

  return (
    <ChatContainer>
      <ChatSidebar>
        <ChannelList 
          channels={channels}
          activeChannel={activeChannel}
          onChannelSelect={setActiveChannel}
        />
        <DirectMessagesList 
          conversations={dmConversations}
          onConversationSelect={setActiveConversation}
        />
        <OnlineUsersList users={onlineUsers} />
      </ChatSidebar>
      
      <ChatMainArea>
        <ChatHeader>
          <ChannelInfo channel={activeChannel} />
          <ChatActions>
            <SearchMessages />
            <ChannelSettings />
            <NotificationSettings />
          </ChatActions>
        </ChatHeader>
        
        <MessageArea>
          <MessageList 
            messages={messages}
            onReaction={handleMessageReaction}
            onReply={handleMessageReply}
          />
          <TypingIndicator users={typingUsers} />
        </MessageArea>
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          onFileUpload={handleFileUpload}
          onTyping={handleTypingIndicator}
        />
      </ChatMainArea>
      
      <ChatInfoPanel>
        <ChannelMembers members={channelMembers} />
        <SharedFiles files={channelFiles} />
        <PinnedMessages messages={pinnedMessages} />
      </ChatInfoPanel>
    </ChatContainer>
  );
};
```

### Real-time Communication System
**WebSocket and Realtime Features:**
```javascript
// Real-time communication implementation
const RealtimeSystem = {
  // WebSocket connection management
  websocketManager: {
    connect: async (userId, courseId) => {
      const client = supabase.createClient(url, key, {
        realtime: {
          params: {
            eventsPerSecond: 10 // Rate limiting for free tier
          }
        }
      });
      
      // Subscribe to chat channels
      const channel = client
        .channel(`course_${courseId}_chat`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        }, handleNewMessage)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_presence'
        }, handlePresenceUpdate)
        .subscribe();
      
      return channel;
    },
    
    disconnect: (channel) => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    }
  },
  
  // Message handling
  messageHandling: {
    sendMessage: async (channelId, content, messageType = 'text') => {
      const message = {
        channel_id: channelId,
        sender_id: userId,
        content: content,
        message_type: messageType,
        created_at: new Date()
      };
      
      return await supabase
        .from('chat_messages')
        .insert(message);
    },
    
    editMessage: async (messageId, newContent) => {
      return await supabase
        .from('chat_messages')
        .update({
          content: newContent,
          is_edited: true,
          edited_at: new Date()
        })
        .eq('id', messageId);
    },
    
    deleteMessage: async (messageId) => {
      return await supabase
        .from('chat_messages')
        .update({
          is_deleted: true,
          content: '[Message deleted]'
        })
        .eq('id', messageId);
    }
  },
  
  // Presence management
  presenceManagement: {
    updateStatus: async (userId, courseId, status) => {
      return await supabase
        .from('user_presence')
        .upsert({
          user_id: userId,
          course_id: courseId,
          status: status,
          last_seen: new Date(),
          updated_at: new Date()
        });
    },
    
    setTyping: async (userId, channelId, isTyping) => {
      return await supabase
        .from('user_presence')
        .update({
          is_typing: isTyping,
          typing_in_channel: isTyping ? channelId : null,
          updated_at: new Date()
        })
        .eq('user_id', userId);
    }
  }
};
```

### Direct Messaging System
**Private Communication Features:**
```javascript
// Direct messaging system implementation
const DirectMessagingSystem = {
  // Conversation management
  conversationManagement: {
    startConversation: async (participant1, participant2) => {
      // Check if conversation already exists
      const existing = await supabase
        .from('dm_conversations')
        .select('*')
        .or(`and(participant_1.eq.${participant1},participant_2.eq.${participant2}),and(participant_1.eq.${participant2},participant_2.eq.${participant1})`)
        .single();
      
      if (existing.data) {
        return existing.data;
      }
      
      // Create new conversation
      return await supabase
        .from('dm_conversations')
        .insert({
          participant_1: participant1,
          participant_2: participant2
        });
    },
    
    getConversations: async (userId) => {
      return await supabase
        .from('dm_conversations')
        .select(`
          *,
          participant_1:users!participant_1(id, username, avatar_url),
          participant_2:users!participant_2(id, username, avatar_url),
          last_message:chat_messages(content, created_at, sender_id)
        `)
        .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
        .order('last_activity', { ascending: false });
    }
  },
  
  // Message encryption for privacy
  messageEncryption: {
    encryptMessage: (content, key) => {
      // Simple encryption for free tier
      // In production, use proper encryption libraries
      return btoa(content); // Base64 encoding as placeholder
    },
    
    decryptMessage: (encryptedContent, key) => {
      try {
        return atob(encryptedContent);
      } catch (e) {
        return encryptedContent; // Return as-is if decryption fails
      }
    }
  },
  
  // Message status tracking
  statusTracking: {
    markAsDelivered: async (messageId, userId) => {
      return await supabase
        .from('message_status')
        .upsert({
          message_id: messageId,
          user_id: userId,
          status: 'delivered',
          timestamp: new Date()
        });
    },
    
    markAsRead: async (messageId, userId) => {
      return await supabase
        .from('message_status')
        .upsert({
          message_id: messageId,
          user_id: userId,
          status: 'read',
          timestamp: new Date()
        });
    }
  }
};
```

### File Sharing and Rich Content
**Multimedia Communication Features:**
```javascript
// File sharing and rich content system
const RichContentSystem = {
  // File upload and sharing
  fileSharing: {
    uploadFile: async (file, messageId) => {
      // Compress file if needed
      const compressedFile = await compressFile(file);
      
      // Upload to Supabase Storage
      const fileName = `chat/${messageId}/${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('chat-files')
        .upload(fileName, compressedFile);
      
      if (error) throw error;
      
      // Save attachment record
      return await supabase
        .from('chat_attachments')
        .insert({
          message_id: messageId,
          original_filename: file.name,
          stored_filename: fileName,
          file_path: data.path,
          file_size_bytes: compressedFile.size,
          file_type: file.type,
          mime_type: file.type
        });
    },
    
    generateThumbnail: async (filePath, fileType) => {
      if (fileType.startsWith('image/')) {
        // Generate image thumbnail
        return await generateImageThumbnail(filePath);
      }
      return null; // No thumbnail for other types in free tier
    }
  },
  
  // Voice messages
  voiceMessages: {
    recordVoice: async () => {
      if (!navigator.mediaDevices) {
        throw new Error('Voice recording not supported');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      return new Promise((resolve) => {
        const chunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
          chunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          resolve(blob);
        };
        
        mediaRecorder.start();
        
        // Auto-stop after 5 minutes
        setTimeout(() => mediaRecorder.stop(), 300000);
      });
    }
  },
  
  // Emoji reactions
  emojiReactions: {
    addReaction: async (messageId, userId, emoji) => {
      return await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: userId,
          emoji: emoji
        });
    },
    
    removeReaction: async (messageId, userId, emoji) => {
      return await supabase
        .from('message_reactions')
        .delete()
        .match({
          message_id: messageId,
          user_id: userId,
          emoji: emoji
        });
    },
    
    getReactions: async (messageId) => {
      return await supabase
        .from('message_reactions')
        .select('emoji, user_id, users(username)')
        .eq('message_id', messageId);
    }
  }
};
```

### Notification System
**Comprehensive Chat Notifications:**
```javascript
// Chat notification system
const NotificationSystem = {
  // Real-time notifications
  realtimeNotifications: {
    showInAppNotification: (message, type = 'message') => {
      // Create in-app notification
      const notification = {
        id: generateId(),
        type: type,
        title: getNotificationTitle(message, type),
        content: message.content,
        avatar: message.sender.avatar_url,
        timestamp: new Date(),
        onClick: () => navigateToMessage(message)
      };
      
      addNotification(notification);
    },
    
    showDesktopNotification: async (message, type) => {
      if (!('Notification' in window)) return;
      
      if (Notification.permission === 'granted') {
        new Notification(getNotificationTitle(message, type), {
          body: message.content,
          icon: message.sender.avatar_url,
          tag: `chat_${message.id}`,
          requireInteraction: false
        });
      }
    }
  },
  
  // Mention detection and notifications
  mentionSystem: {
    detectMentions: (content) => {
      const mentionRegex = /@([a-zA-Z0-9_]+)/g;
      return content.match(mentionRegex) || [];
    },
    
    notifyMentionedUsers: async (message, mentions) => {
      const mentionedUsers = await getUsersByUsernames(mentions);
      
      for (const user of mentionedUsers) {
        await supabase
          .from('chat_notifications')
          .insert({
            user_id: user.id,
            message_id: message.id,
            notification_type: 'mention'
          });
        
        // Send real-time notification
        notifyUser(user.id, {
          type: 'mention',
          message: message,
          channel: message.channel
        });
      }
    }
  },
  
  // Notification preferences
  notificationPreferences: {
    getUserPreferences: async (userId) => {
      const { data } = await supabase
        .from('chat_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      return data || getDefaultPreferences();
    },
    
    updatePreferences: async (userId, preferences) => {
      return await supabase
        .from('chat_preferences')
        .upsert({
          user_id: userId,
          ...preferences,
          updated_at: new Date()
        });
    },
    
    shouldNotify: (preferences, notificationType, currentTime) => {
      // Check do-not-disturb hours
      if (preferences.notification_schedule) {
        const schedule = preferences.notification_schedule;
        if (isWithinQuietHours(currentTime, schedule)) {
          return false;
        }
      }
      
      // Check notification type preferences
      switch (notificationType) {
        case 'mention':
          return preferences.mention_notifications;
        case 'dm':
          return preferences.dm_notifications;
        case 'channel':
          return preferences.desktop_notifications;
        default:
          return true;
      }
    }
  }
};
```

### Mobile Chat Experience
**Touch-Optimized Chat Interface:**
- **Mobile-First Design**: Responsive chat interface optimized for mobile devices
- **Swipe Gestures**: Swipe to reply, react, or delete messages
- **Voice Messages**: Touch-and-hold for voice message recording
- **Push Notifications**: Native mobile push notifications for messages
- **Offline Support**: Queue messages when offline and sync when connected

### Integration with Previous Systems
**Building on Forum and LMS Foundation:**
```javascript
// Integration with existing systems
const ChatIntegration = {
  // Forum integration (Story 5.1)
  forumIntegration: {
    linkToForumPosts: true, // Link forum posts in chat
    chatToForumEscalation: true, // Convert chat discussions to forum posts
    sharedNotifications: true, // Unified notification system
    crossPlatformMentions: true // Mentions work across chat and forum
  },
  
  // Assignment integration (Epic 4)
  assignmentIntegration: {
    assignmentChannels: true, // Auto-create chat channels for assignments
    submissionAlerts: true, // Chat notifications for assignment submissions
    gradeDiscussions: false, // Keep grade discussions in forums
    deadlineReminders: true // Chat reminders for assignment deadlines
  },
  
  // Progress tracking integration (Epic 3)
  progressIntegration: {
    chatParticipation: {
      trackEngagement: true,
      updateXP: true,
      collaborationMetrics: true,
      communicationBadges: true
    },
    
    achievements: [
      'First Message',
      'Active Communicator',
      'Helpful Helper',
      'Team Player'
    ]
  }
};
```

### Security and Privacy
**Chat Security Measures:**
```javascript
// Security considerations for chat system
const ChatSecurity = {
  // Message security
  messageSecurity: {
    contentFiltering: true,
    spamDetection: true,
    rateLimiting: true, // Prevent message flooding
    messageEncryption: false // Basic encryption only for DMs
  },
  
  // User permissions
  permissionSystem: {
    courseEnrollmentCheck: true,
    channelMembership: true,
    dmPrivacy: true,
    moderatorControls: true
  },
  
  // Data protection
  dataProtection: {
    messageRetention: '1_year', // Auto-delete old messages
    personalDataEncryption: true,
    rightToDelete: true,
    auditLogging: true
  }
};
```

### Performance Optimizations
**Free Tier Performance Strategy:**
- **Connection Pooling**: Efficient WebSocket connection management
- **Message Batching**: Batch message operations to reduce API calls
- **Lazy Loading**: Load chat history on demand with virtual scrolling
- **Offline Support**: Cache messages locally for offline access
- **File Optimization**: Compress and optimize shared files

### Testing Requirements
Chat system requires comprehensive testing:
- **Real-time Tests**: WebSocket connection and message delivery
- **Message Tests**: Send, edit, delete, and reaction functionality
- **File Tests**: File upload, sharing, and preview capabilities
- **Notification Tests**: In-app, desktop, and email notifications
- **Mobile Tests**: Touch interface and mobile-specific features

## Testing

### Testing Standards
Real-time messaging and chat system testing strategy:
- **Unit Tests**:
  - Message handling and validation (`lib/messageHelpers.test.js`)
  - Real-time connection management (`lib/realtimeManager.test.js`)
  - Notification system logic (`lib/chatNotifications.test.js`)
  - File upload and sharing (`lib/fileSharing.test.js`)
- **Component Tests**:
  - Chat interface and message input
  - Message list with reactions and replies
  - File upload and preview components
  - Real-time presence indicators
- **Integration Tests**:
  - Complete chat workflow (`api/chat.test.js`)
  - WebSocket real-time functionality
  - Cross-platform notification delivery
  - Forum and assignment integration
- **E2E Tests**:
  - Full chat conversation user journey
  - Multi-user real-time chat testing
  - Mobile chat interface testing
  - Cross-browser WebSocket compatibility
- **Performance Tests**:
  - WebSocket connection performance under load
  - Message history loading with large datasets
  - File upload and sharing performance
  - Mobile chat interface responsiveness

Test file locations:
- `__tests__/chat/chatWorkflow.test.js`
- `__tests__/api/chatApi.test.js`
- `__tests__/e2e/chatSystem.test.js`
- `__tests__/components/chatComponents.test.js`
- `__tests__/realtime/websocket.test.js`

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-07-21 | 1.0 | Initial real-time messaging story with comprehensive features | Scrum Master (Bob) |

## Dev Agent Record
*This section will be populated by the development agent during implementation*

### Agent Model Used
*To be filled by dev agent*

### Debug Log References
*To be filled by dev agent*

### Completion Notes List
*To be filled by dev agent*

### File List
*To be filled by dev agent*

## QA Results
*Results from QA Agent review will be populated here after implementation*
