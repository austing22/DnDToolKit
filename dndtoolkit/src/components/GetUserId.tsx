// app/components/GetUserId.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Link from "next/link";

type Props = {
  children: (userId: string) => React.ReactNode;
};

export default async function GetUserId({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return (
      <h1 className="text-2xl font-bold mb-4">
        Please{" "}
        <Link href="/login" className="text-blue-600 underline hover:text-blue-800">
          log in
        </Link>{" "}
        to continue.
      </h1>
    );
  }


  return <>{children(session.user.id)}</>;
}
