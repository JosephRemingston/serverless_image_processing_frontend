const BASE_URL = "http://3.0.90.203/api";

export async function generateSignedUrl(token) {
  const res = await fetch(`${BASE_URL}/media/generate-signed-url`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to generate signed URL");
  }

  const signedUrl = data?.data?.signedUrl;  // ✅ Correct key
  const key = data?.data?.fileName;          // ✅ Correct key

  if (!signedUrl || !key) {
    console.error("Unexpected API response:", data);
    throw new Error("Server returned an invalid signed URL response");
  }

  return { signedUrl, key };
}

export async function uploadToS3(signedUrl, file) {
  const res = await fetch(signedUrl, {
    method: "PUT",
    headers: { "Content-Type": "image/png" },
    body: file,
  });

  if (!res.ok) throw new Error("Failed to upload image to S3");
}
