from pathlib import Path

path = Path(r"apps/api/src/modules/admin/content.controller.ts")
text = path.read_text()

original_body = "      categoryId?: number | null;\r\n      publishedAt?: string | null;\r\n      aiSummary?: string | null;\r\n      translations?: Array<{ language: string; title: string; excerpt?: string | null; content: string; aiSummary?: string | null }>;\r\n"
replacement_body = "      categoryId?: number | null;\r\n      publishedAt?: string | null;\r\n      aiSummary?: string | null;\r\n      authorId?: string | null;\r\n      translations?: Array<{ language: string; title: string; excerpt?: string | null; content: string; aiSummary?: string | null }>;\r\n"

if original_body not in text:
    raise SystemExit('Original body block not found')

text = text.replace(original_body, replacement_body, 1)

old_author = "    const authorId = req?.user?.id ?? req?.user?.sub;\r\n    if (!authorId) throw new BadRequestException('Missing author context for blog post');\r\n\r\n"

if old_author not in text:
    raise SystemExit('Original author block missing')

new_author = "    const requestAuthor = req?.user?.id ?? req?.user?.sub;\r\n    const payloadAuthor = body?.authorId != null ? String(body.authorId).trim() : '';\r\n    const authorId = requestAuthor ?? (payloadAuthor ? payloadAuthor : null);\r\n    if (!authorId) throw new BadRequestException('Missing author context for blog post');\r\n\r\n"

text = text.replace(old_author, new_author, 1)

path.write_text(text)
