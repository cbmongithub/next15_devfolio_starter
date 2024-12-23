"use client";

import { useEffect, useState } from "react";

import { fd } from "lib/helpers";

import { Spotlight } from "components/spotlight";
import { Card } from "ui/card";
import type { RepoProps } from "types";

export function Repos() {
    const [repos, setRepos] = useState<RepoProps>();

    useEffect(() => {
        async function fetchRepos() {
            const response = await fetch(
                "https://api.github.com/search/repositories?q=user:cbmongithub&sort=updated&per_page=6",
                { next: { revalidate: 43200 } }, // 12 hours
            );
            const data = await response.json();
            setRepos(data.items);
        }
        fetchRepos();
    }, []);

    if (!repos) {
        return null;
    }

    return (
        <>
            {repos.map((repo) => (
                <Spotlight key={repo.id}>
                    <Card
                        center={true}
                        key={repo.id}
                        title={repo.full_name || ""}
                        contentUrl={repo.html_url || ""}
                        description={repo.description || ""}
                        content="repo"
                        date={fd(repo.pushed_at || "")}
                    />
                </Spotlight>
            ))}
        </>
    );
}