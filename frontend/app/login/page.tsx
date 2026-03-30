import { SignIn } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <div className="flex h-full w-full justify-center items-center">
      <SignIn routing="hash" signUpUrl="/sign-up" />
    </div>
  );
};

export default LoginPage;
