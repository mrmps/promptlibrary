"use client";

import Image from "next/image";
import styles from "../app/page.module.css";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import debounce from "lodash.debounce";
import { CATEGORIES } from "../util/categories";
import type { Prompts } from "../util/xata";

const searchPrompts = async (
  term: string,
  categories: boolean[],
  callback: ({ prompts, elapsed }: { prompts: Prompts[]; elapsed: number }) => void
) => {
  let url = `/api/search?term=${term}`;
  if (categories && categories.length)
    url += CATEGORIES.filter((c, i) => categories[i])
      .map((c) => `&console=${c}`)
      .join("");

  const response = await fetch(url);

  const { prompts, elapsed } = await response.json();
  return callback({ prompts, elapsed });
};

const debouncedSearch = debounce(searchPrompts, 500);

export default function Search() {
  const [searched, setSearched] = useState("");
  const [prompts, setPrompts] = useState<Prompts[]>([]);
  const [categories, setCategories] = useState(CATEGORIES.map((c) => false));
  const [isSearching, setIsSearching] = useState(false);
  const [searchMs, setSearchMs] = useState(0);

  useEffect(() => {
    if (searched) {
      setIsSearching(true);
      debouncedSearch(searched, categories, ({ prompts, elapsed }) => {
        setPrompts(prompts);
        setSearchMs(elapsed);
        setIsSearching(false);
      });
    }
  }, [searched, categories]);

  function toggleCategory(i: number) {
    setCategories(categories.map((v, ci) => (ci === i ? !v : v)));
  }

  return (
    <div
      className={styles.container}
      style={{ display: "flex", justifyContent: "center", width: "80%" }}
    >
      <aside id="sidebar" style={{ paddingTop: "2rem" }}>
        <input
          type="search"
          value={searched}
          placeholder="title, genre, keyword..."
          onChange={(e) => setSearched(e.target.value)}
          style={{ fontSize: "1.2rem" }}
        />
        <div id="filters">
          <Checkboxes
            title="Console"
            options={CATEGORIES.map((c) => c)}
            onChange={toggleCategory}
          />
        </div>

        {isSearching ? (
          <p>Searching...</p>
        ) : prompts && searchMs ? (
          <p>
            Found {prompts.length} prompts in {searchMs}ms
          </p>
        ) : null}
      </aside>

      <div style={{ width: "70%" }}>
        {prompts.map(({ id, prompt, category }) => (
          <Link
            key={id}
            href={`/prompts/${id}`}
            className={styles.card}
            style={{ display: "block" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "1em",
              }}
            >
              <div>
                <h2>{prompt}</h2>
                {/* <p>{console && getConsoleName(console)}</p> */}
                <p>
                  {category }
                  {/* // &&
                    // categories.length &&
                    // categories.map((g) => JSON.parse(g)).join(", ")} */}
                </p>
              </div>
              {/* <p>{cover && <img src={cover} />}</p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function Checkboxes({
  title,
  onChange,
  options,
}: {
  title: string;
  onChange: (i: number) => void;
  options: string[];
}) {
  return (
    <label
      style={{
        display: "block",
        marginTop: "1em",
      }}
    >
      <h4 style={{ marginBottom: 0 }}>{title}</h4>
      <form style={{ display: "flex", flexDirection: "column" }}>
        {options.map((value, i) => (
          <div key={value}>
            <input
              type="checkbox"
              id={value}
              name="checkbox"
              value={value}
              // defaultChecked
              onChange={() => onChange(i)}
            />
            <label htmlFor={value}>{value}</label>
          </div>
        ))}
      </form>
    </label>
  );
}
