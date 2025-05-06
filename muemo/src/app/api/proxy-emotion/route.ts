// import { NextResponse } from "next/server";
// import FormData from "form-data";

// export const config = {
//     api: {
//         bodyParser: false, // Disable body parser for handling FormData manually
//     },
// };

// export async function POST(req: Request) {
//     try {
//         const formData = await req.formData();
//         const imageBlob = formData.get("image");

//         // Check if the image exists in the form data
//         if (!imageBlob || !(imageBlob instanceof Blob)) {
//             console.log("No image found in formData");
//             return NextResponse.json({ error: "No image provided" }, { status: 400 });
//         }

//         console.log("Received image in formData:", imageBlob);

//         const arrayBuffer = await imageBlob.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         const serverFormData = new FormData();
//         serverFormData.append("image", buffer, "image.jpg");

//         // Log the content being sent to the Flask backend
//         console.log("Sending formData to Flask backend:", serverFormData);

//         const externalResponse = await fetch("http://127.0.0.1:8080/api/detect_emotion", {
//             method: "POST",
//             headers: serverFormData.getHeaders(),
//             body: serverFormData as any,
//         });

//         const contentType = externalResponse.headers.get("content-type");
//         if (contentType && contentType.includes("application/json")) {
//             const data = await externalResponse.json();
//             return NextResponse.json(data, { status: externalResponse.status });
//         } else {
//             const errorText = await externalResponse.text();
//             return NextResponse.json({ error: "Unexpected response from backend", details: errorText }, { status: 500 });
//         }
//     } catch (error) {
//         console.error("Proxy error:", error);
//         return NextResponse.json({ error: "Proxy failed" }, { status: 500 });
//     }
// }
