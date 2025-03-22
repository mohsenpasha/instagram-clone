import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken"; // نصب کن: npm install jsonwebtoken

const SECRET_KEY = "your_secret_key"; // کلید JWT بک‌اند

export function middleware(req: NextRequest) {
//   console.log("Middleware is running on path:", req.nextUrl.pathname);

//   // خواندن توکن از کوکی‌ها
//   const accessToken = req.cookies.get("access_token")?.value;

//   if (!accessToken) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     // دیکد کردن توکن
//     const decoded = jwt.verify(accessToken, SECRET_KEY);
//     console.log("User is authenticated:", decoded);
//     return NextResponse.next();
//   } catch (error) {
//     console.log("Invalid or expired token:", error);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
}

// اجرای میدلور در همه صفحات
export const config = { matcher: "/:path*" };