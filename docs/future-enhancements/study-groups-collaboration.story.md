# Story 5.3: Study Groups and Collaboration Tools

## Status
Draft

## Story
**As a** student and lecturer,
**I want to** create and participate in study groups with collaboration tools,
**so that** I can work effectively in teams, organize group study sessions, and collaborate on projects with structured workspaces

## Acceptance Criteria
1. Study group creation and management with member roles and permissions
2. Collaborative workspaces with shared resources and tools
3. Group scheduling and meeting coordination features
4. Project collaboration with task management and file sharing
5. Study session organization with interactive learning tools

## Tasks / Subtasks
- [ ] Build study group management system (AC: 1)
  - [ ] Create study group formation with course-based organization
  - [ ] Implement group member invitation and management
  - [ ] Add group roles and permission system (leader, member, observer)
  - [ ] Create group settings and privacy controls
  - [ ] Build group discovery and joining functionality
- [ ] Develop collaborative workspace features (AC: 2)
  - [ ] Create shared workspace for each study group
  - [ ] Implement collaborative document editing and note-taking
  - [ ] Add shared resource library and file management
  - [ ] Create group-specific chat channels and forums
  - [ ] Build whiteboard and brainstorming tools
- [ ] Add group scheduling and coordination (AC: 3)
  - [ ] Create group calendar with meeting scheduling
  - [ ] Implement study session planning and coordination
  - [ ] Add availability polling and scheduling suggestions
  - [ ] Create meeting reminders and notifications
  - [ ] Build virtual meeting room integration
- [ ] Implement project collaboration tools (AC: 4)
  - [ ] Create group project management with task assignment
  - [ ] Add collaborative file editing and version control
  - [ ] Implement group submission and peer review system
  - [ ] Create progress tracking and milestone management
  - [ ] Build project timeline and deadline management
- [ ] Add interactive study session tools (AC: 5)
  - [ ] Create collaborative quiz and flashcard sessions
  - [ ] Implement screen sharing and presentation tools
  - [ ] Add breakout room functionality for smaller groups
  - [ ] Create study timer and pomodoro session management
  - [ ] Build peer teaching and explanation tools
- [ ] Optimize collaboration system for free tier (AC: 1-5)
  - [ ] Implement efficient group data synchronization
  - [ ] Cache collaboration state to reduce database load
  - [ ] Optimize real-time collaboration within connection limits
  - [ ] Create collaborative file sharing within storage constraints
  - [ ] Add offline collaboration with sync capabilities

## Dev Notes

### Previous Story Context
This story completes the collaboration epic and builds on the communication foundation:
- **Story 5.1**: Course discussion forums for asynchronous communication
- **Story 5.2**: Real-time messaging and chat for instant communication
- **Epic 1 (1.1-1.3)**: User authentication and role management
- **Epic 2 (2.1-2.3)**: Course management and enrollment system
- **Epic 3 (3.1-3.3)**: Student dashboard and progress tracking
- **Epic 4 (4.1-4.3)**: Complete assignment workflow
- **Dependencies**: Requires forum, chat, calendar integration, and collaborative real-time features

### Technical Stack Context - Free Tier Optimized
[Source: docs/prd/technical-stack.md]
- **Frontend**: Next.js, Tailwind CSS (collaborative interface and real-time updates)
- **Backend**: Supabase (Free Tier - 500MB database, 2GB bandwidth)
- **Real-time**: Supabase Realtime for collaborative editing and live updates
- **Database**: PostgreSQL via Supabase for group data and collaboration state
- **File Storage**: Supabase Storage (1GB total - optimized for group resources)
- **Calendar**: Integration with existing calendar system and external providers
- **Hosting**: Vercel (Free Tier)

### Data Models Extension
Extended database schema for study groups and collaboration:
```sql
-- Study groups
CREATE TABLE study_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  group_name VARCHAR(100) NOT NULL,
  description TEXT,
  group_type VARCHAR(20) DEFAULT 'study', -- 'study', 'project', 'assignment', 'social'
  privacy_level VARCHAR(20) DEFAULT 'course', -- 'public', 'course', 'private', 'invite_only'
  max_members INTEGER DEFAULT 10,
  is_archived BOOLEAN DEFAULT false,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Group membership and roles
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) DEFAULT 'member', -- 'leader', 'co_leader', 'member', 'observer'
  permissions JSONB DEFAULT '{}', -- Custom permissions per member
  joined_at TIMESTAMP DEFAULT NOW(),
  last_active TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  UNIQUE(group_id, user_id)
);

-- Group invitations
CREATE TABLE group_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  inviter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invitee_email VARCHAR(255) NOT NULL,
  invitee_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invitation_code VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'declined', 'expired'
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP DEFAULT NOW(),
  responded_at TIMESTAMP
);

-- Collaborative workspaces
CREATE TABLE group_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  workspace_name VARCHAR(100) NOT NULL,
  workspace_type VARCHAR(20) DEFAULT 'general', -- 'general', 'project', 'study', 'meeting'
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}', -- Workspace-specific settings
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Shared documents and resources
CREATE TABLE group_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES group_workspaces(id) ON DELETE CASCADE,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  document_name VARCHAR(255) NOT NULL,
  document_type VARCHAR(20) DEFAULT 'text', -- 'text', 'spreadsheet', 'presentation', 'whiteboard'
  content JSONB, -- Document content in structured format
  file_path VARCHAR(500), -- Path for uploaded files
  version INTEGER DEFAULT 1,
  is_template BOOLEAN DEFAULT false,
  permissions JSONB DEFAULT '{"read": "all", "write": "members", "admin": "leaders"}',
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  last_edited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Full-text search for document content
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(document_name, '') || ' ' || COALESCE(content->>'text', ''))
  ) STORED
);

-- Document version history
CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES group_documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  content JSONB NOT NULL,
  changes_summary TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Real-time collaboration sessions
CREATE TABLE collaboration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES group_documents(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES group_workspaces(id) ON DELETE CASCADE,
  session_type VARCHAR(20) DEFAULT 'edit', -- 'edit', 'review', 'brainstorm', 'meeting'
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  participants JSONB DEFAULT '[]', -- Array of user IDs currently in session
  session_data JSONB DEFAULT '{}' -- Session-specific data (cursors, selections, etc.)
);

-- Group projects and tasks
CREATE TABLE group_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES group_workspaces(id) ON DELETE CASCADE,
  project_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'planning', -- 'planning', 'active', 'review', 'completed', 'cancelled'
  priority VARCHAR(10) DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
  start_date DATE,
  due_date DATE,
  completion_percentage INTEGER DEFAULT 0,
  project_data JSONB DEFAULT '{}', -- Custom project data
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Project tasks and subtasks
CREATE TABLE project_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES group_projects(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES project_tasks(id) ON DELETE CASCADE,
  task_name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo', -- 'todo', 'in_progress', 'review', 'done', 'blocked'
  priority VARCHAR(10) DEFAULT 'medium',
  estimated_hours DECIMAL(5,2),
  actual_hours DECIMAL(5,2),
  due_date TIMESTAMP,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Group meetings and study sessions
CREATE TABLE group_meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES group_workspaces(id) ON DELETE CASCADE,
  meeting_title VARCHAR(255) NOT NULL,
  description TEXT,
  meeting_type VARCHAR(20) DEFAULT 'study', -- 'study', 'project', 'social', 'review', 'presentation'
  scheduled_start TIMESTAMP NOT NULL,
  scheduled_end TIMESTAMP NOT NULL,
  actual_start TIMESTAMP,
  actual_end TIMESTAMP,
  location VARCHAR(255), -- Physical or virtual location
  meeting_url VARCHAR(500), -- URL for virtual meetings
  status VARCHAR(20) DEFAULT 'scheduled', -- 'scheduled', 'in_progress', 'completed', 'cancelled'
  meeting_data JSONB DEFAULT '{}', -- Agenda, notes, recordings, etc.
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Meeting participants and attendance
CREATE TABLE meeting_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id UUID REFERENCES group_meetings(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'invited', -- 'invited', 'accepted', 'declined', 'tentative'
  attendance VARCHAR(20) DEFAULT 'unknown', -- 'present', 'absent', 'late', 'unknown'
  joined_at TIMESTAMP,
  left_at TIMESTAMP,
  contribution_score INTEGER DEFAULT 0, -- Participation tracking
  notes TEXT, -- Personal notes for the meeting
  UNIQUE(meeting_id, user_id)
);

-- Group availability and scheduling
CREATE TABLE member_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_preferred BOOLEAN DEFAULT false,
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_until DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Study session tools and activities
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  meeting_id UUID REFERENCES group_meetings(id) ON DELETE CASCADE,
  session_name VARCHAR(255) NOT NULL,
  session_type VARCHAR(20) DEFAULT 'study', -- 'study', 'quiz', 'flashcards', 'discussion', 'presentation'
  activity_data JSONB DEFAULT '{}', -- Session-specific data
  duration_minutes INTEGER,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  participants JSONB DEFAULT '[]',
  results JSONB DEFAULT '{}', -- Session results and statistics
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Collaborative quiz and learning tools
CREATE TABLE group_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  study_session_id UUID REFERENCES study_sessions(id) ON DELETE CASCADE,
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  quiz_name VARCHAR(255) NOT NULL,
  quiz_type VARCHAR(20) DEFAULT 'collaborative', -- 'collaborative', 'competitive', 'practice'
  questions JSONB NOT NULL, -- Array of question objects
  settings JSONB DEFAULT '{}', -- Quiz settings and rules
  is_active BOOLEAN DEFAULT false,
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  results JSONB DEFAULT '{}', -- Group and individual results
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Group achievements and gamification
CREATE TABLE group_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  achievement_type VARCHAR(50) NOT NULL,
  achievement_name VARCHAR(255) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL, -- Achievement criteria
  reward_xp INTEGER DEFAULT 0,
  badge_icon VARCHAR(255),
  earned_at TIMESTAMP,
  earned_by JSONB, -- Array of user IDs who contributed
  created_at TIMESTAMP DEFAULT NOW()
);

-- Group resource sharing and files
CREATE TABLE group_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES group_workspaces(id) ON DELETE CASCADE,
  resource_name VARCHAR(255) NOT NULL,
  resource_type VARCHAR(20) DEFAULT 'file', -- 'file', 'link', 'note', 'bookmark'
  file_path VARCHAR(500),
  file_size_bytes BIGINT,
  mime_type VARCHAR(100),
  external_url VARCHAR(500),
  description TEXT,
  tags JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  download_count INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Full-text search for resources
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(resource_name, '') || ' ' || COALESCE(description, ''))
  ) STORED
);

-- Group communication channels (extends chat system)
CREATE TABLE group_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES study_groups(id) ON DELETE CASCADE,
  chat_channel_id UUID REFERENCES chat_channels(id) ON DELETE CASCADE, -- Link to existing chat system
  forum_category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE, -- Link to forum system
  channel_purpose VARCHAR(20) DEFAULT 'general', -- 'general', 'announcements', 'project', 'social'
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### File Locations
Based on Next.js conventions and study group system:
- Group pages: `pages/groups/` or `app/groups/`
- Group list: `pages/groups/index.js` or `app/groups/page.js`
- Group detail: `pages/groups/[groupId]/index.js` or `app/groups/[groupId]/page.js`
- Group workspace: `pages/groups/[groupId]/workspace/[workspaceId].js` or `app/groups/[groupId]/workspace/[workspaceId]/page.js`
- Group meetings: `pages/groups/[groupId]/meetings/` or `app/groups/[groupId]/meetings/`
- Group projects: `pages/groups/[groupId]/projects/` or `app/groups/[groupId]/projects/`
- Group components: `components/groups/GroupCard.js`, `components/groups/GroupWorkspace.js`
- Collaboration components: `components/collaboration/DocumentEditor.js`, `components/collaboration/Whiteboard.js`
- Meeting components: `components/meetings/MeetingRoom.js`, `components/meetings/ScheduleMeeting.js`
- Group utilities: `lib/groupHelpers.js`, `lib/collaborationManager.js`
- Group hooks: `hooks/useGroups.js`, `hooks/useCollaboration.js`

### Free Tier Collaboration Optimization
**Efficient Group Collaboration Strategy:**
```javascript
// Optimized collaboration system for free tier
const CollaborationOptimization = {
  // Real-time collaboration limits
  realtimeCollaboration: {
    maxConcurrentEditors: 5, // Limit simultaneous editors
    maxDocumentSize: 1000000, // 1MB max document size
    syncInterval: 2000, // 2 second sync interval
    conflictResolutionStrategy: 'last_write_wins', // Simple conflict resolution
    offlineSupport: true // Support offline editing with sync
  },
  
  // Group size and activity optimization
  groupOptimization: {
    maxGroupSize: 10, // Limit group size for free tier
    maxWorkspaces: 3, // Limit workspaces per group
    maxDocuments: 20, // Limit documents per workspace
    documentVersions: 10, // Keep last 10 versions only
    sessionTimeout: 3600000 // 1 hour session timeout
  },
  
  // File and storage optimization
  storageOptimization: {
    maxFileSize: 5, // 5MB max per file
    totalGroupStorage: 100, // 100MB per group
    allowedTypes: ['.pdf', '.doc', '.docx', '.txt', '.md', '.jpg', '.png'],
    imageCompression: 70, // 70% quality for images
    automaticCleanup: true // Auto-delete old files
  },
  
  // Meeting and scheduling optimization
  meetingOptimization: {
    maxMeetingDuration: 120, // 2 hours max meeting length
    maxScheduledMeetings: 10, // 10 future meetings per group
    meetingReminders: 2, // Max 2 reminders per meeting
    recordingDisabled: true, // No recordings on free tier
    maxParticipants: 10 // Same as group size
  }
};
```

### Study Group Interface Design
```jsx
// Comprehensive study group system interface
const StudyGroupSystem = () => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [collaborationMode, setCollaborationMode] = useState('view');

  return (
    <StudyGroupContainer>
      <GroupSidebar>
        <MyGroupsList 
          groups={userGroups}
          onGroupSelect={setSelectedGroup}
        />
        <GroupDiscovery 
          availableGroups={availableGroups}
          onJoinGroup={handleJoinGroup}
        />
        <CreateGroupButton 
          onClick={handleCreateGroup}
        />
      </GroupSidebar>
      
      <GroupMainArea>
        {selectedGroup && (
          <>
            <GroupHeader>
              <GroupInfo group={selectedGroup} />
              <GroupActions>
                <InviteMembers />
                <ScheduleMeeting />
                <GroupSettings />
              </GroupActions>
            </GroupHeader>
            
            <WorkspaceArea>
              <WorkspaceTabs 
                workspaces={groupWorkspaces}
                activeWorkspace={activeWorkspace}
                onWorkspaceChange={setActiveWorkspace}
              />
              
              <CollaborativeWorkspace 
                workspace={activeWorkspace}
                mode={collaborationMode}
                onModeChange={setCollaborationMode}
              />
            </WorkspaceArea>
            
            <GroupActivity>
              <RecentActivity activities={groupActivities} />
              <UpcomingMeetings meetings={upcomingMeetings} />
              <GroupProjects projects={activeProjects} />
            </GroupActivity>
          </>
        )}
      </GroupMainArea>
      
      <CollaborationPanel>
        <OnlineMembers members={onlineMembers} />
        <SharedResources resources={groupResources} />
        <GroupChat channel={groupChatChannel} />
      </CollaborationPanel>
    </StudyGroupContainer>
  );
};
```

### Collaborative Workspace System
**Real-time Collaboration Features:**
```javascript
// Collaborative workspace implementation
const CollaborativeWorkspace = {
  // Document collaboration
  documentCollaboration: {
    initializeEditor: async (documentId, userId) => {
      // Initialize collaborative editor with conflict resolution
      const editor = new CollaborativeEditor({
        documentId: documentId,
        userId: userId,
        realtime: true,
        conflictResolution: 'operational_transform'
      });
      
      // Subscribe to real-time changes
      const subscription = supabase
        .channel(`document_${documentId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'group_documents'
        }, handleDocumentUpdate)
        .on('broadcast', {
          event: 'cursor_move'
        }, handleCursorUpdate)
        .subscribe();
      
      return { editor, subscription };
    },
    
    saveDocument: async (documentId, content, userId) => {
      // Save document with version history
      const currentDoc = await supabase
        .from('group_documents')
        .select('version, content')
        .eq('id', documentId)
        .single();
      
      // Create version history entry
      await supabase
        .from('document_versions')
        .insert({
          document_id: documentId,
          version_number: currentDoc.data.version,
          content: currentDoc.data.content,
          created_by: userId
        });
      
      // Update document
      return await supabase
        .from('group_documents')
        .update({
          content: content,
          version: currentDoc.data.version + 1,
          last_edited_by: userId,
          updated_at: new Date()
        })
        .eq('id', documentId);
    }
  },
  
  // Whiteboard and brainstorming
  whiteboardCollaboration: {
    createWhiteboard: async (workspaceId, name) => {
      return await supabase
        .from('group_documents')
        .insert({
          workspace_id: workspaceId,
          document_name: name,
          document_type: 'whiteboard',
          content: {
            elements: [],
            canvasData: {},
            settings: {
              width: 1920,
              height: 1080,
              zoom: 1,
              background: 'white'
            }
          }
        });
    },
    
    updateWhiteboard: async (documentId, elements, userId) => {
      // Broadcast real-time whiteboard updates
      const channel = supabase.channel(`whiteboard_${documentId}`);
      
      await channel.send({
        type: 'broadcast',
        event: 'whiteboard_update',
        payload: {
          elements: elements,
          userId: userId,
          timestamp: new Date()
        }
      });
      
      // Debounced save to database
      debounce(() => {
        saveWhiteboardToDB(documentId, elements);
      }, 2000)();
    }
  },
  
  // Screen sharing and presentations
  screenSharing: {
    startScreenShare: async (sessionId, userId) => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen sharing not supported');
      }
      
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Broadcast screen share start
      const channel = supabase.channel(`session_${sessionId}`);
      await channel.send({
        type: 'broadcast',
        event: 'screen_share_started',
        payload: {
          userId: userId,
          timestamp: new Date()
        }
      });
      
      return stream;
    },
    
    stopScreenShare: async (sessionId, userId) => {
      const channel = supabase.channel(`session_${sessionId}`);
      await channel.send({
        type: 'broadcast',
        event: 'screen_share_stopped',
        payload: {
          userId: userId,
          timestamp: new Date()
        }
      });
    }
  }
};
```

### Group Management System
**Comprehensive Group Administration:**
```javascript
// Study group management system
const GroupManagement = {
  // Group creation and setup
  groupCreation: {
    createGroup: async (courseId, groupData, creatorId) => {
      // Create the study group
      const { data: group } = await supabase
        .from('study_groups')
        .insert({
          course_id: courseId,
          group_name: groupData.name,
          description: groupData.description,
          group_type: groupData.type,
          privacy_level: groupData.privacy,
          max_members: groupData.maxMembers || 10,
          created_by: creatorId
        })
        .select()
        .single();
      
      // Add creator as group leader
      await supabase
        .from('group_members')
        .insert({
          group_id: group.id,
          user_id: creatorId,
          role: 'leader',
          permissions: {
            manage_members: true,
            manage_settings: true,
            manage_workspaces: true,
            manage_meetings: true
          }
        });
      
      // Create default workspace
      await supabase
        .from('group_workspaces')
        .insert({
          group_id: group.id,
          workspace_name: 'General',
          workspace_type: 'general',
          is_default: true
        });
      
      // Create default communication channels
      await createGroupChannels(group.id, courseId);
      
      return group;
    },
    
    inviteMembers: async (groupId, invitations, inviterId) => {
      const invitationPromises = invitations.map(async (invitation) => {
        const invitationCode = generateInvitationCode();
        
        // Create invitation record
        const { data } = await supabase
          .from('group_invitations')
          .insert({
            group_id: groupId,
            inviter_id: inviterId,
            invitee_email: invitation.email,
            invitee_id: invitation.userId,
            invitation_code: invitationCode,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          })
          .select()
          .single();
        
        // Send invitation notification
        await sendGroupInvitation(data);
        
        return data;
      });
      
      return await Promise.all(invitationPromises);
    }
  },
  
  // Member management
  memberManagement: {
    acceptInvitation: async (invitationCode, userId) => {
      // Find and validate invitation
      const { data: invitation } = await supabase
        .from('group_invitations')
        .select('*, study_groups(*)')
        .eq('invitation_code', invitationCode)
        .eq('status', 'pending')
        .gt('expires_at', new Date())
        .single();
      
      if (!invitation) {
        throw new Error('Invalid or expired invitation');
      }
      
      // Check group capacity
      const { count } = await supabase
        .from('group_members')
        .select('*', { count: 'exact' })
        .eq('group_id', invitation.group_id)
        .eq('is_active', true);
      
      if (count >= invitation.study_groups.max_members) {
        throw new Error('Group is at maximum capacity');
      }
      
      // Add member to group
      await supabase
        .from('group_members')
        .insert({
          group_id: invitation.group_id,
          user_id: userId,
          role: 'member',
          permissions: {
            view_workspace: true,
            edit_documents: true,
            participate_meetings: true
          }
        });
      
      // Update invitation status
      await supabase
        .from('group_invitations')
        .update({
          status: 'accepted',
          responded_at: new Date()
        })
        .eq('id', invitation.id);
      
      return invitation.study_groups;
    },
    
    updateMemberRole: async (groupId, userId, newRole, permissions) => {
      return await supabase
        .from('group_members')
        .update({
          role: newRole,
          permissions: permissions
        })
        .eq('group_id', groupId)
        .eq('user_id', userId);
    },
    
    removeMember: async (groupId, userId, removedBy) => {
      // Check permissions
      const { data: remover } = await supabase
        .from('group_members')
        .select('role, permissions')
        .eq('group_id', groupId)
        .eq('user_id', removedBy)
        .single();
      
      if (!remover?.permissions?.manage_members && remover?.role !== 'leader') {
        throw new Error('Insufficient permissions to remove member');
      }
      
      // Remove member
      return await supabase
        .from('group_members')
        .update({ is_active: false })
        .eq('group_id', groupId)
        .eq('user_id', userId);
    }
  },
  
  // Group discovery
  groupDiscovery: {
    findGroups: async (courseId, filters = {}) => {
      let query = supabase
        .from('study_groups')
        .select(`
          *,
          group_members(count),
          users:created_by(username, avatar_url),
          study_groups:group_members!inner(
            users(username, avatar_url)
          )
        `)
        .eq('course_id', courseId)
        .eq('is_archived', false)
        .in('privacy_level', ['public', 'course']);
      
      if (filters.groupType) {
        query = query.eq('group_type', filters.groupType);
      }
      
      if (filters.hasAvailableSpots) {
        // This would require a more complex query with member count
        query = query.lt('group_members.count', 'max_members');
      }
      
      return await query;
    },
    
    searchGroups: async (courseId, searchTerm) => {
      return await supabase
        .from('study_groups')
        .select('*, group_members(count)')
        .eq('course_id', courseId)
        .eq('is_archived', false)
        .in('privacy_level', ['public', 'course'])
        .or(`group_name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }
  }
};
```

### Meeting and Scheduling System
**Group Coordination Features:**
```javascript
// Group meeting and scheduling system
const MeetingSystem = {
  // Meeting scheduling
  meetingScheduling: {
    scheduleMeeting: async (groupId, meetingData, organizerId) => {
      // Create meeting
      const { data: meeting } = await supabase
        .from('group_meetings')
        .insert({
          group_id: groupId,
          workspace_id: meetingData.workspaceId,
          meeting_title: meetingData.title,
          description: meetingData.description,
          meeting_type: meetingData.type,
          scheduled_start: meetingData.startTime,
          scheduled_end: meetingData.endTime,
          location: meetingData.location,
          meeting_url: meetingData.virtualUrl,
          created_by: organizerId
        })
        .select()
        .single();
      
      // Add all group members as participants
      const { data: members } = await supabase
        .from('group_members')
        .select('user_id')
        .eq('group_id', groupId)
        .eq('is_active', true);
      
      const participants = members.map(member => ({
        meeting_id: meeting.id,
        user_id: member.user_id,
        status: member.user_id === organizerId ? 'accepted' : 'invited'
      }));
      
      await supabase
        .from('meeting_participants')
        .insert(participants);
      
      // Send meeting invitations
      await sendMeetingInvitations(meeting, members);
      
      return meeting;
    },
    
    findBestMeetingTime: async (groupId, duration, preferredDays) => {
      // Get availability for all group members
      const { data: availability } = await supabase
        .from('member_availability')
        .select(`
          *,
          users(username, timezone)
        `)
        .eq('group_id', groupId)
        .in('day_of_week', preferredDays);
      
      // Algorithm to find overlapping time slots
      return findOptimalMeetingSlots(availability, duration);
    },
    
    updateMeetingStatus: async (meetingId, participantId, status) => {
      return await supabase
        .from('meeting_participants')
        .update({
          status: status,
          updated_at: new Date()
        })
        .eq('meeting_id', meetingId)
        .eq('user_id', participantId);
    }
  },
  
  // Meeting management
  meetingManagement: {
    startMeeting: async (meetingId, hostId) => {
      // Update meeting status
      await supabase
        .from('group_meetings')
        .update({
          status: 'in_progress',
          actual_start: new Date()
        })
        .eq('id', meetingId);
      
      // Create collaboration session
      const { data: session } = await supabase
        .from('collaboration_sessions')
        .insert({
          workspace_id: meetingData.workspaceId,
          session_type: 'meeting',
          is_active: true,
          participants: [hostId]
        })
        .select()
        .single();
      
      // Notify all participants
      await notifyMeetingStart(meetingId);
      
      return session;
    },
    
    joinMeeting: async (meetingId, participantId) => {
      // Update participant attendance
      await supabase
        .from('meeting_participants')
        .update({
          attendance: 'present',
          joined_at: new Date()
        })
        .eq('meeting_id', meetingId)
        .eq('user_id', participantId);
      
      // Update collaboration session
      const { data: session } = await supabase
        .from('collaboration_sessions')
        .select('participants')
        .eq('meeting_id', meetingId)
        .eq('is_active', true)
        .single();
      
      if (session) {
        const updatedParticipants = [...session.participants, participantId];
        await supabase
          .from('collaboration_sessions')
          .update({
            participants: updatedParticipants
          })
          .eq('meeting_id', meetingId);
      }
    },
    
    endMeeting: async (meetingId, hostId) => {
      const endTime = new Date();
      
      // Update meeting status
      await supabase
        .from('group_meetings')
        .update({
          status: 'completed',
          actual_end: endTime
        })
        .eq('id', meetingId);
      
      // End collaboration session
      await supabase
        .from('collaboration_sessions')
        .update({
          is_active: false,
          ended_at: endTime
        })
        .eq('meeting_id', meetingId);
      
      // Calculate participation scores
      await calculateMeetingParticipation(meetingId);
    }
  },
  
  // Study session tools
  studySessionTools: {
    createStudySession: async (groupId, sessionData, hostId) => {
      const { data: session } = await supabase
        .from('study_sessions')
        .insert({
          group_id: groupId,
          meeting_id: sessionData.meetingId,
          session_name: sessionData.name,
          session_type: sessionData.type,
          activity_data: sessionData.activityData,
          started_at: new Date(),
          created_by: hostId
        })
        .select()
        .single();
      
      return session;
    },
    
    createCollaborativeQuiz: async (sessionId, quizData, creatorId) => {
      return await supabase
        .from('group_quizzes')
        .insert({
          study_session_id: sessionId,
          group_id: quizData.groupId,
          quiz_name: quizData.name,
          quiz_type: quizData.type,
          questions: quizData.questions,
          settings: quizData.settings,
          created_by: creatorId
        });
    },
    
    startPomodoroSession: async (groupId, sessionData) => {
      const pomodoroSession = {
        type: 'pomodoro',
        workDuration: sessionData.workMinutes || 25,
        breakDuration: sessionData.breakMinutes || 5,
        cycles: sessionData.cycles || 4,
        startTime: new Date(),
        participants: sessionData.participants
      };
      
      // Broadcast pomodoro start to group
      const channel = supabase.channel(`group_${groupId}_pomodoro`);
      await channel.send({
        type: 'broadcast',
        event: 'pomodoro_started',
        payload: pomodoroSession
      });
      
      return pomodoroSession;
    }
  }
};
```

### Project Management Integration
**Group Project Collaboration:**
```javascript
// Group project management system
const ProjectManagement = {
  // Project creation and management
  projectManagement: {
    createProject: async (groupId, projectData, creatorId) => {
      const { data: project } = await supabase
        .from('group_projects')
        .insert({
          group_id: groupId,
          workspace_id: projectData.workspaceId,
          project_name: projectData.name,
          description: projectData.description,
          status: 'planning',
          priority: projectData.priority || 'medium',
          start_date: projectData.startDate,
          due_date: projectData.dueDate,
          created_by: creatorId,
          assigned_to: projectData.assignedTo
        })
        .select()
        .single();
      
      // Create initial project tasks if provided
      if (projectData.initialTasks) {
        const tasks = projectData.initialTasks.map(task => ({
          project_id: project.id,
          task_name: task.name,
          description: task.description,
          status: 'todo',
          assigned_to: task.assignedTo,
          due_date: task.dueDate,
          created_by: creatorId
        }));
        
        await supabase
          .from('project_tasks')
          .insert(tasks);
      }
      
      return project;
    },
    
    updateProjectProgress: async (projectId) => {
      // Calculate completion percentage based on completed tasks
      const { data: tasks } = await supabase
        .from('project_tasks')
        .select('status')
        .eq('project_id', projectId);
      
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'done').length;
      const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      return await supabase
        .from('group_projects')
        .update({
          completion_percentage: completionPercentage,
          updated_at: new Date()
        })
        .eq('id', projectId);
    },
    
    assignTask: async (taskId, assigneeId, assignerId) => {
      const { data: task } = await supabase
        .from('project_tasks')
        .update({
          assigned_to: assigneeId,
          status: 'in_progress',
          updated_at: new Date()
        })
        .eq('id', taskId)
        .select('*, group_projects(group_id)')
        .single();
      
      // Notify assignee
      await notifyTaskAssignment(task, assigneeId, assignerId);
      
      return task;
    }
  },
  
  // Task management
  taskManagement: {
    createTask: async (projectId, taskData, creatorId) => {
      return await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          parent_task_id: taskData.parentTaskId,
          task_name: taskData.name,
          description: taskData.description,
          priority: taskData.priority || 'medium',
          estimated_hours: taskData.estimatedHours,
          due_date: taskData.dueDate,
          assigned_to: taskData.assignedTo,
          created_by: creatorId
        });
    },
    
    updateTaskStatus: async (taskId, newStatus, userId) => {
      const updateData = {
        status: newStatus,
        updated_at: new Date()
      };
      
      if (newStatus === 'done') {
        updateData.completed_at = new Date();
      }
      
      const { data: task } = await supabase
        .from('project_tasks')
        .update(updateData)
        .eq('id', taskId)
        .select('*, group_projects(id, group_id)')
        .single();
      
      // Update project completion percentage
      await updateProjectProgress(task.group_projects.id);
      
      // Award XP for task completion
      if (newStatus === 'done') {
        await awardTaskCompletionXP(userId, task);
      }
      
      return task;
    },
    
    logTimeSpent: async (taskId, userId, hoursSpent, description) => {
      // Update actual hours on task
      const { data: task } = await supabase
        .from('project_tasks')
        .select('actual_hours')
        .eq('id', taskId)
        .single();
      
      const newActualHours = (task.actual_hours || 0) + hoursSpent;
      
      await supabase
        .from('project_tasks')
        .update({
          actual_hours: newActualHours,
          updated_at: new Date()
        })
        .eq('id', taskId);
      
      // Log time entry (if we had a time tracking table)
      // This could be extended with detailed time tracking
      
      return { hoursSpent, totalHours: newActualHours };
    }
  }
};
```

### Gamification and Achievements
**Group Achievement System:**
```javascript
// Group gamification and achievement system
const GroupGamification = {
  // Achievement definitions
  achievements: {
    groupAchievements: [
      {
        type: 'first_meeting',
        name: 'Getting Started',
        description: 'Complete your first group meeting',
        reward_xp: 100,
        criteria: { meetings_completed: 1 }
      },
      {
        type: 'collaborative_project',
        name: 'Team Player',
        description: 'Complete a collaborative project together',
        reward_xp: 500,
        criteria: { projects_completed: 1 }
      },
      {
        type: 'study_streak',
        name: 'Study Squad',
        description: 'Meet for 7 consecutive weeks',
        reward_xp: 1000,
        criteria: { weekly_meetings: 7 }
      },
      {
        type: 'knowledge_sharing',
        name: 'Knowledge Sharers',
        description: 'Share 50 resources in the group',
        reward_xp: 300,
        criteria: { resources_shared: 50 }
      }
    ],
    
    checkAchievements: async (groupId) => {
      const achievements = [];
      
      for (const achievement of this.groupAchievements) {
        const isEarned = await evaluateAchievement(groupId, achievement.criteria);
        
        if (isEarned) {
          const existing = await supabase
            .from('group_achievements')
            .select('id')
            .eq('group_id', groupId)
            .eq('achievement_type', achievement.type)
            .single();
          
          if (!existing.data) {
            // Award new achievement
            const { data: newAchievement } = await supabase
              .from('group_achievements')
              .insert({
                group_id: groupId,
                achievement_type: achievement.type,
                achievement_name: achievement.name,
                description: achievement.description,
                criteria: achievement.criteria,
                reward_xp: achievement.reward_xp,
                earned_at: new Date(),
                earned_by: await getActiveGroupMembers(groupId)
              })
              .select()
              .single();
            
            achievements.push(newAchievement);
            
            // Award XP to group members
            await awardGroupXP(groupId, achievement.reward_xp);
          }
        }
      }
      
      return achievements;
    }
  },
  
  // Group statistics and progress
  groupProgress: {
    calculateGroupStats: async (groupId) => {
      const [
        meetingsData,
        projectsData,
        messagesData,
        resourcesData
      ] = await Promise.all([
        supabase.from('group_meetings').select('*').eq('group_id', groupId),
        supabase.from('group_projects').select('*').eq('group_id', groupId),
        supabase.from('chat_messages').select('*').eq('group_id', groupId),
        supabase.from('group_resources').select('*').eq('group_id', groupId)
      ]);
      
      return {
        totalMeetings: meetingsData.data?.length || 0,
        completedProjects: projectsData.data?.filter(p => p.status === 'completed').length || 0,
        messagesExchanged: messagesData.data?.length || 0,
        resourcesShared: resourcesData.data?.length || 0,
        groupAge: calculateGroupAge(groupId),
        activeMembership: await getActiveMemberCount(groupId)
      };
    },
    
    getGroupLeaderboard: async (courseId) => {
      return await supabase
        .from('study_groups')
        .select(`
          id,
          group_name,
          group_achievements(achievement_type, reward_xp),
          group_members(count)
        `)
        .eq('course_id', courseId)
        .eq('is_archived', false);
    }
  }
};
```

### Mobile Group Experience
**Touch-Optimized Group Interface:**
- **Mobile Group Management**: Responsive interface for managing groups on mobile
- **Touch Collaboration**: Touch-friendly collaborative editing and whiteboard tools
- **Mobile Meetings**: Optimized meeting interface for mobile participation
- **Offline Group Access**: Cache group data for offline access and sync
- **Push Notifications**: Native notifications for group activities and meetings

### Integration with Previous Systems
**Building on Complete LMS Foundation:**
```javascript
// Integration with existing LMS systems
const GroupIntegration = {
  // Forum integration (Story 5.1)
  forumIntegration: {
    groupForumCategories: true, // Auto-create forum categories for groups
    crossPlatformDiscussions: true, // Link group discussions to course forums
    groupModeration: true, // Group leaders can moderate discussions
    forumToGroupEscalation: true // Convert forum discussions to group projects
  },
  
  // Chat integration (Story 5.2)
  chatIntegration: {
    groupChatChannels: true, // Auto-create chat channels for groups
    meetingChatRooms: true, // Create temporary chat rooms for meetings
    crossPlatformMentions: true, // Mentions work across all communication platforms
    unifiedNotifications: true // Single notification system across all features
  },
  
  // Assignment integration (Epic 4)
  assignmentIntegration: {
    groupAssignments: true, // Support group-based assignments
    collaborativeSubmissions: true, // Group submissions for assignments
    peerReviewGroups: true, // Use groups for peer review process
    gradingWorkflows: true // Group grading and feedback workflows
  },
  
  // Progress tracking integration (Epic 3)
  progressIntegration: {
    groupParticipation: {
      trackEngagement: true,
      collaborationMetrics: true,
      leadershipSkills: true,
      teamworkXP: true
    },
    
    achievements: [
      'Group Leader',
      'Collaborative Learner',
      'Meeting Organizer',
      'Project Manager',
      'Knowledge Contributor'
    ]
  },
  
  // Course management integration (Epic 2)
  courseIntegration: {
    courseBasedGroups: true, // Groups are tied to specific courses
    instructorOverview: true, // Instructors can view all course groups
    groupAnalytics: true, // Analytics on group performance and engagement
    gradebookIntegration: true // Group activities affect individual grades
  }
};
```

### Security and Privacy
**Group Security Measures:**
```javascript
// Security considerations for group collaboration
const GroupSecurity = {
  // Group access control
  accessControl: {
    roleBasedPermissions: true,
    workspacePrivacy: true,
    documentPermissions: true,
    meetingAccess: true
  },
  
  // Collaboration security
  collaborationSecurity: {
    documentVersionControl: true,
    editConflictResolution: true,
    auditTrail: true,
    dataEncryption: false // Basic only for free tier
  },
  
  // Privacy protection
  privacyProtection: {
    groupPrivacyLevels: true,
    memberDataProtection: true,
    documentSharing: true,
    communicationPrivacy: true
  }
};
```

### Performance Optimizations
**Free Tier Group Performance:**
- **Efficient Collaboration**: Optimized real-time collaboration for multiple users
- **Smart Caching**: Cache group data and collaboration state locally
- **Connection Management**: Efficient WebSocket usage for group activities
- **File Optimization**: Compress and optimize group files and resources
- **Lazy Loading**: Load group content on demand to reduce initial load times

### Testing Requirements
Group collaboration system requires comprehensive testing:
- **Group Tests**: Group creation, member management, and permissions
- **Collaboration Tests**: Real-time editing, whiteboard, and document sharing
- **Meeting Tests**: Scheduling, joining, screen sharing, and coordination
- **Project Tests**: Task management, progress tracking, and deadlines
- **Integration Tests**: Cross-system communication and data consistency

## Testing

### Testing Standards
Study groups and collaboration tools testing strategy:
- **Unit Tests**:
  - Group management logic (`lib/groupHelpers.test.js`)
  - Collaboration utilities (`lib/collaborationManager.test.js`)
  - Meeting scheduling algorithms (`lib/meetingScheduler.test.js`)
  - Project management functions (`lib/projectManager.test.js`)
- **Component Tests**:
  - Group creation and management interface
  - Collaborative workspace and document editor
  - Meeting room and scheduling components
  - Project dashboard and task management
- **Integration Tests**:
  - Complete group workflow from creation to collaboration
  - Real-time collaboration functionality across multiple users
  - Meeting scheduling and coordination system
  - Cross-platform integration (forum, chat, assignments)
- **E2E Tests**:
  - Full group collaboration user journey
  - Multi-user real-time collaboration testing
  - Meeting coordination and virtual session testing
  - Mobile group interface and collaboration testing
- **Performance Tests**:
  - Real-time collaboration performance under load
  - Group data synchronization with multiple users
  - Meeting and scheduling system performance
  - Mobile collaboration interface responsiveness

Test file locations:
- `__tests__/groups/groupWorkflow.test.js`
- `__tests__/api/groupsApi.test.js`
- `__tests__/e2e/groupCollaboration.test.js`
- `__tests__/components/groupComponents.test.js`
- `__tests__/collaboration/realtimeCollab.test.js`

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-07-21 | 1.0 | Initial study groups and collaboration tools story | Scrum Master (Bob) |

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
