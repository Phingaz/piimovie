import { NextRequest } from "next/server";
import { errorHandler, successHandler } from "../resHandler";
import { getMoviesRq } from "@/lib/qry.server";

export async function POST(req: NextRequest) {
  try {
    const { type, page } = await req.json();
    const data = await getMoviesRq(type, page);

    return successHandler({
      message: "Success fetching home page info",
      req,
      data,
    });
  } catch (error: any) {
    return errorHandler({ error, req });
  }
}
