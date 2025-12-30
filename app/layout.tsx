
import { ToastContainer } from "react-toastify";
import "./globals.css";


export const metadata = {
  title: "Admin Dashboard",
};

export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (
    
    <html lang="en">
      <body className="bg-black text-white">
      <ToastContainer/>
        {children}
        
        </body>
    </html>
  );
}


