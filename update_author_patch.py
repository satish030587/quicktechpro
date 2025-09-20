from pathlib import Path

path = Path(r"apps/api/src/modules/admin/content.controller.ts")
text = path.read_text()

body_signature = "      categoryId?: number | null;\r\n      publishedAt?: string | null;\r\n      aiSummary?: string | null;\r\n      translations?: Array<{ language: string; title: string; excerpt?: string | null; content: string; aiSummary?: string | null }>;\r\n    }\r\n  ) {\r\n"

replacement_signature = "      categoryId?: number | null;\r\n      publishedAt?: string | null;\r\n      aiSummary?: string | null;\r\n      authorId?: string;\r\n      translations?: Array<{ language: string; title: string; excerpt?: string | null; content: string; aiSummary?: string | null }>;;\r\n    }\r\n  ) {\r\n"

if body_signature not in text:
    raise SystemExit('Could not find createPost body signature block')

text = text.replace(body_signature, replacement_signature)

author_block_old = "    const authorId = req?.user?.id ?? req?.user?.sub;\r\n    if (!authorId) throw new BadRequestException('Missing author context for blog post');\r\n\r\n"

if author_block_old not in text:
    raise SystemExit('Author block not found')

author_block_new = "    const requestAuthor = req?.user?.id ?? req?.user?.sub;\r\n    const payloadAuthor = body?.authorId != null ? String(body.authorId).trim() : '';\r\n    const authorId = requestAuthor ?? (payloadAuthor ? payloadAuthor : null);\r\n    if (!authorId) throw new BadRequestException('Missing author context for blog post');\r\n\r\n"

text = text.replace(author_block_old, author_block_new)

path.write_text(text)
