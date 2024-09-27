import SignInForm from "@/components/forms/sign-in";
import { GoogleAuthButton } from "@/components/global/google-oauth-button";
import Link from "next/link";

const SignInPage = () => {
  return (
    <>
      <h5 className="font-bold text-base text-themeTextWhite">Login</h5>
      <p className="text-themeTextGray leading-tight">
        As an instructor, you have the opportunity to share your expertise in C
        programming by creating comprehensive courses, interactive video
        modules, and engaging coding games.
      </p>
      <SignInForm />
      <div className="flex items-center my-5 gap-4 justify-center">
        <div className="flex-1 border-t border-gray-700"></div>
        <span className="text-sm">Or continue with</span>
        <div className="flex-1 border-t border-gray-700"></div>
      </div>
      <GoogleAuthButton method="signin" />
      <p className="text-center mt-2">Don&apos;t have an account? <Link href="/sign-up" className="font-bold">Sign Up</Link></p>
    </>
  );
};

export default SignInPage;
