import localFont from "next/font/local";
import "./globals.css";
import { ToasterProvider } from "./(frontend)/providers/snackbar-context-provider";
import ReduxProvider from "./(frontend)/providers/redux-provider";
import AxiosInterceptorProvider from "./(frontend)/providers/axios-provider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("*******************************************************************");
  console.log("********************************server entry points**********************");
  console.log("*******************************************************************");
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ReduxProvider>
          <ToasterProvider />
          <AxiosInterceptorProvider>{children}</AxiosInterceptorProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
