import { Code } from "bright";
import { MDXRemote, type MDXRemoteProps } from "next-mdx-remote/rsc";
import Image from "next/image";
import { createElement } from "react";

import { slugify } from "@/_lib/helpers";

function customTable({
	data,
}: { data: { headers: string[]; rows: string[][] } }) {
	const headers = data.headers.map((header, i) => (
		<th key={`th-${i + 1}`}>{header}</th>
	));
	const rows = data.rows.map((row, i) => (
		<tr key={`tr-${i + 1}`}>
			{row.map((cell, i) => (
				<td key={`cell-${i + 1}`}>{cell}</td>
			))}
		</tr>
	));

	return (
		<table>
			<thead>
				<tr>{headers}</tr>
			</thead>
			<tbody>{rows}</tbody>
		</table>
	);
}

function createHeading(level: number) {
	const Heading = ({ children }: { children: string }) => {
		const slug = slugify(children);
		return createElement(
			`h${level}`,
			{ id: slug },
			[
				createElement("a", {
					href: `#${slug}`,
					key: `link-${slug}`,
					className: "anchor",
				}),
			],
			children,
		);
	};

	Heading.displayName = `Heading${level}`;

	return Heading;
}

function customImage({ ...props }: React.ComponentProps<typeof Image>) {
	return <Image className="blur-md rounded-2xl" {...props} />;
}

const components = {
	h1: createHeading(1),
	h2: createHeading(2),
	h3: createHeading(3),
	h4: createHeading(4),
	h5: createHeading(5),
	h6: createHeading(6),
	img: customImage,
	pre: Code,
	table: customTable,
};

export function Mdx(
	props: MDXRemoteProps & {
		components?: React.ComponentProps<React.ElementType>;
	},
) {
	return (
		<MDXRemote
			{...props}
			components={{ ...components, ...(props.components || {}) }}
		/>
	);
}
