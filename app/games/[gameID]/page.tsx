import styles from "../../page.module.css";
import Link from "next/link";
import { getXataClient } from "../../../util/xata";
// import { getConsoleName } from "../../../util/categories";

const xata = getXataClient();

export default async function Page({ params }: { params: { id: string } }) {
  const prompt = await xata.db.prompts.read(params.id);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <Link
          href="/"
          className={styles.link}
          style={{
            alignSelf: "flex-start",
            paddingLeft: "2rem",
            paddingBottom: "0.5em",
          }}
        >
          &lt;&lt; Back to Search
        </Link>
        {!prompt ? (
          <h1 className={styles.title}>
            Oops! Game "{params.id}" not found
          </h1>
        ) : (
          <>
            <h1 className={styles.title}>{prompt.prompt}</h1>
            <div
              className={styles.container}
              style={{ display: "block", marginTop: "1em" }}
            >
              <div style={{ display: "flex", gap: "1.2rem" }}>
                {prompt.img_url && (
                  <p>
                    <img src={prompt.img_url} />
                  </p>
                )}
                {/* {prompt.summary && (
                  <p style={{ fontSize: "1.2rem" }}>{prompt.summary}</p>
                )} */}
              </div>
              {/* {prompt.firstReleaseDate && (
                <p>
                  Released: {new Date(prompt.firstReleaseDate).toDateString()}
                </p>
              )} */}
              {/* {prompt.category && <p>Category: {getConsoleName(prompt.category)}</p>} */}
              {/* {prompt.genres && <p>Category: {prompt.genres.join(", ")}</p>} */}
              {prompt.img_url && (
                <a className={styles.link} href={prompt.img_url}>
                  View on IGDB &gt;&gt;
                </a>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
