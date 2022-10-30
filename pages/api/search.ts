import type { NextApiRequest, NextApiResponse } from 'next'
import { getXataClient } from "../../src/xata";

const xata = getXataClient();


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  let {term, console} = req.query;
  if (Array.isArray(term)) {
    term = term.join(" ");
  }  
  
  const records = await xata.search.all(term, {
    tables: [console && console.length 
      ? { 
          table: "games" ,
          filter: { console: { $any: Array.isArray(console)? console: [console] } }
        }
      : { table: "games"}],
    fuzziness: 0,
    prefix: "phrase",
  });


  res.status(200).json(records)
}