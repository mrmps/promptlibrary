import type { NextApiRequest, NextApiResponse } from "next";
import { getXataClient } from "../../util/xata";

const xata = getXataClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { records } = await xata.db.prompts
    // .sort("totalRating", "desc")
    .getPaginated();

  res.status(200).json(records);
}
