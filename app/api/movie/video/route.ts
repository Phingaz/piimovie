import { NextRequest } from "next/server";
import { errorHandler, successHandler } from "../../resHandler";
import { getVideoRq } from "@/lib/qry.server";

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    const data = await getVideoRq(id);

    return successHandler({
      message: "Success fetching home page info",
      req,
      data,
    });
  } catch (error: any) {
    return errorHandler({ error, req });
  }
}
