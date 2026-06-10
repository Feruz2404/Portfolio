-- Initial schema generated from prisma/schema.prisma

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'EDITOR', 'MANAGER', 'VIEWER');
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_1K', 'FROM_1K_5K', 'FROM_5K_20K', 'FROM_20K_100K', 'OVER_100K');
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "ContactStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT,
  "email" TEXT NOT NULL,
  "emailVerified" TIMESTAMP(3),
  "image" TEXT,
  "hashedPassword" TEXT,
  "role" "Role" NOT NULL DEFAULT 'VIEWER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

CREATE TABLE "Account" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  "refresh_token" TEXT,
  "access_token" TEXT,
  "expires_at" INTEGER,
  "token_type" TEXT,
  "scope" TEXT,
  "id_token" TEXT,
  "session_state" TEXT,

  CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "sessionToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

CREATE TABLE "Project" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "challenge" TEXT,
  "solution" TEXT,
  "architecture" TEXT,
  "results" TEXT,
  "category" TEXT NOT NULL,
  "industry" TEXT,
  "technologies" TEXT[] NOT NULL,
  "screenshots" TEXT[] NOT NULL,
  "videoUrl" TEXT,
  "liveUrl" TEXT,
  "githubUrl" TEXT,
  "clientName" TEXT,
  "clientLogo" TEXT,
  "budgetRange" "BudgetRange",
  "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "views" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
CREATE INDEX "Project_featured_idx" ON "Project"("featured");
CREATE INDEX "Project_status_idx" ON "Project"("status");

CREATE TABLE "TeamMember" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "position" TEXT NOT NULL,
  "avatar" TEXT,
  "bio" TEXT,
  "skills" TEXT[] NOT NULL,
  "githubUrl" TEXT,
  "linkedinUrl" TEXT,
  "telegramUrl" TEXT,
  "portfolioUrl" TEXT,
  "yearsOfExp" INTEGER,
  "certifications" TEXT[] NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "TeamMember_slug_key" ON "TeamMember"("slug");

CREATE TABLE "ProjectTeamMember" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "memberId" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ProjectTeamMember_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ProjectTeamMember_projectId_memberId_key" ON "ProjectTeamMember"("projectId", "memberId");

CREATE TABLE "Achievement" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "date" TIMESTAMP(3) NOT NULL,
  "memberId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "BlogCategory" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,

  CONSTRAINT "BlogCategory_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BlogCategory_name_key" ON "BlogCategory"("name");
CREATE UNIQUE INDEX "BlogCategory_slug_key" ON "BlogCategory"("slug");

CREATE TABLE "BlogPost" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "excerpt" TEXT,
  "content" TEXT NOT NULL,
  "coverImage" TEXT,
  "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMP(3),
  "views" INTEGER NOT NULL DEFAULT 0,
  "readingTime" INTEGER,
  "authorId" TEXT NOT NULL,
  "categoryId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");
CREATE INDEX "BlogPost_status_idx" ON "BlogPost"("status");
CREATE INDEX "BlogPost_publishedAt_idx" ON "BlogPost"("publishedAt");

CREATE TABLE "Tag" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,

  CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

CREATE TABLE "ProjectTag" (
  "projectId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,

  CONSTRAINT "ProjectTag_pkey" PRIMARY KEY ("projectId", "tagId")
);

CREATE TABLE "PostTag" (
  "postId" TEXT NOT NULL,
  "tagId" TEXT NOT NULL,

  CONSTRAINT "PostTag_pkey" PRIMARY KEY ("postId", "tagId")
);

CREATE TABLE "Testimonial" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "position" TEXT,
  "company" TEXT,
  "avatar" TEXT,
  "content" TEXT NOT NULL,
  "rating" INTEGER NOT NULL DEFAULT 5,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "approved" BOOLEAN NOT NULL DEFAULT false,
  "projectId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CaseStudy" (
  "id" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "heroImage" TEXT,
  "overview" TEXT NOT NULL,
  "challenge" TEXT NOT NULL,
  "process" TEXT NOT NULL,
  "solution" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "metrics" JSONB,
  "timeline" JSONB,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CaseStudy_projectId_key" ON "CaseStudy"("projectId");

CREATE TABLE "Contact" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "company" TEXT,
  "phone" TEXT,
  "message" TEXT NOT NULL,
  "budget" TEXT,
  "projectType" TEXT,
  "status" "ContactStatus" NOT NULL DEFAULT 'NEW',
  "source" TEXT,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "managerId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Contact_status_idx" ON "Contact"("status");

CREATE TABLE "ContactNote" (
  "id" TEXT NOT NULL,
  "contactId" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ContactNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EmailRecord" (
  "id" TEXT NOT NULL,
  "contactId" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "EmailRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Service" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "icon" TEXT,
  "features" TEXT[] NOT NULL,
  "priceFrom" INTEGER,
  "priceTo" INTEGER,
  "currency" TEXT NOT NULL DEFAULT 'USD',
  "duration" TEXT,
  "featured" BOOLEAN NOT NULL DEFAULT false,
  "order" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

CREATE TABLE "PageView" (
  "id" TEXT NOT NULL,
  "path" TEXT NOT NULL,
  "referrer" TEXT,
  "country" TEXT,
  "device" TEXT,
  "browser" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PageView_path_idx" ON "PageView"("path");
CREATE INDEX "PageView_createdAt_idx" ON "PageView"("createdAt");

CREATE TABLE "AnalyticsEvent" (
  "id" TEXT NOT NULL,
  "event" TEXT NOT NULL,
  "properties" JSONB,
  "sessionId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AnalyticsEvent_event_idx" ON "AnalyticsEvent"("event");
CREATE INDEX "AnalyticsEvent_createdAt_idx" ON "AnalyticsEvent"("createdAt");

CREATE TABLE "SeoMeta" (
  "id" TEXT NOT NULL,
  "title" TEXT,
  "description" TEXT,
  "keywords" TEXT[] NOT NULL,
  "ogImage" TEXT,
  "ogTitle" TEXT,
  "ogDescription" TEXT,
  "twitterCard" TEXT,
  "canonical" TEXT,
  "projectId" TEXT,
  "blogPostId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SeoMeta_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "SeoMeta_projectId_key" ON "SeoMeta"("projectId");
CREATE UNIQUE INDEX "SeoMeta_blogPostId_key" ON "SeoMeta"("blogPostId");

CREATE TABLE "Newsletter" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "confirmed" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

CREATE TABLE "Media" (
  "id" TEXT NOT NULL,
  "filename" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "alt" TEXT,
  "caption" TEXT,
  "folder" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entity" TEXT NOT NULL,
  "entityId" TEXT,
  "changes" JSONB,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog"("entity");
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectTeamMember" ADD CONSTRAINT "ProjectTeamMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "BlogCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectTag" ADD CONSTRAINT "ProjectTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_postId_fkey" FOREIGN KEY ("postId") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PostTag" ADD CONSTRAINT "PostTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "CaseStudy" ADD CONSTRAINT "CaseStudy_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ContactNote" ADD CONSTRAINT "ContactNote_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmailRecord" ADD CONSTRAINT "EmailRecord_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SeoMeta" ADD CONSTRAINT "SeoMeta_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SeoMeta" ADD CONSTRAINT "SeoMeta_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
