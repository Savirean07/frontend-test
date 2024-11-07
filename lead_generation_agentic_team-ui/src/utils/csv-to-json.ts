import csvtojson from "csvtojson";

const csvToJson = async (csv?: string) => {
  if (typeof csv !== "string") {
    return [];
  }
  const data = await csvtojson().fromString(csv);
  return data;
};

const jsonToCsv = (json: any) => {
  const headers = Object.keys(json[0]);
  const csv = [headers.join(",")];
  json.forEach((row: any) => {
    csv.push(
      headers
        .map((header) => {
          if (typeof row[header] === "string") {
            return row[header].replace(/,/g, "-");
          }
          return row[header];
        })
        .join(",")
    );
  });
  return csv.join("\n");
};

export { csvToJson, jsonToCsv };
