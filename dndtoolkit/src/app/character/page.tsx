import GetUserId from "@/components/GetUserId";
import CharacterPage from "./CharacterPage";

export default function Page() {
  return (
    <GetUserId>
      {(userId) => <CharacterPage userId={userId} />}
    </GetUserId>
  );
}
