import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase with service role key to perform administrative actions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Helper to verify if the requester is an authorized admin
async function verifyAdmin(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return { authorized: false, error: "Missing authorization token" };
    }

    const token = authHeader.split(" ")[1];
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return { authorized: false, error: authError?.message || "Invalid token" };
    }

    // Special bypass for the primary owner
    if (user.email === "manhanh0210@gmail.com") {
      return { authorized: true, user };
    }

    // Check role in profiles table
    const { data: profile, error: dbError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (dbError || !profile || profile.role !== "admin") {
      return { authorized: false, error: "Access denied: Admin role required" };
    }

    return { authorized: true, user };
  } catch (err: any) {
    return { authorized: false, error: err.message || "Authentication error" };
  }
}

// CREATE MEMBER
export async function POST(req: Request) {
  try {
    const { authorized, error: authErr } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json({ error: authErr }, { status: 403 });
    }

    const { email, password, fullName, role, permissions } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Create user in Supabase auth using admin API (auto confirms email to prevent logout issue)
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        role: role,
        permissions: permissions
      }
    });

    if (createError || !authData.user) {
      return NextResponse.json({ error: createError?.message || "Failed to create user" }, { status: 400 });
    }

    // Note: The database trigger (on_auth_user_created) will automatically handle inserting
    // the profile record into public.profiles using the metadata. But to ensure permissions are 
    // exactly as configured, we can also perform an upsert here.
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({
        id: authData.user.id,
        email,
        full_name: fullName,
        role,
        permissions
      });

    if (profileError) {
      console.error("Warning: Profile upsert after user creation failed:", profileError);
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: authData.user.id,
        email: authData.user.email,
        full_name: fullName,
        role
      } 
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// UPDATE MEMBER
export async function PUT(req: Request) {
  try {
    const { authorized, error: authErr } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json({ error: authErr }, { status: 403 });
    }

    const { id, email, password, fullName, role, permissions } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "User ID is required for update" }, { status: 400 });
    }

    // 1. Update Auth User if email or password are changing
    const updateParams: any = {
      user_metadata: {
        full_name: fullName,
        role: role,
        permissions: permissions
      }
    };
    if (email) updateParams.email = email;
    if (password) updateParams.password = password;

    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(
      id,
      updateParams
    );

    if (authUpdateError) {
      return NextResponse.json({ error: authUpdateError.message }, { status: 400 });
    }

    // 2. Update profiles table record directly
    const updateData: any = {
      full_name: fullName,
      role: role,
      permissions: permissions,
      updated_at: new Date().toISOString()
    };
    if (email) updateData.email = email;

    const { error: dbError } = await supabaseAdmin
      .from("profiles")
      .update(updateData)
      .eq("id", id);

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}

// DELETE MEMBER
export async function DELETE(req: Request) {
  try {
    const { authorized, error: authErr } = await verifyAdmin(req);
    if (!authorized) {
      return NextResponse.json({ error: authErr }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required for deletion" }, { status: 400 });
    }

    // Prevent deleting the primary admin account
    const { data: userProfile } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .eq("id", userId)
      .single();

    if (userProfile?.email === "manhanh0210@gmail.com") {
      return NextResponse.json({ error: "Cannot delete the primary owner account" }, { status: 400 });
    }

    // Delete user from Auth (this will cascade delete from profiles table too)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
