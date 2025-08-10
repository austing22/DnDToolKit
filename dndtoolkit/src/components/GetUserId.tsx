// app/components/GetUserId.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

type Props = {
  children: (userId: string) => React.ReactNode;
};

export default async function GetUserId({ children }: Props) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return <p>Please log in to continue.</p>;
  }

  return <>{children(session.user.id)}</>;
}
