"use client";

import { UploadButton } from "@/utils/uploadthing";

export default function UploadImage({
  userId,
}: {
  userId: string | undefined;
}) {
  async function saveFileUrlToDB(fres: any) {
    const fileUrl = fres[0].url;
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, fileUrl, fileName: fres[0].name }),
      });

      if (!res.ok) {
        throw new Error("Failed to save file URL");
      }

      const data = await res.json();
      console.log("File saved in DB: ", data);
    } catch (error) {
      console.error("Error saving file to DB: ", error);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <UploadButton
        className="text-5xl space-y-3 font-semibold"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res.length > 0) {
            const fileUrl = res[0].url; // Extract the presigned URL from the response
            console.log("Uploaded file URL: ", fileUrl);

            // Call saveFileUrlToDB to save the URL in the database
            saveFileUrlToDB(res);
            alert("Upload Completed and URL saved in DB");
          }
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </main>
  );
}
