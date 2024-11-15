"use client"

import { UploadButton } from "@/utils/uploadthing";

export default function DocUpload({ patientId }: { patientId: string | undefined }) {
    async function issuetopatient(fileUrl: any) {
        const res = await fetch('/api/prescription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ patientId, fileUrl }),
        })
    }
    return (
        <div>
            <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    if (res && res.length > 0) {
                        const fileUrl = res[0].url;

                        issuetopatient(fileUrl);
                    }

                }}
                onUploadError={(error: Error) => {
                    alert(error);
                }}
            />

        </div>
    )
}