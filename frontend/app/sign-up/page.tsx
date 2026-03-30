import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex h-full w-full justify-center items-center">
      <SignUp routing="hash" signInUrl="/login" />
    </div>
  );
};

export default SignUpPage;
