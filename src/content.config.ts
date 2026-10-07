// Content collections. The blog reads src/content/blog, where the Google Drive sync
// (scripts/blog-sync.js) writes posts.
//
// The loader parses frontmatter with the same line parser the rest of the site uses
// (src/lib/frontmatter.js) rather than Astro's YAML glob loader: the sync writes values
// like "\[Title\]" that YAML rejects, and files with no frontmatter are working notes to
// skip. The schema still checks every post at build time, so a bad field fails the
// build with a message naming the post, and the live site keeps its last good deploy.
import { defineCollection } from 'astro:content'
import { z } from 'astro/zod'
import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { parseFrontmatter, slugFromPath, readingMinutes, splitTags } from './lib/frontmatter.js'

const BLOG_DIR = fileURLToPath(new URL('./content/blog/', import.meta.url))

const blog = defineCollection({
  loader: async () => {
    const files = (await readdir(BLOG_DIR)).filter((file) => file.endsWith('.md'))
    const entries = []
    for (const file of files) {
      const parsed = parseFrontmatter(await readFile(BLOG_DIR + file, 'utf8'))
      if (!parsed || !parsed.data.title) continue
      const { data, content } = parsed
      entries.push({
        ...data,
        id: data.slug || slugFromPath(file),
        file,
        tags: splitTags(data.tags),
        readingMinutes: readingMinutes(content),
        content,
      })
    }
    return entries
  },
  schema: z.object({
    file: z.string(),
    title: z.string().min(1),
    subtitle: z.string().default(''),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')
      .or(z.literal(''))
      .default(''),
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug must be lowercase words joined by hyphens')
      .optional(),
    excerpt: z.string().default(''),
    author: z.string().default(''),
    cover: z.string().default(''),
    category: z.string().default(''),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    readingMinutes: z.number(),
    content: z.string(),
  }),
})

export const collections = { blog }
