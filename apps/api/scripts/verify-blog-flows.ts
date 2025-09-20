import { strict as assert } from "node:assert";
import { randomUUID } from "node:crypto";
import { ContentController } from "../src/modules/admin/content.controller";
import { PublicBlogController } from "../src/modules/catalog/public-blog.controller";

type BlogStatusType = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
type BlogCommentStatusType = "PENDING" | "APPROVED" | "REJECTED";

interface PostRecord {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  status: BlogStatusType;
  allowComments: boolean;
  featured: boolean;
  tags: string[];
  readingMinutes: number | null;
  authorId: string;
  categoryId: number | null;
  publishedAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CommentRecord {
  id: string;
  postId: string;
  authorId: string | null;
  authorName: string | null;
  authorEmail: string | null;
  content: string;
  status: BlogCommentStatusType;
  languageCode: string | null;
  toxicityScore: number | null;
  spamScore: number | null;
  autoFlagged: boolean;
  moderationTags: string[];
  analyzedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
}

interface CategoryRecord {
  id: number;
  name: string;
  slug: string;
}

function cloneDate(value: Date | null): Date | null {
  return value ? new Date(value.getTime()) : null;
}

class MockPrismaService {
  posts: PostRecord[] = [];
  comments: CommentRecord[] = [];
  users = new Map<string, UserRecord>();
  categories = new Map<number, CategoryRecord>();

  constructor() {
    this.users.set("admin-1", { id: "admin-1", name: "Admin User", email: "admin@example.com" });
    this.categories.set(1, { id: 1, name: "General", slug: "general" });
  }

  blogPost = {
    findFirst: async (args: any) => this.blogPostFindFirst(args),
    findUnique: async (args: any) => this.blogPostFindUnique(args),
    findMany: async (args: any = {}) => this.blogPostFindMany(args),
    create: async (args: any) => this.blogPostCreate(args),
    update: async (args: any) => this.blogPostUpdate(args),
    delete: async (args: any) => this.blogPostDelete(args)
  };

  blogComment = {
    deleteMany: async (args: any) => this.blogCommentDeleteMany(args),
    delete: async (args: any) => this.blogCommentDelete(args),
    findMany: async (args: any = {}) => this.blogCommentFindMany(args),
    create: async (args: any) => this.blogCommentCreate(args),
    update: async (args: any) => this.blogCommentUpdate(args)
  };

  blogCategory = {
    findMany: async () => Array.from(this.categories.values())
  };

  private blogPostFindFirst({ where, include }: any) {
    const post = this.posts.find((item) => this.matchesWhere(item, where));
    return post ? this.buildPost(post, include) : null;
  }

  private blogPostFindUnique({ where, include }: any) {
    const post = this.posts.find((item) => item.id === where?.id);
    return post ? this.buildPost(post, include) : null;
  }

  private blogPostFindMany({ where, include, orderBy, take, skip }: any) {
    const filtered = this.posts.filter((post) => this.matchesWhere(post, where));
    const ordered = this.orderPosts(filtered, orderBy);
    const start = typeof skip === "number" ? skip : Number(skip) || 0;
    const limit = take != null ? (typeof take === "number" ? take : Number(take)) : undefined;
    const slice = limit != null ? ordered.slice(start, start + limit) : ordered.slice(start);
    return slice.map((post) => this.buildPost(post, include));
  }

  private blogPostCreate({ data, include }: any) {
    const now = new Date();
    const record: PostRecord = {
      id: `post-${randomUUID()}`,
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt ?? null,
      content: data.content,
      coverImage: data.coverImage ?? null,
      status: (data.status ?? "DRAFT") as BlogStatusType,
      allowComments: data.allowComments ?? true,
      featured: data.featured ?? false,
      tags: Array.isArray(data.tags) ? [...data.tags] : [],
      readingMinutes: data.readingMinutes ?? null,
      authorId: data.authorId,
      categoryId: data.categoryId ?? null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      isDeleted: Boolean(data.isDeleted),
      createdAt: now,
      updatedAt: now
    };
    this.posts.push(record);
    return this.buildPost(record, include);
  }

  private blogPostUpdate({ where, data, include }: any) {
    const index = this.posts.findIndex((post) => post.id === where?.id);
    if (index === -1) throw new Error(`Post ${String(where?.id)} not found`);
    const existing = this.posts[index];
    const updated: PostRecord = { ...existing };
    Object.entries(data ?? {}).forEach(([key, value]) => {
      if (value === undefined) return;
      switch (key) {
        case "tags":
          updated.tags = Array.isArray(value) ? [...value] : [];
          break;
        case "publishedAt":
          updated.publishedAt = value ? new Date(value as Date | string) : null;
          break;
        case "categoryId":
          updated.categoryId = value == null ? null : Number(value);
          break;
        case "allowComments":
        case "featured":
          (updated as any)[key] = Boolean(value);
          break;
        default:
          (updated as any)[key] = value;
      }
    });
    updated.updatedAt = new Date();
    this.posts[index] = updated;
    return this.buildPost(updated, include);
  }

  private blogPostDelete({ where }: any) {
    const index = this.posts.findIndex((post) => post.id === where?.id);
    if (index === -1) return null;
    const [removed] = this.posts.splice(index, 1);
    this.comments = this.comments.filter((comment) => comment.postId !== removed.id);
    return removed;
  }

  private blogCommentDeleteMany({ where }: any) {
    const before = this.comments.length;
    this.comments = this.comments.filter((comment) => {
      if (where?.postId && comment.postId !== where.postId) return true;
      return false;
    });
    return { count: before - this.comments.length };
  }

  private blogCommentDelete({ where }: any) {
    const before = this.comments.length;
    this.comments = this.comments.filter((comment) => comment.id !== where?.id);
    return { count: before - this.comments.length };
  }

  private blogCommentFindMany({ where }: any) {
    return this.comments.filter((comment) => {
      if (where?.postId && comment.postId !== where.postId) return false;
      if (where?.status && comment.status !== where.status) return false;
      return true;
    });
  }

  private blogCommentCreate({ data }: any) {
    const record: CommentRecord = {
      id: `comment-${randomUUID()}` ,
      postId: data.postId,
      authorId: data.authorId ?? null,
      authorName: data.authorName ?? null,
      authorEmail: data.authorEmail ?? null,
      content: data.content,
      status: (data.status ?? "PENDING") as BlogCommentStatusType,
      languageCode: typeof data.languageCode === 'string' ? data.languageCode : null,
      toxicityScore: typeof data.toxicityScore === 'number' ? data.toxicityScore : null,
      spamScore: typeof data.spamScore === 'number' ? data.spamScore : null,
      autoFlagged: Boolean(data.autoFlagged),
      moderationTags: Array.isArray(data.moderationTags) ? [...data.moderationTags] : [],
      analyzedAt: data.analyzedAt ? new Date(data.analyzedAt as Date | string) : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.comments.push(record);
    return record;
  }

  private blogCommentUpdate({ where, data }: any) {
    const index = this.comments.findIndex((comment) => comment.id === where?.id);
    if (index === -1) throw new Error(`Comment ${String(where?.id)} not found`);
    const existing = this.comments[index];
    const updated: CommentRecord = { ...existing };

    Object.entries(data ?? {}).forEach(([key, value]) => {
      switch (key) {
        case 'moderationTags':
          updated.moderationTags = Array.isArray(value) ? [...value] : updated.moderationTags;
          break;
        case 'languageCode':
          updated.languageCode = typeof value === 'string' ? value : null;
          break;
        case 'toxicityScore':
        case 'spamScore':
          (updated as any)[key] = typeof value === 'number' ? value : null;
          break;
        case 'autoFlagged':
          updated.autoFlagged = Boolean(value);
          break;
        case 'analyzedAt':
          updated.analyzedAt = value ? new Date(value as Date | string) : null;
          break;
        case 'authorId':
        case 'authorName':
        case 'authorEmail':
        case 'content':
        case 'status':
          (updated as any)[key] = value ?? null;
          break;
        default:
          (updated as any)[key] = value;
      }
    });

    updated.updatedAt = new Date();
    this.comments[index] = updated;
    return updated;
  }

  private matchesWhere(post: PostRecord, where: any): boolean {
    if (!where) return true;
    if (where.id && post.id !== where.id) return false;
    if (where.slug && post.slug !== where.slug) return false;
    if (where.featured != null && post.featured !== where.featured) return false;
    if (where.categoryId != null && post.categoryId !== where.categoryId) return false;

    if (where.status) {
      if (typeof where.status === "string") {
        if (post.status !== where.status) return false;
      } else if (Array.isArray(where.status.in)) {
        if (!where.status.in.includes(post.status)) return false;
      }
    }

    if (where.category?.name?.equals) {
      const category = post.categoryId ? this.categories.get(post.categoryId) : null;
      const expected = String(where.category.name.equals).toLowerCase();
      if (!category || category.name.toLowerCase() !== expected) {
        return false;
      }
    }

    if (where.OR) {
      const matchesOr = (where.OR as any[]).some((condition) =>
        Object.entries(condition).some(([field, criteria]) => {
          if (criteria && typeof criteria === "object" && "contains" in criteria) {
            const haystack = String((post as any)[field] ?? "").toLowerCase();
            const needle = String(criteria.contains).toLowerCase();
            return haystack.includes(needle);
          }
          return false;
        })
      );
      if (!matchesOr) return false;
    }

    if (where.NOT) {
      const conditions = Array.isArray(where.NOT) ? where.NOT : [where.NOT];
      if (conditions.some((condition: any) => this.matchesWhere(post, condition))) {
        return false;
      }
    }

    return true;
  }

  private orderPosts(posts: PostRecord[], orderBy: any): PostRecord[] {
    if (!orderBy) return [...posts];
    const criteria = Array.isArray(orderBy) ? orderBy : [orderBy];
    return [...posts].sort((a, b) => {
      for (const criterion of criteria) {
        const [field, direction] = Object.entries(criterion)[0];
        const dir = direction === "desc" ? -1 : 1;
        const valueA = (a as any)[field];
        const valueB = (b as any)[field];

        const comparison = this.compareValues(valueA, valueB);
        if (comparison !== 0) {
          return comparison * dir;
        }
      }
      return 0;
    });
  }

  private compareValues(a: any, b: any): number {
    if (a instanceof Date || b instanceof Date) {
      const aTime = a ? new Date(a).getTime() : 0;
      const bTime = b ? new Date(b).getTime() : 0;
      if (aTime < bTime) return -1;
      if (aTime > bTime) return 1;
      return 0;
    }

    if (typeof a === "boolean" || typeof b === "boolean") {
      const aNum = a ? 1 : 0;
      const bNum = b ? 1 : 0;
      if (aNum < bNum) return -1;
      if (aNum > bNum) return 1;
      return 0;
    }

    if (typeof a === "number" || typeof b === "number") {
      const aNum = typeof a === "number" ? a : 0;
      const bNum = typeof b === "number" ? b : 0;
      if (aNum < bNum) return -1;
      if (aNum > bNum) return 1;
      return 0;
    }

    const aStr = String(a ?? "");
    const bStr = String(b ?? "");
    return aStr.localeCompare(bStr);
  }

  private buildPost(post: PostRecord, include: any) {
    const copy: any = {
      ...post,
      publishedAt: cloneDate(post.publishedAt),
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt)
    };

    if (include?.category) {
      copy.category = post.categoryId ? this.categories.get(post.categoryId) ?? null : null;
    }

    if (include?.author) {
      const user = this.users.get(post.authorId);
      copy.author = user ? { id: user.id, name: user.name, email: user.email } : null;
    }

    if (include?._count?.select?.comments) {
      copy._count = { comments: this.comments.filter((comment) => comment.postId === post.id).length };
    }

    if (include?.comments) {
      const raw = this.comments.filter((comment) => comment.postId === post.id);
      let filtered = raw;
      if (include.comments.where?.status) {
        filtered = filtered.filter((comment) => comment.status === include.comments.where.status);
      }
      if (include.comments.orderBy?.createdAt === "desc") {
        filtered = [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      } else if (include.comments.orderBy?.createdAt === "asc") {
        filtered = [...filtered].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      }
      if (include.comments.select?.id) {
        copy.comments = filtered.map((comment) => ({ id: comment.id }));
      } else if (include.comments.include?.author) {
        copy.comments = filtered.map((comment) => ({
          ...comment,
          author: comment.authorId ? this.users.get(comment.authorId) ?? null : null
        }));
      } else {
        copy.comments = filtered.map((comment) => ({ ...comment }));
      }
    }

    return copy;
  }
}

async function main() {
  const prisma = new MockPrismaService();
  const notifications = {
    notifyPostPublished: async () => {},
    notifyCommentApproved: async () => {},
    sendSubscriptionTest: async () => {}
  };
  const contentController = new ContentController(prisma as any, notifications as any);
  const publicController = new PublicBlogController(prisma as any);

  const adminReq = {
    user: { id: "admin-1", name: "Admin User", email: "admin@example.com" }
  };

  console.log("STEP 1: Create draft blog post");
  const draft = await contentController.createPost(adminReq as any, {
    title: "Automated Test Coverage",
    content: "This post explains the end-to-end verification workflow for QuickTechPro administrators to manage blog content effectively.",
    excerpt: "Testing flows summary",
    categoryId: 1,
    tags: ["testing", "quality"],
    allowComments: true
  } as any);

  assert.equal(draft.status, "DRAFT");
  assert.ok(draft.slug.includes("automated-test-coverage"));
  console.log(`  Draft created with slug: ${draft.slug}`);

  console.log("STEP 2: Publish the draft");
  const published = await contentController.postStatus(draft.id, { status: "PUBLISHED" } as any);
  assert.equal(published.status, "PUBLISHED");
  assert.ok(published.publishedAt, "Published post should have a publishedAt timestamp");
  const publishedAt = published.publishedAt ? new Date(published.publishedAt) : null;
  console.log(`  Post published at: ${publishedAt?.toISOString()}`);

  console.log("STEP 3: Confirm public blog shows published post");
  const publicListing = await publicController.list();
  assert.equal(publicListing.items.length, 1, "Expected the published post to appear in public listing");
  assert.equal(publicListing.items[0].slug, draft.slug);
  console.log("  Public blog listing includes the post.");

  console.log("STEP 4: Edit post metadata and content");
  const updated = await contentController.updatePost(draft.id, {
    title: "Automated Test Coverage Updated",
    excerpt: "Updated summary for verification",
    content: "Updated content describing manual QA steps, publication checks, and archival verification for QuickTechPro.",
    tags: ["testing", "qa"],
    featured: true
  } as any);
  assert.equal(updated.title, "Automated Test Coverage Updated");
  assert.equal(updated.status, "PUBLISHED");
  assert.ok(updated.featured);
  assert.ok(updated.publishedAt);
  console.log(`  Post updated. New slug: ${updated.slug}`);

  console.log("STEP 5: Archive the post and verify removal from public blog");
  const archived = await contentController.postStatus(draft.id, { status: "ARCHIVED" } as any);
  assert.equal(archived.status, "ARCHIVED");
  const publicAfterArchive = await publicController.list();
  assert.equal(publicAfterArchive.items.length, 0, "Archived post should not be in public listing");
  console.log("  Archived post is no longer visible publicly.");

  console.log("STEP 6: Restore to draft to complete workflow");
  const restored = await contentController.postStatus(draft.id, { status: "DRAFT" } as any);
  assert.equal(restored.status, "DRAFT");
  console.log("  Post restored to draft successfully.");

  console.log("All blog workflow checks passed.");
}

main().catch((error) => {
  console.error("Blog workflow verification failed:", error);
  process.exit(1);
});
