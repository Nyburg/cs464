import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const dataDir = path.join(process.cwd(), "sample_data");
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter((file) => file.endsWith(".json"));

    const allData = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = path.join(dataDir, file);
        const contents = await fs.readFile(filePath, "utf8");

        try {
          const parsed = JSON.parse(contents);
          return { fileName: file, data: parsed };
        } catch {
          return { fileName: file, error: "Invalid JSON" };
        }
      })
    );

    return Response.json({
      count: allData.length,
      data: allData,
    });
  } catch (error) {
    console.error("Failed to fetch JSON data:", error);
    return Response.json(
      { error: "Failed to fetch JSON data" },
      { status: 500 }
    );
  }
}