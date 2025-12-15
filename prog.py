import pandas as pd
import json

excel_file = "courses.xlsx"
output_file = "courses.json"

def clean_value(value):
    if isinstance(value, str):
        value = value.replace("\n", " ").replace("\t", " ")
        value = value.rstrip()   # remove trailing spaces
        # use .strip() instead if you want to remove leading spaces too
    return value

# Read all sheets
all_sheets = pd.read_excel(
    excel_file,
    sheet_name=None,
    dtype=str
)

courses = []

for sheet_name, df in all_sheets.items():
    # Replace NaN with empty string
    df = df.fillna("")

    # Clean all cells
    df = df.applymap(clean_value)

    # Convert rows to dict
    for _, row in df.iterrows():
        courses.append(row.to_dict())

final_json = {
    "courses": courses
}

# Write JSON
with open(output_file, "w", encoding="utf-8") as f:
    json.dump(final_json, f, indent=4, ensure_ascii=False)

print("Excel converted to JSON with cleaned strings!")
