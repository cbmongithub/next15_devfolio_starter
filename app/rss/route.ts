import { baseUrl } from "lib/config";
import { getPosts } from "lib/posts";
import type { MetadataWithSlug } from "types";


const GET = () => {
	const allBlogs = getPosts();

	const itemsXml = allBlogs
		.sort((a, b) => {
			if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
				return -1;
			}
			return 1;
		})
		.map(
			({ slug, metadata: { title, publishedAt, summary } }: MetadataWithSlug) =>
				`<item>
          <title>${title}</title>
          <link>${baseUrl}/blog/${slug}</link>
          <description>${summary || "Recent blog post by Christian B. Martinez"}</description>
          <pubDate>${new Date(publishedAt).toUTCString()}</pubDate>
        </item>`,
		)
		.join("\n");

	const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>Blog</title>
        <link>${baseUrl}</link>
        <description>Welcome to my blog RSS feed! I hope you find some value here.</description>
        ${itemsXml}
    </channel>
  </rss>`;

	return new Response(rssFeed, {
		headers: {
			"Content-Type": "text/xml",
		},
	});
}

export default GET;