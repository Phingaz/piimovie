import { NextRequest, NextResponse } from "next/server";

// import { sanitizeErrorStack } from './lib';

const errorHandler = ({ error, req }: { error: Error; req: NextRequest }) => {
  console.error(
    `Error from ${req.method} method at ${req.url}: ${error.message}`
    // {
    // stack: sanitizeErrorStack(error.stack ?? ''),
    // }
  );

  return new Response(error.message, { status: 500 });
};

const successHandler = ({
  message,
  req,
  data,
}: {
  message: string;
  req: NextRequest;
  data?: any;
}) => {
  console.info(`Success from ${req.method} method at ${req.url}: ${message}`);

  return NextResponse.json({
    success: true,
    status: 200,
    message,
    ...data,
  });
};

export { errorHandler, successHandler };
