import { NextRequest } from "next/server";
import { errorHandler, successHandler } from "../../resHandler";
import { searchMovieRq } from "@/lib/qry.server";

export async function POST(req: NextRequest) {
  try {
    const { query, page } = await req.json();
    const data = await searchMovieRq(query, page);

    return successHandler({
      message: "Success fetching home page info",
      req,
      data,
    });
  } catch (error: any) {
    return errorHandler({ error, req });
  }
}
