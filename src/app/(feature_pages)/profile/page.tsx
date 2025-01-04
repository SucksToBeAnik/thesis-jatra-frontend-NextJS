import { getCurrentProfile } from "@/db-actions/auth";
import { createClient } from "@/utils/supabase/server";
import EmptyContent from "@/components/global/EmptyContent";
import ProfileUpdateForm from "@/components/profile/ProfileUpdateForm";

export default async function ProfilePage() {
  const db = createClient();
  const profileQueryResult = await getCurrentProfile(db);
  if (!profileQueryResult.success) {
    return (
      <EmptyContent
        message={"No profile has been found to display the content"}
      />
    );
  }
  return (
    <div className="p-7 w-full">
      <h1 className="text-3xl font-bold mb-8">
        Maybe change things a little,{" "}
        <span className="bg-gradient-to-r from-gray-300 to-gray-500 bg-clip-text text-transparent">
          {profileQueryResult.data.fullname}
        </span>
        ?
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1">
          <ProfileUpdateForm profile={profileQueryResult.data} />
        </div>
        <div className="col-span-1">
          {/* <ProfileUpdateForm profile={profileQueryResult.data} /> */}
        </div>
      </div>
    </div>
  );
}
