import pandas as pd
import json

excel_file = "courses.xlsx"
output_file = "courses.json"

# Read all sheets
all_sheets = pd.read_excel(
    excel_file,
    sheet_name=None,
    dtype=str   # read everything as string
)

courses = []

for sheet_name, df in all_sheets.items():
    # Replace NaN with empty string
    df = df.fillna("")

    # Convert rows to dict
    for _, row in df.iterrows():
        row_dict = row.to_dict()
        courses.append(row_dict)

final_json = {
    "courses": courses
}

# Write JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(final_json, f, indent=4, ensure_ascii=False)

print("Excel converted to JSON with empty cells as empty strings!")
