const fs = require('fs');
const path = 'apps/api/prisma/schema.prisma';
let src = fs.readFileSync(path, 'utf8');
if (!src.includes('parentId') || !src.includes('BlogCommentReplies')) {
  src = src.replace(/model BlogComment \{[\s\S]*?\}\s+model BlogPostMetric/, `model BlogComment {\n  id             String             @id @default(cuid())\n  postId         String\n  authorId       String?\n  authorName     String?\n  authorEmail    String?\n  content        String\n  status         BlogCommentStatus @default(PENDING)\n  languageCode   String?\n  toxicityScore  Float?\n  spamScore      Float?\n  autoFlagged    Boolean           @default(false)\n  moderationTags String[]          @default([])\n  analyzedAt     DateTime?\n  parentId       String?\n  createdAt      DateTime          @default(now())\n  updatedAt      DateTime          @updatedAt\n  post           BlogPost          @relation(fields: [postId], references: [id], onDelete: Cascade)\n  author         User?             @relation(fields: [authorId], references: [id])\n  parent         BlogComment?      @relation("BlogCommentReplies", fields: [parentId], references: [id])\n  replies        BlogComment[]     @relation("BlogCommentReplies")\n\n  @@index([postId])\n  @@index([parentId])\n}\n\nmodel BlogPostMetric`);
  fs.writeFileSync(path, src);
}
