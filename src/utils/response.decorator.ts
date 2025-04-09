import { NextResponse } from "next/server";
interface IError {
  message?: string;
}

export const successResponse = <T>(
  response: T | null,
  client_message?: string | null,
  status = 200
) => {
  const message: Record<string, any> = {
    data: response,
    status: true,
    error: null,
  };

  if (typeof client_message === "string" && client_message.trim().length > 0) {
    message.message = client_message;
  }

  return NextResponse.json(message, { status });
};

export const errorResponse = (error: IError | string, status = 500) => {
  const message = {
    data: null,
    status: false,
    error: typeof error === "string" ? error : error.message,
  };
  console.error("-----------------Error log Start---------------------------");
  console.log("TIMESTAMP: " + new Date().toISOString());
  console.error("ERROR:");
  console.error(error);
  console.error("-----------------Error log End-----------------------------");
  return Response.json(message, { status });
};
