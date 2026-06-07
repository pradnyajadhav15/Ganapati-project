import { supabaseAdmin } from "@/lib/supabase-admin";

export type TeamMember = {
  id: string;
  name: string;
  role: string | null;
  sort_order: number;
};

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data } = await supabaseAdmin
    .from("team_members")
    .select("id,name,role,sort_order")
    .eq("visible", true)
    .order("sort_order", { ascending: true });
  return (data ?? []) as TeamMember[];
}
