import SignInForm from "@/lib/auth/components/sign-in-form";

export const metadata = {
  title: "Sign In",
  description: "Page de connexion",
};

export default function SignInPage() {
  return (
    <>
      <SignInForm />
    </>
  );
}
