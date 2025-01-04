import Image from "next/image";
import { Button } from "../ui/button";
import SignupFormDialog from "../auth/SignupFormDialog";
import LoginFormDialog from "../auth/LoginFormDialog";

export default function LandingLeft() {
  return (
    <div className="flex flex-col items-start justify-start">
      <div className="flex items-center mb-20">
        <LoginFormDialog />
        <SignupFormDialog />
        <Button variant="link" className="ml-8">
          Find Group
        </Button>
      </div>
      <Image
        src="/home.png"
        alt="Landing"
        width={500}
        height={500}
        className="z-10"
      />

      <h1 className="text-4xl md:text-6xl text-muted-foreground font-bold font-title -translate-y-4 drop-shadow-xl">
        Hey There! Welcome To
      </h1>
      <h1 className="text-4xl md:text-6xl text-gray-700 dark:text-gray-500 font-bold font-title -translate-y-4 drop-shadow-xl">
        Thesis Jatra
      </h1>
      {/* <p className="text-2xl font-default font-semibold text-muted-foreground leading-tight">
        A platform for students to find and share research papers.
      </p> */}
    </div>
  );
}
