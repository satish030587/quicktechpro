from pathlib import Path

path = Path(r"apps/api/src/modules/admin/content.controller.ts")
text = path.read_text()

old_segment = "      readingMinutes?: number;\n      categoryId?: number | null;\n      publishedAt?: string | null;\n      aiSummary?: string | null;\n      translations?: Array<{ language: string; title: string; excerpt?: string | null; content: string; aiSummary?: string | null }>;\n"

if old_segment not in text:
    old_segment = old_segment.replace('\n', '\r\n')

if old_segment not in text:
    raise SystemExit('Body segment still not matched')

new_segment = old_segment.replace("      aiSummary?: string | null;\n", "      aiSummary?: string | null;\n      authorId?: string | null;\n")

text = text.replace(old_segment, new_segment, 1)

old_author = "    const authorId = req?.user?.id ?? req?.user?.sub;\n    if (!authorId) throw new BadRequestException('Missing author context for blog post');\n\n"
if old_author not in text:
    old_author = old_author.replace('\n', '\r\n')

if old_author not in text:
    raise SystemExit('Author block not located')

new_author = old_author.replace(
    "const authorId = req?.user?.id ?? req?.user?.sub;",
    "const requestAuthor = req?.user?.id ?? req?.user?.sub;\n    const payloadAuthor = body?.authorId != null ? String(body.authorId).trim() : '';\n    const authorId = requestAuthor ?? (payloadAuthor ? payloadAuthor : null);"
)

text = text.replace(old_author, new_author, 1)

path.write_text(text)
