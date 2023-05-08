import { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "../../util/xata";

const xata = getXataClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { term, category } = req.query;
  
  // Handle the case where the term is not provided
  if (!term) {
    return res.status(400).json({ error: "Search term is required" });
  }

  // If term is an array, join its elements with a space
  if (Array.isArray(term)) {
    term = term.join(" ");
  }

  const start = Date.now();
  const games = await xata.db.prompts.search(term as string, {
    // filter:
    //   category && category.length
    //     ? {category: { $any: Array.isArray(category) ? category : [category] } }
    //     : undefined,
    fuzziness: 0,
    prefix: "phrase",
    // boosters: [{ numericBooster: { column: "upvotes", factor: 2 } }],
  });
  const elapsed = Date.now() - start;

  res.status(200).json({ games, elapsed });
}
