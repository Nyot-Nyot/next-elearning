# Story 5.1: Course Discussion Forums

## Status
Draft

## Story
**As a** student and lecturer,
**I want to** participate in course discussion forums,
**so that** I can engage with peers, ask questions, and collaborate on learning topics

## Acceptance Criteria
1. Each course has dedicated discussion forums with organized categories
2. Students and lecturers can create posts and reply to discussions
3. Forum content supports rich text, file attachments, and code formatting
4. Posts can be categorized, tagged, and searched efficiently
5. Moderation tools allow lecturers to manage forum content and behavior

## Tasks / Subtasks
- [ ] Build forum structure and navigation (AC: 1)
  - [ ] Create course forum homepage with category organization
  - [ ] Add forum categories (General, Q&A, Assignments, Projects, etc.)
  - [ ] Implement forum breadcrumb navigation and structure
  - [ ] Create forum statistics and activity overview
  - [ ] Add forum settings and customization options
- [ ] Implement discussion post creation and management (AC: 2)
  - [ ] Build post creation interface with rich text editor
  - [ ] Add discussion thread and reply system
  - [ ] Create post editing and deletion functionality
  - [ ] Implement post draft and scheduling features
  - [ ] Add post voting and reaction system
- [ ] Add rich content support for discussions (AC: 3)
  - [ ] Integrate rich text editor with formatting options
  - [ ] Add file attachment system for forum posts
  - [ ] Create code syntax highlighting for programming discussions
  - [ ] Implement image and video embedding capabilities
  - [ ] Add mathematical formula and equation support
- [ ] Build search and organization features (AC: 4)
  - [ ] Create forum search with content and user filtering
  - [ ] Add post tagging and category filtering system
  - [ ] Implement post sorting (newest, popular, unanswered)
  - [ ] Create bookmark and follow post functionality
  - [ ] Add advanced search with date and user filters
- [ ] Implement moderation and management tools (AC: 5)
  - [ ] Create lecturer moderation dashboard and controls
  - [ ] Add post flagging and reporting system
  - [ ] Implement post pinning and announcement features
  - [ ] Create user reputation and contribution tracking
  - [ ] Add forum analytics and engagement metrics
- [ ] Optimize forum system for free tier (AC: 1-5)
  - [ ] Implement efficient post loading with pagination
  - [ ] Cache frequently accessed forum data
  - [ ] Optimize search functionality for performance
  - [ ] Create lightweight notification system
  - [ ] Add content compression for attachments

## Dev Notes

### Previous Story Context
This story builds on the complete assignment system and adds collaborative features:
- **Epic 1 (1.1-1.3)**: User authentication and role management
- **Epic 2 (2.1-2.3)**: Course management and enrollment system
- **Epic 3 (3.1-3.3)**: Student dashboard and progress tracking
- **Epic 4 (4.1-4.3)**: Complete assignment workflow
- **Dependencies**: Requires course enrollment data, user permissions, and notification system

### Technical Stack Context - Free Tier Optimized
[Source: docs/prd/technical-stack.md]
- **Frontend**: Next.js, Tailwind CSS (forum interface and rich content)
- **Backend**: Supabase (Free Tier - 500MB database, 2GB bandwidth)
- **Database**: PostgreSQL via Supabase for forum posts and discussions
- **File Storage**: Supabase Storage (1GB total - optimized for forum attachments)
- **Rich Text**: React-based editor with code highlighting (Tiptap or similar)
- **Search**: PostgreSQL full-text search for forum content
- **Hosting**: Vercel (Free Tier)

### Data Models Extension
Extended database schema for discussion forum system:
```sql
-- Forum categories for each course
CREATE TABLE forum_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category_order INTEGER DEFAULT 0,
  is_locked BOOLEAN DEFAULT false,
  lecturer_only BOOLEAN DEFAULT false, -- Only lecturers can post
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Discussion posts
CREATE TABLE forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
  parent_post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE, -- NULL for top-level posts
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  content_type VARCHAR(20) DEFAULT 'rich_text', -- 'rich_text', 'markdown', 'plain_text'
  post_type VARCHAR(20) DEFAULT 'discussion', -- 'discussion', 'question', 'announcement'
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  is_deleted BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMP,
  last_reply_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Full-text search index
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', title), 'A') ||
    setweight(to_tsvector('english', content), 'B')
  ) STORED
);

-- Post attachments
CREATE TABLE forum_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  original_filename VARCHAR(255) NOT NULL,
  stored_filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Post tags for organization
CREATE TABLE forum_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) DEFAULT '#3B82F6', -- Hex color code
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, name)
);

CREATE TABLE post_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES forum_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, tag_id)
);

-- Post reactions (likes, helpful, etc.)
CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reaction_type VARCHAR(20) NOT NULL, -- 'like', 'helpful', 'thanks', 'confused'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- User bookmarks for posts
CREATE TABLE forum_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

-- Post reporting and moderation
CREATE TABLE post_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL, -- 'spam', 'inappropriate', 'off_topic', 'harassment'
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved', 'dismissed'
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Forum analytics and engagement
CREATE TABLE forum_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  date DATE DEFAULT CURRENT_DATE,
  total_posts INTEGER DEFAULT 0,
  total_replies INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  top_contributors JSONB, -- Array of user engagement data
  popular_tags JSONB, -- Array of trending tags
  created_at TIMESTAMP DEFAULT NOW()
);

-- User forum activity and reputation
CREATE TABLE user_forum_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  posts_created INTEGER DEFAULT 0,
  replies_posted INTEGER DEFAULT 0,
  helpful_reactions_received INTEGER DEFAULT 0,
  reputation_score INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Forum notifications and subscriptions
CREATE TABLE forum_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE, -- NULL for course-wide subscription
  subscription_type VARCHAR(20) NOT NULL, -- 'all_posts', 'replies_only', 'mentions_only'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### File Locations
Based on Next.js conventions and forum system:
- Forum pages: `pages/courses/[courseId]/forum/` or `app/courses/[courseId]/forum/`
- Forum home: `pages/courses/[courseId]/forum/index.js` or `app/courses/[courseId]/forum/page.js`
- Category view: `pages/courses/[courseId]/forum/category/[categoryId].js` or `app/courses/[courseId]/forum/category/[categoryId]/page.js`
- Post view: `pages/courses/[courseId]/forum/post/[postId].js` or `app/courses/[courseId]/forum/post/[postId]/page.js`
- Forum components: `components/forum/ForumHome.js`, `components/forum/PostList.js`
- Post components: `components/forum/PostEditor.js`, `components/forum/PostCard.js`
- Search components: `components/forum/ForumSearch.js`, `components/forum/TagFilter.js`
- Forum utilities: `lib/forumHelpers.js`, `lib/contentParser.js`
- Forum hooks: `hooks/useForum.js`, `hooks/useForumPosts.js`

### Free Tier Forum Optimization
**Efficient Forum System Strategy:**
```javascript
// Optimized forum system for free tier
const ForumOptimization = {
  // Post loading and pagination
  postLoading: {
    postsPerPage: 20, // Reasonable pagination size
    preloadReplies: 5, // Preload first 5 replies
    lazyLoadImages: true, // Lazy load forum images
    cachePostList: 15 // Cache post lists for 15 minutes
  },
  
  // Search optimization
  searchOptimization: {
    useFullTextSearch: true, // PostgreSQL full-text search
    debounceSearch: 300, // 300ms debounce for search input
    cacheResults: 10, // Cache search results for 10 minutes
    limitResults: 50 // Limit search results to 50 items
  },
  
  // Content optimization
  contentOptimization: {
    compressAttachments: true, // Compress forum attachments
    maxFileSize: 5, // 5MB max per attachment
    textPreview: 200, // 200 character preview for long posts
    imageOptimization: true // Optimize images before upload
  },
  
  // Database optimization
  dbOptimization: {
    indexedQueries: true, // Use indexes for forum queries
    aggregatedCounts: true, // Pre-calculate reply counts
    batchOperations: true, // Batch forum operations
    efficientJoins: true // Optimize database joins
  }
};
```

### Forum Interface Design
```jsx
// Comprehensive forum system interface
const ForumSystem = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ForumContainer>
      <ForumHeader>
        <CourseForumTitle courseId={courseId} />
        <ForumActions>
          <CreatePostButton />
          <ForumSearch 
            query={searchQuery}
            onSearch={setSearchQuery}
          />
          <ForumSettings />
        </ForumActions>
      </ForumHeader>
      
      <ForumLayout>
        <ForumSidebar>
          <CategoryList 
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <TagCloud tags={popularTags} />
          <ForumStats analytics={forumAnalytics} />
        </ForumSidebar>
        
        <ForumContent>
          <ForumNavigation>
            <CategoryBreadcrumb />
            <PostFilters>
              <SortOptions />
              <FilterOptions />
              <ViewOptions />
            </PostFilters>
          </ForumNavigation>
          
          <PostsList>
            {posts.map(post => (
              <PostCard 
                key={post.id}
                post={post}
                showPreview={true}
                onReact={handlePostReaction}
                onBookmark={handleBookmark}
              />
            ))}
          </PostsList>
          
          <PaginationControls 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </ForumContent>
      </ForumLayout>
      
      <ForumModeration>
        {userRole === 'lecturer' && (
          <ModerationPanel>
            <ReportedPosts />
            <ForumAnalytics />
            <ModerationActions />
          </ModerationPanel>
        )}
      </ForumModeration>
    </ForumContainer>
  );
};
```

### Rich Content Support System
**Comprehensive Content Features:**
```javascript
// Rich content support for forum posts
const RichContentSystem = {
  // Rich text editor configuration
  richTextEditor: {
    features: [
      'bold', 'italic', 'underline', 'strikethrough',
      'headings', 'lists', 'links', 'blockquotes',
      'code-inline', 'code-block', 'tables'
    ],
    
    codeHighlighting: {
      languages: ['javascript', 'python', 'java', 'html', 'css', 'sql'],
      theme: 'github-dark',
      lineNumbers: true,
      copyButton: true
    },
    
    mathSupport: {
      enabled: true,
      renderer: 'katex', // Lightweight math rendering
      inlineDelimiters: ['$', '$'],
      blockDelimiters: ['$$', '$$']
    }
  },
  
  // File attachment system
  attachmentSystem: {
    allowedTypes: [
      '.pdf', '.doc', '.docx', '.txt', '.rtf', // Documents
      '.jpg', '.jpeg', '.png', '.gif', '.svg', // Images
      '.mp4', '.webm', '.mov', // Videos (limited)
      '.zip', '.rar' // Archives
    ],
    
    maxFileSize: 5, // 5MB per file
    maxFiles: 3, // Max 3 files per post
    
    imageOptimization: {
      maxWidth: 800,
      maxHeight: 600,
      quality: 85,
      format: 'webp'
    },
    
    previewGeneration: {
      images: true,
      documents: false, // Not available in free tier
      videos: true
    }
  },
  
  // Content parsing and rendering
  contentParser: {
    sanitizeHTML: true,
    allowedTags: [
      'p', 'br', 'strong', 'em', 'u', 's',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote',
      'a', 'img', 'table', 'tr', 'td', 'th',
      'pre', 'code', 'span'
    ],
    
    linkProcessing: {
      openExternal: true,
      addNofollow: true,
      previewGeneration: false // Not available in free tier
    },
    
    mentionDetection: {
      userMentions: true, // @username mentions
      pattern: /@([a-zA-Z0-9_]+)/g,
      autoComplete: true
    }
  }
};
```

### Search and Organization Features
**Advanced Forum Organization:**
```javascript
// Comprehensive search and organization system
const ForumOrganization = {
  // Search functionality
  searchSystem: {
    fullTextSearch: {
      fields: ['title', 'content'],
      weights: { title: 'A', content: 'B' },
      operators: ['&', '|', '!'],
      stemming: true
    },
    
    filters: {
      author: true,
      category: true,
      tags: true,
      dateRange: true,
      postType: true,
      hasAttachments: true
    },
    
    sorting: {
      relevance: 'search_rank',
      newest: 'created_at DESC',
      oldest: 'created_at ASC',
      mostReplies: 'reply_count DESC',
      mostViews: 'view_count DESC',
      lastActivity: 'last_reply_at DESC'
    }
  },
  
  // Tagging system
  taggingSystem: {
    autoSuggest: true,
    colorCoding: true,
    hierarchical: false, // Keep simple for free tier
    
    predefinedTags: [
      { name: 'homework', color: '#FF6B6B' },
      { name: 'exam', color: '#4ECDC4' },
      { name: 'project', color: '#45B7D1' },
      { name: 'general', color: '#96CEB4' },
      { name: 'technical', color: '#FFEAA7' },
      { name: 'urgent', color: '#FD79A8' }
    ],
    
    customTags: {
      allowStudentCreation: true,
      requireApproval: false,
      maxPerPost: 5
    }
  },
  
  // Post organization
  postOrganization: {
    categories: {
      defaultCategories: [
        'General Discussion',
        'Questions & Answers',
        'Assignment Help',
        'Study Groups',
        'Course Materials',
        'Announcements'
      ],
      
      customCategories: true,
      categoryPermissions: true,
      categoryOrdering: true
    },
    
    pinning: {
      coursePins: true, // Course-wide pinned posts
      categoryPins: true, // Category-specific pins
      maxPins: 3 // Limit pinned posts
    }
  }
};
```

### Moderation and Management Tools
**Comprehensive Moderation System:**
```javascript
// Forum moderation and management system
const ModerationSystem = {
  // Moderation tools for lecturers
  moderationTools: {
    postActions: {
      pin: true,
      unpin: true,
      lock: true,
      unlock: true,
      delete: true,
      edit: true,
      move: true // Move between categories
    },
    
    userActions: {
      warn: true,
      mute: true, // Temporary posting restrictions
      tempBan: true,
      viewHistory: true
    },
    
    bulkActions: {
      bulkDelete: true,
      bulkMove: true,
      bulkTag: true
    }
  },
  
  // Automated moderation
  autoModeration: {
    spamDetection: {
      enabled: true,
      duplicateContent: true,
      rapidPosting: true,
      suspiciousLinks: true
    },
    
    contentFiltering: {
      profanityFilter: true,
      flaggedWords: true,
      excessiveCapitals: true
    },
    
    userReputation: {
      calculateReputation: true,
      reputationThresholds: {
        newUser: 0,
        trustedUser: 100,
        moderatorCandidate: 500
      }
    }
  },
  
  // Reporting system
  reportingSystem: {
    reportReasons: [
      'Spam or irrelevant content',
      'Inappropriate language',
      'Off-topic discussion',
      'Harassment or bullying',
      'Copyright violation',
      'Other'
    ],
    
    reportWorkflow: {
      autoFlag: true, // Auto-flag after multiple reports
      notifyModerators: true,
      trackReporter: true,
      preventAbuse: true
    }
  },
  
  // Analytics and insights
  moderationAnalytics: {
    activityMetrics: {
      postsPerDay: true,
      repliesPerDay: true,
      activeUsers: true,
      reportCount: true
    },
    
    engagementMetrics: {
      averageReplies: true,
      viewToReplyRatio: true,
      userParticipation: true,
      topContributors: true
    },
    
    contentAnalytics: {
      popularTopics: true,
      trendingTags: true,
      unansweredQuestions: true,
      responseTime: true
    }
  }
};
```

### Notification and Engagement System
**Forum Notification Management:**
```javascript
// Comprehensive notification system for forums
const ForumNotificationSystem = {
  // Subscription management
  subscriptionTypes: {
    courseWide: {
      allPosts: 'Get notified of all new posts in the course',
      announcements: 'Get notified of announcements only',
      mentions: 'Get notified when someone mentions you'
    },
    
    postSpecific: {
      replies: 'Get notified of replies to your posts',
      followedPosts: 'Get notified of replies to posts you follow',
      reactions: 'Get notified when someone reacts to your posts'
    },
    
    categorySpecific: {
      newPosts: 'Get notified of new posts in specific categories',
      popularPosts: 'Get notified when posts become popular'
    }
  },
  
  // Notification delivery
  deliveryMethods: {
    inApp: {
      enabled: true,
      realTime: true,
      grouping: true, // Group similar notifications
      persistence: '7_days'
    },
    
    email: {
      enabled: true,
      frequency: 'daily_digest', // immediate, hourly, daily_digest
      unsubscribe: true,
      template: 'forum_notification'
    },
    
    browser: {
      enabled: false, // Disable for free tier simplicity
      permission: false
    }
  },
  
  // Engagement features
  engagementFeatures: {
    reactions: {
      types: ['like', 'helpful', 'thanks', 'confused'],
      quickReact: true,
      reactionCounts: true,
      emojiSupport: false // Keep simple for free tier
    },
    
    gamification: {
      forumXP: {
        newPost: 10,
        newReply: 5,
        receiveLike: 2,
        receiveHelpful: 5,
        postPinned: 20
      },
      
      badges: [
        { name: 'First Post', condition: 'first_post', xp: 25 },
        { name: 'Helpful Member', condition: '10_helpful_reactions', xp: 100 },
        { name: 'Discussion Starter', condition: '5_posts_created', xp: 75 },
        { name: 'Community Helper', condition: '20_replies_posted', xp: 150 }
      ]
    }
  }
};
```

### Mobile Forum Experience
**Touch-Optimized Forum Interface:**
- **Mobile-First Design**: Touch-friendly forum navigation and post creation
- **Swipe Gestures**: Swipe to react, bookmark, or access post options
- **Voice-to-Text**: Voice input for post creation and replies
- **Offline Reading**: Cache forum posts for offline reading
- **Progressive Loading**: Infinite scroll with smart loading

### Integration with Previous Systems
**Building on Complete LMS Foundation:**
```javascript
// Integration with existing systems
const ForumIntegration = {
  // Assignment integration (Epic 4)
  assignmentIntegration: {
    assignmentDiscussions: {
      autoCreateTopics: true, // Auto-create discussion topics for new assignments
      assignmentContext: true, // Show assignment details in discussions
      submissionHelp: true, // Help forums for assignment submissions
      gradeDiscussions: false // No grade discussions in free tier
    },
    
    linkToAssignments: {
      deepLinking: true,
      assignmentReferences: true,
      deadlineAlerts: true
    }
  },
  
  // Progress tracking integration (Epic 3)
  progressIntegration: {
    forumParticipation: {
      trackEngagement: true,
      updateXP: true,
      contributionMetrics: true,
      learningGoals: true
    },
    
    achievements: [
      'Active Participant',
      'Helpful Contributor',
      'Discussion Leader',
      'Problem Solver'
    ]
  },
  
  // Calendar integration (Story 3.2)
  calendarIntegration: {
    forumEvents: false, // Keep simple for free tier
    discussionDeadlines: false,
    studyGroupScheduling: false
  }
};
```

### Security and Content Safety
**Forum Security Measures:**
```javascript
// Security considerations for forum system
const ForumSecurity = {
  // Content security
  contentSecurity: {
    htmlSanitization: true,
    xssProtection: true,
    csrfProtection: true,
    sqlInjectionPrevention: true
  },
  
  // User permissions
  permissionSystem: {
    roleBasedAccess: true,
    courseEnrollmentCheck: true,
    postOwnership: true,
    moderatorPrivileges: true
  },
  
  // Content moderation
  contentModeration: {
    profanityFilter: true,
    spamDetection: true,
    reportingSystem: true,
    contentApproval: false // Auto-approve for free tier
  },
  
  // Data protection
  dataProtection: {
    personalDataAnonymization: true,
    rightToDelete: true,
    dataRetention: '2_years',
    auditLogging: true
  }
};
```

### Performance Optimizations
**Free Tier Performance Strategy:**
- **Efficient Queries**: Optimized database queries with proper indexing
- **Content Caching**: Cache frequently accessed forum content
- **Lazy Loading**: Load forum images and attachments on demand
- **Search Optimization**: Use PostgreSQL full-text search capabilities
- **Content Compression**: Compress forum attachments and images

### Testing Requirements
Forum system requires comprehensive testing:
- **Functionality Tests**: Post creation, editing, deletion, and moderation
- **Permission Tests**: Role-based access control and course enrollment
- **Search Tests**: Full-text search accuracy and performance
- **Content Tests**: Rich text editing, file attachments, and rendering
- **Mobile Tests**: Touch interface and responsive design

## Testing

### Testing Standards
Discussion forum system testing strategy:
- **Unit Tests**:
  - Content parsing and sanitization (`lib/contentParser.test.js`)
  - Search functionality and filtering (`lib/forumSearch.test.js`)
  - Notification system logic (`lib/forumNotifications.test.js`)
  - Moderation tools and permissions (`lib/moderation.test.js`)
- **Component Tests**:
  - Post creation and editing interface
  - Rich text editor with attachment support
  - Search and filtering components
  - Moderation dashboard functionality
- **Integration Tests**:
  - Complete forum workflow (`api/forum.test.js`)
  - XP integration with progress tracking
  - Assignment discussion integration
  - Notification delivery system
- **E2E Tests**:
  - Full forum participation user journey
  - Cross-browser forum functionality
  - Mobile forum interface testing
  - Moderation workflow testing
- **Performance Tests**:
  - Forum loading with large post counts
  - Search performance with extensive content
  - Mobile forum interface responsiveness
  - Concurrent user forum usage

Test file locations:
- `__tests__/forum/forumWorkflow.test.js`
- `__tests__/api/forumApi.test.js`
- `__tests__/e2e/forumSystem.test.js`
- `__tests__/components/forumComponents.test.js`
- `__tests__/utils/contentParsing.test.js`

## Change Log
| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-07-21 | 1.0 | Initial discussion forum story with comprehensive features | Scrum Master (Bob) |

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
