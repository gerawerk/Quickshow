import { clerkClient } from "@clerk/express";
export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);
    console.log("🧾 Authenticated user:", user.emailAddresses?.[0]?.emailAddress);
    console.log("🛡️ User role:", user.privateMetadata.role);

    if (user?.privateMetadata?.role !== 'admin') {
      return res.status(403).json({ success: false, message: "not authorized" });
    }

    console.log("✅ Passed admin check");
    next();
  } catch (error) {
    console.error("❌ Error in protectAdmin middleware", error);
    return res.status(500).json({ success: false, message: "internal error" });
  }
};
