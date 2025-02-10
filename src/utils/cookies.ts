"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export const getCookies = async () => {
  const cookieStore = await cookies().getAll();

  if (cookieStore.length) {
    const cookies: { [key: string]: string } = {};
    cookieStore?.map((ckie) => (cookies[ckie.name] = ckie.value));
    return cookies;
  } else return null;
};

export async function setCookie(
  name: string,
  tokens: { accessToken: string; refreshToken: string; user: any },
  response: NextResponse
) {
  // Default options for the cookie
  const defaultOptions = {
    httpOnly: true,
    sameSite: "lax" as const, // Lax to balance security and usability
    maxAge: 60 * 60 * 24 * 7, // 1 week
  };

  // Set the cookie using Next.js' ResponseCookies API
  response?.cookies?.set(
    `${name}_accessToken`,
    tokens.accessToken,
    defaultOptions
  );
  response?.cookies?.set(
    `${name}_refreshToken`,
    tokens.refreshToken,
    defaultOptions
  );
  response?.cookies?.set(`user`, JSON.stringify(tokens.user), defaultOptions);

  return response;
}

export const deleteCookies = async (redirectURL?: string) => {
  const cookieStore = cookies();
  cookieStore.delete("session_accessToken");
  cookieStore.delete("session_refreshToken");
  cookieStore.delete("user");
  if (redirectURL) {
    redirect(redirectURL);
  }
};

export async function deleteCookiesFromServerSide(
  name: string,
  response: NextResponse
) {
  response.cookies.set(name, "", {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0), // Expired date to delete the cookie
  });
}
